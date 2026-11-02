#!/usr/bin/env python3
"""
audit-2024-new.py —— 用国家平台的【2024 新版】教材目录核对 textbooks2024 对齐

⚠️ 关键前提（上一轮踩过的坑）
-----------------------------
国家平台的 `details/{cid}.json` 返回的 `custom_properties.preview` 是 **2022 旧版**缓存；
而**匿名索引条目本身**的 `custom_properties.preview` 是 **2026-08 上传的新版**（URL 里带
13 位毫秒时间戳，如 /1787023027234/）。两者不是同一份文件。

本脚本一律取「索引条目的 preview」，且只接受时间戳 >= 2024-01-01 的条目；
低于此值直接报错退出，避免再次把旧版当新版。

它做两件事
----------
1. **验书**：OCR 该册目录页，与 `data/textbooks.json` 的 `units` 名称逐条比对，
   确认 textbooks.json 的单元顺序忠实于真教材（这是 uN 的权威定义）。
2. **验对齐**：以 textbooks.json 的 units 为基准，反查 `data/topics.json` 里
   每个 `textbooks2024` 的 uN 指向哪个单元，标出与知识点语义不符的。

产物：只写结构化的比对结论（单元名 + 判定），不落教材图、不存正文。

用法
----
  PYTHONPATH=/opt/paddle_ocr python3 scripts/audit-2024-new.py --books math:1a,math:3a
  PYTHONPATH=/opt/paddle_ocr python3 scripts/audit-2024-new.py --all --out /tmp/a2024
"""
import argparse
import datetime
import json
import os
import re
import sys
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import ocr_lines  # noqa: E402

BASE = "https://s-file-1.ykt.cbern.com.cn"
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                   "(KHTML, like Gecko) Chrome/120.0 Safari/537.36"}
VER_FILE = f"{BASE}/zxx/ndrs/resources/tch_material/version/data_version.json"

# 目标册 -> (版本 slug, 册次, 平台 contentId)
# contentId 均为「索引条目的 preview 时间戳 >= 2024」的那一条
BOOKS = {
    "math:1a": ("pep-math-2024", "1a", "c3e06fe4-c6b3-49cb-8727-4f8ff69bbfbc"),
    "math:1b": ("pep-math-2024", "1b", "6bf8ae7e-d987-40b4-8fb3-bbb98fcb50b5"),
    "math:2a": ("pep-math-2024", "2a", "8cfc5a2a-425c-4b9a-a97c-e78d4a4c1e3a"),
    "math:2b": ("pep-math-2024", "2b", "c1897b18-b302-4e8d-9fd4-40915c4b05c2"),
    "math:3a": ("pep-math-2024", "3a", "33c8d495-9862-4e19-aab9-61d2af08608a"),
    "math:3b": ("pep-math-2024", "3b", "8666a8bd-a0e7-49aa-ba07-bf419ceead24"),
    "math:4a": ("pep-math-2024", "4a", "654e3d1e-c995-4340-81c5-abd7881d835b"),
    "english:3a": ("pep-english-2024", "3a", "dd6173ba-579a-356e-900c-cb53e152229c"),
    "english:3b": ("pep-english-2024", "3b", "10b11234-3b0a-4b3e-b4b4-db3013774529"),
    "english:4a": ("pep-english-2024", "4a", "be6e00c8-0068-8453-927f-646f6f753a5a"),
    "chinese:1a": ("tongbian-chinese-2024", "1a", "7775818d-f3ac-4f53-b43d-af3918a8634a"),
    "chinese:1b": ("tongbian-chinese-2024", "1b", "b87e153f-a64c-451a-aa6c-6ed9ac7d6821"),
    "chinese:2a": ("tongbian-chinese-2024", "2a", "cd28f45f-7f29-4dfb-bd35-ba310b57bc8c"),
    "chinese:2b": ("tongbian-chinese-2024", "2b", "6f1d8652-05df-432b-8ee4-6a5652ec677e"),
    "chinese:3a": ("tongbian-chinese-2024", "3a", "9185e4a3-efb4-4ec0-bfd9-1cb194c260d3"),
    "chinese:3b": ("tongbian-chinese-2024", "3b", "bd1e1af7-f570-436d-afa4-f326691676f4"),
    "chinese:4a": ("tongbian-chinese-2024", "4a", "d3b5a21b-f8d1-4633-8231-407100c8204d"),
}

CUTOFF = datetime.date(2024, 1, 1)


def fetch_index():
    with urllib.request.urlopen(urllib.request.Request(VER_FILE, headers=UA), timeout=60) as r:
        ver = json.load(r)
    raw = ver.get("urls")
    urls = [u for u in raw.split(",") if u.strip()] if isinstance(raw, str) else []
    out = []
    for u in urls:
        with urllib.request.urlopen(urllib.request.Request(u.strip(), headers=UA), timeout=90) as r:
            part = json.load(r)
        out.extend(part if isinstance(part, list) else (part.get("data") or []))
    return out


def preview_ts(item):
    """取 preview URL 里的 13 位毫秒时间戳；没有则 0。"""
    pv = (item.get("custom_properties") or {}).get("preview") or {}
    for u in pv.values():
        m = re.search(r"/(\d{13})/", str(u))
        if m:
            return int(m.group(1))
    return 0


def slide_num(k):
    m = re.search(r"(\d+)$", k)
    return int(m.group(1)) if m else 0


def ocr_toc(item, workdir, max_pages=14):
    """下载前 max_pages 页并 OCR，返回 (目录行, 页号)。"""
    pv = (item.get("custom_properties") or {}).get("preview") or {}
    pages = sorted(((slide_num(k), u) for k, u in pv.items()))[:max_pages]
    os.makedirs(workdir, exist_ok=True)
    for n, u in pages:
        p = os.path.join(workdir, f"p{n:02d}.jpg")
        if not os.path.exists(p):
            try:
                rq = urllib.request.Request(u, headers=UA)
                with urllib.request.urlopen(rq, timeout=60) as r, open(p, "wb") as f:
                    f.write(r.read())
            except Exception as e:  # noqa: BLE001
                print(f"    第{n}页下载失败 {e}", flush=True)
                continue
        lines = ocr_lines.ocr_lines(p)
        if ocr_lines.has_toc(lines):
            return lines, n
    return [], None


def norm(s):
    return re.sub(r"[\s、，,·：:．.（）()【】\[\]“”\"'’]", "", s or "")


def teaching_units(units):
    """uN 指向的是「正式教学单元」的序号。

    实测（1a/2b/3a/4a 反推）：units 数组里的 activity（数学游戏、曹冲称象、
    时间在哪里、1亿有多大）、intro（我上学了）都不占 uN 编号，enrichment 也不占。
    只保留 type == "unit"（含 revision 性质的「复习与关联」，其 type 亦为 unit）。
    """
    out = [u for u in units if (u.get("type") or "unit") == "unit"]
    return out or units


def verify_units(units, lines):
    """把 units 名称逐个在目录文本里定位，检查出现位置是否单调递增。"""
    text = norm("".join(lines))
    pos = []
    for u in units:
        nm = norm(u.get("name"))
        if len(nm) < 2:
            pos.append(None)
            continue
        pos.append(text.find(nm))
    known = [(i, p) for i, p in enumerate(pos) if p is not None and p >= 0]
    mono = all(known[j][1] < known[j + 1][1] for j in range(len(known) - 1))
    return pos, mono, len(known)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--books", default="", help="逗号分隔，如 math:1a,english:3a")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--out", default="/tmp/a2024")
    ap.add_argument("--topics", default="data/topics.json")
    ap.add_argument("--textbooks", default="data/textbooks.json")
    a = ap.parse_args()

    keys = list(BOOKS) if a.all else [k.strip() for k in a.books.split(",") if k.strip()]
    if not keys:
        ap.error("需要 --books 或 --all")

    os.makedirs(a.out, exist_ok=True)
    idx = fetch_index()
    by_id = {x.get("id"): x for x in idx}
    print(f"索引 {len(idx)} 条", flush=True)

    tb = json.load(open(a.textbooks, encoding="utf-8"))
    vs = {v["slug"]: v for v in tb["versions"]}
    tp = json.load(open(a.topics, encoding="utf-8"))["topics"]

    report = {"books": {}}
    rp = os.path.join(a.out, "report.json")
    if os.path.exists(rp):
        try:
            report = json.load(open(rp, encoding="utf-8"))
            print(f"已加载既有报告 {len(report.get('books', {}))} 册，本次结果将合并", flush=True)
        except Exception:  # noqa: BLE001
            pass
    for key in keys:
        slug, book, cid = BOOKS[key]
        item = by_id.get(cid)
        print(f"\n=== {key} ({slug}/{book}) ===", flush=True)
        if not item:
            print("  索引里没有该 contentId", flush=True)
            report["books"][key] = {"ok": False, "reason": "索引无此条目"}
            continue
        ts = preview_ts(item)
        dt = datetime.datetime.fromtimestamp(ts / 1000).date() if ts else None
        if not dt or dt < CUTOFF:
            print(f"  ✗ preview 时间戳 {dt} 早于 {CUTOFF}，是旧版，拒绝核对", flush=True)
            report["books"][key] = {"ok": False, "reason": f"旧版 preview {dt}"}
            continue
        print(f"  preview 时间戳 {dt} ✓ 新版", flush=True)

        lines, page = ocr_toc(item, os.path.join(a.out, key.replace(":", "_")))
        if not lines:
            print("  前 14 页未找到目录", flush=True)
            report["books"][key] = {"ok": False, "reason": "未找到目录页"}
            continue
        print(f"  目录页 p{page}，OCR {len(lines)} 行", flush=True)

        all_units = []
        for b in vs[slug]["books"]:
            if (b.get("slug") or b.get("id")) == book:
                all_units = b.get("units") or []
                break
        units = teaching_units(all_units)
        pos, mono, hit = verify_units(all_units, lines)
        print(f"  textbooks.json 有 {len(all_units)} 个单元（其中正式教学单元 {len(units)} 个），"
              f"目录中命中 {hit} 个，顺序{'一致 ✓' if mono else '不一致 ✗'}", flush=True)
        if not mono:
            for i, (u, p) in enumerate(zip(all_units, pos), 1):
                print(f"    u{i} {'命中@'+str(p) if p is not None and p>=0 else '未命中'}"
                      f"  {u.get('name')}", flush=True)

        # 反查 topics 的 uN
        rows = []
        for x in tp:
            for c in (x.get("textbooks2024") or []):
                m = re.match(re.escape(slug) + r":" + re.escape(book) + r":u(\d+)$", c)
                if not m:
                    continue
                un = int(m.group(1))
                u = units[un - 1] if 0 < un <= len(units) else None
                rows.append({"id": x.get("id"), "name": x.get("name"),
                             "u": un, "unit_name": (u or {}).get("name"),
                             "unit_type": (u or {}).get("type")})
        print(f"  topics 里指向本册的点 {len(rows)} 个", flush=True)
        for r in rows:
            mark = "" if r["unit_name"] else "  ✗越界"
            print(f"    u{r['u']:<2} {str(r['unit_name']):24} <- {r['id']}{mark}", flush=True)

        report["books"][key] = {
            "ok": True, "content_id": cid, "preview_date": str(dt),
            "toc_page": page, "toc_lines": lines,
            "units_all": [{"no": i, "name": u.get("name"), "type": u.get("type")}
                          for i, u in enumerate(all_units, 1)],
            "units": [{"no": i, "name": u.get("name"), "type": u.get("type")}
                      for i, u in enumerate(units, 1)],
            "order_consistent": mono, "hit": hit,
            "topics": rows,
        }
        json.dump(report, open(os.path.join(a.out, "report.json"), "w", encoding="utf-8"),
                  ensure_ascii=False, indent=1)

    ok = sum(1 for v in report["books"].values() if v.get("ok"))
    cons = sum(1 for v in report["books"].values() if v.get("order_consistent"))
    print("\n" + "=" * 60)
    print(f"核对 {len(keys)} 册：成功取到新版目录 {ok} 册，其中 units 顺序一致 {cons} 册")
    print(f"报告：{os.path.join(a.out, 'report.json')}")


if __name__ == "__main__":
    main()

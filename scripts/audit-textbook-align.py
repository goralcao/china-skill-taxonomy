#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
audit_textbook_alignment.py —— 从国家平台提取某册教材目录（并可选比对图谱对齐）

⚠️ 重要局限（2026-11 实测，务必先读）
------------------------------------
国家平台**匿名**索引里的教材详情 `custom_properties.preview`，很多是 **2012 课标旧版**
的扫描页（例：人教版数学四上 contentId=654e3d1e…，create_time=2022-09-29，
preview 目录为「大数的认识 / 角的度量 / 三位数乘两位数…」= 旧版；而 2024 新版人教版四上
真实目录是「万以上数的认识 / 角的度量 / 多位数乘两位数 / 加法模型和乘法模型…」，
已由 sjds.net、ChinaTextBook PDF、51jiaoxi、21cnjy 多源核实）。

因此：**本脚本提取到的是旧版目录，绝不能拿来核对 textbooks2024 的 2024 新版单元号**。
textbooks2024 的新版结构以 data/textbooks.json（源自电子课本网 2026 秋版）为准，
经外部多源核实是正确的。要核 2024 新版，需另找新版教材预览/PDF 源，而非本匿名链路。

本脚本的**可靠用途**：从国家平台抓某册的单元/课节目录文本（旧版），做结构参考；
`find_book` 已在命中 2024 年前创建的旧版时打印醒目警告。

做法（全程匿名，不需要登录 token）
----------------------------------
1. 拉 tch_material 匿名整库索引
2. 按「学科 + 年级 + 上册/下册 + 版本」定位教材，拿到 contentId
3. 详情接口 custom_properties.preview 的 Slide1..N 整页图片（公开可读）
4. 下载前若干页 → OCR 行还原（ocr_lines，RapidOCR/PP-OCRv4）→ 命中「目录」的即目录页
5. 解析「单元序号 + 单元名」，可选与图谱单元号比对（仅当确认版本一致时才有意义）

产物
----
只写出「目录文本」这一事实性索引与比对结论。
不保存教材正文图像、不落地 PDF、不复制任何教材原文。
"""
import argparse
import json
import os
import re
import subprocess
import sys
import time
import urllib.request

BASE = "https://s-file-1.ykt.cbern.com.cn"
UA = {"User-Agent": "Mozilla/5.0"}
INDEX_CACHE = {}


# ---------- 索引 ----------
def fetch_index(max_parts=None):
    """拉 tch_material 匿名整库索引。字段与 find_textbook.py 同源。"""
    if INDEX_CACHE.get("data"):
        return INDEX_CACHE["data"]
    ver_url = f"{BASE}/zxx/ndrs/resources/tch_material/version/data_version.json"
    req = urllib.request.Request(ver_url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        ver = json.load(r)
    # 实测结构：{"module":..., "urls": "https://...part_100.json,https://...part_101.json"}
    raw_urls = ver.get("urls")
    if isinstance(raw_urls, str):
        urls = [u for u in raw_urls.split(",") if u.strip()]
    else:
        parts = ver.get("parts") or ver.get("data") or []
        urls = []
        for p in parts:
            pu = p if isinstance(p, str) else (p.get("url") or p.get("path") or "")
            if not pu:
                continue
            urls.append(pu if pu.startswith("http") else
                        f"{BASE}/zxx/ndrs/resources/tch_material/{pu.lstrip('/')}")
    if max_parts:
        urls = urls[:max_parts]
    items = []
    for pu in urls:
        try:
            with urllib.request.urlopen(urllib.request.Request(pu, headers=UA),
                                        timeout=90) as r:
                chunk = json.load(r)
            if isinstance(chunk, dict):
                chunk = chunk.get("data") or chunk.get("items") or []
            items.extend(chunk)
        except Exception as e:
            print(f"  [索引分片失败] {e}", file=sys.stderr)
    INDEX_CACHE["data"] = items
    return items


def tags_of(item):
    out = []
    for t in (item.get("tag_list") or []):
        if isinstance(t, dict):
            nm = t.get("tag_name") or t.get("name")
            if nm:
                out.append((str(nm), t.get("tag_dimension_id")))
    return out


def title_of(item):
    return ((item.get("global_title") or {}).get("zh-CN")
            or item.get("title") or "")


def version_of(item):
    for nm, dim in tags_of(item):
        if dim == "zxxbb":
            return nm
    return ""


# ---------- 目标册 ----------
SUBJECT_CN = {"math": "数学", "chinese": "语文", "english": "英语",
              "physics": "物理", "chemistry": "化学", "biology": "生物",
              "history": "历史", "geo": "地理", "politics": "道德与法治"}
VERSION_CN = {"pep": "人教版", "tongbian": "统编版", "bnu": "北师大版",
              "sj": "苏教版"}
GRADE_CN = {1: "一年级", 2: "二年级", 3: "三年级", 4: "四年级",
            5: "五年级", 6: "六年级", 7: "七年级", 8: "八年级", 9: "九年级"}


def parse_book(code):
    """pep-math-2024:4a:u3 -> (pep, math, 4, a)"""
    m = re.match(r"^([a-z]+)-([a-z]+)(?:-2024)?[^\s:]*[:：]([0-9]+)([ab])", code)
    if not m:
        return None
    return m.group(1), m.group(2), int(m.group(3)), m.group(4)


def find_book(index, ver, subj, grade, half):
    """在索引里定位一册教材，返回 (item, 命中说明)"""
    want_subj = SUBJECT_CN.get(subj)
    want_ver = VERSION_CN.get(ver)
    if not want_subj:
        return None, f"未知学科 {subj}"
    term = "上册" if half == "a" else "下册"
    want_grade = GRADE_CN.get(grade, "")
    cands = []
    for it in index:
        t = title_of(it)
        if want_subj not in t:
            continue
        if want_grade and want_grade not in t:
            continue
        if term not in t:
            continue
        # 五•四学制是另一套，排除
        if "五•四" in t or "五四" in t:
            continue
        v = version_of(it)
        cands.append((v, it))
    if not cands:
        return None, f"索引里没有 {want_grade}{term}{want_subj}"
    if want_ver:
        exact = [(v, it) for v, it in cands if v == want_ver]
        if exact:
            return exact[0][1], f"版本精确命中 {want_ver}"
        # 前缀匹配：人教版 要能命中 人教版（主编：吴欣），但不能命中 人教大同版
        pref = [(v, it) for v, it in cands if v.startswith(want_ver)]
        if pref:
            return pref[0][1], f"版本前缀命中 {pref[0][0]}"
        return cands[0][1], (f"版本未命中 {want_ver}，回退 {cands[0][0]}"
                             f"（共 {len(cands)} 个版本）")
    return cands[0][1], "未指定版本，取首个"


# ---------- 预览页与 OCR ----------
def detail(cid):
    url = f"{BASE}/zxx/ndrs/resources/tch_material/details/{cid}.json"
    last = None
    for attempt in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA),
                                        timeout=60) as r:
                return json.load(r)
        except Exception as e:
            last = e
            # 匿名接口偶发 403（限流），退避后重试
            if getattr(e, "code", None) == 403 and attempt < 3:
                time.sleep(2 * (attempt + 1))
                continue
            raise
    raise last


def preview_pages(d, limit):
    pv = (d.get("custom_properties") or {}).get("preview") or {}
    out = []
    for k, v in pv.items():
        m = re.match(r"^Slide(\d+)$", k)
        if m:
            out.append((int(m.group(1)), v))
    out.sort()
    return out[:limit]


def ocr_page_lines(path):
    """交给 ocr_lines（PaddleOCR 优先，tesseract 兜底）做「按视觉行还原」。

    目录页是「序号 + 书名 + 点线 + 页码」的版面，逐行还原后才能保住序号。
    """
    import ocr_lines
    return ocr_lines.ocr_lines(path)


def has_toc(lines):
    import ocr_lines
    return ocr_lines.has_toc(lines)


def toc_ratio(lines):
    """整页里「单元条目」行占比。目录页接近 1.0，正文页很低。"""
    real = [l for l in lines if (l or "").strip()]
    if not real:
        return 0.0
    return len(parse_toc(lines)) / len(real)


# ---------- 目录解析 ----------
# 中文单元行：形如「1 大数的认识 2」「1亿有多大 33」「6 除数是两位数的除法 71」
# 名称必须以中文开头，避免把纯数字页码行误当单元
LINE_RE = re.compile(
    r"^\s*(\d{1,2})\s*[.、．]?\s*"
    r"([\u4e00-\u9fa5][\u4e00-\u9fa5A-Za-z0-9（）()·\-—、\s]{0,28}?)"
    r"\s*(\d{1,3})?\s*$")

# 英语单元行：形如「Unit 1 Hello! 2」「Unit 2 Colours 8」
# 名称允许拉丁字母 + 可能的双语中文（如「Unit 1 Hello! 你好！」）
LINE_RE_EN = re.compile(
    r"^\s*[Uu]nit\s+(\d{1,2})\s*[:：.\-]?\s*"
    r"([A-Za-z0-9\u4e00-\u9fa5][A-Za-z0-9\u4e00-\u9fa5\s'!?.,\-]{0,40}?)"
    r"\s*(\d{1,3})?\s*$")

# 无前置编号的「名称 + 页码」行：形如「我上学了 2」「识字」「天地人」
# 语文目录大量采用这种版面，no 记为 None，仅用于展示，不参与编号比对
LINE_RE_NONUM = re.compile(
    r"^\s*([\u4e00-\u9fa5][\u4e00-\u9fa5A-Za-z0-9（）()·\-—、\s]{1,24}?)"
    r"\s*(\d{1,3})\s*$")

SKIP_WORDS = ("目录", "识字表", "写字表", "词语表", "标*", "附录", "后记",
              "contents", "Contents", "CONTENTS")


def parse_toc(lines):
    """从目录页行里抽单元条目。返回候选列表，允许少量噪声。

    支持三种版面：
      · 前置编号   「1 大数的认识 2」（数学 / 部分语文）
      · 英语单元   「Unit 1 Hello! 2」
      · 无编号名称 「我上学了 2」「识字」（语文常见，no=None 仅展示）
    """
    units = []
    seen = set()
    for ln in lines:
        ln = (ln or "").strip()
        if not ln or len(ln) < 2:
            continue
        if any(w in ln for w in SKIP_WORDS):
            continue
        m = LINE_RE.match(ln) or LINE_RE_EN.match(ln)
        if m:
            idx = int(m.group(1))
            name = re.sub(r"\s+", "", m.group(2))
            name = re.sub(r"[.．。•·]{2,}", "", name)
            if len(name) < 2 or name in seen:
                continue
            seen.add(name)
            units.append({"no": idx, "name": name,
                          "page": m.group(3), "raw": ln})
            continue
        # 无编号条目：仅当末位是页码、且名称以中文开头时才收（降低误收）
        mn = LINE_RE_NONUM.match(ln)
        if mn:
            name = re.sub(r"\s+", "", mn.group(1))
            if len(name) < 2 or name in seen:
                continue
            seen.add(name)
            units.append({"no": None, "name": name,
                          "page": mn.group(2), "raw": ln})
    return units


# ---------- 主流程 ----------
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--topics", default="data/topics.json")
    ap.add_argument("--out", default="/tmp/toc-audit")
    ap.add_argument("--books", nargs="*", help="只核这几册，如 pep-math-2024:4a")
    ap.add_argument("--pages", type=int, default=10, help="每册取前 N 页预览")
    ap.add_argument("--limit-books", type=int, default=None)
    a = ap.parse_args()

    os.makedirs(a.out, exist_ok=True)
    topics = json.load(open(a.topics, encoding="utf-8"))
    topics = topics if isinstance(topics, list) else topics.get("topics", [])

    # 收集目标册 -> 该册下图谱写的 (知识点, 单元号)
    book_map = {}
    for x in topics:
        for code in (x.get("textbooks2024") or []):
            p = parse_book(code)
            if not p:
                continue
            bkey = f"{p[0]}-{p[1]}:{p[2]}{p[3]}"
            mu = re.search(r"[:：]u(\d+)", code)
            book_map.setdefault(bkey, []).append({
                "id": x["id"], "name": x.get("name"),
                "unit": int(mu.group(1)) if mu else None,
                "code": code,
            })
    if a.books:
        want = set(a.books)
        book_map = {k: v for k, v in book_map.items() if k in want}

    keys = sorted(book_map)
    if a.limit_books:
        keys = keys[:a.limit_books]

    print(f"待核 {len(keys)} 册：")
    for k in keys:
        print(f"  {k:22} {len(book_map[k])} 个点")
    print()

    print("[索引] 拉取匿名整库索引…", flush=True)
    index = fetch_index()
    print(f"[索引] {len(index)} 条\n", flush=True)

    report = {"generated": time.strftime("%Y-%m-%d %H:%M:%S"),
              "books": {}, "source": "国家中小学智慧教育平台 教材预览页 OCR"}

    for bkey in keys:
        rows = book_map[bkey]
        time.sleep(0.6)  # 礼貌间隔，降低匿名接口限流 403 概率
        m = re.match(r"^([a-z]+)-([a-z]+)[:：]([0-9]+)([ab])$", bkey)
        ver, subj, grade, half = m.group(1), m.group(2), int(m.group(3)), m.group(4)
        print(f"=== {bkey} ===", flush=True)
        item, why = find_book(index, ver, subj, grade, half)
        if not item:
            print(f"  跳过：{why}\n", flush=True)
            report["books"][bkey] = {"ok": False, "reason": why}
            continue
        cid = item.get("id")
        print(f"  命中：{title_of(item)[:60]}")
        print(f"  版本：{version_of(item)}  ID：{cid}  （{why}）", flush=True)
        # 旧版告警：create_time 早于 2024 的多为 2012 课标旧版预览，不能核 2024 新版
        ct = str(item.get("create_time") or "")
        yr = ct[:4]
        if yr.isdigit() and int(yr) < 2024:
            print(f"  ⚠️ 警告：该册 create_time={yr}，疑为旧版（非 2024 课标修订版），"
                  f"其目录不能用于核对 textbooks2024！", flush=True)

        wd = os.path.join(a.out, bkey.replace(":", "_"))
        os.makedirs(wd, exist_ok=True)
        try:
            d = detail(cid)
            pages = preview_pages(d, a.pages)
        except Exception as e:
            print(f"  详情失败：{e}\n", flush=True)
            report["books"][bkey] = {"ok": False, "reason": str(e)}
            continue

        # 目录常常跨多页（语文尤为碎片化）。命中目录页后，把后续「目录行占比够高」
        # 的页一并并入；一旦遇到正文页（占比骤降）立即停。阈值放宽到 0.35，
        # 以尽量多抓语文那种「名称+页码」交杂的目录。
        toc_lines = []
        toc_pages = []
        for n, u in pages:
            p = os.path.join(wd, f"p{n:02d}.jpg")
            if not os.path.exists(p):
                try:
                    urllib.request.urlretrieve(u, p)
                except Exception as e:
                    print(f"  第{n}页下载失败 {e}", flush=True)
                    continue
            lines = ocr_page_lines(p)
            if not toc_lines:
                # 命中「目录」标题，或整页几乎全是单元条目（标题识别丢失的兜底）
                if has_toc(lines) or (len(parse_toc(lines)) >= 4
                                      and toc_ratio(lines) >= 0.7):
                    toc_lines.extend(lines)
                    toc_pages.append(n)
            else:
                if toc_ratio(lines) >= 0.35 or has_toc(lines) \
                        or len(parse_toc(lines)) >= 2:
                    toc_lines.extend(lines)
                    toc_pages.append(n)
                else:
                    break
        if not toc_lines:
            print(f"  前 {a.pages} 页未找到目录页\n", flush=True)
            report["books"][bkey] = {"ok": False, "reason": "未找到目录页",
                                     "content_id": cid}
            json.dump(report, open(os.path.join(a.out, "report.json"), "w",
                                   encoding="utf-8"), ensure_ascii=False, indent=1)
            continue

        units = parse_toc(toc_lines)
        print(f"  目录页：第 {'/'.join(str(x) for x in toc_pages)} 页，"
              f"解析出 {len(units)} 个单元候选", flush=True)
        for u in units[:16]:
            print(f"      {str(u['no'] or '?'):>2}  {u['name']}")

        # 比对：图谱写的单元号 vs OCR 目录里同名的单元号
        by_name = {}
        for u in units:
            by_name.setdefault(u["name"], []).append(u["no"])
        checks = []
        for r in rows:
            nm = r["name"] or ""
            hit_no = None
            name_hit = None
            for un, nos in by_name.items():
                if nm and (nm in un or un in nm):
                    name_hit = un
                    # 优先取一个带编号的条目；整页无编号则记 None
                    hit_no = next((x for x in nos if x is not None), None)
                    break
            checked = hit_no is not None
            checks.append({"id": r["id"], "name": nm,
                           "ours": r["unit"], "textbook": hit_no,
                           "match": (checked and hit_no == r["unit"]),
                           "checked": checked,
                           "name_in_toc": name_hit is not None})
        bad = [c for c in checks if c["checked"] and not c["match"]]
        unknown = [c for c in checks if not c["checked"]]
        # 名称命中了目录、但该书目条目没有单元号（语文常见）——不算错，仅标注
        nameonly = [c for c in unknown if c.get("name_in_toc")]
        print(f"  比对：{len(checks)} 个点，能核对编号 {len(checks)-len(unknown)} 个，"
              f"不符 {len(bad)} 个；另有 {len(nameonly)} 个名称在目录中但无单元号",
              flush=True)
        for c in bad:
            print(f"      x {c['id']:26} 我们 u{c['ours']} / 教材 u{c['textbook']}  {c['name']}")
        for c in nameonly:
            print(f"      ~ {c['id']:26} 目录含该名但无单元号，无法核编号")
        for c in unknown:
            if c in nameonly:
                continue
            print(f"      ? {c['id']:26} 目录里没匹配到 {c['name']}")
        print(flush=True)

        report["books"][bkey] = {
            "ok": True, "content_id": cid, "title": title_of(item),
            "version": version_of(item), "toc_pages": toc_pages,
            "units": units, "checks": checks,
            "mismatch": len(bad), "unmatched": len(unknown),
            "name_in_toc_no_number": len(nameonly),
        }
        json.dump(report, open(os.path.join(a.out, "report.json"), "w",
                               encoding="utf-8"), ensure_ascii=False, indent=1)

    tot_bad = sum(v.get("mismatch", 0) for v in report["books"].values() if v.get("ok"))
    tot_ck = sum(len(v.get("checks", [])) - v.get("unmatched", 0)
                 for v in report["books"].values() if v.get("ok"))
    print("=" * 60)
    print(f"核完 {len(keys)} 册：可核对编号 {tot_ck} 个点，不符 {tot_bad} 个")
    print(f"报告：{os.path.join(a.out, 'report.json')}")
    json.dump(report, open(os.path.join(a.out, "report.json"), "w",
                           encoding="utf-8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()

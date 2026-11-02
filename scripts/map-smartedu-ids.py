#!/usr/bin/env python3
"""把 data/textbooks.json 里的每册教材，映射到国家中小学智慧教育平台的 contentId。

为什么需要
----------
图谱里每个知识点都挂着教材引用（如 pep-math-2024:4a:u3）。原先前端点「智慧教育平台」
只会跳到 basic.smartedu.cn 首页，用户还得自己找书。平台支持按 contentId 直达教材页：

    https://basic.smartedu.cn/tchMaterial/detail?contentType=assets_document
        &contentId=<uuid>&catalogType=tchMaterial&subCatalog=tchMaterial

（平台不支持用 URL 定位到单元，只能到书；书内目录仍需用户点一下。）

做法
----
1. 取匿名整库索引（3565 条），每条 tag_list 形如
   [电子教材, 教材, 人教版, 上册, 四年级, 小学, 数学]
2. 用「学科 + 年级 + 册次 + 版本 + 学段」五元组精确匹配
3. 命中多条时按 update_time 取最新；命中 0 条则留空，前端退化为教材库首页

输出
----
data/smartedu-map.json : {"pep-math-2024:4a": {"contentId": "...", "title": "...", "updated": "..."} , ...}

用法
----
  PYTHONPATH=/opt/paddle_ocr python3 scripts/map-smartedu-ids.py
  PYTHONPATH=/opt/paddle_ocr python3 scripts/map-smartedu-ids.py --report   # 打印逐册明细
"""
from __future__ import annotations

import argparse
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)

CN = {1: "一", 2: "二", 3: "三", 4: "四", 5: "五", 6: "六",
      7: "七", 8: "八", 9: "九", 10: "十", 11: "十一", 12: "十二"}

# textbooks.json 的版本 slug -> 平台版本标签前缀
# 注意平台标签可能带主编后缀，如「人教版（主编：吴欣）」，故按前缀匹配
VERSION_MAP = {
    "pep-math":                "人教版",
    "tongbian-chinese":        "统编版",
    "pep-english":             "人教版",
    "pep-physics":             "人教版",
    "pep-chemistry":           "人教版",
    "tongbian-history":        "统编版",
    "pep-geography":           "人教版",
    "bnu-math":                "北师大版",
    "sj-math":                 "苏教版",
    "fltrp-english":           "外研社版",
    "jkb-science":             "教科版",
    "tb-morality":             "统编版",
    "pep-biology":             "人教版",
    "pep-physics-senior":      "人教版",
    "pep-chemistry-senior":    "人教版",
    "pep-biology-senior":      "人教版",
    "pep-history-senior":      "人教版",
    "pep-geography-senior":    "人教版",
    "pep-politics-senior":     "统编版",
    "pep-tech-senior":         "人教版",
    "tongbian-chinese-senior": "统编版",
    "pep-math-senior":         "人教",
    "pep-english-senior":      "人教版",
    "pep-math-2024":           "人教版",
    "tongbian-chinese-2024":   "统编版",
    "pep-english-2024":        "人教版",
}


def stage_of(grade: int) -> str:
    """1-6 小学，7-9 初中，10-12 高中。"""
    if grade <= 6:
        return "小学"
    if grade <= 9:
        return "初中"
    return "高中"


# textbooks.json 的 subject -> 平台学科标签（多数同名，少数要改）
SUBJECT_ALIAS = {
    "生物": "生物学",
    "技术": "信息技术",
}

# 同一版本标签下常有多套并行教材（人教版英语分「吴欣=PEP」「苗兴伟=精通」；
# 外研社分孙有中/刘兆义/张祖春；统编版还混着「五•四学制」）。
# 只做能确定唯一答案的映射，其余留空——把用户带去错的书比不带更糟。
VERSION_INCLUDE = {
    "pep-english":      ("吴欣",),      # PEP 英语主编吴欣
    "pep-english-2024": ("吴欣",),
}
# 这些版本的候选无法唯一确定，全部跳过
VERSION_SKIP = {"fltrp-english"}

# 标题/标签里出现这些词就不是我们要的普通教材
TITLE_EXCLUDE = ("五•四学制", "五·四学制", "五.四学制", "特殊教育",
                 "培智", "盲校", "聋校")


def load_index():
    import importlib.util
    spec = importlib.util.spec_from_file_location(
        "audit", os.path.join(HERE, "audit-textbook-align.py"))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.fetch_index()


def tagset(item):
    return {t.get("tag_name") for t in (item.get("tag_list") or []) if t.get("tag_name")}


def build(index, textbooks):
    by_tags = []
    for it in index:
        tags = tagset(it)
        # 新条目（2024/2026 年度）常常只挂「电子教材」、没有「教材」标签，
        # 所以不能要求「教材」，只要求是电子教材且确实是书（有学科 + 年级标签）。
        if "电子教材" not in tags:
            continue
        by_tags.append((it, tags))

    out = {}
    detail_rows = []
    for v in textbooks["versions"]:
        slug = v["slug"]
        ver_tag = VERSION_MAP.get(slug)
        subject = SUBJECT_ALIAS.get(v.get("subject"), v.get("subject"))
        include = VERSION_INCLUDE.get(slug, ())
        if not ver_tag or slug in VERSION_SKIP:
            detail_rows.append((f"{slug}:*", "", "版本不参与自动映射", 0))
            continue
        for b in v["books"]:
            grade, sem = b.get("grade"), b.get("semester")
            key = f"{slug}:{b['slug']}"
            if not grade or sem not in ("上", "下"):
                continue
            gtag = f"{CN.get(int(grade), '')}年级"
            term = f"{sem}册"
            stage = stage_of(int(grade))
            cands = []
            for it, tags in by_tags:
                if subject not in tags or gtag not in tags or term not in tags:
                    continue
                if stage not in tags:
                    continue
                vtags = [t for t in tags if t.startswith(ver_tag)]
                if not vtags:
                    continue
                title = (it.get("title") or it.get("global_title") or "")
                if any(w in title for w in TITLE_EXCLUDE):
                    continue
                if include and not any(all(w in t for w in include) for t in vtags):
                    continue
                cands.append((it, vtags[0]))
            if not cands:
                detail_rows.append((key, "", "未命中", 0))
                continue
            # 同一版本标签下会有多个年度印次（2024/2025/2026 年度），这是同一本书，
            # 取最新印次；若标签后缀本身不同（如外研社孙有中/刘兆义/张祖春），
            # 说明是并行教材，无法判断用户要哪套，留空。
            groups = {vt for _, vt in cands}
            if len(groups) > 1:
                detail_rows.append((key, "", f"版本标签不一致：{'/'.join(sorted(groups))[:40]}", len(cands)))
                continue
            cands.sort(key=lambda p: str(p[0].get("update_time") or ""), reverse=True)
            best = cands[0][0]
            out[key] = {
                "contentId": best["id"],
                "title": best.get("title") or best.get("global_title"),
                "updated": str(best.get("update_time") or "")[:10],
            }
            detail_rows.append((key, best["id"], best.get("title"), len(cands)))
    return out, detail_rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--textbooks", default=os.path.join(ROOT, "data", "textbooks.json"))
    ap.add_argument("--out", default=os.path.join(ROOT, "data", "smartedu-map.json"))
    ap.add_argument("--report", action="store_true")
    a = ap.parse_args()

    textbooks = json.load(open(a.textbooks, encoding="utf-8"))
    index = load_index()
    mapping, rows = build(index, textbooks)

    total = len(rows)
    ok = len(mapping)
    print(f"索引 {len(index)} 条；教材 {total} 册；命中 {ok} 册（{ok*100//max(total,1)}%）")
    if a.report:
        cur = None
        for key, cid, title, n in rows:
            v = key.split(":")[0]
            if v != cur:
                cur = v
                print(f"\n--- {v} ---")
            if cid:
                print(f"  ✓ {key:34} {cid}  [{n} 候选]  {str(title)[:40]}")
            else:
                print(f"  ✗ {key:34} {title}")

    json.dump(mapping, open(a.out, "w", encoding="utf-8"),
              ensure_ascii=False, indent=1, sort_keys=True)
    print(f"\n写入 {a.out}")


if __name__ == "__main__":
    main()

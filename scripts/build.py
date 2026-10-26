#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""构建脚本：把 src/ 下的数据源模块汇编为 data/ 目录的 JSON 数据集。

用法：
    python3 scripts/build.py

产物：
    data/topics.json               主题节点（图谱节点，含 textbooks2024 修订版教材引用）
    data/dependencies.json         先修依赖边
    data/curriculum-standards.json 课程标准条目
    data/textbooks.json            教材目录（含 2024 年版课标修订教材与 unitMap2024 映射层）
    data/clusters.json             家长友好的域摘要
    data/manifest.json             计数与 SHA-256 校验和
    viz/data.js                    可视化用的内嵌数据（离线可用）
"""
import hashlib
import json
import re
import shutil
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
DATA = ROOT / "data"
VIZ = ROOT / "viz"

sys.path.insert(0, str(SRC))

import standards as std  # noqa: E402
import textbook_map_2024 as tmap24  # noqa: E402
import textbook_map_bnu_math as tmap_bnu  # noqa: E402
import textbook_map_sj_math as tmap_sj  # noqa: E402
import textbook_map_fltrp_english as tmap_fltrp  # noqa: E402
import textbook_paths  # noqa: E402
import textbooks as tb  # noqa: E402
import textbooks_2024 as tb24  # noqa: E402
import topics_chinese  # noqa: E402
import topics_chinese_junior  # noqa: E402
import topics_english  # noqa: E402
import topics_english_junior  # noqa: E402
import topics_math  # noqa: E402
import topics_math_junior  # noqa: E402
import topics_physics_junior  # noqa: E402
import topics_chemistry_junior  # noqa: E402
import topics_history_junior  # noqa: E402
import topics_geography_junior  # noqa: E402
import topics_science  # noqa: E402
import topics_morality_primary  # noqa: E402
import topics_morality_junior  # noqa: E402
import teaching_research_math_a  # noqa: E402
import teaching_research_math_b  # noqa: E402
import teaching_research_math_junior  # noqa: E402
import teaching_research_chinese_a  # noqa: E402
import teaching_research_chinese_b  # noqa: E402
import teaching_research_english  # noqa: E402
import teaching_research_chinese_junior  # noqa: E402
import teaching_research_english_junior  # noqa: E402
import teaching_research_physics_junior  # noqa: E402
import teaching_research_chemistry_junior  # noqa: E402
import teaching_research_history_junior  # noqa: E402
import teaching_research_geography_junior  # noqa: E402
import teaching_research_science  # noqa: E402
import teaching_research_morality  # noqa: E402
import topics_biology_junior  # noqa: E402
import teaching_research_biology_junior  # noqa: E402
import topics_physics_senior  # noqa: E402
import topics_chemistry_senior  # noqa: E402
import teaching_research_physics_senior  # noqa: E402
import teaching_research_chemistry_senior  # noqa: E402
import topics_biology_senior  # noqa: E402
import topics_history_senior  # noqa: E402
import topics_geography_senior  # noqa: E402
import teaching_research_biology_senior  # noqa: E402
import teaching_research_history_senior  # noqa: E402
import teaching_research_geography_senior  # noqa: E402
import topics_politics_senior  # noqa: E402
import topics_tech_senior  # noqa: E402
import teaching_research_politics_senior  # noqa: E402
import teaching_research_tech_senior  # noqa: E402
import topics_chinese_senior  # noqa: E402
import topics_math_senior  # noqa: E402
import topics_english_senior  # noqa: E402
import teaching_research_chinese_senior  # noqa: E402
import teaching_research_math_senior  # noqa: E402
import teaching_research_english_senior  # noqa: E402

VERSION = "v0.36.0"
SCHEMA_VERSION = 1

MODULES = [
    ("数学", topics_math),
    ("数学", topics_math_junior),
    ("语文", topics_chinese),
    ("语文", topics_chinese_junior),
    ("英语", topics_english),
    ("英语", topics_english_junior),
    ("物理", topics_physics_junior),
    ("化学", topics_chemistry_junior),
    ("历史", topics_history_junior),
    ("地理", topics_geography_junior),
    ("科学", topics_science),
    ("道德与法治", topics_morality_primary),
    ("道德与法治", topics_morality_junior),
    ("生物", topics_biology_junior),
    ("物理", topics_physics_senior),
    ("化学", topics_chemistry_senior),
    ("生物", topics_biology_senior),
    ("历史", topics_history_senior),
    ("地理", topics_geography_senior),
    ("思想政治", topics_politics_senior),
    ("技术", topics_tech_senior),
    ("语文", topics_chinese_senior),
    ("数学", topics_math_senior),
    ("英语", topics_english_senior),
]

RESEARCH_MODULES = [
    teaching_research_math_a,
    teaching_research_math_b,
    teaching_research_math_junior,
    teaching_research_chinese_a,
    teaching_research_chinese_b,
    teaching_research_english,
    teaching_research_chinese_junior,
    teaching_research_english_junior,
    teaching_research_physics_junior,
    teaching_research_chemistry_junior,
    teaching_research_history_junior,
    teaching_research_geography_junior,
    teaching_research_science,
    teaching_research_morality,
    teaching_research_biology_junior,
    teaching_research_physics_senior,
    teaching_research_chemistry_senior,
    teaching_research_biology_senior,
    teaching_research_history_senior,
    teaching_research_geography_senior,
    teaching_research_politics_senior,
    teaching_research_tech_senior,
    teaching_research_chinese_senior,
    teaching_research_math_senior,
    teaching_research_english_senior,
]

RESEARCH_AUTHORSHIP = {
    "authoredBy": "AI 撰写（教学研究层）",
    "review": "经结构化校验（字段完整性、长度约束、来源白名单、主题联结、覆盖清单），"
              "并经过 build 阶段的引用完整性校验；未经实证验证。",
    "caveat": "本层是研究启发性建议（教学要点、学习活动、诊断任务），"
              "不是经验证有效的干预方案；引用来源未逐条重新联网复核，"
              "历史上标为 verified 的字段不构成新的证据评级。",
}

ALLOWED_SOURCES = {
    "《义务教育数学课程标准（2022年版）》": "https://basic.smartedu.cn/",
    "人教版《义务教育教科书·数学》教师教学用书": "https://www.pep.com.cn/",
    "人教版《义务教育教科书·数学》": "",
    "《义务教育语文课程标准（2022年版）》": "https://basic.smartedu.cn/",
    "统编版《义务教育教科书·语文》教师教学用书": "",
    "统编版《义务教育教科书·语文》": "",
    "《义务教育英语课程标准（2022年版）》": "https://basic.smartedu.cn/",
    "人教版《义务教育教科书·英语（PEP）》教师教学用书": "",
    "人教版《义务教育教科书·英语（PEP）》": "",
    # —— v0.14：初中物理 / 化学 / 历史 / 地理 ——
    "《义务教育物理课程标准（2022年版）》": "https://basic.smartedu.cn/",
    "人教版《义务教育教科书·物理》教师教学用书": "https://www.pep.com.cn/",
    "人教版《义务教育教科书·物理》": "",
    "《义务教育化学课程标准（2022年版）》": "https://basic.smartedu.cn/",
    "人教版《义务教育教科书·化学》教师教学用书": "https://www.pep.com.cn/",
    "人教版《义务教育教科书·化学》": "",
    "《义务教育历史课程标准（2022年版）》": "https://basic.smartedu.cn/",
    "统编版《义务教育教科书·历史》教师教学用书": "",
    "统编版《义务教育教科书·历史》": "",
    "《义务教育地理课程标准（2022年版）》": "https://basic.smartedu.cn/",
    "人教版《义务教育教科书·地理》教师教学用书": "https://www.pep.com.cn/",
    "人教版《义务教育教科书·地理》": "",
    # —— v0.16：小学科学 / 道德与法治 ——
    "《义务教育科学课程标准（2022年版）》": "https://basic.smartedu.cn/",
    "教科版《义务教育教科书·科学》教师教学用书": "",
    "教科版《义务教育教科书·科学》": "",
    "《义务教育道德与法治课程标准（2022年版）》": "https://basic.smartedu.cn/",
    "统编版《义务教育教科书·道德与法治》教师教学用书": "",
    "统编版《义务教育教科书·道德与法治》": "",
    # —— v0.18：初中生物 ——
    "《义务教育生物学课程标准（2022年版）》": "https://basic.smartedu.cn/",
    "人教版《义务教育教科书·生物学》教师教学用书": "https://www.pep.com.cn/",
    "人教版《义务教育教科书·生物学》": "",
    # —— v0.19：高中物理 / 化学 / 思想政治 / 技术 ——
    "《普通高中物理课程标准（2017年版2020年修订）》": "https://basic.smartedu.cn/",
    "人教版《普通高中教科书·物理》教师教学用书": "https://www.pep.com.cn/",
    "人教版《普通高中教科书·物理》": "",
    "《普通高中化学课程标准（2017年版2020年修订）》": "https://basic.smartedu.cn/",
    "人教版《普通高中教科书·化学》教师教学用书": "https://www.pep.com.cn/",
    "人教版《普通高中教科书·化学》": "",
    "《普通高中思想政治课程标准（2017年版2020年修订）》": "https://basic.smartedu.cn/",
    "人教版《普通高中教科书·思想政治》教师教学用书": "https://www.pep.com.cn/",
    "人教版《普通高中教科书·思想政治》": "",
    "《普通高中信息技术课程标准（2017年版2020年修订）》": "https://basic.smartedu.cn/",
    "《普通高中通用技术课程标准（2017年版2020年修订）》": "https://basic.smartedu.cn/",
    "人教版《普通高中教科书·信息技术》": "",
    "人教版《普通高中教科书·通用技术》": "",
    # —— v0.20：高中生物 / 历史 / 地理 ——
    "《普通高中生物学课程标准（2017年版2020年修订）》": "https://basic.smartedu.cn/",
    "人教版《普通高中教科书·生物学》教师教学用书": "https://www.pep.com.cn/",
    "人教版《普通高中教科书·生物学》": "",
    "《普通高中历史课程标准（2017年版2020年修订）》": "https://basic.smartedu.cn/",
    "统编版《普通高中教科书·历史》教师教学用书": "",
    "统编版《普通高中教科书·历史》": "",
    "《普通高中地理课程标准（2017年版2020年修订）》": "https://basic.smartedu.cn/",
    "人教版《普通高中教科书·地理》教师教学用书": "https://www.pep.com.cn/",
    "人教版《普通高中教科书·地理》": "",
    # —— v0.21：高中思想政治 / 技术 ——
    "人教版《普通高中教科书·信息技术》教师教学用书": "https://www.pep.com.cn/",
    "人教版《普通高中教科书·通用技术》教师教学用书": "https://www.pep.com.cn/",
    # —— v0.22：高中语文 / 数学 / 英语 ——
    "《普通高中语文课程标准（2017年版2020年修订）》": "https://basic.smartedu.cn/",
    "统编版《普通高中教科书·语文》教师教学用书": "",
    "统编版《普通高中教科书·语文》": "",
    "《普通高中数学课程标准（2017年版2020年修订）》": "https://basic.smartedu.cn/",
    "人教A版《普通高中教科书·数学》教师教学用书": "https://www.pep.com.cn/",
    "人教A版《普通高中教科书·数学》": "",
    "《普通高中英语课程标准（2017年版2020年修订）》": "https://basic.smartedu.cn/",
    "人教版《普通高中教科书·英语》教师教学用书": "https://www.pep.com.cn/",
    "人教版《普通高中教科书·英语》": "",
}

STAGE_BY_GRADE = {
    1: "第一学段（1~2年级）",
    2: "第一学段（1~2年级）",
    3: "第二学段（3~4年级）",
    4: "第二学段（3~4年级）",
    5: "第三学段（5~6年级）",
    6: "第三学段（5~6年级）",
    7: "第四学段（7~9年级）",
    8: "第四学段（7~9年级）",
    9: "第四学段（7~9年级）",
    10: "第五学段（10~12年级）",
    11: "第五学段（10~12年级）",
    12: "第五学段（10~12年级）",
}
ENGLISH_STAGE_BY_GRADE = {
    3: "一级（3~4年级）",
    4: "一级（3~4年级）",
    5: "二级（5~6年级）",
    6: "二级（5~6年级）",
    7: "三级（7~9年级）",
    8: "三级（7~9年级）",
    9: "三级（7~9年级）",
    10: "四级（10~12年级）",
    11: "四级（10~12年级）",
    12: "四级（10~12年级）",
}


def sha256_bytes(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest()


def dump_json(path: Path, obj) -> str:
    payload = json.dumps(obj, ensure_ascii=False, indent=2).encode("utf-8") + b"\n"
    path.write_bytes(payload)
    return sha256_bytes(payload)


def stage_of(subject: str, grade: int) -> str:
    if subject == "英语":
        return ENGLISH_STAGE_BY_GRADE[grade]
    return STAGE_BY_GRADE[grade]


SUBJECT_SLUG = {"数学": "math", "语文": "chinese", "英语": "english",
                "物理": "physics", "化学": "chemistry", "历史": "history", "地理": "geography",
                "科学": "science", "道德与法治": "morality", "生物": "biology",
                "思想政治": "politics", "技术": "tech"}
STAGE_SLUG = {
    "第一学段（1~2年级）": "s1",
    "第二学段（3~4年级）": "s2",
    "第三学段（5~6年级）": "s3",
    "第四学段（7~9年级）": "s4",
    "一级（3~4年级）": "l1",
    "二级（5~6年级）": "l2",
    "三级（7~9年级）": "l3",
    "第五学段（10~12年级）": "s5",
    "四级（10~12年级）": "l4",
}


def build_domain_index():
    """按学科内首次出现顺序给领域编号，用于生成稳定的领域簇 id。

    注意：领域编号需跨同一学科的全部模块累加（小学 + 初中），
    不能在每个模块处重置计数器，否则后加载的模块会把领域重新从 1 编号，
    与先加载模块的同名/异名领域发生簇 id 冲突。
    """
    idx, counters = {}, {}
    for subject, mod in MODULES:
        counters.setdefault(subject, {})
        for t in mod.TOPICS:
            d = t["domain"]
            if d not in counters[subject]:
                counters[subject][d] = len(counters[subject]) + 1
            idx[(subject, d)] = counters[subject][d]
    return idx


# 领域编号只依赖 src/ 数据，构建期算一次即可
DOMAIN_INDEX = build_domain_index()

# 全部主题 key（2024 版教材映射与替代版本映射的构建期校验用）
TOPIC_KEYS = {t["key"] for _s, mod in MODULES for t in mod.TOPICS}

# ---------- 替代教材版本映射层（v0.15：北师大版/苏教版数学、外研社版英语）----------
# 与 2024 版映射同构：主题的 textbooks 主引用不变，另建一份「知识点 → 其他版本单元」映射，
# 供详情面板并排查看同一知识点在不同版本教材中的位置。
ALT_MAPS = [
    ("bnu-math", "北师大版", tmap_bnu.MAP_BNU_MATH),
    ("sj-math", "苏教版", tmap_sj.MAP_SJ_MATH),
    ("fltrp-english", "外研社版", tmap_fltrp.MAP_FLTRP_ENGLISH),
]
ALT_SLUGS = tuple(slug for slug, _label, _m in ALT_MAPS)


def build_alt_map():
    """同一主题可能被多个替代版本收录，按主题 key 合并 refs，并给 note 加版本前缀。"""
    merged = {}
    for slug, label, mapping in ALT_MAPS:
        for key, entry in mapping.items():
            e = merged.setdefault(key, {"refs": [], "note": None})
            e["refs"].extend(entry.get("refs", []))
            note = entry.get("note")
            if note:
                # note 可能已自带版本名（子模块撰写时常见），避免前缀重复
                part = note if note.startswith(label) else f"{label}：{note}"
                e["note"] = (e["note"] + "；" if e["note"] else "") + part
    return merged


MAP_ALT = build_alt_map()


def cluster_id_of(subject, domain, stage):
    num = DOMAIN_INDEX.get((subject, domain))
    if num is None:
        raise SystemExit(f"领域簇缺少领域：{subject}/{domain}")
    return f"cl-{SUBJECT_SLUG[subject]}-d{num}-{STAGE_SLUG[stage]}"


def build_topics():
    topics, key_to_id = [], {}
    for subject, mod in MODULES:
        for t in mod.TOPICS:
            topic_id = "mt_" + t["key"]
            if topic_id in key_to_id:
                raise SystemExit(f"重复的主题 id: {topic_id}")
            key_to_id[t["key"]] = topic_id
            topics.append({
                "id": topic_id,
                "type": t["type"],
                "subject": subject,
                "domain": t["domain"],
                "name": t["name"],
                "description": t["description"],
                "gradeRangeStart": t["gradeStart"],
                "gradeRangeEnd": t["gradeEnd"],
                "stage": stage_of(subject, t["gradeStart"]),
                "evidence": t["evidence"],
                "assessmentPrompt": t["assessment"],
                "standards": t["standards"],
                "textbooks": t["textbooks"],
                # 2024 年版课标修订教材的单元级映射（可能为空数组：该知识点所在册次尚未被替换）
                "textbooks2024": list(tmap24.MAP_2024.get(t["key"], {}).get("refs", [])),
                # 其他教材版本（北师大版/苏教版数学、外研社版英语）的单元级映射
                "textbooksAlt": list(MAP_ALT.get(t["key"], {}).get("refs", [])),
            })
            note24 = tmap24.MAP_2024.get(t["key"], {}).get("note")
            if note24:
                topics[-1]["textbookNote2024"] = note24
            note_alt = MAP_ALT.get(t["key"], {}).get("note")
            if note_alt:
                topics[-1]["textbookNoteAlt"] = note_alt
    for t in topics:
        t["clusterId"] = cluster_id_of(t["subject"], t["domain"], t["stage"])
    # 中心度：无向度 / (N-1)，便于前端按枢纽主题布局
    degree = {t["id"]: 0 for t in topics}
    for _, mod in MODULES:
        for a, b, _s, _r in mod.EDGES:
            degree["mt_" + a] += 1
            degree["mt_" + b] += 1
    n = len(topics)
    for t in topics:
        t["centrality"] = round(degree[t["id"]] / (n - 1), 4) if n > 1 else 0.0
    return {"version": VERSION, "schemaVersion": SCHEMA_VERSION, "topics": topics}


def build_dependencies():
    deps = []
    for _subject, mod in MODULES:
        for a, b, strength, reason in mod.EDGES:
            deps.append({
                "topicId": "mt_" + a,
                "prerequisiteId": "mt_" + b,
                "strength": strength,
                "reason": reason,
            })
    return {"version": VERSION, "schemaVersion": SCHEMA_VERSION, "dependencies": deps}


def build_standards():
    entries = []
    for code, slug, curriculum, stage, domain, theme, summary in std.STANDARDS:
        entries.append({
            "code": code,
            "slug": slug,
            "curriculum": curriculum,
            "stage": stage,
            "domain": domain,
            "theme": theme,
            "summary": summary,
        })
    return {
        "version": VERSION,
        "schemaVersion": SCHEMA_VERSION,
        "source": std.STANDARDS_SOURCE,
        "standards": entries,
    }


def build_textbooks_2024():
    """2024 年版课标修订教材（src/textbooks_2024.py 的真实目录）。

    与旧版条目的差异：units 为对象数组（name/type/page/lessons），
    其中 type ∈ unit（常规单元）/ activity（综合与实践活动）/ enrichment（数学广角）
    / intro（入学导学）/ revision（复习与关联）；书条目另带 edition/title/source。
    """
    versions = []
    for ed in tb24.EDITIONS:
        books = []
        for bk in ed["books"]:
            book = {
                "slug": bk["slug"],
                "grade": bk["grade"],
                "semester": bk["semester"],
                "edition": bk["edition"],
                "title": bk["title"],
                "source": bk["source"],
                "units": bk["units"],
            }
            if "appendix" in bk:
                book["appendix"] = bk["appendix"]
            books.append(book)
        versions.append({
            "slug": ed["slug"],
            "name": ed["name"],
            "edition": ed["edition"],
            "subject": ed["subject"],
            "gradeStart": ed["gradeStart"],
            "note": ed["note"],
            "books": books,
        })
    return versions


def check_unit_map_2024():
    """构建期校验：映射 key 必须存在于主题，refs 必须能解析到 2024 版目录。"""
    index = {}
    for ed in tb24.EDITIONS:
        books = {}
        for bk in ed["books"]:
            unit_count = sum(1 for u in bk["units"] if u["type"] == "unit")
            acts = {u["name"] for u in bk["units"] if u["type"] in ("activity", "enrichment")}
            books[bk["slug"]] = (unit_count, acts)
        index[ed["slug"]] = books
    for key, entry in tmap24.MAP_2024.items():
        if key not in TOPIC_KEYS:
            raise SystemExit(f"unitMap2024 指向不存在的主题 key: {key}")
        for ref in entry["refs"]:
            m = re.match(r"^(pep-math-2024|tongbian-chinese-2024|pep-english-2024):([1-6][ab])(?::(u[1-9][0-9]?))?(?:#(.+))?$", ref)
            if not m:
                raise SystemExit(f"unitMap2024 引用格式非法: {key} -> {ref}")
            vslug, bslug, unit, act = m.groups()
            if vslug not in index or bslug not in index[vslug]:
                raise SystemExit(f"unitMap2024 引用版本/册次不存在: {key} -> {ref}")
            unit_count, acts = index[vslug][bslug]
            if unit and not (1 <= int(unit[1:]) <= unit_count):
                raise SystemExit(f"unitMap2024 引用单元序号越界: {key} -> {ref}（该册共 {unit_count} 个常规单元）")
            if act and act not in acts:
                raise SystemExit(f"unitMap2024 引用活动不存在: {key} -> {ref}")


def check_unit_map_alt():
    """构建期校验：替代版本映射的 key 必须存在，refs 必须能解析到对应版本目录。"""
    index = {}
    for v in tb.DETAILED_VERSIONS:
        if v["slug"] not in ALT_SLUGS:
            continue
        index[v["slug"]] = {b[0]: len(b[3]) for b in v["books"]}
    for slug, _label, _m in ALT_MAPS:
        if slug not in index:
            raise SystemExit(f"替代版本 {slug} 未登记在 textbooks.py 的 DETAILED_VERSIONS 中")
    for key, entry in MAP_ALT.items():
        if key not in TOPIC_KEYS:
            raise SystemExit(f"unitMapAlt 指向不存在的主题 key: {key}")
        for ref in entry["refs"]:
            m = re.match(r"^(%s):([1-9][ab]):u([1-9][0-9]?)$" % "|".join(ALT_SLUGS), ref)
            if not m:
                raise SystemExit(f"unitMapAlt 引用格式非法: {key} -> {ref}")
            vslug, bslug, unit = m.groups()
            if vslug not in index or bslug not in index[vslug]:
                raise SystemExit(f"unitMapAlt 引用版本/册次不存在: {key} -> {ref}")
            if not (1 <= int(unit) <= index[vslug][bslug]):
                raise SystemExit(
                    f"unitMapAlt 引用单元序号越界: {key} -> {ref}"
                    f"（该册共 {index[vslug][bslug]} 个单元）")


def build_textbooks():
    versions = []
    for v in tb.DETAILED_VERSIONS:
        books = []
        paths = textbook_paths.PATHS.get(v["slug"], {})
        for slug, grade, semester, units, blocks in v["books"]:
            book = {"slug": slug, "grade": grade, "semester": semester}
            if units:
                book["units"] = units
            if blocks:
                book["blocks"] = blocks
            # ChinaTextbook 仓库内的真实 PDF 路径（用于可视化层生成直达链接）
            if slug in paths:
                book["chinaTextbookPath"] = paths[slug]
            books.append(book)
        entry = {
            "slug": v["slug"],
            "name": v["name"],
            "subject": v["subject"],
            "gradeStart": v["gradeStart"],
            "note": v["note"],
            "books": books,
        }
        if "unitCounts" in v:
            entry["unitCounts"] = v["unitCounts"]
        versions.append(entry)
    versions.extend(build_textbooks_2024())
    return {
        "version": VERSION,
        "schemaVersion": SCHEMA_VERSION,
        "sources": {
            "smartedu": tb.SMARTEDU,
            "chinaTextbook": {**tb.CHINATEXTBOOK, "repo": textbook_paths.CHINA_TEXTBOOK_REPO},
            "dzkbw": tb24.SOURCE,
        },
        "versions": versions,
        # 知识点 → 2024 版单元映射层（与 topic.textbooks2024 同源；供独立消费与双向校验）
        "unitMap2024": tmap24.MAP_2024,
        # 知识点 → 其他教材版本单元映射层（与 topic.textbooksAlt 同源）
        "unitMapAlt": MAP_ALT,
        "chinaTextbookPrimaryVersions": tb.CHINATEXTBOOK_PRIMARY_VERSIONS,
    }


def build_clusters(topics):
    """领域簇：以（学科 × 领域 × 学段）分组，并反向登记其下知识点 id。"""
    by_cid = {}
    for t in topics:
        by_cid.setdefault(t["clusterId"], []).append(t["id"])
    clusters = []
    for subject, mod in MODULES:
        for c in mod.CLUSTERS:
            cid = cluster_id_of(subject, c["domain"], c["stage"])
            clusters.append({
                "id": cid,
                "subject": subject,
                "domain": c["domain"],
                "stage": c["stage"],
                "summary": c["summary"],
                "topicIds": by_cid.get(cid, []),
            })
    return {"version": VERSION, "schemaVersion": SCHEMA_VERSION, "clusters": clusters}


def build_courses(topics):
    """课件层索引：扫描 courses/*/meta.json，校验 topicId 与模板，供可视化读取。"""
    topic_by_id = {t["id"]: t for t in topics}
    allowed_tpl = {"explain", "drill", "explore", "review"}
    items = []
    root = ROOT / "courses"
    if root.exists():
        for d in sorted(p for p in root.iterdir() if p.is_dir()):
            meta_path = d / "meta.json"
            html_path = d / "index.html"
            if not meta_path.exists():
                continue
            meta = json.loads(meta_path.read_text(encoding="utf-8"))
            tid = meta.get("topicId")
            if tid not in topic_by_id:
                raise SystemExit(f"课件 {d.name}: topicId {tid} 不在主题表里")
            if meta.get("template") not in allowed_tpl:
                raise SystemExit(f"课件 {d.name}: template 非法 {meta.get('template')}")
            if not html_path.exists():
                raise SystemExit(f"课件 {d.name}: 缺 index.html")
            topic = topic_by_id[tid]
            own = set(topic["standards"])
            for code in meta.get("standards", []):
                if code not in own:
                    raise SystemExit(f"课件 {d.name}: 课标 {code} 不在主题 {tid} 的 standards 里")
            item = dict(meta)
            item["path"] = f"courses/{d.name}/"
            item["bytes"] = html_path.stat().st_size
            items.append(item)

    by_tpl, by_status, by_subject = {}, {}, {}
    for it in items:
        by_tpl[it["template"]] = by_tpl.get(it["template"], 0) + 1
        by_status[it["status"]] = by_status.get(it["status"], 0) + 1
        subj = it.get("subject", "")
        by_subject[subj] = by_subject.get(subj, 0) + 1
    return {
        "version": VERSION,
        "schemaVersion": 1,
        "generatedAt": date.today().isoformat(),
        "counts": {
            "total": len(items),
            "byTemplate": by_tpl,
            "byStatus": by_status,
            "bySubject": by_subject,
        },
        "courses": items,
    }


def load_textbook_labels():
    """教材引用 → 人话：pep-math:3b:u5 → 人教版数学 · 3 年级下 第 5 单元"""
    doc = json.loads((DATA / "textbooks.json").read_text(encoding="utf-8"))
    labels = {}
    for v in doc.get("versions", []):
        short = v["name"].split("（")[0].strip()
        for b in v.get("books", []):
            labels[(v["slug"], b["slug"])] = (short, b.get("grade"), b.get("semester", ""))
    return labels


def textbook_label(ref, labels):
    m = re.match(r"^([^:]+):(\d{1,2}[ab])(?::u(\d+))?$", str(ref))
    if not m:
        return str(ref)
    hit = labels.get((m.group(1), m.group(2)))
    if not hit:
        return str(ref)
    short, grade, sem = hit
    text = f"{short} · {grade} 年级{sem}"
    if m.group(3):
        text += f" 第 {int(m.group(3))} 单元"
    return text


def build_graph_context(topic, topic_by_id, deps, course_state, tb_labels):
    """课件页首尾要用的图谱邻域：先修、解锁、同领域兄弟。

    course_state: {topicId: status}，用于在推荐里标出「已有课件」。
    """
    def pack(tid, strength):
        t = topic_by_id.get(tid)
        if not t:
            return None
        return {
            "id": tid,
            "name": t["name"],
            "grade": t["gradeRangeStart"],
            "subject": t["subject"],
            "course": course_state.get(tid),
            "hard": strength == "hard",
        }

    prereqs, unlocks = [], []
    for d in deps:
        if d["topicId"] == topic["id"]:
            item = pack(d["prerequisiteId"], d["strength"])
            if item:
                item["reason"] = d.get("reason", "")
                prereqs.append(item)
        elif d["prerequisiteId"] == topic["id"]:
            item = pack(d["topicId"], d["strength"])
            if item:
                unlocks.append(item)

    # hard 优先，再按年级
    prereqs.sort(key=lambda x: (not x["hard"], x["grade"]))
    unlocks.sort(key=lambda x: (not x["hard"], x["grade"]))

    siblings = [
        pack(t["id"], "soft") for t in topic_by_id.values()
        if t["domain"] == topic["domain"] and t["stage"] == topic["stage"] and t["id"] != topic["id"]
    ]
    siblings = sorted([x for x in siblings if x], key=lambda x: (not x["course"], x["grade"]))[:4]

    return {
        "id": topic["id"],
        "name": topic["name"],
        "subject": topic["subject"],
        "domain": topic["domain"],
        "stage": topic["stage"],
        "grade": topic["gradeRangeStart"],
        "gradeEnd": topic["gradeRangeEnd"],
        "standards": topic.get("standards", []),
        "textbooks": topic.get("textbooks", []),
        "textbookLabels": [textbook_label(r, tb_labels) for r in topic.get("textbooks", [])],
        "prereqs": prereqs,
        "unlocks": unlocks,
        "siblings": siblings,
    }


def sync_courses_to_viz(topics, deps):
    """把 courses/ 打包进 viz/courses/。

    做三件事：
    1. 内联 templates/base.css 与 templates/renderers.js —— 发布产物必须是单文件、无外链；
    2. 注入 window.__GRAPH —— 课件页首尾的「图谱位置」与延伸推荐都读它；
    3. 改写回跳链接 —— 源文件写 ../../viz/index.html，发布目录里是 ../../index.html。
    """
    src = ROOT / "courses"
    dst = VIZ / "courses"
    if not src.exists():
        return 0

    base_css_path = ROOT / "templates" / "base.css"
    renderers_path = ROOT / "templates" / "renderers.js"
    if not base_css_path.exists() or not renderers_path.exists():
        raise SystemExit("缺 templates/base.css 或 templates/renderers.js，课件无法内联")
    base_css = base_css_path.read_text(encoding="utf-8")
    renderers = renderers_path.read_text(encoding="utf-8")
    engine_path = ROOT / "templates" / "engine.js"
    engine_js = engine_path.read_text(encoding="utf-8") if engine_path.exists() else ""

    topic_by_id = {t["id"]: t for t in topics}
    tb_labels = load_textbook_labels()

    # 先扫一遍课件状态，推荐里才能标出「已有课件」
    course_state = {}
    for d in sorted(p for p in src.iterdir() if p.is_dir()):
        mp = d / "meta.json"
        if mp.exists():
            m = json.loads(mp.read_text(encoding="utf-8"))
            if m.get("topicId"):
                course_state[m["topicId"]] = m.get("status", "draft")

    shutil.rmtree(dst, ignore_errors=True)
    n = 0
    for d in sorted(p for p in src.iterdir() if p.is_dir()):
        meta_path = d / "meta.json"
        html_path = d / "index.html"
        if not (meta_path.exists() and html_path.exists()):
            continue
        meta = json.loads(meta_path.read_text(encoding="utf-8"))
        topic = topic_by_id.get(meta.get("topicId"))
        if not topic:
            raise SystemExit(f"课件 {d.name}: topicId {meta.get('topicId')} 不在主题表里")

        text = html_path.read_text(encoding="utf-8")

        # 0) 引擎型课件：content.json 内联进页面，引擎一并内联
        content_path = d / "content.json"
        if content_path.exists():
            content = json.loads(content_path.read_text(encoding="utf-8"))
            if content.get("topicId") != meta.get("topicId"):
                raise SystemExit(
                    f"课件 {d.name}: content.json 的 topicId {content.get('topicId')} "
                    f"与 meta.json 的 {meta.get('topicId')} 不一致"
                )
            text = re.sub(
                r'<script id="content-loader">[\s\S]*?</script>',
                lambda m: (
                    "<script>window.__CONTENT = "
                    + json.dumps(content, ensure_ascii=False)
                    + ";CourseEngine.mount(window.__CONTENT);</script>"
                ),
                text,
            )
            if engine_js:
                text = re.sub(
                    r'[ \t]*<script[^>]*src="[^"]*templates/engine\.js"[^>]*></script>',
                    lambda m: "<script>\n" + engine_js + "\n</script>",
                    text,
                )

        # 1) 内联样式与呈现器
        # 注意：替换内容里有反斜杠（CSS/JS），必须用 lambda 避免被当成转义序列
        text = re.sub(
            r'[ \t]*<link[^>]*href="[^"]*templates/base\.css"[^>]*>',
            lambda m: "<style>\n" + base_css + "\n</style>",
            text,
        )
        text = re.sub(
            r'[ \t]*<script[^>]*src="[^"]*templates/renderers\.js"[^>]*></script>',
            lambda m: "<script>\n" + renderers + "\n</script>",
            text,
        )

        # 2) 注入图谱邻域（放 head 末尾，早于页面主脚本执行）
        ctx = build_graph_context(topic, topic_by_id, deps, course_state, tb_labels)
        inject = (
            "<script>window.__GRAPH = "
            + json.dumps(ctx, ensure_ascii=False)
            + ";</script>\n</head>"
        )
        if "</head>" not in text:
            raise SystemExit(f"课件 {d.name}: 缺少 </head>，无法注入图谱数据")
        text = text.replace("</head>", inject, 1)

        # 3) 回跳路径
        text = text.replace("../../viz/index.html", "../../index.html")

        target = dst / d.name
        target.mkdir(parents=True, exist_ok=True)
        shutil.copy2(meta_path, target / "meta.json")
        (target / "index.html").write_text(text, encoding="utf-8")
        n += 1
    return n


def build_teaching_research(topics, topics_sha256):
    """教学研究层：按 topicId 联结到 topics.json，并绑定 topics.json 的字节校验和。"""
    topic_by_id = {t["id"]: t for t in topics}
    records = []
    for mod in RESEARCH_MODULES:
        for r in mod.RECORDS:
            topic_id = "mt_" + r["topic"]
            t = topic_by_id.get(topic_id)
            if t is None:
                raise SystemExit(f"教学研究记录指向不存在的主题: {topic_id}")
            if t["subject"] != mod.SUBJECT:
                raise SystemExit(f"教学研究记录学科不符: {topic_id}")
            for s in r["sources"]:
                if s["source"] not in ALLOWED_SOURCES:
                    raise SystemExit(f"教学研究记录使用了清单外来源: {s['source']}")
                if s.get("url") is None:
                    s["url"] = ALLOWED_SOURCES[s["source"]]
            records.append({
                "topicId": topic_id,
                "topicName": t["name"],
                "subject": t["subject"],
                "gradeRangeStart": t["gradeRangeStart"],
                "gradeRangeEnd": t["gradeRangeEnd"],
                "pedagogy": r["pedagogy"],
                "learn": {
                    "summary": r["summary"],
                    "activities": r["activities"],
                    "constraints": r["constraints"],
                },
                "assess": r["assess"],
                "sources": r["sources"],
                "confidence": r["confidence"],
                "verified": False,
            })
    # 覆盖清单：明确哪些主题暂无教学研究记录
    covered = {rec["topicId"] for rec in records}
    missing = [t["id"] for t in topics if t["id"] not in covered]
    by_subject = {}
    for t in topics:
        s = by_subject.setdefault(t["subject"], {"covered": 0, "total": 0})
        s["total"] += 1
        if t["id"] in covered:
            s["covered"] += 1
    return {
        "name": "学阶图谱教学研究层",
        "version": VERSION,
        "schemaVersion": SCHEMA_VERSION,
        "taxonomyVersion": VERSION,
        "topicFileSha256": topics_sha256,
        "authorship": RESEARCH_AUTHORSHIP,
        "coverage": {"subjects": by_subject, "missingTopicIds": missing},
        "records": records,
    }


def main():
    DATA.mkdir(exist_ok=True)
    VIZ.mkdir(exist_ok=True)

    check_unit_map_2024()
    check_unit_map_alt()
    topics_obj = build_topics()
    artifacts = {
        "topics.json": topics_obj,
        "dependencies.json": build_dependencies(),
        "curriculum-standards.json": build_standards(),
        "textbooks.json": build_textbooks(),
        "clusters.json": build_clusters(topics_obj["topics"]),
        "courses.json": build_courses(topics_obj["topics"]),
    }

    checksums = {}
    for name, obj in artifacts.items():
        checksums[name] = {
            "sha256": dump_json(DATA / name, obj),
            "bytes": (DATA / name).stat().st_size,
        }

    # 教学研究层在 topics.json 落盘后生成，绑定其 SHA-256（与 Marble 的 topicFileSha256 同思路）
    topics_obj = artifacts["topics.json"]
    research = build_teaching_research(topics_obj["topics"], checksums["topics.json"]["sha256"])
    checksums["teaching-research.json"] = {
        "sha256": dump_json(DATA / "teaching-research.json", research),
        "bytes": (DATA / "teaching-research.json").stat().st_size,
    }

    topics = topics_obj["topics"]
    deps = artifacts["dependencies.json"]["dependencies"]
    standards = artifacts["curriculum-standards.json"]["standards"]
    clusters = artifacts["clusters.json"]["clusters"]

    by_subject = {}
    for t in topics:
        s = by_subject.setdefault(t["subject"], {"topics": 0, "edges": 0})
        s["topics"] += 1
    for d in deps:
        subject = next(t["subject"] for t in topics if t["id"] == d["topicId"])
        by_subject[subject]["edges"] += 1

    manifest = {
        "name": "学阶图谱 · China Skill Taxonomy",
        "version": VERSION,
        "schemaVersion": SCHEMA_VERSION,
        "generatedAt": date.today().isoformat(),
        "counts": {
            "topics": len(topics),
            "dependencies": len(deps),
            "curriculumStandards": len(standards),
            "clusters": len(clusters),
            "teachingResearchRecords": len(research["records"]),
            "courses": artifacts["courses.json"]["counts"]["total"],
            "hardEdges": sum(1 for d in deps if d["strength"] == "hard"),
            "softEdges": sum(1 for d in deps if d["strength"] == "soft"),
        },
        "bySubject": by_subject,
        "files": checksums,
    }
    # manifest 只登记其余数据文件的校验和（不含自身，避免循环引用）
    manifest_payload = json.dumps(manifest, ensure_ascii=False, indent=2).encode("utf-8") + b"\n"
    (DATA / "manifest.json").write_bytes(manifest_payload)
    checksums["manifest.json"] = {
        "sha256": sha256_bytes(manifest_payload),
        "bytes": len(manifest_payload),
    }

    # 可视化用的内嵌数据（与 data/*.json 内容一致，避免 file:// 下的跨域限制）
    viz_payload = {
        "version": VERSION,
        "topics": topics,
        "dependencies": deps,
        "standards": standards,
        "textbooks": artifacts["textbooks.json"],
        "clusters": clusters,
        "research": research,
        "courses": artifacts["courses.json"],
    }
    n_courses = sync_courses_to_viz(artifacts["topics.json"]["topics"],
                                    artifacts["dependencies.json"]["dependencies"])
    js = "window.TAXONOMY_DATA = " + json.dumps(viz_payload, ensure_ascii=False) + ";\n"
    (VIZ / "data.js").write_text(js, encoding="utf-8")

    print("构建完成：")
    for name in list(artifacts) + ["teaching-research.json", "manifest.json"]:
        print(f"  data/{name}  {checksums[name]['bytes']:>8} bytes")
    print(f"  viz/data.js  {(VIZ / 'data.js').stat().st_size:>8} bytes")
    if n_courses:
        print(f"  viz/courses  {n_courses} 个课件已同步")
    n2024 = sum(1 for t in topics if t["textbooks2024"])
    print(f"  主题 {len(topics)} · 依赖边 {len(deps)} · 课标条目 {len(standards)} · "
          f"域摘要 {len(clusters)} · 教学研究记录 {len(research['records'])} · "
          f"课件 {artifacts['courses.json']['counts']['total']}")
    # 2024 版条数以 slug 后缀识别，不能用「总数 - 基础版本数」硬减（新增学科会算错）
    v2024 = sum(1 for v in artifacts['textbooks.json']['versions'] if v["slug"].endswith("-2024"))
    print(f"  教材版本 {len(artifacts['textbooks.json']['versions'])}（含 2024 版 {v2024}）· "
          f"映射条目 {len(tmap24.MAP_2024)} · 已关联 2024 引用的主题 {n2024}")


if __name__ == "__main__":
    main()

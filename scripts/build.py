#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""构建脚本：把 src/ 下的数据源模块汇编为 data/ 目录的 JSON 数据集。

用法：
    python3 scripts/build.py

产物：
    data/topics.json               主题节点（图谱节点）
    data/dependencies.json         先修依赖边
    data/curriculum-standards.json 课程标准条目
    data/textbooks.json            教材目录
    data/clusters.json             家长友好的域摘要
    data/manifest.json             计数与 SHA-256 校验和
    viz/data.js                    可视化用的内嵌数据（离线可用）
"""
import hashlib
import json
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
DATA = ROOT / "data"
VIZ = ROOT / "viz"

sys.path.insert(0, str(SRC))

import standards as std  # noqa: E402
import textbook_paths  # noqa: E402
import textbooks as tb  # noqa: E402
import topics_chinese  # noqa: E402
import topics_english  # noqa: E402
import topics_math  # noqa: E402
import teaching_research_math_a  # noqa: E402
import teaching_research_math_b  # noqa: E402
import teaching_research_chinese_a  # noqa: E402
import teaching_research_chinese_b  # noqa: E402
import teaching_research_english  # noqa: E402

VERSION = "v0.5.0"
SCHEMA_VERSION = 1

MODULES = [
    ("数学", topics_math),
    ("语文", topics_chinese),
    ("英语", topics_english),
]

RESEARCH_MODULES = [
    teaching_research_math_a,
    teaching_research_math_b,
    teaching_research_chinese_a,
    teaching_research_chinese_b,
    teaching_research_english,
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
}

STAGE_BY_GRADE = {
    1: "第一学段（1~2年级）",
    2: "第一学段（1~2年级）",
    3: "第二学段（3~4年级）",
    4: "第二学段（3~4年级）",
    5: "第三学段（5~6年级）",
    6: "第三学段（5~6年级）",
}
ENGLISH_STAGE_BY_GRADE = {
    3: "一级（3~4年级）",
    4: "一级（3~4年级）",
    5: "二级（5~6年级）",
    6: "二级（5~6年级）",
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


SUBJECT_SLUG = {"数学": "math", "语文": "chinese", "英语": "english"}
STAGE_SLUG = {
    "第一学段（1~2年级）": "s1",
    "第二学段（3~4年级）": "s2",
    "第三学段（5~6年级）": "s3",
    "一级（3~4年级）": "l1",
    "二级（5~6年级）": "l2",
}


def build_domain_index():
    """按学科内首次出现顺序给领域编号，用于生成稳定的领域簇 id。"""
    idx, counters = {}, {}
    for subject, mod in MODULES:
        counters[subject] = {}
        for t in mod.TOPICS:
            d = t["domain"]
            if d not in counters[subject]:
                counters[subject][d] = len(counters[subject]) + 1
            idx[(subject, d)] = counters[subject][d]
    return idx


# 领域编号只依赖 src/ 数据，构建期算一次即可
DOMAIN_INDEX = build_domain_index()


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
            })
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
    return {
        "version": VERSION,
        "schemaVersion": SCHEMA_VERSION,
        "sources": {
            "smartedu": tb.SMARTEDU,
            "chinaTextbook": {**tb.CHINATEXTBOOK, "repo": textbook_paths.CHINA_TEXTBOOK_REPO},
        },
        "versions": versions,
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

    topics_obj = build_topics()
    artifacts = {
        "topics.json": topics_obj,
        "dependencies.json": build_dependencies(),
        "curriculum-standards.json": build_standards(),
        "textbooks.json": build_textbooks(),
        "clusters.json": build_clusters(topics_obj["topics"]),
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
    }
    js = "window.TAXONOMY_DATA = " + json.dumps(viz_payload, ensure_ascii=False) + ";\n"
    (VIZ / "data.js").write_text(js, encoding="utf-8")

    print("构建完成：")
    for name in list(artifacts) + ["teaching-research.json", "manifest.json"]:
        print(f"  data/{name}  {checksums[name]['bytes']:>8} bytes")
    print(f"  viz/data.js  {(VIZ / 'data.js').stat().st_size:>8} bytes")
    print(f"  主题 {len(topics)} · 依赖边 {len(deps)} · 课标条目 {len(standards)} · "
          f"域摘要 {len(clusters)} · 教学研究记录 {len(research['records'])}")


if __name__ == "__main__":
    main()

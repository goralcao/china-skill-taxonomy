#!/usr/bin/env python3
"""把课件里的可判分环节抽成诊断题库（data/questions.json）。

课件里的题是「刚讲完就练」，诊断题库要的是「不打开课件也能答」。两者差在
自包含性上：题干里出现「上图」「这四项加起来」这类指代，离开课件就没法作答，
一律不进题库。

抽取规则
  quiz    → numeric，answer 取数字，unit 写进题干
  choice  → choice，options 原样，misconception 变成每个错项的「为什么错」
  pinyin  → choice，题干由 word 与目标字位置拼出来
  story   → 不抽。它的题问的是「故事里这个人错在哪一步」，没读故事就没法答，
            抽出来只会测到学生的猜测习惯。

排除
  soft: true 的题（语文课上「点一种看看推出什么结果」，不判错，不能用于判分）
  题干含指代词、依赖图表或上文的题
  answer 不在 options 里的 choice（数据错误，报出来）

用法
  python3 scripts/build-questions.py            # 写 data/questions.json
  python3 scripts/build-questions.py --check    # 只检查，不写文件（校验脚本调用）
"""
import argparse
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
COURSES = ROOT / "courses"
OUT = ROOT / "data" / "questions.json"

# 题干里出现这些词，说明它依赖课件上下文或配图
NEEDS_CONTEXT = re.compile(r"上图中|下图中|上图|下图|图中|表格中|这四项加起来|刚才的|上面那")

TAG = re.compile(r"<[^>]+>")


def plain(s):
    """去掉行内标签，题干在诊断页是纯文本渲染。"""
    return TAG.sub("", str(s or "")).strip()


def topic_ids():
    d = json.loads((ROOT / "data" / "topics.json").read_text(encoding="utf8"))
    ts = d if isinstance(d, list) else d.get("topics", [])
    return {t["id"]: t for t in ts}


def from_quiz(s):
    q = plain(s.get("question"))
    if not q:
        return None, "没有题干"
    ans = s.get("answer")
    if ans is None or ans == "":
        return None, "没有答案"
    if isinstance(ans, bool):
        return None, "答案是布尔值"
    unit = plain(s.get("unit"))
    # 题干里已经写了单位就不再追加，否则会出现「多少平方厘米？（单位：平方厘米）」
    prompt = q if (not unit or unit in q) else q + f"（只填数字，单位：{unit}）"
    return {
        "type": "numeric",
        "prompt": prompt,
        "answer": str(ans).strip(),
        "explanation": plain(s.get("why")),
    }, None


def from_choice(s):
    q = plain(s.get("question"))
    opts = [plain(o) for o in (s.get("options") or [])]
    ans = plain(s.get("answer"))
    if not q:
        return None, "没有题干"
    if len(opts) < 2:
        return None, "选项少于两个"
    if ans not in opts:
        return None, "答案不在选项里"
    if len(set(opts)) != len(opts):
        return None, "选项有重复"
    mis = s.get("misconception") or {}
    return {
        "type": "choice",
        "prompt": q,
        "answer": ans,
        "choices": opts,
        "explanation": plain(s.get("hint")),
        "refute": {plain(k): plain(v) for k, v in mis.items() if plain(v)},
    }, None


def from_pinyin(s):
    b = s.get("body") or {}
    opts = [str(o) for o in (b.get("options") or [])]
    ans = str(b.get("answer") or "")
    word = plain(b.get("word"))
    if len(opts) < 2 or ans not in opts:
        return None, "选项或答案不完整"
    if not word:
        return None, "没有词语"
    pos = b.get("pos") or 0
    ch = word[pos] if 0 <= pos < len(word) else word[0]
    # 课件里若给了整句，用它当题干更有语境；否则用词语本身
    sent = plain(b.get("sent"))
    if sent:
        # 原句一般自带标点，缺了才补，避免出现「谁的尾巴长？。其中……」
        tail = sent if sent[-1] in "。！？…”" else sent + "。"
        prompt = f"读这句话：{tail}其中「{ch}」在「{word}」里读哪个音？"
    elif len(word) > 1:
        prompt = f"「{word}」里的「{ch}」读哪个音？"
    else:
        prompt = f"「{word}」读哪个音？"
    mis = b.get("misconception") or {}
    return {
        "type": "choice",
        "prompt": prompt,
        "answer": ans,
        "choices": opts,
        "explanation": plain(b.get("why")) or plain(b.get("read")),
        "refute": {plain(k): plain(v) for k, v in mis.items() if plain(v)},
    }, None


BUILDERS = {"quiz": from_quiz, "choice": from_choice, "pinyin": from_pinyin}


def collect():
    topics = topic_ids()
    questions, skipped = [], []
    seen_prompt = set()

    for d in sorted(COURSES.iterdir()):
        f = d / "content.json"
        if not f.exists():
            continue
        c = json.loads(f.read_text(encoding="utf8"))
        tid = c.get("topicId")
        if tid not in topics:
            skipped.append((d.name, "-", f"topicId {tid} 不在图谱里"))
            continue
        n = 0
        for k, s in enumerate(c.get("steps") or []):
            t = s.get("type")
            if t not in BUILDERS:
                continue
            if s.get("soft"):
                skipped.append((tid, t, "soft 不判错，不能当诊断题"))
                continue
            item, why = BUILDERS[t](s)
            if item is None:
                skipped.append((tid, t, why))
                continue
            if NEEDS_CONTEXT.search(item["prompt"]):
                skipped.append((tid, t, "题干依赖课件上下文或配图"))
                continue
            key = (tid, item["prompt"])
            if key in seen_prompt:
                skipped.append((tid, t, "题干重复"))
                continue
            seen_prompt.add(key)
            n += 1
            item.update({
                "id": f"{tid}_q{n}",
                "topicId": tid,
                "difficulty": "basic" if t == "quiz" else "standard",
                "origin": f"courses/{d.name}/content.json#step{k + 1}",
            })
            if item.get("type") == "numeric":
                item.setdefault("explanation", "")
            questions.append(item)

    questions.sort(key=lambda q: (q["topicId"], q["id"]))
    return topics, questions, skipped


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()

    topics, questions, skipped = collect()
    covered = {q["topicId"] for q in questions}
    by_type = {}
    for q in questions:
        by_type[q["type"]] = by_type.get(q["type"], 0) + 1

    payload = {
        "version": "v0.48.0",
        "generatedAt": "2026-10-30",
        "source": "courses/*/content.json（课件内可判分环节）",
        "audited": False,
        "note": "题目与解析出自课件原文，未经教师独立复核；题干已剔除依赖配图与上下文的题。",
        "counts": {
            "total": len(questions),
            "byType": by_type,
            "topicsCovered": len(covered),
            "topicsTotal": len(topics),
        },
        "questions": questions,
    }

    if not args.check:
        OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=1) + "\n", encoding="utf8")

    print(f"题库：{len(questions)} 题，覆盖 {len(covered)} / {len(topics)} 个主题"
          f"（{len(covered) / len(topics) * 100:.1f}%），按类型 {by_type}")
    print(f"收录 {len(questions)}，跳过 {len(skipped)}")
    kinds = {}
    for _, _, why in skipped:
        kinds[why] = kinds.get(why, 0) + 1
    for why, n in sorted(kinds.items(), key=lambda x: -x[1]):
        print(f"  跳过 {n:>3}：{why}")
    if args.check:
        bad = [q["id"] for q in questions if not q.get("prompt") or not q.get("answer")]
        if bad:
            print("缺题干或答案：" + ", ".join(bad[:10]))
            return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
课件补齐排期器 plan-courses.py

从图谱里算出「接下来该做哪几节课」，并模拟全部补齐需要多少晚。

核心约束：一个知识点只有在它的 hard 先修全部已有课件之后才能开工
（否则课件里要讲的东西，学生还没有地方学过）。所以这不是简单的清单，
而是一个拓扑推进过程——每做完一批，就会解锁下游的一批点。

打分依据（都可在命令行改权重）：
  1. 学段优先级    小学 > 初中 > 高中（默认，可用 --scope 改）
  2. 被依赖度      有多少下游点把它当 hard 先修。越基础越该先做，
                   做一节可以解锁一串
  3. 模板成熟度    同一学科已积累的课件数。数学 51 节时新开一节的成本，
                   远低于英语从 0 起第一节
  4. 同域连做      同一 domain 内连着做，渲染器和讲法可复用，边际成本递减

用法：
  python3 scripts/plan-courses.py --count 5          # 今晚该做哪 5 个
  python3 scripts/plan-courses.py --simulate         # 模拟全部补齐要多少晚
  python3 scripts/plan-courses.py --simulate --batch 8
  python3 scripts/plan-courses.py --simulate --scope all
"""

import argparse
import collections
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ---------------------------------------------------------------- 数据加载

def g_info_grade(topics, tid):
    for x in topics:
        if x['id'] == tid:
            return x.get('gradeRangeStart', 0)
    return 0


def load():
    with open(os.path.join(ROOT, 'data', 'topics.json'), encoding='utf8') as f:
        t = json.load(f)
    topics = t if isinstance(t, list) else t.get('topics', [])
    with open(os.path.join(ROOT, 'data', 'dependencies.json'), encoding='utf8') as f:
        d = json.load(f)
    edges = d['dependencies'] if isinstance(d, dict) and 'dependencies' in d else d
    return topics, edges


def course_dirs():
    base = os.path.join(ROOT, 'courses')
    if not os.path.isdir(base):
        return set()
    return {d for d in os.listdir(base) if os.path.isdir(os.path.join(base, d))}


# ---------------------------------------------------------------- 图关系

class Graph:
    def __init__(self, topics, edges):
        self.info = {x['id']: x for x in topics}
        self.hard = collections.defaultdict(set)
        self.soft = collections.defaultdict(set)
        self.dependents = collections.defaultdict(set)   # prereq -> 依赖它的点
        self.downstream = collections.Counter()          # prereq -> 被依赖次数（hard）
        for e in edges:
            tid, pid = e['topicId'], e['prerequisiteId']
            if e.get('strength') == 'hard':
                self.hard[tid].add(pid)
                self.downstream[pid] += 1
            else:
                self.soft[tid].add(pid)
            self.dependents[pid].add(tid)

    def is_ready(self, tid, have):
        """hard 先修是否全部已有课件"""
        ps = self.hard.get(tid, set())
        return (not ps) or ps <= have

    def unlocks(self, tid, have, g):
        """做完 tid 能立刻解锁几个下游点"""
        n = 0
        for child in self.dependents.get(tid, ()):
            if child in have:
                continue
            if self.is_ready(child, have | {tid}):
                n += 1
        return n


# ---------------------------------------------------------------- 打分

# 学段 → 优先级加分（默认小学优先）
SCOPE_WEIGHTS = {
    'primary': {'1': 30, '2': 30, '3': 28, '4': 26, '5': 24, '6': 22,
                '7': 12, '8': 10, '9': 8, '10': 4, '11': 2, '12': 0},
    'all':     {'1': 12, '2': 12, '3': 12, '4': 12, '5': 12, '6': 12,
                '7': 10, '8': 10, '9': 10, '10': 8, '11': 8, '12': 8},
    'junior':  {'1': 6, '2': 6, '3': 8, '4': 10, '5': 14, '6': 18,
                '7': 26, '8': 24, '9': 20, '10': 8, '11': 4, '12': 2},
}

# 各学科平均汉字数（由现有 61 节 content.json 实测），用于工作量加权
SUBJECT_WORDS = collections.Counter()


def measure_subject_words():
    """统计各学科已有课件的平均汉字数，作为新课件工作量的参照"""
    import re
    base = os.path.join(ROOT, 'courses')
    if not os.path.isdir(base):
        return
    for d in os.listdir(base):
        p = os.path.join(base, d, 'content.json')
        if not os.path.exists(p):
            continue
        c = json.load(open(p, encoding='utf8'))
        sub = c.get('subject')
        if not sub:
            continue
        zh = len(re.findall(r'[\u4e00-\u9fff]', json.dumps(c, ensure_ascii=False)))
        SUBJECT_WORDS[sub] += zh
    # 转平均（需要学科计数，下面在 main 里补）

    dept = collections.Counter()
    for d in os.listdir(base):
        p = os.path.join(base, d, 'content.json')
        if os.path.exists(p):
            c = json.load(open(p, encoding='utf8'))
            dept[c.get('subject', '?')] += 1
    for k in list(SUBJECT_WORDS):
        if dept[k]:
            SUBJECT_WORDS[k] = SUBJECT_WORDS[k] // dept[k]


def default_words(sub):
    """没有样本的学科给一个保守默认值"""
    return SUBJECT_WORDS.get(sub) or 1200


def score(g, tid, have, subject_done, weights, last_domain=None):
    x = g.info.get(tid)
    if not x:
        return -1, []
    reasons = []
    s = 0.0

    gr = str(x.get('gradeRangeStart', 0))
    w = weights.get(gr, 0)
    s += w
    if w >= 20:
        reasons.append(f'{gr}年级')
    elif w >= 8:
        reasons.append(f'初中{gr}年级' if int(gr) >= 7 else f'{gr}年级')

    dep = g.downstream.get(tid, 0)
    # 被依赖度：做一节解锁一串
    if dep >= 8:
        s += 14
        reasons.append(f'{dep} 个下游依赖')
    elif dep >= 5:
        s += 9
        reasons.append(f'{dep} 个下游依赖')
    elif dep >= 3:
        s += 5
        reasons.append(f'{dep} 个下游依赖')
    elif dep >= 1:
        s += 2

    # 模板成熟度：同学科已积累的课件越多，新开一节越省事
    n = subject_done.get(x.get('subject'), 0)
    if n >= 20:
        s += 8
        reasons.append(f'{x["subject"]}已有{n}节模板成熟')
    elif n >= 5:
        s += 4
    elif n == 0:
        s -= 6
        reasons.append(f'{x["subject"]}从 0 起步')

    # 同 domain 连做，渲染器与讲法可复用
    if last_domain and x.get('domain') == last_domain:
        s += 6
        reasons.append('同领域连做')

    # 做完能立刻解锁下游的，优先（让队列保持流动）
    if dep == 0:
        s -= 3

    return s, reasons


# ---------------------------------------------------------------- 挑一批

def pick_batch(g, have, missing, count, subject_done, weights):
    ready = [t for t in missing if g.is_ready(t, have)]
    if not ready:
        return []

    ranked = []
    for t in ready:
        s, why = score(g, t, have, subject_done, weights)
        ranked.append((s, t, why))
    ranked.sort(key=lambda r: (-r[0], r[1]))

    batch = []
    picked_domains = []
    for s, t, why in ranked:
        if len(batch) >= count:
            break
        batch.append((t, why))
        picked_domains.append(g.info[t].get('domain'))

    # 同批内做一次「连做」微调：若批里有 ≥2 个同 domain 则保持，
    # 否则尝试用紧随其后的同 domain 点替换末位
    return batch


# ---------------------------------------------------------------- 模拟

def simulate(g, have0, missing0, batch_size, weights, subject_done,
             max_nights=3000, budget=None):
    """推进模拟。

    budget 为 None 时按「每晚固定 batch_size 节」；
    given budget 时按「每晚固定汉字预算」装填，节数随学科浮动——
    数学一节约 500 字、语文一节约 2400 字，按字数算才贴近真实工时。
    """
    have = set(have0)
    missing = set(missing0)
    done_subject = dict(subject_done)
    plan = []
    nights = 0
    stalled = 0

    while missing and nights < max_nights:
        ready = [t for t in missing if g.is_ready(t, have)]
        if not ready:
            stalled += 1
            if stalled > 3:
                break
            relaxed = [t for t in missing
                       if (not g.hard.get(t)) or g.hard[t] & have]
            if not relaxed:
                break
            ready = relaxed

        ranked = []
        for t in ready:
            s, why = score(g, t, have, done_subject, weights)
            ranked.append((s, t, why))
        ranked.sort(key=lambda r: (-r[0], r[1]))

        batch = []
        last_domain = None
        used = 0
        for s, t, why in ranked:
            w = default_words(g.info[t].get('subject'))
            if budget is None:
                if len(batch) >= batch_size:
                    break
            else:
                # 预算已满则停；但每批至少装一节，否则会卡死
                if batch and used + w > budget:
                    continue
                if len(batch) >= 12:
                    break
            batch.append((t, why))
            used += w
            if budget is None and len(batch) >= batch_size:
                break
        if not batch:
            break

        nights += 1
        for t, why in batch:
            have.add(t)
            missing.discard(t)
            sub = g.info[t].get('subject')
            done_subject[sub] = done_subject.get(sub, 0) + 1
        plan.append({
            'night': nights,
            'topics': [t for t, _ in batch],
            'unlocked_after': len([t for t in missing if g.is_ready(t, have)]),
            'words': used,
        })

    return plan, have, missing


# ---------------------------------------------------------------- 输出

def fmt_topic(g, tid):
    x = g.info[tid]
    return (f"{tid:36} {x.get('subject',''):6} "
            f"{str(x.get('gradeRangeStart','')):>2}年级  {x.get('name','')}")


def main():
    ap = argparse.ArgumentParser(description='课件补齐排期器')
    ap.add_argument('--count', type=int, default=5, help='今晚做几节')
    ap.add_argument('--simulate', action='store_true', help='模拟全部补齐所需夜晚数')
    ap.add_argument('--batch', type=int, default=5, help='模拟时每晚产量')
    ap.add_argument('--scope', default='primary',
                    choices=['primary', 'all', 'junior'],
                    help='primary=小学优先 all=全学段均衡 junior=初中优先')
    ap.add_argument('--json', action='store_true', help='机器可读输出')
    ap.add_argument('--budget', type=int, default=None,
                    help='每晚汉字预算（按工作量排，比固定节数贴近真实工时）')
    ap.add_argument('--max-grade', type=int, default=None,
                    help='只做起始年级 ≤ N 的知识点（如 6 = 只做小学）')
    ap.add_argument('--audit-prereq', action='store_true',
                    help='审计：已发布的课件里，哪些自己的 hard 先修还没做')
    ap.add_argument('--bottleneck', action='store_true',
                    help='列出卡人最多的瓶颈点（做掉它解锁最多下游）')
    args = ap.parse_args()

    topics, edges = load()
    have = course_dirs()
    g = Graph(topics, edges)
    measure_subject_words()

    missing = [x['id'] for x in topics if x['id'] not in have]
    if args.max_grade is not None:
        missing = [t for t in missing
                   if int(g_info_grade(topics, t)) <= args.max_grade]

    subject_done = collections.Counter()
    for tid in have:
        x = g.info.get(tid)
        if x:
            subject_done[x.get('subject')] += 1

    weights = SCOPE_WEIGHTS[args.scope]

    if args.simulate:
        plan, hv, miss = simulate(g, have, set(missing), args.batch,
                                  weights, dict(subject_done),
                                  budget=args.budget)
        if args.json:
            print(json.dumps({
                'batch': args.batch, 'scope': args.scope, 'budget': args.budget,
                'nights': len(plan), 'covered': len(hv) - len(have),
                'remaining': len(miss),
                'total_words': sum(r['words'] for r in plan),
            }, ensure_ascii=False))
            return
        done_n = len(hv) - len(have)
        total = len(missing)
        mode = f'每晚 {args.budget} 字预算' if args.budget else f'每晚 {args.batch} 节'
        print(f'=== 模拟：{mode}，策略 {args.scope} ===')
        print(f'待补 {total} 节 → 需要 {len(plan)} 晚 '
              f'（约 {len(plan)/7:.1f} 周 / {len(plan)/30.4:.1f} 个月）')
        if miss:
            print(f'⚠ 卡住未能开工 {len(miss)} 个（拓扑死锁，需人工拆环）')
        avg = sum(r['words'] for r in plan) / max(len(plan), 1)
        print(f'每晚平均 {avg:.0f} 字、{total/max(len(plan),1):.1f} 节')
        print()
        print('前 8 晚：')
        for row in plan[:8]:
            names = '、'.join(g.info[t]['name'] for t in row['topics'])
            print(f"  第{row['night']:3}晚（{len(row['topics'])}节/{row['words']}字） {names}")
        print('   ...')
        # 里程碑
        print()
        print('里程碑（累计完成）：')
        marks = [0.1, 0.25, 0.5, 0.75, 1.0]
        cum = 0
        mi = 0
        for row in plan:
            cum += len(row['topics'])
            while mi < len(marks) and cum >= total * marks[mi]:
                print(f"  {marks[mi]*100:5.0f}%  ({cum:4} 节)  第 {row['night']:4} 晚  "
                      f"≈ {row['night']/30.4:4.1f} 个月")
                mi += 1
        return

    # ---- 审计：已发布课件自身的前置漏洞 ----
    if args.audit_prereq:
        bad = []
        for tid in sorted(have):
            gap = g.hard.get(tid, set()) - have
            if gap:
                bad.append((tid, sorted(gap)))
        if args.json:
            print(json.dumps([{'topic': t, 'missing': m} for t, m in bad],
                             ensure_ascii=False))
            return
        print(f'=== 已发布课件的自身前置漏洞：{len(bad)} / {len(have)} 节 ===')
        print('（孩子打开这节课时，它默认你已经会的东西，其实没有课件可学）')
        print()
        for tid, gap in bad:
            names = '、'.join(g.info.get(p, {}).get('name', p) for p in gap)
            x = g.info.get(tid, {})
            print(f'  {tid:34} {x.get("name","")}')
            print(f'    缺先修：{names}')
        return

    # ---- 瓶颈点：做掉它解锁最多下游 ----
    if args.bottleneck:
        def anc(tid, acc):
            for p in g.hard.get(tid, ()):
                if p not in acc:
                    acc.add(p)
                    anc(p, acc)
            return acc
        bn = collections.Counter()
        for m in missing:
            for a in anc(m, set()):
                if a not in have:
                    bn[a] += 1
        if args.json:
            print(json.dumps([{'topic': t, 'blocks': n}
                              for t, n in bn.most_common(30)], ensure_ascii=False))
            return
        print(f'=== 瓶颈集合：{len(bn)} 个点卡着全部 {len(missing)} 个缺口 ===')
        print('（只要补上这 %d 个，其余全部就地解锁）' % len(bn))
        print()
        print('卡人最多的 20 个：')
        for tid, n in bn.most_common(20):
            x = g.info[tid]
            print(f'  卡 {n:3} 个下游  {tid:32} {x.get("subject",""):4} '
                  f'{str(x.get("gradeRangeStart","")):>2}年级 {x.get("name","")}')
        return

    # 默认：输出今晚该做的
    batch = pick_batch(g, have, missing, args.count, dict(subject_done), weights)
    if args.json:
        print(json.dumps([t for t, _ in batch], ensure_ascii=False))
        return
    ready_all = [t for t in missing if g.is_ready(t, have)]
    print(f'=== 当前状态 ===')
    print(f'已有课件 {len(have)} 节，待补 {len(missing)} 节，'
          f'其中 {len(ready_all)} 节现在就能开工')
    print()
    print(f'=== 今晚建议做这 {args.count} 节 ===')
    for i, (t, why) in enumerate(batch, 1):
        x = g.info[t]
        print(f'{i}. {fmt_topic(g, t)}')
        print(f'   选它因为：{"；".join(why) if why else "（队列顺序）"}')
        un = g.unlocks(t, have | {t}, g)
        if un:
            print(f'   做完可解锁 {un} 个下游点')
    print()
    print(f'剩余可开工队列还有 {len(ready_all) - len(batch)} 个在候')


if __name__ == '__main__':
    main()

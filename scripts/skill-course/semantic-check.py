#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""测验语义一致性回归检查（防止「选项打散后忘同步 answer」）。

背景：score-course.mjs / test-course.js 都把 config.js 里的 answer 直接当作
正确答案，因此只能验证「按 answer 点击能得分」，无法发现 answer 指向了错误
选项。本检查器改为按「正确答案文本」断言：从 src/<topicId>/pages.html 提取
每题三个选项，从 config.js 取 answer，断言 opts[answer] 等于 quiz-expected.json
中人工核对过的正确文本。

覆盖范围：quiz-expected.json 中登记的课件（当前为六年级数学 16 课，224 题）。
新增课件时，把其 14 题的正确答案文本按 前测3/中测一3/中测二3/后测5 顺序
追加到 quiz-expected.json 即可纳入回归。

用法：
    python3 scripts/skill-course/semantic-check.py                # 检查全部
    python3 scripts/skill-course/semantic-check.py mt_proportion  # 只查指定课件
退出码：0 全部一致；1 存在不一致或结构异常。
"""
import html as htmlmod
import io
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
EXPECTED = os.path.join(HERE, 'quiz-expected.json')
SRC = os.path.join(HERE, 'src')

OPT_RE = re.compile(
    r'<div class="opt" data-idx="(\d+)"><span class="badge">[A-Z]</span>(.*?)</div>',
    re.S)


def parse_topic(topic):
    d = os.path.join(SRC, topic)
    pages = io.open(os.path.join(d, 'pages.html'), encoding='utf-8').read()
    cfg = io.open(os.path.join(d, 'config.js'), encoding='utf-8').read()
    raw = OPT_RE.findall(pages)
    opts = [(int(i), htmlmod.unescape(re.sub(r'<[^>]+>', '', t)).strip())
            for i, t in raw]
    answers = [int(x) for x in re.findall(r'answer:\s*(\d+)', cfg)]
    if len(opts) != 42 or len(answers) != 14:
        return None, '结构异常：选项 %d 个（应 42）、answer %d 个（应 14）' % (
            len(opts), len(answers))
    got = []
    for k, ans in enumerate(answers):
        group = opts[k * 3:(k + 1) * 3]
        if [i for i, _ in group] != [0, 1, 2]:
            return None, '第 %d 题选项 data-idx 不是 0/1/2' % (k + 1)
        got.append(group[ans][1] if 0 <= ans < 3 else '<answer 越界 %d>' % ans)
    return got, None


def main():
    exp = json.load(io.open(EXPECTED, encoding='utf-8'))
    targets = sys.argv[1:] or list(exp.keys())
    total, bad = 0, 0
    for topic in targets:
        want = exp.get(topic)
        if not want:
            print('[SKIP] %-20s 未登记期望表' % topic)
            continue
        got, err = parse_topic(topic)
        if err:
            print('[FAIL] %-20s %s' % (topic, err))
            bad += 1
            continue
        if len(want) != 14:
            print('[FAIL] %-20s 期望表题数 %d（应 14）' % (topic, len(want)))
            bad += 1
            continue
        diff = [(i + 1, got[i], want[i]) for i in range(14) if got[i] != want[i]]
        total += 14
        if diff:
            bad += len(diff)
            for i, g, w in diff:
                print('[FAIL] %-20s 第%2d题  answer 指向「%s」  期望「%s」'
                      % (topic, i, g, w))
        else:
            print('[PASS] %-20s 14 题' % topic)
    print('SEMANTIC_CHECK: %s  校验 %d 题，不一致 %d 处'
          % ('PASS' if bad == 0 else 'FAIL', total, bad))
    return 0 if bad == 0 else 1


if __name__ == '__main__':
    sys.exit(main())

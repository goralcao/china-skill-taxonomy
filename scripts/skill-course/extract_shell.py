#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""从 courses/mt_time-hms/index.html 抽出可复用的页面驱动课件外壳。

输出 scripts/skill-course/shell.html，含 7 个占位符：
  @@TITLE@@     <title> 内容
  @@ROOT@@      :root 配色块
  @@CSS_EXTRA@@ 课程追加 CSS（插在 </style> 前）
  @@NAV@@       顶部导航 chips
  @@PAGES@@     12 个 <section class="page">
  @@CONFIG@@    PAGE_IDS / PAGE_LABELS / QUIZZES
  @@ON_PAGE_ENTER@@ onPageEnter 的 if 分支体
  @@COURSE_JS@@ 课程自有 JS（仿真、绘图、附加交互）

用法：python3 scripts/skill-course/extract_shell.py
自检：python3 scripts/skill-course/extract_shell.py --verify
      （用 shell + mt_time-hms 的原始分块重装，与现文件 diff，必须 0 差异）
"""
import sys, os, difflib

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = os.path.join(ROOT, 'courses', 'mt_time-hms', 'index.html')
OUT = os.path.join(ROOT, 'scripts', 'skill-course', 'shell.html')

# 1-indexed 行区间（与原文件对齐，见 grep 结果）
B = dict(
    title=6,
    root=(9, 15),
    style_end=480,       # </style> 所在行
    nav=(486, 499),
    pages=(508, 1014),
    config=(1286, 1325),
    onenter=(1413, 1459),  # function onPageEnter(i) { ... } 的分支体
    course_js=(1726, 1941),
)


def load():
    with open(SRC, encoding='utf-8') as f:
        return f.read().split('\n')


def seg(lines, a, b):
    return '\n'.join(lines[a - 1:b])


def build(lines):
    parts = []
    parts.append(seg(lines, 1, B['title'] - 1))
    parts.append('@@TITLE@@')
    parts.append(seg(lines, B['title'] + 1, B['root'][0] - 1))
    parts.append('@@ROOT@@')
    parts.append(seg(lines, B['root'][1] + 1, B['style_end'] - 1))
    parts.append('@@CSS_EXTRA@@')
    parts.append(seg(lines, B['style_end'], B['nav'][0] - 1))
    parts.append('@@NAV@@')
    parts.append(seg(lines, B['nav'][1] + 1, B['pages'][0] - 1))
    parts.append('@@PAGES@@')
    parts.append(seg(lines, B['pages'][1] + 1, B['config'][0] - 1))
    parts.append('@@CONFIG@@')
    parts.append(seg(lines, B['config'][1] + 1, B['onenter'][0] - 1))
    parts.append('@@ON_PAGE_ENTER@@')
    parts.append(seg(lines, B['onenter'][1] + 1, B['course_js'][0] - 1))
    parts.append('@@COURSE_JS@@')
    parts.append(seg(lines, B['course_js'][1] + 1, len(lines)))
    return '\n'.join(parts)


def verify(lines, shell):
    # 用真实分块把占位符填回去，逐字节比对
    fill = {
        '@@TITLE@@': lines[B['title'] - 1],
        '@@ROOT@@': seg(lines, *B['root']),
        '@@CSS_EXTRA@@': '',
        '@@NAV@@': seg(lines, *B['nav']),
        '@@PAGES@@': seg(lines, *B['pages']),
        '@@CONFIG@@': seg(lines, *B['config']),
        '@@ON_PAGE_ENTER@@': seg(lines, *B['onenter']),
        '@@COURSE_JS@@': seg(lines, *B['course_js']),
    }
    out = shell
    # 空的 CSS_EXTRA 会留下一个空行，比对前整行抹掉（build_course.py 用同一约定）
    out = out.replace('@@CSS_EXTRA@@\n', '') if not fill['@@CSS_EXTRA@@'] else out
    for k, v in fill.items():
        if k == '@@CSS_EXTRA@@' and not v:
            continue
        out = out.replace(k, v, 1)
    # CSS_EXTRA 为空时会产生一个空行，比对前归一
    rebuilt = out.split('\n')
    orig = lines
    if len(rebuilt) != len(orig):
        print('行数不同：rebuilt=%d orig=%d' % (len(rebuilt), len(orig)))
        for l in list(difflib.unified_diff(orig, rebuilt, 'orig', 'rebuilt', lineterm=''))[:40]:
            print(l)
        return False
    bad = [(i + 1, a, b) for i, (a, b) in enumerate(zip(orig, rebuilt)) if a != b]
    if bad:
        print('有 %d 行不一致，前 10 处：' % len(bad))
        for ln, a, b in bad[:10]:
            print('  L%d\n    orig: %r\n    new : %r' % (ln, a, b))
        return False
    print('verify OK：shell 可无损还原 mt_time-hms（%d 行 / %d 字节）' % (len(orig), len('\n'.join(orig))))
    return True


def main():
    lines = load()
    shell = build(lines)
    if '--verify' in sys.argv:
        ok = verify(lines, shell)
        sys.exit(0 if ok else 1)
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(shell)
    print('写出 %s（%d 字节，%d 个占位符）' % (OUT, len(shell.encode()), shell.count('@@')//2))


if __name__ == '__main__':
    main()

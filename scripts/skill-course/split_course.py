#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把已有的 courses/<topicId>/index.html 反向拆成分片目录（用于把 mt_time-hms 变成模板）。

只在需要「从成品回填模板」时用；日常流程是改分片 → build_course.py 装配。
行边界与 extract_shell.py 保持一致，因此拆完立刻重装必须 0 差异。
"""
import sys, os, json, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = os.path.join(ROOT, 'scripts', 'skill-course', 'src')

B = dict(title=6, root=(9, 15), style_end=480, nav=(486, 499),
         pages=(508, 1014), config=(1286, 1325), onenter=(1413, 1459), course_js=(1726, 1941))


def main(topic):
    path = os.path.join(ROOT, 'courses', topic, 'index.html')
    lines = open(path, encoding='utf-8').read().split('\n')
    d = os.path.join(SRC, topic)
    os.makedirs(d, exist_ok=True)

    def w(name, text):
        with open(os.path.join(d, name), 'w', encoding='utf-8') as f:
            f.write(text)

    title = lines[B['title'] - 1]
    title = re.sub(r'^<title>|</title>$', '', title)
    nav = []
    for ln in lines[B['nav'][0] - 1:B['nav'][1]]:
        m = re.search(r'<span class="([^"]*)" data-page="(\d+)">([^<]*)</span>', ln)
        if not m:
            continue
        cls = m.group(1).replace('chip', '').strip()
        if 'chip-end' in m.group(1):
            cls = 'end'
        nav.append({'label': m.group(3), 'page': int(m.group(2)), 'cls': cls})
    w('meta.json', json.dumps({'title': title, 'nav': nav}, ensure_ascii=False, indent=2) + '\n')
    w('root.css', '\n'.join(lines[B['root'][0] - 1:B['root'][1]]) + '\n')
    # style 末尾到 nav 之间的空档里没有课程 CSS（mt_time-hms 是全量内联），extra 留空
    w('extra.css', '')
    w('pages.html', '\n'.join(lines[B['pages'][0] - 1:B['pages'][1]]) + '\n')
    w('config.js', '\n'.join(lines[B['config'][0] - 1:B['config'][1]]) + '\n')
    w('onenter.js', '\n'.join(lines[B['onenter'][0] - 1:B['onenter'][1]]) + '\n')
    w('course.js', '\n'.join(lines[B['course_js'][0] - 1:B['course_js'][1]]) + '\n')
    print('拆出 %s：%d 个分片文件' % (topic, len(os.listdir(d))))


if __name__ == '__main__':
    main(sys.argv[1])

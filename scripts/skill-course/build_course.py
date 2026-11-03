#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把 src/<topicId>/ 的分片装配成 courses/<topicId>/index.html。

分片目录约定
  meta.json     { "title": "...", "nav": [ {"label":"封面","page":0,"cls":"active"}, ... ] }
  root.css      覆盖 shell 的 :root 配色块（必填；不含 :root 包裹，只写变量行）
  extra.css     课程追加 CSS（可为空文件）
  pages.html    12 个 <section class="page">
  config.js     PAGE_IDS / PAGE_LABELS / IMG_PREFIX / curPage / QUIZZES
  onenter.js    onPageEnter(i) 的分支体（if (id === 'p3') { ... } 这一段）
  course.js     课程自有 JS：绘图、仿真、附加交互

用法
  python3 scripts/skill-course/build_course.py mt_addsub-10000
  python3 scripts/skill-course/build_course.py --all
"""
import sys, os, json, glob, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SKILL = os.path.join(ROOT, 'scripts', 'skill-course')
SHELL = os.path.join(SKILL, 'shell.html')
SRC = os.path.join(SKILL, 'src')

CHIP_CLS = {'': 'chip', 'active': 'chip active', 'pre': 'chip pre', 'mid': 'chip mid',
            'post': 'chip post', 'sim': 'chip sim', 'end': 'chip chip-end'}


def read(p):
    if not os.path.exists(p):
        return ''
    with open(p, encoding='utf-8') as f:
        return f.read()


def block(p):
    """分片文件末尾只有一个分隔换行，读入后去掉它才是原始行区间。"""
    t = read(p)
    return t[:-1] if t.endswith('\n') else t


def nav_html(nav):
    out = ['<nav id="topNav">']
    for it in nav:
        cls = CHIP_CLS.get(it.get('cls', ''), 'chip')
        out.append('  <span class="%s" data-page="%d">%s</span>' % (cls, it['page'], it['label']))
    out.append('</nav>')
    return '\n'.join(out)


def build(topic):
    d = os.path.join(SRC, topic)
    if not os.path.isdir(d):
        raise SystemExit('找不到分片目录：' + d)
    meta = json.loads(read(os.path.join(d, 'meta.json')))
    root_css = read(os.path.join(d, 'root.css'))
    # 占位符 @@ROOT@@ 替的是整块 :root{...}，漏写包裹会让 var() 全部失效（白底白字）
    if not root_css.strip().startswith(':root') or not root_css.rstrip().endswith('}'):
        raise SystemExit('root.css 必须是完整的 :root{ ... } 块：' + d)
    html = read(SHELL)
    extra = read(os.path.join(d, 'extra.css')).strip('\n')
    if extra:
        extra = '\n' + extra
    fill = [
        ('@@TITLE@@', '<title>%s</title>' % meta['title']),
        ('@@ROOT@@', block(os.path.join(d, 'root.css'))),
        ('@@CSS_EXTRA@@', extra),
        ('@@NAV@@', nav_html(meta['nav'])),
        ('@@PAGES@@', block(os.path.join(d, 'pages.html'))),
        ('@@CONFIG@@', block(os.path.join(d, 'config.js'))),
        ('@@ON_PAGE_ENTER@@', block(os.path.join(d, 'onenter.js'))),
        ('@@COURSE_JS@@', block(os.path.join(d, 'course.js'))),
    ]
    for k, v in fill:
        if k == '@@CSS_EXTRA@@' and not v:
            html = html.replace('@@CSS_EXTRA@@\n', '')
            continue
        if k not in html:
            raise SystemExit('shell 缺少占位符 ' + k)
        html = html.replace(k, v, 1)
    if '@@' in html:
        raise SystemExit('仍有未替换的占位符：' + str([l for l in html.split('\n') if '@@' in l][:3]))
    out_dir = os.path.join(ROOT, 'courses', topic)
    os.makedirs(out_dir, exist_ok=True)
    out = os.path.join(out_dir, 'index.html')
    with open(out, 'w', encoding='utf-8') as f:
        f.write(html)
    print('%s → %s（%d 字节，%d 页）' % (topic, os.path.relpath(out, ROOT),
                                       len(html.encode()),
                                       len(re.findall(r'<section class="page[^"]*"\s+id=', html))))
    return out


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if '--all' in sys.argv:
        args = sorted(os.path.basename(os.path.dirname(p)) for p in glob.glob(os.path.join(SRC, '*', 'meta.json')))
    if not args:
        raise SystemExit(__doc__)
    for t in args:
        build(t)


if __name__ == '__main__':
    main()

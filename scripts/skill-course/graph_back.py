#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""给第四代课件注入「返回图谱」常驻入口（幂等）。

问题
----
老引擎 `pages.html` 的封面有一行 `../../viz/index.html#t=<topicId>` 相对链接，
本地双击可用，但课件发布到资料库后是**单文件托管**，这个相对路径必然 404；
第四代 12 页课件升级时又把这行整体丢了。于是线上 89 课全部没有可用入口，
本地也只有前 36 课有一个「点了也回不去」的死链。

本模块统一改成运行时按协议自适应的入口：

  file://  → ../../viz/index.html#t=<id>     （courses/<id>/index.html 直接打开）
             ../../index.html#t=<id>         （viz/courses/<id>/ 图谱内嵌副本）
  https:// → https://acd118508358062b1.app.workbuddy.host/?sharecode=DHL4TJAQCG#t=<id>

带 `#t=<topicId>` 深链，图谱会自动展开领域、选中并聚焦到该课节点（viz/index.html
的 readHash 支持 t 参数）。

设计约束
--------
* 只在 `</body>` 前追加一个自包含块，**不改动任何现有 DOM 结构**——4A 注入、
  pagesync 40 项、prepublish-check 的文本匹配都不受影响。
* 按钮由脚本运行时创建，左下角常驻，z-index 450；底部居中教师端入口
  `#navBtns` 是 z-index 500，绝不与之争层级。
* 幂等：重复执行先移除旧标记块再重插；同时静态清理老引擎的相对路径死链。
* 不触碰 `NODE_ID` / `PUBLISH_BASE` / MQTT 等 4A 常量。

用法
----
  python3 scripts/skill-course/graph_back.py --all               # courses + deploy 全量注入
  python3 scripts/skill-course/graph_back.py --all --check       # 只校验，不写文件
  python3 scripts/skill-course/graph_back.py --topic mt_xxx      # 单课
  python3 scripts/skill-course/graph_back.py --all --dir deploy  # 只处理某一侧
"""
import sys
import os
import re
import io
import json
import argparse

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ONLINE_GRAPH = 'https://acd118508358062b1.app.workbuddy.host/?sharecode=DHL4TJAQCG'
START = '<!-- GRAPH-BACK-START -->'
END = '<!-- GRAPH-BACK-END -->'

# 老引擎封面残留：整行相对链接（本地可用，线上 404）。注入时静态删除。
OLD_LINK = re.compile(
    r'[ \t]*<a\s+href="\.\./\.\./viz/index\.html#t=[^"]*"[^>]*>[^<]*</a>[ \t]*\n?')

CSS = """
#graphBack{position:fixed;left:14px;bottom:20px;z-index:450;
  display:inline-flex;align-items:center;padding:7px 14px;border-radius:20px;
  background:rgba(18,30,48,.84);color:#fff;text-decoration:none;
  font:600 14px/1.2 system-ui,-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;
  letter-spacing:.3px;border:1px solid rgba(255,255,255,.30);
  box-shadow:0 3px 12px rgba(0,0,0,.25);
  backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}
#graphBack:hover{background:rgba(18,30,48,.97)}
/* 小屏：底部居中 navBtns 约占 x=94..282（375 宽），按钮必须收在 x<94 内，避免相交 */
@media(max-width:640px){#graphBack{left:8px;bottom:14px;padding:4px 7px;font-size:11px;letter-spacing:0;border-radius:14px}}
"""

JS_HEAD = """
(function(){
  if (document.getElementById('graphBack')) return;
  var TID = %s, ONLINE = %s;
  var a = document.createElement('a');
  a.id = 'graphBack';
  a.textContent = '\\u2190 \\u5b66\\u9636\\u56fe\\u8c31';
  a.title = '\\u56de\\u5230\\u5b66\\u9636\\u56fe\\u8c31\\uff0c\\u5b9a\\u4f4d\\u5230\\u8fd9\\u4e00\\u8bfe';
  a.setAttribute('data-topic', TID);
  var base;
  if (location.protocol === 'file:') {
    // 本地两种副本：courses/<id>/ 与 viz/courses/<id>/（图谱内嵌版路径层级不同）
    var inViz = /[\\/\\\\]viz[\\/\\\\]courses[\\/\\\\]/.test(location.pathname);
    base = '../../' + (inViz ? '' : 'viz/') + 'index.html';
  } else {
    // 资料库单文件托管：相对路径无效，必须用在线图谱站的绝对地址
    base = ONLINE;
  }
  a.href = base + '#t=' + encodeURIComponent(TID);
  document.body.appendChild(a);
  // 兜底：即便静态清理遗漏，运行时也移除会 404 的老引擎死链
  var old = document.querySelector('a[href^="../../viz/index.html"]');
  if (old && old !== a) old.parentNode.removeChild(old);
})();
"""


def block(topic):
    js = JS_HEAD % (json.dumps(topic), json.dumps(ONLINE_GRAPH))
    return START + '\n<style>' + CSS + '</style>\n<script>' + js + '</script>\n' + END + '\n'


def inject(html, topic):
    """返回注入后的 HTML；幂等。"""
    # 1) 移除旧的标记块（含尾部空白）
    s = re.sub(re.escape(START) + r'.*?' + re.escape(END) + r'[ \t]*\n?',
               '', html, flags=re.S)
    # 2) 静态清理老引擎相对路径死链
    s = OLD_LINK.sub('', s)
    if '</body>' not in s:
        raise ValueError('缺少 </body>，无法注入返回图谱入口')
    # 3) 追加到 body 末尾
    return s.replace('</body>', block(topic) + '</body>', 1)


def remove(html):
    """移除注入块（回滚用），不恢复任何已清理内容。"""
    return re.sub(re.escape(START) + r'.*?' + re.escape(END) + r'[ \t]*\n?',
                  '', html, flags=re.S)


def targets(side, topic):
    out = []
    for d in ('courses', 'deploy'):
        if side != 'all' and side != d:
            continue
        base = os.path.join(ROOT, d)
        names = [topic] if topic else sorted(
            x for x in os.listdir(base) if x.startswith('mt_'))
        for name in names:
            p = os.path.join(base, name, 'index.html')
            if not os.path.isfile(p):
                continue
            # 只处理第四代 12 页 shell 课件。老引擎遗留课件（如高中物理三课）
            # 用 <header> 模板、自带「← 回到图谱」与「接着学」延伸卡，不在本模块范围。
            s = io.open(p, encoding='utf-8').read()
            if '<nav id="topNav">' not in s:
                continue
            out.append((d, name, p))
    return out


def check_one(side, name, s):
    """校验传入的 HTML **内容**（不是路径）。"""
    errs = []
    if START not in s or END not in s:
        errs.append('缺标记块')
    if 'id = \'graphBack\'' not in s and 'id="graphBack"' not in s and "a.id = 'graphBack'" not in s:
        errs.append('缺 graphBack 创建逻辑')
    if 'href="../../viz/index.html' in s:
        errs.append('残留老引擎死链')
    if ONLINE_GRAPH not in s:
        errs.append('缺在线图谱地址')
    if side == 'deploy' and "var NODE_ID = '" not in s:
        errs.append('NODE_ID 丢失')
    return errs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--all', action='store_true', help='处理全部 mt_* 课件')
    ap.add_argument('--topic', help='只处理指定 topicId')
    ap.add_argument('--dir', choices=['courses', 'deploy', 'all'], default='all')
    ap.add_argument('--check', action='store_true', help='只校验，不写文件')
    a = ap.parse_args()
    if not a.all and not a.topic:
        ap.error('需要 --all 或 --topic <id>')

    ts = targets(a.dir, a.topic)
    if not ts:
        raise SystemExit('没有匹配的课件文件')

    ok = bad = changed = 0
    for side, name, path in ts:
        s = io.open(path, encoding='utf-8').read()
        new = inject(s, name)
        if not a.check:
            if new != s:
                io.open(path, 'w', encoding='utf-8').write(new)
                changed += 1
        errs = check_one(side, name, new if not a.check else s)
        if errs:
            bad += 1
            print('FAIL %-8s %-24s %s' % (side, name, ', '.join(errs)))
        else:
            ok += 1
    print('---- %s：%d 个文件，校验通过 %d / 失败 %d，实际改写 %d ----'
          % ('CHECK' if a.check else 'INJECT', len(ts), ok, bad, changed))
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())

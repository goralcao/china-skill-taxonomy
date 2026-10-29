/* 学阶图谱课件 · 渲染引擎
 *
 * 手写页面适合一次性精品，但一册 30 个就会失控：
 * 每份 HTML 都在重复导航、判分、结算、图谱延伸。
 *
 * 这个引擎把那些重复收进一份，课件只留 content.json：
 *   { topicId, title, template, renderer, steps: [...] }
 *
 * step 类型见下方 RENDER 表。渲染器来自 CR.*，图谱连接件来自 CR.graphNav / CR.extend。
 */
(function (global) {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var h = function (tag, cls, text) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text != null) el.textContent = text;
    return el;
  };

  function mount(content) {
    var C = content;
    var G = global.__GRAPH || null;
    var answers = [];          // { id, ok, first }
    var state = {};            // stepIndex -> { solved, attempts, first }
    var cur = 0;
    var startedAt = Date.now();
    var total = C.steps.length;
    // 语文课件走另一套学程：过关看「有没有留下痕迹」，不看「有没有选对」
    var LANG = C.subject === '语文';

    /* ── 外壳 ─────────────────────────────────────────── */
    var header = h('header');
    var back = h('a', 'back', '← 回到图谱');
    back.href = '../../viz/index.html#t=' + C.topicId;
    header.appendChild(back);
    var tag = h('span', 'muted', C.subject + ' · ' + C.grade + ' 年级 · ' + C.title);
    tag.style.marginLeft = 'auto';
    header.appendChild(tag);

    var main = h('main');
    var gnav = h('div');
    gnav.id = 'gnav';
    main.appendChild(gnav);

    var stage = h('div');
    main.appendChild(stage);

    var footer = h('footer');
    var prog = h('div', 'progress');
    var pnum = h('span', null, '');
    var bar = h('div', 'bar');
    var fill = h('i');
    bar.appendChild(fill);
    prog.appendChild(pnum);
    prog.appendChild(bar);
    var btnPrev = h('button', 'btn', '上一步');
    btnPrev.id = 'prev';
    btnPrev.setAttribute('aria-label', '上一步');
    var btnNext = h('button', 'btn primary', '下一步');
    btnNext.id = 'next';
    footer.appendChild(prog);
    footer.appendChild(btnPrev);
    footer.appendChild(btnNext);

    document.body.appendChild(header);
    document.body.appendChild(main);
    document.body.appendChild(footer);

    if (G && CR.graphNav) CR.graphNav(gnav, G);
    else gnav.style.display = 'none';

    /* ── 各 step 的渲染 ───────────────────────────────── */
    var RENDER = {
      intro: function (s) {
        var f = document.createDocumentFragment();
        f.appendChild(h('h1', null, s.title));
        if (s.lead) f.appendChild(h('p', 'muted', s.lead));
        (s.bullets || []).forEach(function (b) {
          var card = h('div', 'card' + (b.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + b.text + '</p>';
          f.appendChild(card);
        });
        return f;
      },

      text: function (s) {
        var f = document.createDocumentFragment();
        f.appendChild(h('h2', null, s.title));
        (s.paras || []).forEach(function (p) {
          var el = h('p', s.muted ? 'muted' : null);
          el.innerHTML = p;
          f.appendChild(el);
        });
        if (s.note) {
          var card = h('div', 'card tip');
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      vertical: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        var v = CR.vertical(box, {
          a: s.problem.a, b: s.problem.b, op: s.problem.op,
          carries: s.carries !== false,
          reveal: s.reveal === 'all' ? 99 : 0,
        });
        if (s.play) v.carries(false);
        if (s.reveal !== 'all') attachDemo(f, v, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      geometry: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var g = CR.geometry(box, s.shape);
        // 只有显式给 revealTo 才覆盖初始状态：分数图按 filled 初始化，不能被涂满
        if (s.revealTo != null && g.reveal) g.reveal(s.revealTo);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        if (typeof g.next === 'function') attachDemo(f, g, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      solid: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.solid(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      division: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.division(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      molecule: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.molecule(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      pyramid: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.pyramid(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      calendar: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.calendar(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      circle: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.circle(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      circleMeasure: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.circleMeasure(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      sector: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.sector(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      cylinder: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.cylinder(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      fracDiv: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.fracDiv(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      balance: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.balance(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      callTree: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.callTree(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      sentBuild: function (s, i) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var spec = s.body || s;
        // 渲染器做完最后一个动作时回报引擎：这一步"留下了痕迹"
        spec.onDone = function () {
          var st = stateOf(i);
          if (!st.solved) { st.solved = true; syncNav(); }
        };
        var ctrl = CR.sentBuild(box, spec);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      pairMatch: function (s, i) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var spec = s.body || s;
        // 渲染器做完最后一个动作时回报引擎：这一步"留下了痕迹"
        spec.onDone = function () {
          var st = stateOf(i);
          if (!st.solved) { st.solved = true; syncNav(); }
        };
        var ctrl = CR.pairMatch(box, spec);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      transform: function (s, i) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var spec = s.body || s;
        // 渲染器做完最后一个动作时回报引擎：这一步"留下了痕迹"
        spec.onDone = function () {
          var st = stateOf(i);
          if (!st.solved) { st.solved = true; syncNav(); }
        };
        var ctrl = CR.transform(box, spec);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      punctPick: function (s, i) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var spec = s.body || s;
        // 渲染器做完最后一个动作时回报引擎：这一步"留下了痕迹"
        spec.onDone = function () {
          var st = stateOf(i);
          if (!st.solved) { st.solved = true; syncNav(); }
        };
        var ctrl = CR.punctPick(box, spec);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      /* ── 语文专用：圈画 ─────────────────────────────────
       * 不讲对错，只记「你圈到了哪几处、还剩几处没被注意到」。
       * 过关条件是圈够 min 处，不是选中某个预设选项。
       */
      annotate: function (s, i) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        if (s.ask) {
          var q = h('p', 'quiz-q');
          q.innerHTML = s.ask;
          f.appendChild(q);
        }
        var b = s.body || s;
        var text = b.text || '';
        var marks = b.marks || [];
        var need = b.min || Math.min(2, marks.length || 1);

        var box = h('div', 'an-text');
        f.appendChild(box);

        // 按 marks 的出现顺序把原文切成「普通文字 / 可点的词」两段
        var segs = [], rest = text;
        marks.forEach(function (m, k) {
          var idx = rest.indexOf(m.t);
          if (idx < 0) return;
          if (idx > 0) segs.push({ t: rest.slice(0, idx) });
          segs.push({ t: m.t, k: k });
          rest = rest.slice(idx + m.t.length);
        });
        if (rest) segs.push({ t: rest });

        // 批注符号（方法课用）：先选符号，再点文章里的词
        var syms = b.symbols || null;
        var curSym = null;
        var symBtns = [];
        if (syms) {
          var sbar = h('div', 'an-syms');
          sbar.appendChild(h('span', 'an-syms-lab', b.symLabel || '先选一个符号：'));
          syms.forEach(function (sy) {
            var sb = h('button', 'an-sym');
            sb.type = 'button';
            var ic = h('i', null, sy.k);
            sb.appendChild(ic);
            sb.appendChild(document.createTextNode(sy.name));
            sb.title = sy.hint || '';
            sb.onclick = function () {
              curSym = sy.k;
              symBtns.forEach(function (x) { x.classList.remove('on'); });
              sb.classList.add('on');
              why.innerHTML = '<b>' + sy.k + ' ' + sy.name + '</b>　' + (sy.hint || '');
            };
            symBtns.push(sb);
            sbar.appendChild(sb);
          });
          f.insertBefore(sbar, box);
        }

        var stat = h('div', 'an-stat');
        var why = h('div', 'an-why', b.idle || '点你找到的词，点错也没关系。');
        var pen = null;
        var penRow = null;
        if (b.note && syms) {
          penRow = h('div', 'an-pen');
          pen = document.createElement('input');
          pen.type = 'text';
          pen.maxLength = 16;
          pen.placeholder = b.noteHint || '给这一处写句旁批（一行就够）';
          var penOk = h('button', 'btn small', '记下');
          penOk.type = 'button';
          penRow.appendChild(pen);
          penRow.appendChild(penOk);
          // 位置见下方：stat / why 之后
          penOk.onclick = function () {
            var v = pen.value.trim();
            if (v.length < 2) { why.innerHTML = '旁批写一两个字也行，写清楚你为哪句话停下来的。'; return; }
            var st = stateOf(i);
            st.pen = st.pen || [];
            st.pen.push(v);
            pen.value = '';
            why.innerHTML = '<b>旁批记下了。</b>' + v;
          };
        }
        var found = {};
        var n = 0;

        function paint() {
          var verb = syms ? '已标出' : '已圈出';
          stat.innerHTML = verb + ' <b>' + n + '</b> 处' + (n >= need ? ' · 够了，可以往下' : '，再找找');
          stat.className = 'an-stat' + (n >= need ? ' ok' : '');
        }

        segs.forEach(function (g) {
          if (g.k === undefined) { box.appendChild(document.createTextNode(g.t)); return; }
          var tok = h('span', 'an-tok', g.t);
          tok.setAttribute('role', 'button');
          tok.tabIndex = 0;
          tok.onkeydown = function (ev) {
            if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); tok.click(); }
          };
          tok.onclick = function () {
            var mk = marks[g.k];
            // 有符号系统时：必须先选符号，且符号要对
            if (syms) {
              if (!curSym) {
                why.innerHTML = '先在下面选一个符号——你要标的是<strong>关键词</strong>、<strong>人物</strong>，还是<strong>好句子</strong>？';
                return;
              }
              if (mk.sym && curSym !== mk.sym) {
                tok.classList.add('wrong');
                setTimeout(function () { tok.classList.remove('wrong'); }, 700);
                why.innerHTML = '这个符号是用来标<strong>' +
                  ((syms.filter(function (x) { return x.k === curSym; })[0] || {}).name || '别的') +
                  '</strong>的。这一处你再想想该用哪个。';
                return;
              }
            }
            if (found[g.k]) {
              why.innerHTML = '<b>' + g.t + '</b>' + (mk.why || '');
              return;
            }
            found[g.k] = true; n++;
            tok.classList.add('hit');
            if (syms) {
              tok.classList.add('symmed');
              var badge = h('span', 'an-mark', mk.sym || curSym);
              tok.insertBefore(badge, tok.firstChild);
            }
            why.innerHTML = '<b>你标出了「' + g.t + '」</b>　' + (mk.why || '');
            paint();
            if (n >= need) {
              stateOf(i).solved = true;
              stateOf(i).found = n;
              syncNav();
            }
          };
          box.appendChild(tok);
        });

        f.appendChild(stat);
        f.appendChild(why);
        if (penRow) f.appendChild(penRow);

        if (b.after) {
          var reveal = h('button', 'btn small', b.revealLabel || '看看还有哪几处没被注意到');
          reveal.type = 'button';
          var after = h('div', 'an-after');
          after.innerHTML = b.after;
          after.style.display = 'none';
          reveal.onclick = function () { after.style.display = ''; reveal.style.display = 'none'; };
          f.appendChild(reveal);
          f.appendChild(after);
        }
        paint();
        return f;
      },

      /* ── 语文专用：写下来 ───────────────────────────────
       * 开放表达：给支架、给最小篇幅、给「写完再看」的参考稿，但不判对错。
       * 提交只回答一个问题：你动笔了吗。
       */
      draft: function (s, i) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        if (s.ask) {
          var q = h('p', 'quiz-q');
          q.innerHTML = s.ask;
          f.appendChild(q);
        }
        var b = s.body || s;
        var rows = b.rows || 1;
        var chips = b.chips || [];
        var min = b.minChars || 0;
        var minPer = b.minPerRow || 2;

        var wrap = h('div', 'dr-wrap');
        f.appendChild(wrap);
        var boxes = [];
        for (var r = 0; r < rows; r++) {
          var ta = document.createElement('textarea');
          ta.className = 'dr-input';
          ta.rows = 2;
          ta.placeholder = (b.rowHints && b.rowHints[r]) || b.placeholder || '在这里写…';
          ta.setAttribute('aria-label', (b.rowHints && b.rowHints[r]) || '写一句');
          ta.oninput = count;
          boxes.push(ta);
          wrap.appendChild(ta);
        }

        if (chips.length) {
          wrap.appendChild(h('div', 'dr-tip', b.chipTip || '卡住了就点一个提示词，用不用随你：'));
          var chipRow = h('div', 'dr-chips');
          wrap.appendChild(chipRow);
          chips.forEach(function (c) {
            var cb = h('button', 'dr-chip', c);
            cb.type = 'button';
            cb.onclick = function () {
              var live = null;
              boxes.forEach(function (x) { if (document.activeElement === x) live = x; });
              var ta2 = live || boxes[boxes.length - 1];
              ta2.value += c;
              ta2.focus();
              count();
            };
            chipRow.appendChild(cb);
          });
        }

        var meta = h('div', 'dr-meta');
        wrap.appendChild(meta);
        var bar = h('div', 'dr-bar');
        f.appendChild(bar);
        var ok = h('button', 'btn small primary', b.okLabel || '我写好了');
        ok.type = 'button';
        bar.appendChild(ok);

        var sampleBtn = null, sampleBox = null;
        if (b.sample) {
          sampleBtn = h('button', 'btn small', b.sampleLabel || '写完再看别人怎么写');
          sampleBtn.type = 'button';
          bar.appendChild(sampleBtn);
          sampleBox = h('div', 'dr-sample');
          sampleBox.innerHTML = '<div class="dr-sample-head">参考稿 · 不是标准答案，只看它多了什么</div>' +
            '<p>' + b.sample + '</p>' + (b.sampleNote ? '<p class="muted">' + b.sampleNote + '</p>' : '');
          sampleBox.style.display = 'none';
          f.appendChild(sampleBox);
          sampleBtn.onclick = function () {
            sampleBox.style.display = '';
            sampleBtn.style.display = 'none';
          };
        }

        var fb = h('div');
        f.appendChild(fb);

        function count() {
          var totalChars = 0, filled = 0;
          boxes.forEach(function (x) {
            var v = x.value.replace(/\s/g, '');
            totalChars += v.length;
            if (v.length >= minPer) filled++;
          });
          meta.innerHTML = '已写 <b>' + totalChars + '</b> 字' +
            (min ? '，目标 ' + min + ' 字' : '') +
            (rows > 1 ? ' · 写满 ' + filled + ' / ' + rows + ' 行' : '');
          meta.className = 'dr-meta' + (totalChars >= min && filled === rows ? ' ok' : '');
        }

        ok.onclick = function () {
          var totalChars = 0, filled = 0;
          boxes.forEach(function (x) {
            var v = x.value.replace(/\s/g, '');
            totalChars += v.length;
            if (v.length >= minPer) filled++;
          });
          if (rows > 1 && filled < rows) {
            fb.className = 'card tip';
            fb.innerHTML = '<p style="margin:0">还有 ' + (rows - filled) + ' 行空着。想到多少写多少，写不满也能往下走。</p>';
            return;
          }
          if (totalChars < min) {
            fb.className = 'card tip';
            fb.innerHTML = '<p style="margin:0">还差 ' + (min - totalChars) + ' 个字。试着补一个「什么样的」或「怎样地」，补不上也可以往下走。</p>';
            return;
          }
          var st = stateOf(i);
          st.solved = true;
          st.draft = boxes.map(function (x) { return x.value.trim(); }).filter(Boolean).join('\n');
          fb.className = 'card ok';
          fb.innerHTML = '<p style="margin:0">' + (b.done || '记下了。往下走，回头再改一遍。') + '</p>';
          ok.disabled = true;
          syncNav();
        };

        count();
        return f;
      },

      /* ── 语文专用：自评量规 ─────────────────────────────
       * 没有分数。学生自己对照三级描述打钩，输出的是「下一步改哪里」。
       */
      rubric: function (s, i) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        if (s.lead) {
          var lead = h('p', 'muted');
          lead.innerHTML = s.lead;
          f.appendChild(lead);
        }
        var b = s.body || s;
        var dims = b.dimensions || [];
        var wrap = h('div', 'rb-wrap');
        f.appendChild(wrap);
        var chosen = {};
        var doneCount = 0;
        var result = h('div', 'rb-result');

        dims.forEach(function (d, k) {
          var row = h('div', 'rb-row');
          row.appendChild(h('div', 'rb-name', d.name));
          var opts = h('div', 'rb-opts');
          row.appendChild(opts);
          var desc = h('div', 'rb-desc', b.descIdle || '选一级，看它要求什么');
          row.appendChild(desc);
          (d.levels || []).forEach(function (lv) {
            var btn = h('button', 'rb-opt', lv.k);
            btn.type = 'button';
            btn.onclick = function () {
              [].slice.call(opts.children).forEach(function (x) { x.classList.remove('on'); });
              btn.classList.add('on');
              desc.innerHTML = lv.d;
              desc.className = 'rb-desc on';
              if (!chosen[k]) doneCount++;
              chosen[k] = lv.k;
              var st = stateOf(i);
              st.self = st.self || {};
              st.self[d.name] = lv.k;
              if (doneCount === dims.length) {
                st.solved = true;
                result.className = 'rb-result on';
                result.innerHTML = '<b>记下了。</b>' + (b.advice || '哪一维还没到「优秀」，就回头只改那一处，不用重写整句。');
                syncNav();
              } else {
                result.className = 'rb-result';
                result.textContent = '还有 ' + (dims.length - doneCount) + ' 维没评。';
              }
            };
            opts.appendChild(btn);
          });
          wrap.appendChild(row);
        });

        f.appendChild(result);
        if (b.note) {
          var card = h('div', 'card tip');
          card.innerHTML = '<p style="margin:0">' + b.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      /* ── 语文专用：预测与推想 ───────────────────────────
       * 策略课。痕迹是一条「我猜 / 因为 / 后来」的时间轴。
       * 依据必须落在揭示段之前——学生只能从已经读到的文字里找线索。
       */
      predict: function (s, i) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        if (s.ask) {
          var q = h('p', 'quiz-q');
          q.innerHTML = s.ask;
          f.appendChild(q);
        }
        var b = s.body || s;
        var rounds = b.rounds || [];
        var wrap = h('div', 'pd-wrap');
        f.appendChild(wrap);

        var textBox = h('div', 'pd-text');
        if (b.open) {
          var p0 = document.createElement('p');
          p0.innerHTML = b.open;
          textBox.appendChild(p0);
        }
        wrap.appendChild(textBox);

        var track = h('div', 'pd-track');
        wrap.appendChild(track);
        var stage = h('div');
        wrap.appendChild(stage);

        var cur = 0;
        var logs = [];

        function drawTrack() {
          track.innerHTML = '';
          rounds.forEach(function (r, k) {
            var d = h('span', 'pd-step' + (k < cur ? ' done' : (k === cur ? ' on' : '')),
              (k + 1) + '. ' + (r.label || '猜一次'));
            track.appendChild(d);
          });
        }

        function render() {
          drawTrack();
          stage.innerHTML = '';
          if (cur >= rounds.length) {
            var st = stateOf(i);
            st.solved = true;
            st.predicts = logs;
            syncNav();
            var done = h('div', 'card ok');
            done.innerHTML = '<p style="margin:0">' + (b.done ||
              '三处推想都记下了。推想不是猜中，是「拿已经读到的线索往前试」——猜错了也留下了一条线索。') + '</p>';
            stage.appendChild(done);
            return;
          }
          var r = rounds[cur];
          var pick = null;
          var bec = {};

          var ask = h('div', 'pd-ask');
          ask.innerHTML = '<b>' + (r.ask || '你猜接下来会怎样？') + '</b>';
          stage.appendChild(ask);

          var opts = h('div', 'pd-opts');
          (r.options || []).forEach(function (o, k) {
            var btn = h('button', 'pd-opt', o);
            btn.type = 'button';
            btn.onclick = function () {
              pick = k;
              [].slice.call(opts.children).forEach(function (x) { x.classList.remove('on'); });
              btn.classList.add('on');
            };
            opts.appendChild(btn);
          });
          stage.appendChild(opts);

          var becBox = null;
          if (r.because && r.because.length) {
            becBox = h('div', 'pd-because');
            becBox.appendChild(h('div', 'pd-because-lab', r.becauseLabel || '你是从哪句看出来的？（可多选，选不出来说明还得往回读）'));
            var bs = h('div', 'pd-bs');
            r.because.forEach(function (t, k) {
              var bb = h('button', 'pd-b', '「' + t + '」');
              bb.type = 'button';
              bb.onclick = function () {
                bec[k] = !bec[k];
                bb.classList.toggle('on', bec[k]);
              };
              bs.appendChild(bb);
            });
            becBox.appendChild(bs);
            stage.appendChild(becBox);
          }

          var bar = h('div', 'pd-bar');
          var go = h('button', 'btn small primary', r.goLabel || '看看后面');
          go.type = 'button';
          bar.appendChild(go);
          stage.appendChild(bar);

          var fb = h('div', 'pd-msg');
          stage.appendChild(fb);

          go.onclick = function () {
            if (pick === null) {
              fb.className = 'pd-msg bad';
              fb.textContent = '先选一个你的猜想，再往下看。';
              return;
            }
            var becPick = (r.because || []).filter(function (t, k) { return bec[k]; });
            if (r.because && r.because.length && !becPick.length) {
              fb.className = 'pd-msg bad';
              fb.textContent = '还差一句依据。往回读一读，点出你是从哪句看出来的。';
              return;
            }
            go.disabled = true;
            [].slice.call(opts.children).forEach(function (x) { x.disabled = true; });
            if (becBox) [].slice.call(becBox.querySelectorAll('button')).forEach(function (x) { x.disabled = true; });

            var right = pick === r.answer;
            var rev = h('div', 'pd-reveal');
            rev.innerHTML = '<div class="pd-h">后来</div>' + (r.reveal || '');
            stage.appendChild(rev);

            var cmp = h('div', 'pd-cmp');
            cmp.innerHTML = '你猜：<b>' + (r.options || [])[pick] + '</b>　' +
              (right ? '<span class="same">和文中一致</span>'
                     : '<span class="diff">和文中不一样</span>——推想本来就是这样，拿线索往前试，试错了才知道线索还差什么。') +
              (becPick.length ? '<br>你的依据：' + becPick.map(function (t) { return '「' + t + '」'; }).join('、')
                              : '') +
              (r.why ? '<br>' + r.why : '');
            stage.appendChild(cmp);

            var bar2 = h('div', 'pd-bar');
            var keep = h('button', 'btn small primary pd-keep', '记住这一条');
            keep.type = 'button';
            bar2.appendChild(keep);
            stage.appendChild(bar2);
            fb.textContent = '';

            keep.onclick = function () {
              logs.push({ guess: (r.options || [])[pick], right: right, because: becPick });
              var np = document.createElement('p');
              np.className = 'pd-new';
              np.innerHTML = r.reveal || '';
              textBox.appendChild(np);
              cur++;
              render();
              var top = wrap.getBoundingClientRect().top;
              if (top < 0) wrap.scrollIntoView({ block: 'start' });
            };
          };
        }

        render();
        return f;
      },

      /* ── 语文专用：古诗三方对齐 ─────────────────────────
       * 工具课。注释卡要给诗句找到它的位置；归位之后撤掉注释，用词块复述。
       */
      poemNote: function (s, i) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        if (s.ask) {
          var q = h('p', 'quiz-q');
          q.innerHTML = s.ask;
          f.appendChild(q);
        }
        var b = s.body || s;
        var lines = b.lines || [];
        var notes = b.notes || [];
        var wrap = h('div', 'pn-wrap');
        f.appendChild(wrap);

        if (b.poemTitle) {
          wrap.appendChild(h('div', 'pn-title', b.poemTitle));
          if (b.by) wrap.appendChild(h('div', 'pn-by', b.by));
        }

        var linesBox = h('div', 'pn-lines');
        wrap.appendChild(linesBox);
        var lineEls = [];
        lines.forEach(function (t, k) {
          var el = h('div', 'pn-line');
          el.appendChild(h('span', 'pn-t', t));
          el.onclick = function () { put(k); };
          lineEls.push(el);
          linesBox.appendChild(el);
        });

        var msg = h('div', 'pn-msg', b.idle || '先点一张注释卡，再点它解释的那一句诗。');
        wrap.appendChild(msg);

        wrap.appendChild(h('div', 'pn-note', b.cardLabel || '注释卡（顺序打乱了）'));
        var cardsBox = h('div', 'pn-cards');
        wrap.appendChild(cardsBox);

        var order = notes.map(function (n, k) { return k; });
        // 固定打乱，避免每次渲染位置不同
        for (var j = order.length - 1; j > 0; j--) {
          var r2 = (j * 7 + 3) % (j + 1);
          var tmp = order[j]; order[j] = order[r2]; order[r2] = tmp;
        }

        var cardEls = [];
        var armed = null;
        var placed = {};
        var placedN = 0;

        function refresh() {
          cardEls.forEach(function (c) {
            c.classList.toggle('on', armed === c.dataset.k * 1);
            c.classList.toggle('used', !!placed[c.dataset.k]);
            c.disabled = !!placed[c.dataset.k];
          });
          lineEls.forEach(function (el) { el.classList.remove('armed'); });
          if (armed !== null && notes[armed]) {
            var tgt = lineEls[notes[armed].on];
            if (tgt) tgt.classList.add('armed');
          }
        }

        order.forEach(function (k) {
          var n = notes[k];
          var c = h('button', 'pn-card', n.text);
          c.type = 'button';
          c.dataset.k = k;
          c.onclick = function () {
            if (placed[k]) return;
            armed = (armed === k ? null : k);
            msg.className = 'pn-msg';
            msg.textContent = armed === null ? (b.idle || '先点一张注释卡，再点它解释的那一句诗。')
              : '这张卡是解释哪一句的？点上面那一句。';
            refresh();
          };
          cardEls.push(c);
          cardsBox.appendChild(c);
        });

        function put(k) {
          if (armed === null) {
            msg.className = 'pn-msg';
            msg.textContent = '先点下面的一张注释卡，再点诗句。';
            return;
          }
          var n = notes[armed];
          if (n.on !== k) {
            lineEls[k].classList.add('armed');
            setTimeout(function () { refresh(); }, 600);
            msg.className = 'pn-msg bad';
            msg.textContent = '这一句不是它解释的。想想这句里哪个词你看不懂。';
            return;
          }
          placed[armed] = true;
          placedN++;
          var tag = h('span', 'pn-tag', n.tag || '已注');
          lineEls[k].appendChild(tag);
          lineEls[k].classList.add('full');
          msg.className = 'pn-msg ok';
          msg.textContent = (b.okOne || '对上了。') + (n.after || '');
          armed = null;
          refresh();
          if (placedN === notes.length) finishNotes();
        }

        var recallBox = null;
        function finishNotes() {
          msg.className = 'pn-msg ok';
          msg.textContent = b.allOk || '注释都对上了。现在把注释撤掉——你还能说清这句吗？';
          var st0 = stateOf(i);
          st0.solved = true;
          st0.notes = notes.length;
          syncNav();
          if (!b.recall || recallBox) return;
          var rc = b.recall;
          recallBox = h('div', 'pn-recall');
          recallBox.appendChild(h('div', 'pn-recall-h', rc.hint || '不看注释，点词块把这句说成自己的话'));
          var slotsBox = h('div', 'pn-slots');
          recallBox.appendChild(slotsBox);
          var wordsBox = h('div', 'pn-words');
          recallBox.appendChild(wordsBox);
          var rmsg = h('div', 'pn-msg');
          recallBox.appendChild(rmsg);

          var ans = rc.answer || [];
          var filled = [];
          var slotEls = [];
          for (var q2 = 0; q2 < ans.length; q2++) {
            (function (idx) {
              var sl = h('div', 'pn-slot', '');
              sl.onclick = function () {
                if (!filled[idx]) return;
                var w = filled[idx];
                filled[idx] = null;
                sl.textContent = '';
                sl.classList.remove('ok');
                // 归还词块
                [].slice.call(wordsBox.children).forEach(function (w2) {
                  if (w2.textContent === w) { w2.classList.remove('used'); w2.disabled = false; }
                });
                check(false);
              };
              slotEls.push(sl);
              slotsBox.appendChild(sl);
            })(q2);
          }

          (rc.words || ans).forEach(function (w) {
            var wb = h('button', 'pn-word', w);
            wb.type = 'button';
            wb.onclick = function () {
              var slot = -1;
              for (var z = 0; z < ans.length; z++) { if (!filled[z]) { slot = z; break; } }
              if (slot < 0) { rmsg.className = 'pn-msg'; rmsg.textContent = '先点一下已经填好的词，可以把它撤回来。'; return; }
              filled[slot] = w;
              slotEls[slot].textContent = w;
              wb.classList.add('used');
              wb.disabled = true;
              check(true);
            };
            wordsBox.appendChild(wb);
          });

          function check(auto) {
            var full = filled.filter(Boolean).length === ans.length;
            if (!full) {
              if (auto) { rmsg.className = 'pn-msg'; rmsg.textContent = '还差 ' + (ans.length - filled.filter(Boolean).length) + ' 个词。'; }
              return;
            }
            var bad = [];
            ans.forEach(function (a, k2) {
              // 允许同义位置互换：只要这个词属于答案集合就算对
              if (filled[k2] !== a) bad.push(k2);
            });
            if (!bad.length) {
              slotEls.forEach(function (x) { x.classList.add('ok'); });
              rmsg.className = 'pn-msg ok';
              rmsg.textContent = rc.done || '说清了。注释是拐杖——用完要放下的。';
              var st = stateOf(i);
              st.solved = true;
              st.recalled = true;
              syncNav();
              return;
            }
            rmsg.className = 'pn-msg';
            rmsg.textContent = '意思差不多出来了，但「' + filled[bad[0]] + '」放的位置不太对。点它可以撤回来重放。';
          }

          wrap.appendChild(recallBox);
          recallBox.scrollIntoView({ block: 'nearest' });
        }

        refresh();
        return f;
      },

      /* ── 语文专用：感官观察 ─────────────────────────────
       * 写作课前半段。写不具体，常常是「只用了眼睛」。
       * 这里先把四种感官各问一遍，再定一个观察顺序——不排完不许写。
       */
      senses: function (s, i) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        if (s.ask) {
          var q = h('p', 'quiz-q');
          q.innerHTML = s.ask;
          f.appendChild(q);
        }
        var b = s.body || s;
        var cells = b.senses || [];
        var min = b.min || Math.min(3, cells.length);
        var wrap = h('div', 'sn-wrap');
        f.appendChild(wrap);

        var grid = h('div', 'sn-grid');
        wrap.appendChild(grid);
        var inputs = [];
        var meta = h('div', 'sn-stat');
        var ordBox = null;
        var picked = null;

        cells.forEach(function (c, k) {
          var cell = h('div', 'sn-cell');
          var name = h('div', 'sn-name');
          name.appendChild(h('i', null, c.k || '·'));
          name.appendChild(document.createTextNode(c.name || ''));
          cell.appendChild(name);
          if (c.hint) cell.appendChild(h('div', 'sn-hint', c.hint));
          var inp = document.createElement('input');
          inp.type = 'text';
          inp.maxLength = 24;
          inp.placeholder = c.ph || '写一个词就够';
          inp.oninput = paint;
          cell.appendChild(inp);
          inputs.push({ el: inp, cell: cell });
          grid.appendChild(cell);
        });

        if (b.orders && b.orders.length) {
          ordBox = h('div', 'sn-order');
          var oLab = h('div', 'sn-order-lab');
          oLab.innerHTML = b.orderAsk || '你打算按什么顺序写？<b>选一个</b>';
          ordBox.appendChild(oLab);
          var bar = h('div', 'sn-orders');
          b.orders.forEach(function (o) {
            var btn = h('button', 'sn-ord', o);
            btn.type = 'button';
            btn.onclick = function () {
              picked = o;
              [].slice.call(bar.children).forEach(function (x) { x.classList.remove('on'); });
              btn.classList.add('on');
              paint();
            };
            bar.appendChild(btn);
          });
          ordBox.appendChild(bar);
          wrap.appendChild(ordBox);
        }
        wrap.appendChild(meta);

        if (b.sample) {
          var sb = h('button', 'btn small', b.sampleLabel || '看一段别人怎么写的');
          sb.type = 'button';
          wrap.appendChild(sb);
          var sbox = h('div', 'sn-sample');
          sbox.style.display = 'none';
          sbox.innerHTML = b.sample + (b.sampleNote ? '<p class="muted" style="margin:6px 0 0">' + b.sampleNote + '</p>' : '');
          wrap.appendChild(sbox);
          sb.onclick = function () { sbox.style.display = ''; sb.style.display = 'none'; };
        }

        function paint() {
          var filled = 0;
          inputs.forEach(function (x) {
            var v = x.el.value.trim();
            var ok = v.length >= 2;
            x.cell.classList.toggle('ok', ok);
            if (ok) filled++;
          });
          var needOrd = !!(b.orders && b.orders.length);
          var ready = filled >= min && (!needOrd || picked);
          meta.className = 'sn-stat' + (ready ? ' ok' : '');
          meta.innerHTML = '四格里填了 <b>' + filled + '</b> 格' +
            (needOrd ? '，顺序' + (picked ? '已选：<b>' + picked + '</b>' : '还没选') : '') +
            (ready ? ' · 可以往下写了' : '');
          if (ready) {
            var st = stateOf(i);
            st.solved = true;
            st.senses = inputs.map(function (x) { return x.el.value.trim(); }).filter(Boolean);
            st.order = picked;
            syncNav();
          }
        }

        paint();
        return f;
      },

      /* ── 语文专用：修改体检 ─────────────────────────────
       * 三年级要改的是增删调换，不是错别字。
       * 每条清单必须先点中一句话才允许打勾——否则就会「全部打勾、一字不改」。
       */
      checkup: function (s, i) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        if (s.ask) {
          var q = h('p', 'quiz-q');
          q.innerHTML = s.ask;
          f.appendChild(q);
        }
        var b = s.body || s;
        var lines = b.lines || [];
        var checks = b.checks || [];
        var min = b.min || Math.min(3, checks.length);

        var wrap = h('div', 'ck-wrap');
        f.appendChild(wrap);

        var checksBox = h('div', 'ck-checks');
        wrap.appendChild(checksBox);
        var doc = h('div', 'ck-doc');
        wrap.appendChild(doc);

        var lineEls = [];
        lines.forEach(function (ln, k) {
          var el = h('button', 'ck-line');
          el.type = 'button';
          el.innerHTML = ln.t;
          el.dataset.k = k;
          el.onclick = function () { onLine(k); };
          lineEls.push(el);
          doc.appendChild(el);
        });

        var tip = h('div', 'ck-tip', b.idle || '先选一条清单，该看的地方会在文稿里亮起来——点中那一句才算改。');
        doc.appendChild(tip);
        var count = h('div', 'ck-count');
        f.appendChild(count);

        var active = -1;
        var doneChecks = {};
        var doneN = 0;

        function clearHits() {
          lineEls.forEach(function (el) { el.classList.remove('hit'); });
        }

        function paintCount() {
          count.className = 'ck-count' + (doneN >= min ? ' ok' : '');
          count.innerHTML = '已改 <b>' + doneN + '</b> 处' + (doneN >= min ? ' · 够了' : '，至少 ' + min + ' 处');
          if (doneN >= min && doneN === Object.keys(doneChecks).length) {
            var st = stateOf(i);
            st.solved = true;
            st.mends = doneN;
            syncNav();
          }
        }

        checks.forEach(function (c, k) {
          var btn = h('button', 'ck-check');
          btn.type = 'button';
          var num = h('span', 'ck-n', String(k + 1));
          btn.appendChild(num);
          btn.appendChild(document.createTextNode(c.name));
          btn.onclick = function () {
            if (doneChecks[k]) {
              tip.innerHTML = '<b>这一条已经改过了。</b>' + (c.after || '');
              return;
            }
            active = (active === k ? -1 : k);
            [].slice.call(checksBox.children).forEach(function (x) { x.classList.remove('on'); });
            clearHits();
            if (active < 0) { tip.innerHTML = b.idle || '先选一条清单，该看的地方会在文稿里亮起来——点中那一句才算改。'; return; }
            btn.classList.add('on');
            (c.hits || []).forEach(function (h2) {
              if (lineEls[h2]) lineEls[h2].classList.add('hit');
            });
            tip.innerHTML = '<b>' + c.name + '</b>　' + (c.how || '在这些句子里点出最该改的那一句。');
          };
          checksBox.appendChild(btn);
        });

        function onLine(k) {
          if (active < 0) {
            tip.innerHTML = '先选一条要检查的清单，再来点句子。';
            return;
          }
          var c = checks[active];
          if ((c.hits || []).indexOf(k) < 0) {
            tip.innerHTML = '这一句和刚才那条清单对不上。换一句试试——' + (c.how || '');
            return;
          }
          doneChecks[active] = true;
          doneN++;
          var btn = checksBox.children[active];
          btn.classList.add('done');
          btn.children[0].textContent = '✓';
          btn.classList.remove('on');
          lineEls[k].classList.add('fixed');
          clearHits();
          tip.innerHTML = '<b>改了这一处。</b>' + (c.fix || '') + (c.after ? '<br>' + c.after : '');
          active = -1;
          paintCount();
        }

        paintCount();
        return f;
      },

      /* ── 语文专用：拼音 ─────────────────────────────────
       * 字认得，音未必。三年级错的多数在调号，不在声母韵母，
       * 所以选项一律带调，判的也是调。字下面那一点，是课本的老规矩。
       */
      pinyin: function (s, i) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var b = s.body || s;

        if (b.sent) {
          var sent = h('div', 'py-sent');
          sent.innerHTML = b.sent;
          f.appendChild(sent);
        }

        var card = h('div', 'py-card');
        var word = h('div', 'py-word');
        var pos = b.pos || 0;
        (b.word || '').split('').forEach(function (c, k) {
          word.appendChild(h('span', 'py-ch' + (k === pos ? ' key' : ''), c));
        });
        card.appendChild(word);
        var read = h('div', 'py-read', '');
        card.appendChild(read);
        f.appendChild(card);

        var fb = h('div');
        var opts = h('div', 'py-opts');
        (b.options || []).forEach(function (o) {
          var val = typeof o === 'string' ? o : o.p;
          var btn = h('button', 'py-opt', val);
          btn.type = 'button';
          if (o && o.hint) btn.title = o.hint;
          btn.onclick = function () {
            var st = stateOf(i);
            if (st.solved) return;
            st.attempts++;
            if (b.soft) {
              [].slice.call(opts.children).forEach(function (x) { x.classList.remove('on'); });
              btn.classList.add('on');
              st.solved = true; st.pick = val;
              read.innerHTML = b.read || val;
              return syncNav();
            }
            if (val === b.answer) {
              btn.classList.add('right');
              st.solved = true; st.pick = val; st.first = st.attempts === 1;
              read.innerHTML = b.read || val;
              if (b.why) { fb.className = 'card ok'; fb.innerHTML = b.why; }
              syncNav();
            } else {
              btn.classList.add('wrong');
              var msg = (b.misconception && b.misconception[val]) || b.hint || '';
              if (msg) { fb.className = 'card pitfall'; fb.innerHTML = msg; }
            }
          };
          opts.appendChild(btn);
        });
        f.appendChild(opts);
        f.appendChild(fb);
        return f;
      },

      /* ── 语文专用：典故 ─────────────────────────────────
       * 成语和古诗都是压缩包，故事是解压密码。
       * 读完不问「记住了没有」，问「错在哪一步」——考的是因果，不是记性。
       */
      story: function (s, i) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var b = s.body || s;

        var card = h('div', 'st-card');
        var head = h('div', 'st-head');
        head.appendChild(h('span', 'st-kind', b.kind || '故事'));
        head.appendChild(h('span', 'st-name', b.name || ''));
        if (b.origin) head.appendChild(h('span', 'st-origin', b.origin));
        card.appendChild(head);

        (b.paras || []).forEach(function (p, k) {
          var el = h('p', 'st-p' + (k === 0 ? ' st-lead' : ''));
          el.innerHTML = p;
          card.appendChild(el);
        });

        if (b.quote) {
          var q = h('div', 'st-quote');
          q.innerHTML = b.quote;
          card.appendChild(q);
          var gd = h('div', 'st-gloss', b.gloss || '');
          gd.hidden = true;
          var gbtn = h('button', 'st-gloss-btn', '看白话');
          gbtn.type = 'button';
          gbtn.onclick = function () {
            gd.hidden = !gd.hidden;
            gbtn.textContent = gd.hidden ? '看白话' : '收起白话';
          };
          card.appendChild(gbtn);
          card.appendChild(gd);
        }
        f.appendChild(card);

        var nowSlot = h('div', 'st-now');
        nowSlot.hidden = true;
        f.appendChild(nowSlot);

        function showNow() {
          if (!b.now) return;
          nowSlot.innerHTML = '<b>今天这么说</b><p>' + b.now + '</p>';
          nowSlot.hidden = false;
        }

        if (b.ask && b.options && b.options.length) {
          var q2 = h('p', 'quiz-q');
          q2.innerHTML = b.ask;
          f.appendChild(q2);
          var fb = h('div');
          var opts = h('div', 'st-opts');
          b.options.forEach(function (o) {
            var btn = h('button', 'st-opt');
            btn.type = 'button';
            btn.innerHTML = o;
            btn.onclick = function () {
              var st = stateOf(i);
              if (st.solved) return;
              st.attempts++;
              if (o === b.answer) {
                btn.classList.add('right');
                st.solved = true; st.first = st.attempts === 1;
                if (b.why) { fb.className = 'card ok'; fb.innerHTML = b.why; }
                showNow();
                syncNav();
              } else {
                btn.classList.add('wrong');
                var msg = (b.misconception && b.misconception[o]) || '';
                if (msg) { fb.className = 'card pitfall'; fb.innerHTML = msg; }
              }
            };
            opts.appendChild(btn);
          });
          f.appendChild(opts);
          f.appendChild(fb);
        } else {
          stateOf(i).solved = true;
        }

        if (b.link && b.link.topic) {
          var a = h('a', 'st-link', '→ 顺着这个故事，看' + (b.link.label || '相关一课'));
          a.href = '../../viz/index.html#t=' + b.link.topic;
          f.appendChild(a);
        }
        return f;
      },

      /* ── 语文专用：朗读 ─────────────────────────────────
       * 不假装能听懂。能做的三件事：示范一遍、录下来、回放给自己听。
       * 机器评测要联网，教室里十有八九连不上——不如把耳朵交给学生。
       */
      readAloud: function (s, i) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var b = s.body || s;

        var paper = h('div', 'ra-text');
        paper.innerHTML = b.text;
        f.appendChild(paper);
        if (b.tip) {
          var tipEl = h('div', 'ra-tip');
          tipEl.innerHTML = b.tip;
          f.appendChild(tipEl);
        }

        var bar = h('div', 'ra-bar');
        var btnListen = h('button', 'btn small', '▶ 听一遍');
        btnListen.type = 'button';
        bar.appendChild(btnListen);
        var btnRec = h('button', 'btn small primary', '● 我来读');
        btnRec.type = 'button';
        bar.appendChild(btnRec);
        var timer = h('span', 'ra-timer', '');
        bar.appendChild(timer);
        var btnAloud = h('button', 'btn small', '我读给同桌听了');
        btnAloud.type = 'button';
        btnAloud.style.display = 'none';
        bar.appendChild(btnAloud);
        f.appendChild(bar);

        var wave = document.createElement('canvas');
        wave.className = 'ra-wave';
        wave.width = 560;
        wave.height = 44;
        wave.style.display = 'none';
        f.appendChild(wave);

        var playSlot = h('div', 'ra-play');
        f.appendChild(playSlot);

        var micNote = h('p', 'ra-note', '录音只留在这一页里，不上传，刷新就没了。');
        f.appendChild(micNote);

        /* 示范朗读：设备装了中文语音才点得动 */
        var ttsNote = h('p', 'ra-note ra-warn', '');
        ttsNote.hidden = true;
        f.appendChild(ttsNote);

        var ttsVoice = null;
        function refreshVoice() {
          var vs = [];
          try { vs = window.speechSynthesis ? speechSynthesis.getVoices() : []; } catch (e) { vs = []; }
          for (var k = 0; k < vs.length; k++) {
            if (/^zh/i.test(vs[k].lang)) { ttsVoice = vs[k]; break; }
          }
          btnListen.disabled = !ttsVoice;
          btnListen.title = ttsVoice ? '' : '这台设备没有中文语音，请老师范读';
          if (!ttsVoice) {
            ttsNote.innerHTML = '这台设备没装中文语音，示范朗读点不动——请老师读一遍，或同桌互读。';
            ttsNote.hidden = false;
          } else {
            ttsNote.hidden = true;
          }
        }
        refreshVoice();
        if (window.speechSynthesis) {
          speechSynthesis.onvoiceschanged = refreshVoice;
          setTimeout(refreshVoice, 500);
        }
        btnListen.onclick = function () {
          if (!ttsVoice) return;
          try { speechSynthesis.cancel(); } catch (e) { /* 忽略 */ }
          var u = new SpeechSynthesisUtterance(paper.textContent);
          u.voice = ttsVoice;
          u.lang = ttsVoice.lang || 'zh-CN';
          u.rate = b.rate || 0.86;
          speechSynthesis.speak(u);
        };

        /* 录音 */
        var rec = { on: false, mr: null, chunks: [], stream: null, url: '', sec: 0, tick: 0, ac: null, raf: 0 };
        var canRec = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
        var heard = false;
        if (!canRec) {
          btnRec.style.display = 'none';
          btnAloud.style.display = '';
          micNote.innerHTML = '这一页是用 <b>file://</b> 或旧浏览器打开的，录音用不了。' +
            '点上面的「我读给同桌听了」，一样算数。';
        }

        function stopMeter() {
          if (rec.raf) cancelAnimationFrame(rec.raf);
          if (rec.ac) { try { rec.ac.close(); } catch (e) { /* 忽略 */ } }
          rec.raf = 0; rec.ac = null;
        }

        function startMeter(stream) {
          try {
            var AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return;
            rec.ac = new AC();
            var src = rec.ac.createMediaStreamSource(stream);
            var an = rec.ac.createAnalyser();
            an.fftSize = 512;
            src.connect(an);
            var buf = new Uint8Array(an.fftSize);
            var ctx = wave.getContext('2d');
            var W = wave.width, H = wave.height;
            (function draw() {
              if (!rec.on || !ctx) return;
              an.getByteTimeDomainData(buf);
              ctx.clearRect(0, 0, W, H);
              ctx.fillStyle = '#ffd166';
              var n = 46, step = W / n;
              for (var k = 0; k < n; k++) {
                var v = Math.abs(buf[Math.floor(k * buf.length / n)] - 128) / 128;
                var hh = Math.max(2, v * H * 1.7);
                ctx.fillRect(k * step + 2, (H - hh) / 2, step - 4, hh);
              }
              rec.raf = requestAnimationFrame(draw);
            })();
          } catch (e) { /* 没波形也能录 */ }
        }

        function stopRec() {
          if (!rec.on) return;
          rec.on = false;
          clearInterval(rec.tick);
          try { rec.mr.stop(); } catch (e) { /* 忽略 */ }
          btnRec.textContent = '● 再读一遍';
        }

        function startRec() {
          if (rec.on) return;
          btnRec.disabled = true;
          navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
            rec.stream = stream;
            var mr = new MediaRecorder(stream);
            rec.mr = mr;
            rec.chunks = [];
            mr.ondataavailable = function (e) {
              if (e.data && e.data.size) rec.chunks.push(e.data);
            };
            mr.onstop = function () {
              stopMeter();
              stream.getTracks().forEach(function (t) { t.stop(); });
              var blob = new Blob(rec.chunks, { type: mr.mimeType || 'audio/webm' });
              if (rec.url) URL.revokeObjectURL(rec.url);
              rec.url = URL.createObjectURL(blob);
              playSlot.innerHTML = '';
              var au = document.createElement('audio');
              au.controls = true;
              au.src = rec.url;
              au.className = 'ra-audio';
              playSlot.appendChild(au);
              var again = h('button', 'btn small', '↻ 重录');
              again.type = 'button';
              again.onclick = function () {
                playSlot.innerHTML = '';
                timer.textContent = '';
                btnRec.textContent = '● 我来读';
                rec.sec = 0;
                paint();
              };
              playSlot.appendChild(again);
              heard = true;
              btnRec.disabled = false;
              paint();
            };
            mr.start();
            rec.on = true;
            wave.style.display = '';
            btnRec.textContent = '■ 读完了';
            btnRec.disabled = false;
            rec.sec = 0;
            timer.textContent = '0″';
            clearInterval(rec.tick);
            rec.tick = setInterval(function () {
              rec.sec++;
              timer.textContent = rec.sec + '″';
              if (b.limit && rec.sec >= b.limit) stopRec();
            }, 1000);
            startMeter(stream);
            paint();
          }).catch(function (err) {
            btnRec.disabled = false;
            btnAloud.style.display = '';
            micNote.innerHTML = (err && err.name === 'NotAllowedError')
              ? '没有拿到麦克风权限，录音用不了。点上面的「我读给同桌听了」，读完自己打勾。'
              : '这台设备没有可用的麦克风。点上面的「我读给同桌听了」，一样算数。';
          });
        }

        btnRec.onclick = function () {
          if (!canRec) return;
          if (rec.on) { stopRec(); return; }
          startRec();
        };

        /* 三条自评，勾满 min 条才算读完 */
        var items = b.rubric || [];
        var minSelf = b.min || Math.min(2, items.length);
        var done = {};
        var checks = h('div', 'ra-checks');
        items.forEach(function (t, k) {
          var btn = h('button', 'ra-check');
          btn.type = 'button';
          btn.appendChild(h('span', 'ra-box', ''));
          btn.appendChild(h('span', 'ra-lab', t));
          btn.onclick = function () {
            done[k] = !done[k];
            btn.classList.toggle('on', !!done[k]);
            paint();
          };
          checks.appendChild(btn);
        });
        if (items.length) f.appendChild(checks);

        var count = h('div', 'ra-count', '');
        f.appendChild(count);

        btnAloud.onclick = function () {
          heard = true;
          btnAloud.classList.add('on');
          btnAloud.textContent = '✓ 读给同桌听过了';
          paint();
        };

        function paint() {
          var n = 0;
          Object.keys(done).forEach(function (k) { if (done[k]) n++; });
          var st = stateOf(i);
          var ok = heard && n >= minSelf;
          if (ok && !st.solved) {
            st.solved = true;
            st.read = { heard: heard, sec: rec.sec, self: n };
            syncNav();
          }
          count.className = 'ra-count' + (ok ? ' ok' : '');
          count.innerHTML = (heard ? '已留下声音' : '还没读') +
            ' · 自评 <b>' + n + '</b> / ' + items.length +
            (ok ? ' · 这一遍可以了' : ' · 读一遍，再回来勾');
        }
        paint();
        return f;
      },

      /* ── 语文专用：写字 ─────────────────────────────────
       * 真正的字形识别要几十兆模型，塞不进单文件。
       * 能如实给的是三件事：几笔、撑没撑开、出没出格。这三条三年级正好最缺。
       */
      writeChar: function (s, i) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var b = s.body || s;
        var chars = b.chars || [];
        var need = b.min || chars.length;

        var wrap = h('div', 'wc-wrap');
        f.appendChild(wrap);
        var rows = [];

        chars.forEach(function (c) {
          var row = h('div', 'wc-row');
          var info = h('div', 'wc-info');
          info.appendChild(h('div', 'wc-ch', c.ch));
          if (c.pinyin) info.appendChild(h('div', 'wc-py', c.pinyin));
          if (c.strokes) info.appendChild(h('div', 'wc-strokes', c.strokes + ' 画'));
          if (c.tip) {
            var t = h('div', 'wc-tip');
            t.innerHTML = c.tip;
            info.appendChild(t);
          }
          row.appendChild(info);

          var stage = h('div', 'wc-stage');
          var cv = document.createElement('canvas');
          cv.className = 'wc-canvas';
          stage.appendChild(cv);
          var tools = h('div', 'wc-tools');
          var bShow = h('button', 'wc-btn on', '范字：开');
          bShow.type = 'button';
          var bClear = h('button', 'wc-btn', '清空');
          bClear.type = 'button';
          var bOk = h('button', 'wc-btn primary', '写好了');
          bOk.type = 'button';
          tools.appendChild(bShow);
          tools.appendChild(bClear);
          tools.appendChild(bOk);
          stage.appendChild(tools);
          var tipBox = h('div', 'wc-fb', '先描着范字写一遍，再关掉范字写一遍。');
          stage.appendChild(tipBox);
          row.appendChild(stage);
          wrap.appendChild(row);

          var item = { c: c, cv: cv, strokes: [], show: true, w: 0, dpr: 1, ok: false, fb: tipBox, snap: '' };
          rows.push(item);

          bShow.onclick = function () {
            item.show = !item.show;
            bShow.textContent = '范字：' + (item.show ? '开' : '关');
            bShow.classList.toggle('on', item.show);
            draw(item);
          };
          bClear.onclick = function () {
            item.strokes = [];
            item.ok = false;
            row.classList.remove('ok');
            tipBox.innerHTML = '清空了。看着范字的间架，再写一遍。';
            draw(item);
            paintAll();
          };
          bOk.onclick = function () {
            var r = check(item);
            item.fb.innerHTML = r.msg;
            item.fb.className = 'wc-fb ' + (r.ok ? 'ok' : 'warn');
            if (r.ok && !item.ok) {
              item.ok = true;
              item.snap = snap(item);
              row.classList.add('ok');
            } else if (!r.ok) {
              item.ok = false;
              row.classList.remove('ok');
            }
            paintAll();
          };

          bindPad(item);
        });

        var count = h('div', 'wc-count', '');
        f.appendChild(count);

        function draw(item) {
          var cv = item.cv;
          var W = cv.width, H = cv.height;
          if (!W) return;
          var d = item.dpr;
          var ctx = cv.getContext('2d');
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, W, H);

          var pad = W * 0.06;
          var side = W - pad * 2;
          ctx.strokeStyle = 'rgba(255,255,255,.20)';
          ctx.lineWidth = Math.max(1, d);
          ctx.strokeRect(pad, pad, side, side);
          ctx.setLineDash([4 * d, 5 * d]);
          ctx.strokeStyle = 'rgba(255,255,255,.12)';
          ctx.beginPath();
          ctx.moveTo(W / 2, pad); ctx.lineTo(W / 2, pad + side);
          ctx.moveTo(pad, H / 2); ctx.lineTo(pad + side, H / 2);
          ctx.moveTo(pad, pad); ctx.lineTo(pad + side, pad + side);
          ctx.moveTo(pad + side, pad); ctx.lineTo(pad, pad + side);
          ctx.stroke();
          ctx.setLineDash([]);

          if (item.show) {
            ctx.fillStyle = 'rgba(232,237,245,.13)';
            ctx.font = 'bold ' + (side * 0.68) + 'px "KaiTi","STKaiti","Noto Serif SC",serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'alphabetic';
            var mt = ctx.measureText(item.c.ch);
            var asc = mt.actualBoundingBoxAscent || side * 0.5;
            var desc = mt.actualBoundingBoxDescent || 0;
            ctx.fillText(item.c.ch, W / 2, H / 2 + (asc - desc) / 2);
          }

          ctx.strokeStyle = '#e8edf5';
          ctx.lineWidth = Math.max(3, W * 0.021);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          item.strokes.forEach(function (st) {
            if (!st.length) return;
            ctx.beginPath();
            st.forEach(function (pt, k) {
              var x = pt.x * W, y = pt.y * H;
              if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            });
            if (st.length === 1) ctx.lineTo(st[0].x * W + 0.1, st[0].y * H + 0.1);
            ctx.stroke();
          });
        }

        function fit(item) {
          var stage = item.cv.parentNode;
          var w = stage.clientWidth;
          if (!w) return;
          var side = Math.min(w, 300);
          var dpr = Math.min(2, window.devicePixelRatio || 1);
          item.w = side;
          item.dpr = dpr;
          item.cv.style.width = side + 'px';
          item.cv.style.height = side + 'px';
          item.cv.width = Math.round(side * dpr);
          item.cv.height = Math.round(side * dpr);
          draw(item);
        }

        function bindPad(item) {
          var cv = item.cv;
          var drawing = false;
          cv.style.touchAction = 'none';

          function pos(e) {
            var r = cv.getBoundingClientRect();
            return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
          }
          cv.addEventListener('pointerdown', function (e) {
            e.preventDefault();
            drawing = true;
            try { cv.setPointerCapture(e.pointerId); } catch (err) { /* 忽略 */ }
            item.strokes.push([pos(e)]);
            draw(item);
          });
          cv.addEventListener('pointermove', function (e) {
            if (!drawing) return;
            e.preventDefault();
            var st = item.strokes[item.strokes.length - 1];
            st.push(pos(e));
            draw(item);
          });
          function up() {
            if (!drawing) return;
            drawing = false;
          }
          cv.addEventListener('pointerup', up);
          cv.addEventListener('pointercancel', up);
          cv.addEventListener('pointerleave', up);
        }

        function check(item) {
          var st = item.strokes.filter(function (x) { return x.length > 1; });
          var n = st.length;
          var std = item.c.strokes || 0;
          var pts = [];
          st.forEach(function (s2) { s2.forEach(function (p) { pts.push(p); }); });
          if (!pts.length) return { ok: false, msg: '还没落笔。用鼠标或手指在格子里写。' };

          var xs = pts.map(function (p) { return p.x; });
          var ys = pts.map(function (p) { return p.y; });
          var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs);
          var y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
          var w = x1 - x0, hh = y1 - y0;

          if (std && n < std - 2) {
            return { ok: false, msg: '数到 ' + n + ' 笔，这个字有 ' + std + ' 画。是连笔了，还是漏了一部分？' };
          }
          if (std && n > std + 2) {
            return { ok: false, msg: '数到 ' + n + ' 笔，比 ' + std + ' 画多了。一笔写到一半抬手，也会多算。' };
          }
          if (w < 0.42 || hh < 0.42) {
            return { ok: false, msg: '字太小了，撑到格子的七成才站得住。' };
          }
          if (x0 < 0.03 || y0 < 0.03 || x1 > 0.97 || y1 > 0.97) {
            return { ok: false, msg: '有一笔写出格子了，收回来。' };
          }
          return { ok: true, msg: n + ' 笔，对上了。再看看横画之间匀不匀。' };
        }

        function snap(item) {
          try {
            var c2 = document.createElement('canvas');
            c2.width = 140;
            c2.height = 140;
            var x = c2.getContext('2d');
            x.fillStyle = '#0f1620';
            x.fillRect(0, 0, 140, 140);
            x.drawImage(item.cv, 0, 0, 140, 140);
            return c2.toDataURL('image/jpeg', 0.62);
          } catch (e) { return ''; }
        }

        function paintAll() {
          var okN = rows.filter(function (r) { return r.ok; }).length;
          count.className = 'wc-count' + (okN >= need ? ' ok' : '');
          count.innerHTML = '写好 <b>' + okN + '</b> / ' + need + ' 个' +
            (okN >= need ? ' · 够了' : ' · 写完点「写好了」');
          if (okN >= need) {
            var st = stateOf(i);
            if (!st.solved) {
              st.solved = true;
              var first = rows.filter(function (r) { return r.snap; })[0];
              st.written = first ? first.snap : '';
              syncNav();
            }
          }
        }

        /* 未激活的步骤宽度是 0，靠 ResizeObserver 等它显示出来再量 */
        rows.forEach(fit);
        if (window.ResizeObserver) {
          var ro = new ResizeObserver(function () {
            rows.forEach(function (it) {
              var w = it.cv.parentNode.clientWidth;
              if (w && Math.abs(Math.min(w, 300) - it.w) > 1) fit(it);
            });
          });
          rows.forEach(function (it) { ro.observe(it.cv.parentNode); });
        }
        window.addEventListener('resize', function () {
          rows.forEach(function (it) { fit(it); });
        });

        paintAll();
        return f;
      },

      decimal: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.decimalBar(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      table: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.barGroup(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      compass: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.compass(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      law: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.law(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      triangle: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.triangle(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      fracOps: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.fracOps(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      volume: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.volume(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      pairs: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.pairs(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      treePlant: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.treePlant(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      symmetry: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.symmetry(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      fracReduce: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.fracReduce(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      spinner: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.spinner(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      decMult: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.decMult(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      decDiv: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.decDiv(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      fracMeaning: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.fracMeaning(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      mult2: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.mult2(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      chart: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.chart(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      mean: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.mean(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      polyArea: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.polyArea(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      factorGrid: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.factorGrid(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      counter: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.counter(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      angle: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.angle(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      quad: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.quad(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      decGrid: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        var ctrl = CR.decGrid(box, s.body || s);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        attachDemo(f, ctrl, s);
        if (s.note) {
          var card = h('div', 'card' + (s.warn ? ' pitfall' : ' tip'));
          card.innerHTML = '<p style="margin:0">' + s.note + '</p>';
          f.appendChild(card);
        }
        return f;
      },

      numberline: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        CR.numberline(box, s.line);
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        return f;
      },

      clock: function (s) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var box = h('div', 'viz');
        f.appendChild(box);
        CR.clock(box, { absMinutes: s.absMinutes || 480, showSecond: false });
        if (s.caption) {
          var cap = h('div', 'viz-cap');
          cap.innerHTML = s.caption;
          f.appendChild(cap);
        }
        return f;
      },

      quiz: function (s, i) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var q = h('p', 'quiz-q');
        q.innerHTML = s.question;
        f.appendChild(q);

        var row = h('div', 'answer-row');
        var input = document.createElement('input');
        input.type = 'number';
        input.inputMode = 'numeric';
        input.id = 'q' + i;
        input.setAttribute('aria-label', '输入答案');
        input.placeholder = '填答案';
        row.appendChild(input);
        if (s.unit) row.appendChild(h('span', 'unit', s.unit));
        var btn = h('button', 'btn small', '对答案');
        btn.id = 'check' + i;
        row.appendChild(btn);
        f.appendChild(row);

        var fb = h('div');
        fb.id = 'fb' + i;
        f.appendChild(fb);

        var st = stateOf(i);
        function check() {
          if (st.solved) return;
          var raw = input.value.trim();
          if (raw === '') { fb.innerHTML = '<div class="card tip">先填一个数。</div>'; return; }
          st.attempts++;
          if (Math.abs(Number(raw) - s.answer) < 1e-9) {
            st.solved = true; st.first = st.attempts === 1;
            input.readOnly = true;
            fb.innerHTML = '<div class="card ok">对，' + s.answer + (s.unit ? ' ' + s.unit : '') + '。' + (s.hint || '') + '</div>';
            btn.style.display = 'none';
            syncNav();
          } else {
            fb.innerHTML = '<div class="card pitfall">' + (s.why || '再算一遍，看看是不是漏了进位。') + '</div>';
          }
        }
        btn.onclick = check;
        input.addEventListener('keydown', function (e) { if (e.key === 'Enter') check(); });
        return f;
      },

      choice: function (s, i) {
        var f = document.createDocumentFragment();
        if (s.title) f.appendChild(h('h2', null, s.title));
        var q = h('p', 'quiz-q');
        q.innerHTML = s.question;
        f.appendChild(q);

        var wrap = h('div', 'options');
        var fbSlot = h('div');
        s.options.forEach(function (o) {
          var b = h('button', 'opt', o);
          b.type = 'button';
          b.onclick = function () {
            var st = stateOf(i);
            if (st.solved && !s.soft) return;
            st.attempts++;
            // 语文的「软选择」：点哪个都能看解释，不标红、不计对错、不拦路
            if (s.soft) {
              [].slice.call(wrap.children).forEach(function (x) { x.classList.remove('picked'); });
              b.classList.add('picked');
              st.solved = true; st.choice = o;
              fbSlot.className = 'card tip';
              fbSlot.innerHTML = (s.misconception && s.misconception[o]) || s.hint || '';
              syncNav();
              return;
            }
            if (o === s.answer) {
              b.classList.add('right');
              st.solved = true; st.first = st.attempts === 1;
              if (s.hint) {
                fbSlot.className = 'card ok';
                fbSlot.innerHTML = s.hint;
              }
              syncNav();
            } else {
              b.classList.add('wrong');
              var msg = (s.misconception && s.misconception[o]) || s.why;
              if (msg) {
                fbSlot.className = 'card pitfall';
                fbSlot.innerHTML = msg;
              }
            }
          };
          wrap.appendChild(b);
        });
        f.appendChild(wrap);
        f.appendChild(fbSlot);
        return f;
      },

      summary: function (s) {
        var f = document.createDocumentFragment();
        f.appendChild(h('h2', null, s.title || '小结'));
        if (s.points && s.points.length) {
          var card = h('div', 'card');
          s.points.forEach(function (p, i) {
            var el = h('p', null, (i + 1) + '　' + p);
            el.style.margin = i === s.points.length - 1 ? '0' : '0 0 8px';
            card.appendChild(el);
          });
          f.appendChild(card);
        }
        var score = h('div', 'card');
        score.id = 'scoreCard';
        f.appendChild(score);

        var ext = h('div');
        ext.id = 'extend';
        f.appendChild(ext);
        return f;
      },
    };

    /** 给可演算的呈现器挂一组按钮：一步步演示 / 重来
     *  语文里这套东西不叫「算」，叫「看老师改这一句」——同一机制，两种说法。
     */
    function attachDemo(frag, ctrl, s) {
      if (!ctrl || typeof ctrl.next !== 'function' || s.demo === false) return;
      var wrap = h('div', 'demo');
      var label = s.demoLabel || (LANG ? '▶ 看老师改这一句' : '▶ 一步一步算');
      var next = h('button', 'btn small primary', label);
      var reset = h('button', 'btn small', '重来');
      var idle = s.demoHint || (LANG ? '先自己试一次，再看不迟。' : '点按钮，一位一位算给你看。');
      var tip = h('p', 'demo-tip', idle);
      var doneLabel = s.demoDone || (LANG ? '这一步改完了' : '算完了');

      next.onclick = function () {
        var r = ctrl.next();
        if (!r) { next.disabled = true; return; }
        tip.innerHTML = r.text;
        if (r.done) {
          next.disabled = true;
          next.classList.remove('primary');
          next.textContent = doneLabel;
        }
      };
      reset.onclick = function () {
        if (ctrl.startDemo) ctrl.startDemo();
        next.disabled = false;
        next.classList.add('primary');
        next.textContent = label;
        tip.innerHTML = idle;
      };

      wrap.appendChild(next);
      wrap.appendChild(reset);
      wrap.appendChild(tip);
      frag.appendChild(wrap);
    }

    function stateOf(i) {
      if (!state[i]) state[i] = { solved: false, attempts: 0, first: false };
      return state[i];
    }

    /* ── 步骤推进 ─────────────────────────────────────── */
    var sections = [];

    C.steps.forEach(function (s, i) {
      var sec = h('section', 'step' + (i === 0 ? ' active' : ''));
      sec.dataset.step = String(i + 1);
      var fn = RENDER[s.type];
      if (fn) sec.appendChild(fn(s, i));
      else sec.appendChild(h('p', 'muted', '（未知步骤类型：' + s.type + '）'));
      stage.appendChild(sec);
      sections.push(sec);
    });

    function isQuiz(i) {
      var s = C.steps[i];
      if (!s) return false;
      if (s.type !== 'quiz' && s.type !== 'choice') return false;
      // 语文默认不设门禁：只有真有一条对错线的语言知识，才显式写 hard:true
      if (LANG && s.hard !== true) return false;
      return true;
    }

    function syncNav() {
      pnum.textContent = C.steps[cur] && C.steps[cur].type === 'summary'
        ? '小结' : '第 ' + (cur + 1) + ' / ' + total + ' 步';
      fill.style.width = ((cur + 1) / total * 100) + '%';
      btnPrev.disabled = cur === 0;
      var last = cur === total - 1;
      btnNext.textContent = last ? '完成' : '下一步';
      // 题目没答对不让过（可以回退）
      btnNext.disabled = isQuiz(cur) && !stateOf(cur).solved && !last;
    }

    function show(i) {
      cur = Math.max(0, Math.min(total - 1, i));
      sections.forEach(function (s, k) { s.classList.toggle('active', k === cur); });
      syncNav();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    btnPrev.onclick = function () { show(cur - 1); };
    btnNext.onclick = function () {
      if (cur === total - 1) { finish(); return; }
      show(cur + 1);
    };
    document.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight' && !btnNext.disabled) btnNext.click();
      if (e.key === 'ArrowLeft' && !btnPrev.disabled) btnPrev.click();
    });

    /* ── 结算 ─────────────────────────────────────────── */
    function finish() {
      if (LANG) { finishLang(); return; }
      var quizIdx = [];
      C.steps.forEach(function (s, i) { if (isQuiz(i)) quizIdx.push(i); });
      var first = quizIdx.filter(function (i) { return stateOf(i).first; }).length;
      var mins = Math.max(1, Math.round((Date.now() - startedAt) / 60000));

      var card = $('scoreCard');
      if (card) {
        card.innerHTML = '<div class="score">' + first + ' / ' + quizIdx.length +
          ' <small>一次答对</small></div>' +
          '<p class="muted" style="margin:6px 0 0">用时约 ' + mins + ' 分钟</p>' +
          (C.advice ? '<p style="margin:10px 0 0">' + adviceText(first, quizIdx.length) + '</p>' : '');
      }

      try {
        localStorage.setItem('stx.course.' + C.topicId, JSON.stringify({
          done: true,
          score: quizIdx.length ? first / quizIdx.length : 1,
          minutes: mins, at: Date.now(), v: C.version || '1.0.0',
        }));
      } catch (e) { /* 隐私模式忽略 */ }

      if (G && CR.extend) CR.extend($('extend'), G, { score: first + '/' + quizIdx.length });

      if (new URLSearchParams(location.search).get('stay') === '1') return;

      btnNext.textContent = '返回图谱…';
      btnNext.disabled = true;
      var sc = new URLSearchParams(location.search).get('sharecode');
      setTimeout(function () {
        var q = new URLSearchParams();
        if (sc) q.set('sharecode', sc);
        q.set('done', '1');
        q.set('score', first + '/' + quizIdx.length);
        q.set('minutes', String(mins));
        location.href = '../../viz/index.html?' + q.toString() + '#t=' + C.topicId;
      }, 900);
    }

    /* 语文结算：不谈「答对率」，只报「留下了什么痕迹」。
     * 五项痕迹：圈了几处、写了没有、改了没有、自评了几维、走了几步。
     */
    function finishLang() {
      var TASK = ['choice', 'quiz', 'annotate', 'draft', 'rubric',
        'sentBuild', 'pairMatch', 'transform', 'punctPick',
        'predict', 'poemNote', 'senses', 'checkup',
        'pinyin', 'story', 'readAloud', 'writeChar'];
      var tasks = 0, marks = 0;
      C.steps.forEach(function (s, k) {
        if (TASK.indexOf(s.type) < 0) return;
        tasks++;
        if (stateOf(k).solved) marks++;
      });
      var mins = Math.max(1, Math.round((Date.now() - startedAt) / 60000));

      var selfLines = [], draftText = '', readLine = '', writtenImg = '';
      C.steps.forEach(function (s, k) {
        var st = stateOf(k);
        if (s.type === 'rubric' && st.self) {
          Object.keys(st.self).forEach(function (d) { selfLines.push(d + '：' + st.self[d]); });
        }
        if (st.draft) draftText = st.draft;
        if (st.read) readLine = '朗读' + (st.read.sec ? ' ' + st.read.sec + ' 秒' : '') + ' · 自评 ' + st.read.self + ' 条';
        if (st.written) writtenImg = st.written;
      });

      var card = $('scoreCard');
      if (card) {
        card.innerHTML =
          '<div class="score">' + marks + ' / ' + tasks + ' <small>项留下了痕迹</small></div>' +
          '<p class="muted" style="margin:6px 0 0">用时约 ' + mins + ' 分钟</p>' +
          (selfLines.length
            ? '<div class="self-recap">' + selfLines.map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div>'
            : '') +
          (readLine ? '<div class="self-recap"><span>' + readLine + '</span></div>' : '') +
          (writtenImg
            ? '<div class="draft-recap written-recap"><b>你写的这个字</b><p><img src="' + writtenImg + '" alt="手写的字"></p></div>'
            : '') +
          (draftText ? '<div class="draft-recap"><b>你写的这一句</b><p>' +
            draftText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br>') + '</p></div>' : '') +
          '<p style="margin:10px 0 0">' + (C.advice || '把今天写的那一句存进句子本，明天再读一遍。') + '</p>';
      }

      try {
        localStorage.setItem('stx.course.' + C.topicId, JSON.stringify({
          done: true, kind: 'chinese', marks: marks, tasks: tasks,
          self: selfLines, draft: draftText,
          minutes: mins, at: Date.now(), v: C.version || '1.0.0',
        }));
        if (draftText) {
          var book = [];
          try { book = JSON.parse(localStorage.getItem('stx.sentences') || '[]') || []; } catch (e2) { book = []; }
          book.unshift({ t: draftText, topic: C.topicId, title: C.title, at: Date.now() });
          localStorage.setItem('stx.sentences', JSON.stringify(book.slice(0, 20)));
        }
      } catch (e) { /* 隐私模式忽略 */ }

      if (G && CR.extend) CR.extend($('extend'), G, { score: marks + '/' + tasks });

      if (new URLSearchParams(location.search).get('stay') === '1') return;

      btnNext.textContent = '返回图谱…';
      btnNext.disabled = true;
      var sc = new URLSearchParams(location.search).get('sharecode');
      setTimeout(function () {
        var q = new URLSearchParams();
        if (sc) q.set('sharecode', sc);
        q.set('done', '1');
        q.set('kind', 'chinese');
        q.set('minutes', String(mins));
        q.set('marks', marks + '/' + tasks);
        location.href = '../../viz/index.html?' + q.toString() + '#t=' + C.topicId;
      }, 900);
    }

    function adviceText(got, all) {
      if (!all) return C.advice;
      if (got === all) return C.advice || '全对。可以往下走了。';
      if (got >= Math.ceil(all * 0.6)) return C.advice || '基本稳了，错的那道回头再看一遍步骤。';
      return '建议退回前面几步重看，再回来做一遍。';
    }

    /* 分享码透传 */
    (function () {
      var sc = new URLSearchParams(location.search).get('sharecode');
      if (!sc) return;
      [].slice.call(document.querySelectorAll('a[href*="index.html"]')).forEach(function (a) {
        var href = a.getAttribute('href');
        if (href.indexOf('sharecode=') >= 0) return;
        var i = href.indexOf('#');
        var base = i >= 0 ? href.slice(0, i) : href;
        var tail = i >= 0 ? href.slice(i) : '';
        a.setAttribute('href', base + '?sharecode=' + encodeURIComponent(sc) + tail);
      });
    })();

    show(0);
  }

  global.CourseEngine = { mount: mount };
})(window);

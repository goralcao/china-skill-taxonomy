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

        var stat = h('div', 'an-stat');
        var why = h('div', 'an-why', b.idle || '点你找到的词，点错也没关系。');
        var found = {};
        var n = 0;

        function paint() {
          stat.innerHTML = '已圈出 <b>' + n + '</b> 处' + (n >= need ? ' · 够了，可以往下' : '，再找找');
          stat.className = 'an-stat' + (n >= need ? ' ok' : '');
        }

        segs.forEach(function (g) {
          if (g.k === undefined) { box.appendChild(document.createTextNode(g.t)); return; }
          var tok = h('button', 'an-tok', g.t);
          tok.type = 'button';
          tok.onclick = function () {
            if (found[g.k]) {
              why.innerHTML = '<b>' + g.t + '</b>' + (marks[g.k].why || '');
              return;
            }
            found[g.k] = true; n++;
            tok.classList.add('hit');
            why.innerHTML = '<b>你圈出了「' + g.t + '」</b>　' + (marks[g.k].why || '');
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
        'sentBuild', 'pairMatch', 'transform', 'punctPick'];
      var tasks = 0, marks = 0;
      C.steps.forEach(function (s, k) {
        if (TASK.indexOf(s.type) < 0) return;
        tasks++;
        if (stateOf(k).solved) marks++;
      });
      var mins = Math.max(1, Math.round((Date.now() - startedAt) / 60000));

      var selfLines = [], draftText = '';
      C.steps.forEach(function (s, k) {
        var st = stateOf(k);
        if (s.type === 'rubric' && st.self) {
          Object.keys(st.self).forEach(function (d) { selfLines.push(d + '：' + st.self[d]); });
        }
        if (st.draft) draftText = st.draft;
      });

      var card = $('scoreCard');
      if (card) {
        card.innerHTML =
          '<div class="score">' + marks + ' / ' + tasks + ' <small>项留下了痕迹</small></div>' +
          '<p class="muted" style="margin:6px 0 0">用时约 ' + mins + ' 分钟</p>' +
          (selfLines.length
            ? '<div class="self-recap">' + selfLines.map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div>'
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

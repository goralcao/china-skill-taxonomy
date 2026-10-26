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
            if (st.solved) return;
            st.attempts++;
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

    /** 给可演算的呈现器挂一组按钮：一步一步算 / 重来 */
    function attachDemo(frag, ctrl, s) {
      if (!ctrl || typeof ctrl.next !== 'function' || s.demo === false) return;
      var wrap = h('div', 'demo');
      var label = s.demoLabel || '▶ 一步一步算';
      var next = h('button', 'btn small primary', label);
      var reset = h('button', 'btn small', '重来');
      var tip = h('p', 'demo-tip', s.demoHint || '点按钮，一位一位算给你看。');
      var idle = s.demoHint || '点按钮，一位一位算给你看。';
      var doneLabel = s.demoDone || '算完了';

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
      var t = C.steps[i] && C.steps[i].type;
      return t === 'quiz' || t === 'choice';
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

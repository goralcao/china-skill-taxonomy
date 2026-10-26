/* 学阶图谱课件 · 呈现器库
 *
 * 教学结构（explain / drill / explore / review）回答「怎么教」，
 * 呈现器回答「怎么画」：竖式要真的竖排、几何要真的动、数轴要真的可拖。
 *
 * 用法：
 *   var v = CR.vertical(el, { a: 345, b: 278, op: '+' });
 *   v.reveal(3);      // 从右往左揭示 3 位答案
 *   v.carries(true);  // 显示进位标记
 *
 * 所有呈现器只依赖 DOM / SVG，不加载任何外部资源。
 */
(function (global) {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';

  function s(tag, attrs, parent) {
    var el = document.createElementNS(SVGNS, tag);
    if (attrs) {
      for (var k in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, k)) el.setAttribute(k, attrs[k]);
      }
    }
    if (parent) parent.appendChild(el);
    return el;
  }

  function h(tag, cls, text) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text != null) el.textContent = text;
    return el;
  }

  var reduced = function () {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  };

  /* ══════════════════════════════════════════════════════
   * 竖式
   * 为什么单独做：横式的「345 + 278」看不出进位从哪来。
   * 竖式把数位对齐、把进位写成一个小 1，孩子才看得见「满十进一」。
   * ══════════════════════════════════════════════════════ */
  function vertical(el, spec) {
    var a = String(spec.a == null ? '' : spec.a).replace(/\s/g, '');
    var b = String(spec.b == null ? '' : spec.b).replace(/\s/g, '');
    var op = spec.op || '+';
    var n = Math.max(a.length, b.length);
    var cols = n + 1; // 第一列放运算符

    var root = h('div', 'vert');
    root.setAttribute('role', 'img');
    root.setAttribute('aria-label', a + ' ' + op + ' ' + b + ' 的竖式');

    function row(cls) {
      var r = h('div', 'vrow ' + (cls || ''));
      r.style.gridTemplateColumns = '1.14em repeat(' + n + ', 1.14em)';
      root.appendChild(r);
      return r;
    }

    // —— 逐位算进位 / 借位
    var carry = new Array(n + 2).fill(0);
    var borrowAt = new Array(n + 2).fill(0); // 1 表示该位被借走
    var da = a.split('').reverse().map(Number);
    var db = b.split('').reverse().map(Number);

    if (op === '×' || op === '*') {
      // 一位数乘法：从个位起逐位乘，满几十进几（进到左边一位）
      var mult = Number(b);
      if (String(b).length === 1 && isFinite(mult)) {
        for (var m = 0; m < n; m++) {
          var prod = (da[m] || 0) * mult + carry[m];
          carry[m + 1] = Math.floor(prod / 10);
        }
      }
    } else if (op === '+' || op === '-') {
      if (op === '+') {
        for (var i = 0; i < n; i++) {
          var t = (da[i] || 0) + (db[i] || 0) + carry[i];
          carry[i + 1] = Math.floor(t / 10);
        }
      } else {
        for (var j = 0; j < n; j++) {
          var x = (da[j] || 0) - borrowAt[j] - (db[j] || 0);
          if (x < 0) {
            x += 10;
            borrowAt[j + 1] = 1;
          }
        }
      }
    }

    // —— 进位行
    var carryRow = row('vcarry');
    carryRow.appendChild(h('span', ''));
    var carryCells = [];
    for (var c = n - 1; c >= 0; c--) {
      var cell = h('span', '');
      // carry[c] = 进入第 c 位的进位，显示在第 c 位上方
      if ((op === '+' || op === '×' || op === '*') && carry[c]) {
        cell.textContent = carry[c] > 1 ? String(carry[c]) : '1';
      }
      if (op === '-' && borrowAt[c]) { cell.textContent = '·'; cell.className = 'borrow'; }
      cell.dataset.bit = String(c);          // 该单元格对应第 c 位（0 = 个位）
      carryRow.appendChild(cell);
      carryCells.push(cell);
    }

    // —— 数字行
    function numberRow(numStr, prefix) {
      var r = row('');
      var opCell = h('span', 'vop', prefix || '');
      r.appendChild(opCell);
      var padded = numStr.padStart(n, ' ');
      for (var k = 0; k < n; k++) {
        r.appendChild(h('span', '', padded[k] === ' ' ? '' : padded[k]));
      }
      return r;
    }
    numberRow(a, '');
    numberRow(b, op === '-' ? '−' : op);

    // —— 横线与答案
    root.appendChild(h('div', 'vline'));

    var answer;
    if (op === '+') answer = String(Number(a || 0) + Number(b || 0));
    else if (op === '-') answer = String(Number(a || 0) - Number(b || 0));
    else if (op === '×' || op === '*') answer = String(Number(a || 1) * Number(b || 1));
    else if (op === '÷' || op === '/') answer = String(Number(a || 0) / Number(b || 1));
    else answer = spec.answer == null ? '' : String(spec.answer);

    var ansRow = row('vans');
    var ansOp = h('span', '');
    ansRow.appendChild(ansOp);
    var ansCells = [];
    var ansPadded = answer.padStart(n, ' ');
    var extra = answer.length - n; // 进位导致结果多一位
    if (extra > 0) {
      ansOp.textContent = '';
      ansPadded = answer;
    }
    for (var m = 0; m < (extra > 0 ? answer.length : n); m++) {
      var ch = ansPadded[m] === ' ' ? '' : ansPadded[m];
      var cellEl = h('span', 'hide', ch);
      ansRow.appendChild(cellEl);
      ansCells.push(cellEl);
    }
    if (extra > 0) ansRow.style.gridTemplateColumns = '1.14em repeat(' + answer.length + ', 1.14em)';

    el.appendChild(root);

    var ctrl = {
      el: root,
      answer: answer,
      /** 从右往左揭示 n 位答案 */
      reveal: function (count) {
        var total = ansCells.length;
        var k = typeof count === 'number' ? count : total;
        ansCells.forEach(function (cell, idx) {
          // idx 从左到右，所以倒着算
          var fromRight = total - idx;
          cell.className = fromRight <= k ? '' : 'hide';
        });
        return ctrl;
      },
      carries: function (show) {
        carryRow.style.visibility = show === false ? 'hidden' : 'visible';
        return ctrl;
      },
      /** 高亮某一列（从右数第 idx 位，0 起） */
      highlight: function (idx) {
        root.querySelectorAll('.vrow > span').forEach(function (sp) {
          sp.classList.remove('done', 'pending');
        });
        if (idx == null) return ctrl;
        var col = n - idx; // grid 里的列号（含运算符列）
        root.querySelectorAll('.vrow').forEach(function (r) {
          var kids = r.children;
          for (var q = 0; q < kids.length; q++) {
            if (q === col) kids[q].classList.add('done');
          }
        });
        return ctrl;
      },
      reset: function () {
        ctrl.reveal(0);
        return ctrl;
      }
    };
    /* ── 逐步演算：一次算一位，返回这一步的说明 ───────── */
    var POS = ['个位', '十位', '百位', '千位', '万位', '十万位'];
    var demoStage = 0;

    function posName(i) { return POS[i] || ('第 ' + (i + 1) + ' 位'); }

    function descFor(i) {
      var x = da[i] || 0, y = db[i] || 0, c = carry[i] || 0;
      if (op === '+' || op === '×' || op === '*') {
        var expr = op === '+' ? x + ' + ' + y + (c ? ' + ' + c : '')
                              : x + ' × ' + b + (c ? ' + ' + c : '');
        var sum = op === '+' ? x + y + c : x * Number(b) + c;
        var up = carry[i + 1] || 0;
        return posName(i) + '：' + expr + ' = <b>' + sum + '</b>，写 ' + (sum % 10) +
          (up ? '，向前一位进 <b>' + up + '</b>' : '，不进位');
      }
      // 减法
      var borrow = borrowAt[i] || 0;
      var diff = x - borrow - y;
      if (diff < 0) {
        return posName(i) + '：' + x + ' 减 ' + y + ' 不够，向前一位借 1，' +
          '<b>' + (x + 10) + ' − ' + y + ' = ' + (x + 10 - y) + '</b>';
      }
      return posName(i) + '：' + x + (borrow ? ' − ' + borrow : '') + ' − ' + y +
        ' = <b>' + diff + '</b>';
    }

    ctrl.stages = n;
    /** 演算下一位；返回 { text, done }，算完返回 null */
    ctrl.next = function () {
      if (demoStage >= n) return null;
      var i = demoStage++;
      ctrl.reveal(i + 1);
      ctrl.highlight(i);
      carryCells.forEach(function (cell) {
        var bit = Number(cell.dataset.bit);
        cell.style.opacity = bit <= i + 1 ? '1' : '0';
      });
      return { text: descFor(i), done: demoStage >= n, pos: i };
    };
    /** 回到未算状态：答案全部遮住、进位全部隐藏 */
    ctrl.startDemo = function () {
      demoStage = 0;
      ctrl.reveal(0);
      ctrl.highlight(null);
      carryRow.style.visibility = 'visible';
      carryCells.forEach(function (cell) { cell.style.opacity = '0'; });
      return ctrl;
    };

    ctrl.reveal(spec.reveal == null ? 0 : spec.reveal);
    if (spec.carries === false) ctrl.carries(false);
    // 没显式要求「全部揭示」时，默认进入可演算状态
    if (spec.reveal !== 'all' && spec.reveal !== 99) ctrl.startDemo();
    return ctrl;
  }

  /* ══════════════════════════════════════════════════════
   * 几何
   * presets：
   *   rectGrid —— 长方形铺满方格，逐格数出面积
   *   cut      —— 平行四边形沿高剪一刀，平移到右边拼成长方形
   * ══════════════════════════════════════════════════════ */
  function geometry(el, spec) {
    var preset = spec.preset || 'rectGrid';
    var W = 320, H = 220;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', role: 'img' });
    el.appendChild(svg);

    if (preset === 'rectGrid') {
      var cols = spec.w || 6, rows = spec.h || 4;
      var pad = 34;
      var availW = W - pad * 2, availH = H - pad * 2 - 12;
      var cw = availW / cols, ch = availH / rows;
      var csize = Math.min(cw, ch);
      var ox = (W - csize * cols) / 2;
      var oy = 26;

      var g = s('g', null, svg);
      // 方格
      var cells = [];
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          var rect = s('rect', {
            x: ox + c * csize, y: oy + r * csize,
            width: csize, height: csize, class: 'geo-cell'
          }, g);
          cells.push(rect);
        }
      }
      s('rect', {
        x: ox, y: oy, width: csize * cols, height: csize * rows, class: 'geo-outline'
      }, svg);

      // 边长标注
      s('line', { x1: ox, y1: oy + csize * rows + 16, x2: ox + csize * cols, y2: oy + csize * rows + 16, class: 'geo-dim' }, svg);
      s('line', { x1: ox, y1: oy + csize * rows + 12, x2: ox, y2: oy + csize * rows + 20, class: 'geo-dim' }, svg);
      s('line', { x1: ox + csize * cols, y1: oy + csize * rows + 12, x2: ox + csize * cols, y2: oy + csize * rows + 20, class: 'geo-dim' }, svg);
      var tw = s('text', { x: ox + csize * cols / 2, y: oy + csize * rows + 34, class: 'geo-dim-text', 'text-anchor': 'middle' }, svg);
      tw.textContent = (spec.unitW || cols) + (spec.unit || ' 格');

      s('line', { x1: ox - 16, y1: oy, x2: ox - 16, y2: oy + csize * rows, class: 'geo-dim' }, svg);
      var th = s('text', {
        x: ox - 26, y: oy + csize * rows / 2, class: 'geo-dim-text',
        'text-anchor': 'middle', transform: 'rotate(-90 ' + (ox - 26) + ' ' + (oy + csize * rows / 2) + ')'
      }, svg);
      th.textContent = (spec.unitH || rows) + (spec.unit || ' 格');

      var ctrlG = {
        el: svg,
        total: cols * rows,
        reveal: function (count) {
          var k = count == null ? cells.length : count;
          cells.forEach(function (cell, idx) { cell.classList.toggle('on', idx < k); });
          return ctrlG;
        },
        play: function (perCell) {
          var i = 0;
          var dt = reduced() ? 0 : (perCell || 55);
          (function next() {
            if (i > cells.length) return;
            ctrlG.reveal(i);
            i++;
            if (i <= cells.length) setTimeout(next, dt);
          })();
          return ctrlG;
        },
        reset: function () { ctrlG.reveal(0); return ctrlG; }
      };
      return ctrlG;
    }

    if (preset === 'cut') {
      // 平行四边形：底 b、高 h、上边错位 skew
      var base = 170, height = 96, skew = 52;
      var x0 = 74, y0 = 150;
      var top = y0 - height;

      var piece = s('g', { class: 'geo-piece' }, svg);
      s('polygon', {
        points: [x0 + skew, top, x0 + skew + base, top, x0 + base, y0, x0, y0].join(' '),
        class: 'geo-outline',
        fill: 'rgba(167,139,250,.16)'
      }, piece);

      // 剪开的虚线（高）
      var cut = s('line', {
        x1: x0 + skew, y1: top, x2: x0 + skew, y2: y0, class: 'geo-cut'
      }, svg);
      cut.style.opacity = '0';

      // 左侧三角形（可平移那块）
      var tri = s('polygon', {
        points: [x0 + skew, top, x0 + skew, y0, x0, y0].join(' '),
        fill: 'rgba(251,146,60,.35)', stroke: 'var(--borrow)', 'stroke-width': 1.6
      }, svg);
      tri.style.opacity = '0';

      var baseLine = s('line', { x1: x0, y1: y0 + 14, x2: x0 + base, y2: y0 + 14, class: 'geo-dim' }, svg);
      var baseText = s('text', { x: x0 + base / 2, y: y0 + 32, class: 'geo-dim-text', 'text-anchor': 'middle' }, svg);
      baseText.textContent = '底 ' + (spec.base || 8) + (spec.unit || ' cm');

      var hLine = s('line', { x1: x0 + skew - 18, y1: top, x2: x0 + skew - 18, y2: y0, class: 'geo-dim' }, svg);
      var hText = s('text', {
        x: x0 + skew - 26, y: y0 - height / 2, class: 'geo-dim-text', 'text-anchor': 'middle',
        transform: 'rotate(-90 ' + (x0 + skew - 26) + ' ' + (y0 - height / 2) + ')'
      }, svg);
      hText.textContent = '高 ' + (spec.height || 4) + (spec.unit || ' cm');

      var ctrlC = {
        el: svg,
        play: function () {
          var dt = reduced() ? 0 : 380;
          cut.style.transition = 'opacity .3s';
          cut.style.opacity = '1';
          setTimeout(function () {
            tri.style.transition = 'opacity .3s';
            tri.style.opacity = '1';
            setTimeout(function () {
              // 把左侧三角形平移到右边
              tri.style.transition = reduced() ? 'none' : 'transform .85s cubic-bezier(.4,0,.2,1)';
              tri.style.transform = 'translate(' + base + 'px, 0)';
              setTimeout(function () {
                // 拼好后整体描成矩形
                piece.querySelector('polygon').setAttribute('fill', 'rgba(74,222,128,.14)');
              }, reduced() ? 0 : 900);
            }, dt);
          }, dt);
          return ctrlC;
        },
        reset: function () {
          cut.style.opacity = '0';
          tri.style.opacity = '0';
          tri.style.transition = 'none';
          tri.style.transform = 'none';
          piece.querySelector('polygon').setAttribute('fill', 'rgba(167,139,250,.16)');
          return ctrlC;
        }
      };
      return ctrlC;
    }

    if (preset === 'perimeter') {
      // 长方形四条边分别标注，可逐边高亮：周长就是四条边加起来
      var pw = spec.w || 180, ph = spec.h || 100;
      var px = (W - pw) / 2, py = (H - ph) / 2 - 6;
      var edges = [
        { x1: px, y1: py, x2: px + pw, y2: py, label: spec.top || '5 米', lx: px + pw / 2, ly: py - 10 },
        { x1: px + pw, y1: py, x2: px + pw, y2: py + ph, label: spec.right || '3 米', lx: px + pw + 16, ly: py + ph / 2 + 4 },
        { x1: px + pw, y1: py + ph, x2: px, y2: py + ph, label: spec.top || '5 米', lx: px + pw / 2, ly: py + ph + 20 },
        { x1: px, y1: py + ph, x2: px, y2: py, label: spec.right || '3 米', lx: px - 18, ly: py + ph / 2 + 4 },
      ];
      var shapes = [];
      edges.forEach(function (e, i) {
        var ln = s('line', {
          x1: e.x1, y1: e.y1, x2: e.x2, y2: e.y2,
          stroke: 'var(--geo)', 'stroke-width': 2.4, 'stroke-linecap': 'round',
        }, svg);
        var tx = s('text', { x: e.lx, y: e.ly, class: 'geo-dim-text', 'text-anchor': 'middle' }, svg);
        tx.textContent = e.label;
        shapes.push({ line: ln, text: tx });
      });
      // 顶点圆点，方便「从哪开始绕一圈」
      [[px, py], [px + pw, py], [px + pw, py + ph], [px, py + ph]].forEach(function (pt) {
        s('circle', { cx: pt[0], cy: pt[1], r: 3.4, fill: 'var(--geo)' }, svg);
      });
      var topLen = parseFloat(spec.top) || 5;
      var rightLen = parseFloat(spec.right) || 3;
      var lens = [topLen, rightLen, topLen, rightLen];
      var unit = spec.unit || ' 米';

      // 图形中央的累计式
      var sumText = s('text', {
        x: W / 2, y: H / 2 + 4, class: 'geo-dim-text',
        'text-anchor': 'middle', 'font-size': '14', 'font-weight': '600',
      }, svg);
      sumText.textContent = '';

      var ctrlP = {
        el: svg,
        count: 4,
        lengths: lens,
        highlight: function (n) {
          var k = n == null ? 4 : n;
          shapes.forEach(function (sh, i) {
            var done = i < k;
            var cur = i === k - 1;
            sh.line.setAttribute('stroke', done ? 'var(--ok)' : 'rgba(167,139,250,.35)');
            sh.line.setAttribute('stroke-width', cur ? 4 : (done ? 2.8 : 2));
            sh.text.setAttribute('fill', done ? 'var(--ok)' : 'var(--dim)');
          });
          if (k > 0 && k < 4) {
            var sum = lens.slice(0, k).reduce(function (a, b) { return a + b; }, 0);
            sumText.textContent = lens.slice(0, k).join(' + ') + ' = ' + sum + unit;
          } else if (k >= 4) {
            var all = lens.reduce(function (a, b) { return a + b; }, 0);
            sumText.textContent = lens.join(' + ') + ' = ' + all + unit;
          } else {
            sumText.textContent = '';
          }
          return ctrlP;
        },
        play: function () { ctrlP.highlight(0); return ctrlP; },
        reset: function () { ctrlP.highlight(4); return ctrlP; },
      };

      // 逐条边演示
      var walked = 0;
      ctrlP.next = function () {
        if (walked >= 4) return null;
        walked++;
        ctrlP.highlight(walked);
        var sum = lens.slice(0, walked).reduce(function (a, b) { return a + b; }, 0);
        var isLast = walked === 4;
        var calc = walked === 1
          ? '先走 ' + lens[0] + unit
          : lens.slice(0, walked).join(' + ') + ' = <b>' + sum + unit + '</b>';
        return {
          text: '走过第 ' + walked + ' 条边（' + lens[walked - 1] + unit + '）：' + calc +
            (isLast ? '　一圈走完，四条边加起来就是周长' : ''),
          done: isLast,
        };
      };
      ctrlP.startDemo = function () { walked = 0; ctrlP.highlight(0); return ctrlP; };
      return ctrlP;
    }

    if (preset === 'fraction') {
      // 平均分成 parts 份，涂上 filled 份
      var parts = spec.parts || 4;
      var filled = spec.filled == null ? 1 : spec.filled;
      var cx = W / 2, cy = H / 2 - 4, R0 = Math.min(W, H) * 0.30;
      var start = -Math.PI / 2;
      var slices = [];
      for (var pi = 0; pi < parts; pi++) {
        var a0 = start + pi * 2 * Math.PI / parts;
        var a1 = a0 + 2 * Math.PI / parts;
        var x0 = cx + Math.cos(a0) * R0, y0 = cy + Math.sin(a0) * R0;
        var x1 = cx + Math.cos(a1) * R0, y1 = cy + Math.sin(a1) * R0;
        var large = (a1 - a0) > Math.PI ? 1 : 0;
        var d = 'M' + cx + ' ' + cy + ' L' + x0.toFixed(1) + ' ' + y0.toFixed(1) +
          ' A' + R0 + ' ' + R0 + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' Z';
        var path = s('path', {
          d: d, fill: 'transparent', stroke: 'var(--geo)', 'stroke-width': 1.8,
        }, svg);
        slices.push(path);
      }
      var filledNow = filled;
      var ctrlF = {
        el: svg,
        parts: parts,
        fill: function (k) {
          var n = k == null ? filled : k;
          slices.forEach(function (sl, i) {
            sl.setAttribute('fill', i < n ? 'rgba(167,139,250,.55)' : 'transparent');
          });
          return ctrlF;
        },
        play: function () { ctrlF.fill(0); return ctrlF; },
        reset: function () { ctrlF.fill(filled); return ctrlF; },
        reveal: function (k) { return ctrlF.fill(k); },
      };

      // 逐份涂色：讲「又取了几份」时用
      ctrlF.next = function () {
        if (filledNow >= parts) return null;
        filledNow++;
        ctrlF.fill(filledNow);
        return {
          text: '又涂 1 份：现在是 ' + parts + ' 份里的 <b>' + filledNow + ' 份</b>' +
            '，写作 <b>' + filledNow + '/' + parts + '</b>',
          done: filledNow >= parts,
        };
      };
      ctrlF.startDemo = function () { filledNow = 0; ctrlF.fill(0); return ctrlF; };
      ctrlF.fill(filled);
      return ctrlF;
    }

    // 兜底：画一个空框，避免调用方拿到 undefined
    s('rect', { x: 40, y: 40, width: W - 80, height: H - 80, class: 'geo-outline' }, svg);
    return { el: svg, play: function () {}, reset: function () {}, reveal: function () {} };
  }

  /* ══════════════════════════════════════════════════════
   * 数轴
   * ══════════════════════════════════════════════════════ */
  function numberline(el, spec) {
    var min = spec.min == null ? 0 : spec.min;
    var max = spec.max == null ? 10 : spec.max;
    var step = spec.step || 1;
    var W = 340, H = spec.height || 110;
    var padL = 26, padR = 26;
    var y = Math.round(H * 0.56);
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', role: 'img' });
    el.appendChild(svg);

    var x = function (v) { return padL + (v - min) / (max - min) * (W - padL - padR); };

    // 区间高亮
    var spanRect = null;
    if (spec.span) {
      spanRect = s('rect', {
        x: x(spec.span[0]), y: y - 16, width: x(spec.span[1]) - x(spec.span[0]), height: 32,
        class: 'nl-span', rx: 4
      }, svg);
    }

    s('line', { x1: padL - 8, y1: y, x2: W - padR + 8, y2: y, class: 'nl-axis' }, svg);
    // 箭头
    s('polygon', {
      points: (W - padR + 8) + ',' + y + ' ' + (W - padR) + ',' + (y - 4) + ' ' + (W - padR) + ',' + (y + 4),
      fill: 'var(--dim)'
    }, svg);

    for (var v = min; v <= max + 1e-9; v += step) {
      var px = x(v);
      s('line', { x1: px, y1: y - 5, x2: px, y2: y + 5, class: 'nl-tick' }, svg);
      var tx = s('text', { x: px, y: y + 22, class: 'nl-text' }, svg);
      tx.textContent = String(Math.round(v * 100) / 100);
    }

    var marks = [];
    (spec.marks || []).forEach(function (mk) {
      var cx = x(mk.v);
      var dot = s('circle', { cx: cx, cy: y, r: 5.5, class: 'nl-point', fill: mk.color || 'var(--num)' }, svg);
      if (mk.label) {
        var lb = s('text', { x: cx, y: y - 14, class: 'nl-point-label' }, svg);
        lb.textContent = mk.label;
      }
      marks.push({ dot: dot, label: mk.label, v: mk.v });
    });

    var handle = null;
    if (spec.draggable) {
      handle = s('circle', {
        cx: x(spec.value == null ? min : spec.value), cy: y - 34, r: 9, class: 'nl-handle'
      }, svg);
      s('line', {
        x1: handle.getAttribute('cx'), y1: Number(handle.getAttribute('cy')) + 9,
        x2: handle.getAttribute('cx'), y2: y - 6, stroke: 'var(--accent)', 'stroke-width': 1.4, 'stroke-dasharray': '3 3'
      }, svg);
    }

    var ctrl = {
      el: svg,
      x: x,
      setSpan: function (a, b) {
        if (!spanRect) return ctrl;
        spanRect.setAttribute('x', x(a));
        spanRect.setAttribute('width', x(b) - x(a));
        return ctrl;
      },
      setValue: function (val) {
        if (!handle) return ctrl;
        handle.setAttribute('cx', x(val));
        return ctrl;
      },
      reset: function () { return ctrl; }
    };
    return ctrl;
  }

  /* ══════════════════════════════════════════════════════
   * 坐标系
   * ══════════════════════════════════════════════════════ */
  function coords(el, spec) {
    var xmin = spec.xmin == null ? -5 : spec.xmin;
    var xmax = spec.xmax == null ? 5 : spec.xmax;
    var ymin = spec.ymin == null ? -4 : spec.ymin;
    var ymax = spec.ymax == null ? 8 : spec.ymax;
    var W = 340, H = 260;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', role: 'img' });
    el.appendChild(svg);

    var x = function (v) { return (v - xmin) / (xmax - xmin) * W; };
    var y = function (v) { return H - (v - ymin) / (ymax - ymin) * H; };

    // 网格
    for (var gx = Math.ceil(xmin); gx <= xmax; gx++) {
      s('line', { x1: x(gx), y1: 0, x2: x(gx), y2: H, class: 'cx-grid' }, svg);
    }
    for (var gy = Math.ceil(ymin); gy <= ymax; gy++) {
      s('line', { x1: 0, y1: y(gy), x2: W, y2: y(gy), class: 'cx-grid' }, svg);
    }
    // 轴
    if (ymin <= 0 && ymax >= 0) s('line', { x1: 0, y1: y(0), x2: W, y2: y(0), class: 'cx-axis' }, svg);
    if (xmin <= 0 && xmax >= 0) s('line', { x1: x(0), y1: 0, x2: x(0), y2: H, class: 'cx-axis' }, svg);

    // 刻度
    for (var tx = Math.ceil(xmin); tx <= xmax; tx++) {
      if (tx === 0) continue;
      var t1 = s('text', { x: x(tx), y: y(0) + 15, class: 'cx-text', 'text-anchor': 'middle' }, svg);
      t1.textContent = tx;
    }
    for (var ty = Math.ceil(ymin); ty <= ymax; ty++) {
      if (ty === 0) continue;
      var t2 = s('text', { x: x(0) - 8, y: y(ty) + 4, class: 'cx-text', 'text-anchor': 'end' }, svg);
      t2.textContent = ty;
    }

    var colors = ['var(--accent)', 'var(--num)', 'var(--geo)', 'var(--ok)', 'var(--bad)'];
    var curves = [];
    (spec.curves || []).forEach(function (cv, idx) {
      var fn;
      try {
        fn = new Function('x', 'return (' + cv.fn + ');');
      } catch (e) {
        return;
      }
      var d = '';
      var N = 220;
      for (var i = 0; i <= N; i++) {
        var xv = xmin + (xmax - xmin) * i / N;
        var yv = fn(xv);
        if (!isFinite(yv) || Math.abs(yv) > 1e4) { d = ''; continue; }
        var px = x(xv), py = y(yv);
        d += (d ? ' L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1);
      }
      if (!d) return;
      var path = s('path', {
        d: d, class: 'cx-curve', stroke: cv.color || colors[idx % colors.length]
      }, svg);
      curves.push(path);
    });

    (spec.points || []).forEach(function (pt) {
      s('circle', { cx: x(pt.x), cy: y(pt.y), r: 4.5, class: 'cx-dot' }, svg);
      if (pt.label) {
        var lb = s('text', { x: x(pt.x) + 8, y: y(pt.y) - 7, class: 'cx-dot-label' }, svg);
        lb.textContent = pt.label;
      }
    });

    return {
      el: svg,
      x: x, y: y,
      play: function () {
        if (reduced()) return this;
        curves.forEach(function (p) {
          var len = p.getTotalLength ? p.getTotalLength() : 600;
          p.style.strokeDasharray = len;
          p.style.strokeDashoffset = len;
          p.style.transition = 'stroke-dashoffset 1.1s ease';
          requestAnimationFrame(function () { p.style.strokeDashoffset = '0'; });
        });
        return this;
      },
      reset: function () { return this; }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 钟面
   * ══════════════════════════════════════════════════════ */
  function clock(el, spec) {
    var S = spec.size || 220;
    var R = S / 2 - 8;
    var cx = S / 2, cy = S / 2;
    var svg = s('svg', { viewBox: '0 0 ' + S + ' ' + S, width: S, role: 'img' });
    svg.setAttribute('aria-label', '钟面');
    el.appendChild(svg);

    s('circle', { cx: cx, cy: cy, r: R, class: 'ck-face' }, svg);

    for (var i = 0; i < 60; i++) {
      var major = i % 5 === 0;
      var ang = i * 6 * Math.PI / 180;
      var r1 = R - (major ? 12 : 6), r2 = R - 2;
      s('line', {
        x1: cx + Math.sin(ang) * r1, y1: cy - Math.cos(ang) * r1,
        x2: cx + Math.sin(ang) * r2, y2: cy - Math.cos(ang) * r2,
        class: 'ck-tick' + (major ? ' major' : '')
      }, svg);
    }
    [12, 3, 6, 9].forEach(function (num) {
      var ang = num * 30 * Math.PI / 180;
      var t = s('text', {
        x: cx + Math.sin(ang) * (R - 26), y: cy - Math.cos(ang) * (R - 26), class: 'ck-num'
      }, svg);
      t.textContent = num;
    });

    function hand(cls, len, width, back) {
      return s('line', {
        x1: cx, y1: cy + (back || 0), x2: cx, y2: cy - len,
        class: 'ck-hand ' + cls, style: 'stroke-width:' + width
      }, svg);
    }
    var hourHand = hand('hour', R * 0.50, 5, R * 0.08);
    var minHand = hand('minute', R * 0.74, 3.2, R * 0.10);
    var secHand = hand('second', R * 0.82, 1.5, R * 0.14);
    if (spec.showSecond === false) secHand.style.display = 'none';
    s('circle', { cx: cx, cy: cy, r: 4.2, class: 'ck-center' }, svg);

    var state = { absMinutes: spec.absMinutes == null ? 8 * 60 : spec.absMinutes };

    function setAbs(absMinutes) {
      state.absMinutes = ((absMinutes % 720) + 720) % 720;
      var m = state.absMinutes;
      var hourAngle = (m / 60) * 30;
      var minAngle = (m % 60) * 6;
      var sec = spec.second || 0;
      hourHand.setAttribute('transform', 'rotate(' + hourAngle + ' ' + cx + ' ' + cy + ')');
      minHand.setAttribute('transform', 'rotate(' + minAngle + ' ' + cx + ' ' + cy + ')');
      secHand.setAttribute('transform', 'rotate(' + (sec * 6) + ' ' + cx + ' ' + cy + ')');
      var hh = Math.floor(m / 60) === 0 ? 12 : Math.floor(m / 60);
      var mm = Math.round(m % 60);
      svg.setAttribute('aria-label', hh + ' 时 ' + mm + ' 分');
    }
    setAbs(state.absMinutes);

    return {
      el: svg,
      setAbs: function (m) { setAbs(m); return this; },
      getAbs: function () { return state.absMinutes; },
      /** 强调某根针：'hour' | 'minute' | 'second' | null */
      pick: function (which) {
        [['hour', hourHand], ['minute', minHand], ['second', secHand]].forEach(function (pair) {
          pair[1].classList.toggle('dim', which && pair[0] !== which);
        });
        return this;
      },
      /** 分针拖拽：把屏幕坐标换成分钟 */
      absFromPoint: function (clientX, clientY) {
        var box = svg.getBoundingClientRect();
        var sx = (clientX - box.left) / box.width * S;
        var sy = (clientY - box.top) / box.height * S;
        var ang = Math.atan2(sx - cx, cy - sy) * 180 / Math.PI;
        var deg = (ang + 360) % 360;
        return deg / 6; // 0~60 分钟
      }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 图谱连接件
   * 课件不是一个孤立的页面：进来要看见它在图上的位置，
   * 学完要知道往哪走。两块都由构建时注入的 __GRAPH 驱动。
   * ══════════════════════════════════════════════════════ */
  function graphHref(tid) {
    var sc = null;
    try { sc = new URLSearchParams(location.search).get('sharecode'); } catch (e) { /* 老浏览器忽略 */ }
    return '../../viz/index.html'
      + (sc ? '?sharecode=' + encodeURIComponent(sc) : '')
      + '#t=' + encodeURIComponent(tid);
  }

  function a(href, text, cls) {
    var el = document.createElement('a');
    el.href = href;
    el.textContent = text;
    if (cls) el.className = cls;
    return el;
  }

  /** 页首位置条：前置 → 本课 → 解锁 */
  function graphNav(container, G) {
    if (!container) return null;
    container.className = 'gnav';
    container.innerHTML = '';

    var pre = (G.prereqs || []).slice(0, 2);
    var post = (G.unlocks || []).slice(0, 2);

    container.appendChild(h('span', 'gnav-label', '前置'));
    if (pre.length) {
      pre.forEach(function (p, i) {
        if (i) container.appendChild(h('span', 'sep', '·'));
        container.appendChild(a(graphHref(p.id), p.name));
      });
    } else {
      container.appendChild(h('span', 'gnav-label', '无（本课是起点）'));
    }

    container.appendChild(h('span', 'sep', '→'));
    var self = h('span', 'gnav-pair');
    self.appendChild(h('span', 'gnav-label', '本课'));
    self.appendChild(a(graphHref(G.id), G.name, 'self'));
    container.appendChild(self);

    if (post.length) {
      container.appendChild(h('span', 'sep', '→'));
      container.appendChild(h('span', 'gnav-label', '解锁'));
      post.forEach(function (p, i) {
        if (i) container.appendChild(h('span', 'sep', '·'));
        container.appendChild(a(graphHref(p.id), p.name));
      });
    }
    return container;
  }

  /** 页尾延伸：补先修、接着学、在图谱里看 */
  function extend(container, G, opts) {
    if (!container) return null;
    opts = opts || {};
    container.innerHTML = '';

    function block(title, note, items, tagText) {
      if (!items || !items.length) return;
      var wrap = h('div', 'extend');
      var head = h('h3', null, title);
      if (note) head.appendChild(h('small', null, note));
      wrap.appendChild(head);
      items.forEach(function (it) {
        var row = document.createElement('a');
        row.className = 'ext-item';
        row.href = graphHref(it.id);
        var who = h('div', 'who');
        who.appendChild(h('b', null, it.name));
        who.appendChild(h('span', null, (it.subject || '') + ' · ' + it.grade + ' 年级'
          + (it.reason ? '　' + it.reason : '')));
        row.appendChild(who);
        var tag = h('span', 'tag' + (it.course === 'reviewed' ? ' has' : ''),
          it.course === 'reviewed' ? '有课件' : (tagText || '在图谱中'));
        row.appendChild(tag);
        wrap.appendChild(row);
      });
      container.appendChild(wrap);
    }

    // 1) 先修：给「学不动时回哪去」一个具体去处
    block('回去补一补', '这些没弄熟，本课容易卡住', G.prereqs, '先修');

    // 2) 接着学：优先推有课件的，没课件也给出去向
    var nexts = (G.unlocks || []).slice();
    nexts.sort(function (x, y) {
      var cx = x.course === 'reviewed' ? 0 : 1;
      var cy = y.course === 'reviewed' ? 0 : 1;
      return cx - cy || x.grade - y.grade;
    });
    block('接着学', '本课是这些内容的前置', nexts.slice(0, 3), '后续');

    // 3) 在图谱里看：把课上用到但没展开的信息摊开
    var info = h('div', 'extend');
    var t3 = h('h3', null, '这一课在图谱里是什么');
    info.appendChild(t3);

    var card = h('div', 'card');
    var lines = [];
    lines.push('<b>领域</b>：' + G.domain + '　<b>学段</b>：' + G.stage + '　<b>年级</b>：' + G.grade + ' 年级');
    if (G.standards && G.standards.length) {
      lines.push('<b>课标</b>：' + G.standards.join('、'));
    }
    if (G.textbookLabels && G.textbookLabels.length) {
      lines.push('<b>教材</b>：' + G.textbookLabels.join('；'));
    } else if (G.textbooks && G.textbooks.length) {
      lines.push('<b>教材</b>：' + G.textbooks.join('；'));
    }
    card.innerHTML = lines.map(function (x) { return '<p style="margin:0 0 6px">' + x + '</p>'; }).join('');
    info.appendChild(card);

    if (G.siblings && G.siblings.length) {
      info.appendChild(h('p', 'ext-note', '同一个领域里的其他知识点：'));
      var row = h('div', 'gnav');
      G.siblings.forEach(function (sb) {
        row.appendChild(a(graphHref(sb.id), sb.name));
      });
      info.appendChild(row);
    }

    info.appendChild(a(graphHref(G.id), '在图谱中查看「' + G.name + '」', 'ext-item'));
    container.appendChild(info);

    return container;
  }

  global.CR = {
    vertical: vertical,
    geometry: geometry,
    numberline: numberline,
    coords: coords,
    clock: clock,
    graphNav: graphNav,
    extend: extend,
    graphHref: graphHref,
    reduced: reduced
  };
})(window);

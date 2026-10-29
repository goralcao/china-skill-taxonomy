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

  // SVG 文本快捷方式（各渲染器共用）
  function T(parent, x, y, v, st) {
    var t = s('text', { x: x, y: y, style: st || 'font-size:13px' }, parent);
    t.textContent = v; return t;
  }

  function reduced() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

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
    spec = spec || {};
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

      var shownCells = 0;
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
        next: function () {
          if (shownCells >= cells.length) return null;
          shownCells++;
          ctrlG.reveal(shownCells);
          return {
            text: '铺上第 ' + shownCells + ' 格：现在是 ' + shownCells + (spec.countUnit || spec.unit || ' 格') + '。',
            done: shownCells >= cells.length
          };
        },
        startDemo: function () { shownCells = 0; ctrlG.reveal(0); return ctrlG; },
        reset: function () { shownCells = 0; ctrlG.reveal(0); return ctrlG; }
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

  /* ══════════════════════════════════════════════════════
   * 立体图形
   * 为什么单独做：长方体最难的从来不是背「6 面 12 棱 8 顶点」，
   * 而是在平面图上分不清哪个面在后面、哪两条棱是一组。
   * 这里手写一次投影：能拖着转、能一组一组高亮、能摊平成展开图，
   * 仍然是一个不联网的 SVG。
   * ══════════════════════════════════════════════════════ */
  function solid(el, spec) {
    spec = spec || {};
    var w = Math.max(1, spec.w || 6);
    var hh = Math.max(1, spec.h || 4);
    var d = Math.max(1, spec.d || 3);
    var focus = spec.focus || 'all';
    var W = 380, H = 300;

    var svg = s('svg', {
      viewBox: '0 0 ' + W + ' ' + H,
      class: 'solid-svg',
      role: 'img',
      'aria-label': '长 ' + w + '、宽 ' + d + '、高 ' + hh + ' 的长方体，可拖动旋转'
    }, el);

    var g3d = s('g', null, svg);
    var gFaces = s('g', null, g3d);
    var gEdges = s('g', null, g3d);
    var gVerts = s('g', null, g3d);
    var gNet = s('g', { opacity: 0 }, svg);
    gNet.style.transition = 'opacity .5s ease';
    gNet.style.transformBox = 'view-box';
    gNet.style.transformOrigin = (W / 2) + 'px ' + (H / 2) + 'px';
    gNet.style.transform = 'scale(.94)';
    g3d.style.transition = 'opacity .5s ease';

    var hx = w / 2, hy = hh / 2, hz = d / 2;
    var V = [
      [-hx, -hy, -hz], [hx, -hy, -hz], [hx, hy, -hz], [-hx, hy, -hz],
      [-hx, -hy, hz], [hx, -hy, hz], [hx, hy, hz], [-hx, hy, hz]
    ];
    var F = [
      { id: 'front', v: [4, 5, 6, 7], c: '#2563eb' },
      { id: 'back', v: [1, 0, 3, 2], c: '#3b82f6' },
      { id: 'right', v: [5, 1, 2, 6], c: '#0d9488' },
      { id: 'left', v: [0, 4, 7, 3], c: '#14b8a6' },
      { id: 'top', v: [7, 6, 2, 3], c: '#d97706' },
      { id: 'bottom', v: [0, 1, 5, 4], c: '#f59e0b' }
    ];
    var E = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7]
    ];
    // 长、高、宽各 4 条
    var GROUPS = { len: [0, 2, 4, 6], height: [1, 3, 5, 7], depth: [8, 9, 10, 11] };

    var S = Math.min((W * 0.74) / (w + d), (H * 0.74) / (hh + d));
    var yaw = spec.yaw == null ? -0.62 : spec.yaw;
    var pitch = spec.pitch == null ? 0.36 : spec.pitch;
    var net = false;
    var activeF = [], activeE = [], showV = false;

    function proj(p) {
      var cy = Math.cos(yaw), sy = Math.sin(yaw);
      var x1 = p[0] * cy + p[2] * sy;
      var z1 = -p[0] * sy + p[2] * cy;
      var cp = Math.cos(pitch), sp = Math.sin(pitch);
      var y1 = p[1] * cp - z1 * sp;
      var z2 = p[1] * sp + z1 * cp;
      var k = 1 + z2 * 0.006;
      return [W / 2 + x1 * S / k, H / 2 - 10 - y1 * S / k, z2];
    }

    var polys = F.map(function (f) {
      var el = s('polygon', {
        fill: f.c, 'fill-opacity': 0.16, stroke: f.c,
        'stroke-width': 1.4, 'stroke-linejoin': 'round'
      }, gFaces);
      el.style.transition = 'fill-opacity .35s ease, stroke-width .35s ease';
      return el;
    });
    var lines = E.map(function () {
      var el = s('line', {
        stroke: '#94a3b8', 'stroke-width': 1.8, 'stroke-linecap': 'round'
      }, gEdges);
      el.style.transition = 'stroke .3s ease, stroke-width .3s ease, opacity .4s ease';
      return el;
    });
    var dots = V.map(function () {
      var el = s('circle', { r: 3.6, fill: '#e8edf5', opacity: 0 }, gVerts);
      el.style.transition = 'opacity .3s ease';
      return el;
    });

    // 展开图：四个侧面排一排，上下两个面贴在中间那个面的上下
    var NS = Math.min((W * 0.88) / (3 * d + w), (H * 0.82) / (2 * d + hh));
    function netRect(cx, cy, rw, rh) {
      var x = W / 2 + (cx - rw / 2) * NS;
      var y = H / 2 + (cy - rh / 2) * NS;
      return [x, y, rw * NS, rh * NS];
    }
    var NLAYOUT = {
      left: netRect(-w / 2 - d / 2, 0, d, hh),
      front: netRect(0, 0, w, hh),
      right: netRect(w / 2 + d / 2, 0, d, hh),
      back: netRect(w / 2 + d + d / 2, 0, d, hh),
      top: netRect(0, -hh / 2 - d / 2, w, d),
      bottom: netRect(0, hh / 2 + d / 2, w, d)
    };
    F.forEach(function (f) {
      var r = NLAYOUT[f.id];
      s('rect', {
        x: r[0], y: r[1], width: r[2], height: r[3],
        fill: f.c, 'fill-opacity': 0.2, stroke: f.c, 'stroke-width': 1.6
      }, gNet);
    });

    function render() {
      if (net) {
        g3d.style.opacity = 0;
        gNet.style.opacity = 1;
        gNet.style.transform = 'scale(1)';
        return;
      }
      g3d.style.opacity = 1;
      gNet.style.opacity = 0;
      gNet.style.transform = 'scale(.94)';

      var P = V.map(proj);
      F.forEach(function (f, i) {
        polys[i].setAttribute('points', f.v.map(function (vi) {
          return P[vi][0].toFixed(1) + ',' + P[vi][1].toFixed(1);
        }).join(' '));
        var on = activeF.indexOf(f.id) >= 0;
        polys[i].setAttribute('fill-opacity', on ? 0.55 : (activeF.length ? 0.07 : 0.16));
        polys[i].setAttribute('stroke-width', on ? 2.6 : 1.4);
      });
      // 背面先画，正面压在上面
      F.map(function (f, i) {
        return { i: i, z: f.v.reduce(function (n, vi) { return n + P[vi][2]; }, 0) / 4 };
      }).sort(function (a, b) { return b.z - a.z; }).forEach(function (o) {
        gFaces.appendChild(polys[o.i]);
      });

      E.forEach(function (e, i) {
        lines[i].setAttribute('x1', P[e[0]][0].toFixed(1));
        lines[i].setAttribute('y1', P[e[0]][1].toFixed(1));
        lines[i].setAttribute('x2', P[e[1]][0].toFixed(1));
        lines[i].setAttribute('y2', P[e[1]][1].toFixed(1));
        var on = activeE.indexOf(i) >= 0;
        lines[i].setAttribute('stroke', on ? '#0f172a' : '#94a3b8');
        lines[i].setAttribute('stroke-width', on ? 4 : 1.8);
      });

      dots.forEach(function (dEl, i) {
        dEl.setAttribute('cx', P[i][0].toFixed(1));
        dEl.setAttribute('cy', P[i][1].toFixed(1));
        dEl.setAttribute('opacity', showV ? 1 : 0);
      });
    }

    function clear() {
      activeF = []; activeE = []; showV = false; net = false;
      render();
    }

    /* ── 拖动旋转 ── */
    var drag = null;
    svg.addEventListener('pointerdown', function (e) {
      if (net) return;
      drag = { x: e.clientX, y: e.clientY, yaw: yaw, pitch: pitch };
      spin = false;
      try { svg.setPointerCapture(e.pointerId); } catch (err) {}
    });
    svg.addEventListener('pointermove', function (e) {
      if (!drag) return;
      yaw = drag.yaw + (e.clientX - drag.x) * 0.012;
      pitch = Math.max(-1.1, Math.min(1.2, drag.pitch + (e.clientY - drag.y) * 0.01));
      render();
    });
    function endDrag() { drag = null; }
    svg.addEventListener('pointerup', endDrag);
    svg.addEventListener('pointercancel', endDrag);

    var spin = !reduced() && spec.spin !== false;
    function tick() {
      if (!spin || net || drag) return;
      yaw += 0.0045;
      render();
      requestAnimationFrame(tick);
    }

    /* ── 演示步骤 ── */
    var STEPS = [];
    if (focus === 'faces' || focus === 'all') {
      STEPS.push({ f: ['front', 'back'], text: '前面和后面：都是 ' + w + '×' + hh + '，完全一样。' });
      STEPS.push({ f: ['left', 'right'], text: '左面和右面：都是 ' + d + '×' + hh + '，完全一样。' });
      STEPS.push({ f: ['top', 'bottom'], text: '上面和下面：都是 ' + w + '×' + d + '，完全一样。三组面，共 6 个。' });
    }
    if (focus === 'edges' || focus === 'all') {
      STEPS.push({ e: GROUPS.len, text: '先数长的方向：4 条棱，每条都是 ' + w + '。' });
      STEPS.push({ e: GROUPS.height, text: '再数高的方向：4 条棱，每条都是 ' + hh + '。' });
      STEPS.push({ e: GROUPS.depth, text: '最后数宽的方向：又是 4 条，每条 ' + d + '。4+4+4=12 条棱。' });
    }
    if (focus === 'vertices' || focus === 'all') {
      STEPS.push({ v: true, text: '8 个顶点：每个顶点都连着 3 条棱。' });
    }
    if (focus === 'unfold' || focus === 'all') {
      STEPS.push({ unfold: true, text: '沿棱剪开、摊平——6 个面排成一张展开图，面积一点没变。' });
    }
    var idx = 0;

    render();
    if (spin) requestAnimationFrame(tick);

    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++];
        spin = false;
        if (st.f) { activeF = st.f; activeE = []; showV = false; net = false; }
        if (st.e) { activeE = st.e; activeF = []; showV = false; net = false; }
        if (st.v) { showV = true; activeF = []; activeE = []; net = false; }
        if (st.unfold) { net = true; }
        render();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () {
        idx = 0;
        clear();
        return this;
      },
      reset: function () { idx = 0; clear(); }
    };
  }


  /* ══════════════════════════════════════════════════════
   * 除法竖式
   * 加减乘的竖式只做一件事：一位一位算。
   * 除法多两件：这一位商几（试商），算完把下一位落下来。
   * 所以单独做，而不是往 vertical 里塞分支。
   * ══════════════════════════════════════════════════════ */
  function division(el, spec) {
    var a = String(spec.a == null ? '' : spec.a).replace(/\D/g, '');
    var b = Number(spec.b);
    if (!a || !b) {
      el.appendChild(h('p', 'muted', '除法竖式需要被除数和除数。'));
      return { el: el };
    }

    var digits = a.split('').map(Number);
    var n = digits.length;
    var cell = 30, rowH = 34, padL = 46, padT = 16;
    var steps = [], rem = 0, started = false;
    for (var i = 0; i < n; i++) {
      var cur = rem * 10 + digits[i];
      if (!started && cur < b) { rem = cur; continue; }
      started = true;
      var qd = Math.floor(cur / b);
      var prod = qd * b;
      rem = cur - prod;
      steps.push({ col: i, cur: cur, qd: qd, prod: prod, rem: rem });
    }

    var rows = 2 + steps.length * 2;
    var W = padL + n * cell + 26;
    var H = padT + rows * rowH + 10;
    var PLACE = ['个位', '十位', '百位', '千位', '万位'];

    function x(col) { return padL + col * cell + cell / 2; }
    function y(row) { return padT + row * rowH + rowH * 0.72; }

    var svg = s('svg', {
      viewBox: '0 0 ' + W + ' ' + H,
      class: 'div-svg',
      role: 'img',
      'aria-label': a + ' 除以 ' + b + ' 的竖式'
    }, el);
    svg.style.width = '100%';
    svg.style.height = 'auto';
    svg.style.maxWidth = '360px';

    function num(str, col, row, cls) {
      var t = s('text', { x: x(col), y: y(row), 'text-anchor': 'middle', class: cls || 'dnum' }, svg);
      t.textContent = str;
      return t;
    }

    // 括号与被除数
    s('path', {
      d: 'M' + (padL - 12) + ' ' + (y(1) - 24) + 'V' + (y(rows - 1) + 8) +
         'M' + (padL - 12) + ' ' + (y(1) - 24) + 'H' + (padL + n * cell + 2),
      class: 'dbar'
    }, svg);
    var dv = s('text', { x: padL - 20, y: y(1), 'text-anchor': 'end', class: 'dnum' }, svg);
    dv.textContent = String(b);
    digits.forEach(function (dg, i) { num(String(dg), i, 1); });

    function hidden(el) { el.style.opacity = 0; el.style.transition = 'opacity .35s ease'; return el; }

    var ops = [];
    var sh = steps;
    // 除数是两位数时，用「四舍五入看成整十数」来试商
    var est = '';
    if (b >= 10) {
      var near = Math.round(b / 10) * 10;
      est = '（把 ' + b + ' 看成 ' + (near || 10) + ' 试商）';
    }
    for (var k = 0; k < sh.length; k++) {
      var st = sh[k];
      var qEl = hidden(num(String(st.qd), st.col, 0));
      ops.push({
        els: [qEl],
        text: (k === 0 ? st.cur + ' ÷ ' + b + est + ' 商 ' + st.qd : '把 ' + st.cur + ' 除以 ' + b + '，商 ' + st.qd) +
              '，写在' + PLACE[n - 1 - st.col] + '上。'
      });

      var gap = String(st.prod).length;
      var pEls = [];
      String(st.prod).split('').forEach(function (dg, j) {
        pEls.push(hidden(num(dg, st.col - gap + 1 + j, 2 + k * 2)));
      });
      pEls.push(hidden(s('line', {
        x1: x(st.col - gap + 1) - cell / 2 + 3,
        y1: y(2 + k * 2) + 9,
        x2: x(st.col) + cell / 2 - 3,
        y2: y(2 + k * 2) + 9,
        class: 'dunder'
      }, svg)));
      ops.push({
        els: pEls,
        text: st.qd + ' × ' + b + ' = ' + st.prod + '，写在 ' + st.cur + ' 的下面。'
      });

      var dEls = [];
      var dstr = String(st.rem);
      var dgap = dstr.length;
      dstr.split('').forEach(function (dg, j) {
        dEls.push(hidden(num(dg, st.col - dgap + 1 + j, 3 + k * 2)));
      });
      var nextStep = sh[k + 1];
      if (nextStep) {
        dEls.push(hidden(num(String(digits[nextStep.col]), nextStep.col, 3 + k * 2)));
      }
      ops.push({
        els: dEls,
        text: st.cur + ' − ' + st.prod + ' = ' + st.rem +
          (nextStep ? '，把下一位落下来。'
            : (st.rem ? '，余 ' + st.rem + '。' : '，正好除尽。'))
      });
    }

    // 落下来之后的数，直接按真实值说，避免口算出错
    for (var k2 = 0; k2 < sh.length - 1; k2++) {
      var op = ops[k2 * 3 + 2];
      var nxt = sh[k2 + 1];
      op.text = sh[k2].cur + ' − ' + sh[k2].prod + ' = ' + sh[k2].rem +
        '，把 ' + digits[nxt.col] + ' 落下来，变成 ' + nxt.cur + '。';
    }

    var idx = 0;
    return {
      el: svg,
      next: function () {
        if (idx >= ops.length) return null;
        var o = ops[idx++];
        o.els.forEach(function (e) { e.style.opacity = 1; });
        return { text: o.text, done: idx >= ops.length };
      },
      startDemo: function () {
        idx = 0;
        ops.forEach(function (o) { o.els.forEach(function (e) { e.style.opacity = 0; }); });
        return this;
      },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 分子与原子
   * 化学最讲不清的是「原子去哪了」。这里让原子真的挪位置：
   * 断键 → 搬家 → 成键，屏幕上原子数一个不少。
   * ══════════════════════════════════════════════════════ */
  function molecule(el, spec) {
    var atoms = (spec.atoms || []).slice();
    var W = 380, H = 250;
    var R = 15;
    var COLORS = {
      H: '#cbd5e1', O: '#f87171', C: '#94a3b8', N: '#60a5fa',
      Na: '#c084fc', Cl: '#4ade80', Ca: '#fbbf24', S: '#facc15'
    };

    var svg = s('svg', {
      viewBox: '0 0 ' + W + ' ' + H, class: 'mol-svg', role: 'img',
      'aria-label': (spec.label || '分子变化') + '的原子重排'
    }, el);

    function mkLine(group, i, j, useTo) {
      var p = useTo ? atoms[i].to : atoms[i].from;
      var q = useTo ? atoms[j].to : atoms[j].from;
      var ln = s('line', {
        x1: p[0], y1: p[1], x2: q[0], y2: q[1],
        stroke: '#64748b', 'stroke-width': 3, 'stroke-linecap': 'round'
      }, group);
      ln.style.transition = 'opacity .5s ease';
      return ln;
    }

    // 原子坐标以画布中心为原点，整体平移一次，省得每个点都加偏移
    var gRoot = s('g', { transform: 'translate(' + (W / 2) + ',' + (H / 2) + ')' }, svg);
    var gB0 = s('g', null, gRoot);
    var gB1 = s('g', null, gRoot);
    var gAtoms = s('g', null, gRoot);

    var b0 = (spec.bondsBefore || []).map(function (p) { return mkLine(gB0, p[0], p[1], false); });
    var b1 = (spec.bondsAfter || []).map(function (p) {
      var ln = mkLine(gB1, p[0], p[1], true);
      ln.style.opacity = 0;
      return ln;
    });

    var nodes = atoms.map(function (at) {
      var g = s('g', { transform: 'translate(' + at.from[0] + ',' + at.from[1] + ')' }, gAtoms);
      g.style.transition = 'transform .75s cubic-bezier(.4,0,.2,1)';
      s('circle', { r: R, fill: COLORS[at.el] || '#cbd5e1', stroke: '#0b1220', 'stroke-width': 1.5 }, g);
      var t = s('text', {
        x: 0, y: 5, 'text-anchor': 'middle',
        style: 'font-size:13px;font-weight:700;fill:#0b1220'
      }, g);
      t.textContent = at.el;
      return g;
    });

    var count = {};
    atoms.forEach(function (at) { count[at.el] = (count[at.el] || 0) + 1; });
    var tally = Object.keys(count).map(function (el2) { return el2 + ' ' + count[el2]; }).join(' · ');
    var cap = s('text', {
      x: W / 2, y: H - 12, 'text-anchor': 'middle',
      style: 'font-size:13px;fill:var(--dim)'
    }, svg);
    cap.textContent = '原子清点：' + tally;

    var STEPS = [
      { text: '先看清反应前有什么：' + tally + '。', run: function () {
        nodes.forEach(function (g, i) {
          g.style.transition = 'transform .2s ease';
          g.setAttribute('transform', 'translate(' + atoms[i].from[0] + ',' + (atoms[i].from[1] - 6) + ')');
          setTimeout(function () {
            g.setAttribute('transform', 'translate(' + atoms[i].from[0] + ',' + atoms[i].from[1] + ')');
            g.style.transition = 'transform .75s cubic-bezier(.4,0,.2,1)';
          }, 180);
        });
      } },
      { text: '断开旧分子里的键——原子本身没变，只是松开了。', run: function () {
        b0.forEach(function (l) { l.style.opacity = 0; });
      } },
      { text: '原子搬家，按新的方式组合。注意：一个原子都没多、也没少。', run: function () {
        nodes.forEach(function (g, i) {
          g.setAttribute('transform', 'translate(' + atoms[i].to[0] + ',' + atoms[i].to[1] + ')');
        });
      } },
      { text: '连成新分子。反应前后都是 ' + tally + '，这就是质量守恒。', run: function () {
        b1.forEach(function (l) { l.style.opacity = 1; });
      } }
    ];

    var idx = 0;
    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++];
        st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () {
        idx = 0;
        b0.forEach(function (l) { l.style.opacity = 1; });
        b1.forEach(function (l) { l.style.opacity = 0; });
        nodes.forEach(function (g, i) {
          g.setAttribute('transform', 'translate(' + atoms[i].from[0] + ',' + atoms[i].from[1] + ')');
        });
        return this;
      },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 棱锥与线面角
   * 线面角难在「看不见的射影」。把 P 往底面投下来，
   * 角就出现在 PB 和 BO 之间；转一下，角度不变。
   * ══════════════════════════════════════════════════════ */
  function pyramid(el, spec) {
    spec = spec || {};
    var a = Math.max(0.5, spec.a || 2);
    var hh = Math.max(0.5, spec.h || 2);
    var focus = spec.focus === 'dihedral' ? 'dihedral' : 'line';
    var W = 380, H = 300;
    var svg = s('svg', {
      viewBox: '0 0 ' + W + ' ' + H, class: 'pyr-svg', role: 'img',
      'aria-label': '正四棱锥，底面边长 ' + a + '，高 ' + hh
    }, el);

    var hx = a / 2, hy = hh / 2;
    var A = [-hx, -hy, hx], B = [hx, -hy, hx], C = [hx, -hy, -hx], D = [-hx, -hy, -hx];
    var P = [0, hy, 0], O = [0, -hy, 0];
    var V = [A, B, C, D, P];
    var FACES = [
      { v: [0, 1, 2, 3], c: '#d97706', o: 0.26 },
      { v: [4, 0, 1], c: '#2563eb', o: 0.14 },
      { v: [4, 1, 2], c: '#0d9488', o: 0.14 },
      { v: [4, 2, 3], c: '#0d9488', o: 0.1 },
      { v: [4, 3, 0], c: '#2563eb', o: 0.1 }
    ];
    var EDGES = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 0], [4, 1], [4, 2], [4, 3]];

    var S = Math.min((W * 0.74) / (a * 1.45), (H * 0.86) / (hh + a * 0.75));
    var yaw = spec.yaw == null ? -0.62 : spec.yaw;
    var pitch = spec.pitch == null ? 0.4 : spec.pitch;

    function proj(p) {
      var cy = Math.cos(yaw), sy = Math.sin(yaw);
      var x1 = p[0] * cy + p[2] * sy;
      var z1 = -p[0] * sy + p[2] * cy;
      var cp = Math.cos(pitch), sp = Math.sin(pitch);
      var y1 = p[1] * cp - z1 * sp;
      var z2 = p[1] * sp + z1 * cp;
      var k = 1 + z2 * 0.008;
      return [W / 2 + x1 * S / k, H / 2 - 10 - y1 * S / k, z2];
    }

    var gF = s('g', null, svg), gE = s('g', null, svg), gAn = s('g', null, svg);
    var polys = FACES.map(function (f) {
      return s('polygon', {
        fill: f.c, 'fill-opacity': f.o, stroke: f.c, 'stroke-width': 1.2,
        'stroke-linejoin': 'round'
      }, gF);
    });
    var lines = EDGES.map(function () {
      return s('line', { stroke: '#94a3b8', 'stroke-width': 1.8, 'stroke-linecap': 'round' }, gE);
    });
    FACES.forEach(function (f, i) { polys[i].style.transition = 'fill-opacity .35s ease'; });

    var lPB = s('line', { stroke: '#fbbf24', 'stroke-width': 3.4, 'stroke-linecap': 'round' }, gAn);
    var lBO = s('line', { stroke: '#38bdf8', 'stroke-width': 2.4, 'stroke-dasharray': '6 5', 'stroke-linecap': 'round' }, gAn);
    var arc = s('polyline', { fill: 'none', stroke: '#fbbf24', 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, gAn);
    var lab = s('text', {
      'text-anchor': 'middle',
      style: 'font-size:15px;font-weight:700;fill:#fbbf24;paint-order:stroke;stroke:#0a0f18;stroke-width:4px'
    }, gAn);
    [lPB, lBO, arc, lab].forEach(function (e) { e.style.opacity = 0; e.style.transition = 'opacity .4s ease'; });

    // 角的两条边：B→P 与 B→O
    function sub(u, v) { return [u[0] - v[0], u[1] - v[1], u[2] - v[2]]; }
    function len(u) { return Math.sqrt(u[0] * u[0] + u[1] * u[1] + u[2] * u[2]); }
    function unit(u) { var l = len(u) || 1; return [u[0] / l, u[1] / l, u[2] / l]; }
    function dot(u, v) { return u[0] * v[0] + u[1] * v[1] + u[2] * v[2]; }
    var BP = sub(P, B), BO = sub(O, B);
    var theta = Math.acos(Math.max(-1, Math.min(1, dot(unit(BP), unit(BO))))) * 180 / Math.PI;
    var u1 = unit(BO);
    var v1 = unit(sub(BP, [u1[0] * dot(BP, u1), u1[1] * dot(BP, u1), u1[2] * dot(BP, u1)]));
    var rad = a * 0.28;
    var ARC = [];
    for (var t = 0; t <= 24; t++) {
      var ang = theta * Math.PI / 180 * (t / 24);
      ARC.push([
        B[0] + rad * (Math.cos(ang) * u1[0] + Math.sin(ang) * v1[0]),
        B[1] + rad * (Math.cos(ang) * u1[1] + Math.sin(ang) * v1[1]),
        B[2] + rad * (Math.cos(ang) * u1[2] + Math.sin(ang) * v1[2])
      ]);
    }
    var LAB = [
      B[0] + rad * 2.3 * (Math.cos(theta / 2 * Math.PI / 180) * u1[0] + Math.sin(theta / 2 * Math.PI / 180) * v1[0]),
      B[1] + rad * 2.3 * (Math.cos(theta / 2 * Math.PI / 180) * u1[1] + Math.sin(theta / 2 * Math.PI / 180) * v1[1]),
      B[2] + rad * 2.3 * (Math.cos(theta / 2 * Math.PI / 180) * u1[2] + Math.sin(theta / 2 * Math.PI / 180) * v1[2])
    ];

    /* ── 二面角：棱 BC，半平面 PBC 与底面 ABCD ── */
    var M = [(B[0] + C[0]) / 2, (B[1] + C[1]) / 2, (B[2] + C[2]) / 2];
    var MO2 = sub(O, M), MP2 = sub(P, M);
    var theta2 = Math.acos(Math.max(-1, Math.min(1, dot(unit(MO2), unit(MP2))))) * 180 / Math.PI;
    var u2 = unit(MO2);
    var v2 = unit(sub(MP2, [u2[0] * dot(MP2, u2), u2[1] * dot(MP2, u2), u2[2] * dot(MP2, u2)]));
    var rad2 = a * 0.24;
    var ARC2 = [];
    for (var t2 = 0; t2 <= 24; t2++) {
      var ang2 = theta2 * Math.PI / 180 * (t2 / 24);
      ARC2.push([
        M[0] + rad2 * (Math.cos(ang2) * u2[0] + Math.sin(ang2) * v2[0]),
        M[1] + rad2 * (Math.cos(ang2) * u2[1] + Math.sin(ang2) * v2[1]),
        M[2] + rad2 * (Math.cos(ang2) * u2[2] + Math.sin(ang2) * v2[2])
      ]);
    }
    var LAB2 = [
      M[0] + rad2 * 1.9 * (Math.cos(theta2 / 2 * Math.PI / 180) * u2[0] + Math.sin(theta2 / 2 * Math.PI / 180) * v2[0]),
      M[1] + rad2 * 1.9 * (Math.cos(theta2 / 2 * Math.PI / 180) * u2[1] + Math.sin(theta2 / 2 * Math.PI / 180) * v2[1]),
      M[2] + rad2 * 1.9 * (Math.cos(theta2 / 2 * Math.PI / 180) * u2[2] + Math.sin(theta2 / 2 * Math.PI / 180) * v2[2])
    ];

    var lBC = s('line', { stroke: '#fbbf24', 'stroke-width': 4, 'stroke-linecap': 'round' }, gAn);
    var lMP = s('line', { stroke: '#fbbf24', 'stroke-width': 2.6, 'stroke-linecap': 'round' }, gAn);
    var lMO = s('line', { stroke: '#38bdf8', 'stroke-width': 2.2, 'stroke-linecap': 'round' }, gAn);
    var arc2 = s('polyline', { fill: 'none', stroke: '#fbbf24', 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, gAn);
    var lab2 = s('text', {
      'text-anchor': 'middle',
      style: 'font-size:15px;font-weight:700;fill:#fbbf24;paint-order:stroke;stroke:#0a0f18;stroke-width:4px'
    }, gAn);
    [lBC, lMP, lMO, arc2, lab2].forEach(function (e) {
      e.style.opacity = 0;
      e.style.transition = 'opacity .4s ease';
    });
    if (focus === 'dihedral') {
      [lPB, lBO, arc, lab].forEach(function (e) { e.style.display = 'none'; });
    } else {
      [lBC, lMP, lMO, arc2, lab2].forEach(function (e) { e.style.display = 'none'; });
    }

    function render() {
      var Pp = V.map(proj);
      FACES.forEach(function (f, i) {
        polys[i].setAttribute('points', f.v.map(function (vi) {
          return Pp[vi][0].toFixed(1) + ',' + Pp[vi][1].toFixed(1);
        }).join(' '));
      });
      FACES.map(function (f, i) {
        return { i: i, z: f.v.reduce(function (n, vi) { return n + Pp[vi][2]; }, 0) / f.v.length };
      }).sort(function (x2, y2) { return y2.z - x2.z; }).forEach(function (o) {
        gF.appendChild(polys[o.i]);
      });
      EDGES.forEach(function (e, i) {
        lines[i].setAttribute('x1', Pp[e[0]][0].toFixed(1));
        lines[i].setAttribute('y1', Pp[e[0]][1].toFixed(1));
        lines[i].setAttribute('x2', Pp[e[1]][0].toFixed(1));
        lines[i].setAttribute('y2', Pp[e[1]][1].toFixed(1));
      });
      var pb = [proj(P), proj(B)];
      lPB.setAttribute('x1', pb[0][0].toFixed(1)); lPB.setAttribute('y1', pb[0][1].toFixed(1));
      lPB.setAttribute('x2', pb[1][0].toFixed(1)); lPB.setAttribute('y2', pb[1][1].toFixed(1));
      var bo = [proj(B), proj(O)];
      lBO.setAttribute('x1', bo[0][0].toFixed(1)); lBO.setAttribute('y1', bo[0][1].toFixed(1));
      lBO.setAttribute('x2', bo[1][0].toFixed(1)); lBO.setAttribute('y2', bo[1][1].toFixed(1));
      arc.setAttribute('points', ARC.map(function (p3) {
        var q = proj(p3); return q[0].toFixed(1) + ',' + q[1].toFixed(1);
      }).join(' '));
      var lp = proj(LAB);
      lab.setAttribute('x', lp[0].toFixed(1));
      lab.setAttribute('y', lp[1].toFixed(1));
      lab.textContent = (Math.round(theta * 10) / 10) + '°';

      if (focus === 'dihedral') {
        var bc = [proj(B), proj(C)];
        lBC.setAttribute('x1', bc[0][0].toFixed(1)); lBC.setAttribute('y1', bc[0][1].toFixed(1));
        lBC.setAttribute('x2', bc[1][0].toFixed(1)); lBC.setAttribute('y2', bc[1][1].toFixed(1));
        var mp = [proj(M), proj(P)];
        lMP.setAttribute('x1', mp[0][0].toFixed(1)); lMP.setAttribute('y1', mp[0][1].toFixed(1));
        lMP.setAttribute('x2', mp[1][0].toFixed(1)); lMP.setAttribute('y2', mp[1][1].toFixed(1));
        var mo = [proj(M), proj(O)];
        lMO.setAttribute('x1', mo[0][0].toFixed(1)); lMO.setAttribute('y1', mo[0][1].toFixed(1));
        lMO.setAttribute('x2', mo[1][0].toFixed(1)); lMO.setAttribute('y2', mo[1][1].toFixed(1));
        arc2.setAttribute('points', ARC2.map(function (p4) {
          var q2 = proj(p4); return q2[0].toFixed(1) + ',' + q2[1].toFixed(1);
        }).join(' '));
        var lp2 = proj(LAB2);
        lab2.setAttribute('x', lp2[0].toFixed(1));
        lab2.setAttribute('y', lp2[1].toFixed(1));
        lab2.textContent = (Math.round(theta2 * 10) / 10) + '°';
      }
    }

    var drag = null;
    svg.addEventListener('pointerdown', function (e) {
      drag = { x: e.clientX, y: e.clientY, yaw: yaw, pitch: pitch };
      spin = false;
      try { svg.setPointerCapture(e.pointerId); } catch (err) {}
    });
    svg.addEventListener('pointermove', function (e) {
      if (!drag) return;
      yaw = drag.yaw + (e.clientX - drag.x) * 0.012;
      pitch = Math.max(-1.1, Math.min(1.2, drag.pitch + (e.clientY - drag.y) * 0.01));
      render();
    });
    function endDrag() { drag = null; }
    svg.addEventListener('pointerup', endDrag);
    svg.addEventListener('pointercancel', endDrag);

    var spin = !reduced() && spec.spin !== false;
    function tick() {
      if (!spin || drag) return;
      yaw += 0.004;
      render();
      requestAnimationFrame(tick);
    }
    render();
    if (spin) requestAnimationFrame(tick);

    var idx = 0;
    var STEPS = focus === 'dihedral' ? [
      { els: [lBC], face: true, text: '侧面 PBC 和底面 ABCD 相交于棱 BC——二面角就长在这条棱上。' },
      { els: [lMP, lMO], text: '在棱上取中点 M，分别在两个面内作 BC 的垂线：MP 和 MO。' },
      { els: [arc2, lab2], text: 'MP 与 MO 的夹角就是二面角：' + (Math.round(theta2 * 10) / 10) + '°。' }
    ] : [
      { els: [lPB], text: '侧棱 PB 和底面 ABCD，看起来是斜的——倾斜程度要用角来说。' },
      { els: [lBO], text: '把 P 往底面投下来，落到底面中心 O。BO 就是 PB 在底面上的射影。' },
      { els: [arc, lab], text: 'PB 与射影 BO 的夹角，就是这条侧棱与底面所成的角：' + (Math.round(theta * 10) / 10) + '°。' }
    ];
    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++];
        st.els.forEach(function (e) { e.style.opacity = 1; });
        if (st.face) {
          polys[2].setAttribute('fill-opacity', 0.42);
          polys[0].setAttribute('fill-opacity', 0.3);
        }
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () {
        idx = 0;
        [lPB, lBO, arc, lab, lBC, lMP, lMO, arc2, lab2].forEach(function (e) { e.style.opacity = 0; });
        FACES.forEach(function (f, i) { polys[i].setAttribute('fill-opacity', f.o); });
        return this;
      },
      reset: function () { return this.startDemo(); }
    };
  }


  /* ══════════════════════════════════════════════════════
   * 年历
   * 年月日最难记的是「哪几个月 31 天、二月到底几天」。
   * 12 个格子一起摆出来，天数按类上色，二月可以切年份看 28/29。
   * ══════════════════════════════════════════════════════ */
  function calendar(el, spec) {
    spec = spec || {};
    var year = Number(spec.year || 2023);
    var W = 380, H = 300;
    var COL = { big: '#d97706', small: '#0d9488', feb: '#2563eb' };

    var svg = s('svg', {
      viewBox: '0 0 ' + W + ' ' + H, class: 'cal-svg', role: 'img',
      'aria-label': '一年十二个月的天数'
    }, el);

    function isLeap(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }
    function daysOf(y) {
      return [31, isLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    }
    var BIG = [0, 2, 4, 6, 7, 9, 11];
    var SMALL = [3, 5, 8, 10];
    var FEB = 1;

    var tw = 82, th = 60, gx = 9, gy = 10;
    var x0 = (W - (4 * tw + 3 * gx)) / 2, y0 = 14;

    function kind(i) { return i === FEB ? 'feb' : (BIG.indexOf(i) >= 0 ? 'big' : 'small'); }

    var tiles = [], dayTexts = [];
    for (var i = 0; i < 12; i++) {
      var col = i % 4, row = Math.floor(i / 4);
      var x = x0 + col * (tw + gx), y = y0 + row * (th + gy);
      var k = kind(i);
      var rect = s('rect', {
        x: x, y: y, width: tw, height: th, rx: 10,
        fill: COL[k], 'fill-opacity': 0.14, stroke: COL[k], 'stroke-width': 1.3
      }, svg);
      rect.style.transition = 'fill-opacity .3s ease, stroke-width .3s ease';
      tiles.push(rect);

      var mt = s('text', {
        x: x + tw / 2, y: y + 24, 'text-anchor': 'middle',
        style: 'font-size:14px;font-weight:600'
      }, svg);
      mt.textContent = (i + 1) + ' 月';

      var dt = s('text', {
        x: x + tw / 2, y: y + 46, 'text-anchor': 'middle',
        style: 'font-size:13px;fill:var(--dim)'
      }, svg);
      dt.style.opacity = 0;
      dt.style.transition = 'opacity .3s ease';
      dayTexts.push(dt);
    }

    var chips = [];
    [2023, 2024].forEach(function (y, idx) {
      var g = s('g', { transform: 'translate(' + (W / 2 - 78 + idx * 80) + ',' + (H - 40) + ')' }, svg);
      g.style.cursor = 'pointer';
      var r = s('rect', { x: 0, y: 0, width: 72, height: 28, rx: 14,
        fill: '#24303f', 'fill-opacity': 0.6, stroke: '#24303f' }, g);
      var t = s('text', { x: 36, y: 19, 'text-anchor': 'middle', style: 'font-size:12.5px' }, g);
      t.textContent = y + (isLeap(y) ? ' 闰' : ' 平');
      g.addEventListener('pointerdown', function (e) {
        e.stopPropagation();
        year = y;
        paint();
      });
      chips.push({ y: y, r: r, t: t });
    });

    var total = s('text', {
      x: W / 2, y: H - 52, 'text-anchor': 'middle',
      style: 'font-size:12.5px;fill:var(--dim)'
    }, svg);
    total.style.opacity = 0;
    total.style.transition = 'opacity .3s ease';

    var active = { big: false, small: false, feb: false };
    function paint() {
      var d = daysOf(year);
      for (var i = 0; i < 12; i++) {
        var k = kind(i);
        var on = (k === 'big' && active.big) || (k === 'small' && active.small) || (k === 'feb' && active.feb);
        tiles[i].setAttribute('fill-opacity', on ? 0.55 : (active[k] ? 0.07 : 0.14));
        tiles[i].setAttribute('stroke-width', on ? 2.4 : 1.3);
        dayTexts[i].textContent = d[i] + ' 天';
        if ((k === 'big' && active.big) || (k === 'small' && active.small) || (k === 'feb' && active.feb)) {
          dayTexts[i].style.opacity = 1;
        }
      }
      total.textContent = '31×7 + 30×4 + ' + d[1] + ' = ' + (31 * 7 + 30 * 4 + d[1]) + ' 天';
      chips.forEach(function (c) {
        var on2 = c.y === year;
        c.r.setAttribute('fill-opacity', on2 ? 0.9 : 0.35);
        c.r.setAttribute('fill', on2 ? '#334155' : '#24303f');
      });
    }
    paint();

    var STEPS = [
      { text: '一年有 12 个月，1 月到 12 月，先看它们各有多少天。', run: function () {} },
      { text: '有 31 天的是大月：1、3、5、7、8、10、12 月，一共 7 个。', run: function () {
        active.big = true; paint();
      } },
      { text: '有 30 天的是小月：4、6、9、11 月，一共 4 个。', run: function () {
        active.small = true; paint();
      } },
      { text: '二月最特殊：平年 28 天，闰年 29 天。点下面的年份按钮自己看。', run: function () {
        active.feb = true; paint();
      } },
      { text: '把三类加起来：31×7 + 30×4 + 二月天数。平年 365 天，闰年 366 天。', run: function () {
        total.style.opacity = 1;
      } }
    ];

    var idx = 0;
    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++];
        st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () {
        idx = 0;
        active = { big: false, small: false, feb: false };
        dayTexts.forEach(function (t) { t.style.opacity = 0; });
        total.style.opacity = 0;
        year = 2023;
        paint();
        return this;
      },
      reset: function () { return this.startDemo(); }
    };
  }


  /* ══════════════════════════════════════════════════════
   * 小数条
   * 0.1 看不见，但「十份里的一份」看得见。
   * 两条十格条并排，加就是合起来数，减就是去掉几格。
   * ══════════════════════════════════════════════════════ */
  function decimalBar(el, spec) {
    spec = spec || {};
    var a = Number(spec.a == null ? 0.3 : spec.a);
    var b = spec.b == null ? null : Number(spec.b);
    var op = spec.op || '+';
    var W = 360, H = b == null ? 110 : 230;
    var barX = 30, barW = 290, barH = 30, gap = 2;
    var cw = (barW - gap * 9) / 10;

    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'dec-svg', role: 'img' }, el);
    svg.style.width = '100%';
    svg.style.height = 'auto';

    function row(y, color, label) {
      var t = s('text', { x: barX, y: y - 7, style: 'font-size:13px' }, svg);
      t.textContent = label;
      var cells = [];
      for (var i = 0; i < 10; i++) {
        var r = s('rect', {
          x: barX + i * (cw + gap), y: y, width: cw, height: barH, rx: 3,
          fill: color, 'fill-opacity': 0.12, stroke: color, 'stroke-width': 1
        }, svg);
        r.style.transition = 'fill-opacity .25s ease';
        cells.push(r);
      }
      return cells;
    }

    var rowA = row(30, '#38bdf8', a + '（' + Math.round(a * 10) + ' 个 0.1）');
    var rowB = b == null ? null : row(100, '#a78bfa', b + '（' + Math.round(b * 10) + ' 个 0.1）');
    var totalV = b == null ? a : (op === '-' ? a - b : a + b);
    var rowR = b == null ? null : row(172, '#4ade80', '结果：' + (Math.round(totalV * 10) / 10));

    function fill(cells, n) {
      cells.forEach(function (c, i) {
        setTimeout(function () { c.setAttribute('fill-opacity', i < n ? 0.8 : 0.12); }, reduced() ? 0 : i * 28);
      });
    }

    var STEPS = [
      { text: a + ' 就是 10 份里的 ' + Math.round(a * 10) + ' 份。', run: function () { fill(rowA, Math.round(a * 10)); } }
    ];
    if (b != null) {
      STEPS.push({ text: b + ' 就是 10 份里的 ' + Math.round(b * 10) + ' 份。', run: function () { fill(rowB, Math.round(b * 10)); } });
      STEPS.push({
        text: op === '-'
          ? a + ' 里去掉 ' + Math.round(b * 10) + ' 份，还剩 ' + Math.round(totalV * 10) + ' 份，就是 ' + (Math.round(totalV * 10) / 10) + '。'
          : Math.round(a * 10) + ' 份加 ' + Math.round(b * 10) + ' 份是 ' + Math.round(totalV * 10) + ' 份，就是 ' + (Math.round(totalV * 10) / 10) + '。',
        run: function () { fill(rowR, Math.round(totalV * 10)); }
      });
    }

    var idx = 0;
    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++];
        st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () {
        idx = 0;
        [rowA, rowB, rowR].forEach(function (cells) {
          if (cells) cells.forEach(function (c) { c.setAttribute('fill-opacity', 0.12); });
        });
        return this;
      },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 复式统计表
   * 单式统计表只能回答「男生喜欢什么」，复式能回答
   * 「男生和女生谁更喜欢」。多出来的那一行才是重点。
   * ══════════════════════════════════════════════════════ */
  function barGroup(el, spec) {
    spec = spec || {};
    var cats = spec.categories || [];
    var series = spec.series || [];
    var W = 380, H = 270;
    var x0 = 22, y0 = 34, labelW = 78, colW = Math.min(88, (W - x0 * 2 - labelW) / Math.max(1, cats.length));
    var rowH = 42;

    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'tbl-svg', role: 'img' }, el);
    svg.style.width = '100%';
    svg.style.height = 'auto';

    var maxV = 1;
    series.forEach(function (sr) { sr.values.forEach(function (v) { if (v > maxV) maxV = v; }); });

    var g = s('g', null, svg);
    var cells = [];

    // 表头
    var head = s('text', { x: x0 + labelW / 2, y: y0 + 20, 'text-anchor': 'middle', style: 'font-size:13px;fill:var(--dim)' }, svg);
    head.textContent = '项目';
    cats.forEach(function (c, i) {
      var t = s('text', {
        x: x0 + labelW + i * colW + colW / 2, y: y0 + 20,
        'text-anchor': 'middle', style: 'font-size:13px;font-weight:600'
      }, svg);
      t.textContent = c;
    });
    s('line', { x1: x0, y1: y0 + 30, x2: x0 + labelW + cats.length * colW, y2: y0 + 30, stroke: 'var(--line)', 'stroke-width': 1 }, svg);

    series.forEach(function (sr, r) {
      var y = y0 + 52 + r * rowH;
      var name = s('text', { x: x0 + labelW / 2, y: y + 6, 'text-anchor': 'middle', style: 'font-size:13.5px;font-weight:600' }, svg);
      name.textContent = sr.name + '生';
      var rowCell = [];
      sr.values.forEach(function (v, i) {
        var cx = x0 + labelW + i * colW;
        var bg = s('rect', {
          x: cx + 4, y: y - 18, width: colW - 8, height: 26, rx: 6,
          fill: sr.color, 'fill-opacity': 0.16
        }, svg);
        var bar = s('rect', {
          x: cx + 4, y: y - 18, width: (colW - 8) * (v / maxV), height: 26, rx: 6,
          fill: sr.color, 'fill-opacity': 0.45
        }, svg);
        var t = s('text', { x: cx + colW / 2, y: y + 2, 'text-anchor': 'middle', style: 'font-size:13px;font-weight:600' }, svg);
        t.textContent = v;
        rowCell.push({ bg: bg, bar: bar, t: t, v: v, name: sr.name });
      });
      cells.push(rowCell);
    });

    // 合计行：两个合计竖着错开，别叠在一起
    var totY = y0 + 52 + series.length * rowH + 6;
    var totLabel = s('text', { x: x0 + labelW / 2, y: totY + (series.length - 1) * 10, 'text-anchor': 'middle', style: 'font-size:13px;fill:var(--dim)' }, svg);
    totLabel.textContent = '合计';
    var totals = series.map(function (sr, r) {
      var t = s('text', {
        x: x0 + labelW + (cats.length * colW) / 2, y: totY + r * 20,
        'text-anchor': 'middle', style: 'font-size:13.5px;font-weight:600;fill:var(--accent)'
      }, svg);
      t.style.opacity = 0;
      var sum = sr.values.reduce(function (n, v) { return n + v; }, 0);
      t.textContent = sr.name + '生共 ' + sum + ' 人';
      return t;
    });

    function dim(keep) {
      cells.forEach(function (row) {
        row.forEach(function (c) {
          var on = !keep || keep.indexOf(c) >= 0;
          c.bg.setAttribute('fill-opacity', on ? 0.16 : 0.05);
          c.bar.setAttribute('fill-opacity', on ? 0.45 : 0.1);
          c.t.style.opacity = on ? 1 : 0.35;
        });
      });
    }

    var STEPS = [
      { text: '表头横着是项目，竖着是男生、女生两行。', run: function () { dim(null); } },
      { text: '男生这一行：' + series[0].values.join('、') + '。', run: function () { dim(cells[0]); } },
      { text: '女生这一行：' + series[1].values.join('、') + '。', run: function () { dim(cells[1]); } },
      { text: '两行对着看，才知道谁更喜欢——单式统计表做不到这一点。', run: function () { dim(null); } },
      { text: '合计：' + series.map(function (sr) {
        return sr.name + '生 ' + sr.values.reduce(function (n, v) { return n + v; }, 0) + ' 人';
      }).join('，') + '。', run: function () { totals.forEach(function (t) { t.style.opacity = 1; }); } }
    ];

    var idx = 0;
    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++];
        st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () {
        idx = 0;
        dim(null);
        totals.forEach(function (t) { t.style.opacity = 0; });
        return this;
      },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 方向与路线
   * 上北下南不是口诀，是地图上的箭头。
   * 先认四个正方向，再认四个斜方向，最后走一条路线。
   * ══════════════════════════════════════════════════════ */
  function compass(el, spec) {
    spec = spec || {};
    var W = 380, H = 330;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'cmp-svg', role: 'img' }, el);
    svg.style.width = '100%';
    svg.style.height = 'auto';

    // 罗盘
    var cx = 72, cy = 76, R = 42;
    var rose = s('g', null, svg);
    s('circle', { cx: cx, cy: cy, r: R, fill: 'none', stroke: '#334155', 'stroke-width': 1.2 }, rose);
    var DIRS = [
      { n: '北', dx: 0, dy: -1, ang: -90 },
      { n: '东', dx: 1, dy: 0, ang: 0 },
      { n: '南', dx: 0, dy: 1, ang: 90 },
      { n: '西', dx: -1, dy: 0, ang: 180 }
    ];
    var DIAG = [
      { n: '东北', dx: 1, dy: -1, ang: -45 },
      { n: '东南', dx: 1, dy: 1, ang: 45 },
      { n: '西南', dx: -1, dy: 1, ang: 135 },
      { n: '西北', dx: -1, dy: -1, ang: -135 }
    ];
    var card = [], diag = [];
    DIRS.forEach(function (d) {
      var ln = s('line', {
        x1: cx, y1: cy, x2: cx + d.dx * (R - 8), y2: cy + d.dy * (R - 8),
        stroke: '#38bdf8', 'stroke-width': 2.4, 'stroke-linecap': 'round'
      }, rose);
      var t = s('text', {
        x: cx + d.dx * (R + 12), y: cy + d.dy * (R + 12) + 5,
        'text-anchor': 'middle', style: 'font-size:13px;font-weight:600;fill:#38bdf8'
      }, rose);
      t.textContent = d.n;
      card.push(ln); card.push(t);
    });
    DIAG.forEach(function (d) {
      var ln = s('line', {
        x1: cx + d.dx * 12, y1: cy + d.dy * 12, x2: cx + d.dx * (R - 14), y2: cy + d.dy * (R - 14),
        stroke: '#a78bfa', 'stroke-width': 1.6, 'stroke-dasharray': '3 3'
      }, rose);
      var t = s('text', {
        x: cx + d.dx * (R - 26), y: cy + d.dy * (R - 26) + 4,
        'text-anchor': 'middle', style: 'font-size:10px;fill:#a78bfa'
      }, rose);
      t.textContent = d.n;
      diag.push(ln); diag.push(t);
    });
    card.concat(diag).forEach(function (e) { e.style.opacity = 0; e.style.transition = 'opacity .3s ease'; });

    // 地图：3×3，中间是学校
    var gx = 236, gy = 170, step = 66;
    var PLACES = [
      { n: '图书馆', dx: 0, dy: -1, dir: '北' },
      { n: '公园', dx: 1, dy: -1, dir: '东北' },
      { n: '超市', dx: 1, dy: 0, dir: '东' },
      { n: '医院', dx: 1, dy: 1, dir: '东南' },
      { n: '邮局', dx: 0, dy: 1, dir: '南' },
      { n: '车站', dx: -1, dy: 1, dir: '西南' },
      { n: '书店', dx: -1, dy: 0, dir: '西' },
      { n: '体育馆', dx: -1, dy: -1, dir: '西北' }
    ];
    var nodes = [];
    var school = s('circle', { cx: gx, cy: gy, r: 9, fill: '#ffd166' }, svg);
    var st = s('text', { x: gx, y: gy + 26, 'text-anchor': 'middle', style: 'font-size:12px;font-weight:600;fill:#ffd166' }, svg);
    st.textContent = '学校';
    PLACES.forEach(function (p) {
      var x = gx + p.dx * step, y = gy + p.dy * step;
      var dot = s('circle', { cx: x, cy: y, r: 6, fill: '#94a3b8' }, svg);
      var t = s('text', { x: x, y: y - 12, 'text-anchor': 'middle', style: 'font-size:11px;fill:var(--dim)' }, svg);
      t.textContent = p.n;
      nodes.push({ p: p, dot: dot, t: t, x: x, y: y });
    });

    var route = s('polyline', {
      points: gx + ',' + gy + ' ' + (gx + step) + ',' + gy + ' ' + (gx + step) + ',' + (gy - step),
      fill: 'none', stroke: '#4ade80', 'stroke-width': 2.6, 'stroke-dasharray': '6 5', 'stroke-linecap': 'round'
    }, svg);
    route.style.opacity = 0;
    route.style.transition = 'opacity .3s ease';

    var STEPS = [
      { text: '先认四个正方向：上北、下南、左西、右东。', run: function () { card.forEach(function (e) { e.style.opacity = 1; }); } },
      { text: '再认四个斜方向：东北、东南、西南、西北，正好在两个正方向中间。', run: function () { diag.forEach(function (e) { e.style.opacity = 1; }); } },
      { text: '公园在学校的东北方向：先向东走一格，再向北走一格。', run: function () {
        route.style.opacity = 1;
        nodes.forEach(function (o) { if (o.p.n === '公园') { o.dot.setAttribute('fill', '#4ade80'); o.dot.setAttribute('r', 8); } });
      } },
      { text: '描述路线要说清两件事：朝哪个方向、走多远。只说「往那边走」别人找不到。', run: function () {} }
    ];

    var idx = 0;
    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var s2 = STEPS[idx++];
        s2.run();
        return { text: s2.text, done: idx >= STEPS.length };
      },
      startDemo: function () {
        idx = 0;
        card.concat(diag).forEach(function (e) { e.style.opacity = 0; });
        route.style.opacity = 0;
        nodes.forEach(function (o) { o.dot.setAttribute('fill', '#94a3b8'); o.dot.setAttribute('r', 6); });
        return this;
      },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 运算律：交换律 / 结合律 / 分配律
   * 数换了位置、加了括号，和/积却不变；
   * 分配律用面积模型把 a×(b+c) 拆成 a×b + a×c。
   * ══════════════════════════════════════════════════════ */
  function law(el, spec) {
    spec = spec || {};
    var mode = spec.mode || 'commute';
    var op = spec.op || '+';
    var a = spec.a, b = spec.b, c = spec.c;
    var W = 360, H = 240;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'law-svg', role: 'img' }, el);
    svg.style.width = '100%'; svg.style.height = 'auto';
    var opChar = op === '×' ? '×' : '+';
    var BLUE = '#38bdf8', ORG = '#fbbf24', GRN = '#4ade80', VIO = '#a78bfa';

    function tok(x, y, color, label, w, h) {
      w = w || 46; h = h || 40;
      var g = s('g', null, svg);
      s('rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 8,
        fill: color, 'fill-opacity': 0.16, stroke: color, 'stroke-width': 1.8 }, g);
      var t = s('text', { x: x, y: y + 6, 'text-anchor': 'middle',
        style: 'font-size:18px;font-weight:600;fill:' + color }, g);
      t.textContent = label;
      return g;
    }
    function sym(x, y, ch, color) {
      var t = s('text', { x: x, y: y + 7, 'text-anchor': 'middle',
        style: 'font-size:20px;font-weight:700;fill:' + (color || 'var(--text)') }, svg);
      t.textContent = ch;
      return t;
    }
    function label(x, y, txt, color, size) {
      var t = s('text', { x: x, y: y, 'text-anchor': 'middle',
        style: 'font-size:' + (size || 13) + 'px;fill:' + (color || 'var(--dim)') }, svg);
      t.textContent = txt;
      return t;
    }

    var STEPS = [], reset = function () {}, idx = 0;

    if (mode === 'commute') {
      var val = op === '×' ? a * b : a + b;
      var y1 = 80, y2 = 164;
      tok(56, y1, BLUE, a); sym(98, y1, opChar); tok(140, y1, ORG, b);
      sym(186, y1, '='); var R1 = tok(252, y1, GRN, '?', 54);
      var A2 = tok(56, y2, BLUE, a); sym(98, y2, opChar); var B2 = tok(140, y2, ORG, b);
      sym(186, y2, '='); var R2 = tok(252, y2, GRN, '?', 54);
      var arrow = label(196, 124, '交换位置', VIO, 13); arrow.style.opacity = 0;
      reset = function () {
        R1.querySelector('text').textContent = '?';
        R2.querySelector('text').textContent = '?';
        A2.style.transition = B2.style.transition = 'transform .45s ease';
        A2.setAttribute('transform', ''); B2.setAttribute('transform', '');
        arrow.style.opacity = 0;
      };
      STEPS = [
        { text: '左边：' + a + ' ' + opChar + ' ' + b + ' = <b>' + val + '</b>。',
          run: function () { R1.querySelector('text').textContent = String(val); } },
        { text: '右边把两个数<b>交换位置</b>，变成 ' + b + ' ' + opChar + ' ' + a + '，结果还是 <b>' + val + '</b>。',
          run: function () {
            A2.style.transition = B2.style.transition = 'transform .45s ease';
            A2.setAttribute('transform', 'translate(' + (140 - 56) + ',0)');
            B2.setAttribute('transform', 'translate(' + (56 - 140) + ',0)');
            arrow.style.opacity = 1;
            R2.querySelector('text').textContent = String(val);
          } },
        { text: '不管是 ' + a + ' ' + opChar + ' ' + b + ' 还是 ' + b + ' ' + opChar + ' ' + a + '，和（积）都一样 —— 这就是<b>' + (op === '×' ? '乘法' : '加法') + '交换律</b>。',
          run: function () {} }
      ];
    } else if (mode === 'associate') {
      var ab = op === '×' ? a * b : a + b;
      var val1 = op === '×' ? ab * c : ab + c;
      var bc = op === '×' ? b * c : b + c;
      var val2 = op === '×' ? a * bc : a + bc;
      var y1 = 80, y2 = 164;
      s('text', { x: 26, y: y1 + 7, style: 'font-size:24px;fill:var(--dim)' }, svg).textContent = '(';
      tok(62, y1, BLUE, a); sym(104, y1, opChar); tok(146, y1, ORG, b);
      s('text', { x: 184, y: y1 + 7, style: 'font-size:24px;fill:var(--dim)' }, svg).textContent = ')';
      sym(212, y1, opChar); tok(256, y1, VIO, c, 40);
      sym(298, y1, '='); var R1 = tok(332, y1, GRN, '?', 48);
      tok(62, y2, BLUE, a, 40); sym(102, y2, opChar);
      s('text', { x: 130, y: y2 + 7, style: 'font-size:24px;fill:var(--dim)' }, svg).textContent = '(';
      tok(166, y2, ORG, b); sym(208, y2, opChar); tok(250, y2, VIO, c, 40);
      s('text', { x: 288, y: y2 + 7, style: 'font-size:24px;fill:var(--dim)' }, svg).textContent = ')';
      sym(314, y2, '='); var R2 = tok(344, y2, GRN, '?', 32);
      reset = function () { R1.querySelector('text').textContent = '?'; R2.querySelector('text').textContent = '?'; };
      STEPS = [
        { text: '先算前两个：' + a + ' ' + opChar + ' ' + b + ' = ' + ab + '，再和 ' + c + ' 算 → <b>' + val1 + '</b>。',
          run: function () { R1.querySelector('text').textContent = String(val1); } },
        { text: '换个算法，先算后两个：' + b + ' ' + opChar + ' ' + c + ' = ' + bc + '，再和 ' + a + ' 算 → <b>' + val2 + '</b>。',
          run: function () { R2.querySelector('text').textContent = String(val2); } },
        { text: '括号搬了位置，结果还是 <b>' + val1 + '</b> 不变 —— 这就是<b>' + (op === '×' ? '乘法' : '加法') + '结合律</b>。',
          run: function () {} }
      ];
    } else { // distribute
      var val = a * (b + c), abV = a * b, acV = a * c;
      var y0 = 70;
      // 按可用空间自适应：大数（如 25×(40+4)）也能装进画布
      var u = Math.min(22, (W - 90) / (b + c), (H - y0 - 36) / a);
      var rw = (b + c) * u, rh = a * u;
      var x0 = (W - rw) / 2;
      s('rect', { x: x0, y: y0, width: b * u, height: rh, rx: 4,
        fill: BLUE, 'fill-opacity': 0.14, stroke: BLUE, 'stroke-width': 1.8 }, svg);
      var rightG = s('g', null, svg);
      s('rect', { x: x0 + b * u, y: y0, width: c * u, height: rh, rx: 4,
        fill: ORG, 'fill-opacity': 0.14, stroke: ORG, 'stroke-width': 1.8 }, rightG);
      var split = s('line', { x1: x0 + b * u, y1: y0, x2: x0 + b * u, y2: y0 + rh,
        stroke: 'var(--dim)', 'stroke-width': 1.6, 'stroke-dasharray': '4 3' }, svg);
      split.style.opacity = 0; split.style.transition = 'opacity .3s ease';
      var topLabel = label(x0 + rw / 2, y0 - 12, a + ' × (' + b + ' + ' + c + ')', 'var(--text)', 15);
      var leftLabel = label(x0 + b * u / 2, y0 + rh / 2 + 5, '', BLUE, 14);
      var rightLabel = label(x0 + b * u + c * u / 2, y0 + rh / 2 + 5, '', ORG, 14);
      var plus = label(x0 + b * u + c * u / 2 + 26, y0 + rh / 2 + 5, '+', 'var(--text)', 20);
      plus.style.opacity = 0;
      reset = function () {
        split.style.opacity = 0; plus.style.opacity = 0;
        rightG.style.transition = 'transform .4s ease';
        rightG.setAttribute('transform', '');
        leftLabel.textContent = ''; rightLabel.textContent = '';
        topLabel.textContent = a + ' × (' + b + ' + ' + c + ')';
      };
      STEPS = [
        { text: '先算括号里：' + b + ' + ' + c + ' = ' + (b + c) + '，再乘 ' + a + '：<b>' + a + ' × ' + (b + c) + ' = ' + val + '</b>。',
          run: function () {} },
        { text: '把宽（' + b + ' + ' + c + '）分成左右两段：' + b + ' 和 ' + c + '。',
          run: function () { split.style.opacity = 1; } },
        { text: '左边一块：高 ' + a + '、宽 ' + b + ' → 面积 <b>' + a + ' × ' + b + ' = ' + abV + '</b>。',
          run: function () { leftLabel.textContent = a + '×' + b; } },
        { text: '右边一块：高 ' + a + '、宽 ' + c + ' → 面积 <b>' + a + ' × ' + c + ' = ' + acV + '</b>。',
          run: function () { rightLabel.textContent = a + '×' + c; } },
        { text: '两块拼起来 = ' + abV + ' + ' + acV + ' = <b>' + val + '</b>，和 a×(b+c) 一样 —— 这就是<b>乘法分配律</b>。',
          run: function () {
            rightG.style.transition = 'transform .4s ease';
            rightG.setAttribute('transform', 'translate(26,0)');
            plus.style.opacity = 1;
            topLabel.textContent = a + '×(' + b + '+' + c + ') = ' + a + '×' + b + '+' + a + '×' + c;
          } }
      ];
    }

    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () { idx = 0; reset(); return this; },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 三角形：分类 / 内角和 / 三边关系
   * 按角分、按边分；三个角拼成平角 = 180°；
   * 任意两边之和要大于第三边才围得成。
   * ══════════════════════════════════════════════════════ */
  function triangle(el, spec) {
    spec = spec || {};
    var mode = spec.mode || 'classify';
    var W = 360, H = 250;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'tri-svg', role: 'img' }, el);
    svg.style.width = '100%'; svg.style.height = 'auto';
    var BLUE = '#38bdf8', ORG = '#fbbf24', GRN = '#4ade80', GEO = '#a78bfa';

    // 由底角和底边长度算顶点（数学坐标，y 向上）
    function verts(Adeg, Bdeg, base) {
      var A = Adeg * Math.PI / 180, B = Bdeg * Math.PI / 180;
      var t = base * Math.sin(B) / Math.sin(A + B);
      return { x1: 0, y1: 0, x2: base, y2: 0, x3: t * Math.cos(A), y3: t * Math.sin(A) };
    }
    function placeInCell(v, cx, cy, scale) {
      var xs = [v.x1, v.x2, v.x3], ys = [v.y1, v.y2, v.y3];
      var minx = Math.min.apply(null, xs), maxx = Math.max.apply(null, xs);
      var miny = Math.min.apply(null, ys), maxy = Math.max.apply(null, ys);
      var w = maxx - minx || 1, h = maxy - miny || 1;
      var sc = scale / Math.max(w, h);
      function map(x, y) {
        return { x: cx + (x - (minx + maxx) / 2) * sc, y: cy - (y - (miny + maxy) / 2) * sc };
      }
      return { p1: map(v.x1, v.y1), p2: map(v.x2, v.y2), p3: map(v.x3, v.y3) };
    }
    function classify(A, B, C) {
      var ang = [A, B, C];
      var byAngle = ang.some(function (x) { return x === 90; }) ? '直角'
        : ang.some(function (x) { return x > 90; }) ? '钝角' : '锐角';
      var uniq = ang.filter(function (x, i) { return ang.indexOf(x) === i; }).length;
      var bySide = uniq === 1 ? '等边' : uniq === 2 ? '等腰' : '不等边';
      return { byAngle: byAngle, bySide: bySide };
    }
    function shortName(cl) {
      return cl.bySide === '等边' ? '等边' : (cl.bySide === '等腰' ? '等腰·' + cl.byAngle : '不等边·' + cl.byAngle);
    }
    function nameFor(cl) {
      if (cl.bySide === '等边') return '这是<b>等边三角形</b>：三边相等、三角都是 60°，也是最特殊的锐角三角形。';
      if (cl.bySide === '等腰') return '这是<b>等腰三角形</b>：两条边相等，按角看是' + cl.byAngle + '三角形。';
      return '这是<b>不等边三角形</b>：三边都不等，按角看是' + cl.byAngle + '三角形。';
    }

    var STEPS = [], reset = function () {}, idx = 0;

    if (mode === 'classify') {
      var tris = spec.triangles || [];
      var n = tris.length;
      var cols = Math.min(3, n), rows = Math.ceil(n / cols);
      var cellW = W / cols, cellH = (H - 6) / rows;
      var cells = [];
      tris.forEach(function (tr, i) {
        var col = i % cols, row = Math.floor(i / cols);
        var cx = cellW * (col + 0.5), cy = cellH * row + cellH / 2 - 4;
        var v = verts(tr.A, tr.B, 100);
        var m = placeInCell(v, cx, cy, cellH * 0.6);
        var poly = s('polygon', { points: m.p1.x + ',' + m.p1.y + ' ' + m.p2.x + ',' + m.p2.y + ' ' + m.p3.x + ',' + m.p3.y,
          fill: 'rgba(167,139,250,.10)', stroke: 'var(--geo)', 'stroke-width': 2, 'stroke-linejoin': 'round' }, svg);
        var lt = s('text', { x: cx, y: cy + cellH * 0.34 + 8, 'text-anchor': 'middle',
          style: 'font-size:11.5px;fill:var(--dim)' }, svg);
        lt.textContent = '';
        cells.push({ cl: classify(tr.A, tr.B, tr.C), label: lt, poly: poly });
      });
      reset = function () {
        cells.forEach(function (c) { c.label.textContent = ''; c.poly.setAttribute('opacity', 1); });
      };
      STEPS = cells.map(function (c, i) {
        return {
          text: nameFor(c.cl),
          run: function () {
            cells.forEach(function (cc, j) {
              cc.label.textContent = j === i ? shortName(cc.cl) : '';
              cc.poly.setAttribute('opacity', j === i ? 1 : 0.3);
            });
          }
        };
      });
      STEPS.push({
        text: '按角：锐角 / 直角 / 钝角；按边：等边 / 等腰 / 不等边。同一个三角形可以从两个角度命名。',
        run: function () {
          cells.forEach(function (c) { c.label.textContent = shortName(c.cl); c.poly.setAttribute('opacity', 1); });
        }
      });
    } else if (mode === 'angleSum') {
      var A = spec.A, B = spec.B, C = spec.C;
      // 顶部小三角形
      var tv = verts(A, B, 110);
      var tm = placeInCell(tv, W / 2, 56, 80);
      s('polygon', { points: tm.p1.x + ',' + tm.p1.y + ' ' + tm.p2.x + ',' + tm.p2.y + ' ' + tm.p3.x + ',' + tm.p3.y,
        fill: 'rgba(167,139,250,.10)', stroke: 'var(--geo)', 'stroke-width': 2, 'stroke-linejoin': 'round' }, svg);
      function dot(p, color) { s('circle', { cx: p.x, cy: p.y, r: 4, fill: color }, svg); }
      dot(tm.p1, BLUE); dot(tm.p2, ORG); dot(tm.p3, GRN);
      var tl = s('text', { x: W / 2, y: 24, 'text-anchor': 'middle', style: 'font-size:12px;fill:var(--dim)' }, svg);
      tl.textContent = '∠A=' + A + '°　∠B=' + B + '°　∠C=' + C + '°';
      // 底部半圆：三块角拼成平角
      var O = { x: W / 2, y: 200 }, R = 92;
      function wedge(t0, t1) {
        var pts = [O.x + ',' + O.y], N = 22, i;
        for (i = 0; i <= N; i++) {
          var th = (t0 + (t1 - t0) * i / N) * Math.PI / 180;
          pts.push((O.x + R * Math.cos(th)).toFixed(1) + ',' + (O.y - R * Math.sin(th)).toFixed(1));
        }
        return 'M' + pts.join(' L') + ' Z';
      }
      s('line', { x1: O.x - R - 12, y1: O.y, x2: O.x + R + 12, y2: O.y, stroke: 'var(--dim)', 'stroke-width': 1.4 }, svg);
      var secA = s('path', { d: wedge(0, A), fill: BLUE, 'fill-opacity': 0.5 }, svg); secA.style.opacity = 0; secA.style.transition = 'opacity .4s ease';
      var secB = s('path', { d: wedge(A, A + B), fill: ORG, 'fill-opacity': 0.5 }, svg); secB.style.opacity = 0; secB.style.transition = 'opacity .4s ease';
      var secC = s('path', { d: wedge(A + B, 180), fill: GRN, 'fill-opacity': 0.5 }, svg); secC.style.opacity = 0; secC.style.transition = 'opacity .4s ease';
      var flatLabel = s('text', { x: O.x, y: O.y + 22, 'text-anchor': 'middle', style: 'font-size:13px;font-weight:600;fill:var(--text)' }, svg);
      flatLabel.textContent = '平角 = 180°'; flatLabel.style.opacity = 0;
      reset = function () {
        secA.style.opacity = secB.style.opacity = secC.style.opacity = 0;
        flatLabel.style.opacity = 0;
      };
      STEPS = [
        { text: '三角形三个内角的和总是 <b>180°</b>。把三个角剪下来拼在一起看看。', run: function () {} },
        { text: '∠A = ' + A + '°，先放上去。', run: function () { secA.style.opacity = 1; } },
        { text: '∠B = ' + B + '°，紧挨着 ∠A。', run: function () { secB.style.opacity = 1; } },
        { text: '∠C = ' + C + '°，补上最后一块。', run: function () { secC.style.opacity = 1; } },
        { text: '三块拼在一起正好是一条<b>直线</b>——平角就是 180°。所以 ∠A + ∠B + ∠C = <b>180°</b>。', run: function () { flatLabel.style.opacity = 1; } }
      ];
    } else { // sides
      var aL = spec.a, bL = spec.b, cL = spec.c;
      var maxL = Math.max(aL, bL, cL), unit = 120 / maxL;
      var colors = [BLUE, ORG, GRN], lens = [aL, bL, cL], names = ['a', 'b', 'c'];
      var rods = [];
      [72, 112, 152].forEach(function (ry, i) {
        var len = lens[i] * unit, x1 = 40, x2 = 40 + len;
        s('line', { x1: x1, y1: ry, x2: x2, y2: ry, stroke: colors[i], 'stroke-width': 6, 'stroke-linecap': 'round' }, svg);
        s('text', { x: x2 + 8, y: ry + 5, style: 'font-size:13px;fill:' + colors[i] }, svg).textContent = names[i] + '=' + lens[i];
        rods.push({ x1: x1, x2: x2, y: ry });
      });
      function chk(y, txt, color) {
        var t = s('text', { x: 40, y: y, style: 'font-size:13px;fill:' + (color || 'var(--text)') }, svg);
        t.textContent = txt; t.style.opacity = 0; return t;
      }
      var chk1 = chk(196, 'a + b = ' + (aL + bL) + ' > ' + cL + '  ✓', GRN),
          chk2 = chk(216, 'a + c = ' + (aL + cL) + ' > ' + bL + '  ✓', GRN),
          chk3 = chk(236, 'b + c = ' + (bL + cL) + ' > ' + aL + '  ✓', GRN);
      // 由三边长度算三角形顶点
      var cx2 = (bL * bL - aL * aL + cL * cL) / (2 * cL);
      var cy2 = Math.sqrt(Math.max(0, bL * bL - cx2 * cx2));
      var sc = 70 / Math.max(aL, bL, cL);
      function m2(x, y) { return { x: W / 2 + (x - cL / 2) * sc, y: 200 - y * sc }; }
      var T = [m2(0, 0), m2(cL, 0), m2(cx2, cy2)];
      var triPath = s('polygon', { points: T[0].x + ',' + T[0].y + ' ' + T[1].x + ',' + T[1].y + ' ' + T[2].x + ',' + T[2].y,
        fill: 'rgba(74,222,128,.12)', stroke: GRN, 'stroke-width': 2.4, 'stroke-linejoin': 'round' }, svg);
      triPath.style.opacity = 0; triPath.style.transition = 'opacity .4s ease';
      var ctr = null;
      if (spec.counter) {
        var co = spec.counter;
        ctr = s('text', { x: 40, y: H - 8, style: 'font-size:12.5px;fill:var(--bad)' }, svg);
        ctr.textContent = '反例：a=' + co.a + '、b=' + co.b + '、c=' + co.c + '，' + co.a + '+' + co.b + '=' + (co.a + co.b) + ' < ' + co.c + ' ✗ 围不成';
        ctr.style.opacity = 0;
      }
      reset = function () { chk1.style.opacity = chk2.style.opacity = chk3.style.opacity = 0; triPath.style.opacity = 0; if (ctr) ctr.style.opacity = 0; };
      STEPS = [
        { text: '三条边长度：a=' + aL + '、b=' + bL + '、c=' + cL + '（单位：cm）。', run: function () {} },
        { text: 'a + b = ' + (aL + bL) + '，和 c=' + cL + ' 比：' + (aL + bL) + ' > ' + cL + ' ✓', run: function () { chk1.style.opacity = 1; } },
        { text: 'a + c = ' + (aL + cL) + '，和 b=' + bL + ' 比：' + (aL + cL) + ' > ' + bL + ' ✓', run: function () { chk2.style.opacity = 1; } },
        { text: 'b + c = ' + (bL + cL) + '，和 a=' + aL + ' 比：' + (bL + cL) + ' > ' + aL + ' ✓', run: function () { chk3.style.opacity = 1; } },
        { text: '三条都满足「<b>两边之和 > 第三边</b>」→ 能围成三角形！', run: function () { triPath.style.opacity = 1; } }
      ];
      if (ctr) STEPS.push({ text: ctr.textContent, run: function () { ctr.style.opacity = 1; } });
    }

    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () { idx = 0; reset(); return this; },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 数位顺序表
   * 十个一千是一万，一路数到一亿。相邻两个计数单位之间都差十倍，
   * 这就是十进制——大数之所以好认，靠的就是这张表。
   * ══════════════════════════════════════════════════════ */
  function counter(el, spec) {
    spec = spec || {};
    var W = 360, H = 230;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'cnt-svg', role: 'img' }, el);
    svg.style.width = '100%'; svg.style.height = 'auto';
    var NAMES = ['亿', '千万', '百万', '十万', '万', '千', '百', '十', '个'];
    var x0 = 16, tw = (W - 32) / 9, y0 = 90, chh = 52;

    NAMES.forEach(function (nm, i) {
      var c = x0 + i * tw + tw / 2;
      var t = s('text', { x: c, y: y0 - 10, 'text-anchor': 'middle',
        style: 'font-size:12.5px;font-weight:600' }, svg);
      t.textContent = nm;
      s('rect', { x: x0 + i * tw, y: y0, width: tw, height: chh, rx: 5,
        fill: 'rgba(167,139,250,.06)', stroke: 'var(--line)', 'stroke-width': 1 }, svg);
    });
    // 分级：亿级 | 万级 | 个级
    [1, 5].forEach(function (i) {
      s('line', { x1: x0 + i * tw, y1: y0 - 26, x2: x0 + i * tw, y2: y0 + chh + 6,
        stroke: 'var(--geo)', 'stroke-width': 2 }, svg);
    });
    // 分级名称
    [['亿级', 0], ['万级', 1], ['个级', 5]].forEach(function (p) {
      var c = x0 + (p[1] + (p[1] === 0 ? 0.5 : 2)) * tw;
      var t = s('text', { x: c, y: y0 + chh + 24, 'text-anchor': 'middle',
        style: 'font-size:11.5px;fill:var(--geo)' }, svg);
      t.textContent = p[0];
    });

    var chips = NAMES.map(function (nm, i) {
      var c = x0 + i * tw + tw / 2, cy = y0 + chh / 2;
      var g = s('g', null, svg); g.style.opacity = 0; g.style.transition = 'opacity .3s ease';
      s('rect', { x: c - (tw - 8) / 2, y: cy - 15, width: tw - 8, height: 30, rx: 6,
        fill: 'var(--num)', 'fill-opacity': 0.18, stroke: 'var(--num)', 'stroke-width': 1.6 }, g);
      var t = s('text', { x: c, y: cy + 5, 'text-anchor': 'middle',
        style: 'font-size:13px;font-weight:600;fill:var(--num)' }, g);
      return { g: g, t: t, c: c };
    });

    var arrow = s('g', null, svg); arrow.style.opacity = 0;
    var aline = s('line', { stroke: 'var(--accent)', 'stroke-width': 1.8, 'stroke-dasharray': '4 3' }, arrow);
    var ahead = s('polygon', { fill: 'var(--accent)' }, arrow);
    var atext = s('text', { 'text-anchor': 'middle', style: 'font-size:11.5px;fill:var(--accent)' }, arrow);
    atext.textContent = '满十进一';

    function showPair(src, dst) {
      chips.forEach(function (cp) { cp.g.style.opacity = 0; });
      chips[src].t.textContent = '10'; chips[src].g.style.opacity = 1;
      chips[dst].t.textContent = '1'; chips[dst].g.style.opacity = 1;
      var y = y0 - 34;
      var sx = chips[src].c, dx = chips[dst].c;
      aline.setAttribute('x1', sx); aline.setAttribute('y1', y);
      aline.setAttribute('x2', dx + (dx < sx ? 5 : -5)); aline.setAttribute('y2', y);
      var d = dx < sx ? -1 : 1;
      ahead.setAttribute('points', (dx) + ',' + y + ' ' + (dx - d * 7) + ',' + (y - 4) + ' ' + (dx - d * 7) + ',' + (y + 4));
      atext.setAttribute('x', (sx + dx) / 2); atext.setAttribute('y', y - 8);
      arrow.style.opacity = 1;
    }

    var STEPS = [
      { text: '数位顺序表：从右起依次是个、十、百、千、万、十万、百万、千万、亿。', run: function () {} },
      { text: '10 个一千是<b>一万</b>：千位满十，向万位进 1。', run: function () { showPair(5, 4); } },
      { text: '10 个一万是<b>十万</b>。', run: function () { showPair(4, 3); } },
      { text: '10 个十万是<b>一百万</b>。', run: function () { showPair(3, 2); } },
      { text: '10 个一百万是<b>一千万</b>。', run: function () { showPair(2, 1); } },
      { text: '10 个一千万是<b>一亿</b>。', run: function () { showPair(1, 0); } },
      { text: '每相邻两个计数单位之间的进率都是<b>十</b>——这就是十进制。', run: function () {} }
    ];
    var idx = 0;
    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () {
        idx = 0;
        chips.forEach(function (cp) { cp.g.style.opacity = 0; });
        arrow.style.opacity = 0;
        return this;
      },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 量角器
   * 中心对顶点、零刻度线对一边，另一条边指向几度就是几度。
   * 可以直接拖动那条边，读数跟着变。
   * ══════════════════════════════════════════════════════ */
  function angle(el, spec) {
    spec = spec || {};
    var deg = spec.deg == null ? 60 : Number(spec.deg);
    var W = 360, H = 250;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'ang-svg', role: 'img' }, el);
    svg.style.width = '100%'; svg.style.height = 'auto'; svg.style.touchAction = 'none';
    var cx = W / 2, cy = 196, R = 132;

    function pt(d, r) {
      var t = d * Math.PI / 180;
      return { x: cx + r * Math.cos(t), y: cy - r * Math.sin(t) };
    }
    // 量角器半圆（上半天）
    var p0 = pt(180, R), p1 = pt(0, R);
    s('path', { d: 'M' + p0.x.toFixed(1) + ' ' + p0.y.toFixed(1) + ' A' + R + ' ' + R + ' 0 0 1 ' +
      p1.x.toFixed(1) + ' ' + p1.y.toFixed(1) + ' Z',
      fill: 'rgba(167,139,250,.09)', stroke: 'var(--geo)', 'stroke-width': 1.4 }, svg);
    // 刻度
    for (var d = 0; d <= 180; d += 10) {
      var big = d % 30 === 0;
      var a = pt(d, R), b = pt(d, R - (big ? 13 : 7));
      s('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y,
        stroke: 'var(--dim)', 'stroke-width': big ? 1.6 : 1 }, svg);
      if (big) {
        var lb = pt(d, R - 25);
        var t = s('text', { x: lb.x, y: lb.y + 4, 'text-anchor': 'middle',
          style: 'font-size:10px;fill:var(--dim)' }, svg);
        t.textContent = String(d);
      }
    }
    // 底边（0° 线）
    s('line', { x1: cx - R - 12, y1: cy, x2: cx + R + 12, y2: cy, stroke: 'var(--text)', 'stroke-width': 1.6 }, svg);
    // 中心点
    var hub = s('circle', { cx: cx, cy: cy, r: 5, fill: 'var(--accent)' }, svg);
    hub.style.transition = 'r .2s ease';
    // 零刻度线高亮
    var zeroHi = s('line', { x1: cx, y1: cy, x2: cx + R, y2: cy,
      stroke: 'var(--accent)', 'stroke-width': 3.4, 'stroke-opacity': 0.85 }, svg);
    zeroHi.style.opacity = 0; zeroHi.style.transition = 'opacity .3s ease';

    // 动边 + 角弧
    var RL = R - 8;
    var ray = s('line', { stroke: 'var(--num)', 'stroke-width': 3, 'stroke-linecap': 'round' }, svg);
    var arcPts = [];
    var arcFill = s('path', { fill: 'var(--num)', 'fill-opacity': 0.18 }, svg);
    var arcLine = s('path', { fill: 'none', stroke: 'var(--num)', 'stroke-width': 2.4 }, svg);
    var knob = s('circle', { r: 7, fill: 'var(--num)', stroke: 'var(--bg)', 'stroke-width': 2 }, svg);
    knob.style.cursor = 'pointer';
    var tickHi = s('line', { stroke: 'var(--accent)', 'stroke-width': 3.4 }, svg);
    tickHi.style.opacity = 0; tickHi.style.transition = 'opacity .3s ease';

    var readout = s('text', { x: W / 2, y: 30, 'text-anchor': 'middle',
      style: 'font-size:16px;font-weight:600' }, svg);
    var kind = s('text', { x: W / 2, y: 50, 'text-anchor': 'middle', style: 'font-size:12.5px;fill:var(--dim)' }, svg);

    function paint(v) {
      var p = pt(v, RL);
      ray.setAttribute('x1', cx); ray.setAttribute('y1', cy);
      ray.setAttribute('x2', p.x.toFixed(1)); ray.setAttribute('y2', p.y.toFixed(1));
      knob.setAttribute('cx', p.x.toFixed(1)); knob.setAttribute('cy', p.y.toFixed(1));
      // 采样画弧，避免 arc flag 方向出错
      var N = 24, pts = [];
      for (var i = 0; i <= N; i++) {
        var q = pt(v * i / N, 46);
        pts.push(q.x.toFixed(1) + ',' + q.y.toFixed(1));
      }
      arcFill.setAttribute('d', 'M' + cx + ' ' + cy + ' L' + pts.join(' L') + ' Z');
      arcLine.setAttribute('d', 'M' + pts.join(' L'));
      var tk = pt(v, R - 2), tk2 = pt(v, R - 16);
      tickHi.setAttribute('x1', tk.x); tickHi.setAttribute('y1', tk.y);
      tickHi.setAttribute('x2', tk2.x); tickHi.setAttribute('y2', tk2.y);
      readout.textContent = '∠ = ' + Math.round(v) + '°';
      var k = v < 90 ? '锐角（小于 90°）' : v === 90 ? '直角（等于 90°）' : v < 180 ? '钝角（大于 90°）' : '平角（等于 180°）';
      kind.textContent = k;
    }
    paint(deg);

    // 拖动改角度
    var dragging = false;
    function toDeg(ev) {
      var r = svg.getBoundingClientRect();
      var sx = (ev.clientX - r.left) / r.width * W;
      var sy = (ev.clientY - r.top) / r.height * H;
      var v = Math.atan2(cy - sy, sx - cx) * 180 / Math.PI;
      if (v < 0) v = 0; if (v > 180) v = 180;
      return v;
    }
    function onMove(ev) {
      if (!dragging) return;
      ev.preventDefault();
      paint(toDeg(ev));
    }
    function onUp() { dragging = false; }
    svg.addEventListener('pointerdown', function (ev) {
      dragging = true; svg.setPointerCapture && svg.setPointerCapture(ev.pointerId); onMove(ev);
    });
    svg.addEventListener('pointermove', onMove);
    svg.addEventListener('pointerup', onUp);
    svg.addEventListener('pointercancel', onUp);

    var STEPS = [
      { text: '量角器的<b>中心</b>要对准角的顶点。', run: function () { hub.setAttribute('r', 9); } },
      { text: '量角器的<b>零刻度线</b>要对准角的一条边。', run: function () { zeroHi.style.opacity = 1; } },
      { text: '再看角的另一条边，它指向<b>' + Math.round(deg) + '°</b>。', run: function () { tickHi.style.opacity = 1; } },
      { text: Math.round(deg) + '° 小于 90°，所以这是一个<b>锐角</b>。', run: function () {} }
    ];
    var idx = 0;
    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () {
        idx = 0;
        hub.setAttribute('r', 5); zeroHi.style.opacity = 0; tickHi.style.opacity = 0;
        paint(deg);
        return this;
      },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 平行四边形和梯形
   * 区别只在一句话：平行四边形两组对边分别平行，梯形只有一组。
   * 平行的那两边用成对的箭头标出来，数箭头就数得出几组。
   * ══════════════════════════════════════════════════════ */
  function quad(el, spec) {
    spec = spec || {};
    var W = 360, H = 250;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'qd-svg', role: 'img' }, el);
    svg.style.width = '100%'; svg.style.height = 'auto';
    var GEO = '#a78bfa', NUM = '#38bdf8', ORG = '#fbbf24';

    var DEFS = [
      { key: 'parallelogram', name: '平行四边形', pts: [[0, 70], [104, 70], [142, 12], [38, 12]], pairs: [[0, 2], [1, 3]] },
      { key: 'trapezoid', name: '梯形', pts: [[0, 70], [124, 70], [98, 12], [28, 12]], pairs: [[0, 2]] },
      { key: 'rectangle', name: '长方形', pts: [[0, 70], [116, 70], [116, 12], [0, 12]], pairs: [[0, 2], [1, 3]] }
    ];
    var keys = spec.shapes || ['parallelogram', 'trapezoid', 'rectangle'];
    var list = DEFS.filter(function (d) { return keys.indexOf(d.key) >= 0; });
    var cellW = W / list.length;

    function parMark(x, y, angDeg, color) {
      var g = s('g', { transform: 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ') rotate(' + angDeg.toFixed(1) + ')' });
      s('path', { d: 'M-3 -4 L3 0 L-3 4', fill: 'none', stroke: color, 'stroke-width': 1.8, 'stroke-linecap': 'round' }, g);
      s('path', { d: 'M3 -4 L9 0 L3 4', fill: 'none', stroke: color, 'stroke-width': 1.8, 'stroke-linecap': 'round' }, g);
      return g;
    }

    var cells = [];
    list.forEach(function (df, i) {
      var ox = cellW * i + (cellW - 142) / 2, oy = 96;
      var g = s('g', null, svg);
      var P = df.pts.map(function (p) { return { x: ox + p[0], y: oy - p[1] }; });
      s('polygon', { points: P.map(function (p) { return p.x + ',' + p.y; }).join(' '),
        fill: 'rgba(167,139,250,.10)', stroke: GEO, 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, g);
      // 平行标记
      df.pairs.forEach(function (pr, pi) {
        var col = pi === 0 ? NUM : ORG;
        pr.forEach(function (si) {
          var a = P[si], b = P[(si + 1) % 4];
          var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
          var ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
          g.appendChild(parMark(mx, my, ang, col));
        });
      });
      var nm = s('text', { x: ox + 71, y: oy + 22, 'text-anchor': 'middle',
        style: 'font-size:12.5px;font-weight:600' }, svg);
      nm.textContent = df.name;
      var lb = s('text', { x: ox + 71, y: oy + 40, 'text-anchor': 'middle',
        style: 'font-size:11px;fill:var(--dim)' }, svg);
      lb.textContent = '';
      cells.push({ g: g, name: nm, label: lb, def: df, P: P, ox: ox, oy: oy });
    });

    // 梯形的高（虚线，默认隐藏）
    function drawHeight(c) {
      var top = [c.P[3], c.P[2]], bot = [c.P[0], c.P[1]];
      var x = (top[0].x + top[1].x) / 2;
      var hg = s('g', null, svg); hg.style.opacity = 0; hg.style.transition = 'opacity .35s ease';
      s('line', { x1: x, y1: top[0].y, x2: x, y2: bot[0].y,
        stroke: 'var(--ok)', 'stroke-width': 2, 'stroke-dasharray': '5 4' }, hg);
      var rt = s('path', { d: 'M' + x + ' ' + bot[0].y + ' l-5 -9 l10 0 z', fill: 'var(--ok)' }, hg);
      var t = s('text', { x: x + 8, y: (top[0].y + bot[0].y) / 2 + 4, style: 'font-size:11.5px;fill:var(--ok)' }, hg);
      t.textContent = '高';
      return hg;
    }
    var trapCell = cells.filter(function (c) { return c.def.key === 'trapezoid'; })[0];
    var heightG = trapCell ? drawHeight(trapCell) : null;

    var TEXT = {
      parallelogram: '平行四边形：<b>两组</b>对边分别平行（两组箭头），对边还相等。',
      trapezoid: '梯形：<b>只有一组</b>对边平行（上底和下底），不平行的两条叫腰。',
      rectangle: '长方形：<b>两组</b>对边分别平行且四个角是直角——是<b>特殊的平行四边形</b>。'
    };
    var STEPS = cells.map(function (c, i) {
      return {
        text: TEXT[c.def.key],
        run: function () {
          cells.forEach(function (cc, j) {
            cc.g.setAttribute('opacity', j === i ? 1 : 0.28);
            cc.name.setAttribute('opacity', j === i ? 1 : 0.4);
            cc.label.textContent = '';
          });
          c.label.textContent = c.def.pairs.length === 2 ? '两组对边平行' : '只有一组对边平行';
        }
      };
    });
    if (heightG) {
      STEPS.push({
        text: '梯形的高：从上底到下底画的<b>垂直线段</b>。两底之间可以画无数条高，长度都相等。',
        run: function () {
          cells.forEach(function (cc, j) {
            cc.g.setAttribute('opacity', cc.def.key === 'trapezoid' ? 1 : 0.28);
            cc.name.setAttribute('opacity', cc.def.key === 'trapezoid' ? 1 : 0.4);
          });
          heightG.style.opacity = 1;
        }
      });
    }
    var idx = 0;
    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () {
        idx = 0;
        cells.forEach(function (c) {
          c.g.setAttribute('opacity', 1); c.name.setAttribute('opacity', 1); c.label.textContent = '';
        });
        if (heightG) heightG.style.opacity = 0;
        return this;
      },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 百格图：小数的意义与性质
   * 1 平均分成 100 份，1 份是 0.01，10 份（一列）是 0.1。
   * 0.3 和 0.30 涂出来的格数一样多，所以它们相等。
   * ══════════════════════════════════════════════════════ */
  function decGrid(el, spec) {
    spec = spec || {};
    var mode = spec.mode || 'meaning';
    var v = spec.value == null ? 0.35 : Number(spec.value);
    var v2 = spec.compare == null ? null : Number(spec.compare);
    var W = 360, H = 250, cell = 14, gw = cell * 10;

    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'dgr-svg', role: 'img' }, el);
    svg.style.width = '100%'; svg.style.height = 'auto';
    var BLUE = '#38bdf8', ORG = '#fbbf24';

    function grid(gx, gy, label) {
      var cells = [];
      for (var col = 0; col < 10; col++) {
        for (var row = 0; row < 10; row++) {
          var r = s('rect', { x: gx + col * cell, y: gy + row * cell, width: cell - 1.2, height: cell - 1.2, rx: 2,
            fill: BLUE, 'fill-opacity': 0.1, stroke: 'var(--line)', 'stroke-width': 0.8 }, svg);
          r.style.transition = 'fill-opacity .2s ease';
          cells.push(r);
        }
      }
      s('rect', { x: gx - 2, y: gy - 2, width: gw + 4, height: gw + 4, fill: 'none',
        stroke: 'var(--geo)', 'stroke-width': 1.6 }, svg);
      var t = s('text', { x: gx + gw / 2, y: gy + gw + 22, 'text-anchor': 'middle',
        style: 'font-size:13px;font-weight:600' }, svg);
      t.textContent = label;
      return { cells: cells, label: t, gx: gx, gy: gy };
    }

    var gA, gB;
    var la = spec.label != null ? spec.label : String(v);
    var lb = spec.compareLabel != null ? spec.compareLabel : (v2 == null ? String(v) : String(v2));
    if (mode === 'property') {
      gA = grid(24, 60, la);
      gB = grid(24 + gw + 32, 60, lb);
    } else {
      gA = grid((W - gw) / 2, 54, la);
    }

    function fillIn(g, n, color) {
      g.cells.forEach(function (c, i) {
        var on = i < n;
        c.setAttribute('fill', on ? (color || BLUE) : BLUE);
        c.setAttribute('fill-opacity', on ? 0.75 : 0.1);
      });
    }
    function colHigh(g, from, to, color) {
      for (var i = from; i < to && i < 100; i++) {
        g.cells[i].setAttribute('fill', color);
        g.cells[i].setAttribute('fill-opacity', 0.75);
      }
    }

    var STEPS = [], idx = 0;
    if (mode === 'meaning') {
      var n = Math.round(v * 100);
      STEPS = [
        { text: '把 1 平均分成 100 份，1 份就是 <b>0.01</b>。', run: function () { colHigh(gA, 0, 1, ORG); } },
        { text: '10 份（一整列）就是 <b>0.1</b>。', run: function () { fillIn(gA, 10, BLUE); } },
        { text: la + ' = 100 份里的 <b>' + n + ' 份</b>，也就是 ' + n + ' 个 0.01。', run: function () { fillIn(gA, n, BLUE); } },
        { text: '其中 ' + Math.floor(n / 10) + ' 个 0.1（' + Math.floor(n / 10) + ' 整列）和 ' + (n % 10) + ' 个 0.01。',
          run: function () {
            fillIn(gA, n, BLUE);
            colHigh(gA, Math.floor(n / 10) * 10, n, ORG);
          } }
      ];
    } else {
      var na = Math.round(v * 100), nb = Math.round((v2 == null ? v : v2) * 100);
      STEPS = [
        { text: '左边 ' + la + '：涂 ' + na + ' 格，就是 ' + na + ' 个 0.01。', run: function () { fillIn(gA, na, BLUE); } },
        { text: '右边 ' + lb + '：涂 ' + nb + ' 格，就是 ' + nb + ' 个 0.01。', run: function () { fillIn(gB, nb, ORG); } },
        { text: '两边都涂了 <b>' + na + ' 格</b>，一样多，所以 ' + la + ' <b>=</b> ' + lb + '：小数末尾添 0 或去 0，大小不变。',
          run: function () { fillIn(gA, na, BLUE); fillIn(gB, nb, ORG); } }
      ];
    }

    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () {
        idx = 0;
        [gA, gB].forEach(function (g) { if (g) g.cells.forEach(function (c) { c.setAttribute('fill', BLUE); c.setAttribute('fill-opacity', 0.1); }); });
        return this;
      },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 多位数乘多位数（三位数乘两位数）
   * 关键是两个「部分积」：用个位去乘，末位对齐个位；
   * 用十位去乘，得数末位要对着十位——所以第二行向左错一位。
   * ══════════════════════════════════════════════════════ */
  function mult2(el, spec) {
    spec = spec || {};
    var a = String(spec.a == null ? '' : spec.a).replace(/\D/g, '');
    var b = String(spec.b == null ? '' : spec.b).replace(/\D/g, '');
    if (!a || !b) {
      el.appendChild(h('p', 'muted', '乘法竖式需要两个因数。'));
      return { el: el };
    }
    var db = b.split('').reverse().map(Number); // [个位, 十位, ...]
    var n = a.length + b.length;
    var total = Number(a) * Number(b);

    var cellW = 32, cellH = 30, padL = 62, padT = 14;
    // 右侧要给「即 ×××」标注留位
    var padR = db.length > 1 ? 66 : 26;
    var W = padL + n * cellW + padR;
    var rows = 4 + db.length; // 0:被乘数 1:乘数 2:线 ..部分积.. 线 结果
    var H = padT + (rows + 1) * cellH + 8;

    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'm2-svg', role: 'img',
      'aria-label': a + ' 乘 ' + b + ' 的竖式' }, el);
    svg.style.width = '100%'; svg.style.height = 'auto'; svg.style.maxWidth = '340px';

    function x(col) { return padL + col * cellW + cellW / 2; }
    function y(row) { return padT + row * cellH + cellH * 0.72; }
    // 把 str 右对齐到「第 (n-1-shift) 列」
    function put(str, row, shift, cls, color) {
      var g = s('g', null, svg);
      for (var j = 0; j < str.length; j++) {
        var col = n - str.length - shift + j;
        var t = s('text', { x: x(col), y: y(row), 'text-anchor': 'middle',
          class: cls || 'dnum' }, g);
        if (color) t.setAttribute('fill', color);
        t.textContent = str[j];
      }
      return g;
    }
    function rule(row) {
      var x1 = padL - 8, x2 = padL + n * cellW - 4;
      return s('line', { x1: x1, y1: y(row) - 4, x2: x2, y2: y(row) - 4, class: 'dbar' }, svg);
    }

    put(a, 0, 0);
    var opT = s('text', { x: padL - 18, y: y(1), 'text-anchor': 'middle', class: 'dnum' }, svg);
    opT.textContent = '×';
    put(b, 1, 0);
    rule(2);

    // 两个部分积
    var partials = [], pVals = [];
    for (var k = 0; k < db.length; k++) {
      var pv = Number(a) * db[k];
      pVals.push(pv);
      var pg = put(String(pv), 3 + k, k, 'dnum', k === 0 ? '#38bdf8' : '#fbbf24');
      pg.style.opacity = 0; pg.style.transition = 'opacity .35s ease';
      partials.push(pg);
    }
    rule(3 + db.length);
    var resG = put(String(total), 4 + db.length, 0, 'dnum', '#4ade80');
    resG.style.opacity = 0; resG.style.transition = 'opacity .35s ease';

    // 十位那一步的「实际表示」标注
    var noteEl = null;
    if (db.length > 1 && db[1]) {
      noteEl = s('text', { x: padL + n * cellW + 2, y: y(4) - 2, 'text-anchor': 'start',
        style: 'font-size:10.5px;fill:var(--dim)' }, svg);
      noteEl.textContent = '即 ' + (pVals[1] * 10);
      noteEl.style.opacity = 0; noteEl.style.transition = 'opacity .35s ease';
    }

    var PLACE = ['个位', '十位', '百位'];
    var STEPS = [];
    STEPS.push({
      text: '先用<b>个位</b>上的 ' + db[0] + ' 去乘 ' + a + '：' + a + ' × ' + db[0] + ' = <b>' +
        pVals[0] + '</b>，末位和个位对齐。',
      run: function () { partials[0].style.opacity = 1; }
    });
    if (db.length > 1) {
      STEPS.push({
        text: '再用<b>十位</b>上的 ' + db[1] + ' 去乘 ' + a + '：' + a + ' × ' + db[1] + ' = ' + pVals[1] +
          '，得数的末位要对着十位，所以<b>向左错一位</b>写（它实际是 ' + (pVals[1] * 10) + '）。',
        run: function () { partials[1].style.opacity = 1; if (noteEl) noteEl.style.opacity = 1; }
      });
    }
    STEPS.push({
      text: '把两次乘得的数<b>加起来</b>：' + pVals.join(' + ') + '（第二行是 ' + (pVals[1] ? pVals[1] * 10 : 0) +
        '） = <b>' + total + '</b>。',
      run: function () { resG.style.opacity = 1; }
    });

    var idx = 0;
    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () {
        idx = 0;
        partials.forEach(function (p) { p.style.opacity = 0; });
        resG.style.opacity = 0;
        if (noteEl) noteEl.style.opacity = 0;
        return this;
      },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 统计图：条形与折线
   * 条形图比的是「谁多谁少」，一格表示几要先看清；
   * 折线图看的是「往哪变」，上升是增加、下降是减少。
   * ══════════════════════════════════════════════════════ */
  function chart(el, spec) {
    spec = spec || {};
    var mode = spec.mode || 'bar';
    var cats = spec.categories || [];
    var series = spec.series || [];
    var W = 360, H = 250;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'cht-svg', role: 'img' }, el);
    svg.style.width = '100%'; svg.style.height = 'auto';

    var x0 = 48, xR = 344, yTop = 34, yBase = 194;
    var maxV = 1;
    series.forEach(function (sr) { sr.values.forEach(function (v) { if (v > maxV) maxV = v; }); });
    // 纵轴刻度取整：让 5 格正好覆盖
    var step = Math.max(1, Math.ceil(maxV / 5));
    if (maxV / step > 5) step += 1;
    var axisMax = step * 5;
    function yOf(v) { return yBase - v / axisMax * (yBase - yTop); }

    // 纵轴与格线
    s('line', { x1: x0, y1: yTop - 6, x2: x0, y2: yBase, class: 'cx-axis' }, svg);
    for (var g = 0; g <= axisMax; g += step) {
      var gy = yOf(g);
      s('line', { x1: x0, y1: gy, x2: xR, y2: gy, stroke: 'var(--line)', 'stroke-width': 0.8 }, svg);
      var tl = s('text', { x: x0 - 6, y: gy + 4, 'text-anchor': 'end', style: 'font-size:10.5px;fill:var(--dim)' }, svg);
      tl.textContent = String(g);
    }
    var unitT = s('text', { x: x0 - 6, y: yTop - 14, 'text-anchor': 'end', style: 'font-size:11px;fill:var(--accent)' }, svg);
    unitT.textContent = '一格 = ' + step;
    s('line', { x1: x0, y1: yBase, x2: xR, y2: yBase, class: 'cx-axis' }, svg);

    var catW = (xR - x0) / Math.max(1, cats.length);
    var STEPS = [], idx = 0, bars = [], lines = [], dots = [];

    cats.forEach(function (c, i) {
      var cx = x0 + catW * (i + 0.5);
      var t = s('text', { x: cx, y: yBase + 18, 'text-anchor': 'middle', style: 'font-size:11.5px' }, svg);
      t.textContent = c;
    });

    if (mode === 'bar') {
      var barW = catW * (series.length > 1 ? 0.34 : 0.5);
      series.forEach(function (sr, si) {
        sr.values.forEach(function (v, i) {
          var cx = x0 + catW * (i + 0.5) + (series.length > 1 ? (si - 0.5) * barW * 1.15 : 0);
          var h = (yBase - yOf(v));
          var gg = s('g', { transform: 'translate(' + cx.toFixed(1) + ',' + yBase + ') scale(1,0)' }, svg);
          gg.style.transition = 'transform .45s ease';
          var r = s('rect', { x: -barW / 2, y: -h, width: barW, height: h, rx: 3,
            fill: sr.color, 'fill-opacity': 0.7, stroke: sr.color, 'stroke-width': 1.2 }, gg);
          var vt = s('text', { x: 0, y: -h - 6, 'text-anchor': 'middle', style: 'font-size:11px;fill:' + sr.color }, gg);
          vt.textContent = String(v);
          bars.push({ g: gg, v: v, si: si, ci: i, name: sr.name, cat: cats[i] });
        });
      });
      STEPS.push({
        text: '先看纵轴：<b>一格表示 ' + step + '</b>，看不清这一格，读出来的数就全错。',
        run: function () {}
      });
      cats.forEach(function (c, i) {
        STEPS.push({
          text: series.length > 1
            ? c + '：' + series.map(function (sr) { return sr.name + ' ' + sr.values[i]; }).join('，') + '。'
            : c + '：' + series[0].values[i] + '。',
          run: function () {
            bars.forEach(function (b) { if (b.ci === i) b.g.setAttribute('transform',
              b.g.getAttribute('transform').replace('scale(1,0)', 'scale(1,1)')); });
          }
        });
      });
      STEPS.push({
        text: '条形越高数量越多——比多少，看条形的<b>高度</b>。',
        run: function () {
          bars.forEach(function (b) { b.g.setAttribute('transform',
            b.g.getAttribute('transform').replace('scale(1,0)', 'scale(1,1)')); });
        }
      });
    } else {
      // 折线：先描点，再连线
      var paths = [], allDots = [];
      series.forEach(function (sr, si) {
        var pts = sr.values.map(function (v, i) {
          return { x: x0 + catW * (i + 0.5), y: yOf(v) };
        });
        var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1); }).join(' ');
        var p = s('path', { d: d, fill: 'none', stroke: sr.color, 'stroke-width': 2.4,
          'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, svg);
        var len = 0;
        try { len = p.getTotalLength(); } catch (e) { len = 900; }
        p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
        p.style.transition = 'stroke-dashoffset .8s ease';
        paths.push(p);
        pts.forEach(function (pt, i) {
          var c = s('circle', { cx: pt.x, cy: pt.y, r: 4.2, fill: sr.color }, svg);
          c.style.opacity = 0; c.style.transition = 'opacity .25s ease ' + (i * 60) + 'ms';
          allDots.push(c);
          var vt = s('text', { x: pt.x, y: pt.y - 9, 'text-anchor': 'middle', style: 'font-size:10.5px;fill:' + sr.color }, svg);
          vt.textContent = String(sr.values[i]);
          vt.style.opacity = 0; allDots.push(vt);
        });
      });
      STEPS = [
        { text: '先<b>描点</b>：每个项目对应一个点，点的高度就是它的数量。',
          run: function () { allDots.forEach(function (d) { d.style.opacity = 1; }); } },
        { text: '再<b>连线</b>：把相邻的点用线段连起来，就成了折线统计图。',
          run: function () { paths.forEach(function (p) { p.style.strokeDashoffset = 0; }); } },
        { text: '折线统计图看的是<b>变化趋势</b>：线段往上升表示增加，往下降表示减少。',
          run: function () {} }
      ];
    }

    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () {
        idx = 0;
        bars.forEach(function (b) {
          b.g.setAttribute('transform', b.g.getAttribute('transform').replace('scale(1,1)', 'scale(1,0)'));
        });
        return this;
      },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 平均数：移多补少
   * 平均数不是「每个人都这么多」，而是把多的补给少的之后，
   * 大家一样多时的那个数。所以它一定在最大和最小之间。
   * ══════════════════════════════════════════════════════ */
  function mean(el, spec) {
    spec = spec || {};
    var vals = spec.values || [];
    var labels = spec.labels || [];
    var W = 360, H = 240;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'men-svg', role: 'img' }, el);
    svg.style.width = '100%'; svg.style.height = 'auto';

    var n = vals.length;
    var sum = vals.reduce(function (a, b) { return a + b; }, 0);
    var avg = n ? sum / n : 0;
    var maxV = Math.max.apply(null, vals.concat([1]));
    var yBase = 176, maxH = 118;
    function hOf(v) { return v / maxV * maxH; }
    function yOf(v) { return yBase - hOf(v); }

    var barW = Math.min(38, (W - 60) / n * 0.62);
    var gap = (W - 60) / n;
    var bars = [];
    vals.forEach(function (v, i) {
      var cx = 30 + gap * (i + 0.5);
      var h = hOf(v);
      // 以基线为原点做 scaleY：拉伸时底边始终贴着基线
      var gg = s('g', { transform: 'translate(' + cx.toFixed(1) + ',' + yBase + ') scale(1,1)' }, svg);
      gg.style.transition = 'transform .5s ease';
      var r = s('rect', { x: -barW / 2, y: -h, width: barW, height: h, rx: 3,
        fill: 'var(--num)', 'fill-opacity': 0.55, stroke: 'var(--num)', 'stroke-width': 1.4 }, gg);
      // 数值文字不参与缩放，单独放一层
      var vt = s('text', { x: cx, y: yOf(v) - 7, 'text-anchor': 'middle', style: 'font-size:12px;font-weight:600' }, svg);
      vt.textContent = String(v);
      var lb = s('text', { x: cx, y: yBase + 18, 'text-anchor': 'middle', style: 'font-size:11.5px;fill:var(--dim)' }, svg);
      lb.textContent = labels[i] || String(i + 1);
      bars.push({ g: gg, rect: r, val: v, cx: cx, h: h, txt: vt });
    });
    s('line', { x1: 20, y1: yBase, x2: W - 20, y2: yBase, class: 'cx-axis' }, svg);

    // 平均线
    var ay = yOf(avg);
    var mline = s('line', { x1: 20, y1: ay, x2: W - 20, y2: ay,
      stroke: 'var(--accent)', 'stroke-width': 2, 'stroke-dasharray': '6 4' }, svg);
    mline.style.opacity = 0; mline.style.transition = 'opacity .35s ease';
    var mt = s('text', { x: W - 20, y: ay - 8, 'text-anchor': 'end',
      style: 'font-size:12px;font-weight:600;fill:var(--accent)' }, svg);
    mt.textContent = '平均数 ' + avg;
    mt.style.opacity = 0; mt.style.transition = 'opacity .35s ease';

    // 多出来的部分 / 缺的部分
    var marks = [];
    bars.forEach(function (b) {
      var m = s('g', null, svg); m.style.opacity = 0; m.style.transition = 'opacity .35s ease';
      if (b.val > avg) {
        var top = yOf(b.val), bot = ay;
        s('rect', { x: b.cx - barW / 2, y: top, width: barW, height: bot - top,
          fill: 'var(--bad)', 'fill-opacity': 0.45 }, m);
      } else if (b.val < avg) {
        var t2 = ay, b2 = yOf(b.val);
        s('rect', { x: b.cx - barW / 2, y: t2, width: barW, height: b2 - t2,
          fill: 'var(--ok)', 'fill-opacity': 0.4, stroke: 'var(--ok)', 'stroke-dasharray': '3 2' }, m);
      }
      marks.push(m);
    });

    var formula = s('text', { x: W / 2, y: H - 12, 'text-anchor': 'middle',
      style: 'font-size:13px;font-weight:600' }, svg);
    formula.textContent = '';
    var avgH = hOf(avg);

    var STEPS = [
      { text: '先看清每个人有多少：' + vals.join('、') + '，一共 <b>' + sum + '</b>。', run: function () {} },
      { text: '平均数 = 总数 ÷ 个数 = ' + sum + ' ÷ ' + n + ' = <b>' + avg + '</b>。先画一条线看看。',
        run: function () { mline.style.opacity = 1; mt.style.opacity = 1; } },
      { text: '比平均数<b>多</b>的部分（红色）可以移走，比平均数<b>少</b>的部分（绿色）需要补上。',
        run: function () { marks.forEach(function (m) { m.style.opacity = 1; }); } },
      { text: '把多的补给少的——这就是<b>移多补少</b>：大家最后都一样多，都是 <b>' + avg + '</b>。',
        run: function () {
          marks.forEach(function (m) { m.style.opacity = 0; });
          bars.forEach(function (b) {
            var k = avgH / (b.h || 1);
            b.g.style.transition = 'transform .5s ease';
            b.g.setAttribute('transform', 'translate(' + b.cx.toFixed(1) + ',' + yBase + ') scale(1,' + k.toFixed(3) + ')');
            b.txt.setAttribute('y', (yBase - avgH - 7).toFixed(1));
            b.txt.textContent = String(avg);
            b.txt.setAttribute('style', 'font-size:12px;font-weight:600;fill:var(--accent)');
          });
          formula.textContent = vals.join(' + ') + ' = ' + sum + '　　' + sum + ' ÷ ' + n + ' = ' + avg;
        } }
    ];
    var idx = 0;
    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () {
        idx = 0;
        mline.style.opacity = 0; mt.style.opacity = 0;
        marks.forEach(function (m) { m.style.opacity = 0; });
        bars.forEach(function (b) {
          b.g.setAttribute('transform', 'translate(' + b.cx.toFixed(1) + ',' + yBase + ') scale(1,1)');
          b.txt.setAttribute('y', (yOf(b.val) - 7).toFixed(1));
          b.txt.textContent = String(b.val);
          b.txt.setAttribute('style', 'font-size:12px;font-weight:600');
        });
        formula.textContent = '';
        return this;
      },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 多边形的面积：割补与拼摆
   * 面积公式不是背的——把图形剪开、平移、拼成已经会算的图形，
   * 公式就自己出来了。
   * ══════════════════════════════════════════════════════ */
  function polyArea(el, spec) {
    spec = spec || {};
    var mode = spec.mode || 'para';
    var W = 360, H = 250;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'ply-svg', role: 'img' }, el);
    svg.style.width = '100%'; svg.style.height = 'auto';
    var GEO = '#a78bfa', NUM = '#38bdf8', ORG = '#fbbf24', OK = '#4ade80';

    var STEPS = [], idx = 0, resetFn = function () {};

    function poly(pts, color, fillOp, dash) {
      var p = s('polygon', { points: pts.map(function (q) { return q[0] + ',' + q[1]; }).join(' '),
        fill: color, 'fill-opacity': fillOp == null ? 0.12 : fillOp, stroke: color, 'stroke-width': 2.2,
        'stroke-linejoin': 'round' }, svg);
      if (dash) p.setAttribute('stroke-dasharray', dash);
      return p;
    }
    function label(x, y, txt, color, size) {
      var t = s('text', { x: x, y: y, 'text-anchor': 'middle',
        style: 'font-size:' + (size || 13) + 'px;font-weight:600;fill:' + (color || 'var(--text)') }, svg);
      t.textContent = txt;
      return t;
    }

    if (mode === 'para') {
      var b = 150, h = 90, d = 46, ox = (W - (b + d)) / 2 + 6, oy = 168;
      // 平行四边形：底 (ox..ox+b)，上底右移 d
      var P = [[ox, oy], [ox + b, oy], [ox + b + d, oy - h], [ox + d, oy - h]];
      poly(P, GEO, 0.12);
      // 高（虚线，从左上角垂直下来）
      var cut = s('line', { x1: ox + d, y1: oy - h, x2: ox + d, y2: oy,
        stroke: 'var(--dim)', 'stroke-width': 1.8, 'stroke-dasharray': '5 4' }, svg);
      cut.style.opacity = 0; cut.style.transition = 'opacity .3s ease';
      // 沿高剪下的三角形，可平移
      var tri = s('g', null, svg);
      tri.style.transition = 'transform .55s ease';
      s('polygon', { points: (ox) + ',' + oy + ' ' + (ox + d) + ',' + oy + ' ' + (ox + d) + ',' + (oy - h),
        fill: NUM, 'fill-opacity': 0.4, stroke: NUM, 'stroke-width': 2 }, tri);
      // 拼好后的长方形轮廓
      var rectOutline = s('rect', { x: ox + d, y: oy - h, width: b, height: h, fill: OK,
        'fill-opacity': 0.14, stroke: OK, 'stroke-width': 2.2 }, svg);
      rectOutline.style.opacity = 0; rectOutline.style.transition = 'opacity .35s ease';
      var lb = label(W / 2, 30, '', OK, 14);
      var lb2 = label(W / 2, H - 14, '', 'var(--dim)', 12.5);
      resetFn = function () {
        cut.style.opacity = 0; rectOutline.style.opacity = 0;
        tri.setAttribute('transform', ''); lb.textContent = ''; lb2.textContent = '';
      };
      STEPS = [
        { text: '这是一个平行四边形，底 ' + b + '、高 ' + h + '。', run: function () {} },
        { text: '沿着<b>高</b>把它剪开，分成一个三角形和一个梯形。', run: function () { cut.style.opacity = 1; } },
        { text: '把左边的三角形<b>平移</b>到右边——正好补成一个长方形。',
          run: function () { tri.setAttribute('transform', 'translate(' + b + ',0)'); rectOutline.style.opacity = 1; } },
        { text: '长方形的长是原来平行四边形的<b>底</b>，宽是它的<b>高</b>，所以 面积 = <b>底 × 高</b>（S = ah）。',
          run: function () { lb.textContent = '平行四边形面积 = 底 × 高'; lb2.textContent = 'S = a h'; } }
      ];
    } else if (mode === 'tri') {
      // 两个完全一样的三角形：把第二个绕公共边中点旋转 180°，拼成平行四边形
      var b2 = 140, h2 = 92, ox2 = 110, oy2 = 168;
      var A = [ox2, oy2], B = [ox2 + b2, oy2], C = [ox2 + Math.round(b2 * 0.7), oy2 - h2];
      var Bp = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]]; // B 关于 AC 中点的对称点
      poly([A, B, C], GEO, 0.12);
      var g2 = s('g', null, svg);
      g2.style.transition = 'transform .55s ease, opacity .3s ease';
      g2.style.opacity = 0;
      s('polygon', { points: [A, C, Bp].map(function (q) { return q[0] + ',' + q[1]; }).join(' '),
        fill: NUM, 'fill-opacity': 0.35, stroke: NUM, 'stroke-width': 2 }, g2);
      var outline = poly([A, B, C, Bp], OK, 0.14);
      outline.style.opacity = 0; outline.style.transition = 'opacity .35s ease';
      var cent2 = ((A[0] + C[0] + Bp[0]) / 3).toFixed(1) + ' ' + ((A[1] + C[1] + Bp[1]) / 3).toFixed(1);
      var lb3 = label(W / 2, 26, '', OK, 14);
      var lb4 = label(W / 2, H - 14, '', 'var(--dim)', 12.5);
      resetFn = function () { outline.style.opacity = 0; g2.style.opacity = 0; g2.setAttribute('transform', 'rotate(0 ' + cent2 + ') translate(0,0)'); lb3.textContent = ''; lb4.textContent = ''; };
      STEPS = [
        { text: '拿两个<b>完全一样</b>的三角形。', run: function () { g2.style.opacity = 1; g2.setAttribute('transform', 'rotate(180 ' + cent2 + ') translate(130,0)'); } },
        { text: '把其中一个<b>旋转 180°</b>，和另一个拼在一起。',
          run: function () { g2.setAttribute('transform', 'rotate(0 ' + cent2 + ') translate(0,0)'); } },
        { text: '拼成了一个<b>平行四边形</b>，它的底和高正好是三角形的底和高。',
          run: function () { outline.style.opacity = 1; } },
        { text: '一个三角形是平行四边形的一半，所以 面积 = <b>底 × 高 ÷ 2</b>（S = ah ÷ 2）。',
          run: function () { lb3.textContent = '三角形面积 = 底 × 高 ÷ 2'; lb4.textContent = 'S = a h ÷ 2'; } }
      ];
    } else {
      // 两个完全一样的梯形：第二个绕右腰中点旋转 180°，拼成底为（上底+下底）的平行四边形
      var aT = 66, bT = 130, hT = 84, mT = (bT - aT) / 2, ox3 = 82, oy3 = 168;
      var T1 = [[ox3, oy3], [ox3 + bT, oy3], [ox3 + mT + aT, oy3 - hT], [ox3 + mT, oy3 - hT]];
      poly(T1, GEO, 0.12);
      var g3 = s('g', null, svg);
      g3.style.transition = 'transform .55s ease, opacity .3s ease';
      g3.style.opacity = 0;
      var Mx = ox3 + (bT + mT + aT) / 2, My = oy3 - hT / 2;
      var F = T1.map(function (p) { return [2 * Mx - p[0], 2 * My - p[1]]; });
      s('polygon', { points: F.map(function (q) { return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' '),
        fill: NUM, 'fill-opacity': 0.35, stroke: NUM, 'stroke-width': 2 }, g3);
      var outline3 = poly([[ox3, oy3], [ox3 + aT + bT, oy3], [ox3 + bT + mT + aT, oy3 - hT], [ox3 + mT, oy3 - hT]], OK, 0.14);
      outline3.style.opacity = 0; outline3.style.transition = 'opacity .35s ease';
      var cent3 = (F.reduce(function (s2, p) { return s2 + p[0]; }, 0) / 4).toFixed(1) + ' ' +
        (F.reduce(function (s2, p) { return s2 + p[1]; }, 0) / 4).toFixed(1);
      var lb5 = label(W / 2, 26, '', OK, 14);
      var lb6 = label(W / 2, H - 14, '', 'var(--dim)', 12.5);
      resetFn = function () { outline3.style.opacity = 0; g3.style.opacity = 0; g3.setAttribute('transform', 'rotate(0 ' + cent3 + ') translate(0,0)'); lb5.textContent = ''; lb6.textContent = ''; };
      STEPS = [
        { text: '拿两个<b>完全一样</b>的梯形，上底 ' + aT + '、下底 ' + bT + '、高 ' + hT + '。',
          run: function () { g3.style.opacity = 1; g3.setAttribute('transform', 'rotate(180 ' + cent3 + ') translate(60,0)'); } },
        { text: '把其中一个<b>旋转 180°</b>，和另一个拼在一起。',
          run: function () { g3.setAttribute('transform', 'rotate(0 ' + cent3 + ') translate(0,0)'); } },
        { text: '拼成了一个<b>平行四边形</b>：底是（上底 + 下底）= ' + (aT + bT) + '，高还是 ' + hT + '。',
          run: function () { outline3.style.opacity = 1; } },
        { text: '一个梯形是它的一半，所以 面积 = <b>（上底 + 下底）× 高 ÷ 2</b>。',
          run: function () { lb5.textContent = '梯形面积 =（上底 + 下底）× 高 ÷ 2'; lb6.textContent = 'S = (a + b) h ÷ 2'; } }
      ];
    }

    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () { idx = 0; resetFn(); return this; },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 因数与倍数：用小正方形摆长方形
   * 能摆成几种长方形，这个数就有几对因数。摆不出来的，就不是因数。
   * ══════════════════════════════════════════════════════ */
  function factorGrid(el, spec) {
    spec = spec || {};
    var n = spec.n == null ? 12 : Number(spec.n);
    var W = 360, H = 240;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'fac-svg', role: 'img' }, el);
    svg.style.width = '100%'; svg.style.height = 'auto';
    var NUM = '#38bdf8', ORG = '#fbbf24';

    // 找出所有因数对
    var pairs = [];
    for (var i = 1; i * i <= n; i++) {
      if (n % i === 0) pairs.push([i, n / i]);
    }
    var unit = Math.min(16, Math.floor(150 / Math.max(1, n / pairs[0][0])));
    var groups = [];
    var yCur = 34;

    pairs.forEach(function (pr, pi) {
      var rows = pr[0], cols = pr[1];
      var gw = cols * unit, gh = rows * unit;
      var gx = (W - gw) / 2;
      var g = s('g', null, svg);
      g.style.opacity = 0; g.style.transition = 'opacity .35s ease';
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          s('rect', { x: gx + c * unit, y: yCur + r * unit, width: unit - 1.4, height: unit - 1.4, rx: 2,
            fill: pi % 2 ? ORG : NUM, 'fill-opacity': 0.5, stroke: pi % 2 ? ORG : NUM, 'stroke-width': 0.9 }, g);
        }
      }
      var t = s('text', { x: gx + gw + 12, y: yCur + gh / 2 + 4,
        style: 'font-size:13px;font-weight:600;fill:' + (pi % 2 ? ORG : NUM) }, g);
      t.textContent = rows + ' × ' + cols;
      groups.push({ g: g, pr: pr, y: yCur, gh: gh });
      yCur += gh + 16;
    });

    var factors = [];
    pairs.forEach(function (pr) { factors.push(pr[0]); if (pr[1] !== pr[0]) factors.push(pr[1]); });
    factors.sort(function (a, b) { return a - b; });

    var outT = s('text', { x: W / 2, y: H - 10, 'text-anchor': 'middle',
      style: 'font-size:13.5px;font-weight:600' }, svg);
    outT.textContent = '';
    var outT2 = s('text', { x: W / 2, y: H - 30, 'text-anchor': 'middle',
      style: 'font-size:12px;fill:var(--dim)' }, svg);
    outT2.textContent = '';

    var STEPS = groups.map(function (gp, i) {
      return {
        text: '可以摆成 <b>' + gp.pr[0] + ' 行 × ' + gp.pr[1] + ' 列</b>的长方形（' +
          gp.pr[0] + ' × ' + gp.pr[1] + ' = ' + n + '）。',
        run: function () {
          groups.forEach(function (x, j) { x.g.style.opacity = j === i ? 1 : 0.22; });
        }
      };
    });
    STEPS.push({
      text: '一共能摆出 ' + pairs.length + ' 种，所以 ' + n + ' 的因数有：<b>' + factors.join('、') + '</b>。',
      run: function () {
        groups.forEach(function (x) { x.g.style.opacity = 1; });
        outT.textContent = n + ' 的因数：' + factors.join('、');
        outT2.textContent = '最小的因数是 1，最大的因数是它本身 ' + n;
      }
    });
    var idx = 0;
    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () {
        idx = 0;
        groups.forEach(function (x) { x.g.style.opacity = 0; });
        outT.textContent = ''; outT2.textContent = '';
        return this;
      },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 分数的意义
   * 四件事：必须平均分、分数单位、单位「1」可以是一盒苹果、
   * 以及被除数÷除数 = 分数。都靠动手改，不靠背。
   * ══════════════════════════════════════════════════════ */
  function fracMeaning(el, spec) {
    spec = spec || {};
    var mode = spec.mode || 'parts';
    var ORG = '#fbbf24', BLUE = '#38bdf8', GRN = '#4ade80', RED = '#f87171';
    var wrap = h('div', 'fm');
    el.appendChild(wrap);

    function ctlRow() { var r = h('div', 'fm-ctl'); wrap.appendChild(r); return r; }
    function svgEl(W, H) {
      var sv = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'fm-svg', role: 'img' }, wrap);
      sv.style.width = '100%'; sv.style.height = 'auto';
      return sv;
    }
    function T(parent, x, y, v, st) {
      var t = s('text', { x: x, y: y, style: st || 'font-size:13px' }, parent);
      t.textContent = v; return t;
    }
    // 分数写法（分子 — 分母），便于随时更新
    function glyph(parent, x, y, m, n, size, color) {
      var g = s('g', null, parent);
      var t1 = s('text', { x: x, y: y - 6, 'text-anchor': 'middle',
        style: 'font-size:' + size + 'px;font-weight:700;fill:' + (color || ORG) }, g);
      t1.textContent = m;
      s('line', { x1: x - size * 0.5, y1: y, x2: x + size * 0.5, y2: y,
        stroke: 'var(--text)', 'stroke-width': 2 }, g);
      var t2 = s('text', { x: x, y: y + size + 4, 'text-anchor': 'middle',
        style: 'font-size:' + size + 'px;font-weight:700;fill:var(--text)' }, g);
      t2.textContent = n;
      return { num: t1, den: t2 };
    }
    function sect(cx, cy, R, a0, a1) {
      var pts = [], N = 22, i;
      for (i = 0; i <= N; i++) {
        var t = (a0 + (a1 - a0) * i / N) * Math.PI / 180;
        pts.push((cx + R * Math.cos(t)).toFixed(1) + ',' + (cy - R * Math.sin(t)).toFixed(1));
      }
      return 'M' + cx + ' ' + cy + ' L' + pts.join(' L') + ' Z';
    }
    function polar(cx, cy, R, d) {
      var t = d * Math.PI / 180;
      return { x: cx + R * Math.cos(t), y: cy - R * Math.sin(t) };
    }
    var CN = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];

    var STEPS = [], idx = 0, resetFn = function () {};

    /* —— ① 平均分对比 —— */
    if (mode === 'compare') {
      var W = 360, H = 150, svg = svgEl(W, H);
      var sides = [
        { cx: 90, label: '平均分成 4 份', cuts: [0, 90, 180, 270], ok: true },
        { cx: 270, label: '随便切成 4 块', cuts: [0, 70, 150, 250], ok: false }
      ];
      var hi = [];
      sides.forEach(function (sd) {
        s('circle', { cx: sd.cx, cy: 74, r: 56, fill: 'rgba(251,191,36,.08)', stroke: 'var(--line)', 'stroke-width': 2 }, svg);
        sd.cuts.forEach(function (c) {
          var p = polar(sd.cx, 74, 56, c);
          s('line', { x1: sd.cx, y1: 74, x2: p.x.toFixed(1), y2: p.y.toFixed(1),
            stroke: 'var(--dim)', 'stroke-width': 2 }, svg);
        });
        var h = s('path', { d: sect(sd.cx, 74, 56, sd.cuts[0], sd.cuts[1]),
          fill: sd.ok ? ORG : RED, 'fill-opacity': 0 }, svg);
        h.style.transition = 'fill-opacity .35s ease';
        hi.push(h);
        T(svg, sd.cx, H - 8, sd.label, 'font-size:12.5px;fill:var(--dim);text-anchor:middle');
      });
      T(svg, 180, 22, '两块一样大的饼', 'font-size:12.5px;fill:var(--dim);text-anchor:middle');
      resetFn = function () { hi.forEach(function (x) { x.setAttribute('fill-opacity', 0); }); };
      STEPS = [
        { text: '两块<b>一样大</b>的饼，都被切成了 4 块。', run: function () {} },
        { text: '左边<b>平均分</b>成 4 份，每一份才是它的 <b>1/4</b>。',
          run: function () { hi[0].setAttribute('fill-opacity', 0.7); } },
        { text: '右边 4 块大小不一样，其中的 1 块<b>不能</b>叫 1/4。',
          run: function () { hi[1].setAttribute('fill-opacity', 0.55); } },
        { text: '所以分数必须建立在<b>平均分</b>之上——这是分数意义的第一条。', run: function () {} }
      ];
    }

    /* —— ② 动手分一分：份数 + 拖动涂色 —— */
    if (mode === 'parts') {
      var n = spec.n || 4, m = spec.m == null ? 3 : spec.m;
      var filled = new Array(12).fill(false);
      var ctl = ctlRow();
      var lb = h('span', null, '平均分成'); ctl.appendChild(lb);
      var rg = document.createElement('input');
      rg.type = 'range'; rg.min = '2'; rg.max = '12'; rg.step = '1'; rg.value = String(n);
      rg.setAttribute('aria-label', '平均分成几份');
      ctl.appendChild(rg);
      var vn = h('b', null, n + ' 份'); ctl.appendChild(vn);

      var sv2 = svgEl(360, 132);
      var cells = [];
      var readout = T(sv2, 180, 116, '', 'font-size:12.5px;fill:var(--dim);text-anchor:middle');
      var gf = glyph(sv2, 180, 96, 0, n, 18);

      function drawCells() {
        cells.forEach(function (c) { sv2.removeChild(c.g); });
        cells.length = 0;
        var cw = (360 - 40) / n;
        for (var i = 0; i < n; i++) {
          var g = s('g', { style: 'cursor:pointer' }, sv2);
          var r = s('rect', { x: 20 + i * cw, y: 18, width: cw - 4, height: 52, rx: 7,
            fill: ORG, 'fill-opacity': filled[i] ? 0.85 : 0.1,
            stroke: ORG, 'stroke-width': 1.8 }, g);
          g.__i = i; g.__r = r;
          cells.push(g);
        }
        // 把分数/读数移到最上层
        sv2.appendChild(gf.num.parentNode);
        sv2.appendChild(readout);
        upd();
      }
      function upd() {
        var k = 0;
        for (var i = 0; i < n; i++) if (filled[i]) k++;
        gf.num.textContent = k; gf.den.textContent = n;
        readout.textContent = '读作：' + (n < CN.length ? CN[n] : n) + '分之' + (k < CN.length ? CN[k] : k);
      }
      function paint(g, on) {
        var i = g.__i;
        if (i >= n || filled[i] === on) return;
        filled[i] = on;
        g.__r.setAttribute('fill-opacity', on ? 0.85 : 0.1);
      }
      var dragging = false, dragOn = true;
      sv2.addEventListener('pointerdown', function (ev) {
        var g = ev.target.closest ? ev.target.closest('g') : null;
        if (!g || g.__i == null) return;
        dragging = true; dragOn = !filled[g.__i];
        paint(g, dragOn); upd();
      });
      sv2.addEventListener('pointermove', function (ev) {
        if (!dragging) return;
        var g = ev.target.closest ? ev.target.closest('g') : null;
        if (!g || g.__i == null) return;
        paint(g, dragOn); upd();
      });
      window.addEventListener('pointerup', function () { dragging = false; });
      rg.oninput = function () {
        n = +this.value; vn.textContent = n + ' 份';
        filled = new Array(12).fill(false);
        drawCells();
      };
      drawCells();

      var demoN = n, demoM = m;
      resetFn = function () {
        n = demoN; rg.value = String(n); vn.textContent = n + ' 份';
        filled = new Array(12).fill(false); drawCells();
      };
      STEPS = [
        { text: '把一个整体<b>平均分</b>成 ' + demoN + ' 份。', run: function () {} },
        { text: '其中的<b>一份</b>就是它的 1/' + demoN + '，1/' + demoN + ' 叫做它的<b>分数单位</b>。',
          run: function () { filled[0] = true; cells[0].__r.setAttribute('fill-opacity', 0.85); upd(); } },
        { text: '取 <b>' + demoM + ' 份</b>，就是 ' + demoM + ' 个 1/' + demoN +
          '，也就是 <b>' + demoM + '/' + demoN + '</b>。',
          run: function () {
            for (var i = 0; i < demoM; i++) {
              filled[i] = true; cells[i].__r.setAttribute('fill-opacity', 0.85);
            }
            upd();
          } }
      ];
    }

    /* —— ③ 单位「1」可以是一盒苹果 —— */
    if (mode === 'group') {
      var total = spec.total || 4;
      var ctl3 = ctlRow();
      ctl3.appendChild(h('span', null, '一盒有'));
      var rg3 = document.createElement('input');
      rg3.type = 'range'; rg3.min = '4'; rg3.max = '20'; rg3.step = '4'; rg3.value = String(total);
      rg3.setAttribute('aria-label', '一盒有几个');
      ctl3.appendChild(rg3);
      var v3 = h('b', null, total + ' 个'); ctl3.appendChild(v3);
      var sv3 = svgEl(360, 164);
      var info = T(sv3, 180, 158, '', 'font-size:12.5px;fill:var(--dim);text-anchor:middle');

      function drawBox() {
        // 清掉旧内容（保留 info）
        [].slice.call(sv3.childNodes).forEach(function (c) { if (c !== info) sv3.removeChild(c); });
        var per = total / 4, got = per * 3;
        var unit = Math.min(30, (360 - 40) / total), y = 62;
        var x0 = (360 - unit * total) / 2;
        for (var i = 0; i < total; i++) {
          var on = i < got;
          s('circle', { cx: x0 + i * unit + unit / 2, cy: y, r: unit * 0.34,
            fill: on ? ORG : 'transparent', 'fill-opacity': on ? 0.85 : 0,
            stroke: on ? ORG : 'var(--dim)', 'stroke-width': 2 }, sv3);
        }
        for (var k = 0; k < 4; k++) {
          var gx = x0 + k * (unit * total / 4);
          s('rect', { x: gx + 1, y: y - unit * 0.5, width: (unit * total / 4) - 2, height: unit,
            rx: 7, fill: 'none', stroke: k < 3 ? BLUE : 'var(--line)',
            'stroke-width': k < 3 ? 2.4 : 1.4, 'stroke-dasharray': k < 3 ? '' : '4 3' }, sv3);
        }
        var g3 = glyph(sv3, 150, 118, 3, 4, 16);
        T(sv3, 186, 118, '=  ' + got + ' 个', 'font-size:15px;font-weight:600;fill:var(--text);text-anchor:start');
        T(sv3, 180, 22, '平均分成 4 份，取其中 3 份', 'font-size:12.5px;fill:var(--dim);text-anchor:middle');
        return got;
      }
      rg3.oninput = function () {
        total = +this.value; v3.textContent = total + ' 个';
        var got = drawBox();
        info.textContent = '同样是 3/4，一盒 ' + total + ' 个时是 ' + got + ' 个';
      };
      var got0 = drawBox();
      info.textContent = '同样是 3/4，一盒 ' + total + ' 个时是 ' + got0 + ' 个';

      var cases = [4, 8, 12];
      resetFn = function () {
        total = spec.total || 4; rg3.value = String(total); v3.textContent = total + ' 个';
        drawBox(); info.textContent = '拖动滑块，换一盒苹果看看';
      };
      STEPS = cases.map(function (c) {
        return {
          text: '一盒 <b>' + c + '</b> 个，平均分成 4 份，每份 ' + (c / 4) +
            ' 个，取 3 份 = <b>' + (c / 4 * 3) + ' 个</b>。',
          run: function () {
            total = c; rg3.value = String(c); v3.textContent = c + ' 个';
            var got = drawBox();
            info.textContent = '同样是 3/4，一盒 ' + c + ' 个时是 ' + got + ' 个';
          }
        };
      });
      STEPS.push({
        text: '都是 3/4，数量却不同——分数表示的是<b>部分与整体的关系</b>，不是固定的个数。',
        run: function () {}
      });
    }

    /* —— ④ 分数与除法 —— */
    if (mode === 'divide') {
      var sv4 = svgEl(360, 180);
      var cakes = [], plates = [];
      var cx = [62, 140, 218], cy = 58, R = 38;
      for (var i = 0; i < 3; i++) {
        s('circle', { cx: cx[i], cy: cy, r: R, fill: 'rgba(251,191,36,.10)',
          stroke: ORG, 'stroke-width': 2.2 }, sv4);
      }
      var cutG = s('g', null, sv4); cutG.style.opacity = 0; cutG.style.transition = 'opacity .35s ease';
      for (var i2 = 0; i2 < 3; i2++) {
        for (var k = 0; k < 4; k++) {
          var p = polar(cx[i2], cy, R, k * 90);
          s('line', { x1: cx[i2], y1: cy, x2: p.x.toFixed(1), y2: p.y.toFixed(1),
            stroke: ORG, 'stroke-width': 1.8 }, cutG);
        }
      }
      var plateG = s('g', null, sv4); plateG.style.opacity = 0; plateG.style.transition = 'opacity .35s ease';
      for (var m4 = 0; m4 < 4; m4++) {
        var px = 62 + m4 * 78, py = 144;
        s('ellipse', { cx: px, cy: py, rx: 30, ry: 11, fill: 'rgba(56,189,248,.12)',
          stroke: BLUE, 'stroke-width': 1.8 }, plateG);
        for (var q = 0; q < 3; q++) {
          s('path', { d: sect(px - 14 + q * 14, py - 2, 10, 0, 90),
            fill: ORG, 'fill-opacity': 0.85, stroke: ORG, 'stroke-width': 1.2 }, plateG);
        }
        T(plateG, px, py + 26, '第' + (m4 + 1) + '人', 'font-size:11.5px;fill:' + BLUE + ';text-anchor:middle');
      }
      T(sv4, 180, 22, '把 3 个饼平均分给 4 个人', 'font-size:12.5px;fill:var(--dim);text-anchor:middle');
      resetFn = function () {
        cutG.style.opacity = 0; plateG.style.opacity = 0;
      };
      STEPS = [
        { text: '3 个饼，要<b>平均分</b>给 4 个人，每人分到多少？', run: function () {} },
        { text: '先把每个饼都平均分成 4 份，一共 <b>12 个 1/4</b>。',
          run: function () { cutG.style.opacity = 1; } },
        { text: '12 个 1/4 平均分给 4 人，每人 <b>3 个 1/4</b>。',
          run: function () { plateG.style.opacity = 1; } },
        { text: '也就是每人 <b>3/4</b> 个饼，所以 <b>3 ÷ 4 = 3/4</b>。', run: function () {} }
      ];
    }

    return {
      el: wrap,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () { idx = 0; resetFn(); return this; },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 分数的加减法
   * 同分母：分数单位相同，直接加分子；异分母：先通分成
   * 相同的份数再算。图上看得见「重分」这一步。
   * ══════════════════════════════════════════════════════ */
  function fracOps(el, spec) {
    spec = spec || {};
    var a = spec.a || [1, 8], b = spec.b || [3, 8], op = spec.op || '+';
    var ORG = '#fbbf24', BLUE = '#38bdf8', GRN = '#4ade80';
    var like = a[1] === b[1];
    var g = function (m, n) { return (function gcd(x, y) { return y ? gcd(y, x % y) : x; })(m, n); };
    var la = a[1] * b[1] / g(a[1], b[1]);
    var na = a[0] * la / a[1], nb = b[0] * la / b[1];
    var res = op === '+' ? na + nb : na - nb;

    var W = 360, H = like ? 196 : 214;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'fop-svg', role: 'img' }, el);
    svg.style.width = '100%'; svg.style.height = 'auto';

    function bar(y, den, fill, color, label) {
      var x0 = 58, bw = 270, ch = 26;
      T(svg, x0 - 8, y + 18, label, 'font-size:14px;font-weight:700;fill:' + color + ';text-anchor:end');
      var cells = [];
      for (var i = 0; i < den; i++) {
        var c = s('rect', { x: x0 + i * (bw / den), y: y, width: bw / den - 2, height: ch, rx: 4,
          fill: color, 'fill-opacity': i < fill ? 0.75 : 0.1,
          stroke: color, 'stroke-width': 1.4 }, svg);
        c.style.transition = 'fill-opacity .3s ease';
        cells.push(c);
      }
      return { cells: cells, den: den, fill: fill, color: color, y: y, x0: x0, bw: bw, ch: ch };
    }
    function fillBar(b, k) {
      b.cells.forEach(function (c, i) { c.setAttribute('fill-opacity', i < k ? 0.75 : 0.1); });
    }
    function T(parent, x, y, v, st) {
      var t = s('text', { x: x, y: y, style: st || 'font-size:13px' }, parent);
      t.textContent = v; return t;
    }
    function fracTxt(x, y, m, n, color) {
      var t = T(svg, x, y, m + '/' + n, 'font-size:15px;font-weight:700;fill:' + color + ';text-anchor:middle');
      return t;
    }

    var bA = bar(28, a[1], a[0], ORG, '');
    var labA = fracTxt(28, 46, a[0], a[1], ORG);
    var bB = bar(84, b[1], b[0], BLUE, '');
    fracTxt(28, 102, b[0], b[1], BLUE);
    var bR = bar(150, la, 0, GRN, '');
    var resTxt = fracTxt(28, 168, '?', la, GRN);
    var opT = T(svg, 180, 78, op === '+' ? '＋' : '−', 'font-size:20px;font-weight:700;fill:var(--text);text-anchor:middle');
    opT.setAttribute('y', 78);
    // 通分层（异分母时第 3 步重分第一幅图）
    var bA2 = like ? null : bar(28, la, na, ORG, '');

    var resetFn = function () {
      fillBar(bA, like ? 0 : a[0]); fillBar(bB, 0); fillBar(bR, 0);
      labA.textContent = a[0] + '/' + a[1];
      resTxt.textContent = '?/' + la;
      if (bA2) { bA2.cells.forEach(function (c) { c.setAttribute('fill-opacity', 0); }); }
    };
    if (!like) { bA2.cells.forEach(function (c) { c.setAttribute('fill-opacity', 0); }); }

    var STEPS = [];
    if (like) {
      STEPS = [
        { text: a[0] + '/' + a[1] + '：把整体平均分成 ' + a[1] + ' 份，取 ' + a[0] + ' 份。',
          run: function () { fillBar(bA, a[0]); } },
        { text: b[0] + '/' + b[1] + '：分数单位相同，也是 1/' + a[1] + '。',
          run: function () { fillBar(bB, b[0]); } },
        { text: '分数单位都是 1/' + a[1] + '，直接把分子' + (op === '+' ? '相加' : '相减') + '：' +
            a[0] + (op === '+' ? ' + ' : ' − ') + b[0] + ' = ' + res + '，得 <b>' + res + '/' + la + '</b>。',
          run: function () { fillBar(bR, res); resTxt.textContent = res + '/' + la; } }
      ];
      if (res && res !== la && g(res, la) === 1) {
        STEPS.push({ text: res + '/' + la + ' 已是最简。', run: function () {} });
      } else if (res && la % res === 0 && res !== la) {
        STEPS.push({ text: '结果可以约分：' + res + '/' + la + ' = <b>1/' + (la / res) + '</b>。',
          run: function () { resTxt.textContent = '1/' + (la / res); } });
      }
    } else {
      STEPS = [
        { text: a[0] + '/' + a[1] + '：' + a[1] + ' 份取 ' + a[0] + ' 份。', run: function () { fillBar(bA, a[0]); } },
        { text: b[0] + '/' + b[1] + '：分数单位不同（1/' + a[1] + ' 和 1/' + b[1] + '），<b>不能直接相加</b>。',
          run: function () { fillBar(bB, b[0]); } },
        { text: '先<b>通分</b>：用 ' + a[1] + ' 和 ' + b[1] + ' 的公倍数 ' + la + ' 作相同分母，' +
            a[0] + '/' + a[1] + ' = <b>' + na + '/' + la + '</b>。',
          run: function () {
            bA.cells.forEach(function (c) { c.setAttribute('fill-opacity', 0); });
            bA2.cells.forEach(function (c, i) { c.setAttribute('fill-opacity', i < na ? 0.75 : 0.1); });
            labA.textContent = na + '/' + la;
          } },
        { text: '通分后再' + (op === '+' ? '相加' : '相减') + '：' + na + '/' + la + (op === '+' ? ' + ' : ' − ') +
            nb + '/' + la + ' = <b>' + res + '/' + la + '</b>。',
          run: function () { fillBar(bR, res); resTxt.textContent = res + '/' + la; } }
      ];
    }

    var idx = 0;
    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () { idx = 0; resetFn(); return this; },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 体积与容积单位
   * 小正方体一层一层铺满长方体：每层几个 × 几层 = 体积，
   * 体积单位就是「一个这样的小正方体」。
   * ══════════════════════════════════════════════════════ */
  function volume(el, spec) {
    spec = spec || {};
    var w = spec.w || 4, d = spec.d || 2, h = spec.h || 2;
    var unit = spec.unit || '立方厘米';
    var W = 360, H = 240;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'vol-svg', role: 'img' }, el);
    svg.style.width = '100%'; svg.style.height = 'auto';
    var ORG = '#fbbf24', ORGD = '#b45309', BLUE = '#38bdf8';

    function T(parent, x, y, v, st) {
      var t = s('text', { x: x, y: y, style: st || 'font-size:13px' }, parent);
      t.textContent = v; return t;
    }
    var ex = { x: 19, y: 10 }, ey = { x: -19, y: 10 }, ez = { x: 0, y: -15 };
    function P(i, j, k) {
      return { x: i * ex.x + j * ey.x, y: i * ex.y + j * ey.y + k * ez.y };
    }
    function cube(g, i, j, k, visible) {
      var o = P(i, j, k);
      function poly(pts, fill, fo, stroke) {
        var p = s('polygon', { points: pts.map(function (q) { return q.x.toFixed(1) + ',' + q.y.toFixed(1); }).join(' '),
          fill: fill, 'fill-opacity': visible ? fo : 0, stroke: stroke || 'none', 'stroke-width': 1 }, g);
        p.style.transition = 'fill-opacity .3s ease';
        return p;
      }
      return {
        top: poly([P(i, j, k + 1), P(i + 1, j, k + 1), P(i + 1, j + 1, k + 1), P(i, j + 1, k + 1)], ORG, 0.75, ORGD),
        left: poly([P(i, j + 1, k), P(i + 1, j + 1, k), P(i + 1, j + 1, k + 1), P(i, j + 1, k + 1)], ORG, 0.45, ORGD),
        right: poly([P(i, j, k), P(i, j + 1, k), P(i, j + 1, k + 1), P(i, j, k + 1)], ORG, 0.28, ORGD)
      };
    }
    // 先算包围盒，再居中
    var all = [];
    for (var i = 0; i <= w; i++) for (var j = 0; j <= d; j++) for (var k = 0; k <= h; k++) all.push(P(i, j, k));
    var xs = all.map(function (p) { return p.x; }), ys = all.map(function (p) { return p.y; });
    var minx = Math.min.apply(null, xs), maxx = Math.max.apply(null, xs);
    var maxy = Math.max.apply(null, ys);
    var root = s('g', { transform: 'translate(' + ((W - (maxx - minx)) / 2 - minx).toFixed(1) + ',' +
      (206 - maxy).toFixed(1) + ')' }, svg);

    var cubes = [];
    for (var k2 = 0; k2 < h; k2++) {
      for (var s2 = 0; s2 <= w + d - 2; s2++) {
        for (var i3 = 0; i3 < w; i3++) {
          var j3 = s2 - i3;
          if (j3 < 0 || j3 >= d) continue;
          cubes.push(cube(root, i3, j3, k2, false));
        }
      }
    }
    var layerG = [];
    for (var L = 0; L < h; L++) layerG.push([]);
    cubes.forEach(function (c, idx) { layerG[Math.floor(idx / (w * d))].push(c); });
    function layerOn(k, on) {
      layerG[k].forEach(function (c) {
        c.top.setAttribute('fill-opacity', on ? 0.75 : 0);
        c.left.setAttribute('fill-opacity', on ? 0.45 : 0);
        c.right.setAttribute('fill-opacity', on ? 0.28 : 0);
      });
    }

    var counter = T(svg, 180, 228, '', 'font-size:13.5px;font-weight:600;text-anchor:middle');
    var STEPS = [];
    for (var L2 = 0; L2 < h; L2++) {
      STEPS.push({
        text: '铺第 <b>' + (L2 + 1) + '</b> 层：每层 <b>' + w + ' × ' + d + ' = ' + (w * d) + '</b> 个 1 ' + unit +
          ' 的小正方体。',
        run: (function (kk) { return function () { layerOn(kk, true); }; })(L2)
      });
    }
    STEPS.push({
      text: '一共 ' + h + ' 层，体积 = 每层 ' + (w * d) + ' × ' + h + ' 层 = <b>' + (w * d * h) + ' ' + unit +
        '</b>。体积单位就是「一个这样的小正方体」。',
      run: function () { counter.textContent = w + ' × ' + d + ' × ' + h + ' = ' + (w * d * h) + ' ' + unit; }
    });
    var idx = 0;
    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () {
        idx = 0;
        layerG.forEach(function (_, k) { layerOn(k, false); });
        counter.textContent = '';
        return this;
      },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 位置（数对）
   * 竖排是列，横排是行；先列后行，(列,行) 就是数对。
   * 点格子可以直接报出它的数对。
   * ══════════════════════════════════════════════════════ */
  function pairs(el, spec) {
    spec = spec || {};
    var cols = spec.cols || 6, rows = spec.rows || 5;
    var items = spec.items || [];
    var W = 360, H = 240, x0 = 46, y0 = 40, cw = (W - x0 - 16) / cols, ch = (H - y0 - 34) / rows;
    var BLUE = '#38bdf8', ORG = '#fbbf24';
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'prs-svg', role: 'img' }, el);
    svg.style.width = '100%'; svg.style.height = 'auto';

    for (var c = 0; c < cols; c++) {
      var t = s('text', { x: x0 + c * cw + cw / 2, y: y0 - 8, 'text-anchor': 'middle',
        style: 'font-size:11.5px;fill:var(--dim)' }, svg);
      t.textContent = '第' + (c + 1) + '列';
    }
    for (var r = 0; r < rows; r++) {
      var t2 = s('text', { x: x0 - 8, y: y0 + r * ch + ch / 2 + 4, 'text-anchor': 'end',
        style: 'font-size:11.5px;fill:var(--dim)' }, svg);
      t2.textContent = '第' + (r + 1) + '行';
    }
    for (var cc = 0; cc < cols; cc++) {
      for (var rr = 0; rr < rows; rr++) {
        s('rect', { x: x0 + cc * cw, y: y0 + rr * ch, width: cw - 2, height: ch - 2, rx: 4,
          fill: 'rgba(56,189,248,.05)', stroke: 'var(--line)', 'stroke-width': 1 }, svg);
      }
    }
    function cellXY(c, r) { return { x: x0 + (c - 1) * cw + cw / 2, y: y0 + (r - 1) * ch + ch / 2 }; }
    var markers = [];
    items.forEach(function (it) {
      var p = cellXY(it.c, it.r);
      s('circle', { cx: p.x, cy: p.y, r: 12, fill: ORG, 'fill-opacity': 0.85, stroke: '#b45309', 'stroke-width': 1.5 }, svg);
      var t = s('text', { x: p.x, y: p.y + 4, 'text-anchor': 'middle', style: 'font-size:10px;font-weight:700;fill:#5d3f00' }, svg);
      t.textContent = it.name;
    });
    var mk = s('circle', { r: 8, fill: 'none', stroke: BLUE, 'stroke-width': 3 }, svg);
    mk.style.opacity = 0; mk.style.transition = 'opacity .3s ease';
    var readout = s('text', { x: W / 2, y: H - 8, 'text-anchor': 'middle',
      style: 'font-size:13.5px;font-weight:600' }, svg);
    readout.textContent = '';
    var colLine = s('line', { stroke: BLUE, 'stroke-width': 2, 'stroke-dasharray': '4 3' }, svg);
    var rowLine = s('line', { stroke: '#4ade80', 'stroke-width': 2, 'stroke-dasharray': '4 3' }, svg);
    colLine.style.opacity = 0; rowLine.style.opacity = 0;

    function mark(c, r, label) {
      var p = cellXY(c, r);
      mk.setAttribute('cx', p.x); mk.setAttribute('cy', p.y); mk.style.opacity = 1;
      colLine.setAttribute('x1', p.x); colLine.setAttribute('y1', y0 - 2);
      colLine.setAttribute('x2', p.x); colLine.setAttribute('y2', y0 + rows * ch);
      rowLine.setAttribute('x1', x0 - 2); rowLine.setAttribute('y1', p.y);
      rowLine.setAttribute('x2', x0 + cols * cw); rowLine.setAttribute('y2', p.y);
      readout.textContent = label || ('数对 (' + c + ',' + r + ')：第 ' + c + ' 列，第 ' + r + ' 行');
    }
    svg.addEventListener('pointerdown', function (ev) {
      var r = svg.getBoundingClientRect();
      var sx = (ev.clientX - r.left) / r.width * W, sy = (ev.clientY - r.top) / r.height * H;
      var c = Math.floor((sx - x0) / cw) + 1, rr = Math.floor((sy - y0) / ch) + 1;
      if (c < 1 || c > cols || rr < 1 || rr > rows) return;
      colLine.style.opacity = 1; rowLine.style.opacity = 1; mk.style.opacity = 1;
      mark(c, rr);
    });

    var m = spec.mark || [2, 3];
    var STEPS = [
      { text: '竖排叫<b>列</b>，从左往右数：第 1 列、第 2 列……',
        run: function () { colLine.style.opacity = 1; mark(m[0], m[1], ''); readout.textContent = '第 ' + m[0] + ' 列'; } },
      { text: '横排叫<b>行</b>，从前往后数：第 1 行、第 2 行……',
        run: function () { rowLine.style.opacity = 1; readout.textContent = '第 ' + m[0] + ' 列，第 ' + m[1] + ' 行'; } },
      { text: '先列后行，用数对表示就是 <b>(' + m[0] + ',' + m[1] + ')</b>。',
        run: function () { mark(m[0], m[1]); } },
      { text: '点图上任意一格，都能报出它的数对——位置和数对一一对应。', run: function () {} }
    ];
    var idx = 0;
    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () {
        idx = 0;
        mk.style.opacity = 0; colLine.style.opacity = 0; rowLine.style.opacity = 0;
        readout.textContent = '';
        return this;
      },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 植树问题
   * 棵数和间隔数的关系只差「两端栽不栽」：
   * 两端都栽 +1，只栽一端相等，两端都不栽 -1。
   * ══════════════════════════════════════════════════════ */
  function treePlant(el, spec) {
    spec = spec || {};
    var gaps = spec.gaps || 6, mode = spec.mode || 'both';
    var W = 360, H = 170;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'tre-svg', role: 'img' }, el);
    svg.style.width = '100%'; svg.style.height = 'auto';
    var GRN = '#4ade80';

    var wrap2 = h('div', 'fm-ctl');
    el.insertBefore(wrap2, svg);
    wrap2.appendChild(h('span', null, '间隔数'));
    var rg = document.createElement('input');
    rg.type = 'range'; rg.min = '2'; rg.max = '10'; rg.step = '1'; rg.value = String(gaps);
    rg.setAttribute('aria-label', '间隔数');
    wrap2.appendChild(rg);
    var vG = h('b', null, gaps + ' 个间隔'); wrap2.appendChild(vG);
    ['both', 'one', 'none'].forEach(function (md, i) {
      var b = h('button', 'sel' + (md === mode ? ' on' : ''), ['两端都栽', '只栽一端', '两端都不栽'][i]);
      b.type = 'button';
      b.onclick = function () {
        [].forEach.call(wrap2.querySelectorAll('button'), function (x) { x.classList.remove('on'); });
        b.classList.add('on'); mode = md; draw();
        var r = ctrl.next();
        if (r) tip.innerHTML = r.text;
      };
      wrap2.appendChild(b);
    });
    var tip = h('div', 'muted', '');
    el.appendChild(tip);

    var roadY = 96;
    function draw() {
      [].slice.call(svg.childNodes).forEach(function (c) { svg.removeChild(c); });
      var x0 = 34, x1 = W - 34;
      s('line', { x1: x0, y1: roadY, x2: x1, y2: roadY, stroke: 'var(--dim)', 'stroke-width': 3 }, svg);
      var step = (x1 - x0) / gaps;
      var n = mode === 'both' ? gaps + 1 : mode === 'one' ? gaps : gaps - 1;
      for (var i = 0; i <= gaps; i++) {
        var x = x0 + i * step;
        var isTree = mode === 'both' ? true : mode === 'one' ? i < gaps : (i > 0 && i < gaps);
        if (isTree) {
          s('circle', { cx: x, cy: roadY - 14, r: 10, fill: GRN, 'fill-opacity': 0.85, stroke: '#15803d', 'stroke-width': 1.6 }, svg);
          s('rect', { x: x - 1.5, y: roadY - 6, width: 3, height: 8, fill: '#92400e' }, svg);
        } else {
          s('circle', { cx: x, cy: roadY - 14, r: 5, fill: 'transparent', stroke: 'var(--dim)', 'stroke-width': 1.5, 'stroke-dasharray': '3 2' }, svg);
        }
        if (i < gaps) {
          var t = s('text', { x: x + step / 2, y: roadY + 20, 'text-anchor': 'middle', style: 'font-size:10.5px;fill:var(--dim)' }, svg);
          t.textContent = (i + 1);
        }
      }
      var label = mode === 'both' ? '两端都栽：棵数 = 间隔数 + 1'
        : mode === 'one' ? '只栽一端：棵数 = 间隔数'
        : '两端都不栽：棵数 = 间隔数 − 1';
      var n2 = mode === 'both' ? gaps + 1 : mode === 'one' ? gaps : gaps - 1;
      var t3 = s('text', { x: W / 2, y: 34, 'text-anchor': 'middle',
        style: 'font-size:14px;font-weight:700;fill:var(--text)' }, svg);
      t3.textContent = label + ' = ' + n2 + ' 棵';
      return n2;
    }
    draw();
    rg.oninput = function () {
      gaps = +this.value; vG.textContent = gaps + ' 个间隔';
      draw();
      tip.textContent = '现在是 ' + gaps + ' 个间隔：' +
        (mode === 'both' ? '两端都栽 ' + (gaps + 1) + ' 棵' : mode === 'one' ? '只栽一端 ' + gaps + ' 棵' : '两端都不栽 ' + (gaps - 1) + ' 棵') + '。';
    };

    var STEPS = [
      { text: '<b>两端都栽</b>：4 个间隔，头尾都有一棵，棵数 = 间隔数 + 1 = 5。',
        run: function () { mode = 'both'; draw(); } },
      { text: '<b>只栽一端</b>：一端不栽，正好一树对一隔，棵数 = 间隔数 = 4。',
        run: function () { mode = 'one'; draw(); } },
      { text: '<b>两端都不栽</b>：两头各少一棵，棵数 = 间隔数 − 1 = 3。',
        run: function () { mode = 'none'; draw(); } },
      { text: '记住三种情况的差就是 ±1——拖动间隔数验证，规律不变。', run: function () {} }
    ];
    var idx = 0;
    var ctrl = {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () { idx = 0; mode = 'both'; gaps = spec.gaps || 6; rg.value = String(gaps); vG.textContent = gaps + ' 个间隔'; draw(); return this; },
      reset: function () { return this.startDemo(); }
    };
    return ctrl;
  }

  /* ══════════════════════════════════════════════════════
   * 轴对称
   * 对称点到对称轴的距离相等。拖左边的点，右边出现它的
   * 对称点；再把右半边逐点补全，图形就完整了。
   * ══════════════════════════════════════════════════════ */
  function symmetry(el, spec) {
    spec = spec || {};
    var W = 360, H = 240, ax = W / 2;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'sym-svg', role: 'img' }, el);
    svg.style.width = '100%'; svg.style.height = 'auto';
    var BLUE = '#38bdf8', GRN = '#4ade80', ORG = '#fbbf24';

    for (var gx = 0; gx <= W; gx += 20) s('line', { x1: gx, y1: 0, x2: gx, y2: H, stroke: 'var(--line)', 'stroke-width': 0.7 }, svg);
    for (var gy = 0; gy <= H; gy += 20) s('line', { x1: 0, y1: gy, x2: W, y2: gy, stroke: 'var(--line)', 'stroke-width': 0.7 }, svg);
    s('line', { x1: ax, y1: 0, x2: ax, y2: H, stroke: 'var(--accent)', 'stroke-width': 2.4, 'stroke-dasharray': '6 4' }, svg);
    var axT = s('text', { x: ax + 6, y: 14, style: 'font-size:11.5px;fill:var(--accent)' }, svg);
    axT.textContent = '对称轴';

    // 左半边：小房子
    var pts = [[ax - 78, 196], [ax - 78, 128], [ax - 40, 92], [ax - 8, 128], [ax - 8, 196]];
    function pl(points, color, dash) {
      return s('polyline', { points: points.map(function (p) { return p[0] + ',' + p[1]; }).join(' '),
        fill: 'none', stroke: color, 'stroke-width': 2.6, 'stroke-linejoin': 'round',
        'stroke-linecap': 'round', 'stroke-dasharray': dash || '' }, svg);
    }
    pl(pts, BLUE);
    var right = pts.slice().reverse().map(function (p) { return [2 * ax - p[0], p[1]]; });
    var rightSegs = [];
    for (var i = 0; i < right.length - 1; i++) {
      var seg = pl([right[i], right[i + 1]], GRN);
      seg.style.opacity = 0; seg.style.transition = 'opacity .35s ease';
      rightSegs.push(seg);
    }
    // 对称点演示：可拖的点
    var P = { x: ax - 58, y: 150 };
    var dotL = s('circle', { cx: P.x, cy: P.y, r: 6, fill: ORG, stroke: '#b45309', 'stroke-width': 1.5, style: 'cursor:pointer' }, svg);
    var dotR = s('circle', { r: 6, fill: 'none', stroke: ORG, 'stroke-width': 2, 'stroke-dasharray': '3 2' }, svg);
    dotR.style.opacity = 0;
    var link = s('line', { stroke: ORG, 'stroke-width': 1.6, 'stroke-dasharray': '4 3' }, svg);
    link.style.opacity = 0;
    var dL = s('text', { style: 'font-size:11px;fill:' + ORG }, svg);
    var dR = s('text', { style: 'font-size:11px;fill:' + ORG }, svg);
    function upd() {
      dotL.setAttribute('cx', P.x); dotL.setAttribute('cy', P.y);
      dotR.setAttribute('cx', 2 * ax - P.x); dotR.setAttribute('cy', P.y);
      link.setAttribute('x1', P.x); link.setAttribute('y1', P.y);
      link.setAttribute('x2', 2 * ax - P.x); link.setAttribute('y2', P.y);
      dL.setAttribute('x', (P.x + ax) / 2); dL.setAttribute('y', P.y - 8);
      dL.textContent = Math.round(ax - P.x) + '格';
      dR.setAttribute('x', (2 * ax - P.x + ax) / 2); dR.setAttribute('y', P.y - 8);
      dR.textContent = Math.round(ax - P.x) + '格';
    }
    upd();
    var dragging = false;
    svg.addEventListener('pointerdown', function (ev) {
      var r = svg.getBoundingClientRect();
      var sx = (ev.clientX - r.left) / r.width * W, sy = (ev.clientY - r.top) / r.height * H;
      if (Math.hypot(sx - P.x, sy - P.y) < 22) { dragging = true; svg.setPointerCapture && svg.setPointerCapture(ev.pointerId); }
    });
    svg.addEventListener('pointermove', function (ev) {
      if (!dragging) return; ev.preventDefault();
      var r = svg.getBoundingClientRect();
      P.x = Math.max(16, Math.min(ax - 10, (ev.clientX - r.left) / r.width * W));
      P.y = Math.max(30, Math.min(H - 12, (ev.clientY - r.top) / r.height * H));
      upd();
    });
    window.addEventListener('pointerup', function () { dragging = false; });

    var STEPS = [
      { text: '左边有半个图形，右边还空着。先看关键一句：对称点到对称轴的距离<b>相等</b>。',
        run: function () { dotR.style.opacity = 1; link.style.opacity = 1; dL.style.opacity = 1; dR.style.opacity = 1; } },
      { text: '橙色的点可以<b>拖</b>：拖到哪，右边的对称点就到哪，两边距离始终相等。',
        run: function () {} },
      { text: '用这个办法把右半边逐点补出来……',
        run: function () { rightSegs.forEach(function (s3, i) { setTimeout(function () { s3.style.opacity = 1; }, i * 180); }); } },
      { text: '补全了！左右沿对称轴对折正好重合——这就是<b>轴对称图形</b>。', run: function () {} }
    ];
    var idx = 0;
    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () {
        idx = 0;
        rightSegs.forEach(function (s3) { s3.style.opacity = 0; });
        dotR.style.opacity = 0; link.style.opacity = 0; dL.style.opacity = 0; dR.style.opacity = 0;
        return this;
      },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 约分与通分（分数基本性质）
   * 把分数条「重分」：同除一个数变小份 = 约分，
   * 同乘一个数变大份 = 通分；涂色部分始终一样大。
   * ══════════════════════════════════════════════════════ */
  function fracReduce(el, spec) {
    spec = spec || {};
    var mode = spec.mode || 'reduce';
    var ORG = '#fbbf24', BLUE = '#38bdf8';
    var W = 360, H = 150;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'frd-svg', role: 'img' }, el);
    svg.style.width = '100%'; svg.style.height = 'auto';
    var barG = s('g', null, svg);
    var lab = T(svg, 180, 28, '', 'font-size:17px;font-weight:700;fill:var(--text);text-anchor:middle');
    var note = T(svg, 180, 140, '', 'font-size:12.5px;fill:var(--dim);text-anchor:middle');
    function drawBar(den, fill, color) {
      [].slice.call(barG.childNodes).forEach(function (c) { barG.removeChild(c); });
      var x0 = 30, bw = 300, ch = 46, y = 46;
      for (var i = 0; i < den; i++) {
        s('rect', { x: x0 + i * (bw / den), y: y, width: bw / den - 2, height: ch, rx: 4,
          fill: color, 'fill-opacity': i < fill ? 0.75 : 0.1, stroke: color, 'stroke-width': 1.4 }, barG);
      }
      lab.textContent = fill + '/' + den;
    }
    var STEPS = [], resetFn;
    if (mode === 'prop') {
      resetFn = function () { drawBar(2, 1, BLUE); note.textContent = ''; };
      STEPS = [
        { text: '1/2：把整体平均分成 2 份，取 1 份。',
          run: function () { drawBar(2, 1, BLUE); } },
        { text: '分子分母<b>同乘 2</b> → 2/4：重分成 4 份，涂 2 份，涂色部分<b>大小不变</b>。',
          run: function () { drawBar(4, 2, BLUE); note.textContent = '1/2 = 2/4'; } },
        { text: '再同乘 2 → 4/8：还是那么大。',
          run: function () { drawBar(8, 4, BLUE); note.textContent = '1/2 = 2/4 = 4/8'; } },
        { text: '这就是<b>分数的基本性质</b>：分子分母同乘或同除以同一个数（0 除外），大小不变——它是约分和通分的依据。',
          run: function () {} }
      ];
    } else {
      resetFn = function () { drawBar(18, 12, ORG); note.textContent = ''; };
      STEPS = [
        { text: '12/18：分子 12、分母 18 有公因数，<b>能约分</b>。先同除以 2。',
          run: function () { drawBar(18, 12, ORG); note.textContent = ''; } },
        { text: '分子分母<b>同除以 2</b> → 6/9：重分成 9 份涂 6 份，涂色部分大小不变。',
          run: function () { drawBar(9, 6, ORG); note.textContent = '12÷2=6，18÷2=9'; } },
        { text: '6 和 9 还有公因数 3，再<b>同除以 3</b> → 2/3。',
          run: function () { drawBar(3, 2, ORG); note.textContent = '6÷3=2，9÷3=3'; } },
        { text: '<b>2/3</b> 的分子分母只有公因数 1，已经<b>最简</b>——约分就是一直除到最简为止。',
          run: function () {} }
      ];
    }
    if (mode === 'prop') drawBar(2, 1, BLUE); else drawBar(18, 12, ORG);
    var idx = 0;
    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () { idx = 0; resetFn(); return this; },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 可能性：转盘
   * 真随机。每点一次演示就转一次并记账；转的次数多了，
   * 各色出现的频率会靠近它占的区域大小。
   * ══════════════════════════════════════════════════════ */
  function spinner(el, spec) {
    spec = spec || {};
    var W = 360, H = 240, cx = 180, cy = 104, R = 84;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'spn-svg', role: 'img' }, el);
    svg.style.width = '100%'; svg.style.height = 'auto';
    var defs = [
      { name: '黄', color: '#fbbf24', n: 2 },
      { name: '蓝', color: '#38bdf8', n: 1 },
      { name: '红', color: '#f87171', n: 1 }
    ];
    var slices = [], ang = 0;
    defs.forEach(function (d) {
      for (var i = 0; i < d.n; i++) {
        slices.push({ name: d.name, color: d.color, a0: ang, a1: ang + 360 / 4 });
        ang += 360 / 4;
      }
    });
    var wheel = s('g', null, svg);
    slices.forEach(function (sl) {
      var pts = [cx + ',' + cy], N = 26;
      for (var i = 0; i <= N; i++) {
        var t = (sl.a0 + (sl.a1 - sl.a0) * i / N) * Math.PI / 180;
        pts.push((cx + R * Math.cos(t)).toFixed(1) + ',' + (cy - R * Math.sin(t)).toFixed(1));
      }
      s('path', { d: 'M' + pts.join(' L') + ' Z', fill: sl.color, 'fill-opacity': 0.75,
        stroke: 'var(--bg)', 'stroke-width': 2 }, wheel);
      var mid = (sl.a0 + sl.a1) / 2 * Math.PI / 180;
      var t = T(wheel, cx + R * 0.62 * Math.cos(mid), cy - R * 0.62 * Math.sin(mid) + 5, sl.name,
        'font-size:15px;font-weight:700;fill:#5d3f00;text-anchor:middle');
    });
    s('circle', { cx: cx, cy: cy, r: 7, fill: 'var(--text)' }, wheel);
    s('polygon', { points: cx + ',' + (cy - R - 14) + ' ' + (cx - 9) + ',' + (cy - R - 34) + ' ' + (cx + 9) + ',' + (cy - R - 34),
      fill: 'var(--text)' }, svg);
    var tally = { '黄': 0, '蓝': 0, '红': 0 }, spins = 0, MAX = 12;
    var keys = ['黄', '蓝', '红'];
    var chips = keys.map(function (k, i) {
      var g = T(svg, 70 + i * 110, 226, '', 'font-size:13px;font-weight:600;text-anchor:middle');
      g.setAttribute('fill', defs[i].color);
      return g;
    });
    function drawTally() {
      chips.forEach(function (c, i) { c.textContent = keys[i] + ' ' + tally[keys[i]] + ' 次'; });
    }
    drawTally();
    function spin() {
      var psi = Math.random() * 360;
      var sl = slices.filter(function (x) { return psi >= x.a0 && psi < x.a1; })[0] || slices[0];
      var theta = psi - 90 + 1080;
      wheel.style.transition = 'transform .7s ease';
      wheel.setAttribute('transform', 'rotate(' + theta.toFixed(1) + ' ' + cx + ' ' + cy + ')');
      tally[sl.name]++; spins++;
      drawTally();
      return sl.name;
    }
    var idx = 0;
    return {
      el: svg,
      next: function () {
        if (idx >= MAX) return null;
        var res = spin();
        idx++;
        var txt = '第 <b>' + spins + '</b> 次转到 <b>' + res + '</b>。目前：黄 ' + tally['黄'] +
          '、蓝 ' + tally['蓝'] + '、红 ' + tally['红'] + '。';
        if (idx >= MAX) {
          txt += ' 转多了就看得出来：黄占的区域有一半，转到的次数也差不多是一半——<b>区域越大，可能性越大</b>。';
        }
        return { text: txt, done: idx >= MAX };
      },
      startDemo: function () {
        idx = 0; spins = 0;
        tally = { '黄': 0, '蓝': 0, '红': 0 };
        drawTally();
        wheel.style.transition = 'transform .3s ease';
        wheel.setAttribute('transform', 'rotate(0 ' + cx + ' ' + cy + ')');
        return this;
      },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 小数乘法：先按整数算，再点小数点
   * 两个因数一共有几位小数，积就从右起数出几位。
   * ══════════════════════════════════════════════════════ */
  function decMult(el, spec) {
    spec = spec || {};
    var a = spec.a || '1.2', b = spec.b || '0.8';
    var W = 360, H = 200;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'dcm-svg', role: 'img' }, el);
    svg.style.width = '100%'; svg.style.height = 'auto';
    var ORG = '#fbbf24', GRN = '#4ade80', BLUE = '#38bdf8';
    function decOf(x) { return (String(x).split('.')[1] || '').length; }
    var da = decOf(a), dbv = decOf(b), total = da + dbv;
    var ia = Number(String(a).replace('.', '')), ib = Number(String(b).replace('.', ''));
    var ip = ia * ib;
    var fin = (ip / Math.pow(10, total)).toFixed(total);

    var xr = 262;
    var t1 = T(svg, xr, 46, a, 'font-size:24px;font-weight:700;fill:var(--text);text-anchor:end');
    var t2 = T(svg, 120, 78, '×', 'font-size:24px;font-weight:700;fill:var(--text);text-anchor:end');
    var t3 = T(svg, xr, 78, b, 'font-size:24px;font-weight:700;fill:var(--text);text-anchor:end');
    s('line', { x1: 140, y1: 92, x2: xr + 12, y2: 92, class: 'dbar' }, svg);
    var tInt = T(svg, xr, 124, String(ip), 'font-size:24px;font-weight:700;fill:var(--dim);text-anchor:end');
    tInt.style.opacity = 0; tInt.style.transition = 'opacity .3s ease';
    var tFin = T(svg, xr, 124, fin, 'font-size:24px;font-weight:700;fill:' + GRN + ';text-anchor:end');
    tFin.style.opacity = 0; tFin.style.transition = 'opacity .35s ease';
    var cnt = T(svg, 180, 162, '', 'font-size:13.5px;font-weight:600;fill:' + BLUE + ';text-anchor:middle');
    var res = T(svg, 180, 188, '', 'font-size:14px;font-weight:700;fill:var(--text);text-anchor:middle');
    var STEPS = [
      { text: '先把小数<b>当成整数</b>算：' + String(a).replace('.', '') + ' × ' + String(b).replace('.', '') +
          ' = <b>' + ip + '</b>。',
        run: function () { tInt.style.opacity = 1; } },
      { text: '再看小数位：' + a + ' 有 <b>' + da + '</b> 位，' + b + ' 有 <b>' + dbv + '</b> 位，一共 <b>' + total +
          '</b> 位。',
        run: function () { cnt.textContent = '因数里共有 ' + total + ' 位小数（' + da + '+' + dbv + '）'; } },
      { text: '从 ' + ip + ' 的右边起数出 ' + total + ' 位，点上小数点 → <b>' + fin + '</b>。',
        run: function () { tInt.style.opacity = 0; tFin.style.opacity = 1; } },
      { text: '所以 ' + a + ' × ' + b + ' = <b>' + fin + '</b>。先按整数乘，再点小数点。',
        run: function () { res.textContent = a + ' × ' + b + ' = ' + fin; } }
    ];
    var idx = 0;
    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () {
        idx = 0;
        tInt.style.opacity = 0; tFin.style.opacity = 0;
        cnt.textContent = ''; res.textContent = '';
        return this;
      },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 小数除法：商不变
   * 除数是小数，把它变成整数，被除数同步扩大——
   * 商不变，剩下的就是熟悉的整数除法。
   * ══════════════════════════════════════════════════════ */
  function decDiv(el, spec) {
    spec = spec || {};
    var a = spec.a || '5.6', b = spec.b || '0.8';
    var W = 360, H = 210;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'dcd-svg', role: 'img' }, el);
    svg.style.width = '100%'; svg.style.height = 'auto';
    var GRN = '#4ade80', BLUE = '#38bdf8';
    function decOf(x) { return (String(x).split('.')[1] || '').length; }
    var f = Math.pow(10, decOf(b));
    var A = Math.round(parseFloat(a) * f * 1e6) / 1e6;
    var B = Math.round(parseFloat(b) * f);
    var q = Math.round((parseFloat(a) / parseFloat(b)) * 1e6) / 1e6;

    var tB = T(svg, 180, 56, a + ' ÷ ' + b, 'font-size:24px;font-weight:700;fill:var(--text);text-anchor:middle');
    var arrA = T(svg, 96, 92, '', 'font-size:13px;font-weight:600;fill:' + BLUE + ';text-anchor:middle');
    var arrB = T(svg, 264, 92, '', 'font-size:13px;font-weight:600;fill:' + BLUE + ';text-anchor:middle');
    var tA = T(svg, 180, 126, '', 'font-size:24px;font-weight:700;fill:var(--text);text-anchor:middle');
    tA.style.opacity = 0; tA.style.transition = 'opacity .35s ease';
    var tR = T(svg, 180, 172, '', 'font-size:20px;font-weight:700;fill:' + GRN + ';text-anchor:middle');
    tR.style.opacity = 0; tR.style.transition = 'opacity .35s ease';
    var note = T(svg, 180, 200, '', 'font-size:12.5px;fill:var(--dim);text-anchor:middle');
    var STEPS = [
      { text: '除数 <b>' + b + '</b> 是小数，不能直接除——用<b>商不变</b>的性质把它变整数。',
        run: function () {} },
      { text: '除数 ' + b + ' 扩大到 10 倍变 <b>' + B + '</b>；被除数也要同时扩大 10 倍变 <b>' + A + '</b>。',
        run: function () {
          arrA.textContent = '×' + f + ' ↓'; arrB.textContent = '×' + f + ' ↓';
          tA.textContent = A + ' ÷ ' + B; tA.style.opacity = 1;
        } },
      { text: '变成 <b>' + A + ' ÷ ' + B + '</b>——这就是熟悉的整数除法。',
        run: function () {} },
      { text: A + ' ÷ ' + B + ' = <b>' + q + '</b>，所以 ' + a + ' ÷ ' + b + ' = <b>' + q + '</b>。',
        run: function () { tR.textContent = a + ' ÷ ' + b + ' = ' + q; tR.style.opacity = 1;
          note.textContent = '被除数、除数同时扩大，商不变'; } }
    ];
    var idx = 0;
    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () {
        idx = 0;
        arrA.textContent = ''; arrB.textContent = '';
        tA.style.opacity = 0; tR.style.opacity = 0; note.textContent = '';
        return this;
      },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 分数与除法
   * 为什么单独做：a÷b=a/b 是一次「抽象跳」，孩子背得出对应关系却讲不出道理。
   * 让 3 块饼真的被切开、12 小份真的被分掉，分子分母就各有了来历。
   * ══════════════════════════════════════════════════════ */
  function fracDiv(el, spec) {
    spec = spec || {};
    var pies = spec.pies || 3;
    var people = spec.people || 4;
    var W = 360, H = 250;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'fdv-svg', role: 'img' }, el);
    var RED = '#f87171', BLUE = '#38bdf8', GRN = '#4ade80', ORG = '#fbbf24';
    var PCOL = [RED, BLUE, GRN, ORG];
    var CAKE = '#fcd34d', EDGE = 'var(--dim)';
    var R = 24;
    var total = pies * people;

    // 顶部标题算式
    T(svg, 180, 22, pies + ' 块饼 ÷ ' + people + ' 人 = ?', 'font-size:15px;font-weight:700;fill:var(--text);text-anchor:middle');

    // 饼：上排
    var pieXs = [];
    var gap = W / (pies + 1);
    for (var p = 0; p < pies; p++) pieXs.push(gap * (p + 1));
    var pieY = 56;
    var pieGroups = [];
    for (p = 0; p < pies; p++) {
      var g = s('g', {}, svg);
      var cx = pieXs[p];
      s('circle', { cx: cx, cy: pieY, r: R, fill: CAKE, stroke: EDGE, 'stroke-width': 1.2 }, g);
      var sectors = [];
      for (var i = 0; i < people; i++) {
        var a0 = -Math.PI / 2 + (i * 2 * Math.PI) / people;
        var a1 = -Math.PI / 2 + ((i + 1) * 2 * Math.PI) / people;
        var x0 = cx + R * Math.cos(a0), y0 = pieY + R * Math.sin(a0);
        var x1 = cx + R * Math.cos(a1), y1 = pieY + R * Math.sin(a1);
        var path = s('path', {
          d: 'M' + cx + ' ' + pieY + ' L' + x0.toFixed(1) + ' ' + y0.toFixed(1) +
             ' A' + R + ' ' + R + ' 0 0 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' Z',
          fill: 'transparent', stroke: EDGE, 'stroke-width': 0.8
        }, g);
        path.style.opacity = 0;
        sectors.push(path);
      }
      pieGroups.push({ g: g, sectors: sectors });
    }

    // 盘子：下排
    var plateY = 178, plateW = Math.min(56, (W - 40) / people - 8);
    var plateXs = [];
    var pgap = W / (people + 1);
    for (i = 0; i < people; i++) plateXs.push(pgap * (i + 1));
    var plateGroups = [];
    for (i = 0; i < people; i++) {
      var pg = s('g', {}, svg);
      pg.style.opacity = 0; pg.style.transition = 'opacity .4s ease';
      s('rect', { x: plateXs[i] - plateW / 2, y: plateY - 14, width: plateW, height: 30, rx: 6,
        fill: 'var(--card)', stroke: PCOL[i], 'stroke-width': 1.5 }, pg);
      plateGroups.push(pg);
    }
    var plateLbl = T(svg, 180, 214, '', 'font-size:12px;fill:var(--dim);text-anchor:middle');

    // 底部结论
    var eq = T(svg, 180, 240, '', 'font-size:17px;font-weight:700;fill:var(--text);text-anchor:middle');
    eq.style.opacity = 0; eq.style.transition = 'opacity .35s ease';

    // 给第 i 个人的饼片上色（每块饼的第 i 份）
    function colorFor(i) {
      for (var j = 0; j < pies; j++) {
        var sec = pieGroups[j].sectors[i];
        sec.setAttribute('fill', PCOL[i]);
        sec.setAttribute('fill-opacity', 0.85);
      }
    }
    function fillPlate(idx, parts) {
      var pg = plateGroups[idx];
      pg.style.opacity = 1;
      var n = parts.length; // 每小片角度
      var pr = 11, cx = plateXs[idx], cy = plateY + 1;
      for (var k = 0; k < n; k++) {
        var a0 = -Math.PI / 2 + (k * 2 * Math.PI) / n;
        var a1 = -Math.PI / 2 + ((k + 1) * 2 * Math.PI) / n;
        s('path', {
          d: 'M' + cx + ' ' + cy + ' L' + (cx + pr * Math.cos(a0)).toFixed(1) + ' ' + (cy + pr * Math.sin(a0)).toFixed(1) +
             ' A' + pr + ' ' + pr + ' 0 0 1 ' + (cx + pr * Math.cos(a1)).toFixed(1) + ' ' + (cy + pr * Math.sin(a1)).toFixed(1) + ' Z',
          fill: PCOL[idx], 'fill-opacity': 0.85, stroke: EDGE, 'stroke-width': 0.5
        }, pg);
      }
    }
    function wholePlate(idx) {
      // 1 整块 + 1 小份（带分数用）
      var pg = plateGroups[idx];
      pg.style.opacity = 1;
      var cx = plateXs[idx] - 10, cy = plateY + 1;
      s('circle', { cx: cx, cy: cy, r: 11, fill: PCOL[idx], 'fill-opacity': 0.85, stroke: EDGE, 'stroke-width': 0.6 }, pg);
      var cx2 = plateXs[idx] + 12, pr = 11;
      s('path', {
        d: 'M' + cx2 + ' ' + cy + ' L' + cx2 + ' ' + (cy - pr) +
           ' A' + pr + ' ' + pr + ' 0 0 1 ' + (cx2 + pr) + ' ' + cy + ' Z',
        fill: PCOL[idx], 'fill-opacity': 0.85, stroke: EDGE, 'stroke-width': 0.5
      }, pg);
    }

    var frac = function (a, b) { return a + '/' + b; };
    var improper = pies > people;
    var STEPS;
    if (!improper) {
      STEPS = [
        { text: '<b>' + pies + ' 块饼平均分给 ' + people + ' 个人</b>，每人分到几块？每人不到 1 块，得用分数说话。', run: function () {} },
        { text: '把每块饼平均切成 ' + people + ' 份：' + pies + '×' + people + '=' + total + ' 小份，每份是 <b>1/' + people + '</b> 块。',
          run: function () { pieGroups.forEach(function (pg) { pg.sectors.forEach(function (sc) { sc.style.opacity = 1; }); }); } },
        { text: total + ' 小份平均分给 ' + people + ' 人：每人拿 <b>' + pies + '</b> 小份，也就是 ' + pies + ' 个 1/' + people + ' 块。',
          run: function () {
            for (var i2 = 0; i2 < people; i2++) { colorFor(i2); fillPlate(i2, new Array(pies)); }
            plateLbl.textContent = '每人 ' + pies + ' 小份，颜色相同';
          } },
        { text: pies + ' 个 1/' + people + ' 块是 <b>' + frac(pies, people) + '</b> 块：<b>' + pies + ' ÷ ' + people + ' = ' + frac(pies, people) + '</b>。被除数是分子，除数是分母，除号变分数线。',
          run: function () { eq.textContent = pies + ' ÷ ' + people + ' = ' + frac(pies, people) + '（块）'; eq.style.opacity = 1; } }
      ];
    } else {
      STEPS = [
        { text: '<b>' + pies + ' 块饼平均分给 ' + people + ' 个人</b>，每人分到几块？这次每人不止 1 块了。', run: function () {} },
        { text: '还是每块切 ' + people + ' 份：' + pies + '×' + people + '=' + total + ' 小份，每人 <b>' + pies + '</b> 小份，即 ' + pies + ' 个 1/' + people + ' 块。',
          run: function () { pieGroups.forEach(function (pg) { pg.sectors.forEach(function (sc) { sc.style.opacity = 1; }); }); } },
        { text: pies + ' 个 1/' + people + ' 块是 <b>' + frac(pies, people) + '</b> 块：<b>' + pies + ' ÷ ' + people + ' = ' + frac(pies, people) + '</b>。分子比分母大——这样的分数叫<b>假分数</b>。',
          run: function () {
            for (var i2 = 0; i2 < people; i2++) { colorFor(i2); fillPlate(i2, new Array(pies)); }
            plateLbl.textContent = '每人 ' + pies + ' 小份';
            eq.textContent = pies + ' ÷ ' + people + ' = ' + frac(pies, people) + '（块）'; eq.style.opacity = 1;
          } },
        { text: frac(pies, people) + ' 块 = ' + people + '/' + people + ' 块 + ' + (pies - people) + '/' + people + ' 块 = <b>1 又 ' + frac(pies - people, people) + '</b> 块。假分数都能化成<b>带分数</b>或整数。',
          run: function () {
            plateGroups.forEach(function (pg) { pg.style.opacity = 0; });
            plateLbl.textContent = '';
            wholePlate(0);
            plateLbl.textContent = '1 整块 + 1/' + people + ' 块';
            eq.textContent = frac(pies, people) + ' = 1 + ' + frac(pies - people, people) + ' = 1又' + frac(pies - people, people) + '（块）';
          } }
      ];
    }

    var idx = 0;
    function resetFn() {
      idx = 0;
      pieGroups.forEach(function (pg) { pg.sectors.forEach(function (sc) { sc.setAttribute('fill', 'transparent'); sc.setAttribute('fill-opacity', 1); sc.style.opacity = 0; }); });
      plateGroups.forEach(function (pg) { while (pg.firstChild) pg.removeChild(pg.firstChild); pg.style.opacity = 0; });
      plateLbl.textContent = '';
      eq.style.opacity = 0;
    }
    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () { resetFn(); return this; },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 找次品
   * 为什么单独做：光背「分三份」没有用，要让孩子看见
   * 每称一次天平就把嫌疑范围压到三分之一——优化策略是看得见的。
   * ══════════════════════════════════════════════════════ */
  function balance(el, spec) {
    spec = spec || {};
    var total = spec.total || 9;
    var W = 360, H = 250;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'bal-svg', role: 'img' }, el);
    var RED = '#f87171', BLUE = '#38bdf8', GRAY = 'var(--dim)', ORG = '#fbbf24';
    var per = Math.ceil(total / 3); // 3、3、3
    var BY = 34;                    // 待分球行 y
    var ballR = 9;

    var title = T(svg, 180, 20, total + ' 个球里有 1 个偏轻的次品', 'font-size:14px;font-weight:700;fill:var(--text);text-anchor:middle');

    // 天平：横梁 + 吊绳 + 两个盘
    var pivot = { x: 180, y: 108 };
    var beam = s('g', {}, svg);
    var beamBar = s('rect', { x: pivot.x - 118, y: pivot.y - 3, width: 236, height: 5, rx: 2, fill: 'var(--text)' }, beam);
    s('path', { d: 'M' + pivot.x + ' ' + (pivot.y + 2) + ' L' + (pivot.x - 10) + ' ' + (pivot.y + 26) + ' L' + (pivot.x + 10) + ' ' + (pivot.y + 26) + ' Z', fill: 'var(--text)' }, beam);
    function pan(x, color) {
      var g = s('g', {}, beam);
      s('line', { x1: x, y1: pivot.y, x2: x, y2: pivot.y + 34, stroke: 'var(--dim)', 'stroke-width': 1 }, g);
      s('path', { d: 'M' + (x - 30) + ' ' + (pivot.y + 44) + ' Q' + x + ' ' + (pivot.y + 58) + ' ' + (x + 30) + ' ' + (pivot.y + 44) + ' Z',
        fill: 'var(--card)', stroke: color, 'stroke-width': 1.5 }, g);
      return g;
    }
    var panL = pan(pivot.x - 104, BLUE);
    var panR = pan(pivot.x + 104, RED);

    // 待分球（顶部一行）
    var balls = [];
    var bx0 = 180 - ((total - 1) * 22) / 2;
    for (var i = 0; i < total; i++) {
      var c = s('circle', { cx: bx0 + i * 22, cy: BY, r: ballR, fill: 'var(--card)', stroke: GRAY, 'stroke-width': 1.2 }, svg);
      c.style.transition = 'all .4s ease';
      balls.push(c);
    }

    var note = T(svg, 180, 236, '', 'font-size:12.5px;font-weight:600;fill:var(--dim);text-anchor:middle');

    function moveBalls(list, x, y, color, star) {
      list.forEach(function (bi, k) {
        var c = balls[bi];
        c.setAttribute('cx', x + (k - (list.length - 1) / 2) * 22);
        c.setAttribute('cy', y);
        c.setAttribute('stroke', color);
        if (color !== GRAY) c.setAttribute('fill', color); else c.setAttribute('fill', 'var(--card)');
        c.setAttribute('fill-opacity', color === GRAY ? 0.35 : 0.9);
        if (star) { c.setAttribute('stroke', ORG); c.setAttribute('stroke-width', 2.5); }
      });
    }
    function tilt(deg) {
      beam.style.transformOrigin = pivot.x + 'px ' + pivot.y + 'px';
      beam.style.transition = 'transform .6s ease';
      beam.style.transform = 'rotate(' + deg + 'deg)';
    }

    var suspects = null;
    var STEPS = [
      { text: '<b>' + total + ' 个球里有 1 个次品（偏轻）</b>。天平没有砝码，至少称几次<b>一定</b>能把它找出来？', run: function () {} },
      { text: '诀窍是尽量平均分成 <b>3 份</b>：' + per + '、' + per + '、' + (total - 2 * per) + '。为什么不分成两份？往下看。',
        run: function () {
          for (var g = 0; g < 3; g++) {
            var col = g === 0 ? BLUE : g === 1 ? RED : GRAY;
            var from = g * per, to = Math.min(from + per, total);
            var list = []; for (var b = from; b < to; b++) list.push(b);
            moveBalls(list, 60 + g * 120, 58, col);
          }
        } },
      { text: '天平两端各放 ' + per + ' 个。若<b>平衡</b>→次品在盘外；若<b>不平衡</b>→次品在翘起（轻）的那端。',
        run: function () {
          var L = [], R2 = [];
          for (var b = 0; b < per; b++) L.push(b);
          for (b = per; b < 2 * per; b++) R2.push(b);
          moveBalls(L, pivot.x - 104, pivot.y + 30, BLUE);
          moveBalls(R2, pivot.x + 104, pivot.y + 30, RED);
          tilt(0);
        } },
      { text: '假设这次<b>平衡</b>——次品就在盘外的第三份里；就算不平衡，嫌疑也只剩轻的那 ' + per + ' 个。称一次，嫌疑从 ' + total + ' 个压到 <b>' + per + '</b> 个。',
        run: function () {
          tilt(0);
          moveBalls([], 0, 0, GRAY);
          var out = []; for (var b = 2 * per; b < total; b++) out.push(b);
          // 平衡情境：第三份成为嫌疑
          moveBalls(out.slice(0, per), 180, 58, ORG);
          suspects = out.slice(0, per);
          note.textContent = '嫌疑：' + per + ' 个';
        } },
      { text: '剩下 ' + per + ' 个再分成 1、1、1：天平各放 1 个。不平衡→轻的是次品；平衡→盘外那个是次品。',
        run: function () {
          moveBalls([suspects[0]], pivot.x - 104, pivot.y + 30, ORG);
          moveBalls([suspects[1]], pivot.x + 104, pivot.y + 30, ORG);
          moveBalls([suspects[2]], 180, 58, GRAY);
          tilt(-6);
          note.textContent = '左端翘起 → 左边这个是次品';
        } },
      { text: '只称 <b>2 次</b>就锁定了它。每称一次，嫌疑范围缩小到约 1/3：分三份是最优策略。',
        run: function () {
          balls[suspects[0]].setAttribute('stroke', ORG);
          balls[suspects[0]].setAttribute('stroke-width', 2.5);
          note.textContent = '√ 找到次品，共称 2 次';
        } }
    ];

    var idx = 0;
    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () {
        idx = 0;
        tilt(0);
        note.textContent = '';
        suspects = null;
        balls.forEach(function (c, i2) {
          c.setAttribute('cx', bx0 + i2 * 22); c.setAttribute('cy', BY);
          c.setAttribute('fill', 'var(--card)'); c.setAttribute('fill-opacity', 1);
          c.setAttribute('stroke', GRAY); c.setAttribute('stroke-width', 1.2);
        });
        return this;
      },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 打电话
   * 为什么单独做：翻倍规律靠背容易背成「加倍」。
   * 通话树每分钟长一层，2、4、8、16 摆在眼前，倍增才有了画面。
   * ══════════════════════════════════════════════════════ */
  function callTree(el, spec) {
    spec = spec || {};
    var minutes = Math.min(spec.minutes || 4, 4);
    var W = 360, H = 268;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'ctt-svg', role: 'img' }, el);
    var RED = '#f87171', BLUE = '#38bdf8', GRN = '#4ade80', ORG = '#fbbf24';
    var LVL = [ORG, BLUE, GRN, RED, BLUE];
    var TOP = 34, DYY = 50;

    // 生成节点：level 0 = 老师；level d 有 2^(d-1) 个新节点
    var nodes = [{ lv: 0, x: 180, parent: -1 }];
    for (var d = 1; d <= minutes; d++) {
      var cnt = Math.pow(2, d - 1), sp = W / (cnt + 1);
      for (var i = 0; i < cnt; i++) {
        nodes.push({ lv: d, x: sp * (i + 1), parent: 0 });
      }
    }
    var levelStart = [0, 1];
    for (d = 2; d <= minutes; d++) {
      levelStart[d] = levelStart[d - 1] + Math.pow(2, d - 2);
    }
    for (d = 1; d <= minutes; d++) {
      var cnt2 = Math.pow(2, d - 1);
      var st2 = levelStart[d];
      for (i = 0; i < cnt2; i++) {
        nodes[st2 + i].parent = levelStart[d - 1] + Math.floor(i / 2);
        nodes[st2 + i].y = TOP + d * DYY;
      }
    }
    nodes[0].y = TOP;

    // 边
    var edges = [];
    for (i = 1; i < nodes.length; i++) {
      var pn = nodes[nodes[i].parent];
      var ln = s('line', { x1: pn.x, y1: pn.y + 12, x2: nodes[i].x, y2: nodes[i].y - 12,
        stroke: 'var(--dim)', 'stroke-width': 1.2 }, svg);
      ln.style.opacity = 0; ln.style.transition = 'opacity .4s ease';
      edges.push(ln);
    }
    // 节点
    for (i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var c = s('circle', { cx: n.x, cy: n.y, r: 10,
        fill: n.lv === 0 ? LVL[0] : 'var(--card)', stroke: n.lv === 0 ? LVL[0] : LVL[n.lv], 'stroke-width': 2 }, svg);
      c.style.opacity = 0; c.style.transition = 'opacity .4s ease';
      n.el = c;
      if (n.lv > 0) {
        n.tx = T(svg, n.x, n.y + 3.5, String(i), 'font-size:9px;font-weight:700;fill:var(--text);text-anchor:middle');
        n.tx.style.opacity = 0; n.tx.style.transition = 'opacity .4s ease';
      }
    }

    var stat = T(svg, 180, 16, '', 'font-size:12.5px;font-weight:700;fill:var(--text);text-anchor:middle');
    var note = T(svg, 180, 260, '', 'font-size:12px;fill:var(--dim);text-anchor:middle');

    function reveal(min) {
      // 已知节点数 = 2^min，其中新增 2^(min-1)
      for (var k = 0; k < nodes.length; k++) {
        var n2 = nodes[k];
        var shown = k === 0 ? min >= 0 : (levelStart[n2.lv] != null && n2.lv <= min);
        if (n2.lv <= min) {
          n2.el.style.opacity = 1;
          if (n2.tx) n2.tx.style.opacity = 1;
          if (n2.lv > 0) edges[k - 1].style.opacity = n2.lv === min ? 1 : 0.45;
        }
      }
    }

    var STEPS = [];
    STEPS.push({ text: '第 0 分钟：只有<b>老师</b>知道消息。要尽快通知全班，怎样打电话最快？', run: function () { reveal(0); stat.textContent = '知道消息：1 人，通话 0 次'; } });
    for (var m = 1; m <= minutes; m++) {
      (function (mm) {
        var fresh = Math.pow(2, mm - 1), known = Math.pow(2, mm);
        STEPS.push({
          text: '第 ' + mm + ' 分钟：' + fresh + ' 个知道的人<b>同时</b>打 ' + fresh + ' 个电话，一人打一个。新通知 ' + fresh + ' 人，共 <b>' + known + '</b> 人知道。',
          run: function () {
            reveal(mm);
            stat.textContent = '知道消息：' + known + ' 人，通话 ' + (known - 1) + ' 次';
          }
        });
      })(m);
    }
    STEPS.push({
      text: '规律：每过 1 分钟，知道消息的人数<b>翻倍</b>。n 分钟最多通知到 2<sup>n</sup> 人（含老师）。省时间的关键：每一个知道消息的人都不空闲。',
      run: function () {
        note.textContent = '1 → 2 → 4 → 8 → 16 … 每分钟 ×2';
      }
    });

    var idx = 0;
    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () {
        idx = 0;
        stat.textContent = '知道消息：1 人，通话 0 次';
        note.textContent = '';
        nodes.forEach(function (n2) { n2.el.style.opacity = 0; if (n2.tx) n2.tx.style.opacity = 0; });
        edges.forEach(function (e2) { e2.style.opacity = 0; });
        nodes[0].el.style.opacity = 1;
        return this;
      },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 圆的认识
   * 为什么单独做：「圆是到定点距离相等的点的集合」这句话背得出来，
   * 但看不见。让半径真的转一圈画出圆，圆心与半径各管什么才分得清。
   * ══════════════════════════════════════════════════════ */
  function circle(el, spec) {
    spec = spec || {};
    var W = 360, H = 250;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'cir-svg', role: 'img' }, el);
    var RED = '#f87171', BLUE = '#38bdf8', GRN = '#4ade80', ORG = '#fbbf24';
    var cx = 152, cy = 116, r = 74;
    var C = 2 * Math.PI * r;

    T(svg, 180, 20, '圆是怎么来的', 'font-size:14px;font-weight:700;fill:var(--text);text-anchor:middle');

    var ring = s('circle', { cx: cx, cy: cy, r: r, fill: 'none', stroke: 'var(--text)', 'stroke-width': 2.2,
      'stroke-dasharray': C, 'stroke-dashoffset': C }, svg);
    ring.style.transition = 'stroke-dashoffset 1.1s linear';
    var dotO = s('circle', { cx: cx, cy: cy, r: 4, fill: RED }, svg);
    var lblO = T(svg, cx - 12, cy + 18, 'O', 'font-size:12px;font-weight:700;fill:RED');
    var radius = s('line', { x1: cx, y1: cy, x2: cx + r, y2: cy, stroke: BLUE, 'stroke-width': 2.6 }, svg);
    var rlbl = T(svg, cx + r / 2, cy - 8, 'r', 'font-size:12.5px;font-weight:700;fill:' + BLUE);
    [dotO, lblO, radius, rlbl].forEach(function (n) { n.style.opacity = 0; n.style.transition = 'opacity .35s ease'; });

    // 多条半径
    var radiiG = s('g', {}, svg);
    radiiG.style.opacity = 0; radiiG.style.transition = 'opacity .4s ease';
    [30, 115, 200, 305].forEach(function (deg) {
      var a = deg * Math.PI / 180;
      s('line', { x1: cx, y1: cy, x2: cx + r * Math.cos(a), y2: cy + r * Math.sin(a), stroke: BLUE, 'stroke-width': 2, 'stroke-opacity': 0.75 }, radiiG);
    });

    // 直径
    var diaG = s('g', {}, svg);
    diaG.style.opacity = 0; diaG.style.transition = 'opacity .4s ease';
    s('line', { x1: cx - r, y1: cy, x2: cx + r, y2: cy, stroke: GRN, 'stroke-width': 2.6 }, diaG);
    var dlbl = T(diaG, cx - r / 2 - 4, cy - 10, 'd', 'font-size:12.5px;font-weight:700;fill:' + GRN + ';text-anchor:middle');

    // 另一个圆（半径不同 / 圆心不同）
    var other = s('g', {}, svg);
    other.style.opacity = 0; other.style.transition = 'opacity .4s ease';
    s('circle', { cx: 268, cy: 178, r: 40, fill: 'none', stroke: ORG, 'stroke-width': 2, 'stroke-dasharray': '5 4' }, other);
    s('circle', { cx: 268, cy: 178, r: 3, fill: ORG }, other);
    T(other, 268, 232, '圆心定位置', 'font-size:11px;fill:' + ORG + ';text-anchor:middle');

    // 对称轴
    var axes = s('g', {}, svg);
    axes.style.opacity = 0; axes.style.transition = 'opacity .4s ease';
    [0, 60, 120].forEach(function (deg) {
      var a = deg * Math.PI / 180;
      s('line', { x1: cx - r * Math.cos(a), y1: cy - r * Math.sin(a), x2: cx + r * Math.cos(a), y2: cy + r * Math.sin(a),
        stroke: 'var(--dim)', 'stroke-width': 1.4, 'stroke-dasharray': '6 4' }, axes);
    });

    var note = T(svg, 180, 240, '', 'font-size:12.5px;font-weight:600;fill:var(--dim);text-anchor:middle');

    function sweep(after) {
      if (reduced()) {
        ring.setAttribute('stroke-dashoffset', '0');
        if (after) after();
        return;
      }
      var t0 = null;
      function frame(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / 1100);
        ring.setAttribute('stroke-dashoffset', String(C * (1 - p)));
        radius.setAttribute('transform', 'rotate(' + (p * 360) + ' ' + cx + ' ' + cy + ')');
        if (p < 1) requestAnimationFrame(frame);
        else if (after) after();
      }
      requestAnimationFrame(frame);
    }

    var STEPS = [
      { text: '钉住<b>圆心 O</b>，把一段长 r 的绳子拉直、绕 O 转一整圈——笔尖走过的痕迹就是一个圆。',
        run: function () {
          [dotO, lblO, radius, rlbl].forEach(function (n) { n.style.opacity = 1; });
          sweep();
          note.textContent = '圆是到定点距离等于定长的点的集合';
        } },
      { text: '连接圆心和圆上任意一点的线段叫<b>半径 r</b>。同一个圆里半径有无数条，长度<b>都相等</b>。',
        run: function () { radiiG.style.opacity = 1; ring.setAttribute('stroke-dashoffset', '0'); note.textContent = '同圆内 r 处处相等'; } },
      { text: '通过圆心、两端都在圆上的线段叫<b>直径 d</b>。直径正好是两条半径接起来：<b>d = 2r</b>。',
        run: function () { diaG.style.opacity = 1; dlbl.textContent = 'd = 2r'; note.textContent = 'd = 2r，r = d ÷ 2'; } },
      { text: '<b>圆心</b>决定圆画在哪儿，<b>半径</b>决定圆有多大。半径相同的两个圆能完全重合，叫等圆。',
        run: function () { other.style.opacity = 1; note.textContent = '圆心定位置，半径定大小'; } },
      { text: '圆还是轴对称图形：每一条直径所在的直线都是它的对称轴，所以圆有<b>无数条</b>对称轴。',
        run: function () { axes.style.opacity = 1; note.textContent = '对称轴：无数条'; } }
    ];
    var idx = 0;
    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () {
        idx = 0;
        ring.setAttribute('stroke-dashoffset', String(C));
        [dotO, lblO, radius, rlbl].forEach(function (n) { n.style.opacity = 0; });
        radius.removeAttribute('transform');
        [radiiG, diaG, other, axes].forEach(function (g) { g.style.opacity = 0; });
        dlbl.textContent = 'd';
        note.textContent = '';
        return this;
      },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 圆的周长与面积
   * 周长：让圆真的滚一圈，滚过的长度正好是直径的三倍多一点——π 是量出来的。
   * 面积：16 等份交错拼成长方形，长 = 半周长 πr、宽 = r，公式是拼出来的。
   * ══════════════════════════════════════════════════════ */
  function circleMeasure(el, spec) {
    spec = spec || {};
    var mode = spec.mode || 'perimeter';
    var W = 360, H = 250;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'cim-svg', role: 'img' }, el);
    var RED = '#f87171', BLUE = '#38bdf8', GRN = '#4ade80', ORG = '#fbbf24';

    if (mode === 'area') return areaPart(svg, W, H, RED, GRN);
    return perimPart(svg, W, H, BLUE, ORG);

    function perimPart(svg, W, H, BLUE, ORG) {
      var r = 26, d = 2 * r, C = 2 * Math.PI * r;
      var x0 = 56, yLine = 196;
      T(svg, 180, 20, '圆滚一圈，滚过的长度就是周长', 'font-size:13.5px;font-weight:700;fill:var(--text);text-anchor:middle');
      s('line', { x1: 30, y1: yLine, x2: 348, y2: yLine, stroke: 'var(--text)', 'stroke-width': 1.6 }, svg);
      for (var x = 30; x <= 348; x += d / 2) {
        s('line', { x1: x, y1: yLine, x2: x, y2: yLine + (Math.abs((x - x0) % d) < 0.5 ? 7 : 4), stroke: 'var(--dim)', 'stroke-width': 1 }, svg);
      }
      var markA = s('line', { x1: x0, y1: yLine - 10, x2: x0, y2: yLine + 16, stroke: BLUE, 'stroke-width': 2 }, svg);
      var markB = s('line', { x1: x0, y1: yLine - 10, x2: x0, y2: yLine + 16, stroke: ORG, 'stroke-width': 2 }, svg);
      markB.style.opacity = 0; markB.style.transition = 'opacity .3s ease';

      var g = s('g', {}, svg);
      s('circle', { cx: 0, cy: yLine - r, r: r, fill: 'var(--card)', stroke: BLUE, 'stroke-width': 2 }, g);
      s('line', { x1: 0, y1: yLine - r, x2: r, y2: yLine - r, stroke: ORG, 'stroke-width': 2 }, g);
      s('circle', { cx: 0, cy: yLine - r, r: 2.5, fill: ORG }, g);
      var bg = s('g', {}, svg);
      bg.style.opacity = 0; bg.style.transition = 'opacity .4s ease';
      s('circle', { cx: 300, cy: 150, r: 44, fill: 'none', stroke: ORG, 'stroke-width': 2, 'stroke-dasharray': '5 4' }, bg);

      var units = s('g', {}, svg);
      units.style.opacity = 0; units.style.transition = 'opacity .4s ease';
      for (var k = 1; k <= 3; k++) {
        var xa = x0 + (k - 1) * d, xb = xa + d;
        s('line', { x1: xa, y1: yLine + 16, x2: xb, y2: yLine + 16, stroke: GRN, 'stroke-width': 3 }, units);
        var tt = T(units, (xa + xb) / 2, yLine + 29, String(k) + 'd', 'font-size:10.5px;fill:' + GRN + ';text-anchor:middle');
      }
      var rest = s('line', { x1: x0 + 3 * d, y1: yLine + 16, x2: x0 + C, y2: yLine + 16, stroke: RED, 'stroke-width': 3 }, units);

      var note = T(svg, 180, 244, '', 'font-size:12.5px;font-weight:600;fill:var(--dim);text-anchor:middle');
      var res = T(svg, 180, 96, '', 'font-size:16px;font-weight:700;fill:var(--text);text-anchor:middle');
      res.style.opacity = 0; res.style.transition = 'opacity .35s ease';

      function roll(after) {
        if (reduced()) {
          g.setAttribute('transform', 'translate(' + (x0 + C) + ' 0)');
          if (after) after();
          return;
        }
        var t0 = null;
        function frame(ts) {
          if (t0 === null) t0 = ts;
          var p = Math.min(1, (ts - t0) / 1400);
          var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          g.setAttribute('transform', 'translate(' + (x0 + e * C) + ' 0) rotate(' + (e * 360) + ' ' + x0 + ' ' + (yLine - r) + ')');
          if (p < 1) requestAnimationFrame(frame);
          else if (after) after();
        }
        requestAnimationFrame(frame);
      }

      var STEPS = [
        { text: '把圆放在直尺上，让它<b>滚一整圈</b>——从起点到终点滚过的长度，就是这个圆的周长。',
          run: function () { g.setAttribute('transform', 'translate(' + x0 + ' 0)'); roll(); } },
        { text: '终点落在 <b>' + (C / d).toFixed(2) + ' 个直径</b>多一点的地方。换个大圆再滚，倍数<b>还是这么大</b>。',
          run: function () { markB.setAttribute('x1', String(x0 + C)); markB.setAttribute('x2', String(x0 + C)); markB.style.opacity = 1; bg.style.opacity = 1; } },
        { text: '不管圆多大，<b>周长 ÷ 直径</b> 都是同一个数 ≈ 3.14，这就是<b>圆周率 π</b>。',
          run: function () { units.style.opacity = 1; note.textContent = '周长 ÷ 直径 = π，固定不变'; } },
        { text: '于是 <b>C = πd = 2πr</b>。知道直径或半径，就能算出周长。',
          run: function () { res.textContent = 'C = πd = 2πr'; res.style.opacity = 1; note.textContent = 'π 是量出来的常数，不是符号游戏'; } }
      ];
      var idx = 0;
      return {
        el: svg,
        next: function () {
          if (idx >= STEPS.length) return null;
          var st = STEPS[idx++]; st.run();
          return { text: st.text, done: idx >= STEPS.length };
        },
        startDemo: function () {
          idx = 0;
          g.setAttribute('transform', 'translate(' + x0 + ' 0)');
          markB.setAttribute('x1', String(x0 + C)); markB.setAttribute('x2', String(x0 + C)); markB.style.opacity = 0;
          bg.style.opacity = 0; units.style.opacity = 0; res.style.opacity = 0; note.textContent = '';
          return this;
        },
        reset: function () { return this.startDemo(); }
      };
    }

    function areaPart(svg, W, H, RED, GRN) {
      var r = 68, n = 16, alpha = 2 * Math.PI / n;
      var cx = 108, cy = 116;
      T(svg, 180, 20, '把圆切开，拼成一个长方形', 'font-size:13.5px;font-weight:700;fill:var(--text);text-anchor:middle');
      var w = 2 * Math.PI * r / n;   // 每份的弧长
      var x0 = 62, yBot = 200, yTop = yBot - r;

      var paths = [];
      for (var i = 0; i < n; i++) {
        var a0 = -alpha / 2, a1 = alpha / 2;
        var pth = s('path', {
          d: 'M0 0 L' + (r * Math.cos(a0)).toFixed(1) + ' ' + (r * Math.sin(a0)).toFixed(1) +
             ' A' + r + ' ' + r + ' 0 0 1 ' + (r * Math.cos(a1)).toFixed(1) + ' ' + (r * Math.sin(a1)).toFixed(1) + ' Z',
          fill: i % 2 === 0 ? BLUE : GRN, 'fill-opacity': 0.75, stroke: 'var(--dim)', 'stroke-width': 0.6
        }, svg);
        pth.setAttribute('transform', 'translate(' + cx + ' ' + cy + ') rotate(' + (i * 360 / n + 360 / n / 2) + ')');
        pth.style.transition = 'none';
        paths.push(pth);
      }
      var box = s('rect', { x: x0, y: yTop, width: n / 2 * w, height: r, fill: 'none', stroke: RED, 'stroke-width': 1.6, 'stroke-dasharray': '6 4' }, svg);
      box.style.opacity = 0; box.style.transition = 'opacity .5s ease';
      var lw = T(svg, x0 + n / 2 * w / 2, yBot + 22, '', 'font-size:12px;font-weight:700;fill:' + RED + ';text-anchor:middle');
      var lh = T(svg, 180, (yTop + yBot) / 2, '', 'font-size:12px;font-weight:700;fill:' + RED + ';text-anchor:middle');
      var note = T(svg, 180, 238, '', 'font-size:12.5px;font-weight:600;fill:var(--dim);text-anchor:middle');

      function shape() {
        paths.forEach(function (pth, i) {
          var k = Math.floor(i / 2);
          var up = i % 2 === 0;
          var tx = up ? x0 + w / 2 + k * w : x0 + w + k * w;
          var ty = up ? yBot : yTop;
          var deg = up ? -90 : 90;
          pth.setAttribute('transform', 'translate(' + tx.toFixed(1) + ' ' + ty + ') rotate(' + deg + ')');
        });
      }
      function animate() {
        if (reduced()) { shape(); return; }
        var from = paths.map(function (pth, i) {
          return { x: cx, y: cy, deg: i * 360 / n + 360 / n / 2 };
        });
        var to = [];
        paths.forEach(function (pth, i) {
          var k = Math.floor(i / 2);
          to.push({ x: i % 2 === 0 ? x0 + w / 2 + k * w : x0 + w + k * w, y: i % 2 === 0 ? yBot : yTop, deg: i % 2 === 0 ? -90 : 90 });
        });
        var t0 = null;
        function frame(ts) {
          if (t0 === null) t0 = ts;
          var p = Math.min(1, (ts - t0) / 1000);
          var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          paths.forEach(function (pth, i) {
            var x = from[i].x + (to[i].x - from[i].x) * e;
            var y = from[i].y + (to[i].y - from[i].y) * e;
            var dg = from[i].deg + (to[i].deg - from[i].deg) * e;
            pth.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + dg.toFixed(1) + ')');
          });
          if (p < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      }

      var STEPS = [
        { text: '先把圆<b>平均分成 16 份</b>——每一份都是一个小扇形，弧长是周长的 1/16。',
          run: function () { note.textContent = '16 等份'; } },
        { text: '把它们<b>交错</b>拼起来，尖齿互相咬合，就得到一个近似的长方形。',
          run: function () { animate(); note.textContent = '分的份数越多，越接近长方形'; } },
        { text: '这个长方形的<b>长</b>是周长的一半 <b>πr</b>（8 份弧长），<b>宽</b>就是半径 <b>r</b>。',
          run: function () {
            box.style.opacity = 1;
            lw.textContent = '长 = πr ≈ ' + (Math.PI * r / 10).toFixed(1) + '（单位）';
            lh.textContent = '宽 = r';
            note.textContent = '长 = 周长 ÷ 2，宽 = 半径';
          } },
        { text: '面积 = 长 × 宽 = πr × r = <b>πr²</b>。这就是圆面积公式的来历。',
          run: function () { note.textContent = 'S = πr²'; } }
      ];
      var idx = 0;
      return {
        el: svg,
        next: function () {
          if (idx >= STEPS.length) return null;
          var st = STEPS[idx++]; st.run();
          return { text: st.text, done: idx >= STEPS.length };
        },
        startDemo: function () {
          idx = 0;
          paths.forEach(function (pth, i) {
            pth.setAttribute('transform', 'translate(' + cx + ' ' + cy + ') rotate(' + (i * 360 / n + 360 / n / 2) + ')');
          });
          box.style.opacity = 0; lw.textContent = ''; lh.textContent = ''; note.textContent = '';
          return this;
        },
        reset: function () { return this.startDemo(); }
      };
    }
  }

  /* ══════════════════════════════════════════════════════
   * 扇形
   * 为什么单独做：扇形是六年级第一次用「角」去刻画图形大小的地方。
   * 圆心角一拖，扇形占圆的几分之几跟着变——弧、半径、圆心角三者才连起来。
   * ══════════════════════════════════════════════════════ */
  function sector(el, spec) {
    spec = spec || {};
    var deg = spec.deg || 90;
    var W = 360, H = 250;
    // .viz 是 flex 行布局，控件行/SVG/提示要包进一个块级内层才不会横排挤压
    var inner = h('div');
    inner.style.width = '100%';
    el.appendChild(inner);
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'sec-svg', role: 'img' }, inner);
    var BLUE = '#38bdf8', ORG = '#fbbf24', GRN = '#4ade80';
    var cx = 160, cy = 126, r = 74;

    var wrap = h('div', 'fm-ctl');
    inner.insertBefore(wrap, svg);
    wrap.appendChild(h('span', null, '圆心角'));
    var rg = document.createElement('input');
    rg.type = 'range'; rg.min = '30'; rg.max = '330'; rg.step = '15'; rg.value = String(deg);
    rg.setAttribute('aria-label', '圆心角');
    wrap.appendChild(rg);
    var vG = h('b', null, deg + '°'); wrap.appendChild(vG);
    var tip = h('div', 'muted', '');
    inner.appendChild(tip);

    var arc = s('path', { fill: 'none', stroke: ORG, 'stroke-width': 3 }, svg);
    var fill = s('path', { fill: BLUE, 'fill-opacity': 0.35, stroke: 'none' }, svg);
    var r1 = s('line', { x1: cx, y1: cy, x2: cx + r, y2: cy, stroke: 'var(--text)', 'stroke-width': 2 }, svg);
    var r2 = s('line', { stroke: 'var(--text)', 'stroke-width': 2 }, svg);
    var dotO = s('circle', { cx: cx, cy: cy, r: 3.5, fill: 'var(--text)' }, svg);
    var lblO = T(svg, cx - 12, cy + 18, 'O', 'font-size:12px;font-weight:700;fill:var(--text)');
    var arcTxt = T(svg, 0, 0, '弧', 'font-size:11.5px;font-weight:700;fill:' + ORG + ';text-anchor:middle');
    var angTxt = T(svg, 0, 0, '', 'font-size:12px;font-weight:700;fill:' + GRN + ';text-anchor:middle');
    var angArc = s('path', { fill: 'none', stroke: GRN, 'stroke-width': 2 }, svg);
    var note = T(svg, 180, 236, '', 'font-size:12.5px;font-weight:600;fill:var(--dim);text-anchor:middle');
    var fracTxt = T(svg, 180, 34, '', 'font-size:14px;font-weight:700;fill:var(--text);text-anchor:middle');

    function draw() {
      var a = -deg * Math.PI / 180;                       // 逆时针量角，终点在上半
      var x1 = cx + r * Math.cos(0), y1 = cy + r * Math.sin(0);
      var x2 = cx + r * Math.cos(a), y2 = cy + r * Math.sin(a);
      fill.setAttribute('d', 'M' + cx + ' ' + cy + ' L' + x1 + ' ' + y1 +
        ' A' + r + ' ' + r + ' 0 0 0 ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + ' Z');
      arc.setAttribute('d', 'M' + x1 + ' ' + y1 + ' A' + r + ' ' + r + ' 0 0 0 ' + x2.toFixed(1) + ' ' + y2.toFixed(1));
      r2.setAttribute('x1', cx); r2.setAttribute('y1', cy); r2.setAttribute('x2', x2.toFixed(1)); r2.setAttribute('y2', y2.toFixed(1));
      var mid = -a / 2;
      arcTxt.setAttribute('x', (cx + (r + 16) * Math.cos(mid)).toFixed(1));
      arcTxt.setAttribute('y', (cy + (r + 16) * Math.sin(mid)).toFixed(1));
      var ar = 26;
      angArc.setAttribute('d', 'M' + (cx + ar) + ' ' + cy + ' A' + ar + ' ' + ar + ' 0 0 0 ' +
        (cx + ar * Math.cos(a)).toFixed(1) + ' ' + (cy + ar * Math.sin(a)).toFixed(1));
      angTxt.setAttribute('x', (cx + (ar + 20) * Math.cos(mid)).toFixed(1));
      angTxt.setAttribute('y', (cy + (ar + 20) * Math.sin(mid) + 4).toFixed(1));
      angTxt.textContent = deg + '°';
      var g = gcd(deg, 360);
      fracTxt.textContent = '这个扇形占整个圆的 ' + deg + '/360 = ' + (deg / g) + '/' + (360 / g);
      note.textContent = '圆心角 ' + deg + '° —— 扇形大小由圆心角和半径共同决定';
      tip.textContent = '圆心角 ' + deg + '° → 扇形是这个圆的 ' + (deg / 360 * 100).toFixed(0) + '%';
    }
    function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }
    draw();
    rg.oninput = function () { deg = +this.value; vG.textContent = deg + '°'; draw(); };

    var STEPS = [
      { text: '圆上两点之间的部分叫<b>弧</b>（橙色那段）。弧是曲线，不是线段。',
        run: function () { fill.style.opacity = 0; angArc.style.opacity = 0; angTxt.style.opacity = 0; draw(); } },
      { text: '一条弧和经过它两端的<b>两条半径</b>围成的图形，就是<b>扇形</b>。',
        run: function () { fill.style.opacity = 1; draw(); } },
      { text: '这两条半径的夹角叫<b>圆心角</b>——顶点在圆心上。扇形的大小就用它来刻画。',
        run: function () { angArc.style.opacity = 1; angTxt.style.opacity = 1; draw(); note.textContent = '圆心角的顶点必须在圆心'; } },
      { text: '圆心角是 90° 的扇形，正好是这个圆的 <b>1/4</b>；180° 是 <b>1/2</b>。拖滑块试试别的大小。',
        run: function () { draw(); note.textContent = '同圆里圆心角越大，扇形越大'; } },
      { text: '还要看半径：圆心角相同，<b>半径越大扇形也越大</b>。所以扇形的大小由圆心角和半径<b>共同</b>决定。',
        run: function () { draw(); note.textContent = '圆心角 + 半径，两个都不能少'; } }
    ];
    var idx = 0;
    return {
      el: svg,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () {
        idx = 0;
        deg = spec.deg || 90;
        rg.value = String(deg); vG.textContent = deg + '°';
        fill.style.opacity = 1; angArc.style.opacity = 1; angTxt.style.opacity = 1;
        draw(); tip.textContent = '';
        return this;
      },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 圆柱与圆锥
   * 为什么单独做：侧面「展开是长方形」这句话，不亲眼看见曲面被剪开摊平，
   * 就只能死记。体积公式同理——底面积乘高是从长方体搬过来的老道理。
   * ══════════════════════════════════════════════════════ */
  function cylinder(el, spec) {
    spec = spec || {};
    var shape = spec.shape || 'cylinder';
    var W = 360, H = 250;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'cyl-svg', role: 'img' }, el);
    var BLUE = '#38bdf8', ORG = '#fbbf24', GRN = '#4ade80', RED = '#f87171';
    var r = 28, hh = 96, rx = 30, ry = 11;

    if (shape === 'cone') return conePart();
    return cylPart();

    function cylPart() {
      var cx0 = 96, yTop = 62, yBot = yTop + hh;
      T(svg, 180, 22, '圆柱：两个底面 + 一个侧面', 'font-size:13.5px;font-weight:700;fill:var(--text);text-anchor:middle');

      var g = s('g', {}, svg);
      s('ellipse', { cx: cx0, cy: yBot, rx: rx, ry: ry, fill: 'var(--card)', stroke: 'var(--text)', 'stroke-width': 1.6 }, g);
      s('path', { d: 'M' + (cx0 - rx) + ' ' + yTop + ' L' + (cx0 - rx) + ' ' + yBot +
        ' A' + rx + ' ' + ry + ' 0 0 0 ' + (cx0 + rx) + ' ' + yBot + ' L' + (cx0 + rx) + ' ' + yTop + ' Z',
        fill: BLUE, 'fill-opacity': 0.28, stroke: 'var(--text)', 'stroke-width': 1.6 }, g);
      var top = s('ellipse', { cx: cx0, cy: yTop, rx: rx, ry: ry, fill: 'var(--card)', stroke: 'var(--text)', 'stroke-width': 1.8 }, g);
      var rLine = s('line', { x1: cx0, y1: yTop, x2: cx0 + rx, y2: yTop, stroke: ORG, 'stroke-width': 2.2 }, g);
      var rTxt = T(g, cx0 + rx / 2 + 4, yTop - 6, 'r', 'font-size:12px;font-weight:700;fill:' + ORG);
      var hLine = s('line', { x1: cx0 + rx, y1: yTop, x2: cx0 + rx, y2: yBot, stroke: GRN, 'stroke-width': 2, 'stroke-dasharray': '5 3' }, g);
      var hTxt = T(g, cx0 + rx + 12, (yTop + yBot) / 2, 'h', 'font-size:12px;font-weight:700;fill:' + GRN);
      var botTxt = T(g, cx0, yBot + 26, '底面（圆）', 'font-size:11px;fill:var(--dim);text-anchor:middle');
      [top, rLine, rTxt, hLine, hTxt, botTxt].forEach(function (n) { n.style.opacity = 0; n.style.transition = 'opacity .4s ease'; });

      // 侧面展开：一个逐渐变宽的长方形
      var unroll = s('g', {}, svg);
      unroll.style.opacity = 0; unroll.style.transition = 'opacity .4s ease';
      var rect = s('rect', { x: 186, y: yTop, width: 2, height: hh, fill: BLUE, 'fill-opacity': 0.3, stroke: 'var(--text)', 'stroke-width': 1.6 }, unroll);
      rect.style.transition = 'width .9s ease';
      var cutLine = s('line', { x1: cx0 + rx, y1: yTop, x2: 186, y2: yTop, stroke: RED, 'stroke-width': 1.4, 'stroke-dasharray': '4 3' }, unroll);
      var lenTxt = T(unroll, 0, yTop - 10, '', 'font-size:11.5px;font-weight:700;fill:' + RED + ';text-anchor:middle');
      var widTxt = T(unroll, 0, yBot + 22, '', 'font-size:11.5px;font-weight:700;fill:' + GRN + ';text-anchor:middle');

      var note = T(svg, 180, 240, '', 'font-size:12.5px;font-weight:600;fill:var(--dim);text-anchor:middle');
      var res = T(svg, 180, 212, '', 'font-size:16px;font-weight:700;fill:var(--text);text-anchor:middle');
      res.style.opacity = 0; res.style.transition = 'opacity .35s ease';
      var W2 = 2 * Math.PI * r;

      var STEPS = [
        { text: '圆柱上下两个<b>底面</b>是完全一样的圆，中间围着的<b>侧面</b>是曲面；两底之间的距离叫<b>高 h</b>。',
          run: function () { [top, rLine, rTxt, hLine, hTxt, botTxt].forEach(function (n) { n.style.opacity = 1; }); } },
        { text: '沿<b>高</b>把侧面剪开、摊平：侧面展开后是一个<b>长方形</b>。',
          run: function () {
            unroll.style.opacity = 1;
            rect.setAttribute('width', String(W2));
            cutLine.setAttribute('x2', String(186 + W2));
            note.textContent = '曲面被剪开，摊成了平面';
          } },
        { text: '这个长方形的<b>长 = 底面周长 2πr</b>，<b>宽 = 高 h</b>。所以侧面积 = <b>2πrh</b>。',
          run: function () {
            lenTxt.setAttribute('x', String(186 + W2 / 2)); lenTxt.textContent = '长 = 2πr（底面周长）';
            widTxt.setAttribute('x', String(186 + W2 / 2)); widTxt.textContent = '宽 = h';
            note.textContent = '侧面积 = 底面周长 × 高';
          } },
        { text: '表面积 = 侧面积 + 2 个底面积 = <b>2πrh + 2πr²</b>。',
          run: function () { res.textContent = 'S表 = 2πrh + 2πr²'; res.style.opacity = 1; } },
        { text: '体积还是「底面积 × 高」这个老道理：<b>V = πr²h</b>——和长方体一样的算法。',
          run: function () { res.textContent = 'V = πr²h = 底面积 × 高'; note.textContent = '与长方体同法：底面积 × 高'; } }
      ];
      var idx = 0;
      return {
        el: svg,
        next: function () {
          if (idx >= STEPS.length) return null;
          var st = STEPS[idx++]; st.run();
          return { text: st.text, done: idx >= STEPS.length };
        },
        startDemo: function () {
          idx = 0;
          unroll.style.opacity = 0;
          rect.setAttribute('width', '2');
          cutLine.setAttribute('x2', '186');
          lenTxt.textContent = ''; widTxt.textContent = '';
          res.style.opacity = 0; note.textContent = '';
          [top, rLine, rTxt, hLine, hTxt, botTxt].forEach(function (n) { n.style.opacity = 0; });
          return this;
        },
        reset: function () { return this.startDemo(); }
      };
    }

    function conePart() {
      var cx0 = 140, yBase = 164, apexY = 64;
      T(svg, 180, 22, '圆锥：一个底面 + 一个顶点', 'font-size:13.5px;font-weight:700;fill:var(--text);text-anchor:middle');
      var g = s('g', {}, svg);
      s('ellipse', { cx: cx0, cy: yBase, rx: rx, ry: ry, fill: 'var(--card)', stroke: 'var(--text)', 'stroke-width': 1.6 }, g);
      s('path', { d: 'M' + (cx0 - rx) + ' ' + yBase + ' L' + cx0 + ' ' + apexY + ' L' + (cx0 + rx) + ' ' + yBase +
        ' A' + rx + ' ' + ry + ' 0 0 1 ' + (cx0 - rx) + ' ' + yBase + ' Z',
        fill: ORG, 'fill-opacity': 0.3, stroke: 'var(--text)', 'stroke-width': 1.6 }, g);
      var apex = s('circle', { cx: cx0, cy: apexY, r: 3.5, fill: RED }, g);
      var apexTxt = T(g, cx0 + 8, apexY - 4, '顶点', 'font-size:11px;font-weight:700;fill:' + RED);
      var hLine = s('line', { x1: cx0, y1: apexY, x2: cx0, y2: yBase, stroke: GRN, 'stroke-width': 2, 'stroke-dasharray': '5 3' }, g);
      var hTxt = T(g, cx0 + 10, (apexY + yBase) / 2, 'h', 'font-size:12px;font-weight:700;fill:' + GRN);
      var baseTxt = T(g, cx0, yBase + 26, '底面（圆）', 'font-size:11px;fill:var(--dim);text-anchor:middle');
      [apex, apexTxt, hLine, hTxt, baseTxt].forEach(function (n) { n.style.opacity = 0; n.style.transition = 'opacity .4s ease'; });

      // 等底等高圆柱（虚线）作对比
      var cyl = s('g', {}, svg);
      cyl.style.opacity = 0; cyl.style.transition = 'opacity .4s ease';
      var cx1 = 266;
      s('ellipse', { cx: cx1, cy: yBase, rx: rx, ry: ry, fill: 'none', stroke: 'var(--dim)', 'stroke-width': 1.4, 'stroke-dasharray': '5 4' }, cyl);
      s('path', { d: 'M' + (cx1 - rx) + ' ' + apexY + ' L' + (cx1 - rx) + ' ' + yBase +
        ' A' + rx + ' ' + ry + ' 0 0 0 ' + (cx1 + rx) + ' ' + yBase + ' L' + (cx1 + rx) + ' ' + apexY + ' Z',
        fill: 'none', stroke: 'var(--dim)', 'stroke-width': 1.4, 'stroke-dasharray': '5 4' }, cyl);
      s('ellipse', { cx: cx1, cy: apexY, rx: rx, ry: ry, fill: 'none', stroke: 'var(--dim)', 'stroke-width': 1.4, 'stroke-dasharray': '5 4' }, cyl);
      T(cyl, cx1, yBase + 26, '等底等高圆柱', 'font-size:11px;fill:var(--dim);text-anchor:middle');
      var x3 = T(cyl, (cx0 + cx1) / 2, 40, '', 'font-size:14px;font-weight:700;fill:' + RED + ';text-anchor:middle');

      var note = T(svg, 180, 240, '', 'font-size:12.5px;font-weight:600;fill:var(--dim);text-anchor:middle');
      var res = T(svg, 180, 212, '', 'font-size:16px;font-weight:700;fill:var(--text);text-anchor:middle');
      res.style.opacity = 0; res.style.transition = 'opacity .35s ease';

      var STEPS = [
        { text: '圆锥有一个圆形的<b>底面</b>和一个<b>顶点</b>；从顶点到底面圆心的距离是它的<b>高 h</b>。',
          run: function () { [apex, apexTxt, hLine, hTxt, baseTxt].forEach(function (n) { n.style.opacity = 1; }); } },
        { text: '拿一个和它<b>等底等高</b>的圆柱来比：把圆锥装满水倒进去，得倒 <b>3 次</b>才能倒满。',
          run: function () { cyl.style.opacity = 1; x3.textContent = '1 锥 × 3 = 1 柱'; note.textContent = '实验：倒 3 次正好倒满'; } },
        { text: '所以圆锥体积是等底等高圆柱的 <b>1/3</b>：<b>V锥 = 1/3 πr²h</b>。',
          run: function () { res.textContent = 'V锥 = 1/3 πr²h'; res.style.opacity = 1; note.textContent = 'V柱 = πr²h'; } },
        { text: '反过来，等底等高的圆柱体积是圆锥的 3 倍。做题先找「等底等高」这个前提。',
          run: function () { note.textContent = '前提：等底等高，缺一不可'; } }
      ];
      var idx = 0;
      return {
        el: svg,
        next: function () {
          if (idx >= STEPS.length) return null;
          var st = STEPS[idx++]; st.run();
          return { text: st.text, done: idx >= STEPS.length };
        },
        startDemo: function () {
          idx = 0;
          [apex, apexTxt, hLine, hTxt, baseTxt].forEach(function (n) { n.style.opacity = 0; });
          cyl.style.opacity = 0; x3.textContent = ''; res.style.opacity = 0; note.textContent = '';
          return this;
        },
        reset: function () { return this.startDemo(); }
      };
    }
  }

  function escH(t) {
    return String(t).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function shuffleArr(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ══════════════════════════════════════════════════════
   * 扩句积木（语文 · 三年级：扩句与把句子写具体）
   * 为什么单独做：扩句不是「加形容词」的口诀。要让孩子看见——
   * 每加一个修饰语，句子就多一层信息、字数也跟着变长；
   * 「写具体」是有代价的，所以要挑值得写的地方加。
   */
  function sentBuild(el, spec) {
    spec = spec || {};
    var core = spec.core || '小鸟飞';
    var slots = spec.slots || [];
    var wrap = h('div', 'sb-wrap'); el.appendChild(wrap);
    var sent = h('div', 'sb-sent'); wrap.appendChild(sent);
    var ask = h('div', 'sb-ask'); wrap.appendChild(ask);
    var opts = h('div', 'sb-opts'); wrap.appendChild(opts);
    var stat = h('div', 'sb-stat'); wrap.appendChild(stat);
    var msg = h('div', 'sb-msg'); wrap.appendChild(msg);

    var filled = [];
    for (var q = 0; q < slots.length; q++) filled.push('');

    function parts() {
      var arr = core.split('').map(function (c) { return { t: c, add: false }; });
      var ins = [];
      for (var i = 0; i < slots.length; i++) {
        if (filled[i]) ins.push({ at: slots[i].at || 0, t: filled[i] });
      }
      // 按位置升序插入并累加偏移：同一位置上的多个修饰语保持填写顺序
      ins.sort(function (a, b) { return a.at - b.at; });
      var off = 0;
      ins.forEach(function (x) {
        arr.splice(x.at + off, 0, { t: x.t, add: true });
        off += 1;
      });
      return arr;
    }
    function len() {
      return parts().reduce(function (a, p) { return a + p.t.length; }, 0);
    }
    function drawSent() {
      sent.innerHTML = parts().map(function (p) {
        return p.add ? '<span class="sb-add">' + escH(p.t) + '</span>'
                     : '<span>' + escH(p.t) + '</span>';
      }).join('');
      stat.innerHTML = '句子长度 <b>' + len() + '</b> 字' +
        (core.length ? '（原来 ' + core.length + ' 字）' : '');
    }
    function cur() {
      for (var i = 0; i < slots.length; i++) if (!filled[i]) return i;
      return -1;
    }
    function drawOpts() {
      opts.innerHTML = '';
      var i = cur();
      if (i < 0) {
        ask.textContent = '扩写完成';
        if (spec.onDone) spec.onDone();
        msg.className = 'sb-msg ok';
        msg.textContent = spec.done || '句子从 ' + core.length + ' 字变成 ' + len() + ' 字，画面清楚多了。';
        return;
      }
      ask.innerHTML = '第 ' + (i + 1) + ' 步：补上「<b>' + escH(slots[i].ask) + '</b>」';
      (slots[i].options || []).forEach(function (o) {
        var b = h('button', 'sb-opt', o);
        b.type = 'button';
        b.onclick = function () {
          if (o === slots[i].answer) {
            filled[i] = o; drawSent(); drawOpts();
            msg.className = 'sb-msg ok';
            msg.textContent = '对了 · ' + (slots[i].why || '这一层加上了');
          } else {
            b.classList.add('shake');
            setTimeout(function () { b.classList.remove('shake'); }, 420);
            msg.className = 'sb-msg bad';
            msg.textContent = '再想想 · ' + (slots[i].hint || '这个词放进去，句子更具体了吗？');
          }
        };
        opts.appendChild(b);
      });
    }
    drawSent(); drawOpts();
    msg.className = 'sb-msg';
    msg.textContent = spec.tip || '点一个词，把它加进句子里';

    var STEPS = slots.map(function (sl, i) {
      return {
        text: '加「' + sl.ask + '」：<b>' + escH(sl.answer) + '</b>' + (sl.why ? '——' + sl.why : ''),
        run: function () { filled[i] = sl.answer; drawSent(); drawOpts(); }
      };
    });
    var idx = 0;
    function resetFn() {
      for (var i = 0; i < filled.length; i++) filled[i] = '';
      idx = 0; drawSent(); drawOpts();
      msg.className = 'sb-msg'; msg.textContent = spec.tip || '';
    }
    return {
      el: wrap,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () { resetFn(); return this; },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 关联词语配对（语文 · 三年级：关联词语）
   * 为什么单独做：关联词语考的不是背搭配，是判断两句话之间
   * 究竟是什么关系。先把关系配对上，关联词才不是空壳。
   */
  function pairMatch(el, spec) {
    spec = spec || {};
    var pairs = spec.pairs || [];
    var wrap = h('div', 'pm-wrap'); el.appendChild(wrap);
    var head = h('div', 'pm-head'); wrap.appendChild(head);
    head.innerHTML = '<span>左边：说什么</span><span>关系</span><span>右边：接着说什么</span>';
    var body = h('div', 'pm-body'); wrap.appendChild(body);
    var L = h('div', 'pm-col'); body.appendChild(L);
    var M = h('div', 'pm-mid'); body.appendChild(M);
    var R = h('div', 'pm-col'); body.appendChild(R);
    var msg = h('div', 'pm-msg'); wrap.appendChild(msg);

    var order = shuffleArr(pairs.map(function (p, i) { return i; }));
    var lBtns = [], rBtns = [], mBtns = [];
    pairs.forEach(function (p, i) {
      var lb = h('button', 'pm-card', p.left);
      lb.type = 'button';
      lb.onclick = function () {
        if (lb.classList.contains('done')) return;
        lBtns.forEach(function (b) { b.classList.remove('sel'); });
        lb.classList.add('sel');
        msg.className = 'pm-msg';
        msg.textContent = '已选左边第 ' + (i + 1) + ' 句，再点右边和它配的一句';
      };
      L.appendChild(lb); lBtns.push(lb);
      var mb = h('div', 'pm-word', ''); M.appendChild(mb); mBtns.push(mb);
    });
    order.forEach(function (pi) {
      var p = pairs[pi];
      var rb = h('button', 'pm-card', p.right);
      rb.type = 'button';
      rb.onclick = function () {
        if (rb.classList.contains('done')) return;
        var sel = -1;
        lBtns.forEach(function (b, k) { if (b.classList.contains('sel')) sel = k; });
        if (sel < 0) {
          msg.className = 'pm-msg bad';
          msg.textContent = '先点左边的句子，再点右边和它配的一句';
          return;
        }
        if (sel === pi) {
          lBtns[sel].classList.remove('sel');
          lBtns[sel].classList.add('done');
          rb.classList.add('done');
          mBtns[sel].classList.add('on');
          mBtns[sel].textContent = p.word;
          msg.className = 'pm-msg ok';
          msg.textContent = '对了 · ' + (p.why || ('这两句是' + p.word.replace(/…/g, '').replace(/、/g, '') + '关系'));
          var doneN = 0;
          lBtns.forEach(function (x) { if (x.classList.contains('done')) doneN++; });
          if (doneN === pairs.length && spec.onDone) spec.onDone();
        } else {
          rb.classList.add('shake');
          setTimeout(function () { rb.classList.remove('shake'); }, 420);
          msg.className = 'pm-msg bad';
          msg.textContent = '再想想 · ' + (pairs[sel].hint || '左边那句和这一句说得通吗？');
        }
      };
      R.appendChild(rb); rBtns.push(rb);
    });
    msg.className = 'pm-msg';
    msg.textContent = spec.tip || '点左边一句，再点右边和它配得上的一句';

    var STEPS = pairs.map(function (p, i) {
      return {
        text: '<b>' + escH(p.left) + '</b> 和 <b>' + escH(p.right) + '</b>：是' +
              (p.word.indexOf('虽然') === 0 ? '转折' : p.word.indexOf('因为') === 0 ? '因果'
               : p.word.indexOf('不但') === 0 ? '递进' : p.word.indexOf('如果') === 0 ? '假设' : '并列') +
              '关系，用「' + escH(p.word) + '」' + (p.why ? '——' + p.why : ''),
        run: function () {
          lBtns[i].classList.add('done');
          for (var k = 0; k < rBtns.length; k++) {
            if (rBtns[k].textContent === p.right) rBtns[k].classList.add('done');
          }
          mBtns[i].classList.add('on');
          mBtns[i].textContent = p.word;
        }
      };
    });
    var idx = 0;
    function resetFn() {
      idx = 0;
      lBtns.concat(rBtns).forEach(function (b) { b.classList.remove('done', 'sel', 'shake'); });
      mBtns.forEach(function (b) { b.classList.remove('on'); b.textContent = ''; });
      msg.className = 'pm-msg'; msg.textContent = spec.tip || '';
    }
    return {
      el: wrap,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () { resetFn(); return this; },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 直述 ↔ 转述（语文 · 三年级：冒号、引号与直述转述）
   * 为什么单独做：转述改的不是「把引号删掉」。人称、标点、
   * 时间地点词三处同时变，学生漏一处就错。逐处改、逐处看，
   * 才知道「谁说的」和「谁在转」是两个位置。
   */
  function transform(el, spec) {
    spec = spec || {};
    var src = spec.direct || '';
    var changes = spec.changes || [];
    var wrap = h('div', 'tf-wrap'); el.appendChild(wrap);
    var lab1 = h('div', 'tf-lab', '直述句（原话）'); wrap.appendChild(lab1);
    var top = h('div', 'tf-src'); wrap.appendChild(top);
    var lab2 = h('div', 'tf-lab', '转述句（改成别人说）'); wrap.appendChild(lab2);
    var out = h('div', 'tf-out'); wrap.appendChild(out);
    var opts = h('div', 'tf-opts'); wrap.appendChild(opts);
    var msg = h('div', 'tf-msg'); wrap.appendChild(msg);

    var cur = src;            // 当前转述句文本
    var step = 0;             // 处理到第几个变化
    var lastTo = '';

    function drawTop() {
      var c = changes[step];
      if (!c) { top.innerHTML = escH(src); return; }
      var i = src.indexOf(c.from);
      if (i < 0) { top.innerHTML = escH(src); return; }
      top.innerHTML = escH(src.slice(0, i)) + '<span class="tf-hot">' + escH(c.from) + '</span>' +
                      escH(src.slice(i + c.from.length));
    }
    function drawOut() {
      if (!lastTo) { out.innerHTML = '<span class="tf-dim">' + escH(cur) + '</span>'; return; }
      var i = cur.indexOf(lastTo);
      if (i < 0) { out.innerHTML = escH(cur); return; }
      out.innerHTML = escH(cur.slice(0, i)) + '<span class="tf-new">' + escH(lastTo) + '</span>' +
                      escH(cur.slice(i + lastTo.length));
    }
    function drawOpts() {
      opts.innerHTML = '';
      var c = changes[step];
      if (!c) {
        msg.className = 'tf-msg ok';
        if (spec.onDone) spec.onDone();
        msg.textContent = spec.done || '改完了：人称、标点都跟着换了位置。';
        return;
      }
      var title = h('div', 'tf-ask', '第 ' + (step + 1) + ' 步 · ' + c.label + '：「' + c.from + '」该怎么改？');
      opts.appendChild(title);
      var row = h('div', 'tf-row'); opts.appendChild(row);
      (c.options || []).forEach(function (o) {
        var b = h('button', 'tf-opt', o);
        b.type = 'button';
        b.onclick = function () {
          // 「改成空」这类变化，选项文字是「去掉」，与 to 的空串对不上——用 pick 指定
          if (o === (c.pick || c.to)) {
            var i = cur.indexOf(c.from);
            if (i >= 0) cur = cur.slice(0, i) + c.to + cur.slice(i + c.from.length);
            lastTo = c.to; step++;
            drawTop(); drawOut(); drawOpts();
            msg.className = 'tf-msg ok';
            msg.textContent = '对了 · ' + (c.why || '');
          } else {
            b.classList.add('shake');
            setTimeout(function () { b.classList.remove('shake'); }, 420);
            msg.className = 'tf-msg bad';
            msg.textContent = '再想想 · ' + (c.hint || '转述时，说话的人换成了谁？');
          }
        };
        row.appendChild(b);
      });
    }
    drawTop(); drawOut(); drawOpts();
    msg.className = 'tf-msg';
    msg.textContent = spec.tip || '看红色的部分，选它改成什么';

    var STEPS = changes.map(function (c, i) {
      return {
        text: '<b>' + escH(c.label) + '</b>：' + escH(c.from) + ' → <b>' + escH(c.to) + '</b>' +
              (c.why ? '——' + c.why : ''),
        run: function () {
          var k = cur.indexOf(c.from);
          if (k >= 0) cur = cur.slice(0, k) + c.to + cur.slice(k + c.from.length);
          lastTo = c.to; step = i + 1;
          drawTop(); drawOut(); drawOpts();
        }
      };
    });
    var idx = 0;
    function resetFn() {
      cur = src; step = 0; lastTo = ''; idx = 0;
      drawTop(); drawOut(); drawOpts();
      msg.className = 'tf-msg'; msg.textContent = spec.tip || '';
    }
    return {
      el: wrap,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () { resetFn(); return this; },
      reset: function () { return this.startDemo(); }
    };
  }

  /* ══════════════════════════════════════════════════════
   * 点句读（语文 · 三年级：顿号、分号与书名号）
   * 为什么单独做：三个标点都是「看起来差不多」的那一类。
   * 判断依据不是记规则，是看并列的是什么——词语、分句还是作品名。
   */
  function punctPick(el, spec) {
    spec = spec || {};
    var items = spec.items || [];
    var wrap = h('div', 'pp-wrap'); el.appendChild(wrap);
    var line = h('div', 'pp-line'); wrap.appendChild(line);
    var opts = h('div', 'pp-opts'); wrap.appendChild(opts);
    var msg = h('div', 'pp-msg'); wrap.appendChild(msg);
    var bar = h('div', 'pp-bar'); wrap.appendChild(bar);

    var i = 0;
    var picked = [];
    function drawBar() {
      bar.innerHTML = items.map(function (_, k) {
        var st = picked[k] === undefined ? '' : (picked[k] ? 'ok' : 'no');
        return '<i class="pp-dot ' + st + '"></i>';
      }).join('');
    }
    function draw() {
      var it = items[i];
      if (!it) {
        line.innerHTML = '<b>三句都点对了</b>';
        opts.innerHTML = '';
        return;
      }
      var val = picked[i];
      line.innerHTML = escH(it.before) +
        '<span class="pp-slot' + (val === undefined ? '' : (val ? ' ok' : ' bad')) + '">' +
        (val === undefined ? '？' : escH(it.answer)) + '</span>' + escH(it.after);
      opts.innerHTML = '';
      (it.options || []).forEach(function (o) {
        var b = h('button', 'pp-opt', o);
        b.type = 'button';
        b.onclick = function () {
          if (o === it.answer) {
            picked[i] = true; draw(); drawBar();
            msg.className = 'pp-msg ok';
            msg.textContent = '对了 · ' + (it.why || '');
            setTimeout(next, 900);
          } else {
            picked[i] = false; draw(); drawBar();
            b.classList.add('shake');
            setTimeout(function () { b.classList.remove('shake'); }, 420);
            msg.className = 'pp-msg bad';
            msg.textContent = '再看看 · ' + (it.hint || '并列的到底是词语、分句还是作品名？');
          }
        };
        opts.appendChild(b);
      });
    }
    function next() {
      if (i < items.length - 1) {
        i++; picked[i] = undefined; draw(); drawBar();
        msg.className = 'pp-msg'; msg.textContent = '第 ' + (i + 1) + ' 句，选一个标点填进去';
      } else {
        i++; draw(); drawBar();
        msg.className = 'pp-msg ok';
        if (spec.onDone) spec.onDone();
        msg.textContent = spec.done || '三句都点完了：看并列的是什么，就知道该用哪个标点。';
      }
    }
    draw(); drawBar();
    msg.className = 'pp-msg';
    msg.textContent = spec.tip || '第 1 句，选一个标点填进去';

    var STEPS = items.map(function (it) {
      return {
        text: '<b>' + escH(it.before + it.answer + it.after) + '</b>——' + (it.why || ''),
        run: function () { picked[i] = true; draw(); drawBar(); }
      };
    });
    var idx = 0;
    function resetFn() {
      i = 0; idx = 0; picked = [];
      draw(); drawBar();
      msg.className = 'pp-msg'; msg.textContent = spec.tip || '';
    }
    return {
      el: wrap,
      next: function () {
        if (idx >= STEPS.length) return null;
        var st = STEPS[idx++]; st.run();
        if (idx < STEPS.length) { i = idx; picked[i] = undefined; draw(); drawBar(); }
        return { text: st.text, done: idx >= STEPS.length };
      },
      startDemo: function () { resetFn(); return this; },
      reset: function () { return this.startDemo(); }
    };
  }

  global.CR = {
    vertical: vertical,
    circle: circle,
    circleMeasure: circleMeasure,
    sector: sector,
    cylinder: cylinder,
    geometry: geometry,
    mult2: mult2,
    fracMeaning: fracMeaning,
    fracReduce: fracReduce,
    spinner: spinner,
    decMult: decMult,
    decDiv: decDiv,
    fracOps: fracOps,
    volume: volume,
    pairs: pairs,
    treePlant: treePlant,
    symmetry: symmetry,
    chart: chart,
    mean: mean,
    polyArea: polyArea,
    factorGrid: factorGrid,
    law: law,
    triangle: triangle,
    counter: counter,
    angle: angle,
    quad: quad,
    decGrid: decGrid,
    numberline: numberline,
    coords: coords,
    clock: clock,
    solid: solid,
    division: division,
    molecule: molecule,
    pyramid: pyramid,
    calendar: calendar,
    decimalBar: decimalBar,
    barGroup: barGroup,
    compass: compass,
    fracDiv: fracDiv,
    balance: balance,
    callTree: callTree,
    sentBuild: sentBuild,
    pairMatch: pairMatch,
    transform: transform,
    punctPick: punctPick,
    graphNav: graphNav,
    extend: extend,
    graphHref: graphHref,
    reduced: reduced
  };
})(window);

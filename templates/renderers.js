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
    for (var k = 0; k < sh.length; k++) {
      var st = sh[k];
      var qEl = hidden(num(String(st.qd), st.col, 0));
      ops.push({
        els: [qEl],
        text: (k === 0 ? st.cur + ' ÷ ' + b + ' 商 ' + st.qd : '把 ' + st.cur + ' 除以 ' + b + '，商 ' + st.qd) +
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

  global.CR = {
    vertical: vertical,
    geometry: geometry,
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
    graphNav: graphNav,
    extend: extend,
    graphHref: graphHref,
    reduced: reduced
  };
})(window);

// ===== 仿真：摆一摆，12 块方糖能摆出几种长方形 =====
var SIM_W = 880, SIM_H = 360;
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';

var SIM_NS = [12, 16, 18, 24, 36, 48];
var SIM = { n: 12, i: 0, ni: 0, all: false, list: [] };

var LIST_X = 560, LIST_W = 290, LIST_Y = 82, LIST_H = 40;
var GRID_X = 40, GRID_Y = 76, GRID_W = 470, GRID_H = 212;

function simCtx() { return document.getElementById('simCanvas').getContext('2d'); }

function simTxt(t, x, y, size, color, weight, align) {
  var ctx = simCtx();
  ctx.save();
  ctx.font = (weight ? weight + ' ' : '') + size + 'px ' + SIM_FONT;
  ctx.fillStyle = color;
  ctx.textAlign = align || 'left';
  ctx.fillText(t, x, y);
  ctx.restore();
}

function simLine(x1, y1, x2, y2, color, w, dash) {
  var ctx = simCtx();
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = w || 1.6; ctx.lineCap = 'round';
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.restore();
}

function simBox(x, y, w, h, fill, stroke, r) {
  var ctx = simCtx();
  r = (r === undefined) ? 8 : r;
  if (r > Math.min(w, h) / 2) r = Math.min(w, h) / 2;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke(); }
  ctx.restore();
}

// ---- 因数计算 ----
function simPairs(n) {
  var out = [];
  for (var a = 1; a * a <= n; a++) if (n % a === 0) out.push([a, n / a]);
  return out;
}

function simCount(n) {
  var ps = simPairs(n), c = 0;
  for (var i = 0; i < ps.length; i++) c += (ps[i][0] === ps[i][1] ? 1 : 2);
  return c;
}

function simFactors(n) {
  var ps = simPairs(n), out = [];
  for (var i = 0; i < ps.length; i++) {
    out.push(ps[i][0]);
    if (ps[i][0] !== ps[i][1]) out.push(ps[i][1]);
  }
  out.sort(function (a, b) { return a - b; });
  return out;
}

// ---- 绘制 ----
function simDraw() {
  var ctx = simCtx();
  if (!ctx) return;
  SIM.list = simPairs(SIM.n);
  if (SIM.i >= SIM.list.length) SIM.i = 0;

  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.save();
  ctx.fillStyle = '#FFF9FB';
  ctx.fillRect(0, 0, SIM_W, SIM_H);
  ctx.restore();

  // 顶部
  simTxt(SIM.n + ' 块方糖', GRID_X, 46, 23, '#AD1457', '700');
  var sub = SIM.all ? ('全部 ' + SIM.list.length + ' 种摆法')
    : ('第 ' + (SIM.i + 1) + ' / ' + SIM.list.length + ' 种摆法');
  simTxt(sub, 850, 46, 13.5, '#8D6E63', '', 'right');

  if (SIM.all) simDrawAll(); else simDrawOne();
  simDrawList();

  // 底部
  var fs = simFactors(SIM.n);
  simBox(LIST_X, 294, LIST_W, 28, '#FCE4EC', '#F8BBD0', 7);
  simTxt('共 ' + SIM.list.length + ' 对 · ' + simCount(SIM.n) + ' 个因数',
    LIST_X + 14, 313, 14, '#AD1457', '700');
  simTxt(SIM.n + ' 的因数：' + fs.join('、'), LIST_X, 340, 12, '#8D6E63');

  simRefresh();
}

function simDrawOne() {
  var p = SIM.list[SIM.i];
  var rows = p[0], cols = p[1];
  var cell = Math.min(44, Math.floor(GRID_W / cols), Math.floor(GRID_H / rows));
  var gap = cell >= 14 ? 2 : 1;
  while (cell > 4 && (cell * cols + gap * (cols - 1) > GRID_W ||
                      cell * rows + gap * (rows - 1) > GRID_H)) cell--;
  if (cell < 4) cell = 4;

  var w = cell * cols + gap * (cols - 1);
  var h = cell * rows + gap * (rows - 1);
  var x0 = GRID_X + (GRID_W - w) / 2;
  var y0 = GRID_Y + (GRID_H - h) / 2;

  var stroke = cell >= 8 ? '#F57F17' : null;
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      simBox(x0 + c * (cell + gap), y0 + r * (cell + gap), cell, cell,
        '#FFE082', stroke, Math.min(4, cell / 4));
    }
  }

  // 行数、列数标注
  simTxt(rows + ' 行', x0 - 12, y0 + h / 2 + 5, 12, '#8D6E63', '', 'right');
  simTxt(cols + ' 列', x0 + w / 2, y0 + h + 20, 12, '#8D6E63', '', 'center');

  // 算式
  simTxt(SIM.n + ' ÷ ' + rows + ' = ' + cols + '　→　' + rows + ' × ' + cols + ' = ' + SIM.n,
    GRID_X + GRID_W / 2, 322, 17, '#AD1457', '700', 'center');
}

function simDrawAll() {
  var k = SIM.list.length;
  var rowH = Math.min(62, Math.floor(GRID_H / k));
  var top = GRID_Y + (GRID_H - rowH * k) / 2;

  for (var i = 0; i < k; i++) {
    var rows = SIM.list[i][0], cols = SIM.list[i][1];
    var cell = Math.min(Math.floor((GRID_W - 120) / cols), Math.floor((rowH - 10) / rows), 22);
    if (cell < 2) cell = 2;
    var w = cell * cols, h = cell * rows;
    var cy = top + i * rowH + rowH / 2;
    var x0 = GRID_X + 104;
    var y0 = cy - h / 2;

    simBox(x0, y0, w, h, '#FFE082', '#F57F17', 3);
    for (var c = 1; c < cols; c++) simLine(x0 + c * cell, y0, x0 + c * cell, y0 + h, '#F57F17', 1);
    for (var r = 1; r < rows; r++) simLine(x0, y0 + r * cell, x0 + w, y0 + r * cell, '#F57F17', 1);

    simTxt(rows + ' × ' + cols, GRID_X + 94, cy + 5, 13.5, '#AD1457', '700', 'right');
  }
}

function simDrawList() {
  simTxt('因数对', LIST_X + 4, 68, 13, '#8D6E63', '700');
  for (var i = 0; i < SIM.list.length; i++) {
    var a = SIM.list[i][0], b = SIM.list[i][1];
    var on = !SIM.all && i === SIM.i;
    var y = LIST_Y + i * LIST_H;
    simBox(LIST_X, y, LIST_W, 34, on ? '#AD1457' : '#FFFFFF', on ? null : '#F8BBD0', 7);
    simTxt(a + ' × ' + b, LIST_X + 18, y + 23, 16, on ? '#FFFFFF' : '#5D4037', '700');
    if (SIM.all) simTxt('✓', LIST_X + LIST_W - 20, y + 22, 14, '#43A047', '700', 'right');
    else simTxt('= ' + SIM.n, LIST_X + LIST_W - 18, y + 22, 12,
      on ? 'rgba(255,255,255,.82)' : '#BCAAA4', '', 'right');
  }
}

// ---- 交互 ----
function simRefresh() {
  var ro = document.getElementById('simReadout');
  if (ro) ro.textContent = SIM.n + ' 块 · ' +
    (SIM.all ? '全部摆法' : ('第 ' + (SIM.i + 1) + ' / ' + SIM.list.length + ' 种'));

  var tp = document.getElementById('simTip');
  if (tp) {
    var p = SIM.list[SIM.i];
    tp.textContent = p[0] === p[1]
      ? '摆成了正方形，' + p[0] + ' 只算一次'
      : '点画布换下一种，或点右边任意一对';
  }
}

function simLog(msg) {
  var box = document.getElementById('simLog');
  if (!box) return;
  var d = document.createElement('div');
  d.className = 'sim-log-line';
  d.innerHTML = msg;
  box.appendChild(d);
  if (box.children.length > 3) box.removeChild(box.firstChild);
  box.scrollTop = box.scrollHeight;
}

function simNext() {
  if (SIM.all) SIM.all = false;
  SIM.i = (SIM.i + 1) % SIM.list.length;
  var p = SIM.list[SIM.i];
  simDraw();
  simLog('换成 <span class="hl">' + p[0] + ' 行 ' + p[1] + ' 列</span>：' +
    SIM.n + ' ÷ ' + p[0] + ' = ' + p[1] + '，正好摆满，' + p[0] + ' 和 ' + p[1] + ' 是 ' + SIM.n + ' 的因数');
}

function simPrev() {
  if (SIM.all) SIM.all = false;
  SIM.i = (SIM.i - 1 + SIM.list.length) % SIM.list.length;
  var p = SIM.list[SIM.i];
  simDraw();
  simLog('退回 <span class="hl">' + p[0] + ' 行 ' + p[1] + ' 列</span>');
}

function simAll() {
  SIM.all = !SIM.all;
  simDraw();
  if (SIM.all) {
    simLog('<span class="hl">' + SIM.n + '</span> 一共摆出 ' + SIM.list.length + ' 种长方形，' +
      SIM.n + ' 有 ' + simCount(SIM.n) + ' 个因数');
  } else {
    simLog('回到单个摆法');
  }
}

function simNextN() {
  SIM.ni = (SIM.ni + 1) % SIM_NS.length;
  SIM.n = SIM_NS[SIM.ni];
  SIM.i = 0;
  SIM.all = false;
  simDraw();
  simLog('换成一盒 <span class="hl">' + SIM.n + ' 块</span>：' + SIM.list.length + ' 对因数，共 ' +
    simCount(SIM.n) + ' 个');
}

function simCase() { return SIM.n; }

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function (e) {
    var r = cv.getBoundingClientRect();
    var x = (e.clientX - r.left) * (SIM_W / r.width);
    var y = (e.clientY - r.top) * (SIM_H / r.height);

    if (SIM.all) { SIM.all = false; simDraw(); return; }

    if (x > LIST_X - 10 && y > LIST_Y - 6 &&
        y < LIST_Y + SIM.list.length * LIST_H) {
      var idx = Math.floor((y - LIST_Y + 6) / LIST_H);
      if (idx >= 0 && idx < SIM.list.length) {
        SIM.i = idx;
        var p = SIM.list[idx];
        simDraw();
        simLog('点了 <span class="hl">' + p[0] + ' × ' + p[1] + '</span>');
        return;
      }
    }
    simNext();
  });
}

SIM.list = simPairs(12);

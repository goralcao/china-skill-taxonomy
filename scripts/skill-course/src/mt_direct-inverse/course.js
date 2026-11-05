// ===== 六年级仿真通用绘图库（每课 course.js 前缀） =====
var SIM_W = 880, SIM_H = 360;
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';

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
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.6; ctx.stroke(); }
  ctx.restore();
}

function simDot(x, y, r, fill, stroke) {
  var ctx = simCtx();
  ctx.save();
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.4; ctx.stroke(); }
  ctx.restore();
}

function simArc(cx, cy, r, a0, a1, fill, stroke, w) {
  var ctx = simCtx();
  ctx.save();
  ctx.beginPath(); ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, r, a0, a1); ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = w || 1.6; ctx.stroke(); }
  ctx.restore();
}

function simRing(cx, cy, r, color, w, dash) {
  var ctx = simCtx();
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = color; ctx.lineWidth = w || 1.6;
  if (dash) ctx.setLineDash(dash);
  ctx.stroke(); ctx.restore();
}

function simLog(msg) {
  var box = document.getElementById('simLog');
  if (!box) return;
  var d = document.createElement('div');
  d.className = 'sim-log-line'; d.innerHTML = msg;
  box.appendChild(d);
  if (box.children.length > 3) box.removeChild(box.firstChild);
  box.scrollTop = box.scrollHeight;
}

function simFrac(n, d) { return n + '/' + d; }
function simGcd(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }
function simReduce(n, d) { var g = simGcd(n, d); return [n / g, d / g]; }

// ===== 仿真：表格 + 图像双视图 —— 商一定 / 积一定 =====
var SIM_CASES = [
  { type: '正比例', name: '单价 4 元',
    sub: '总价 = 4 × 数量，商恒为 4；图像是过原点的直线',
    xs: [1, 2, 3, 4, 5, 6], ys: [4, 8, 12, 16, 20, 24],
    xmax: 6, ymax: 24, xlab: '数量 / 支', ylab: '总价 / 元',
    rowhd: '商 y÷x', vals: ['4', '4', '4', '4', '4', '4'],
    concl: '比值（商）恒为 4 → 正比例' },
  { type: '反比例', name: '路程 24 千米',
    sub: '速度 × 时间 = 24，积恒为 24；图像是一条曲线',
    xs: [2, 3, 4, 6, 8, 12], ys: [12, 8, 6, 4, 3, 2],
    xmax: 12, ymax: 12, xlab: '速度 / (千米/时)', ylab: '时间 / 小时',
    rowhd: '积 x×y', vals: ['24', '24', '24', '24', '24', '24'],
    concl: '乘积恒为 24 → 反比例' }
];
var SIM = { ci: 0, xi: 2 };

function simC() { return SIM_CASES[SIM.ci]; }
function simCase() { return SIM.ci + '/' + SIM.xi; }
function simPX(i) { var c = simC(); return 496 + c.xs[i] / c.xmax * 310; }
function simPY(i) { var c = simC(); return 268 - c.ys[i] / c.ymax * 160; }

function simDrawTable() {
  var c = simC();
  simBox(34, 90, 396, 174, '#FFFFFF', '#C5CAE9', 8);
  simBox(34, 90, 75, 174, '#E8EAF6', '#C5CAE9', 2);
  simTxt('x', 71, 124, 14, '#1A237E', '700', 'center');
  simTxt('y', 71, 181, 14, '#1A237E', '700', 'center');
  simTxt(c.rowhd, 71, 238, 11, '#E65100', '700', 'center');

  var cw = 320 / 6;
  for (var i = 0; i < 6; i++) {
    var gx = 110 + i * cw, cx = gx + cw / 2;
    var hi = (i === SIM.xi);
    for (var r = 0; r < 3; r++) {
      var gy = 90 + r * 58;
      simBox(gx, gy, cw - 1, 57,
             hi ? 'rgba(255,167,38,.30)' : (r === 2 ? '#F7F8FF' : '#FFFFFF'),
             '#E8EAF6', 2);
    }
    simTxt(String(c.xs[i]), cx, 124, 14, hi ? '#E65100' : '#1A237E', hi ? '700' : '', 'center');
    simTxt(String(c.ys[i]), cx, 181, 14, hi ? '#E65100' : '#1A237E', hi ? '700' : '', 'center');
    simTxt(c.vals[i], cx, 238, 13, '#E65100', hi ? '700' : '', 'center');
  }
}

function simDrawGraph() {
  var c = simC(), ox = 496, oy = 268, W = 310, H = 160;
  simLine(ox, oy, ox + W, oy, '#9FA8DA', 1.6);
  simLine(ox, oy, ox, oy - H, '#9FA8DA', 1.6);
  simTxt('0', ox - 12, oy + 18, 10, '#607D8B', '', 'center');
  simTxt('x', ox + W + 8, oy + 5, 11, '#607D8B', '700', 'center');
  simTxt('y', ox - 4, oy - H - 8, 11, '#607D8B', '700', 'center');
  simTxt('↑ ' + c.ylab, 500, 96, 11, '#607D8B');

  for (var i = 0; i < 5; i++) {
    simLine(simPX(i), simPY(i), simPX(i + 1), simPY(i + 1), '#3949AB', 2);
  }
  for (var j = 0; j < 6; j++) simDot(simPX(j), simPY(j), 4, '#1A237E');
  simDot(simPX(SIM.xi), simPY(SIM.xi), 9, '#FFA726');
  simTxt('(' + c.xs[SIM.xi] + ',' + c.ys[SIM.xi] + ')',
         simPX(SIM.xi), simPY(SIM.xi) - 16, 11, '#E65100', '700', 'center');
  simTxt(c.xlab + ' →', 660, 300, 11, '#607D8B', '', 'center');
}

function simDraw() {
  var ctx = simCtx();
  if (!ctx) return;
  var c = simC();
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.save(); ctx.fillStyle = '#FCFCFF'; ctx.fillRect(0, 0, SIM_W, SIM_H); ctx.restore();

  simTxt('第 ' + (SIM.ci + 1) + ' 组 · ' + c.type + ' · ' + c.name +
         ' · 第 ' + (SIM.xi + 1) + ' 列', 34, 34, 17, '#1A237E', '700');
  simTxt(c.sub + '　（表格与图像同步高亮同一列）', 34, 58, 12.5, '#607D8B');

  simDrawTable();
  simDrawGraph();

  simTxt('表格：' + c.rowhd + ' 处处相等', 34, 306, 11, '#607D8B');
  simTxt('图像：' + (c.type === '正比例' ? '过原点的直线' : '一条曲线'), 500, 306, 11, '#607D8B');
  simTxt(c.concl + '　·　当前 x = ' + c.xs[SIM.xi] + '，y = ' + c.ys[SIM.xi],
         34, 332, 13, '#E65100', '700');

  simRefresh();
}

function simRefresh() {
  var c = simC();
  var ro = document.getElementById('simReadout');
  var tp = document.getElementById('simTip');
  if (ro) ro.textContent = '第 ' + (SIM.ci + 1) + ' 组 · ' + c.type + ' · ' + c.name +
    ' · 第 ' + (SIM.xi + 1) + ' 列';
  if (tp) tp.textContent = '点画布或按钮换列';
}

function simNextCase() {
  SIM.ci = (SIM.ci + 1) % SIM_CASES.length;
  SIM.xi = 2;
  simDraw();
  simLog('切换到 <span class="hl">' + simC().type + '</span>：' + simC().name + '，' + simC().concl);
}

function simNextX() {
  SIM.xi = (SIM.xi + 1) % 6;
  simDraw();
  var c = simC();
  simLog('换到第 <span class="hl">' + (SIM.xi + 1) + '</span> 列：x = ' + c.xs[SIM.xi] +
         '，y = ' + c.ys[SIM.xi] + '，' + c.rowhd + ' = ' + c.vals[SIM.xi]);
}

function simReset() {
  SIM.ci = 0; SIM.xi = 2;
  simDraw();
  simLog('重来：回到正比例第 3 列');
}

function simRunAll() {
  SIM.xi = 5;
  simDraw();
  simLog('一键到最后一列，' + simC().rowhd + ' 依然处处相等');
}

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function () { simNextX(); });
}

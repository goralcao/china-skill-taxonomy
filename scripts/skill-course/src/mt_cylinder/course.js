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

// ===== 仿真：等底等高倒水三次，看出 1/3 =====
var PI = 3.14;
var SIM_CASES = [[3, 10], [2, 8], [4, 6], [5, 9]];
var CY_TOP = 110, CY_BOT = 270, CY_H = CY_BOT - CY_TOP;
var SIM = { ci: 0, pours: 0 };

function simR() { return SIM_CASES[SIM.ci][0]; }
function simH() { return SIM_CASES[SIM.ci][1]; }
function simBase() { return PI * simR() * simR(); }
function simVCyl() { return simBase() * simH(); }
function simVCon() { return simVCyl() / 3; }
function simNum(v) { return Math.round(v * 100) / 100; }
function simCase() { return SIM.ci + '/' + SIM.pours; }

function simEllipse(cx, cy, rx, ry, fill, stroke, w) {
  var ctx = simCtx();
  ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = w || 1.6; ctx.stroke(); }
  ctx.restore();
}

function simPoly(pts, fill, stroke, w) {
  var ctx = simCtx();
  ctx.save(); ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = w || 1.6; ctx.stroke(); }
  ctx.restore();
}

function simDrawCylinder() {
  var cx = 145, hw = 50;
  simPoly([[cx - hw, CY_TOP], [cx + hw, CY_TOP], [cx + hw, CY_BOT], [cx - hw, CY_BOT]],
          '#E0F7FA', '#00838F', 2);
  var left = 3 - SIM.pours;
  if (left > 0) {
    var wh = CY_H * left / 3;
    simPoly([[cx - hw, CY_BOT - wh], [cx + hw, CY_BOT - wh],
             [cx + hw, CY_BOT], [cx - hw, CY_BOT]], 'rgba(79,195,247,.55)', null);
  }
  for (var k = 1; k < 3; k++) {
    var y = CY_TOP + CY_H * k / 3;
    simLine(cx - hw, y, cx + hw, y, 'rgba(0,131,143,.45)', 1, [4, 3]);
  }
  simEllipse(cx, CY_TOP, hw, 11, '#B2EBF2', '#00838F', 2);
  simEllipse(cx, CY_BOT, hw, 11, null, '#00838F', 2);
}

function simDrawCone() {
  var cx = 390, hw = 50;
  simPoly([[cx, CY_TOP], [cx + hw, CY_BOT], [cx - hw, CY_BOT]],
          '#FFF8E1', '#FFB300', 2);
  for (var m = 0; m < SIM.pours; m++) {
    var yB = CY_BOT - CY_H * m / 3;
    var yT = CY_BOT - CY_H * (m + 1) / 3;
    var wB = hw * (yB - CY_TOP) / CY_H;
    var wT = hw * (yT - CY_TOP) / CY_H;
    simPoly([[cx - wB, yB], [cx + wB, yB], [cx + wT, yT], [cx - wT, yT]],
            'rgba(79,195,247,.6)', null);
  }
  for (var k = 1; k < 3; k++) {
    var y = CY_TOP + CY_H * k / 3;
    var w = hw * (y - CY_TOP) / CY_H;
    simLine(cx - w, y, cx + w, y, 'rgba(230,81,0,.35)', 1, [4, 3]);
  }
  simEllipse(cx, CY_BOT, hw, 11, null, '#FFB300', 2);
}

function simDrawPanel() {
  simBox(500, 84, 346, 250, '#FFFFFF', '#80DEEA', 10);
  simTxt('尺寸', 522, 112, 12, '#607D8B');
  simTxt('r = ' + simR() + ' 厘米　h = ' + simH() + ' 厘米', 522, 138, 16, '#00838F', '700');
  simLine(522, 152, 824, 152, '#E0F7FA', 1.2);

  simTxt('底面积 πr²', 522, 176, 12, '#607D8B');
  simTxt(PI + ' × ' + simR() + '² = ' + simNum(simBase()) + ' cm²', 522, 200, 14, '#006064', '700');
  simTxt('圆柱 V = 底面积 × 高', 522, 228, 12, '#607D8B');
  simTxt(simNum(simVCyl()) + ' cm³', 522, 252, 16, '#00838F', '700');

  simLine(522, 266, 824, 266, '#E0F7FA', 1.2);
  simTxt('圆锥 V = V柱 ÷ 3 = ' + simNum(simVCon()) + ' cm³', 522, 292, 13, '#E65100', '700');
  simTxt('已倒 ' + SIM.pours + ' / 3 次　·　等底等高', 522, 316, 12, '#607D8B');
}

function simRefresh() {
  var ro = document.getElementById('simReadout');
  var tp = document.getElementById('simTip');
  if (ro) ro.textContent = '第 ' + (SIM.ci + 1) + ' 组 · r=' + simR() + ' 厘米，h=' + simH() +
    ' 厘米 · 已倒 ' + SIM.pours + ' / 3 次';
  if (tp) tp.textContent = SIM.pours >= 3 ? '倒满了，点「换一组尺寸」' : '点画布或按钮倒水';
}

function simDraw() {
  var ctx = simCtx();
  if (!ctx) return;
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.save(); ctx.fillStyle = '#FBFEFF'; ctx.fillRect(0, 0, SIM_W, SIM_H); ctx.restore();

  simTxt('第 ' + (SIM.ci + 1) + ' 组 · r = ' + simR() + ' 厘米，h = ' + simH() +
         ' 厘米 · 已倒 ' + SIM.pours + ' / 3 次', 34, 34, 16, '#006064', '700');
  simTxt('把圆柱里的水分成 3 份，一份一份倒进等底等高的圆锥', 34, 58, 12.5, '#607D8B');

  simDrawCylinder();
  simDrawCone();

  simTxt('圆柱（水剩 ' + (3 - SIM.pours) + ' 份）', 145, 96, 12, '#00838F', '700', 'center');
  simTxt('圆锥（装了 ' + SIM.pours + ' 份）', 390, 96, 12, '#E65100', '700', 'center');
  simTxt('一份一份倒 →', 267, 182, 12, '#E65100', '700', 'center');
  simTxt('3 次正好装满', 267, 206, 12, '#E65100', '700', 'center');

  simTxt('圆柱', 145, 296, 12, '#00838F', '700', 'center');
  simTxt('已倒 ' + SIM.pours + ' / 3 次', 267, 296, 13, '#006064', '700', 'center');
  simTxt('圆锥', 390, 296, 12, '#E65100', '700', 'center');
  simTxt('每倒 1 次 = 1/3 圆柱 = 1 个等底等高圆锥的体积', 40, 322, 11.5, '#607D8B');

  simDrawPanel();
  simRefresh();
}

function simPour() {
  if (SIM.pours >= 3) { simLog('已经倒满 3 次了，点「换一组尺寸」或「重来」'); return; }
  SIM.pours++;
  simDraw();
  simLog('第 ' + SIM.pours + ' 次倒水 → 圆锥装到 <span class="hl">' + SIM.pours + '/3</span>');
}

function simNextCase() {
  SIM.ci = (SIM.ci + 1) % SIM_CASES.length;
  SIM.pours = 0;
  simDraw();
  simLog('换一组：r = <span class="hl">' + simR() + '</span>，h = ' + simH() + ' 厘米，圆柱重新装满');
}

function simReset() {
  SIM.pours = 0;
  simDraw();
  simLog('重来：圆柱重新装满，圆锥倒空');
}

function simRunAll() {
  SIM.pours = 3;
  simDraw();
  simLog('一键倒满：3 次正好装满，V锥 = 1/3 V柱');
}

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function () { simPour(); });
}

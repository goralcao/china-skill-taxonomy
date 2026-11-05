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

// ===== 仿真：两列数量同步缩放，比值始终不变 =====
var SIM_CASES = [[2, 3], [1, 2], [3, 4], [3, 5], [4, 6], [5, 8]];
var SIM_MAXK = 5;
var SIM = { ci: 0, k: 1 };

function simV() { return SIM_CASES[SIM.ci]; }
function simRatioText() {
  var v = simV(), r = simReduce(v[0], v[1]);
  return r[1] === 1 ? String(r[0]) : r[0] + '/' + r[1];
}
function simLabel() {
  var v = simV();
  return v[0] + ' : ' + v[1];
}

function simDraw() {
  var ctx = simCtx();
  if (!ctx) return;
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.save(); ctx.fillStyle = '#FEFDFF'; ctx.fillRect(0, 0, SIM_W, SIM_H); ctx.restore();

  var v = simV(), a = v[0] * SIM.k, b = v[1] * SIM.k;
  simTxt('第 ' + (SIM.ci + 1) + ' 组 · 基础比 ' + simLabel() + ' · 同时 ×' + SIM.k,
         34, 34, 17, '#4527A0', '700');
  simTxt('两列都放大 ' + SIM.k + ' 倍：前项 ' + a + '，后项 ' + b + '，比值仍是 ' + simRatioText(),
         34, 58, 12.5, '#607D8B');

  // 两列柱状：按最大格数缩放
  var maxv = Math.max(a, b) * SIM_MAXK;
  var unit = 200 / Math.max(1, maxv);
  var baseY = 300;
  var hA = a * unit, hB = b * unit;

  simLine(60, baseY, 430, baseY, '#B39DDB', 1.6);
  simBox(110, baseY - hA, 110, hA, '#FFE082', '#F9A825', 4);
  simBox(270, baseY - hB, 110, hB, '#B39DDB', '#4527A0', 4);
  simTxt(String(a), 165, baseY - hA - 12, 20, '#E65100', '700', 'center');
  simTxt(String(b), 325, baseY - hB - 12, 20, '#4527A0', '700', 'center');
  simTxt('前项', 165, baseY + 24, 13, '#E65100', '700', 'center');
  simTxt('后项', 325, baseY + 24, 13, '#4527A0', '700', 'center');

  // 同步缩放箭头
  simTxt('×' + SIM.k, 220, 130, 22, '#FFA000', '700', 'center');
  simTxt('同时乘', 220, 152, 11, '#607D8B', '', 'center');

  simDrawPanel(v, a, b);
  simRefresh();
}

function simDrawPanel(v, a, b) {
  simBox(486, 84, 360, 250, '#FFFFFF', '#B39DDB', 10);
  simTxt('基础比', 508, 112, 12, '#8D6E63');
  simTxt(simLabel(), 508, 142, 22, '#4527A0', '700');
  simLine(508, 158, 824, 158, '#EDE7F6', 1.2);

  simTxt('同时 ×' + SIM.k, 508, 182, 12, '#8D6E63');
  simTxt('(' + v[0] + '×' + SIM.k + ') : (' + v[1] + '×' + SIM.k + ')', 508, 208, 15, '#E65100', '700');
  simTxt('= ' + a + ' : ' + b, 508, 234, 15, '#4527A0', '700');

  simLine(508, 250, 824, 250, '#EDE7F6', 1.2);
  simTxt('比值', 508, 276, 12, '#8D6E63');
  simTxt(simRatioText(), 690, 278, 24, '#2E7D32', '700');
  simTxt(a + ' ÷ ' + b + ' = ' + v[0] + ' ÷ ' + v[1] + ' = ' + simRatioText(),
         508, 306, 12, '#607D8B');
  simTxt('k 变了，比值一点没变', 508, 326, 11.5, '#2E7D32', '700');
}

function simRefresh() {
  var ro = document.getElementById('simReadout');
  var tp = document.getElementById('simTip');
  if (ro) ro.textContent = '第 ' + (SIM.ci + 1) + ' 组 · 基础比 ' + simLabel() +
    ' · 放大 ×' + SIM.k + ' · 比值 ' + simRatioText();
  if (tp) tp.textContent = SIM.k >= SIM_MAXK ? '到顶了，点「换一组比」' : '点画布或「放大一档」继续';
}

function simZoom() {
  if (SIM.k >= SIM_MAXK) { simLog('最多放大 ×' + SIM_MAXK + '，点「换一组比」'); return; }
  SIM.k++;
  simDraw();
  var v = simV();
  simLog('同乘 ' + SIM.k + '：' + (v[0] * SIM.k) + ' : ' + (v[1] * SIM.k) +
         '，比值仍是 <span class="hl">' + simRatioText() + '</span>');
}

function simRunAll() {
  SIM.k = SIM_MAXK;
  simDraw();
  simLog('放大到底：' + (simV()[0] * SIM.k) + ' : ' + (simV()[1] * SIM.k) +
         '，比值还是 <span class="hl">' + simRatioText() + '</span>');
}

function simNextCase() {
  SIM.ci = (SIM.ci + 1) % SIM_CASES.length;
  SIM.k = 1;
  simDraw();
  simLog('换一组：基础比 <span class="hl">' + simLabel() + '</span>，比值 ' + simRatioText());
}

function simReset() {
  SIM.k = 1;
  simDraw();
  simLog('重来：回到 ×1 的基础比');
}

function simCase() { return SIM.ci + '/' + SIM.k; }

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function () { simZoom(); });
}

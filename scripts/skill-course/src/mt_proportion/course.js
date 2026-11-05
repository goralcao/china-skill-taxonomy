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

// ===== 仿真：两比同步放大 —— 外项积恒等于内项积 =====
var SIM_CASES = [[2, 3], [3, 4], [1, 2], [3, 5], [4, 6]];
var SIM = { ci: 0, k: 2 };

function simA() { return SIM_CASES[SIM.ci][0]; }
function simB() { return SIM_CASES[SIM.ci][1]; }
function simC() { return simA() * SIM.k; }
function simD() { return simB() * SIM.k; }
function simExprText() { return simA() + ':' + simB() + ' = ' + simC() + ':' + simD(); }
function simCase() { return SIM.ci + '/' + SIM.k; }

function simNumBox(x, val, fill, txtColor) {
  simBox(x, 130, 70, 60, fill, null, 8);
  simTxt(String(val), x + 35, 172, 24, txtColor, '700', 'center');
}

function simDraw() {
  var ctx = simCtx();
  if (!ctx) return;
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.save(); ctx.fillStyle = '#FFFCFA'; ctx.fillRect(0, 0, SIM_W, SIM_H); ctx.restore();

  simTxt('第 ' + (SIM.ci + 1) + ' 组 · 基础比 ' + simA() + ':' + simB() +
         ' · 放大 ×' + SIM.k, 34, 34, 17, '#4E342E', '700');
  simTxt('两个比同时乘同一个倍数，比值不变，所以等号一直成立', 34, 58, 12.5, '#8D6E63');

  // 四个项：外项青色、内项橙色
  simNumBox(50, simA(), '#26C6DA', '#FFFFFF');
  simNumBox(150, simB(), '#FFB74D', '#3E2723');
  simNumBox(270, simC(), '#FFB74D', '#3E2723');
  simNumBox(370, simD(), '#26C6DA', '#FFFFFF');
  simTxt(':', 135, 172, 22, '#4E342E', '700', 'center');
  simTxt('=', 245, 172, 22, '#4E342E', '700', 'center');
  simTxt(':', 355, 172, 22, '#4E342E', '700', 'center');

  simTxt('外项', 85, 112, 11.5, '#00838F', '700', 'center');
  simTxt('内项', 185, 112, 11.5, '#E65100', '700', 'center');
  simTxt('内项', 305, 112, 11.5, '#E65100', '700', 'center');
  simTxt('外项', 405, 112, 11.5, '#00838F', '700', 'center');
  simTxt('两个比同时乘 ' + SIM.k + '，比值仍是 ' + simA() + '/' + simB(),
         245, 216, 12, '#6D4C41', '', 'center');

  simTxt('外项积　' + simA() + ' × ' + simD() + ' = ' + (simA() * simD()),
         50, 254, 14, '#00838F', '700');
  simTxt('内项积　' + simB() + ' × ' + simC() + ' = ' + (simB() * simC()),
         50, 282, 14, '#E65100', '700');
  simTxt('相等 ✓　外项积 = 内项积', 50, 312, 14, '#2E7D32', '700');

  simDrawPanel();
  simRefresh();
}

function simDrawPanel() {
  simBox(500, 84, 346, 258, '#FFFFFF', '#D7CCC8', 10);
  simTxt('当前比例', 522, 112, 12, '#8D6E63');
  simTxt(simExprText(), 522, 142, 20, '#4E342E', '700');
  simLine(522, 158, 824, 158, '#EFEBE9', 1.2);

  simTxt('放大倍数', 522, 182, 12, '#8D6E63');
  simTxt('× ' + SIM.k + '（两比同时乘 ' + SIM.k + '）', 522, 208, 15, '#00838F', '700');
  simTxt('交叉相乘验算', 522, 238, 12, '#8D6E63');
  simTxt(simA() + ' × ' + simD() + ' = ' + (simA() * simD()) +
         '　' + simB() + ' × ' + simC() + ' = ' + (simB() * simC()),
         522, 262, 13, '#4E342E', '700');

  simLine(522, 278, 824, 278, '#EFEBE9', 1.2);
  simTxt('比值不变，所以能写成比例', 522, 302, 12, '#2E7D32', '700');
  simTxt('换基础比或调倍数，等式始终成立', 522, 322, 11, '#8D6E63');
}

function simRefresh() {
  var ro = document.getElementById('simReadout');
  var tp = document.getElementById('simTip');
  if (ro) ro.textContent = '第 ' + (SIM.ci + 1) + ' 组 · ' + simExprText() + ' · 放大 ×' + SIM.k;
  if (tp) tp.textContent = SIM.k >= 6 ? '到 ×6 了，点「换一组比」' : '点画布或按钮调节倍数';
}

function simUp() {
  if (SIM.k >= 6) { simLog('最大放大到 ×6，点「换一组比」看看'); return; }
  SIM.k++;
  simDraw();
  simLog('放大到 <span class="hl">×' + SIM.k + '</span>：' + simExprText());
}

function simDown() {
  if (SIM.k <= 1) { simLog('最小是 ×1，两个比本来就一样'); return; }
  SIM.k--;
  simDraw();
  simLog('缩小到 <span class="hl">×' + SIM.k + '</span>：' + simExprText());
}

function simNextCase() {
  SIM.ci = (SIM.ci + 1) % SIM_CASES.length;
  SIM.k = 2;
  simDraw();
  simLog('换一组基础比：<span class="hl">' + simA() + ':' + simB() + '</span>');
}

function simReset() {
  SIM.ci = 0; SIM.k = 2;
  simDraw();
  simLog('重来：回到 2:3 = 4:6');
}

function simRunAll() {
  SIM.k = 6;
  simDraw();
  simLog('一键放大到 ×6：' + simExprText() + '，两边仍相等');
}

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function () { simUp(); });
}

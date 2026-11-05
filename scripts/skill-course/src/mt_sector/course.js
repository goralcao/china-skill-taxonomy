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

// ===== 仿真：拖圆心角 —— 扇形随角度张开，占比 = 角度 / 360° =====
var SIM_CASES = [60, 90, 120, 180, 45];
var SIM_R = 6;   // 固定半径 6 厘米
var PI = 3.14;
var SIM = { ci: 0, deg: 60 };

function simFracText() {
  var r = simReduce(SIM.deg, 360);
  return r[0] + '/' + r[1];
}
function simArea() { return PI * SIM_R * SIM_R * SIM.deg / 360; }
function simArcLen() { return 2 * PI * SIM_R * SIM.deg / 360; }

function simDraw() {
  var ctx = simCtx();
  if (!ctx) return;
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.save(); ctx.fillStyle = '#FFFDFB'; ctx.fillRect(0, 0, SIM_W, SIM_H); ctx.restore();

  var cx = 225, cy = 196, rad = 128;
  simTxt('第 ' + (SIM.ci + 1) + ' 组 · 圆心角 ' + SIM.deg + '° · 占圆 ' + simFracText(),
         34, 34, 17, '#E65100', '700');
  simTxt('半径固定 6 厘米，只改变圆心角：扇形大小只由角度决定', 34, 58, 12.5, '#607D8B');

  // 整圆底色
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2);
  ctx.fillStyle = '#FFF3E0'; ctx.fill();
  ctx.strokeStyle = '#FFCC80'; ctx.lineWidth = 1.6; ctx.stroke();
  ctx.restore();

  // 扇形
  var a0 = -Math.PI / 2, a1 = a0 + SIM.deg * Math.PI / 180;
  simArc(cx, cy, rad, a0, a1, '#4DD0E1', '#00838F', 2);

  // 两条半径 + 圆心
  simLine(cx, cy, cx, cy - rad, '#E65100', 2.4);
  simLine(cx, cy, cx + rad * Math.cos(a1), cy + rad * Math.sin(a1), '#E65100', 2.4);
  simDot(cx, cy, 5, '#E65100');

  // 角度标注
  var mid = a0 + (a1 - a0) / 2;
  simTxt(SIM.deg + '°', cx + 46 * Math.cos(mid), cy + 46 * Math.sin(mid) + 5,
         15, '#BF360C', '700', 'center');
  simTxt('圆心 O', cx - 10, cy - 12, 11, '#E65100', '700', 'right');
  simTxt('r = 6 厘米', cx + rad * Math.cos(a1) * 0.6, cy + rad * Math.sin(a1) * 0.6 + 20,
         11.5, '#00838F', '700');

  simDrawPanel();
  simRefresh();
}

function simDrawPanel() {
  simBox(490, 84, 356, 258, '#FFFFFF', '#FFCC80', 10);
  simTxt('本组数据', 512, 112, 12, '#8D6E63');
  simTxt('圆心角 ' + SIM.deg + '°', 512, 142, 21, '#E65100', '700');
  simLine(512, 158, 824, 158, '#FFF3E0', 1.2);

  simTxt('占整个圆', 512, 182, 12, '#8D6E63');
  simTxt(SIM.deg + '° ÷ 360° = ' + simFracText(), 512, 208, 16, '#00838F', '700');

  simTxt('扇形面积', 512, 234, 12, '#8D6E63');
  simTxt('3.14 × 36 × ' + simFracText() + ' = ' + simArea().toFixed(2) + ' 平方厘米',
         512, 258, 13, '#E65100', '700');

  simLine(512, 274, 824, 274, '#FFF3E0', 1.2);
  simTxt('弧长 = 2πr × 占比 = ' + simArcLen().toFixed(2) + ' 厘米', 512, 296, 12, '#37474F');
  simTxt('换成统计图角度：占比 × 360°', 512, 318, 11.5, '#607D8B');
}

function simRefresh() {
  var ro = document.getElementById('simReadout');
  var tp = document.getElementById('simTip');
  if (ro) ro.textContent = '第 ' + (SIM.ci + 1) + ' 组 · 圆心角 ' + SIM.deg +
    '° · 占圆 ' + simFracText();
  if (tp) tp.textContent = SIM.deg >= 180 ? '到半圆了，点「换一组」' : '点画布或「加大角度」继续';
}

function simGrow() {
  if (SIM.deg >= 180) { simLog('最大演示到 180°（半圆），点「换一组」'); return; }
  SIM.deg += 30;
  if (SIM.deg > 180) SIM.deg = 180;
  simDraw();
  simLog('角度加到 <span class="hl">' + SIM.deg + '°</span>，占圆 ' + simFracText() +
         '，面积 ' + simArea().toFixed(2) + ' 平方厘米');
}

function simRunAll() {
  SIM.deg = 180;
  simDraw();
  simLog('一键到底：180° 是半圆，占 <span class="hl">1/2</span>，面积 ' + simArea().toFixed(2) + ' 平方厘米');
}

function simNextCase() {
  SIM.ci = (SIM.ci + 1) % SIM_CASES.length;
  SIM.deg = SIM_CASES[SIM.ci];
  simDraw();
  simLog('换一组：起始圆心角 <span class="hl">' + SIM.deg + '°</span>');
}

function simReset() {
  SIM.deg = SIM_CASES[SIM.ci];
  simDraw();
  simLog('重来：回到本组起始角度');
}

function simCase() { return SIM.ci + '/' + SIM.deg; }

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function () { simGrow(); });
}

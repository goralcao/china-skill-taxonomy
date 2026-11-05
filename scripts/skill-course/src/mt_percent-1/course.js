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

// ===== 仿真：百格图 —— 涂几格，百分数 / 小数 / 分数同步变 =====
var SIM_CASES = [25, 8, 50, 37, 75, 90];
var SIM = { ci: 0, n: 25 };

function simLabel() {
  var r = simReduce(SIM.n, 100);
  return { pct: SIM.n + '%', dec: (SIM.n / 100).toFixed(2).replace(/0$/, ''),
           frac: r[0] + '/' + r[1] };
}
function simDecText() {
  var v = SIM.n / 100;
  var s = String(v);
  return s;
}

function simDraw() {
  var ctx = simCtx();
  if (!ctx) return;
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.save(); ctx.fillStyle = '#FDFDFF'; ctx.fillRect(0, 0, SIM_W, SIM_H); ctx.restore();

  simTxt('第 ' + (SIM.ci + 1) + ' 组 · 已涂 ' + SIM.n + ' 格 / 共 100 格',
         34, 34, 17, '#283593', '700');
  simTxt('涂色格数就是百分号前面的数：分母固定为 100', 34, 58, 12.5, '#607D8B');

  // 百格图
  var x0 = 40, y0 = 84, cell = 24;
  for (var i = 0; i < 100; i++) {
    var r = Math.floor(i / 10), c = i % 10;
    var fill = i < SIM.n ? '#FFB74D' : '#E8EAF6';
    simBox(x0 + c * cell, y0 + r * cell, cell, cell, fill, '#C5CAE9', 0);
  }
  ctx.save(); ctx.strokeStyle = '#283593'; ctx.lineWidth = 2;
  ctx.strokeRect(x0, y0, cell * 10, cell * 10); ctx.restore();
  simTxt(SIM.n + ' 格 / 100 格', x0 + cell * 5, y0 + cell * 10 + 22, 12.5, '#283593', '700', 'center');

  simDrawPanel();
  simRefresh();
}

function simDrawPanel() {
  var t = simLabel();
  simBox(350, 84, 496, 250, '#FFFFFF', '#C5CAE9', 10);
  simTxt('同一个量，三种写法', 372, 112, 12, '#8D6E63');
  simLine(372, 126, 824, 126, '#E8EAF6', 1.2);

  simTxt('百分数', 372, 152, 12, '#8D6E63');
  simTxt(t.pct, 372, 184, 30, '#283593', '700');
  simTxt('分母固定 100', 560, 176, 11.5, '#607D8B');

  simTxt('小数', 372, 214, 12, '#8D6E63');
  simTxt(simDecText(), 372, 244, 26, '#E65100', '700');
  simTxt('去 %，小数点左移两位', 560, 238, 11.5, '#607D8B');

  simTxt('分数', 372, 272, 12, '#8D6E63');
  simTxt(t.frac, 372, 302, 26, '#2E7D32', '700');
  simTxt('写成 ' + SIM.n + '/100 再约分', 560, 296, 11.5, '#607D8B');
}

function simRefresh() {
  var t = simLabel();
  var ro = document.getElementById('simReadout');
  var tp = document.getElementById('simTip');
  if (ro) ro.textContent = '第 ' + (SIM.ci + 1) + ' 组 · 已涂 ' + SIM.n + ' 格 · ' +
    t.pct + ' = ' + simDecText() + ' = ' + t.frac;
  if (tp) tp.textContent = SIM.n >= 100 ? '涂满了，点「换一组」' : '点画布或「多涂 10 格」继续';
}

function simAdd10() {
  if (SIM.n >= 100) { simLog('已经涂满 100 格了，点「换一组」'); return; }
  SIM.n = Math.min(100, SIM.n + 10);
  simDraw();
  var t = simLabel();
  simLog('涂到 <span class="hl">' + SIM.n + ' 格</span>：' + t.pct + ' = ' + simDecText() + ' = ' + t.frac);
}

function simRunAll() {
  SIM.n = 100;
  simDraw();
  simLog('一键涂满：100% = 1 = 1/1，代表整个整体');
}

function simNextCase() {
  SIM.ci = (SIM.ci + 1) % SIM_CASES.length;
  SIM.n = SIM_CASES[SIM.ci];
  simDraw();
  var t = simLabel();
  simLog('换一组：起始 <span class="hl">' + t.pct + '</span> = ' + simDecText() + ' = ' + t.frac);
}

function simReset() {
  SIM.n = SIM_CASES[SIM.ci];
  simDraw();
  simLog('重来：回到本组起始格数');
}

function simCase() { return SIM.ci + '/' + SIM.n; }

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function () { simAdd10(); });
}

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

// ===== 仿真：分数条切分 —— 统一小格，一段段切，数段数即商 =====
// 每组 [被除数分子, 被除数分母, 除数分子, 除数分母]，商均为整数，便于数段
var SIM_CASES = [[3, 4, 1, 8], [2, 3, 1, 6], [5, 6, 1, 6],
                 [4, 5, 2, 5], [3, 4, 3, 8], [7, 8, 1, 8]];
var SIM = { ci: 0, cut: 0 };

function simV() { return SIM_CASES[SIM.ci]; }
function simLcm(a, b) { return a / simGcd(a, b) * b; }
function simLabel() {
  var v = simV();
  return v[0] + '/' + v[1] + ' ÷ ' + v[2] + '/' + v[3];
}
function simCells() {
  // 统一成 1/L 的小格：被除数占 n1*(L/d1) 格，除数占 n2*(L/d2) 格
  var v = simV(), L = simLcm(v[1], v[3]);
  return { L: L, total: v[0] * (L / v[1]), per: v[2] * (L / v[3]) };
}
function simSegments() {
  var c = simCells();
  return c.per ? Math.round(c.total / c.per) : 0;
}
function simResultText() {
  var v = simV(), r = simReduce(v[0] * v[3], v[1] * v[2]);
  return r[1] === 1 ? String(r[0]) : r[0] + '/' + r[1];
}

var GX = 40, GY = 126, GW = 410;

function simDraw() {
  var ctx = simCtx();
  if (!ctx) return;
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.save(); ctx.fillStyle = '#FFFDFE'; ctx.fillRect(0, 0, SIM_W, SIM_H); ctx.restore();

  var v = simV(), c = simCells(), segs = simSegments();
  simTxt('第 ' + (SIM.ci + 1) + ' 组 · ' + simLabel(), 34, 34, 18, '#AD1457', '700');
  simTxt('把两个数都换成 1/' + c.L + ' 的小格：被除数共 ' + c.total +
         ' 格，每 ' + c.per + ' 格切一段', 34, 58, 12.5, '#607D8B');

  // 分数条：total 格
  var cw = GW / c.total;
  for (var i = 0; i < c.total; i++) {
    var cutDone = i < SIM.cut * c.per;
    simBox(GX + i * cw, GY, cw, 56, cutDone ? '#26C6DA' : '#F8BBD0', '#AD1457', 0);
  }
  ctx.save(); ctx.strokeStyle = '#AD1457'; ctx.lineWidth = 2.2;
  ctx.strokeRect(GX, GY, GW, 56); ctx.restore();

  // 每段分隔虚线 + 段号
  for (var s = 1; s <= segs; s++) {
    var x = GX + s * c.per * cw;
    simLine(x, GY - 8, x, GY + 64, '#00838F', 2, [4, 3]);
    simTxt('第' + s + '段', x - c.per * cw / 2, GY - 14, 10.5,
           s <= SIM.cut ? '#00838F' : '#B0BEC5', '700', 'center');
  }
  simTxt('已切 ' + SIM.cut + ' / ' + segs + ' 段', GX, GY + 92, 15, '#AD1457', '700');
  simTxt('蓝色 = 已切出的整段　·　粉色 = 还没切的', GX, GY + 116, 11.5, '#607D8B');

  simDrawPanel(v, c, segs);
  simRefresh();
}

function simDrawPanel(v, c, segs) {
  simBox(486, 84, 360, 250, '#FFFFFF', '#F8BBD0', 10);
  simTxt('算式', 508, 112, 12, '#8D6E63');
  simTxt(simLabel(), 508, 142, 22, '#AD1457', '700');
  simLine(508, 158, 824, 158, '#FCE4EC', 1.2);

  simTxt('除以 → 乘倒数', 508, 182, 12, '#8D6E63');
  simTxt('= ' + v[0] + '/' + v[1] + ' × ' + v[3] + '/' + v[2], 508, 208, 15, '#00838F', '700');
  simTxt('= ' + (v[0] * v[3]) + '/' + (v[1] * v[2]), 508, 234, 14, '#37474F', '700');

  simLine(508, 250, 824, 250, '#FCE4EC', 1.2);
  simTxt('商（段数）', 508, 276, 12, '#8D6E63');
  simTxt(simResultText(), 690, 278, 24, '#AD1457', '700');
  simTxt(c.total + ' 格 ÷ 每段 ' + c.per + ' 格 = ' + segs + ' 段', 508, 306, 12.5, '#607D8B');
  simTxt('只把除数取倒数，被除数原样不动', 508, 326, 11, '#607D8B');
}

function simRefresh() {
  var ro = document.getElementById('simReadout');
  var tp = document.getElementById('simTip');
  var segs = simSegments();
  if (ro) ro.textContent = '第 ' + (SIM.ci + 1) + ' 组 · ' + simLabel() +
    ' · 已切 ' + SIM.cut + '/' + segs + ' 段';
  if (tp) tp.textContent = SIM.cut >= segs ? '切完了，点「换一组」' : '点画布或「切一段」继续';
}

function simStep() {
  var segs = simSegments();
  if (SIM.cut >= segs) { simLog('已经切完了，点「换一组」看别的算式'); return; }
  SIM.cut++;
  simDraw();
  var c = simCells();
  simLog('切第 <span class="hl">' + SIM.cut + ' 段</span>：用掉 ' + c.per +
         ' 个小格，累计 ' + (SIM.cut * c.per) + '/' + c.total + ' 格');
}

function simRunAll() {
  SIM.cut = simSegments();
  simDraw();
  simLog('一键到底：' + simLabel() + ' = <span class="hl">' + simResultText() +
         '</span>，共 ' + SIM.cut + ' 段');
}

function simNextCase() {
  SIM.ci = (SIM.ci + 1) % SIM_CASES.length;
  SIM.cut = 0;
  simDraw();
  simLog('换一组：<span class="hl">' + simLabel() + '</span>，重新切');
}

function simReset() {
  SIM.cut = 0;
  simDraw();
  simLog('重来：回到一段都没切');
}

function simCase() { return SIM.ci + '/' + SIM.cut; }

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function () { simStep(); });
}

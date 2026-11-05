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

// ===== 仿真：面积模型 —— 横切一刀取 a/b，竖切一刀取 c/d，数重叠格子 =====
var SIM_CASES = [[2, 3, 3, 5], [3, 4, 1, 2], [1, 2, 3, 4], [2, 5, 2, 3],
                 [3, 5, 1, 2], [4, 7, 2, 3]];
var SIM = { ci: 0, step: 0 };

function simVals() { return SIM_CASES[SIM.ci]; }
function simLabel() {
  var v = simVals();
  return v[0] + '/' + v[1] + ' × ' + v[2] + '/' + v[3];
}

var GX = 44, GY = 84, GW = 396, GH = 240;

function simCell(i, j, b, d) {
  return { x: GX + j * GW / d, y: GY + i * GH / b,
           w: GW / d, h: GH / b };
}

function simDraw() {
  var ctx = simCtx();
  if (!ctx) return;
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.save(); ctx.fillStyle = '#FFFDFC'; ctx.fillRect(0, 0, SIM_W, SIM_H); ctx.restore();

  var v = simVals(), a = v[0], b = v[1], c = v[2], d = v[3];
  simTxt('第 ' + (SIM.ci + 1) + ' 组 · ' + simLabel() +
         (SIM.step === 0 ? ' · 一张完整的饼' : ''), 34, 34, 17, '#C62828', '700');
  simTxt(SIM.step === 0 ? '先横切：横向平均分成 ' + b + ' 份，取其中 ' + a + ' 份'
         : SIM.step === 1 ? '再竖切：纵向平均分成 ' + d + ' 份，取其中 ' + c + ' 份'
         : SIM.step === 2 ? '数一数重叠的深色格子' : '把结果约成最简分数',
         34, 58, 12.5, '#6D4C41');

  // 网格底色 + 逐步涂色
  for (var i = 0; i < b; i++) {
    for (var j = 0; j < d; j++) {
      var q = simCell(i, j, b, d);
      var fill = '#FFFFFF';
      if (SIM.step >= 1 && i < a) fill = '#FFCDD2';           // 横向取的 a 行
      if (SIM.step >= 2 && j < c) fill = i < a ? '#EF9A9A' : '#FFE082'; // 纵向取的 c 列
      if (SIM.step >= 3 && i < a && j < c) fill = '#E53935';   // 重叠
      simBox(q.x, q.y, q.w, q.h, fill, '#B71C1C', 0);
    }
  }
  // 外框
  ctx.save(); ctx.strokeStyle = '#B71C1C'; ctx.lineWidth = 2.4;
  ctx.strokeRect(GX, GY, GW, GH); ctx.restore();

  // 标注：横向 a 行 / 纵向 c 列
  if (SIM.step >= 1) {
    simLine(GX - 12, GY, GX - 12, GY + GH * a / b, '#C62828', 3);
    simTxt(a + '/' + b, GX - 18, GY + GH * a / (2 * b) + 4, 12, '#C62828', '700', 'right');
  }
  if (SIM.step >= 2) {
    simLine(GX, GY - 12, GX + GW * c / d, GY - 12, '#E65100', 3);
    simTxt(c + '/' + d, GX + GW * c / (2 * d), GY - 18, 12, '#E65100', '700', 'center');
  }

  simDrawPanel(a, b, c, d);
  simRefresh();
}

function simDrawPanel(a, b, c, d) {
  var num = a * c, den = b * d, r = simReduce(num, den);
  simBox(486, 54, 360, 282, '#FFFFFF', '#EF9A9A', 10);

  simTxt('算式', 508, 84, 12, '#8D6E63');
  simTxt(simLabel(), 508, 112, 22, '#C62828', '700');
  simLine(508, 128, 824, 128, '#FFEBEE', 1.2);

  simTxt('重叠格子（分子）', 508, 152, 12, '#8D6E63');
  simTxt(a + ' × ' + c + ' = ' + num, 508, 176, 16, '#C62828', '700');
  simTxt('总格子（分母）', 508, 202, 12, '#8D6E63');
  simTxt(b + ' × ' + d + ' = ' + den, 508, 226, 16, '#C62828', '700');

  simLine(508, 242, 824, 242, '#FFEBEE', 1.2);

  if (SIM.step >= 3) {
    simTxt('乘积', 508, 268, 12, '#8D6E63');
    simTxt(num + '/' + den, 640, 268, 18, '#E65100', '700');
    if (r[1] !== den) {
      simTxt('约分 → ' + r[0] + '/' + r[1], 508, 298, 16, '#2E7D32', '700');
    } else {
      simTxt('已是最简，不用约分', 508, 298, 14, '#2E7D32', '700');
    }
    simTxt('分子 ' + num + ' 和分母 ' + den + ' 的最大公因数是 ' + simGcd(num, den),
           508, 322, 11, '#6D4C41');
  } else {
    simTxt('切完两刀后，这里会显示乘积与约分结果', 508, 272, 12.5, '#90A4AE');
    simTxt('分子乘分子 · 分母乘分母', 508, 298, 12.5, '#90A4AE');
  }
}

function simRefresh() {
  var v = simVals();
  var ro = document.getElementById('simReadout');
  var tp = document.getElementById('simTip');
  var names = ['还没切', '已横切', '已竖切', '已数重叠', '已约分'];
  if (ro) ro.textContent = '第 ' + (SIM.ci + 1) + ' 组 · ' + simLabel() + ' · ' + names[SIM.step];
  if (tp) tp.textContent = SIM.step >= 4 ? '约分完成，点「换一组」' : '点画布或「切一刀」继续';
}

function simStep() {
  if (SIM.step >= 4) { simLog('这组已经算完了，点「换一组」看别的分数'); return; }
  SIM.step++;
  simDraw();
  var v = simVals(), a = v[0], b = v[1], c = v[2], d = v[3];
  if (SIM.step === 1) simLog('横切：分成 ' + b + ' 行，涂出 <span class="hl">' + a + ' 行</span>（' + a + '/' + b + '）');
  else if (SIM.step === 2) simLog('竖切：分成 ' + d + ' 列，涂出 <span class="hl">' + c + ' 列</span>（' + c + '/' + d + '）');
  else if (SIM.step === 3) simLog('重叠 <span class="hl">' + (a * c) + ' 格</span>，总共 ' + (b * d) + ' 格 → ' + (a * c) + '/' + (b * d));
  else {
    var r = simReduce(a * c, b * d);
    simLog('乘积分母分子互质后约分 → <span class="hl">' + r[0] + '/' + r[1] + '</span>');
  }
}

function simRunAll() {
  SIM.step = 4;
  simDraw();
  var v = simVals(), r = simReduce(v[0] * v[2], v[1] * v[3]);
  simLog('一键到底：' + simLabel() + ' = <span class="hl">' + r[0] + '/' + r[1] + '</span>');
}

function simNextCase() {
  SIM.ci = (SIM.ci + 1) % SIM_CASES.length;
  SIM.step = 0;
  simDraw();
  simLog('换一组：<span class="hl">' + simLabel() + '</span>，从完整的饼重新开始');
}

function simReset() {
  SIM.step = 0;
  simDraw();
  simLog('重来：回到还没切的一整张饼');
}

function simCase() { return SIM.ci + '/' + SIM.step; }

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function () { simStep(); });
}

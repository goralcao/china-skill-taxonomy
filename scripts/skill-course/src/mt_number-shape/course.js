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

// ===== 仿真：逐层加 L 形方块，算式与正方形同步长 =====
var SIM_CASES = [4, 5, 6, 7, 3];   // 每组最多摆几层
var SIM_COLS = ['#8BC34A', '#FFB300', '#42A5F5', '#AB47BC', '#26A69A', '#EF5350', '#FF7043'];
var SIM = { ci: 0, level: 1 };

function simMax() { return SIM_CASES[SIM.ci]; }
function simSum() { return SIM.level * SIM.level; }
function simLast() { return 2 * SIM.level - 1; }

function simDraw() {
  var ctx = simCtx();
  if (!ctx) return;
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.save(); ctx.fillStyle = '#FEFFF9'; ctx.fillRect(0, 0, SIM_W, SIM_H); ctx.restore();

  simTxt('第 ' + (SIM.ci + 1) + ' 组 · 已摆 ' + SIM.level + ' 层 · 连加和 ' + simSum(),
         34, 34, 17, '#33691E', '700');
  simTxt('每次沿上边和右边补一个 L 形，正方形就长大一圈', 34, 58, 12.5, '#607D8B');

  // 方块阵：按最大层数自适应格子边长
  var maxL = simMax();
  var u = Math.min(46, 250 / maxL);
  var x0 = 52, y0 = 96;
  for (var k = 0; k < SIM.level; k++) {
    for (var r = 0; r <= k; r++) {
      for (var c = 0; c <= k; c++) {
        if (r === k || c === k) {
          simBox(x0 + c * u, y0 + r * u, u, u, SIM_COLS[k % SIM_COLS.length], '#33691E', 0);
        }
      }
    }
  }
  // 已成形的外框
  ctx.save(); ctx.strokeStyle = '#33691E'; ctx.lineWidth = 2.2;
  ctx.strokeRect(x0, y0, SIM.level * u, SIM.level * u); ctx.restore();
  simTxt(SIM.level + ' × ' + SIM.level + ' 的正方形',
         x0 + SIM.level * u / 2, y0 + SIM.level * u + 24, 13, '#33691E', '700', 'center');
  simTxt('这一层添 ' + simLast() + ' 块（第 ' + SIM.level + ' 个奇数）',
         x0 + SIM.level * u / 2, y0 + SIM.level * u + 44, 11.5, '#E65100', '700', 'center');

  simDrawPanel();
  simRefresh();
}

function simDrawPanel() {
  simBox(430, 84, 416, 250, '#FFFFFF', '#AED581', 10);
  simTxt('连加算式', 452, 112, 12, '#8D6E63');
  var expr = [];
  for (var n = 1; n <= SIM.level; n++) expr.push(2 * n - 1);
  var line = expr.join(' + ');
  if (line.length > 30) line = '1 + 3 + … + ' + simLast();
  simTxt(line, 452, 142, line.length > 22 ? 15 : 18, '#33691E', '700');
  simLine(452, 158, 824, 158, '#F1F8E9', 1.2);

  simTxt('项数', 452, 182, 12, '#8D6E63');
  simTxt(String(SIM.level), 560, 184, 18, '#E65100', '700');
  simTxt('末项', 660, 182, 12, '#8D6E63');
  simTxt(String(simLast()), 740, 184, 18, '#E65100', '700');

  simTxt('累计和', 452, 214, 12, '#8D6E63');
  simTxt(simSum() + ' = ' + SIM.level + '²', 452, 244, 24, '#33691E', '700');

  simLine(452, 258, 824, 258, '#F1F8E9', 1.2);
  simTxt('第 n 项 = 2n − 1　·　前 n 项和 = n²', 452, 284, 12.5, '#37474F');
  simTxt('由末项 m 求项数：n = (m + 1) ÷ 2', 452, 308, 12, '#607D8B');
  simTxt('摆满 ' + simMax() + ' 层时，和 = ' + simMax() + '² = ' + (simMax() * simMax()),
         452, 328, 11.5, '#607D8B');
}

function simRefresh() {
  var ro = document.getElementById('simReadout');
  var tp = document.getElementById('simTip');
  if (ro) ro.textContent = '第 ' + (SIM.ci + 1) + ' 组 · 已摆 ' + SIM.level +
    ' 层 · ' + SIM.level + '² = ' + simSum();
  if (tp) tp.textContent = SIM.level >= simMax() ? '摆满了，点「换一组」' : '点画布或「加一层」继续';
}

function simAddLayer() {
  if (SIM.level >= simMax()) { simLog('这组已经摆满 ' + simMax() + ' 层，点「换一组」'); return; }
  SIM.level++;
  simDraw();
  simLog('加第 <span class="hl">' + SIM.level + ' 层</span>：添 ' + simLast() +
         ' 块，累计 ' + simSum() + ' = ' + SIM.level + '²');
}

function simRunAll() {
  SIM.level = simMax();
  simDraw();
  simLog('一键到底：摆 ' + SIM.level + ' 层，1+3+…+' + simLast() +
         ' = <span class="hl">' + simSum() + '</span>');
}

function simNextCase() {
  SIM.ci = (SIM.ci + 1) % SIM_CASES.length;
  SIM.level = 1;
  simDraw();
  simLog('换一组：从 1 层重新摆，这组最多 ' + simMax() + ' 层');
}

function simReset() {
  SIM.level = 1;
  simDraw();
  simLog('重来：回到只有 1 块');
}

function simCase() { return SIM.ci + '/' + SIM.level; }

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function () { simAddLayer(); });
}

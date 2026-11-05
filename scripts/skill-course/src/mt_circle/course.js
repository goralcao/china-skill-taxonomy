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

// ===== 仿真：拖半径 —— 圆随半径变大，d = 2r 始终成立 =====
var SIM_CASES = [3, 4, 5, 6, 8];
var SIM = { ci: 0, r: 3 };

function simLabel() { return '半径 ' + SIM.r + ' 厘米'; }

function simDraw() {
  var ctx = simCtx();
  if (!ctx) return;
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.save(); ctx.fillStyle = '#FCFEFF'; ctx.fillRect(0, 0, SIM_W, SIM_H); ctx.restore();

  simTxt('第 ' + (SIM.ci + 1) + ' 组 · ' + simLabel() + ' · 直径 ' + (2 * SIM.r) + ' 厘米',
         34, 34, 17, '#01579B', '700');
  simTxt('半径越大圆越大；圆心不动，位置就不变', 34, 58, 12.5, '#607D8B');

  var cx = 230, cy = 208;
  var px = 22;  // 每厘米对应像素
  var rad = SIM.r * px;

  // 辅助圆：上一个半径的虚线，体现「长大了」
  if (SIM.r > 3) {
    simRing(cx, cy, (SIM.r - 1) * px, '#B0BEC5', 1.4, [5, 4]);
    simTxt('上一档', cx - (SIM.r - 1) * px - 6, cy, 10, '#90A4AE', '', 'right');
  }

  // 圆
  simRing(cx, cy, rad, '#01579B', 2.6);
  simDot(cx, cy, 5, '#01579B');

  // 半径（多角度画 3 条，强调「无数条且都相等」）
  var angs = [0, -Math.PI / 3, Math.PI * 0.8];
  for (var i = 0; i < angs.length; i++) {
    var ex = cx + rad * Math.cos(angs[i]), ey = cy + rad * Math.sin(angs[i]);
    simLine(cx, cy, ex, ey, '#0288D1', 2);
    simDot(ex, ey, 3, '#0288D1');
  }
  simTxt('r', cx + rad * 0.55, cy - 8, 13, '#0288D1', '700');

  // 直径（水平）
  simLine(cx - rad, cy, cx + rad, cy, '#FFB300', 3);
  simDot(cx - rad, cy, 3.5, '#E65100');
  simDot(cx + rad, cy, 3.5, '#E65100');
  simTxt('d = 2r', cx, cy + rad + 22, 12.5, '#E65100', '700', 'center');
  simTxt('O', cx - 16, cy - 10, 12, '#01579B', '700');

  // 右侧结果面板
  simDrawPanel(cx, cy, rad);
  simRefresh();
}

function simDrawPanel(cx, cy, rad) {
  simBox(500, 84, 346, 262, '#FFFFFF', '#81D4FA', 10);
  simTxt('本组数据', 522, 112, 12, '#8D6E63');
  simTxt(simLabel(), 522, 142, 21, '#01579B', '700');
  simLine(522, 158, 824, 158, '#E1F5FE', 1.2);

  simTxt('直径', 522, 182, 12, '#8D6E63');
  simTxt('d = 2 × ' + SIM.r + ' = ' + (2 * SIM.r) + ' 厘米', 522, 208, 16, '#E65100', '700');
  simTxt('半径', 522, 234, 12, '#8D6E63');
  simTxt('r = d ÷ 2 = ' + SIM.r + ' 厘米', 522, 258, 14, '#01579B', '700');

  simLine(522, 274, 824, 274, '#E1F5FE', 1.2);
  simTxt('半径条数：无数条，且都相等', 522, 294, 12, '#37474F');
  simTxt('直径条数：无数条，且都相等', 522, 314, 12, '#37474F');
  simTxt('对称轴：无数条（直径所在直线）', 522, 332, 11.5, '#607D8B');
}

function simRefresh() {
  var ro = document.getElementById('simReadout');
  var tp = document.getElementById('simTip');
  if (ro) ro.textContent = '第 ' + (SIM.ci + 1) + ' 组 · ' + simLabel() +
    ' · 直径 ' + (2 * SIM.r) + ' 厘米';
  if (tp) tp.textContent = SIM.r >= 8 ? '到最大了，点「换一组」' : '点画布或「加大半径」继续';
}

function simGrow() {
  if (SIM.r >= 8) { simLog('半径最大演示到 8 厘米，点「换一组」'); return; }
  SIM.r++;
  simDraw();
  simLog('半径加到 <span class="hl">' + SIM.r + ' 厘米</span>，直径变成 ' + (2 * SIM.r) + ' 厘米');
}

function simRunAll() {
  SIM.r = 8;
  simDraw();
  simLog('一键到底：r = 8 厘米，d = <span class="hl">16 厘米</span>，仍是 2 倍');
}

function simNextCase() {
  SIM.ci = (SIM.ci + 1) % SIM_CASES.length;
  SIM.r = SIM_CASES[SIM.ci];
  simDraw();
  simLog('换一组：起始 <span class="hl">' + simLabel() + '</span>');
}

function simReset() {
  SIM.r = SIM_CASES[SIM.ci];
  simDraw();
  simLog('重来：回到本组起始半径');
}

function simCase() { return SIM.ci + '/' + SIM.r; }

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function () { simGrow(); });
}

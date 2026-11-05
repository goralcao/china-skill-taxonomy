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

// ===== 仿真：改占比，扇形角度自动重算（总数固定 40 人） =====
var SIM_TOTAL = 40;
// 每组 [足球, 篮球, 其他]，合计恒为 100
var SIM_CASES = [[25, 50, 25], [20, 45, 35], [30, 40, 30], [15, 55, 30], [35, 35, 30]];
var SIM_NAMES = ['足球', '篮球', '其他'];
var SIM_COLS = ['#6A1B9A', '#26A69A', '#FFA726'];
var SIM = { ci: 0, vals: [25, 50, 25] };

function simV() { return SIM.vals; }
function simAngle(i) { return Math.round(SIM.vals[i] * 3.6); }

function simDraw() {
  var ctx = simCtx();
  if (!ctx) return;
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.save(); ctx.fillStyle = '#FEFBFF'; ctx.fillRect(0, 0, SIM_W, SIM_H); ctx.restore();

  simTxt('第 ' + (SIM.ci + 1) + ' 组 · 总数 40 人 · 占比合计 ' +
         (SIM.vals[0] + SIM.vals[1] + SIM.vals[2]) + '%',
         34, 34, 17, '#6A1B9A', '700');
  simTxt('调整足球占比，其他两项自动补到合计 100%：每块扇形的角度都跟着重算',
         34, 58, 12.5, '#607D8B');

  // 扇形图
  var cx = 205, cy = 200, rad = 118;
  var a = -Math.PI / 2;
  for (var i = 0; i < 3; i++) {
    var a2 = a + 2 * Math.PI * SIM.vals[i] / 100;
    simArc(cx, cy, rad, a, a2, SIM_COLS[i], '#FFFFFF', 2);
    var mid = (a + a2) / 2;
    if (SIM.vals[i] >= 10) {
      simTxt(SIM.vals[i] + '%', cx + rad * 0.62 * Math.cos(mid),
             cy + rad * 0.62 * Math.sin(mid) + 4, 15, '#FFFFFF', '700', 'center');
    }
    a = a2;
  }
  simRing(cx, cy, rad, '#4A148C', 1.8);
  simTxt('整个圆 = 100% / 360°', cx, cy + rad + 24, 12.5, '#6A1B9A', '700', 'center');

  simDrawPanel();
  simRefresh();
}

function simDrawPanel() {
  simBox(390, 84, 456, 250, '#FFFFFF', '#CE93D8', 10);
  simTxt('项目', 412, 110, 11.5, '#8D6E63');
  simTxt('占比', 528, 110, 11.5, '#8D6E63');
  simTxt('圆心角', 624, 110, 11.5, '#8D6E63');
  simTxt('人数', 762, 110, 11.5, '#8D6E63');
  simLine(412, 120, 824, 120, '#F3E5F5', 1.2);

  for (var i = 0; i < 3; i++) {
    var y = 150 + i * 44;
    simDot(420, y - 5, 6, SIM_COLS[i]);
    simTxt(SIM_NAMES[i], 434, y, 13, '#37474F', '700');
    simTxt(SIM.vals[i] + '%', 528, y, 14, '#6A1B9A', '700');
    simTxt(simAngle(i) + '°', 624, y, 14, '#E65100', '700');
    simTxt((SIM_TOTAL * SIM.vals[i] / 100) + ' 人', 762, y, 14, '#00838F', '700');
    simLine(412, y + 12, 824, y + 12, '#F3E5F5', 1);
  }
  simTxt('合计', 434, 296, 12.5, '#37474F', '700');
  simTxt('100%', 528, 296, 13, '#6A1B9A', '700');
  simTxt('360°', 624, 296, 13, '#E65100', '700');
  simTxt('40 人', 762, 296, 13, '#00838F', '700');
  simTxt('人数 = 总数 40 × 占比；占比相同、总数不同，人数也不同',
         412, 322, 11, '#607D8B');
}

function simRefresh() {
  var ro = document.getElementById('simReadout');
  var tp = document.getElementById('simTip');
  if (ro) ro.textContent = '第 ' + (SIM.ci + 1) + ' 组 · 足球 ' + SIM.vals[0] +
    '% · 圆心角 ' + simAngle(0) + '° · ' + (SIM_TOTAL * SIM.vals[0] / 100) + ' 人';
  if (tp) tp.textContent = SIM.vals[0] >= 50 ? '足球到顶了，点「换一组」' : '点画布或按钮继续调整';
}

function simShift() {
  if (SIM.vals[0] >= 50) { simLog('足球占比最多演示到 50%，点「换一组」'); return; }
  SIM.vals[0] += 5;
  SIM.vals[1] -= 5;
  if (SIM.vals[1] < 5) { SIM.vals[1] = 5; SIM.vals[0] = 95 - SIM.vals[2]; }
  simDraw();
  simLog('足球调到 <span class="hl">' + SIM.vals[0] + '%</span> → 圆心角 ' +
         simAngle(0) + '°，人数 ' + (SIM_TOTAL * SIM.vals[0] / 100) + ' 人；合计仍是 100%');
}

function simRunAll() {
  var rest = 100 - SIM.vals[2] - 50;
  SIM.vals[0] = 50; SIM.vals[1] = rest;
  simDraw();
  simLog('一键到底：足球 50% → <span class="hl">180°</span>，合计仍 100% / 360°');
}

function simNextCase() {
  SIM.ci = (SIM.ci + 1) % SIM_CASES.length;
  SIM.vals = SIM_CASES[SIM.ci].slice();
  simDraw();
  simLog('换一组：足球 <span class="hl">' + SIM.vals[0] + '%</span>、篮球 ' +
         SIM.vals[1] + '%、其他 ' + SIM.vals[2] + '%');
}

function simReset() {
  SIM.vals = SIM_CASES[SIM.ci].slice();
  simDraw();
  simLog('重来：回到本组起始分布');
}

function simCase() { return SIM.ci + '/' + SIM.vals[0]; }

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function () { simShift(); });
}

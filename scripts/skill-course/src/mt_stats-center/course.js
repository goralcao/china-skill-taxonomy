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

// ===== 仿真：数据点增删 —— 平均数 / 中位数 / 众数实时变 =====
var SIM_BASE = [72, 78, 80, 80, 85];
var SIM_CASES = [
  { name: '加入高分 100', v: 100 },
  { name: '加入低分 20', v: 20 },
  { name: '加入中分 80', v: 80 }
];
var SIM = { ci: 0, n: 0 };

function simV() { return SIM_CASES[SIM.ci].v; }
function simData() {
  var d = SIM_BASE.slice();
  for (var i = 0; i < SIM.n; i++) d.push(simV());
  return d;
}
function simAvg(d) {
  var s = 0;
  for (var i = 0; i < d.length; i++) s += d[i];
  return Math.round(s / d.length * 10) / 10;
}
function simMedian(d) {
  var a = d.slice().sort(function (x, y) { return x - y; });
  var m = a.length;
  return m % 2 ? a[(m - 1) / 2] : Math.round((a[m / 2 - 1] + a[m / 2]) / 2 * 10) / 10;
}
function simModeText(d) {
  var cnt = {}, mx = 0;
  for (var i = 0; i < d.length; i++) {
    cnt[d[i]] = (cnt[d[i]] || 0) + 1;
    if (cnt[d[i]] > mx) mx = cnt[d[i]];
  }
  if (mx <= 1) return '无';
  var vals = [];
  for (var k in cnt) if (cnt[k] === mx) vals.push(Number(k));
  vals.sort(function (a, b) { return a - b; });
  return vals.join('、') + '（' + mx + ' 次）';
}
function simCase() { return SIM.ci + '/' + SIM.n; }

function simDrawDots() {
  var d = simData();
  simLine(60, 220, 450, 220, '#80CBC4', 2);
  for (var v = 20; v <= 100; v += 20) {
    var x = 60 + (v - 20) / 80 * 390;
    simLine(x, 214, x, 226, '#B0BEC5', 1);
    simTxt(String(v), x, 242, 11, '#607D8B', '', 'center');
  }
  for (var i = 0; i < d.length; i++) {
    var val = d[i], occ = 0;
    for (var j = 0; j < i; j++) if (d[j] === val) occ++;
    var px = 60 + (val - 20) / 80 * 390;
    var py = 200 - occ * 22;
    simDot(px, py, 8, i < SIM_BASE.length ? '#00838F' : '#FF8F00');
  }
  simTxt('分数 →', 450, 262, 11, '#607D8B', '', 'right');
  simTxt('青点 = 原有 5 人　橙点 = 新加入的 ' + simV() + ' 分', 40, 282, 11.5, '#607D8B');
}

function simDrawPanel() {
  var d = simData();
  simBox(500, 84, 346, 250, '#FFFFFF', '#80CBC4', 10);
  simTxt('这组数据', 522, 112, 12, '#607D8B');
  simTxt('原有 5 人 + 新加 ' + SIM.n + ' 个 ' + simV() + ' 分',
         522, 136, 12.5, '#004D40', '700');
  simLine(522, 150, 824, 150, '#E0F7FA', 1.2);

  simTxt('平均数', 522, 176, 12, '#607D8B');
  simTxt(String(simAvg(d)), 522, 202, 20, '#006064', '700');
  simTxt('中位数', 522, 232, 12, '#607D8B');
  simTxt(String(simMedian(d)), 522, 256, 20, '#E65100', '700');
  simTxt('众数', 522, 286, 12, '#607D8B');
  simTxt(simModeText(d), 522, 310, 18, '#2E7D32', '700');
}

function simRefresh() {
  var ro = document.getElementById('simReadout');
  var tp = document.getElementById('simTip');
  if (ro) ro.textContent = '第 ' + (SIM.ci + 1) + ' 组 · ' + SIM_CASES[SIM.ci].name +
    ' · 已加 ' + SIM.n + ' / 3 个';
  if (tp) tp.textContent = SIM.n >= 3 ? '加满了，点「换一种数据」' : '点画布或按钮加数据';
}

function simDraw() {
  var ctx = simCtx();
  if (!ctx) return;
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.save(); ctx.fillStyle = '#FBFEFF'; ctx.fillRect(0, 0, SIM_W, SIM_H); ctx.restore();

  simTxt('第 ' + (SIM.ci + 1) + ' 组 · ' + SIM_CASES[SIM.ci].name +
         ' · 已加 ' + SIM.n + ' / 3 个', 34, 34, 17, '#006064', '700');
  simTxt('点「加一个数据」把圆点添进去，看三个统计量怎么变', 34, 58, 12.5, '#607D8B');

  simDrawDots();
  simDrawPanel();

  simTxt('平均数对每个数据都敏感；中位数看位置、众数看次数，变化规律不同',
         40, 308, 12, '#E65100', '700');
  simTxt('点「换一种数据」看看加低分 20 或加 80 会怎样', 40, 332, 11.5, '#607D8B');

  simRefresh();
}

function simAdd() {
  if (SIM.n >= 3) { simLog('最多加 3 个，点「换一种数据」或「重来」'); return; }
  SIM.n++;
  simDraw();
  var d = simData();
  simLog('加 1 个 <span class="hl">' + simV() + '</span> 分 → 平均数 ' + simAvg(d) +
         '，中位数 ' + simMedian(d) + '，众数 ' + simModeText(d));
}

function simRemove() {
  if (SIM.n <= 0) { simLog('已经回到原来的 5 人数据'); return; }
  SIM.n--;
  simDraw();
  simLog('减掉 1 个数据 → 回到 ' + SIM.n + ' 个新增点');
}

function simNextCase() {
  SIM.ci = (SIM.ci + 1) % SIM_CASES.length;
  SIM.n = 0;
  simDraw();
  simLog('换一种数据：<span class="hl">' + SIM_CASES[SIM.ci].name + '</span>');
}

function simReset() {
  SIM.ci = 0; SIM.n = 0;
  simDraw();
  simLog('重来：回到原有 5 人成绩');
}

function simRunAll() {
  SIM.n = 3;
  simDraw();
  simLog('一键加满 3 个：平均数 <span class="hl">' + simAvg(simData()) +
         '</span>，中位数 ' + simMedian(simData()));
}

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function () { simAdd(); });
}

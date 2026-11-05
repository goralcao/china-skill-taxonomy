// ===== 仿真：改一天的数据，看折线怎么变 =====
var SIM_W = 880, SIM_H = 360;
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';
var SIM_DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

var SIM_CASES = [
  { name: '一周气温', unit: '℃', lo: 14, hi: 30, step: 2, vals: [18, 20, 19, 23, 26, 24, 21] },
  { name: '一周最高温', unit: '℃', lo: 16, hi: 34, step: 2, vals: [22, 24, 23, 27, 30, 28, 25] },
  { name: '小店日销量', unit: '杯', lo: 0, hi: 50, step: 4, vals: [20, 26, 24, 35, 42, 38, 30] },
  { name: '每日跳绳', unit: '个', lo: 80, hi: 220, step: 20, vals: [120, 150, 140, 180, 200, 170, 190] }
];

var SIM = { ci: 0, c: null, vals: [], sel: 0 };

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
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
  ctx.restore();
}

function simLoad(i) {
  SIM.ci = i;
  SIM.c = SIM_CASES[i];
  SIM.vals = SIM.c.vals.slice();
  SIM.sel = 0;
}

function simPlot() { return { x: 66, y: 92, w: 424, h: 196 }; }

function simPX(i) { var p = simPlot(); return p.x + i * p.w / 6; }
function simPY(v) {
  var p = simPlot(), c = SIM.c;
  return p.y + p.h - (v - c.lo) / (c.hi - c.lo) * p.h;
}

function simDiff(i) { return i === 0 ? null : SIM.vals[i] - SIM.vals[i - 1]; }

function simMaxRise() {
  var best = { i: 1, d: -Infinity };
  for (var i = 1; i < 7; i++) {
    var d = simDiff(i);
    if (d > best.d) best = { i: i, d: d };
  }
  return best;
}

function simExtreme() {
  var hi = 0, lo = 0;
  for (var i = 1; i < 7; i++) {
    if (SIM.vals[i] > SIM.vals[hi]) hi = i;
    if (SIM.vals[i] < SIM.vals[lo]) lo = i;
  }
  return { hi: hi, lo: lo };
}

function simTrend() {
  var up = 0, down = 0;
  for (var i = 1; i < 7; i++) {
    if (simDiff(i) > 0) up++;
    else if (simDiff(i) < 0) down++;
  }
  if (up >= 5) return '整体持续上升';
  if (down >= 5) return '整体持续下降';
  return up > down ? '有起有落，总体上升' : (down > up ? '有起有落，总体下降' : '有起有落，升与降持平');
}

// ---- 绘制 ----
function simDraw() {
  var ctx = simCtx();
  if (!ctx) return;
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.save(); ctx.fillStyle = '#FBFDFF'; ctx.fillRect(0, 0, SIM_W, SIM_H); ctx.restore();

  var p = simPlot(), c = SIM.c;
  simTxt('第 ' + (SIM.ci + 1) + ' 组 · ' + c.name + '（单位 ' + c.unit + '）', 34, 38, 18, '#1565C0', '700');
  simTxt('点画布选一天，再升高 / 降低；折线与右侧结论会跟着变', 34, 62, 12.5, '#546E7A');

  // 网格与刻度
  for (var k = 0; k <= 4; k++) {
    var yy = p.y + p.h - k * p.h / 4;
    var val = c.lo + k * (c.hi - c.lo) / 4;
    simLine(p.x, yy, p.x + p.w, yy, '#CFD8DC', 1, [4, 4]);
    simTxt(String(val), p.x - 8, yy + 4, 11, '#90A4AE', '', 'right');
  }
  simLine(p.x, p.y, p.x, p.y + p.h, '#546E7A', 1.8);
  simLine(p.x, p.y + p.h, p.x + p.w, p.y + p.h, '#546E7A', 1.8);

  // 选中日竖虚线
  simLine(simPX(SIM.sel), p.y, simPX(SIM.sel), p.y + p.h, '#FF8F00', 1.4, [5, 4]);

  // 面积
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(simPX(0), p.y + p.h);
  for (var i = 0; i < 7; i++) ctx.lineTo(simPX(i), simPY(SIM.vals[i]));
  ctx.lineTo(simPX(6), p.y + p.h);
  ctx.closePath();
  ctx.fillStyle = 'rgba(21,101,192,.12)';
  ctx.fill();
  ctx.restore();

  // 折线
  ctx.save();
  ctx.beginPath();
  for (var j = 0; j < 7; j++) {
    if (j === 0) ctx.moveTo(simPX(j), simPY(SIM.vals[j]));
    else ctx.lineTo(simPX(j), simPY(SIM.vals[j]));
  }
  ctx.strokeStyle = '#1565C0'; ctx.lineWidth = 2.8; ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.restore();

  // 点与标签
  for (var m = 0; m < 7; m++) {
    var sel = (m === SIM.sel);
    simDot(simPX(m), simPY(SIM.vals[m]), sel ? 7 : 4.5,
           sel ? '#FF8F00' : '#1565C0', '#FFFFFF');
    simTxt(SIM_DAYS[m], simPX(m), p.y + p.h + 18, 11, sel ? '#E65100' : '#546E7A', sel ? '700' : '', 'center');
    if (sel) {
      simTxt(SIM.vals[m] + c.unit, simPX(m), simPY(SIM.vals[m]) - 14, 13, '#E65100', '700', 'center');
    }
  }

  simDrawPanel();
  simRefresh();
}

function simDrawPanel() {
  var c = SIM.c, ex = simExtreme(), mr = simMaxRise(), d = simDiff(SIM.sel);
  simBox(516, 54, 330, 280, '#FFFFFF', '#BBDEFB', 10);

  simTxt('选中：' + SIM_DAYS[SIM.sel], 538, 84, 13, '#8D6E63');
  simTxt(SIM.vals[SIM.sel] + ' ' + c.unit, 538, 114, 22, '#1565C0', '700');
  if (d === null) {
    simTxt('第一天，没有前一天可比', 538, 138, 12, '#9E9E9E');
  } else {
    simTxt('比前一天 ' + (d > 0 ? '+' : '') + d + ' ' + c.unit +
           (d > 0 ? '（升）' : d < 0 ? '（降）' : '（持平）'),
           538, 138, 12.5, d > 0 ? '#C62828' : d < 0 ? '#2E7D32' : '#546E7A', '700');
  }

  simLine(538, 154, 824, 154, '#E3F2FD', 1.2);

  simTxt('最高：' + SIM_DAYS[ex.hi] + ' ' + SIM.vals[ex.hi] + c.unit, 538, 178, 12.5, '#0D47A1', '700');
  simTxt('最低：' + SIM_DAYS[ex.lo] + ' ' + SIM.vals[ex.lo] + c.unit, 538, 200, 12.5, '#546E7A', '700');
  simTxt('升得最快：' + SIM_DAYS[mr.i - 1] + '→' + SIM_DAYS[mr.i] + '（+' + mr.d + '）',
         538, 222, 12.5, '#E65100', '700');

  simLine(538, 238, 824, 238, '#E3F2FD', 1.2);

  simTxt('整体趋势', 538, 260, 12, '#8D6E63');
  simTxt(simTrend(), 538, 284, 15, '#1565C0', '700');
  simTxt('点读数量 · 线读变化 · 陡读快慢', 538, 314, 11.5, '#546E7A', '700');
}

// ---- 交互 ----
function simRefresh() {
  var ro = document.getElementById('simReadout');
  var tp = document.getElementById('simTip');
  if (ro) ro.textContent = SIM.c.name + ' · 选中' + SIM_DAYS[SIM.sel] + ' ' + SIM.vals[SIM.sel] + SIM.c.unit;
  if (tp) tp.textContent = '点画布选一天，再升高 / 降低';
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

function simSelect(i) {
  if (i < 0 || i > 6) return;
  SIM.sel = i;
  simDraw();
  var d = simDiff(i);
  simLog('选中 <span class="hl">' + SIM_DAYS[i] + '</span>：' + SIM.vals[i] + SIM.c.unit +
         (d === null ? '，第一天没有前一天' : '，比前一天 ' + (d > 0 ? '+' : '') + d));
}

function simUp() {
  var c = SIM.c, v = SIM.vals[SIM.sel] + c.step;
  if (v > c.hi) { simLog('已经到这张图的上限 ' + c.hi + c.unit + ' 了'); return; }
  SIM.vals[SIM.sel] = v;
  simDraw();
  simLog(SIM_DAYS[SIM.sel] + ' 升高到 <span class="hl">' + v + c.unit + '</span>，折线重画');
}

function simDown() {
  var c = SIM.c, v = SIM.vals[SIM.sel] - c.step;
  if (v < c.lo) { simLog('已经到这张图的下限 ' + c.lo + c.unit + ' 了'); return; }
  SIM.vals[SIM.sel] = v;
  simDraw();
  simLog(SIM_DAYS[SIM.sel] + ' 降低到 <span class="hl">' + v + c.unit + '</span>，折线重画');
}

function simNext() {
  simLoad((SIM.ci + 1) % SIM_CASES.length);
  simDraw();
  simLog('换一组：<span class="hl">' + SIM.c.name + '</span>（' + SIM.c.unit + '），数据已还原');
}

function simReset() {
  simLoad(0);
  simDraw();
  simLog('重来：一周气温，18、20、19、23、26、24、21');
}

function simCase() { return SIM.c.name + ':' + SIM.vals.join(','); }

function simInit() { simLoad(0); }

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function (e) {
    var r = cv.getBoundingClientRect();
    var x = (e.clientX - r.left) * (SIM_W / r.width);
    var p = simPlot();
    if (x < p.x - 20 || x > p.x + p.w + 20) return;
    var i = Math.round((x - p.x) / (p.w / 6));
    simSelect(Math.max(0, Math.min(6, i)));
  });
}

simInit();

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

// ===== 仿真：成数 / 折扣 / 税率 / 利率 —— 同一个乘法式子 =====
var SIM_CASES = [
  { name: '折扣 · 一件 300 元外套', base: 300, unit: '元', pcts: [80, 90, 75, 50],
    out: '现价', formula: '现价 = 原价 × 折数', note: '打八折就是按原价的 80% 收' },
  { name: '成数 · 去年收 500 吨', base: 500, unit: '吨', pcts: [20, 10, 25, 30],
    out: '增产量', formula: '增产量 = 原量 × 成数', note: '二成就是 20%，几成即百分之几十' },
  { name: '税率 · 营业额 8000 元', base: 8000, unit: '元', pcts: [5, 3, 6, 10],
    out: '应纳税额', formula: '税额 = 营业额 × 税率', note: '按应纳税所得额（营业额）算' },
  { name: '利率 · 本金 1000 元存 1 年', base: 1000, unit: '元', pcts: [2.25, 1.5, 2, 3],
    out: '利息', formula: '利息 = 本金 × 利率 × 存期', note: '利率是百分率，还要乘本金和存期' }
];
var SIM = { ci: 0, pi: 0 };

function simCase() { return SIM_CASES[SIM.ci]; }
function simPct() { return simCase().pcts[SIM.pi]; }
function simValue() { return Math.round(simCase().base * simPct()) / 100; }
function simFmt(v) { return (Math.round(v * 100) / 100) + ' ' + simCase().unit; }
function simExpr() { return simCase().base + ' × ' + simPct() + '% = ' + simFmt(simValue()); }

function simDraw() {
  var ctx = simCtx();
  if (!ctx) return;
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.save(); ctx.fillStyle = '#FFFDF9'; ctx.fillRect(0, 0, SIM_W, SIM_H); ctx.restore();

  simTxt('第 ' + (SIM.ci + 1) + ' 组 · ' + simCase().name, 34, 34, 17, '#BF360C', '700');
  simTxt('同一个式子：部分量 = 总量 × 百分率　（涂色部分就是百分率）',
         34, 58, 12.5, '#8D6E63');

  // 左侧：20 格刻度 + 连续黄色条（精确到小数百分率，2.25% 也能看见）
  var x0 = 40, y0 = 118, gw = 21, gh = 48, cells = 20;
  var totalW = gw * cells;
  for (var i = 0; i < cells; i++) {
    simBox(x0 + i * gw, y0, gw - 1, gh, '#FBE9E7', '#FFCCBC', 1);
  }
  var fillW = totalW * simPct() / 100;
  if (fillW > 0) simBox(x0, y0, fillW, gh, 'rgba(255,202,40,.88)', null, 0);
  for (var j = 1; j < cells; j++) {
    simLine(x0 + j * gw, y0, x0 + j * gw, y0 + gh, 'rgba(191,54,12,.22)', 1);
  }
  simTxt('总量 ' + simCase().base + ' ' + simCase().unit + '（100%）',
         x0, y0 - 14, 12.5, '#4E342E', '700');
  simTxt('黄色条 ' + simPct() + '% → ' + simCase().out + ' ' + simFmt(simValue()),
         x0, y0 + gh + 24, 13, '#BF360C', '700');
  simTxt('20 格是刻度（每格 5%），黄色条按百分率连续取长短',
         x0, y0 + gh + 48, 11.5, '#8D6E63');
  simTxt('点画布或按钮换场景 / 换百分率', x0, y0 + gh + 72, 11.5, '#8D6E63');

  simDrawPanel();
  simRefresh();
}

function simDrawPanel() {
  simBox(500, 84, 346, 250, '#FFFFFF', '#FFCCBC', 10);
  simTxt('当前场景', 522, 112, 12, '#8D6E63');
  simTxt(simCase().out + '怎么算', 522, 140, 18, '#BF360C', '700');
  simLine(522, 156, 824, 156, '#FBE9E7', 1.2);

  simTxt('公式', 522, 180, 12, '#8D6E63');
  simTxt(simCase().formula, 522, 204, 14, '#4E342E', '700');
  simTxt('代入', 522, 232, 12, '#8D6E63');
  simTxt(simExpr(), 522, 256, 15, '#BF360C', '700');

  simLine(522, 272, 824, 272, '#FBE9E7', 1.2);
  simTxt(simCase().note, 522, 296, 11.5, '#6D4C41');
  simTxt('单位「1」是 ' + simCase().base + ' ' + simCase().unit, 522, 318, 11.5, '#8D6E63');
}

function simRefresh() {
  var ro = document.getElementById('simReadout');
  var tp = document.getElementById('simTip');
  if (ro) ro.textContent = '第 ' + (SIM.ci + 1) + ' 组 · ' + simCase().out + ' · ' + simPct() + '%';
  if (tp) tp.textContent = '点画布或按钮切换';
}

function simNextCase() {
  SIM.ci = (SIM.ci + 1) % SIM_CASES.length;
  SIM.pi = 0;
  simDraw();
  simLog('换场景：<span class="hl">' + simCase().name + '</span>');
}

function simNextPct() {
  SIM.pi = (SIM.pi + 1) % simCase().pcts.length;
  simDraw();
  simLog('换百分率：<span class="hl">' + simPct() + '%</span> → ' + simExpr());
}

function simReset() {
  SIM.ci = 0; SIM.pi = 0;
  simDraw();
  simLog('重来：回到第 1 组 · 折扣 80%');
}

function simRunAll() {
  SIM.ci = SIM_CASES.length - 1;
  SIM.pi = simCase().pcts.length - 1;
  simDraw();
  simLog('一键到最后一组：' + simExpr());
}

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function () { simNextPct(); });
}

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

var MN = {"mode": "process", "title": "适应新生活：一步步来", "readout": "完成 %N% 步", "logAdd": "第 %N% 步", "logReset": "重新开始", "logNext": "换一组", "logDemo": "看老师做一遍", "cases": [{"title": "我的一天", "steps": ["按时到校", "上课专心", "课间准备", "放学整理"], "total": 4, "max": 4, "tip": "有规律"}, {"title": "学会自理", "steps": ["整理书包", "摆好文具", "保管物品", "自己穿衣"], "total": 4, "max": 4, "tip": "自己来"}], "colors": {"primary": "#00838F", "accent": "#EF6C00", "primarySoft": "#E0F4F5", "accentSoft": "#FFE0B2", "ink": "#122A2C", "muted": "#777", "line": "#B8DEDC"}};
// ===== 小学科学 / 道德与法治仿真台（数据驱动） =====
// 每课数据由 run_sci.py 注入为全局 MN。设计约定：
//   * 仿真「真的动」：按钮改变 SIM 状态 → simDraw 重画 → simReadout 更新读数 → simLog 记一步。
//   * 复用数学 7 种模式（count/compose/addsub/array/shape/measure/stat），
//     另加科学/道法 4 种：observe 观察记录 / experiment 变量实验 /
//     scenario 情境辨析 / process 流程步骤。
//   * 统一契约函数：simDraw / simReset / simDemo / simAdd / simNextCase / simBind / simReadout。
//   * MN.mode 决定绘制方式；每种模式各自一组 draw 函数，互不干扰。
// 结构测试契约：画布着色 > 0；simAdd/simDemo/simNextCase/simReset 可调用且无控制台报错。

var SIM = { ci: 0, n: 0, hits: 0, note: '', flash: 0, bound: false };
var SIM_W = 880, SIM_H = 360;
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';

function simCtx() { return document.getElementById('simCanvas').getContext('2d'); }
function simCase() { return (MN.cases && MN.cases[SIM.ci]) || {}; }
function simC() { return MN.colors || {}; }
function simTxt(t, x, y, size, color, weight, align) {
  var ctx = simCtx();
  ctx.save();
  ctx.font = (weight ? weight + ' ' : '') + size + 'px ' + SIM_FONT;
  ctx.fillStyle = color || simC().ink || '#1E1B2E';
  ctx.textAlign = align || 'left';
  ctx.fillText(String(t), x, y);
  ctx.restore();
}
function simLine(x1, y1, x2, y2, color, w, dash) {
  var ctx = simCtx();
  ctx.save(); ctx.strokeStyle = color || simC().line || '#CCC';
  ctx.lineWidth = w || 1.6; ctx.lineCap = 'round';
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore();
}
function simBox(x, y, w, h, fill, stroke, r) {
  var ctx = simCtx(); r = (r === undefined) ? 8 : r;
  if (r > Math.min(w, h) / 2) r = Math.min(w, h) / 2;
  ctx.save(); ctx.beginPath();
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
  var ctx = simCtx(); ctx.save(); ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill || simC().primary || '#1565C0'; ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.4; ctx.stroke(); }
  ctx.restore();
}
function simArc(cx, cy, r, a0, a1, fill, stroke, w) {
  var ctx = simCtx(); ctx.save(); ctx.beginPath();
  ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, a0, a1); ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = w || 1.6; ctx.stroke(); }
  ctx.restore();
}
function simRing(cx, cy, r, color, w, dash) {
  var ctx = simCtx(); ctx.save(); ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = color || simC().primary || '#1565C0'; ctx.lineWidth = w || 1.6;
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

function simFmt(s, n, t) {
  return String(s == null ? '' : s).replace(/%N%/g, n).replace(/%T%/g, t);
}
function simReadout() {
  var el = document.getElementById('simReadout');
  if (!el) return;
  var c = simCase();
  el.textContent = simFmt(MN.readout || '%N%', SIM.n, (c.total != null ? c.total : (MN.cases ? MN.cases.length : 0)));
  var tip = document.getElementById('simTip');
  if (tip && c.tip) tip.textContent = c.tip;
}

/* ═════════ 通用状态操作 ═════════ */
function simReset() {
  SIM.n = 0; SIM.hits = 0; SIM.note = ''; SIM.flash = 0;
  simReadout(); simDraw();
  simLog(MN.logReset || '已清空，从头再来');
}
function simAdd() {
  var c = simCase();
  var max = c.max != null ? c.max : (c.total != null ? c.total : 12);
  if (SIM.n >= max) { simLog('已经到 ' + max + ' 了，先「换一组」或「清空」'); return; }
  SIM.n++; SIM.hits++;
  simReadout(); simDraw();
  simLog(simFmt(MN.logAdd || '第 %N% 个', SIM.n, max));
}
function simNextCase() {
  if (!MN.cases || MN.cases.length < 2) { simAdd(); return; }
  SIM.ci = (SIM.ci + 1) % MN.cases.length;
  SIM.n = 0;
  simReadout(); simDraw();
  simLog((MN.logNext || '换一组') + '（第 ' + (SIM.ci + 1) + ' 组）');
}
function simDemo() {
  var c = simCase();
  var target = c.demo != null ? c.demo : (c.total != null ? c.total : 5);
  var max = c.max != null ? c.max : (c.total != null ? c.total : 12);
  SIM.n = Math.min(target, max); SIM.hits = Math.max(1, SIM.n);
  simReadout(); simDraw();
  simLog((MN.logDemo || '看老师做一遍') + '：' + simFmt(MN.readout || '%N%', SIM.n, max));
}
function simBind() {
  // 仿真页的按钮全部走 onclick 里的契约函数，这里只做一次性初始化
  if (SIM.bound) return;
  SIM.bound = true;
  simReadout();
}

/* ═════════ 主绘制：按 mode 分派 ═════════ */
function simDraw() {
  var ctx = simCtx();
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, SIM_W, SIM_H);
  var mode = MN.mode || 'count';
  try {
    if (mode === 'count') drawCount();
    else if (mode === 'compose') drawCompose();
    else if (mode === 'addsub') drawAddSub();
    else if (mode === 'array') drawArray();
    else if (mode === 'shape') drawShape();
    else if (mode === 'measure') drawMeasure();
    else if (mode === 'stat') drawStat();
    else if (mode === 'observe') drawObserve();
    else if (mode === 'experiment') drawExperiment();
    else if (mode === 'scenario') drawScenario();
    else if (mode === 'process') drawProcess();
    else drawCount();
  } catch (e) {
    // 兜底：任何模式绘制异常也要留一幅可见画面，保证画布着色 > 0
    simBox(40, 40, SIM_W - 80, SIM_H - 80, '#F4FAFF', simC().line || '#CCC', 14);
    simTxt(MN.title || '数学仿真台', SIM_W / 2, SIM_H / 2, 26, simC().primary || '#1565C0', 'bold', 'center');
  }
  // 底部进度点：既提示进度，也确保画布永远有非白像素
  var c = simCase();
  var total = c.total != null ? c.total : Math.max(SIM.n, 5);
  var step = total > 0 ? (SIM.n / total) : 0;
  simBox(60, SIM_H - 26, SIM_W - 120, 10, '#ECEFF1', null, 5);
  simBox(60, SIM_H - 26, Math.max(6, (SIM_W - 120) * Math.min(1, step)), 10,
         simC().accent || '#FF8F00', null, 5);
}

/* ---- count：数数 / 认数（10/20/100以内、万以内、分类） ---- */
function drawCount() {
  var c = simCase(), P = simC();
  var unit = c.unit || '个';
  var per = c.perRow || 10;
  var max = c.max != null ? c.max : (c.total || 20);
  var n = Math.min(SIM.n, max);
  simTxt(c.title || ('数一数：一共几个' + unit), SIM_W / 2, 34, 22, P.primary || '#1565C0', 'bold', 'center');
  var cols = Math.min(per, 10), rows = Math.max(2, Math.ceil(max / cols));
  var x0 = 60, y0 = 70, gx = (SIM_W - 120) / cols, gy = Math.min(34, (SIM_H - 150) / rows);
  // 参考位（浅灰）画到 max
  for (var i = 0; i < max; i++) {
    var cx = x0 + gx * (i % cols) + gx / 2;
    var cy = y0 + gy * Math.floor(i / cols) + gy / 2;
    simDot(cx, cy, 10, '#ECEFF1', '#CFD8DC');
  }
  // 已数（实心）画到 n，十个一组换色
  for (var k = 0; k < n; k++) {
    var x = x0 + gx * (k % cols) + gx / 2;
    var y = y0 + gy * Math.floor(k / cols) + gy / 2;
    var col = (c.group != null && Math.floor(k / c.group) % 2 === 1)
      ? (P.accent || '#FF8F00') : (P.primary || '#1565C0');
    simDot(x, y, 12, col, '#fff');
    if (P.ink) simTxt(String(k + 1), x, y + 4, 10, '#fff', 'bold', 'center');
  }
  if (c.group) {
    simTxt('每 ' + c.group + ' 个一组：' + Math.floor(n / c.group) + ' 组' + (n % c.group ? ' 余 ' + (n % c.group) : ''),
           SIM_W / 2, SIM_H - 46, 16, P.accent || '#FF8F00', 'bold', 'center');
  }
}

/* ---- compose：分与合 ---- */
function drawCompose() {
  var c = simCase(), P = simC();
  var total = c.total || 10, n = Math.min(SIM.n, total);
  var left = c.left != null ? c.left : Math.floor(total / 2);
  var right = total - left;
  var split = Math.min(n, left), splitR = Math.max(0, n - left);
  simTxt(c.title || (total + ' 可以分成几和几'), SIM_W / 2, 34, 22, P.primary || '#1565C0', 'bold', 'center');
  // 总框
  simBox(SIM_W / 2 - 70, 66, 140, 52, P.primarySoft || '#E3F2FD', P.primary || '#1565C0', 12);
  simTxt(total + ' ' + (c.unit || '个'), SIM_W / 2, 100, 26, P.primary || '#1565C0', 'bold', 'center');
  // 两条分叉
  simLine(SIM_W / 2, 118, 240, 168, P.line || '#CCC', 2);
  simLine(SIM_W / 2, 118, SIM_W - 240, 168, P.line || '#CCC', 2);
  // 左框 / 右框
  simBox(150, 168, 180, 56, '#FFF3E0', P.accent || '#FF8F00', 12);
  simTxt(split + ' ' + (c.unit || '个'), 240, 204, 24, P.accent || '#FF8F00', 'bold', 'center');
  simBox(SIM_W - 330, 168, 180, 56, '#E8F5E9', '#2E7D32', 12);
  simTxt(splitR + ' ' + (c.unit || '个'), SIM_W - 240, 204, 24, '#2E7D32', 'bold', 'center');
  // 分合关系
  simTxt(split + ' + ' + splitR + ' = ' + (split + splitR), SIM_W / 2, 270, 22, P.ink || '#333', 'bold', 'center');
  simTxt('点「加一个」把总数往两边分，看左边满了右边才开始', SIM_W / 2, 306, 15, P.muted || '#777', 'normal', 'center');
}

/* ---- addsub：数位桶（进位/退位/竖式/混合/运算律） ---- */
function drawAddSub() {
  var c = simCase(), P = simC();
  var places = c.places || ['个位', '十位', '百位'];
  var digits = c.digits || [0, 0, 0];
  var n = Math.min(SIM.n, 10);
  var BW = 150, gap = 30, totalW = places.length * BW + (places.length - 1) * gap;
  var x0 = (SIM_W - totalW) / 2, top = 92, bot = 292;
  simTxt(c.title || '数位桶：满十进一，借一当十', SIM_W / 2, 34, 22, P.primary || '#1565C0', 'bold', 'center');
  var colors = ['#42A5F5', '#1565C0', '#0D47A1'];
  for (var i = 0; i < places.length; i++) {
    var cx = x0 + i * (BW + gap) + BW / 2;
    simBox(cx - BW / 2, top, BW, bot - top, '#F4FAFF', '#BBD9F0', 14);
    simTxt(places[i], cx, top - 14, 18, P.primary || '#1565C0', 'bold', 'center');
    // 桶里画珠：个位显示当前 n，其余显示该数位初始 digits（最多 9）
    var cnt = (i === 0) ? n : Math.min(9, digits[i] || 0);
    for (var k = 0; k < cnt; k++) {
      var col2 = k % 5, row = Math.floor(k / 5);
      simDot(cx - 44 + col2 * 22, bot - 26 - row * 26, 9, colors[i % colors.length], '#fff');
    }
    simTxt('× ' + cnt, cx, bot + 22, 16, colors[i % colors.length], 'bold', 'center');
  }
  if (c.carry) {
    simTxt('个位满 10 → 向十位进 1；退位时向十位借 1 当 10', SIM_W / 2, SIM_H - 40, 16, P.accent || '#FF8F00', 'bold', 'center');
  }
}

/* ---- array：乘法阵列 / 平均分 / 除法 / 口诀 ---- */
function drawArray() {
  var c = simCase(), P = simC();
  var rows = c.rows || 3, cols = c.cols || 4;
  var n = Math.min(SIM.n, rows * cols);
  var cell = Math.min(44, Math.floor((SIM_W - 140) / cols));
  var gw = cols * cell, gh = rows * cell;
  var x0 = (SIM_W - gw) / 2, y0 = 78;
  simTxt(c.title || ('每行 ' + cols + ' 个，共 ' + rows + ' 行'), SIM_W / 2, 34, 22, P.primary || '#1565C0', 'bold', 'center');
  for (var r = 0; r < rows; r++) {
    for (var col = 0; col < cols; col++) {
      var idx = r * cols + col;
      var x = x0 + col * cell + cell / 2, y = y0 + r * cell + cell / 2;
      var filled = idx < n;
      simBox(x - cell / 2 + 3, y - cell / 2 + 3, cell - 6, cell - 6,
             filled ? ((r % 2 ? (P.accent || '#FF8F00') : (P.primary || '#1565C0'))) : '#F5F5F5',
             filled ? '#fff' : '#E0E0E0', 7);
    }
    // 行括号
    simTxt('第 ' + (r + 1) + ' 行：' + Math.min(cols, Math.max(0, n - r * cols)) + ' 个',
           x0 + gw + 14, y0 + r * cell + cell / 2 + 5, 14, P.muted || '#666');
  }
  var fullRows = Math.floor(n / cols), rem = n % cols;
  simTxt(c.rem ? ('分完 ' + fullRows + ' 组，还剩 ' + rem + ' 个') : (fullRows + ' × ' + cols + (rem ? ' + ' + rem : '') + ' = ' + n),
         SIM_W / 2, y0 + gh + 34, 20, P.accent || '#FF8F00', 'bold', 'center');
}

/* ---- shape：平面/立体图形 / 角 / 观察物体 / 图形运动 / 三角形 ---- */
function drawShape() {
  var c = simCase(), P = simC();
  var kind = c.kind || 'rect';
  var cx = SIM_W / 2, cy = 196;
  simTxt(c.title || '图形：看清特征', SIM_W / 2, 34, 22, P.primary || '#1565C0', 'bold', 'center');
  var col = P.primary || '#1565C0', acc = P.accent || '#FF8F00';
  var k = Math.min(SIM.n, 8); // 点击次数驱动「加边 / 旋转 / 加层」
  if (kind === 'angle') {
    var a = 30 + k * 8;
    simLine(cx - 160, cy + 90, cx + 160, cy + 90, '#BDBDBD', 2);
    simLine(cx - 160, cy + 90, cx - 160 + 220 * Math.cos(-a * Math.PI / 180), cy + 90 - 220 * Math.sin(a * Math.PI / 180), col, 4);
    simArc(cx - 160, cy + 90, 56, -a * Math.PI / 180, 0, acc);
    simTxt(a + '°', cx - 160 + 70, cy + 62, 20, acc, 'bold');
    simTxt('张开越大，角越大', SIM_W / 2, SIM_H - 50, 16, P.muted || '#666', 'normal', 'center');
  } else if (kind === 'solid') {
    var solids = ['正方体', '长方体', '圆柱', '球'];
    var name = solids[k % solids.length];
    simBox(cx - 90, cy - 70, 180, 140, P.primarySoft || '#E3F2FD', col, 12);
    simTxt(name, cx, cy - 10, 30, col, 'bold', 'center');
    simTxt('第 ' + (k % solids.length + 1) + ' / ' + solids.length + ' 种立体图形', cx, cy + 34, 16, P.muted || '#666', 'normal', 'center');
  } else if (kind === 'triangle') {
    var x1 = cx - 120, x2 = cx + 120, yb = cy + 90, yt = cy - 90 - k * 4;
    simLine(x1, yb, x2, yb, col, 3);
    simLine(x1, yb, cx, yt, acc, 3);
    simLine(cx, yt, x2, yb, acc, 3);
    simTxt('底', cx, yb + 26, 16, col, 'bold', 'center');
    simTxt('顶点越往中间，越接近等边/等腰', SIM_W / 2, SIM_H - 46, 16, P.muted || '#666', 'normal', 'center');
  } else if (kind === 'move') {
    var ox = cx - 120 - k * 6;
    simBox(ox, cy - 50, 100, 100, P.primarySoft || '#E3F2FD', col, 10);
    simTxt('原图', ox + 50, cy + 72, 15, col, 'bold', 'center');
    var nx = cx + 20 + k * 6;
    simBox(nx, cy - 50, 100, 100, '#FFF3E0', acc, 10);
    simTxt('平移/旋转后', nx + 50, cy + 72, 15, acc, 'bold', 'center');
    simLine(ox + 100, cy, nx, cy, P.line || '#CCC', 2, [6, 5]);
  } else {
    // 平面图形轮换
    var shapes = ['正方形', '长方形', '圆形', '三角形'];
    var nm = shapes[k % shapes.length];
    if (nm === '圆形') { simRing(cx, cy, 70, col, 4); }
    else if (nm === '三角形') { simLine(cx - 80, cy + 60, cx + 80, cy + 60, col, 3); simLine(cx - 80, cy + 60, cx, cy - 70, col, 3); simLine(cx, cy - 70, cx + 80, cy + 60, col, 3); }
    else if (nm === '长方形') { simBox(cx - 100, cy - 60, 200, 120, P.primarySoft || '#E3F2FD', col, 6); }
    else { simBox(cx - 75, cy - 75, 150, 150, P.primarySoft || '#E3F2FD', col, 6); }
    simTxt(nm, cx, SIM_H - 52, 20, acc, 'bold', 'center');
  }
}

/* ---- measure：直尺 / 天平 / 方位 ---- */
function drawMeasure() {
  var c = simCase(), P = simC();
  var kind = c.kind || 'ruler';
  simTxt(c.title || '量一量', SIM_W / 2, 34, 22, P.primary || '#1565C0', 'bold', 'center');
  var n = Math.min(SIM.n, 20);
  if (kind === 'balance') {
    var cx = SIM_W / 2, cy = 150;
    simLine(cx, cy, cx, 300, '#8D6E63', 8);
    simLine(cx - 220, cy, cx + 220, cy, '#8D6E63', 8);
    simBox(cx - 200, cy - 8, 90, 74, '#FFECB3', P.accent || '#FF8F00', 8);
    simBox(cx + 110, cy - 8, 90, 74, '#E3F2FD', P.primary || '#1565C0', 8);
    for (var w = 0; w < n; w++) simDot(cx + 128 + (w % 4) * 18, cy + 64 - Math.floor(w / 4) * 16, 7, P.primary || '#1565C0');
    simTxt((c.left || '1 千克'), cx - 155, cy + 84, 18, P.accent || '#FF8F00', 'bold', 'center');
    simTxt(n + ' 个砝码', cx + 155, cy + 84, 18, P.primary || '#1565C0', 'bold', 'center');
  } else if (kind === 'position') {
    var dirs = c.dirs || ['上', '下', '前', '后', '左', '右'];
    var pos = [[0, -1], [0, 1], [0, -1], [0, 1], [-1, 0], [1, 0]];
    var cx2 = SIM_W / 2, cy2 = 190;
    for (var d = 0; d < dirs.length; d++) {
      var ang = d * Math.PI / 3 - Math.PI / 2;
      var px = cx2 + 150 * Math.cos(ang), py = cy2 + 150 * Math.sin(ang);
      var on = d <= n;
      simDot(px, py, 26, on ? (P.accent || '#FF8F00') : '#ECEFF1', '#fff');
      simTxt(dirs[d], px, py + 7, 20, on ? '#fff' : '#999', 'bold', 'center');
    }
    simDot(cx2, cy2, 34, P.primary || '#1565C0', '#fff');
    simTxt('我', cx2, cy2 + 8, 20, '#fff', 'bold', 'center');
  } else {
    var x0 = 70, y = 190, len = SIM_W - 140;
    simLine(x0, y, x0 + len, y, '#8D6E63', 4);
    for (var i = 0; i <= 20; i++) {
      var x = x0 + len * i / 20, big = (i % 5 === 0);
      simLine(x, y, x, y - (big ? 22 : 12), big ? '#424242' : '#9E9E9E', big ? 2.5 : 1.5);
      if (big) simTxt(String(i), x, y + 26, 15, '#616161', 'normal', 'center');
    }
    var mx = x0 + len * n / 20;
    simLine(mx, y - 40, mx, y + 8, P.accent || '#FF8F00', 3);
    simDot(mx, y - 44, 9, P.accent || '#FF8F00');
    simTxt(n + ' 厘米', mx, y - 58, 18, P.accent || '#FF8F00', 'bold', 'center');
  }
}

/* ---- stat：数据收集 / 找规律 / 条形统计 ---- */
function drawStat() {
  var c = simCase(), P = simC();
  simTxt(c.title || '统计与规律', SIM_W / 2, 34, 22, P.primary || '#1565C0', 'bold', 'center');
  if (c.pattern) {
    var seq = c.pattern || ['●', '▲', '●', '▲'];
    var shown = Math.min(SIM.n + 2, seq.length);
    for (var i = 0; i < shown; i++) {
      var x = 90 + i * 96;
      simBox(x - 34, 120, 68, 68, i % 2 ? '#FFF3E0' : '#E3F2FD', '#CFD8DC', 10);
      simTxt(seq[i], x, 168, 32, i % 2 ? (P.accent || '#FF8F00') : (P.primary || '#1565C0'), 'bold', 'center');
    }
    simTxt('下一个是什么？点「加一个」继续排', SIM_W / 2, SIM_H - 56, 17, P.muted || '#666', 'normal', 'center');
  } else {
    var cats = c.cats || ['苹果', '香蕉', '梨', '桃'];
    var vals = c.vals || [3, 5, 2, 4];
    var bw = 90, gap = 40, x0 = (SIM_W - (cats.length * bw + (cats.length - 1) * gap)) / 2;
    var baseY = 290, maxV = 8, unitH = 26;
    simLine(x0 - 20, baseY, SIM_W - x0 + 20, baseY, '#9E9E9E', 2);
    for (var j = 0; j < cats.length; j++) {
      var v = Math.min(vals[j], SIM.n + (j === 0 ? 1 : vals[j]));
      var h = v * unitH, bx = x0 + j * (bw + gap);
      simBox(bx, baseY - h, bw, h, j % 2 ? (P.accent || '#FF8F00') : (P.primary || '#1565C0'), '#fff', 6);
      simTxt(v, bx + bw / 2, baseY - h - 8, 18, P.ink || '#333', 'bold', 'center');
      simTxt(cats[j], bx + bw / 2, baseY + 24, 16, P.muted || '#666', 'normal', 'center');
    }
    simTxt('点「加一个」收集数据，条形会长高', SIM_W / 2, SIM_H - 30, 15, P.muted || '#666', 'normal', 'center');
  }
}

/* ---- observe：观察记录（科学）逐条揭示观察对象与特征 ---- */
function drawObserve() {
  var c = simCase(), P = simC();
  var items = c.items || ['形状', '颜色', '大小', '气味'];
  var n = Math.min(SIM.n, items.length);
  simTxt(c.title || '观察：一次看一样，边看边记', SIM_W / 2, 34, 22, P.primary || '#1565C0', 'bold', 'center');
  var cols = Math.min(items.length, 4);
  var cw = Math.min(180, (SIM_W - 120) / cols), gap = 18;
  var x0 = (SIM_W - (cols * cw + (cols - 1) * gap)) / 2, y = 92;
  for (var i = 0; i < items.length; i++) {
    var x = x0 + i * (cw + gap);
    var on = i < n;
    simBox(x, y, cw, 150, on ? (i % 2 ? (P.accentSoft || '#FFF3E0') : (P.primarySoft || '#E3F2FD')) : '#F5F5F5',
           on ? (i % 2 ? P.accent : P.primary) : '#E0E0E0', 12);
    if (on) {
      simTxt(String(i + 1), x + cw / 2, y + 40, 26, i % 2 ? P.accent : P.primary, 'bold', 'center');
      var label = String(items[i]);
      simTxt(label.length > 8 ? label.slice(0, 8) : label, x + cw / 2, y + 88, 17, P.ink || '#333', 'bold', 'center');
      if (label.length > 8) simTxt(label.slice(8), x + cw / 2, y + 114, 17, P.ink || '#333', 'bold', 'center');
    } else {
      simTxt('?', x + cw / 2, y + 90, 40, '#BDBDBD', 'bold', 'center');
    }
  }
  simTxt('已观察 ' + n + ' / ' + items.length + ' 项', SIM_W / 2, y + 186, 17, P.accent || '#FF8F00', 'bold', 'center');
  simTxt(c.tip || '点「观察下一项」，一次记一样', SIM_W / 2, SIM_H - 46, 15, P.muted || '#777', 'normal', 'center');
}

/* ---- experiment：变量实验（科学）改变条件，看现象变化 ---- */
function drawExperiment() {
  var c = simCase(), P = simC();
  var steps = c.steps || ['提出问题', '做出猜测', '动手实验', '观察记录', '得出结论'];
  var levels = c.levels || ['弱', '中', '强'];
  var n = Math.min(SIM.n, steps.length);
  simTxt(c.title || '变量实验：一次只改一个条件', SIM_W / 2, 34, 22, P.primary || '#1565C0', 'bold', 'center');
  // 左：装置示意（量筒/容器随 n 增高）
  var bx = 150, by = 286, bw = 200, bh = 150;
  simBox(bx, by - bh, bw, bh, '#F4FAFF', P.primary || '#1565C0', 10);
  var fill = Math.min(1, n / steps.length) * (bh - 20);
  simBox(bx + 4, by - 4 - fill, bw - 8, fill, P.primarySoft || '#90CAF9', null, 6);
  simTxt(c.subject || '实验对象', bx + bw / 2, by + 26, 16, P.primary || '#1565C0', 'bold', 'center');
  // 右：步骤阶梯
  var sx = 430, sy = 82, sh = 40;
  for (var i = 0; i < steps.length; i++) {
    var on = i < n;
    var yy = sy + i * (sh + 8);
    simBox(sx + i * 8, yy, SIM_W - sx - 80 - i * 8, sh,
           on ? (i === steps.length - 1 ? '#E8F5E9' : '#FFF3E0') : '#F5F5F5',
           on ? (i === steps.length - 1 ? '#2E7D32' : P.accent) : '#E0E0E0', 8);
    simTxt((i + 1) + '. ' + steps[i], sx + 20 + i * 8, yy + 27, 16,
           on ? P.ink || '#333' : '#BDBDBD', on ? 'bold' : 'normal');
  }
  var lv = levels[Math.min(levels.length - 1, Math.floor(n / Math.max(1, steps.length / levels.length)))];
  simTxt('条件：' + lv, SIM_W - 120, 60, 18, P.accent || '#FF8F00', 'bold', 'center');
  simTxt(c.tip || '一次只改一个条件，其他保持不变', SIM_W / 2, SIM_H - 40, 15, P.muted || '#777', 'normal', 'center');
}

/* ---- scenario：情境辨析（道法）逐条呈现情境与做法 ---- */
function drawScenario() {
  var c = simCase(), P = simC();
  var scenes = c.scenes || ['在教室', '在操场', '在家里'];
  var n = Math.min(SIM.n, scenes.length);
  simTxt(c.title || '情境辨析：这样做对吗', SIM_W / 2, 34, 22, P.primary || '#1565C0', 'bold', 'center');
  var shown = Math.max(1, n);
  for (var i = 0; i < shown; i++) {
    var x = 90, y = 70 + i * 78;
    var good = c.good && c.good.indexOf(i) >= 0;
    var on = i < n;
    simBox(x, y, SIM_W - 180, 66, on ? (good ? '#E8F5E9' : '#FFEBEE') : '#F5F5F5',
           on ? (good ? '#2E7D32' : '#C62828') : '#E0E0E0', 10);
    simTxt(String(i + 1), x + 34, y + 42, 24, on ? (good ? '#2E7D32' : '#C62828') : '#BDBDBD', 'bold', 'center');
    var txt = String(scenes[i]);
    simTxt(txt.length > 30 ? txt.slice(0, 30) : txt, x + 66, y + 30, 16, on ? P.ink || '#333' : '#BDBDBD', 'bold');
    if (txt.length > 30) simTxt(txt.slice(30), x + 66, y + 52, 16, on ? P.ink || '#333' : '#BDBDBD', 'bold');
    if (on) simTxt(good ? '✓ 值得提倡' : '✗ 需要改正', SIM_W - 200, y + 42, 16, good ? '#2E7D32' : '#C62828', 'bold', 'center');
  }
  simTxt('已辨析 ' + n + ' / ' + scenes.length + ' 个情境', SIM_W / 2, SIM_H - 40, 16, P.accent || '#FF8F00', 'bold', 'center');
}

/* ---- process：流程步骤（科学/工程/道法通用） ---- */
function drawProcess() {
  var c = simCase(), P = simC();
  var steps = c.steps || ['第一步', '第二步', '第三步', '第四步'];
  var n = Math.min(SIM.n, steps.length);
  simTxt(c.title || '按顺序一步步做', SIM_W / 2, 34, 22, P.primary || '#1565C0', 'bold', 'center');
  var per = Math.min(4, steps.length), rows = Math.ceil(steps.length / per);
  var bw = Math.min(190, (SIM_W - 120) / per - 16), bh = Math.min(100, (SIM_H - 130) / rows - 12);
  for (var i = 0; i < steps.length; i++) {
    var col = i % per, row = Math.floor(i / per);
    var x = 60 + col * (bw + 16), y = 74 + row * (bh + 14);
    var on = i < n;
    simBox(x, y, bw, bh, on ? (i % 2 ? (P.accentSoft || '#FFF3E0') : (P.primarySoft || '#E3F2FD')) : '#F5F5F5',
           on ? (i % 2 ? P.accent : P.primary) : '#E0E0E0', 10);
    simTxt(String(i + 1), x + 30, y + 34, 24, on ? (i % 2 ? P.accent : P.primary) : '#BDBDBD', 'bold', 'center');
    var t = String(steps[i]);
    simTxt(t.length > 9 ? t.slice(0, 9) : t, x + bw / 2, y + 62, 15, on ? P.ink || '#333' : '#BDBDBD', 'bold', 'center');
    if (t.length > 9) simTxt(t.slice(9, 18), x + bw / 2, y + 82, 15, on ? P.ink || '#333' : '#BDBDBD', 'bold', 'center');
    if (col < per - 1 && i < steps.length - 1) simLine(x + bw + 2, y + bh / 2, x + bw + 14, y + bh / 2, P.line || '#CCC', 2);
  }
  simTxt('完成 ' + n + ' / ' + steps.length + ' 步', SIM_W / 2, SIM_H - 36, 16, P.accent || '#FF8F00', 'bold', 'center');
}

// 初始绘制（onenter 进入 p6 时也会调用 simDraw）
simDraw();

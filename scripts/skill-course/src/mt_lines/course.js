// ===== 仿真：给一条线加 / 去端点，看它变成什么 =====
var SIM_W = 880, SIM_H = 360;
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';
var SIM_CX = 440;            // 画布中线
var SIM_Y = 152;             // 主线所在高度
var SIM_PXCM = 40;           // 40px = 1 厘米

var SIM_CASES = [
  { name: '一根小棒', len: 8 },
  { name: '一支铅笔', len: 6 },
  { name: '一条纸条', len: 12 }
];

// L / R = 1 表示那一头已经去掉端点、无限延伸
var SIM = { i: 0, L: 0, R: 0 };

function simCtx() { return document.getElementById('simCanvas').getContext('2d'); }

function simTxt(t, x, y, size, color, weight, align) {
  var ctx = simCtx();
  ctx.save();
  ctx.font = (weight ? weight.trim() + ' ' : '') + size + 'px ' + SIM_FONT;
  ctx.fillStyle = color;
  ctx.textAlign = align || 'left';
  ctx.fillText(t, x, y);
  ctx.restore();
}

function simLine(x1, y1, x2, y2, color, w, dash, alpha) {
  var ctx = simCtx();
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = w || 3; ctx.lineCap = 'round';
  if (dash) ctx.setLineDash(dash);
  if (alpha !== undefined) ctx.globalAlpha = alpha;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.restore();
}

function simPanel(x, y, w, h, fill, stroke, r) {
  var ctx = simCtx();
  r = (r === undefined) ? 8 : r;
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

function simCircle(x, y, rad, fill, stroke) {
  var ctx = simCtx();
  ctx.save();
  ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.8; ctx.stroke(); }
  ctx.restore();
}

function simCur() { return SIM_CASES[SIM.i]; }
function simHalf() { return simCur().len * SIM_PXCM / 2; }
function simLX() { return SIM_CX - simHalf(); }
function simRX() { return SIM_CX + simHalf(); }
function simEnds() { return 2 - SIM.L - SIM.R; }

function simName() {
  var n = simEnds();
  if (n === 2) return '线段';
  if (n === 1) return '射线';
  return '直线';
}

// 无限延伸：三段越来越淡的虚线 + 箭头
function simTail(x, y, dir) {
  var seg = [
    { w: 42, dash: [9, 6], a: 1, wd: 2.8 },
    { w: 42, dash: [6, 9], a: 0.6, wd: 2.4 },
    { w: 42, dash: [4, 11], a: 0.3, wd: 2 }
  ];
  var cur = x;
  for (var i = 0; i < seg.length; i++) {
    var nx = cur + dir * seg[i].w;
    simLine(cur, y, nx, y, '#FF7043', seg[i].wd, seg[i].dash, seg[i].a);
    cur = nx;
  }
  // 箭头
  ctxArrow(cur, y, dir);
}

function ctxArrow(x, y, dir) {
  var ctx = simCtx();
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + dir * 12, y);
  ctx.lineTo(x, y - 8);
  ctx.lineTo(x, y + 8);
  ctx.closePath();
  ctx.fillStyle = '#FF7043';
  ctx.fill();
  ctx.restore();
}

function simDraw() {
  var ctx = simCtx();
  var c = simCur();
  var LX = simLX(), RX = simRX();
  var n = simEnds();

  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FAFAFE';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  // ===== 标题 =====
  simTxt('这条线现在是：' + simName(), 40, 44, 20, '#303F9F', 'bold');
  simTxt('去掉一个端点，那一头就再也走不到底', 40, 70, 13, '#7986CB');

  // ===== 主线 =====
  simLine(LX, SIM_Y, RX, SIM_Y, '#303F9F', 4);
  if (SIM.L) simTail(LX, SIM_Y, -1);
  if (SIM.R) simTail(RX, SIM_Y, 1);

  // ===== 端点 =====
  if (!SIM.L) {
    simCircle(LX, SIM_Y, 9, '#FF7043');
    simCircle(LX, SIM_Y, 3.4, '#FFFFFF');
    simTxt('A', LX, SIM_Y - 20, 14, '#BF360C', 'bold', 'center');
  }
  if (!SIM.R) {
    simCircle(RX, SIM_Y, 9, '#FF7043');
    simCircle(RX, SIM_Y, 3.4, '#FFFFFF');
    simTxt('B', RX, SIM_Y - 20, 14, '#BF360C', 'bold', 'center');
  }

  // ===== 长度标注 =====
  var dy = SIM_Y + 52;
  if (n === 2) {
    simLine(LX, dy, RX, dy, '#303F9F', 1.6);
    simLine(LX, dy - 7, LX, dy + 7, '#303F9F', 1.6);
    simLine(RX, dy - 7, RX, dy + 7, '#303F9F', 1.6);
    simTxt(c.len + ' 厘米', SIM_CX, dy - 8, 14, '#303F9F', 'bold', 'center');
  } else {
    simLine(80, dy, 800, dy, '#B0BEC5', 1.4, [6, 6]);
    simTxt('量不出来', SIM_CX, dy - 8, 14, '#C62828', 'bold', 'center');
    if (n === 1) {
      simTxt('从端点出发，一直走不到头', SIM_CX, dy + 22, 12, '#C62828', null, 'center');
    } else {
      simTxt('两头都走不到头', SIM_CX, dy + 22, 12, '#C62828', null, 'center');
    }
  }

  // ===== 三项判定 =====
  var py = 236, pw = 240, ph = 66;
  var cols = [
    { x: 60,  title: '端点数',   val: String(n),                 ok: n === 2 },
    { x: 320, title: '能量长度', val: n === 2 ? '能' : '不能',    ok: n === 2 },
    { x: 580, title: '能延长',   val: n === 2 ? '不能' : (n === 1 ? '只能一头' : '两头都行'), ok: n !== 2 }
  ];
  for (var i = 0; i < cols.length; i++) {
    var col = cols[i];
    simPanel(col.x, py, pw, ph, col.ok ? '#FFF3E0' : '#E8EAF6',
      col.ok ? '#FFCCBC' : '#C5CAE9', 10);
    simTxt(col.title, col.x + pw / 2, py + 24, 12.5, '#7986CB', null, 'center');
    simTxt(col.val, col.x + pw / 2, py + 52, 19, col.ok ? '#BF360C' : '#303F9F', 'bold', 'center');
  }

  // ===== 底部提示 =====
  simLine(40, 322, 840, 322, '#E8EAF6', 1.2);
  var tip;
  if (n === 2) tip = '两头都封住，长度定死在 ' + c.len + ' 厘米，量得出来。';
  else if (n === 1) tip = '少一个端点，那一头无限长，整条线就没有长度了。';
  else tip = '两头都没有端点，往哪儿走都走不到底，更谈不上长度。';
  simTxt(tip, 40, 344, 13.5, '#5C6BC0');

  simRefresh();
}

function simRefresh() {
  var c = simCur();
  var n = simEnds();
  var rd = document.getElementById('simReadout');
  var tp = document.getElementById('simTip');
  if (!rd || !tp) return;
  if (n === 2) {
    rd.textContent = '线段 AB · 2 个端点';
    tp.textContent = '能量出 ' + c.len + ' 厘米';
    tp.style.color = '#2E7D32';
  } else if (n === 1) {
    rd.textContent = '射线 · 1 个端点';
    tp.textContent = '量不出长度';
    tp.style.color = '#C62828';
  } else {
    rd.textContent = '直线 · 0 个端点';
    tp.textContent = '量不出长度';
    tp.style.color = '#C62828';
  }
}

function simLog(msg, hl) {
  var box = document.getElementById('simLog');
  if (!box) return;
  var d = document.createElement('div');
  d.className = 'sim-log-line';
  if (hl) d.style.color = '#2E7D32';
  d.textContent = msg;
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
}

// ===== 操作 =====
function simLeft() {
  if (SIM.L) { simLog('左端已经没有端点了'); simDraw(); return; }
  SIM.L = 1;
  simLog('去掉左端点：变成' + simName() + '，' + simEnds() + ' 个端点');
  simDraw();
}

function simRight() {
  if (SIM.R) { simLog('右端已经没有端点了'); simDraw(); return; }
  SIM.R = 1;
  simLog('去掉右端点：变成' + simName() + '，' + simEnds() + ' 个端点');
  simDraw();
}

function simBack() {
  if (SIM.R) {
    SIM.R = 0;
    simLog('装回一个端点：现在是' + simName());
  } else if (SIM.L) {
    SIM.L = 0;
    simLog('装回一个端点：现在是' + simName());
  } else {
    simLog('已经两头都是端点了');
  }
  simDraw();
}

function simCase(dir) {
  if (dir === undefined || isNaN(dir)) dir = 1;
  SIM.i = (SIM.i + dir + SIM_CASES.length) % SIM_CASES.length;
  SIM.L = 0; SIM.R = 0;
  var c = simCur();
  simLog('换一条：' + c.name + '，' + c.len + ' 厘米');
  simDraw();
}

function simReset() {
  SIM.L = 0; SIM.R = 0;
  simLog('重来：回到线段');
  simDraw();
}

var SIM_TIMER = null;
function simDemo() {
  if (SIM_TIMER) { clearInterval(SIM_TIMER); SIM_TIMER = null; }
  SIM.L = 0; SIM.R = 0;
  simDraw();
  simLog('自动演示：先看线段');
  var k = 0;
  SIM_TIMER = setInterval(function () {
    k++;
    if (k === 1) { SIM.R = 1; simLog('去掉一个端点 → 射线'); }
    else if (k === 2) { SIM.L = 1; simLog('再去掉一个端点 → 直线，两头都走不到底'); }
    else {
      clearInterval(SIM_TIMER); SIM_TIMER = null;
      return;
    }
    simDraw();
  }, 1000);
}

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.dataset.bound) return;
  cv.dataset.bound = '1';
  cv.style.cursor = 'pointer';
  cv.addEventListener('click', function (e) {
    var rect = cv.getBoundingClientRect();
    var x = (e.clientX - rect.left) * (SIM_W / rect.width);
    var y = (e.clientY - rect.top) * (SIM_H / rect.height);
    if (y < SIM_Y - 36 || y > SIM_Y + 36) return;
    if (x < SIM_CX) simLeft(); else simRight();
  });
}

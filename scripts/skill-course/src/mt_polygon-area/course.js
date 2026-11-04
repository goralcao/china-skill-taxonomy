// ===== 仿真：平行四边形剪一刀、平移，变长方形 =====
var SIM_W = 880, SIM_H = 360;
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';

// b = 底（米），h = 高（米），s = 上边右移（米）
var SIM_CASES = [
  { b: 6, h: 4, s: 2 },
  { b: 8, h: 5, s: 2 },
  { b: 3, h: 7, s: 1.5 },
  { b: 10, h: 4, s: 2.5 }
];

// cut = 是否已剪；t = 平移进度 0~1；grid = 是否显示格线
var SIM = { i: 0, cut: false, t: 0, grid: false };

function simCur() { return SIM_CASES[SIM.i]; }
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

function simPoly(pts, fill, stroke, w, dash) {
  var ctx = simCtx();
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) {
    ctx.strokeStyle = stroke; ctx.lineWidth = w || 1.8;
    if (dash) ctx.setLineDash(dash);
    ctx.stroke();
  }
  ctx.restore();
}

function simTxtBox(t, x, y, size, color, weight, align) { simTxt(t, x, y, size, color, weight, align); }

function simGeom() {
  var c = simCur();
  var sc = Math.min(46, 460 / (c.b + c.s), 178 / c.h);
  var x0 = 118, y0 = 66;
  return { sc: sc, x0: x0, y0: y0, w: c.b * sc, h: c.h * sc, s: c.s * sc, b: c.b, hh: c.h };
}

function simDraw() {
  var ctx = simCtx();
  var g = simGeom(), c = simCur();
  ctx.clearRect(0, 0, SIM_W, SIM_H);

  // 顶部读数条
  simTxt('底 ' + c.b + ' 米', g.x0, 34, 15, '#33691E', '700');
  simTxt('高 ' + c.h + ' 米', g.x0 + 110, 34, 15, '#E65100', '700');
  simTxt('面积 = ' + c.b + ' × ' + c.h + ' = ' + (c.b * c.h) + ' 平方米', g.x0 + 220, 34, 15, '#1B5E20', '700');
  simTxt(SIM.grid ? '格线：1 米一格' : '按「显示格线」可以用数格子验证', 828, 34, 12, '#8BC34A', '', 'end');

  // 格线
  if (SIM.grid) {
    for (var i = 0; i <= c.b + c.s; i++) {
      var gx = g.x0 + i * g.sc;
      simLine(gx, g.y0, gx, g.y0 + g.h, i % 1 === 0 ? '#DCEDC8' : '#DCEDC8', 1);
    }
    for (var j = 0; j <= c.h; j++) {
      var gy = g.y0 + j * g.sc;
      simLine(g.x0, gy, g.x0 + (c.b + c.s) * g.sc, gy, '#DCEDC8', 1);
    }
  }

  var A = [g.x0 + g.s, g.y0];
  var B = [g.x0 + g.s + g.w, g.y0];
  var C = [g.x0 + g.w, g.y0 + g.h];
  var D = [g.x0, g.y0 + g.h];
  var E = [g.x0 + g.s, g.y0 + g.h];

  // 目标长方形虚框
  simPoly([[g.x0 + g.s, g.y0], [g.x0 + g.s + g.w, g.y0], [g.x0 + g.s + g.w, g.y0 + g.h], [g.x0 + g.s, g.y0 + g.h]],
          null, '#9E9E9E', 1.4, [7, 5]);

  if (!SIM.cut) {
    // 完整平行四边形
    simPoly([A, B, C, D], 'rgba(139,195,74,.34)', '#33691E', 2);
  } else {
    // 剩余梯形
    simPoly([A, B, C, E], 'rgba(139,195,74,.34)', '#33691E', 2);
    // 剪下的三角形（平移 t*b）
    var dx = SIM.t * g.w;
    var T = [[A[0] + dx, A[1]], [E[0] + dx, E[1]], [D[0] + dx, D[1]]];
    simPoly(T, 'rgba(255,143,0,.42)', '#E65100', 2);
    // 剪痕
    if (SIM.t < 0.99) {
      simLine(A[0], A[1], E[0], E[1], '#C62828', 2, [6, 4]);
    }
    // 平移箭头
    if (SIM.t < 0.99) {
      var ay = g.y0 + g.h * 0.5;
      simLine(A[0] + 12, ay, A[0] + g.w * 0.55, ay, '#E65100', 1.6, [5, 4]);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(A[0] + g.w * 0.55 + 8, ay);
      ctx.lineTo(A[0] + g.w * 0.55 - 4, ay - 6);
      ctx.lineTo(A[0] + g.w * 0.55 - 4, ay + 6);
      ctx.closePath();
      ctx.fillStyle = '#E65100';
      ctx.fill();
      ctx.restore();
    }
  }

  // 底与高的标注：拼好后底随长方形移到新位置
  var bL = (SIM.cut && SIM.t > 0.99) ? A[0] : D[0];
  var bR = (SIM.cut && SIM.t > 0.99) ? A[0] + g.w : C[0];
  simLine(bL, D[1] + 14, bR, C[1] + 14, '#33691E', 2);
  simTxt('底 ' + c.b + ' 米', (bL + bR) / 2, D[1] + 34, 13, '#33691E', '700', 'center');
  simLine(A[0], A[1], E[0], E[1], '#E65100', 1.8, [4, 3]);
  // 直角记号
  ctx.save();
  ctx.strokeStyle = '#E65100'; ctx.lineWidth = 1.4;
  ctx.strokeRect(E[0], E[1] - 12, 12, 12);
  ctx.restore();
  simTxt('高 ' + c.h + ' 米', E[0] + 16, (A[1] + E[1]) / 2, 13, '#E65100', '700');

  // 顶点字母
  simTxt('A', A[0] - 4, A[1] - 8, 12, '#33691E');
  simTxt('B', B[0] + 6, B[1] - 8, 12, '#33691E');
  simTxt('C', C[0] + 6, C[1] + 16, 12, '#33691E');
  if (!(SIM.cut && SIM.t > 0.99)) simTxt('D', D[0] - 14, D[1] + 16, 12, '#33691E');

  // 右侧说明
  var rx = 660;
  simTxt(SIM.cut ? (SIM.t > 0.99 ? '拼好了' : '正在平移') : '还是原来的平行四边形',
         rx, 120, 16, '#1B5E20', '700');
  simTxt(SIM.cut && SIM.t > 0.99 ? ('长方形：' + c.b + ' × ' + c.h + ' = ' + (c.b * c.h) + ' 平方米')
    : ('绿色 + 橙色 = 整个图形，面积 ' + (c.b * c.h) + ' 平方米'),
         rx, 148, 13, '#558B2F');
  simTxt('剪拼前后面积不变，', rx, 186, 12, '#7CB342');
  simTxt('变的只是形状。', rx, 206, 12, '#7CB342');

  var ro = document.getElementById('simReadout');
  if (ro) ro.textContent = '底 ' + c.b + ' 米 · 高 ' + c.h + ' 米 · 面积 ' + (c.b * c.h) + ' 平方米';
  var tip = document.getElementById('simTip');
  if (tip) {
    if (!SIM.cut) tip.textContent = '还没剪，先按「剪一刀」';
    else if (SIM.t < 0.99) tip.textContent = '三角形剪下来了，按「挪过去」补到右边';
    else tip.textContent = '拼成长方形：长 ' + c.b + ' 米、宽 ' + c.h + ' 米';
  }
}

function simLog(msg, hl) {
  var box = document.getElementById('simLog');
  if (!box) return;
  var d = document.createElement('div');
  d.className = 'sim-log-line' + (hl ? ' hl' : '');
  d.textContent = msg;
  box.appendChild(d);
  if (box.children.length > 2) box.removeChild(box.firstChild);
}

function simCut() {
  if (SIM.cut) { simLog('已经剪过了，按「挪过去」'); return; }
  SIM.cut = true; SIM.t = 0;
  simDraw();
  var c = simCur();
  simLog('沿高剪下一刀：三角形 ' + c.s + '×' + c.h + '÷2，梯形留下', true);
}

var SIM_TIMER = null;
function simMove() {
  if (!SIM.cut) { simLog('还没剪，先按「剪一刀」'); return; }
  if (SIM_TIMER) { clearInterval(SIM_TIMER); SIM_TIMER = null; }
  SIM_TIMER = setInterval(function () {
    SIM.t = Math.min(1, SIM.t + 0.1);
    simDraw();
    if (SIM.t >= 1) {
      clearInterval(SIM_TIMER); SIM_TIMER = null;
      var c = simCur();
      simLog('拼成长方形：' + c.b + ' × ' + c.h + ' = ' + (c.b * c.h) + ' 平方米', true);
    }
  }, 90);
}

function simBack() {
  if (SIM_TIMER) { clearInterval(SIM_TIMER); SIM_TIMER = null; }
  SIM.cut = false; SIM.t = 0;
  simDraw();
  simLog('复原：回到原来的平行四边形');
}

function simCase() {
  if (SIM_TIMER) { clearInterval(SIM_TIMER); SIM_TIMER = null; }
  SIM.i = (SIM.i + 1) % SIM_CASES.length;
  SIM.cut = false; SIM.t = 0;
  simDraw();
  var c = simCur();
  simLog('换一块地：底 ' + c.b + ' 米、高 ' + c.h + ' 米');
}

function simGrid() {
  SIM.grid = !SIM.grid;
  simDraw();
  simLog(SIM.grid ? '格线出来了，可以数格子验证面积' : '收起格线');
}

function simDemo() {
  if (SIM_TIMER) { clearInterval(SIM_TIMER); SIM_TIMER = null; }
  SIM.cut = true; SIM.t = 0;
  simDraw();
  simLog('自动演示：剪一刀 → 平移 → 成长方形');
  SIM_TIMER = setInterval(function () {
    SIM.t = Math.min(1, SIM.t + 0.08);
    simDraw();
    if (SIM.t >= 1) {
      clearInterval(SIM_TIMER); SIM_TIMER = null;
      var c = simCur();
      simLog('停：底 × 高 = ' + c.b + ' × ' + c.h + ' = ' + (c.b * c.h), true);
    }
  }, 80);
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
    var g = simGeom();
    if (x < g.x0 || x > g.x0 + (g.w + g.s) || y < g.y0 || y > g.y0 + g.h) return;
    if (!SIM.cut) simCut();
    else if (SIM.t < 0.99) simMove();
  });
}

// ===== 仿真：按数对找格子 =====
var SIM_W = 880, SIM_H = 360;
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';

var SIM_COLS = 8, SIM_ROWS = 6;
var SIM_CW = 80, SIM_CH = 38;
var SIM_X0 = 130, SIM_Y0 = 72;

var SIM_CASES = [[3, 4], [6, 2], [1, 5], [8, 3], [5, 6], [2, 2]];

// i = 题号；pick = 学生点的格子 {c,r}；hint = 是否亮出行列
var SIM = { i: 0, pick: null, hint: false };

function simT() { return SIM_CASES[SIM.i]; }
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
  ctx.strokeStyle = color; ctx.lineWidth = w || 2; ctx.lineCap = 'round';
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.restore();
}

function simBox(x, y, w, h, fill, stroke, r) {
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

function simCellPos(c, r) {
  return { x: SIM_X0 + (c - 1) * SIM_CW, y: SIM_Y0 + (SIM_ROWS - r) * SIM_CH };
}

function simDraw() {
  var ctx = simCtx(), t = simT();
  ctx.clearRect(0, 0, SIM_W, SIM_H);

  // 题面
  simBox(24, 16, 832, 44, '#F6F7FC', '#CFD3E8', 10);
  simTxt('要点的位置', 44, 44, 13, '#7986CB');
  simTxt('(' + t[0] + ', ' + t[1] + ')', 132, 46, 22, '#283593', '700');
  simTxt('= 第 ' + t[0] + ' 列 第 ' + t[1] + ' 行', 226, 44, 14, '#283593');
  simTxt('列号看下边，行号看左边', 776, 44, 13, '#90A4AE', '', 'end');

  // 行列提示
  if (SIM.hint) {
    var cy = SIM_Y0 + (SIM_ROWS - t[1]) * SIM_CH + SIM_CH / 2;
    var cx = SIM_X0 + (t[0] - 1) * SIM_CW + SIM_CW / 2;
    simLine(SIM_X0, cy, SIM_X0 + SIM_COLS * SIM_CW, cy, '#26C6DA', 2, [7, 5]);
    simLine(cx, SIM_Y0, cx, SIM_Y0 + SIM_ROWS * SIM_CH, '#26C6DA', 2, [7, 5]);
  }

  // 底格
  for (var c = 1; c <= SIM_COLS; c++) {
    for (var r = 1; r <= SIM_ROWS; r++) {
      var p = simCellPos(c, r);
      simBox(p.x + 1.5, p.y + 1.5, SIM_CW - 3, SIM_CH - 3, '#FFFFFF', '#CFD3E8', 5);
    }
  }

  // 点过的格子
  if (SIM.pick) {
    var ok = (SIM.pick.c === t[0] && SIM.pick.r === t[1]);
    var pp = simCellPos(SIM.pick.c, SIM.pick.r);
    simBox(pp.x + 1.5, pp.y + 1.5, SIM_CW - 3, SIM_CH - 3,
           ok ? '#C8E6C9' : '#FFCDD2', ok ? '#2E7D32' : '#C62828', 5);
    simTxt('(' + SIM.pick.c + ',' + SIM.pick.r + ')', pp.x + SIM_CW / 2, pp.y + SIM_CH / 2 + 5, 14,
           ok ? '#1B5E20' : '#B71C1C', '700', 'center');
  }

  // 列号 / 行号
  for (var c2 = 1; c2 <= SIM_COLS; c2++) {
    simTxt(String(c2), SIM_X0 + (c2 - 0.5) * SIM_CW, SIM_Y0 + SIM_ROWS * SIM_CH + 20, 13, '#5C6BC0', '', 'center');
  }
  for (var r2 = 1; r2 <= SIM_ROWS; r2++) {
    simTxt(String(r2), SIM_X0 - 14, SIM_Y0 + (SIM_ROWS - r2) * SIM_CH + SIM_CH / 2 + 5, 13, '#5C6BC0', '', 'right');
  }
  simTxt('列 →', SIM_X0 + SIM_COLS * SIM_CW + 14, SIM_Y0 + SIM_ROWS * SIM_CH + 20, 12, '#90A4AE');
  simTxt('行 ↑', 30, SIM_Y0 + 6, 12, '#90A4AE');

  var ro = document.getElementById('simReadout');
  if (ro) {
    ro.textContent = '目标 (' + t[0] + ', ' + t[1] + ') · ' +
      (SIM.pick ? ('你点了 (' + SIM.pick.c + ', ' + SIM.pick.r + ')') : '还没点');
  }
  var tip = document.getElementById('simTip');
  if (tip) {
    if (!SIM.pick) tip.textContent = '先横着数 ' + t[0] + ' 列，再竖着数 ' + t[1] + ' 行';
    else if (SIM.pick.c === t[0] && SIM.pick.r === t[1]) tip.textContent = '对了，就是 ( ' + t[0] + ', ' + t[1] + ' )';
    else if (SIM.pick.c !== t[0] && SIM.pick.r !== t[1]) tip.textContent = '列和行都差着，再数一遍';
    else if (SIM.pick.c !== t[0]) tip.textContent = '行数对了，列数差 ' + Math.abs(SIM.pick.c - t[0]) + ' 格';
    else tip.textContent = '列数对了，行数差 ' + Math.abs(SIM.pick.r - t[1]) + ' 格';
  }
}

function simLog(msg, hl) {
  var box = document.getElementById('simLog');
  if (!box) return;
  var d = document.createElement('div');
  d.className = 'sim-log-line' + (hl ? ' hl' : '');
  d.textContent = msg;
  box.appendChild(d);
  if (box.children.length > 4) box.removeChild(box.firstChild);
}

function simHint() {
  SIM.hint = !SIM.hint;
  simDraw();
  var t = simT();
  simLog(SIM.hint ? ('第 ' + t[0] + ' 列是一道竖条，第 ' + t[1] + ' 行是一道横条，交叉那一格就是') : '收起了行列提示');
}

function simCase() {
  SIM.i = (SIM.i + 1) % SIM_CASES.length;
  SIM.pick = null; SIM.hint = false;
  simDraw();
  var t = simT();
  simLog('换一题：找 (' + t[0] + ', ' + t[1] + ')');
}

function simReset() {
  SIM.pick = null; SIM.hint = false;
  simDraw();
  simLog('重来：找 (' + simT()[0] + ', ' + simT()[1] + ')', true);
}

var SIM_TIMER = null;
function simDemo() {
  if (SIM_TIMER) { clearInterval(SIM_TIMER); SIM_TIMER = null; }
  SIM.pick = null; SIM.hint = true;
  simDraw();
  var t = simT();
  simLog('自动演示：先横向数 ' + t[0] + ' 列');
  SIM_TIMER = setTimeout(function () {
    SIM.pick = { c: t[0], r: t[1] };
    simDraw();
    simLog('再竖向数 ' + t[1] + ' 行，交点就是 (' + t[0] + ', ' + t[1] + ')', true);
    SIM_TIMER = null;
  }, 900);
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
    var c = Math.floor((x - SIM_X0) / SIM_CW) + 1;
    var r = SIM_ROWS - Math.floor((y - SIM_Y0) / SIM_CH);
    if (c < 1 || c > SIM_COLS || r < 1 || r > SIM_ROWS) return;
    SIM.pick = { c: c, r: r };
    simDraw();
    var t = simT();
    if (c === t[0] && r === t[1]) simLog('点对了：(' + c + ', ' + r + ')', true);
    else simLog('点到了 (' + c + ', ' + r + ')，目标是 (' + t[0] + ', ' + t[1] + ')');
  });
}

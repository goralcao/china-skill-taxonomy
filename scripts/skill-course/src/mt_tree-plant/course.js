// ===== 仿真：在路上摆树，看间隔数与棵数 =====
var SIM_W = 880, SIM_H = 360;
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';

var SIM_ROADS = [20, 30, 40, 50];
var SIM_GAPS = [2, 4, 5, 10];
var SIM_MODES = ['两端都栽', '只栽一端', '两端都不栽'];

// i = 路长序号；g = 间隔序号；m = 栽法序号
var SIM = { i: 0, g: 2, m: 0 };

function simL() { return SIM_ROADS[SIM.i]; }
function simGap() { return SIM_GAPS[SIM.g]; }
function simSeg() { return Math.round(simL() / simGap()); }
function simTrees() {
  var s = simSeg();
  return s + (SIM.m === 0 ? 1 : (SIM.m === 1 ? 0 : -1));
}

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

function simTree(x, y, r) {
  var ctx = simCtx();
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y + r);
  ctx.lineTo(x, y + r + 14);
  ctx.strokeStyle = '#8D6E63';
  ctx.lineWidth = 3.4;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = '#66BB6A';
  ctx.fill();
  ctx.strokeStyle = '#2E7D32';
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.restore();
}

function simDraw() {
  var ctx = simCtx();
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  var L = simL(), gap = simGap(), seg = simSeg(), trees = simTrees();

  // 顶部参数条
  simBox(24, 14, 832, 48, '#F7FBFE', '#B3E5FC', 10);
  simTxt('路长', 44, 43, 13, '#4FC3F7');
  simTxt(L + ' 米', 88, 45, 19, '#01579B', '700');
  simTxt('间隔', 176, 43, 13, '#4FC3F7');
  simTxt(gap + ' 米', 218, 45, 19, '#01579B', '700');
  simTxt('栽法', 300, 43, 13, '#4FC3F7');
  simTxt(SIM_MODES[SIM.m], 342, 45, 16, '#E65100', '700');
  simTxt('棵数 = ' + seg + (SIM.m === 0 ? ' + 1' : (SIM.m === 1 ? '' : ' − 1')) + ' = ' + trees,
         560, 45, 16, '#01579B', '700');
  simTxt('画图点数最不会错', 840, 43, 12, '#90A4AE', '', 'end');

  // 路
  var x0 = 60, x1 = 820, y = 170;
  simBox(x0, y, x1 - x0, 16, '#E1F5FE', '#81D4FA', 5);
  var sc = (x1 - x0) / L;

  // 间隔刻度
  for (var k = 0; k <= seg; k++) {
    var gx = x0 + k * gap * sc;
    simLine(gx, y - 4, gx, y + 20, '#4FC3F7', 1.2, [4, 3]);
    if (seg <= 10 || k % 2 === 0) {
      simTxt(String(k * gap), gx, y + 40, 11, '#4FC3F7', '', 'center');
    }
  }

  // 间隔编号
  for (var k2 = 0; k2 < seg; k2++) {
    var cx = x0 + (k2 + 0.5) * gap * sc;
    if (gap * sc > 26) simTxt('第' + (k2 + 1) + '段', cx, y + 62, 10, '#90A4AE', '', 'center');
  }

  // 树
  var start = 0, end = seg;
  if (SIM.m === 1) start = 1;
  if (SIM.m === 2) { start = 1; end = seg - 1; }
  var r = Math.max(7, Math.min(13, gap * sc * 0.26));
  for (var t = start; t <= end; t++) {
    simTree(x0 + t * gap * sc, y - 22, r);
  }
  // 空着的端点
  if (SIM.m === 2) {
    simTxt('空', x0, y - 26, 11, '#B0BEC5', '', 'center');
    simTxt('空', x0 + seg * gap * sc, y - 26, 11, '#B0BEC5', '', 'center');
  }

  simTxt('路长 ' + L + ' 米', (x0 + x1) / 2, y + 88, 12, '#607D8B', '', 'center');

  // 底部结论
  simBox(24, 282, 832, 60, '#FFF8E1', '#FFE082', 10);
  simTxt('间隔数 = ' + L + ' ÷ ' + gap + ' = ' + seg + ' 段', 44, 310, 15, '#B26A00', '700');
  simTxt(SIM.m === 0 ? '两端都栽：' + seg + ' + 1 = ' + trees + ' 棵'
    : (SIM.m === 1 ? '只栽一端：就是 ' + trees + ' 棵，不用加减'
      : '两端都不栽：' + seg + ' − 1 = ' + trees + ' 棵'),
    360, 310, 15, '#01579B', '700');
  simTxt('一棵树管一段的起点', 44, 332, 12, '#B26A00');
  simTxt('多出来的那棵在末端', 360, 332, 12, '#4FC3F7');

  var ro = document.getElementById('simReadout');
  if (ro) ro.textContent = L + ' 米 · 每 ' + gap + ' 米一棵 · ' + SIM_MODES[SIM.m] + ' → ' + trees + ' 棵';
  var tip = document.getElementById('simTip');
  if (tip) {
    tip.textContent = seg + ' 段间隔，' + SIM_MODES[SIM.m] + ' = ' +
      (SIM.m === 0 ? seg + ' + 1' : (SIM.m === 1 ? seg : seg + ' − 1'));
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

function simGapNext() {
  SIM.g = (SIM.g + 1) % SIM_GAPS.length;
  simDraw();
  simLog('间隔改成 ' + simGap() + ' 米：' + simL() + ' ÷ ' + simGap() + ' = ' + simSeg() + ' 段', true);
}

function simModeNext() {
  SIM.m = (SIM.m + 1) % SIM_MODES.length;
  simDraw();
  simLog('栽法改成「' + SIM_MODES[SIM.m] + '」：' + simTrees() + ' 棵', true);
}

function simRoadNext() {
  SIM.i = (SIM.i + 1) % SIM_ROADS.length;
  simDraw();
  simLog('换条路：' + simL() + ' 米，每 ' + simGap() + ' 米一棵');
}

function simReset() {
  SIM.i = 0; SIM.g = 2; SIM.m = 0;
  simDraw();
  simLog('重来：20 米、每 5 米、两端都栽', true);
}

var SIM_TIMER = null;
function simDemo() {
  if (SIM_TIMER) { clearInterval(SIM_TIMER); SIM_TIMER = null; }
  SIM.i = 0; SIM.g = 2; SIM.m = 0;
  simDraw();
  simLog('自动演示：先算间隔数，再看两端');
  var step = 0;
  SIM_TIMER = setInterval(function () {
    step++;
    if (step === 1) { simLog('20 ÷ 5 = 4 段'); }
    else if (step === 2) { simLog('两端都栽：4 + 1 = 5 棵', true); }
    else if (step === 3) { SIM.m = 2; simDraw(); simLog('两端都不栽：4 − 1 = 3 棵', true); }
    else { clearInterval(SIM_TIMER); SIM_TIMER = null; }
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
    if (y < 132 || y > 196) return;
    if (x > 560) { simModeNext(); return; }
    simGapNext();
  });
}

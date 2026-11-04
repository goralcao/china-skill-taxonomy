// ===== 仿真：用 0.9 米的一段去量 7.2 米，看有几个 0.9 =====
var SIM_W = 880, SIM_H = 360;
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';

// a = 被除数，b = 除数（都以米为单位，格 = 0.1 米）
var SIM_CASES = [
  { a: 7.2, b: 0.9 },
  { a: 4.5, b: 0.9 },
  { a: 3.6, b: 1.2 },
  { a: 2.4, b: 0.6 },
  { a: 5.4, b: 0.6 },
  { a: 1.5, b: 0.5 }
];

// cur = 已经量了几小格（一格 0.1 米）
var SIM = { i: 0, cur: 0 };

function simCellsA() { return Math.round(SIM_CASES[SIM.i].a * 10); }
function simCellsB() { return Math.round(SIM_CASES[SIM.i].b * 10); }
function simCount() { return Math.round(SIM.cur / simCellsB()); }
function simQuot() { return simCellsA() / simCellsB(); }

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
  ctx.strokeStyle = color; ctx.lineWidth = w || 1.4; ctx.lineCap = 'round';
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.restore();
}

function simBox(x, y, w, h, fill, stroke, r) {
  var ctx = simCtx();
  r = (r === undefined) ? 6 : r;
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

function simGeom() {
  var cells = simCellsA();
  var cw = Math.min(26, 540 / cells);
  return { cells: cells, cw: cw, x0: 84, w: cells * cw };
}

function simDraw() {
  var ctx = simCtx();
  var c = SIM_CASES[SIM.i], g = simGeom(), cb = simCellsB();
  ctx.clearRect(0, 0, SIM_W, SIM_H);

  // 算式
  simBox(24, 14, 832, 46, '#F5FAF9', '#B2DFDB', 10);
  simTxt('整条彩带', 44, 43, 13, '#00897B');
  simTxt(c.a + ' 米', 118, 45, 21, '#00695C', '700');
  simTxt('每段', 210, 43, 13, '#00897B');
  simTxt(c.b + ' 米', 258, 45, 21, '#E64A19', '700');
  simTxt('= 几段？', 350, 43, 14, '#455A64');
  simTxt('每 10 小格 = 1 米，一格 0.1 米', 836, 43, 12, '#8CB3A8', '', 'end');

  // 彩带
  var y = 86, h = 34;
  simBox(g.x0 - 6, y - 6, g.w + 12, h + 12, '#FFFFFF', '#B2DFDB', 8);
  simBox(g.x0, y, g.w, h, '#E0F2F1', null, 0);
  for (var i = 0; i < g.cells; i++) {
    var x = g.x0 + i * g.cw;
    if (i % 10 === 0 && i > 0) {
      simLine(x, y, x, y + h, '#4DB6AC', 1.8);
      simTxt(String(i / 10), x, y - 12, 11, '#00897B', '', 'center');
    } else {
      simLine(x, y, x, y + h, '#C8E6E2', 0.7);
    }
  }
  simBox(g.x0, y, g.w, h, null, '#4DB6AC', 0);
  simTxt('0', g.x0, y - 12, 11, '#00897B', '', 'center');

  // 已量的部分
  if (SIM.cur > 0) {
    simBox(g.x0, y, SIM.cur * g.cw, h, 'rgba(0,137,123,.18)', null, 0);
    simLine(g.x0 + SIM.cur * g.cw, y, g.x0 + SIM.cur * g.cw, y + h, '#00695C', 2);
  }

  // 下面的分段
  var sy = 150, sh = 30;
  var n = simCount();
  var palette = ['#FF7043', '#FF8A65'];
  if (n > 0) {
    for (var k = 0; k < n; k++) {
      var sx = g.x0 + k * cb * g.cw;
      var sw = cb * g.cw;
      simBox(sx + 1, sy, sw - 2, sh, palette[k % 2], k % 2 ? '#E64A19' : '#F4511E', 3);
      if (sw > 22) {
        simTxt(String(k + 1), sx + sw / 2, sy + sh / 2 + 6, Math.min(16, sw / 2), '#FFFFFF', '700', 'center');
      }
    }
    simLine(g.x0, sy + sh + 6, g.x0 + n * cb * g.cw, sy + sh + 6, '#E64A19', 2);
    simTxt('已量 ' + n + ' 段 = ' + (n * SIM_CASES[SIM.i].b).toFixed(1) + ' 米',
           g.x0 + n * cb * g.cw / 2, sy + sh + 24, 12, '#E64A19', '', 'center');
  } else {
    simTxt('还没开始量', g.x0, sy + 20, 13, '#B0BEC5');
  }

  // 右侧结论
  var rx = 652, ry = 150;
  simBox(rx, ry, 216, 96, '#FFF3E0', '#FFB74D', 10);
  simTxt('已量段数', rx + 18, ry + 26, 12, '#E64A19');
  simTxt(n + ' 段', rx + 18, ry + 60, 26, '#BF360C', '700');
  simTxt('还剩 ' + Math.max(0, SIM_CASES[SIM.i].a - n * SIM_CASES[SIM.i].b).toFixed(1) + ' 米',
         rx + 132, ry + 58, 14, '#BF360C');
  simTxt('正好量完时，段数就是商', rx + 18, ry + 84, 11, '#A1887F');

  // 底部等式
  simTxt(g.cells + ' 个 0.1 ÷ ' + cb + ' 个 0.1 = ' + g.cells + ' ÷ ' + cb + ' = ' + simQuot(),
         440, 296, 17, '#455A64', '700', 'center');
  simTxt('两个数都换成 0.1 的个数，除法就回到了整数', 440, 318, 12, '#8CB3A8', '', 'center');

  var ro = document.getElementById('simReadout');
  if (ro) ro.textContent = c.a + ' 米 · 已量 ' + n + ' 段';
  var tip = document.getElementById('simTip');
  if (tip) {
    var left = SIM_CASES[SIM.i].a - n * SIM_CASES[SIM.i].b;
    tip.textContent = n === 0 ? ('每一段 ' + c.b + ' 米，量到刚好接满为止')
      : (left > 0.001 ? ('还剩 ' + left.toFixed(1) + ' 米，再量 ' + Math.round(left / c.b) + ' 段')
        : ('正好接满：' + c.a + ' 里有 ' + n + ' 个 ' + c.b + '，商是 ' + n));
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

function simStep() {
  var cb = simCellsB(), ca = simCellsA();
  if (SIM.cur + cb > ca) { simLog('接不下了，剩下的不到一段：' + (ca - SIM.cur) + ' 小格'); return; }
  SIM.cur += cb;
  simDraw();
  var n = simCount();
  if (n === simQuot()) simLog('正好接满：' + SIM_CASES[SIM.i].a + ' ÷ ' + SIM_CASES[SIM.i].b + ' = ' + n, true);
  else simLog('接上第 ' + n + ' 段，共 ' + (n * SIM_CASES[SIM.i].b).toFixed(1) + ' 米');
}

function simBack() {
  var cb = simCellsB();
  if (SIM.cur <= 0) { simLog('还没量，退不了'); return; }
  SIM.cur -= cb;
  simDraw();
  simLog('退一段，剩 ' + simCount() + ' 段');
}

function simAll() {
  SIM.cur = simCellsA();
  simDraw();
  simLog('一次量完：' + simCellsA() + ' ÷ ' + simCellsB() + ' = ' + simQuot(), true);
}

function simCase() {
  SIM.i = (SIM.i + 1) % SIM_CASES.length;
  SIM.cur = 0;
  simDraw();
  simLog('换一题：' + SIM_CASES[SIM.i].a + ' 米，每段 ' + SIM_CASES[SIM.i].b + ' 米');
}

function simReset() {
  SIM.cur = 0;
  simDraw();
  simLog('重来：' + SIM_CASES[SIM.i].a + ' ÷ ' + SIM_CASES[SIM.i].b, true);
}

var SIM_TIMER = null;
function simDemo() {
  if (SIM_TIMER) { clearInterval(SIM_TIMER); SIM_TIMER = null; }
  SIM.cur = 0;
  simDraw();
  simLog('自动演示：一段一段接上去');
  SIM_TIMER = setInterval(function () {
    var cb = simCellsB();
    if (SIM.cur + cb > simCellsA()) {
      clearInterval(SIM_TIMER); SIM_TIMER = null;
      simLog('停：一共 ' + simCount() + ' 段，商是 ' + simQuot(), true);
      return;
    }
    SIM.cur += cb;
    simDraw();
  }, 520);
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
    if (y < 80 || y > 132) return;
    if (x < g.x0 || x > g.x0 + g.w) return;
    var cell = Math.round((x - g.x0) / g.cw);
    var cb = simCellsB();
    SIM.cur = Math.min(simCellsA(), Math.round(cell / cb) * cb);
    simDraw();
    simLog('拖到 ' + (SIM.cur / 10).toFixed(1) + ' 米处，已量 ' + simCount() + ' 段');
  });
}

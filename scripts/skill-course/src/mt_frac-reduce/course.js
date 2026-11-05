// ===== 仿真：一刀一刀约下去，看分数怎么变小 =====
var SIM_W = 880, SIM_H = 360;
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';

var SIM_CASES = [[18, 24], [12, 18], [16, 24], [24, 36], [30, 42]];
var SIM = { ci: 0, num: 18, den: 24, n0: 18, d0: 24, times: 0 };

var BAR_X = 60, BAR_Y = 96, BAR_W = 760, BAR_H = 52;

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

function simFrac(cx, cy, a, b, size, color, w) {
  var ctx = simCtx();
  ctx.save();
  ctx.font = '700 ' + size + 'px ' + SIM_FONT;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(String(a), cx, cy - 9);
  ctx.fillText(String(b), cx, cy + size * 0.82);
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.6, cy);
  ctx.lineTo(cx + size * 0.6, cy);
  ctx.strokeStyle = color;
  ctx.lineWidth = w || 3;
  ctx.stroke();
  ctx.restore();
}

function simGcdOf(a, b) { return b === 0 ? a : simGcdOf(b, a % b); }

// ---- 绘制 ----
function simDraw() {
  var ctx = simCtx();
  if (!ctx) return;

  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.save();
  ctx.fillStyle = '#F7FDFD';
  ctx.fillRect(0, 0, SIM_W, SIM_H);
  ctx.restore();

  simTxt('原来 ' + SIM.n0 + '/' + SIM.d0, 40, 46, 15, '#8D6E63', '700');
  simTxt(SIM.times === 0 ? '还没约过' : ('已同时除了 ' + SIM.times + ' 次'),
    840, 46, 12.5, '#A1887F', '', 'right');

  // 长条
  var den = SIM.den, num = SIM.num;
  var w = BAR_W / den;
  for (var i = 0; i < den; i++) {
    var x = BAR_X + i * w;
    var on = i < num;
    simBox(x + 0.5, BAR_Y, Math.max(1, w - 1), BAR_H, on ? '#FFB74D' : '#E0F7FA', null, 3);
  }
  simBox(BAR_X, BAR_Y, BAR_W, BAR_H, null, '#00838F', 4);

  // 分界线
  if (w >= 6) {
    for (var k = 1; k < den; k++) {
      simLine(BAR_X + k * w, BAR_Y + 1, BAR_X + k * w, BAR_Y + BAR_H - 1,
        'rgba(255,255,255,.85)', 1.2);
    }
  }

  // 两端刻度
  simTxt('0', BAR_X, BAR_Y + BAR_H + 20, 11, '#A1887F', '', 'center');
  simTxt('1', BAR_X + BAR_W, BAR_Y + BAR_H + 20, 11, '#A1887F', '', 'center');
  simTxt('整条是单位「1」', BAR_X + BAR_W / 2, BAR_Y + BAR_H + 20, 11, '#A1887F', '', 'center');

  // 涂色长度标记
  simLine(BAR_X + num * w, 80, BAR_X + num * w, BAR_Y + BAR_H + 30, '#E65100', 1.4, [5, 4]);

  // 分数
  simFrac(440, 232, num, den, 46, SIM.times === 0 ? '#00838F' : '#00695C');
  simTxt(num + ' 格 / 共 ' + den + ' 格', 440, 296, 12.5, '#8D6E63', '', 'center');

  // 状态
  var g = simGcdOf(num, den);
  if (g === 1 && SIM.times > 0) {
    simTxt('已经是最简分数了，再除就切不整齐', 440, 322, 13, '#2E7D32', '700', 'center');
  } else if (SIM.times === 0) {
    simTxt('分子分母同除一个数，条子的长度不会变', 440, 322, 13, '#8D6E63', '', 'center');
  } else {
    simTxt('还能同时除以 ' + g + '，继续约', 440, 322, 13, '#E65100', '700', 'center');
  }

  simRefresh();
}

// ---- 交互 ----
function simRefresh() {
  var ro = document.getElementById('simReadout');
  if (ro) ro.textContent = SIM.num + '/' + SIM.den;
  var tp = document.getElementById('simTip');
  if (tp) {
    var g = simGcdOf(SIM.num, SIM.den);
    if (g === 1) tp.textContent = SIM.times === 0 ? '本来就已经最简' : '已经最简，换个分数试试';
    else tp.textContent = '还能同时除以 ' + g;
  }
}

function simLog(msg) {
  var box = document.getElementById('simLog');
  if (!box) return;
  var d = document.createElement('div');
  d.className = 'sim-log-line';
  d.innerHTML = msg;
  box.appendChild(d);
  if (box.children.length > 3) box.removeChild(box.firstChild);
  box.scrollTop = box.scrollHeight;
}

function simDiv(g) {
  if (SIM.num % g !== 0 || SIM.den % g !== 0) {
    simLog('<span class="hl">' + SIM.num + ' 和 ' + SIM.den + ' 不能同时除以 ' + g +
      '</span>：' + (SIM.num % g !== 0 ? SIM.num : SIM.den) + ' 除不尽，格子会切歪');
    return;
  }
  var a = SIM.num, b = SIM.den;
  SIM.num = a / g;
  SIM.den = b / g;
  SIM.times++;
  simDraw();
  simLog('<span class="hl">' + a + ' ÷ ' + g + ' = ' + SIM.num + '</span>，' +
    b + ' ÷ ' + g + ' = ' + SIM.den + ' → ' + SIM.num + '/' + SIM.den +
    '，条子长度一点没变');
}

function simGcd() {
  var g = simGcdOf(SIM.num, SIM.den);
  if (g === 1) {
    simLog('分子分母已经互质，除不动了');
    return;
  }
  var a = SIM.num, b = SIM.den;
  SIM.num = a / g;
  SIM.den = b / g;
  SIM.times++;
  simDraw();
  simLog('一次除以最大公因数 <span class="hl">' + g + '</span>：' +
    a + '/' + b + ' → ' + SIM.num + '/' + SIM.den);
}

function simNextCase() {
  SIM.ci = (SIM.ci + 1) % SIM_CASES.length;
  SIM.n0 = SIM_CASES[SIM.ci][0];
  SIM.d0 = SIM_CASES[SIM.ci][1];
  SIM.num = SIM.n0;
  SIM.den = SIM.d0;
  SIM.times = 0;
  simDraw();
  simLog('换个分数：<span class="hl">' + SIM.n0 + '/' + SIM.d0 + '</span>');
}

function simReset() {
  SIM.num = SIM.n0;
  SIM.den = SIM.d0;
  SIM.times = 0;
  simDraw();
  simLog('还原成 ' + SIM.n0 + '/' + SIM.d0);
}

function simCase() { return SIM.n0 + '/' + SIM.d0; }

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function (e) {
    var r = cv.getBoundingClientRect();
    var y = (e.clientY - r.top) * (SIM_H / r.height);
    if (y > 190) { simGcd(); return; }
    simDiv(2);
  });
}

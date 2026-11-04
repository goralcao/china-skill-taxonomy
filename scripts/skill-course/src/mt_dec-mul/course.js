// ===== 仿真：把整数积的小数点挪回正确位置 =====
var SIM_W = 880, SIM_H = 360;
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';

// da / db = 两个因数各有几位小数；prod = 当整数乘出来的积
var SIM_CASES = [
  { a: '0.8', b: '25', ia: 8, ib: 25, prod: 200, da: 1, db: 0 },
  { a: '2.5', b: '4', ia: 25, ib: 4, prod: 100, da: 1, db: 0 },
  { a: '1.2', b: '5', ia: 12, ib: 5, prod: 60, da: 1, db: 0 },
  { a: '0.15', b: '4', ia: 15, ib: 4, prod: 60, da: 2, db: 0 },
  { a: '2.5', b: '3.5', ia: 25, ib: 35, prod: 875, da: 1, db: 1 },
  { a: '0.2', b: '0.3', ia: 2, ib: 3, prod: 6, da: 1, db: 1 }
];

// i = 案例序号；k = 小数点从右边数第几位
var SIM = { i: 0, k: 0 };

var SIM_CW = 52, SIM_CY = 196, SIM_CX = 440;

function simCur() { return SIM_CASES[SIM.i]; }
function simTarget() { return simCur().da + simCur().db; }

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

function simPanel(x, y, w, h, fill, stroke, r) {
  var ctx = simCtx();
  r = (r === undefined) ? 9 : r;
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

// 补足位数后的数字串：0.2 × 0.3 的 6 要变成 "06" 才够点两位
function simDigits() {
  var c = simCur(), s = String(c.prod);
  while (s.length <= SIM.k) s = '0' + s;
  return s;
}

function simText() {
  var s = simDigits(), k = SIM.k;
  if (k === 0) return s;
  return s.slice(0, s.length - k) + '.' + s.slice(s.length - k);
}

function simTrim() {
  var s = simText();
  if (s.indexOf('.') < 0) return s;
  s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s;
}

function simSeamX(idx, len) {
  return SIM_CX - len * SIM_CW / 2 + idx * SIM_CW;
}

function simDraw() {
  var ctx = simCtx();
  var c = simCur(), len = simDigits().length, s = simDigits();
  var target = simTarget();
  ctx.clearRect(0, 0, SIM_W, SIM_H);

  // —— 上：整数那一步 ——
  simPanel(24, 18, 832, 56, '#F4FAFD', '#CFE3EC', 10);
  simTxt('当整数算', 42, 53, 14, '#6B8A99', '700');
  simTxt(c.ia + ' × ' + c.ib + ' = ' + c.prod, 132, 56, 24, '#0D2B3E', '700');
  simTxt('（原来的算式：' + c.a + ' × ' + c.b + '）', 560, 53, 15, '#0277BD', '700');

  // —— 中：数字串 ——
  simTxt('从右边起，把小数点放在正确的位置', 440, 104, 14, '#8FA6B2', '', 'center');

  for (var i = 0; i < len; i++) {
    var cx = SIM_CX - len * SIM_CW / 2 + i * SIM_CW + SIM_CW / 2;
    simTxt(s.charAt(i), cx, SIM_CY, 56, '#0D2B3E', '700', 'center');
    // 数字之间的缝
    if (i < len - 1) {
      var sx = simSeamX(i + 1, len);
      simLine(sx, SIM_CY - 34, sx, SIM_CY + 14, '#DCEBF2', 1.6, [5, 5]);
    }
  }

  // 数字串基线
  simLine(SIM_CX - len * SIM_CW / 2, SIM_CY + 18, SIM_CX + len * SIM_CW / 2, SIM_CY + 18, '#90A4AE', 2.2);

  // —— 小数点 ——
  var seamIdx = len - SIM.k;
  var px = simSeamX(seamIdx, len);
  var ok = (SIM.k === target);
  var pcolor = ok ? '#2E7D32' : '#C62828';

  ctx.save();
  ctx.beginPath();
  ctx.arc(px, SIM_CY - 8, 6.5, 0, Math.PI * 2);
  ctx.fillStyle = pcolor;
  ctx.fill();
  ctx.restore();

  // —— 下：三块读数 ——
  var by = 246, bh = 74, bw = 256;

  simPanel(24, by, bw, bh, '#FFFFFF', '#CFE3EC', 10);
  simTxt('小数点位置', 44, by + 26, 13, '#8FA6B2');
  simTxt('从右数第 ' + SIM.k + ' 位', 44, by + 58, 21, '#0D2B3E', '700');

  simPanel(312, by, bw, bh, ok ? '#E8F5E9' : '#FFFFFF', ok ? '#81C784' : '#CFE3EC', 10);
  simTxt('现在的积', 332, by + 26, 13, ok ? '#2E7D32' : '#8FA6B2');
  simTxt(simText() + (simTrim() !== simText() ? ' = ' + simTrim() : ''), 332, by + 58, 21,
         ok ? '#2E7D32' : '#0D2B3E', '700');

  simPanel(600, by, bw, bh, '#FFF8E1', '#FFE082', 10);
  simTxt('该点几位', 620, by + 26, 13, '#B26A00');
  var hint = ok ? '对上了 ✓' : (SIM.k < target ? '还差 ' + (target - SIM.k) + ' 位' : '多了 ' + (SIM.k - target) + ' 位');
  simTxt('要 ' + target + ' 位', 620, by + 50, 21, ok ? '#2E7D32' : '#B26A00', '700');
  simTxt(hint, 620, by + 65, 13, ok ? '#2E7D32' : '#B26A00');

  // —— 状态栏 ——
  var ro = document.getElementById('simReadout');
  if (ro) ro.textContent = c.a + ' × ' + c.b + ' · 小数点在第 ' + SIM.k + ' 位';
  var tip = document.getElementById('simTip');
  if (tip) {
    tip.textContent = ok ? ('积就是 ' + simTrim() + '，对上了') :
      (SIM.k < target ? ('还差 ' + (target - SIM.k) + ' 位，继续往左挪') : ('挪过头了，往右退 ' + (SIM.k - target) + ' 位'));
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

function simLeft() {
  if (SIM.k >= 4) { simLog('已经挪到最左边了，再挪就是 0.0…'); return; }
  SIM.k++;
  simDraw();
  var t = simTarget();
  if (SIM.k === t) simLog('就是这里：' + simCur().a + ' × ' + simCur().b + ' = ' + simTrim(), true);
  else simLog('往左挪一位 → ' + simText());
}

function simRight() {
  if (SIM.k <= 0) { simLog('已经在最右边，就是整数积本身'); return; }
  SIM.k--;
  simDraw();
  simLog('往右挪一位 → ' + simText());
}

function simBack() {
  SIM.k = 0;
  simDraw();
  simLog('归位：回到整数积 ' + simDigits());
}

function simCase() {
  SIM.i = (SIM.i + 1) % SIM_CASES.length;
  SIM.k = 0;
  simDraw();
  var c = simCur();
  simLog('换一题：' + c.a + ' × ' + c.b + '，整数积 ' + c.prod);
}

function simReset() {
  SIM.k = 0;
  simDraw();
  simLog('重来：' + simCur().a + ' × ' + simCur().b, true);
}

var SIM_TIMER = null;
function simDemo() {
  if (SIM_TIMER) { clearInterval(SIM_TIMER); SIM_TIMER = null; }
  SIM.k = 0;
  simDraw();
  simLog('自动演示：从整数积往左数位数');
  var t = simTarget();
  SIM_TIMER = setInterval(function () {
    if (SIM.k >= t) {
      clearInterval(SIM_TIMER); SIM_TIMER = null;
      simLog('停：' + simCur().a + ' × ' + simCur().b + ' = ' + simTrim(), true);
      return;
    }
    SIM.k++;
    simDraw();
  }, 700);
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
    if (y < 92 || y > 236) return;
    var len = simDigits().length, best = -1, bd = 999;
    for (var i = 0; i <= len; i++) {
      var sx = simSeamX(i, len);
      var d = Math.abs(x - sx);
      if (d < bd) { bd = d; best = i; }
    }
    if (bd > 34) return;
    SIM.k = len - best;
    simDraw();
    var t = simTarget();
    if (SIM.k === t) simLog('手指点对了：' + simCur().a + ' × ' + simCur().b + ' = ' + simTrim(), true);
    else simLog('点到了第 ' + SIM.k + ' 位 → ' + simText());
  });
}

// ===== 仿真：小数点对齐竖式，从最低位一列一列算 =====
var SIM_W = 880, SIM_H = 360;
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';
var SIM_MONO = '"Consolas","Courier New",monospace';

// 四个数位槽：十位 / 个位 / 十分位 / 百分位；小数点在个位与十分位之间
var SIM_COLX = [90, 150, 228, 288];
var SIM_DOTX = 189;
var SIM_ROW1 = 118, SIM_ROW2 = 166, SIM_LINE = 190, SIM_ROW3 = 232;
var SIM_SHIFT = 66;
var SIM_PX = 430;

// 四道题：统一补 0 到四位，steps 从最低位（百分位）往左走
var SIM_CASES = [
  {
    name: '文具小票 · 加法补 0', expr: '6.80 + 2.45', op: '+', result: '9.25',
    a: ['', '6', '8', '0'], b: ['', '2', '4', '5'], r: ['', '9', '2', '5'],
    wrong: '6.80 的百分位 0 撞上 2.45 的十分位 4，0.1 和 0.01 混在一列',
    steps: [
      { col: 3, t: '百分位：0 + 5 = 5', note: '6.8 补 0 才有这一列' },
      { col: 2, t: '十分位：8 + 4 = 12，写 2 进 1', note: '进位的 1 记在个位上' },
      { col: 1, t: '个位：6 + 2 + 1 = 9', note: '别漏掉进位' }
    ]
  },
  {
    name: '找零 · 连续退位', expr: '8.00 − 2.35', op: '−', result: '5.65',
    a: ['', '8', '0', '0'], b: ['', '2', '3', '5'], r: ['', '5', '6', '5'],
    wrong: '8.00 的百分位 0 撞上 2.35 的十分位 3，退位根本没法走',
    steps: [
      { col: 3, t: '百分位：10 − 5 = 5', note: '十分位是 0，得先向个位借' },
      { col: 2, t: '十分位：9 − 3 = 6', note: '借成 10 又借出 1，自己剩 9' },
      { col: 1, t: '个位：7 − 2 = 5', note: '8 借出 1 变 7' }
    ]
  },
  {
    name: '两段绳子 · 加法进位', expr: '12.40 + 5.86', op: '+', result: '18.26',
    a: ['1', '2', '4', '0'], b: ['', '5', '8', '6'], r: ['1', '8', '2', '6'],
    wrong: '12.40 的百分位 0 撞上 5.86 的十分位 8，进位会进错列',
    steps: [
      { col: 3, t: '百分位：0 + 6 = 6', note: '先补 0 再算' },
      { col: 2, t: '十分位：4 + 8 = 12，写 2 进 1', note: '' },
      { col: 1, t: '个位：2 + 5 + 1 = 8', note: '' },
      { col: 0, t: '十位：1 + 0 = 1', note: '' }
    ]
  },
  {
    name: '整数减小数 · 补 0 退位', expr: '10.00 − 3.70', op: '−', result: '6.30',
    a: ['1', '0', '0', '0'], b: ['', '3', '7', '0'], r: ['', '6', '3', '0'],
    wrong: '10.00 的百分位 0 撞上 3.70 的十分位 7，借位找不到路',
    steps: [
      { col: 3, t: '百分位：0 − 0 = 0', note: '补 0 后这一列不用借' },
      { col: 2, t: '十分位：10 − 7 = 3', note: '个位是 0，先向十位借' },
      { col: 1, t: '个位：9 − 3 = 6', note: '借成 10 又借出 1，剩 9' },
      { col: 0, t: '十位：0 − 0 = 0', note: '末尾的 0 可去掉，写成 6.3' }
    ]
  }
];

// mode: 0 = 末尾对齐（错），1 = 小数点对齐（对）
var SIM = { i: 0, mode: 0, step: 0, hot: [] };

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

function simNum(t, x, y, size, color) {
  var ctx = simCtx();
  ctx.save();
  ctx.font = 'bold ' + size + 'px ' + SIM_MONO;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(t, x, y);
  ctx.restore();
}

function simLine(x1, y1, x2, y2, color, w, dash) {
  var ctx = simCtx();
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = w || 2;
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.restore();
}

function simPanel(x, y, w, h, fill, stroke, r) {
  var ctx = simCtx();
  r = r || 8;
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

function simDot(x, y) {
  var ctx = simCtx();
  ctx.save();
  ctx.fillStyle = '#FF8F00';
  ctx.beginPath(); ctx.arc(x, y, 4.8, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function simCur() { return SIM_CASES[SIM.i]; }

// 画一行数字，shift 是整体右移量（末尾对齐时第二行错开）
function simRow(arr, y, shift, color, op) {
  for (var i = 0; i < 4; i++) {
    if (arr[i] === '') continue;
    simNum(arr[i], SIM_COLX[i] + shift, y, 30, color);
  }
  if (op) simNum(op, 40, y, 28, '#0D47A1');
  simDot(SIM_DOTX + shift, y - 10);
  SIM.hot.push({
    x: SIM_DOTX + shift - 16, y: y - 32, w: 32, h: 34,
    fn: function () { simMode(); }
  });
}

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);
  SIM.hot = [];
  var c = simCur();

  simTxt('① 把两行数字排进数位表', 40, 30, 14, '#0D47A1', 'bold ');

  // 四个数位列的底色与表头
  var heads = ['十位', '个位', '十分位', '百分位'];
  for (var i = 0; i < 4; i++) {
    simPanel(SIM_COLX[i] - 30, 72, 60, 174, i >= 2 ? '#F3F8FF' : '#FFFFFF', '#E3F2FD', 6);
    simTxt(heads[i], SIM_COLX[i], 64, 12.5, '#1976D2', 'bold ', 'center');
  }
  if (SIM.mode === 0) {
    simPanel(324, 72, 60, 174, '#FFEBEE', '#FFCDD2', 6);
    simTxt('多 1 列', 354, 64, 11.5, '#C62828', 'bold ', 'center');
  }

  // 小数点参考线
  if (SIM.mode === 1) {
    simLine(SIM_DOTX, 76, SIM_DOTX, 246, '#00838F', 1.8, [5, 4]);
  } else {
    simLine(SIM_DOTX, 76, SIM_DOTX, 246, '#C62828', 1.6, [5, 4]);
    simLine(SIM_DOTX + SIM_SHIFT, 76, SIM_DOTX + SIM_SHIFT, 246, '#C62828', 1.6, [5, 4]);
  }

  // 两行数字
  simRow(c.a, SIM_ROW1, 0, '#0D47A1', '');
  simRow(c.b, SIM_ROW2, SIM.mode === 0 ? SIM_SHIFT : 0,
    SIM.mode === 0 ? '#C62828' : '#1565C0', c.op);

  // 横线与结果行
  simLine(48, SIM_LINE, 392, SIM_LINE, '#90A4AE', 1.8);
  if (SIM.mode === 1) {
    for (var k = 0; k < SIM.step && k < c.steps.length; k++) {
      var col = c.steps[k].col;
      if (k === SIM.step - 1) simPanel(SIM_COLX[col] - 30, SIM_ROW3 - 34, 60, 42, '#FFF3E0', '#FF8F00', 6);
      simNum(c.r[col], SIM_COLX[col], SIM_ROW3, 30, '#2E7D32');
    }
    if (SIM.step > 0) simDot(SIM_DOTX, SIM_ROW3 - 10);
  } else {
    simTxt('数位没对上，先别动笔', 210, SIM_ROW3 - 6, 15, '#C62828', 'bold ', 'center');
  }

  simTxt(SIM.mode ? '✓ 三点一线，可以动笔了' : '✗ 两个小数点错开 1 位',
    40, 282, 14, SIM.mode ? '#2E7D32' : '#C62828', 'bold ');
  simTxt('当前题目：' + c.name, 40, 310, 13, '#607D8B');
  simTxt(c.expr + ' = ?', 40, 336, 15, '#0D47A1', 'bold ');

  // ===== 右区：模式开关 + 逐列计算 =====
  simTxt('② 一列一列算', SIM_PX, 30, 14, '#0D47A1', 'bold ');

  simPanel(SIM_PX, 44, 130, 36,
    SIM.mode === 0 ? '#C62828' : '#FFFFFF', SIM.mode === 0 ? '#C62828' : '#BBDEFB', 8);
  simTxt('末尾对齐', SIM_PX + 65, 68, 14, SIM.mode === 0 ? '#FFFFFF' : '#607D8B', 'bold ', 'center');
  SIM.hot.push({ x: SIM_PX, y: 44, w: 130, h: 36, fn: function () { simMode(0); } });

  simPanel(SIM_PX + 142, 44, 148, 36,
    SIM.mode === 1 ? '#0D47A1' : '#FFFFFF', SIM.mode === 1 ? '#0D47A1' : '#BBDEFB', 8);
  simTxt('小数点对齐', SIM_PX + 216, 68, 14, SIM.mode === 1 ? '#FFFFFF' : '#607D8B', 'bold ', 'center');
  SIM.hot.push({ x: SIM_PX + 142, y: 44, w: 148, h: 36, fn: function () { simMode(1); } });

  if (SIM.mode === 0) {
    simPanel(SIM_PX, 96, 420, 104, '#FFF5F5', '#FFCDD2', 10);
    simTxt('✗ 先别算：两行小数点没排齐', SIM_PX + 18, 124, 16, '#C62828', 'bold ');
    simTxt(c.wrong, SIM_PX + 18, 152, 12.5, '#AD1457');
    simTxt('同一列必须是同一数位，0.1 不能和 0.01 相加。', SIM_PX + 18, 178, 12.5, '#6A1B9A');
    simTxt('改成「小数点对齐」，或点画布上的橙色圆点', SIM_PX, 226, 13, '#1976D2');
    simTxt('整数竖式末尾对齐，是因为个位永远在最右；', SIM_PX, 252, 12.5, '#607D8B');
    simTxt('小数最右一位可能是十分位，也可能是百分位。', SIM_PX, 276, 12.5, '#607D8B');
  } else {
    for (var k2 = 0; k2 < c.steps.length; k2++) {
      var y0 = 96 + k2 * 44;
      var done = k2 < SIM.step;
      var cur = k2 === SIM.step;
      var bg = done ? '#E8F5E9' : (cur ? '#FFF3E0' : '#F7FAFF');
      var st = done ? '#A5D6A7' : (cur ? '#FF8F00' : '#E3F2FD');
      simPanel(SIM_PX, y0, 420, 38, bg, st, 8);
      var mark = done ? '✓' : (cur ? '→' : String(k2 + 1));
      simTxt(mark, SIM_PX + 16, y0 + 25, 15,
        done ? '#2E7D32' : (cur ? '#E65100' : '#90A4AE'), 'bold ');
      simTxt(c.steps[k2].t, SIM_PX + 40, y0 + 25, 14,
        done ? '#2E7D32' : (cur ? '#E65100' : '#607D8B'), cur ? 'bold ' : '');
      (function (n) {
        SIM.hot.push({ x: SIM_PX, y: y0, w: 420, h: 38, fn: function () { SIM.step = n; simDraw(); simRefresh(); } });
      })(k2 + 1);
    }
    var ry = 96 + c.steps.length * 44 + 8;
    simPanel(SIM_PX, ry, 420, 62, '#E8F5E9', '#66BB6A', 10);
    simTxt(SIM.step >= c.steps.length ? '= ' + c.result : '还差 ' + (c.steps.length - SIM.step) + ' 列',
      SIM_PX + 18, ry + 28, 22, '#2E7D32', 'bold ');
    simTxt(SIM.step >= c.steps.length ? '小数点从上面直直落下来' : '从最右边一列往左算',
      SIM_PX + 18, ry + 50, 12.5, '#607D8B');
  }

  simRefresh();
}

function simRefresh() {
  var c = simCur();
  var rd = document.getElementById('simReadout');
  var tp = document.getElementById('simTip');
  if (rd) {
    if (SIM.mode === 0) rd.textContent = '末尾对齐：小数点错开 1 位，先别急着算';
    else if (SIM.step >= c.steps.length) rd.textContent = '小数点对齐 · 得数 ' + c.result;
    else rd.textContent = '小数点对齐 · 已算 ' + SIM.step + '/' + c.steps.length + ' 列';
  }
  if (tp) tp.textContent = c.expr;
}

function simLog(msg, hl) {
  var box = document.getElementById('simLog');
  if (!box) return;
  var d = document.createElement('div');
  d.className = 'sim-log-line';
  if (hl) { var s = document.createElement('span'); s.className = 'hl'; s.textContent = msg; d.appendChild(s); }
  else d.textContent = msg;
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
}

function simMode(k) {
  if (k === undefined) k = 1 - SIM.mode;
  k = (k === 1) ? 1 : 0;
  if (SIM.mode === k) return;
  SIM.mode = k;
  SIM.step = 0;
  simDraw();
  simLog(k ? '小数点对齐了：个位、十分位、百分位各对各的，可以从最右一列算起'
           : '改成末尾对齐：两个小数点错开 1 位，先看看哪一列串了位', k === 1);
}

function simNext() {
  var c = simCur();
  if (SIM.mode === 0) {
    simMode(1);
    simLog('还没对齐就要动笔 —— 先把小数点排齐，再算', true);
  }
  if (SIM.step >= c.steps.length) {
    simLog('每一列都算完了，得数 ' + c.result + '，可以换一题', true);
    return;
  }
  var s = c.steps[SIM.step];
  SIM.step++;
  simDraw();
  simLog('第 ' + SIM.step + ' 列 · ' + s.t + (s.note ? '（' + s.note + '）' : ''));
  if (SIM.step === c.steps.length) simLog(SIM.step + ' 列走完，得数 ' + c.result, true);
}

function simPrev() {
  if (SIM.step > 0) { SIM.step--; simDraw(); simLog('放回一列，重新算'); }
  else if (SIM.mode === 1) { simMode(0); }
  else { simLog('已经回到最开始了'); }
}

function simCase(k) {
  if (k === undefined || isNaN(k)) k = (SIM.i + 1) % SIM_CASES.length;
  k = ((k % SIM_CASES.length) + SIM_CASES.length) % SIM_CASES.length;
  SIM.i = k; SIM.mode = 0; SIM.step = 0;
  simDraw();
  var c = simCur();
  simLog('换一题「' + c.name + '」：' + c.expr + '，先看看小数点齐不齐', true);
}

function simReset() {
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  SIM.mode = 0; SIM.step = 0;
  simDraw();
  simLog('重来：回到末尾对齐，一列都还没算');
}

function simDemo() {
  simReset();
  simMode(1);
  var c = simCur();
  var n = c.steps.length;
  var k = 0;
  var timer = setInterval(function () {
    if (SIM.i !== SIM_CASES.indexOf(c)) { clearInterval(timer); return; }
    if (k >= n) { clearInterval(timer); return; }
    SIM.step = k + 1;
    simDraw();
    simLog('第 ' + (k + 1) + ' 列 · ' + c.steps[k].t);
    if (k === n - 1) simLog('自动演示完成，得数 ' + c.result, true);
    k++;
  }, 700);
}

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function (e) {
    var rect = cv.getBoundingClientRect();
    var x = (e.clientX - rect.left) * SIM_W / rect.width;
    var y = (e.clientY - rect.top) * SIM_H / rect.height;
    for (var i = 0; i < SIM.hot.length; i++) {
      var h = SIM.hot[i];
      if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) { h.fn(); return; }
    }
  });
}

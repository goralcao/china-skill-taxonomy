// ===== 仿真：1 米长条 + 数位表，一格一格数小数 =====
var SIM_W = 880, SIM_H = 360;
var SIM_BAR_X = 110, SIM_BAR_Y = 96, SIM_BAR_W = 600, SIM_BAR_H = 70;
var SIM_VALS = [0.35, 0.70, 0.09, 0.50, 1.00];

var SIM = { i: 0 };

function simVal() {
  return SIM_VALS[SIM.i];
}

function simDigit(v, place) {
  var p = Math.pow(10, place);
  return Math.floor(v * p + 0.0001) % 10;
}

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  var FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';
  var v = simVal();
  var units = Math.round(v * 100);   // 多少个 0.01

  // 标题
  ctx.textAlign = 'left';
  ctx.font = 'bold 16px ' + FONT;
  ctx.fillStyle = '#6A1B9A';
  ctx.fillText('1 米长条：10 大格，每格再分 10 小格', SIM_BAR_X, 36);
  ctx.font = '13px ' + FONT;
  ctx.fillStyle = '#9575CD';
  ctx.fillText('每大格 0.1 米（1 分米），每小格 0.01 米（1 厘米）', SIM_BAR_X, 56);

  // 底条
  ctx.fillStyle = '#F6F0FA';
  ctx.fillRect(SIM_BAR_X, SIM_BAR_Y, SIM_BAR_W, SIM_BAR_H);
  // 点亮部分
  ctx.fillStyle = '#8E24AA';
  ctx.fillRect(SIM_BAR_X, SIM_BAR_Y, SIM_BAR_W * v, SIM_BAR_H);

  // 小格线（每 0.01 一格）
  ctx.strokeStyle = '#E4D8ED';
  ctx.lineWidth = 1;
  for (var i = 1; i < 100; i++) {
    if (i % 10 === 0) continue;
    ctx.beginPath();
    ctx.moveTo(SIM_BAR_X + i * 6, SIM_BAR_Y);
    ctx.lineTo(SIM_BAR_X + i * 6, SIM_BAR_Y + SIM_BAR_H);
    ctx.stroke();
  }
  // 大格线
  ctx.strokeStyle = '#B39DDB';
  ctx.lineWidth = 1.6;
  for (var j = 1; j < 10; j++) {
    ctx.beginPath();
    ctx.moveTo(SIM_BAR_X + j * 60, SIM_BAR_Y);
    ctx.lineTo(SIM_BAR_X + j * 60, SIM_BAR_Y + SIM_BAR_H);
    ctx.stroke();
  }
  // 外框
  ctx.strokeStyle = '#6A1B9A';
  ctx.lineWidth = 2;
  ctx.strokeRect(SIM_BAR_X, SIM_BAR_Y, SIM_BAR_W, SIM_BAR_H);

  // 两端刻度
  ctx.font = '12px ' + FONT;
  ctx.fillStyle = '#90A4AE';
  ctx.textAlign = 'left';
  ctx.fillText('0', SIM_BAR_X - 4, SIM_BAR_Y - 10);
  ctx.textAlign = 'right';
  ctx.fillText('1 米', SIM_BAR_X + SIM_BAR_W, SIM_BAR_Y - 10);

  // 条内数值
  if (units >= 20) {
    ctx.textAlign = 'center';
    ctx.font = 'bold 20px ' + FONT;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(v.toFixed(2), SIM_BAR_X + SIM_BAR_W * v / 2, SIM_BAR_Y + SIM_BAR_H / 2 + 7);
  }

  // 小格计数
  ctx.textAlign = 'left';
  ctx.font = '14px ' + FONT;
  ctx.fillStyle = '#6A1B9A';
  ctx.fillText('点亮 ' + units + ' 个小格', SIM_BAR_X, SIM_BAR_Y + SIM_BAR_H + 26);

  // ===== 数位表 =====
  var TX = 110, TY = 224, CW = 96, CWH = 44, DOTW = 40;
  var cols = [
    { name: '个位', unit: '1', digit: simDigit(v, 0) },
    { name: '十分位', unit: '0.1', digit: simDigit(v, 1) },
    { name: '百分位', unit: '0.01', digit: simDigit(v, 2) }
  ];
  ctx.font = 'bold 12px ' + FONT;
  ctx.fillStyle = '#7E57C2';
  ctx.textAlign = 'center';
  var x = TX;
  for (var k = 0; k < cols.length; k++) {
    ctx.fillStyle = '#7E57C2';
    ctx.font = 'bold 12px ' + FONT;
    ctx.fillText(cols[k].name, x + CW / 2, TY - 8);
    ctx.fillStyle = k === 0 ? '#F3E5F5' : '#FFECB3';
    ctx.strokeStyle = k === 0 ? '#B39DDB' : '#FFCA28';
    ctx.lineWidth = k === 0 ? 1.4 : 1.8;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, TY, CW, CWH, 7);
    else ctx.rect(x, TY, CW, CWH);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#4A148C';
    ctx.font = 'bold 22px ' + FONT;
    ctx.fillText(String(cols[k].digit), x + CW / 2, TY + 32);
    x += CW + DOTW;
    if (k === 0) x += 2;
  }

  // 小数点
  ctx.fillStyle = '#6A1B9A';
  ctx.beginPath();
  ctx.arc(TX + CW + DOTW / 2, TY + CWH, 4, 0, Math.PI * 2);
  ctx.fill();

  // 计数单位一行
  ctx.font = '12px ' + FONT;
  ctx.fillStyle = '#90A4AE';
  x = TX;
  for (var m = 0; m < cols.length; m++) {
    ctx.textAlign = 'center';
    ctx.fillText('单位 ' + cols[m].unit, x + CW / 2, TY + CWH + 18);
    x += CW + DOTW;
    if (m === 0) x += 2;
  }

  // ===== 右侧读数 =====
  var PX = 560;
  ctx.textAlign = 'left';
  ctx.font = '13px ' + FONT;
  ctx.fillStyle = '#9575CD';
  ctx.fillText('这个数怎么拆', PX, 204);

  ctx.font = 'bold 32px ' + FONT;
  ctx.fillStyle = '#4A148C';
  ctx.fillText(v.toFixed(2), PX, 246);

  ctx.font = '16px ' + FONT;
  ctx.fillStyle = '#6A1B9A';
  ctx.fillText('= ' + units + ' 个 0.01', PX, 278);

  ctx.font = '15px ' + FONT;
  ctx.fillStyle = '#E65100';
  ctx.fillText('= ' + simDigit(v, 1) + ' 个 0.1 + ' + simDigit(v, 2) + ' 个 0.01', PX, 306);

  ctx.font = 'bold 15px ' + FONT;
  ctx.fillStyle = '#2E7D32';
  ctx.fillText('= ' + Math.round(v * 100) + ' 厘米', PX, 334);

  // 底部提示
  ctx.textAlign = 'left';
  ctx.font = '13px ' + FONT;
  ctx.fillStyle = '#90A4AE';
  ctx.fillText('十分位对分米，百分位对厘米', SIM_BAR_X, 306);

  // 状态栏
  var rd = document.getElementById('simReadout');
  if (rd) rd.textContent = v.toFixed(2) + ' = ' + units + ' 个 0.01';
  var tp = document.getElementById('simTip');
  if (tp) {
    tp.textContent = simDigit(v, 1) + ' 大格 + ' + simDigit(v, 2) + ' 小格';
  }
}

function simLog(msg, hl) {
  var box = document.getElementById('simLog');
  if (!box) return;
  var d = document.createElement('div');
  if (hl) d.className = 'hl';
  d.textContent = msg;
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
}

function simNext() {
  SIM.i = (SIM.i + 1) % SIM_VALS.length;
  var v = simVal();
  simLog(v.toFixed(2) + '：点亮 ' + Math.round(v * 100) + ' 个小格，' + Math.round(v * 100) + ' 厘米');
  simDraw();
}

function simPrev() {
  SIM.i = (SIM.i - 1 + SIM_VALS.length) % SIM_VALS.length;
  var v = simVal();
  simLog(v.toFixed(2) + '：点亮 ' + Math.round(v * 100) + ' 个小格');
  simDraw();
}

function simReset() {
  SIM.i = 0;
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('重来：0.35 米，3 大格 5 小格');
  simDraw();
}

function simDemo() {
  SIM.i = 0;
  simDraw();
  var timer = setInterval(function () {
    if (SIM.i >= SIM_VALS.length - 1) { clearInterval(timer); return; }
    simNext();
  }, 1100);
}

function simSet(v) {
  var best = 0, gap = 9;
  for (var k = 0; k < SIM_VALS.length; k++) {
    var g = Math.abs(SIM_VALS[k] - v);
    if (g < gap) { gap = g; best = k; }
  }
  SIM.i = best;
  simDraw();
}

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.getAttribute('data-bound')) return;
  cv.setAttribute('data-bound', '1');
  cv.style.cursor = 'pointer';
  cv.addEventListener('click', function (e) {
    var r = cv.getBoundingClientRect();
    var x = (e.clientX - r.left) * (SIM_W / r.width);
    var y = (e.clientY - r.top) * (SIM_H / r.height);
    if (x < SIM_BAR_X || x > SIM_BAR_X + SIM_BAR_W) return;
    if (y < SIM_BAR_Y || y > SIM_BAR_Y + SIM_BAR_H) return;
    var cells = Math.round((x - SIM_BAR_X) / 6);
    simSet(cells / 100);
  });
}

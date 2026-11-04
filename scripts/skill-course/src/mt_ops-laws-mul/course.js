// ===== 仿真：面积模型切一刀，两块面积加起来 =====
var SIM_W = 880, SIM_H = 360;
var SIM_A = 12;          // 竖边：12 行
var SIM_TOT = 15;        // 横边：15 列
var SIM_CELL = 18;
var SIM_OX = 120, SIM_OY = 88;
var SIM_PLOT_W = SIM_TOT * SIM_CELL;   // 270
var SIM_PLOT_H = SIM_A * SIM_CELL;     // 216
var SIM_STEPS = [10, 5, 8, 3, 12];

var SIM = { b: 10, i: 0 };

function simArea() {
  return SIM_A * SIM_TOT;
}

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  var FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';
  var b = SIM.b, c = SIM_TOT - b;
  var wL = b * SIM_CELL, wR = c * SIM_CELL;

  // 标题
  ctx.textAlign = 'left';
  ctx.font = 'bold 16px ' + FONT;
  ctx.fillStyle = '#4A148C';
  ctx.fillText('12 × 15 的长方形，切在哪儿都对', SIM_OX, 28);
  ctx.font = '13px ' + FONT;
  ctx.fillStyle = '#9575CD';
  ctx.fillText('点长方形里任意一列，就在那儿切一刀', SIM_OX, 50);

  // 两块底
  ctx.fillStyle = '#EDE7F6';
  ctx.fillRect(SIM_OX, SIM_OY, wL, SIM_PLOT_H);
  ctx.fillStyle = '#FFCCBC';
  ctx.fillRect(SIM_OX + wL, SIM_OY, wR, SIM_PLOT_H);

  // 格子线
  ctx.strokeStyle = '#DCD2EC';
  ctx.lineWidth = 1;
  for (var i = 1; i < SIM_TOT; i++) {
    ctx.beginPath();
    ctx.moveTo(SIM_OX + i * SIM_CELL, SIM_OY);
    ctx.lineTo(SIM_OX + i * SIM_CELL, SIM_OY + SIM_PLOT_H);
    ctx.stroke();
  }
  ctx.strokeStyle = '#EADFD6';
  for (var j = 1; j < SIM_A; j++) {
    ctx.beginPath();
    ctx.moveTo(SIM_OX, SIM_OY + j * SIM_CELL);
    ctx.lineTo(SIM_OX + SIM_PLOT_W, SIM_OY + j * SIM_CELL);
    ctx.stroke();
  }

  // 外框
  ctx.strokeStyle = '#7E57C2';
  ctx.lineWidth = 2;
  ctx.strokeRect(SIM_OX, SIM_OY, SIM_PLOT_W, SIM_PLOT_H);

  // 切线
  var cx = SIM_OX + wL;
  ctx.strokeStyle = '#E64A19';
  ctx.lineWidth = 3;
  ctx.setLineDash([7, 5]);
  ctx.beginPath();
  ctx.moveTo(cx, SIM_OY - 6);
  ctx.lineTo(cx, SIM_OY + SIM_PLOT_H + 6);
  ctx.stroke();
  ctx.setLineDash([]);

  // 上方两个宽度
  ctx.textAlign = 'center';
  ctx.font = 'bold 15px ' + FONT;
  ctx.fillStyle = '#7E57C2';
  ctx.fillText(String(b), SIM_OX + wL / 2, SIM_OY - 14);
  ctx.fillStyle = '#E64A19';
  ctx.fillText(String(c), SIM_OX + wL + wR / 2, SIM_OY - 14);

  // 左侧高
  ctx.font = 'bold 15px ' + FONT;
  ctx.fillStyle = '#4A148C';
  ctx.fillText(String(SIM_A), SIM_OX - 22, SIM_OY + SIM_PLOT_H / 2 + 5);

  // 块内面积
  ctx.font = 'bold 15px ' + FONT;
  if (wL >= 108) {
    ctx.fillStyle = '#4A148C';
    ctx.fillText('12 × ' + b, SIM_OX + wL / 2, SIM_OY + SIM_PLOT_H / 2 - 8);
    ctx.font = 'bold 17px ' + FONT;
    ctx.fillText('= ' + (SIM_A * b), SIM_OX + wL / 2, SIM_OY + SIM_PLOT_H / 2 + 16);
  } else {
    ctx.fillStyle = '#4A148C';
    ctx.fillText(String(SIM_A * b), SIM_OX + wL / 2, SIM_OY + SIM_PLOT_H / 2 + 6);
  }
  ctx.font = 'bold 15px ' + FONT;
  if (wR >= 108) {
    ctx.fillStyle = '#BF360C';
    ctx.fillText('12 × ' + c, SIM_OX + wL + wR / 2, SIM_OY + SIM_PLOT_H / 2 - 8);
    ctx.font = 'bold 17px ' + FONT;
    ctx.fillText('= ' + (SIM_A * c), SIM_OX + wL + wR / 2, SIM_OY + SIM_PLOT_H / 2 + 16);
  } else {
    ctx.fillStyle = '#BF360C';
    ctx.fillText(String(SIM_A * c), SIM_OX + wL + wR / 2, SIM_OY + SIM_PLOT_H / 2 + 6);
  }

  // 右侧算式
  var PX = 476;
  ctx.textAlign = 'left';
  ctx.font = '13px ' + FONT;
  ctx.fillStyle = '#9575CD';
  ctx.fillText('两笔账', PX, 100);

  ctx.font = 'bold 22px ' + FONT;
  ctx.fillStyle = '#4A148C';
  ctx.fillText('12 × (' + b + ' + ' + c + ')', PX, 136);

  ctx.font = '18px ' + FONT;
  ctx.fillStyle = '#6A1B9A';
  ctx.fillText('= 12 × ' + b + ' + 12 × ' + c, PX, 172);
  ctx.fillStyle = '#E65100';
  ctx.fillText('= ' + (SIM_A * b) + ' + ' + (SIM_A * c), PX, 206);

  ctx.font = 'bold 26px ' + FONT;
  ctx.fillStyle = '#2E7D32';
  ctx.fillText('= ' + simArea(), PX, 250);

  ctx.strokeStyle = '#E0D8EA';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(PX, 268);
  ctx.lineTo(830, 268);
  ctx.stroke();

  ctx.font = '13px ' + FONT;
  ctx.fillStyle = '#90A4AE';
  ctx.fillText('不管切在哪儿，两块加起来都是 ' + simArea(), PX, 292);

  // 底部提示
  ctx.font = '14px ' + FONT;
  ctx.fillStyle = '#7E57C2';
  ctx.fillText('切得越靠边，一块越大、另一块越小，可总数一动不动。', SIM_OX, 330);

  // 状态栏
  var rd = document.getElementById('simReadout');
  if (rd) rd.textContent = '12 × (' + b + ' + ' + c + ') = ' + simArea();
  var tp = document.getElementById('simTip');
  if (tp) tp.textContent = '两块分别是 ' + (SIM_A * b) + ' 和 ' + (SIM_A * c);
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

function simCut(k) {
  if (k === undefined || isNaN(k)) k = 10;
  k = Math.round(k);
  if (k < 1) k = 1;
  if (k > SIM_TOT - 1) k = SIM_TOT - 1;
  var old = SIM.b;
  SIM.b = k;
  if (old === k) {
    simLog('已经切在 ' + k + ' 了，换一列试试');
  } else {
    simLog('切在 ' + k + '：' + (SIM_A * SIM.b) + ' + ' + (SIM_A * (SIM_TOT - SIM.b))
           + ' = ' + simArea() + '，总数没变');
  }
  simDraw();
}

function simNext() {
  SIM.i = (SIM.i + 1) % SIM_STEPS.length;
  simCut(SIM_STEPS[SIM.i]);
}

function simPrev() {
  SIM.i = (SIM.i - 1 + SIM_STEPS.length) % SIM_STEPS.length;
  simCut(SIM_STEPS[SIM.i]);
}

function simReset() {
  SIM.b = 10;
  SIM.i = 0;
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('重来：切在 10，变成 10 和 5 两块');
  simDraw();
}

function simDemo() {
  simReset();
  var timer = setInterval(function () {
    if (SIM.i >= SIM_STEPS.length - 1) { clearInterval(timer); return; }
    simNext();
  }, 900);
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
    if (x < SIM_OX || x > SIM_OX + SIM_PLOT_W || y < SIM_OY || y > SIM_OY + SIM_PLOT_H) return;
    var k = Math.round((x - SIM_OX) / SIM_CELL);
    simCut(k);
  });
}

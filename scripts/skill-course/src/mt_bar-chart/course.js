// ===== 仿真：改一格代表数，条高重算 =====
var SIM_W = 880, SIM_H = 360;
var SIM = { setIdx: 0, unit: 5, log: [] };

var SIM_SETS = [
  { name: '周一义卖', cats: ['折纸组', '书签组', '编织组', '绘画组'], vals: [25, 15, 35, 10] },
  { name: '周二义卖', cats: ['折纸组', '书签组', '编织组', '绘画组'], vals: [45, 30, 50, 20] }
];

var SIM_PLOT_L = 112, SIM_PLOT_R = 822, SIM_BASE_Y = 300;

function simData() { return SIM_SETS[SIM.setIdx]; }
function simMax() {
  var v = simData().vals;
  return Math.max.apply(null, v);
}
function simCells() { return Math.ceil(simMax() / SIM.unit); }
function simCellH() {
  var n = simCells();
  return 208 / n;
}
function simBarH(v) { return (v / SIM.unit) * simCellH(); }

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  var d = simData();
  var n = simCells();
  var ch = simCellH();
  var FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';

  // ---- 顶部标题 ----
  ctx.textAlign = 'left';
  ctx.font = 'bold 19px ' + FONT;
  ctx.fillStyle = '#283593';
  ctx.fillText(d.name + '：四个小组收入统计图', SIM_PLOT_L, 40);

  ctx.font = 'bold 15px ' + FONT;
  ctx.fillStyle = '#00897B';
  ctx.fillText('每格代表 ' + SIM.unit + ' 元', SIM_PLOT_L, 68);

  ctx.textAlign = 'right';
  ctx.font = '14px ' + FONT;
  ctx.fillStyle = n > 20 ? '#C62828' : '#7B87B5';
  ctx.fillText('最高那条 ' + (simMax() / SIM.unit) + ' 格' + (n > 20 ? '（太挤了）' : ''), SIM_PLOT_R, 40);

  // ---- 网格 ----
  var lineStep = n <= 10 ? 1 : (n <= 20 ? 2 : 5);
  ctx.strokeStyle = ch >= 14 ? '#E3E8F7' : '#EFF2FB';
  ctx.lineWidth = 1;
  for (var g = 1; g <= n; g++) {
    var y = SIM_BASE_Y - g * ch;
    ctx.beginPath();
    ctx.moveTo(SIM_PLOT_L, y);
    ctx.lineTo(SIM_PLOT_R, y);
    ctx.stroke();
  }

  // ---- 坐标轴 ----
  ctx.strokeStyle = '#283593';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(SIM_PLOT_L, SIM_BASE_Y - n * ch - 16);
  ctx.lineTo(SIM_PLOT_L, SIM_BASE_Y);
  ctx.lineTo(SIM_PLOT_R, SIM_BASE_Y);
  ctx.stroke();

  // ---- 刻度 ----
  ctx.textAlign = 'right';
  ctx.font = '12px ' + FONT;
  ctx.fillStyle = '#3A4770';
  ctx.fillText('0', SIM_PLOT_L - 10, SIM_BASE_Y + 4);
  for (var k = lineStep; k <= n; k += lineStep) {
    ctx.fillText(String(k * SIM.unit), SIM_PLOT_L - 10, SIM_BASE_Y - k * ch + 4);
  }

  // ---- 条形 ----
  var span = (SIM_PLOT_R - SIM_PLOT_L) / 4;
  var barW = 96;
  for (var i = 0; i < 4; i++) {
    var cx = SIM_PLOT_L + span * (i + 0.5);
    var h = simBarH(d.vals[i]);
    var top = SIM_BASE_Y - h;

    ctx.fillStyle = '#3949AB';
    ctx.fillRect(cx - barW / 2, top, barW, h);

    // 半格提示
    var cells = d.vals[i] / SIM.unit;
    if (Math.abs(cells - Math.round(cells)) > 0.01 && ch >= 14) {
      var cutY = SIM_BASE_Y - Math.floor(cells) * ch;
      ctx.strokeStyle = '#EF6C00';
      ctx.lineWidth = 1.6;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(cx - barW / 2 - 6, cutY);
      ctx.lineTo(cx + barW / 2 + 6, cutY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.textAlign = 'left';
      ctx.font = '11px ' + FONT;
      ctx.fillStyle = '#EF6C00';
      ctx.fillText('半格', cx + barW / 2 + 13, cutY - 3);
    }

    // 数值
    ctx.textAlign = 'center';
    ctx.font = 'bold 15px ' + FONT;
    ctx.fillStyle = '#283593';
    ctx.fillText(String(d.vals[i]), cx, top - 9);

    // 类目
    ctx.font = '13px ' + FONT;
    ctx.fillStyle = '#3A4770';
    ctx.fillText(d.cats[i], cx, SIM_BASE_Y + 24);
  }

  // ---- 轴名 ----
  ctx.textAlign = 'right';
  ctx.font = '12.5px ' + FONT;
  ctx.fillStyle = '#00897B';
  ctx.fillText('横轴：组别', SIM_PLOT_R, SIM_BASE_Y + 44);

  // ---- 读数 ----
  var rd = document.getElementById('simReadout');
  if (rd) rd.textContent = '每格 ' + SIM.unit + ' 元 · 最高 ' + (simMax() / SIM.unit) + ' 格';

  var tip = document.getElementById('simTip');
  if (tip) {
    var half = false;
    for (var j = 0; j < 4; j++) {
      var c2 = d.vals[j] / SIM.unit;
      if (Math.abs(c2 - Math.round(c2)) > 0.01) half = true;
    }
    if (n > 20) tip.textContent = '格子太密，数都数不清';
    else if (half) tip.textContent = '出现了半格：数据不是整数倍';
    else tip.textContent = n + ' 格刚好，高低差别最清楚';
  }
}

function simLog(msg, hl) {
  var box = document.getElementById('simLog');
  if (!box) return;
  var dv = document.createElement('div');
  if (hl) dv.className = 'hl';
  dv.textContent = msg;
  box.appendChild(dv);
  box.scrollTop = box.scrollHeight;
}

function simUnit(u) {
  if (u === undefined || isNaN(u)) {
    var order = [1, 5, 10];
    var at = order.indexOf(SIM.unit);
    u = order[(at + 1) % order.length];
  }
  SIM.unit = u;
  var d = simData();
  var n = simCells();
  var msg = '改成「一格代表 ' + u + ' 元」：最高的那条变成 ' + (simMax() / u) + ' 格';
  if (n > 20) msg += '，格子密到数不清';
  simLog(msg, n > 20);
  simDraw();
}

function simPick(dir) {
  dir = (dir === undefined || isNaN(dir)) ? 1 : dir;
  SIM.setIdx = (SIM.setIdx + dir + SIM_SETS.length) % SIM_SETS.length;
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('换数据：' + simData().name + '（最高 ' + simMax() + ' 元）', true);
  simDraw();
}

function simReset() {
  SIM.setIdx = 0;
  SIM.unit = 5;
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('已重置：周一义卖，一格代表 5 元');
  simDraw();
}

function simDemo() {
  SIM.setIdx = 0;
  SIM.unit = 1;
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simDraw();
  var seq = [5, 10];
  var i = 0;
  var timer = setInterval(function () {
    if (i >= seq.length) { clearInterval(timer); return; }
    simUnit(seq[i]);
    i++;
  }, 1100);
}

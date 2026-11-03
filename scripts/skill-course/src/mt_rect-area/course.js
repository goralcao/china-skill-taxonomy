// ===== 引入页：答案卡「他错在哪」（防御性，本课文未直接调用）=====
function toggleAns(btn) {
  var card = btn && btn.closest ? btn.closest('.ans-card') : null;
  if (!card) return;
  card.classList.toggle('open');
  btn.textContent = card.classList.contains('open') ? '收起' : '他错在哪';
}

// ===== 仿真：铺格子（面积 = 长×宽 / 周长 = 一圈的边）=====
var SIM_W = 860, SIM_H = 332;
var SIM = { L: 5, W: 3, mode: 'area', busy: false, log: [] };

function simIsSquare() { return SIM.L === SIM.W; }

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  var L = SIM.L, W = SIM.W, areaMode = SIM.mode === 'area';
  var cell = Math.min(46, 500 / L, 240 / W);
  var gw = L * cell, gh = W * cell;
  var x0 = (SIM_W - gw) / 2, y0 = (SIM_H - gh) / 2 + 12;

  for (var r = 0; r < W; r++) {
    for (var c = 0; c < L; c++) {
      ctx.fillStyle = areaMode ? '#FFCCBC' : '#F0EFDC';
      ctx.fillRect(x0 + c * cell, y0 + r * cell, cell, cell);
      ctx.strokeStyle = '#827717';
      ctx.lineWidth = 1;
      ctx.strokeRect(x0 + c * cell, y0 + r * cell, cell, cell);
    }
  }

  if (!areaMode) {
    ctx.strokeStyle = '#D84315';
    ctx.lineWidth = 7;
    ctx.strokeRect(x0, y0, gw, gh);
  } else {
    ctx.strokeStyle = '#827717';
    ctx.lineWidth = 3;
    ctx.strokeRect(x0, y0, gw, gh);
  }

  // 标注长、宽
  ctx.textAlign = 'center';
  ctx.font = '16px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#827717';
  ctx.fillText('长 ' + L + ' 厘米', x0 + gw / 2, y0 + gh + 26);
  ctx.save();
  ctx.translate(x0 - 22, y0 + gh / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('宽 ' + W + ' 厘米', 0, 0);
  ctx.restore();

  // 顶部结论
  ctx.textAlign = 'center';
  ctx.font = 'bold 24px "Microsoft YaHei","Noto Sans SC",sans-serif';
  if (areaMode) {
    ctx.fillStyle = '#00695C';
    var f = simIsSquare() ? ('面积 = 边长×边长 = ' + L + '×' + L + ' = ' + (L * W)) : ('面积 = 长×宽 = ' + L + '×' + W + ' = ' + (L * W));
    ctx.fillText(f + ' 平方厘米', SIM_W / 2, 52);
    ctx.font = '16px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = '#795548';
    ctx.fillText('每行 ' + L + ' 个，摆 ' + W + ' 行，共 ' + (L * W) + ' 个小方格', SIM_W / 2, 78);
  } else {
    ctx.fillStyle = '#00695C';
    ctx.fillText('周长 = (' + L + ' + ' + W + ') × 2 = ' + (2 * (L + W)) + ' 厘米', SIM_W / 2, 52);
    ctx.font = '16px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = '#795548';
    ctx.fillText('沿边一圈的长度，不是里面格子的数', SIM_W / 2, 78);
  }

  simReadout();
}

function simReadout() {
  var el = document.getElementById('simReadout');
  var L = SIM.L, W = SIM.W;
  if (el) {
    if (SIM.mode === 'area') {
      el.textContent = simIsSquare() ? ('面积 = 边长×边长 = ' + L + '×' + L + ' = ' + (L * W) + ' 平方厘米')
        : ('面积 = ' + L + ' × ' + W + ' = ' + (L * W) + ' 平方厘米');
    } else {
      el.textContent = '周长 = (' + L + ' + ' + W + ') × 2 = ' + (2 * (L + W)) + ' 厘米';
    }
  }
  var tip = document.getElementById('simTip');
  if (!tip) return;
  tip.textContent = SIM.mode === 'area' ? '每行几个 × 几行，就是面积（单位带平方）' : '周长量一圈的边，单位是厘米';
}

function simLog(msg, hl) {
  SIM.log.push({ t: msg, hl: !!hl });
  if (SIM.log.length > 5) SIM.log.shift();
  var box = document.getElementById('simLog');
  if (!box) return;
  box.innerHTML = SIM.log.map(function (x) {
    return '<div' + (x.hl ? ' class="hl"' : '') + '>· ' + x.t + '</div>';
  }).join('');
}

function simSetL(v) { SIM.L = Math.max(1, Math.min(10, v)); simLog('长变成 ' + SIM.L + ' 厘米', false); simDraw(); }
function simSetW(v) { SIM.W = Math.max(1, Math.min(8, v)); simLog('宽变成 ' + SIM.W + ' 厘米', false); simDraw(); }
function simLplus() { if (!SIM.busy) simSetL(SIM.L + 1); }
function simLminus() { if (!SIM.busy) simSetL(SIM.L - 1); }
function simWplus() { if (!SIM.busy) simSetW(SIM.W + 1); }
function simWminus() { if (!SIM.busy) simSetW(SIM.W - 1); }

function simArea() {
  if (SIM.busy) return;
  SIM.mode = 'area';
  simLog('看面积：' + SIM.L + '×' + SIM.W + ' = ' + (SIM.L * SIM.W) + ' 平方厘米', true);
  simDraw();
}

function simPerimeter() {
  if (SIM.busy) return;
  SIM.mode = 'perimeter';
  simLog('看周长：(' + SIM.L + '+' + SIM.W + ')×2 = ' + (2 * (SIM.L + SIM.W)) + ' 厘米', true);
  simDraw();
}

function simSquare() {
  if (SIM.busy) return;
  SIM.W = SIM.L; SIM.mode = 'area';
  simLog('变成正方形：边长 ' + SIM.L + ' 厘米，面积 ' + SIM.L + '×' + SIM.L + ' = ' + (SIM.L * SIM.L) + ' 平方厘米', true);
  simDraw();
}

function simReset() {
  if (SIM.busy) return;
  SIM.L = 5; SIM.W = 3; SIM.mode = 'area'; SIM.log = [];
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('已重置：长 5 厘米、宽 3 厘米');
  simDraw();
}

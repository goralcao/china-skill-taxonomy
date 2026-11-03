// ===== 引入页：答案卡「他错在哪」（防御性，本课文未直接调用）=====
function toggleAns(btn) {
  var card = btn && btn.closest ? btn.closest('.ans-card') : null;
  if (!card) return;
  card.classList.toggle('open');
  btn.textContent = card.classList.contains('open') ? '收起' : '他错在哪';
}

// ===== 仿真：小方格铺满（面积数格子 / 周长描一圈）=====
var SIM_W = 860, SIM_H = 332;
var SIM = { w: 4, h: 3, mode: 'area', busy: false, log: [] };

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  var w = SIM.w, h = SIM.h, areaMode = SIM.mode === 'area';
  var cell = Math.min(50, 470 / w, 230 / h);
  var gw = w * cell, gh = h * cell;
  var x0 = (SIM_W - gw) / 2, y0 = (SIM_H - gh) / 2 + 12;

  // 格子
  for (var r = 0; r < h; r++) {
    for (var c = 0; c < w; c++) {
      ctx.fillStyle = areaMode ? '#B2DFDB' : '#F0E6DF';
      ctx.fillRect(x0 + c * cell, y0 + r * cell, cell, cell);
      ctx.strokeStyle = '#5D4037';
      ctx.lineWidth = 1;
      ctx.strokeRect(x0 + c * cell, y0 + r * cell, cell, cell);
    }
  }

  // 周长模式：描一圈粗边
  if (!areaMode) {
    ctx.strokeStyle = '#26A69A';
    ctx.lineWidth = 7;
    ctx.strokeRect(x0, y0, gw, gh);
  } else {
    ctx.strokeStyle = '#00897B';
    ctx.lineWidth = 3;
    ctx.strokeRect(x0, y0, gw, gh);
  }

  // 标注：宽、高
  ctx.textAlign = 'center';
  ctx.font = '16px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#5D4037';
  ctx.fillText(w + ' 厘米', x0 + gw / 2, y0 + gh + 26);
  ctx.save();
  ctx.translate(x0 - 22, y0 + gh / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(h + ' 厘米', 0, 0);
  ctx.restore();

  // 顶部结论
  ctx.textAlign = 'center';
  ctx.font = 'bold 24px "Microsoft YaHei","Noto Sans SC",sans-serif';
  if (areaMode) {
    ctx.fillStyle = '#00796B';
    ctx.fillText('面积 = ' + w + ' × ' + h + ' = ' + (w * h) + ' 平方厘米', SIM_W / 2, 52);
    ctx.font = '16px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = '#795548';
    ctx.fillText('铺满 ' + (w * h) + ' 个小方格，每个 1 平方厘米', SIM_W / 2, 78);
  } else {
    ctx.fillStyle = '#00796B';
    ctx.fillText('周长 = (' + w + ' + ' + h + ') × 2 = ' + (2 * (w + h)) + ' 厘米', SIM_W / 2, 52);
    ctx.font = '16px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = '#795548';
    ctx.fillText('沿边一圈的长度，不加里面的格', SIM_W / 2, 78);
  }

  simReadout();
}

function simReadout() {
  var el = document.getElementById('simReadout');
  var w = SIM.w, h = SIM.h;
  if (el) {
    if (SIM.mode === 'area') el.textContent = w + ' × ' + h + ' = ' + (w * h) + ' 平方厘米（面积）';
    else el.textContent = '(' + w + ' + ' + h + ') × 2 = ' + (2 * (w + h)) + ' 厘米（周长）';
  }
  var tip = document.getElementById('simTip');
  if (!tip) return;
  tip.textContent = SIM.mode === 'area' ? '面积数铺满的格子，单位带平方' : '周长量一圈的边，单位是厘米';
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

function simSetW(v) { SIM.w = Math.max(1, Math.min(6, v)); simLog('宽变成 ' + SIM.w + ' 厘米', false); simDraw(); }
function simSetH(v) { SIM.h = Math.max(1, Math.min(6, v)); simLog('高变成 ' + SIM.h + ' 厘米', false); simDraw(); }
function simWplus() { if (!SIM.busy) simSetW(SIM.w + 1); }
function simWminus() { if (!SIM.busy) simSetW(SIM.w - 1); }
function simHplus() { if (!SIM.busy) simSetH(SIM.h + 1); }
function simHminus() { if (!SIM.busy) simSetH(SIM.h - 1); }

function simArea() {
  if (SIM.busy) return;
  SIM.mode = 'area';
  simLog('看面积：' + SIM.w + '×' + SIM.h + ' = ' + (SIM.w * SIM.h) + ' 平方厘米', true);
  simDraw();
}

function simPerimeter() {
  if (SIM.busy) return;
  SIM.mode = 'perimeter';
  simLog('看周长：(' + SIM.w + '+' + SIM.h + ')×2 = ' + (2 * (SIM.w + SIM.h)) + ' 厘米', true);
  simDraw();
}

function simReset() {
  if (SIM.busy) return;
  SIM.w = 4; SIM.h = 3; SIM.mode = 'area'; SIM.log = [];
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('已重置：4 厘米 × 3 厘米');
  simDraw();
}

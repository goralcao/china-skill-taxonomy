// ===== 仿真：一块一块铺，从 100 平方米铺到 1 公顷 / 1 平方千米 =====
var SIM_W = 880, SIM_H = 360;
var SIM = { mode: 'ha', filled: 0, busy: false, log: [] };

// 公顷模式：10×10 格，每格 10m×10m = 100 平方米，铺满 100 格 = 10000 平方米
// 平方千米模式：10×10 格，每格 100m×100m = 1 公顷，铺满 100 格 = 100 公顷
var N = 10;

function simCellArea() { return SIM.mode === 'ha' ? 100 : 10000; }        // 平方米
function simCellSide() { return SIM.mode === 'ha' ? 10 : 100; }          // 米
function simTotalArea() { return simCellArea() * N * N; }                // 平方米

function fmtArea(m2) {
  if (m2 >= 1000000) {
    var km2 = m2 / 1000000;
    return (km2 % 1 === 0 ? km2 : km2.toFixed(2)) + ' 平方千米';
  }
  if (m2 >= 10000) {
    var ha = m2 / 10000;
    return (ha % 1 === 0 ? ha : ha.toFixed(2)) + ' 公顷（' + m2 + ' 平方米）';
  }
  return m2 + ' 平方米';
}

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  var boxW = 300, boxH = 300, x0 = 80, y0 = 34;
  var cell = boxW / N;

  for (var r = 0; r < N; r++) {
    for (var c = 0; c < N; c++) {
      var idx = r * N + c;
      var on = idx < SIM.filled;
      ctx.fillStyle = on ? (SIM.mode === 'ha' ? '#AED581' : '#80CBC4') : '#F1F8E9';
      ctx.fillRect(x0 + c * cell, y0 + r * cell, cell, cell);
      ctx.strokeStyle = '#C5E1A5';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(x0 + c * cell, y0 + r * cell, cell, cell);
    }
  }

  // 外框
  ctx.strokeStyle = '#33691E';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x0, y0, boxW, boxH);

  // 边长标注
  ctx.textAlign = 'center';
  ctx.font = '14px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#33691E';
  ctx.fillText((simCellSide() * N) + ' 米', x0 + boxW / 2, y0 - 10);
  ctx.save();
  ctx.translate(x0 - 18, y0 + boxH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText((simCellSide() * N) + ' 米', 0, 0);
  ctx.restore();

  // 右侧读数
  var m2 = SIM.filled * simCellArea();
  var rx = 430;
  ctx.textAlign = 'left';
  ctx.font = '15px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#6B7A5E';
  ctx.fillText('每格边长 ' + simCellSide() + ' 米', rx, 70);
  ctx.fillText('每格面积 ' + simCellArea() + ' 平方米', rx, 98);
  ctx.fillText('已铺 ' + SIM.filled + ' / ' + (N * N) + ' 格', rx, 126);

  ctx.font = 'bold 26px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#33691E';
  ctx.fillText('= ' + m2 + ' 平方米', rx, 172);

  ctx.font = 'bold 22px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#EF6C00';
  if (m2 >= 10000) {
    var ha = m2 / 10000;
    ctx.fillText('= ' + (ha % 1 === 0 ? ha : ha.toFixed(2)) + ' 公顷', rx, 208);
  }
  if (m2 >= 1000000) {
    var km2 = m2 / 1000000;
    ctx.fillText('= ' + (km2 % 1 === 0 ? km2 : km2.toFixed(2)) + ' 平方千米', rx, 242);
  }

  // 进度条
  var barW = 380, barH = 16, bx = rx, by = 268;
  ctx.fillStyle = '#E8F0DC';
  ctx.fillRect(bx, by, barW, barH);
  ctx.fillStyle = SIM.mode === 'ha' ? '#7CB342' : '#26A69A';
  ctx.fillRect(bx, by, barW * SIM.filled / (N * N), barH);
  ctx.strokeStyle = '#C5D6AE';
  ctx.lineWidth = 1;
  ctx.strokeRect(bx, by, barW, barH);

  ctx.font = '13px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#6B7A5E';
  ctx.fillText(SIM.mode === 'ha' ? '铺满 100 格 = 1 公顷' : '铺满 100 格 = 100 公顷 = 1 平方千米', bx, by + 38);

  simReadout();
}

function simReadout() {
  var m2 = SIM.filled * simCellArea();
  var el = document.getElementById('simReadout');
  if (el) el.textContent = '已铺 ' + SIM.filled + ' 格 = ' + m2 + ' 平方米' + (m2 >= 10000 ? '（' + (m2 / 10000) + ' 公顷）' : '');
  var tip = document.getElementById('simTip');
  if (tip) tip.textContent = SIM.mode === 'ha'
    ? '每格 10 米 × 10 米 = 100 平方米；100 格铺满 = 1 公顷'
    : '每格 100 米 × 100 米 = 1 公顷；100 格铺满 = 100 公顷 = 1 平方千米';
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

function simFillOne() {
  if (SIM.busy) return;
  if (SIM.filled >= N * N) { simLog('已经铺满了', false); return; }
  SIM.filled++;
  var m2 = SIM.filled * simCellArea();
  simLog('铺第 ' + SIM.filled + ' 格，累计 ' + m2 + ' 平方米' + (m2 === 10000 ? '，正好 1 公顷' : ''), m2 === 10000 || m2 === 1000000);
  simDraw();
}

function simFillRow() {
  if (SIM.busy) return;
  var add = Math.min(N, N * N - SIM.filled);
  if (add <= 0) { simLog('已经铺满了', false); return; }
  SIM.filled += add;
  simLog('铺满一行 +' + add + ' 格，累计 ' + (SIM.filled * simCellArea()) + ' 平方米', false);
  simDraw();
}

function simFillAll() {
  if (SIM.busy) return;
  SIM.filled = N * N;
  var total = simTotalArea();
  simLog('全部铺满：' + total + ' 平方米 = ' + (SIM.mode === 'ha' ? '1 公顷' : '1 平方千米'), true);
  simDraw();
}

function simSwitch() {
  if (SIM.busy) return;
  SIM.mode = SIM.mode === 'ha' ? 'km' : 'ha';
  SIM.filled = 0;
  simLog(SIM.mode === 'ha' ? '切到公顷：每格 10 米 × 10 米' : '切到平方千米：每格 100 米 × 100 米 = 1 公顷', true);
  simDraw();
}

function simReset() {
  if (SIM.busy) return;
  SIM.mode = 'ha';
  SIM.filled = 0;
  SIM.log = [];
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('已重置：公顷模式，一格 100 平方米');
  simDraw();
}

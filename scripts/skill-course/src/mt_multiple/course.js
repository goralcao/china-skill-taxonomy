// ===== 引入页：答案卡「他错在哪」 =====
function toggleAns(btn) {
  var card = btn.closest('.ans-card');
  if (!card) return;
  card.classList.toggle('open');
  btn.textContent = card.classList.contains('open') ? '收起' : '他错在哪';
}

// ===== 仿真：摆一摆（第一行是标准，每加一行多 1 倍）=====
var SIM_W = 860, SIM_H = 332;
var SIM = { base: 3, rows: 1, busy: false, log: [] };
var MAX_ROWS = 6;

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  var N = SIM.base;
  var rows = Math.max(1, Math.min(SIM.rows, MAX_ROWS));
  var r = 16, gapX = 50, gapY = 52;
  var startY = 40;
  var rowW = N * gapX;
  var startX = (SIM_W - rowW) / 2 + gapX / 2;

  for (var y = 0; y < rows; y++) {
    var cy = startY + y * gapY;
    var isStd = (y === 0);
    for (var x = 0; x < N; x++) {
      var cx = startX + x * gapX;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = isStd ? '#4527A0' : '#FF8F00';
      ctx.fill();
      if (isStd) { ctx.lineWidth = 3; ctx.strokeStyle = '#311B92'; ctx.stroke(); }
    }
    // 行标签
    ctx.font = (isStd ? 'bold ' : '') + '15px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.textAlign = 'left';
    if (isStd) { ctx.fillStyle = '#4527A0'; ctx.fillText('标准 · 1 倍', 30, cy + 5); }
    else { ctx.fillStyle = '#FF8F00'; ctx.fillText('再来 ' + y + ' 组（共 ' + (y + 1) + ' 倍）', 30, cy + 5); }
  }

  simReadout();
}

function simReadout() {
  var el = document.getElementById('simReadout');
  var N = SIM.base, k = Math.max(1, SIM.rows);
  if (el) el.textContent = N + ' 的 ' + k + ' 倍 = ' + (N * k) + ' 个';
  var tip = document.getElementById('simTip');
  if (!tip) return;
  if (k <= 1) tip.textContent = '现在只有标准行（1 倍）';
  else if (k === 2) tip.textContent = '🎉 多了一组，正好是 ' + N + ' 的 2 倍！';
  else if (k === 3) tip.textContent = '🎉 ' + N + ' 的 3 倍，三行一样多';
  else tip.textContent = '已经是 ' + N + ' 的 ' + k + ' 倍';
}

function simLog(msg, hl) {
  SIM.log.push({ t: msg, hl: !!hl });
  if (SIM.log.length > 4) SIM.log.shift();
  var box = document.getElementById('simLog');
  if (!box) return;
  box.innerHTML = SIM.log.map(function (x) {
    return '<div' + (x.hl ? ' class="hl"' : '') + '>· ' + x.t + '</div>';
  }).join('');
}

function simSetBase(n) {
  if (SIM.busy) return;
  SIM.base = n; SIM.rows = 1; SIM.log = [];
  simLog('基数换成 ' + n + '：第一行 ' + n + ' 个（标准 1 倍）', true);
  simDraw();
}

function simAddRow() {
  if (SIM.busy) return;
  if (SIM.rows >= MAX_ROWS) { simLog('先练到 3 倍以内，最多摆 ' + MAX_ROWS + ' 行～'); simDraw(); return; }
  SIM.rows++;
  var k = SIM.rows;
  simLog('+ 一行 ' + SIM.base + ' 个 → 共 ' + k + ' 行 = ' + SIM.base + ' 的 ' + k + ' 倍', k === 2 || k === 3);
  simDraw();
}

function simSubRow() {
  if (SIM.busy) return;
  if (SIM.rows <= 1) { simLog('只剩标准行啦：1 行就是自己，1 倍'); simDraw(); return; }
  SIM.rows--;
  var k = SIM.rows;
  simLog('− 一行 → 回到 ' + SIM.base + ' 的 ' + k + ' 倍', false);
  simDraw();
}

function simDemo(n, k) {
  if (SIM.busy) return;
  SIM.busy = true;
  SIM.base = n; SIM.rows = 1; SIM.log = [];
  simLog('演示：' + n + ' 的 ' + k + ' 倍 —— 先有 1 行标准', true);
  simDraw();
  var i = 1;
  var timer = setInterval(function () {
    if (i >= k) {
      clearInterval(timer);
      simLog(n + ' × ' + k + ' = ' + (n * k) + ' 个，这就是 ' + n + ' 的 ' + k + ' 倍', true);
      SIM.busy = false;
      return;
    }
    SIM.rows++;
    simLog('加第 ' + SIM.rows + ' 行（' + n + ' 个）→ ' + n + ' 的 ' + SIM.rows + ' 倍', SIM.rows === k);
    simDraw();
    i++;
  }, 520);
}

function simReset() {
  if (SIM.busy) return;
  SIM.base = 3; SIM.rows = 1; SIM.log = [];
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('已重置：第一行 3 个（标准 1 倍）');
  simDraw();
}

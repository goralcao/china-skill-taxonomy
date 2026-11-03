// ===== 引入页：答案卡「他错在哪」（防御性，本课文未直接调用）=====
function toggleAns(btn) {
  var card = btn && btn.closest ? btn.closest('.ans-card') : null;
  if (!card) return;
  card.classList.toggle('open');
  btn.textContent = card.classList.contains('open') ? '收起' : '他错在哪';
}

// ===== 仿真：分披萨（平均分成 n 份，涂 k 份）=====
var SIM_W = 860, SIM_H = 332;
var SIM = { n: 4, k: 1, busy: false, log: [] };

function simClamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }

function drawFrac(ctx, cx, topY, num, den, size, color) {
  ctx.textAlign = 'center';
  ctx.fillStyle = color;
  ctx.font = 'bold ' + size + 'px "Courier New",monospace';
  ctx.fillText(String(num), cx, topY);
  var midY = topY + size * 0.30;
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(3, Math.round(size / 16));
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.62, midY);
  ctx.lineTo(cx + size * 0.62, midY);
  ctx.stroke();
  ctx.fillText(String(den), cx, topY + size * 1.30);
}

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  var n = SIM.n, k = SIM.k;
  var cx = 250, cy = 166, R = 118;

  // 圆饼：平均分成 n 份，前 k 份涂色
  for (var i = 0; i < n; i++) {
    var a0 = -Math.PI / 2 + i * 2 * Math.PI / n;
    var a1 = a0 + 2 * Math.PI / n;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R, a0, a1);
    ctx.closePath();
    ctx.fillStyle = i < k ? '#FFB300' : '#F8E3EA';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  // 外圈
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.strokeStyle = '#AD1457';
  ctx.lineWidth = 4;
  ctx.stroke();

  // 第一份上标 1/n（若至少涂了一份）
  if (k >= 1) {
    var mid = -Math.PI / 2 + Math.PI / n;
    var lx = cx + Math.cos(mid) * R * 0.62;
    var ly = cy + Math.sin(mid) * R * 0.62;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#5A2A00';
    ctx.font = 'bold 20px "Courier New",monospace';
    ctx.fillText('1/' + n, lx, ly + 7);
  }

  // 右侧：大分数 + 说明
  ctx.textAlign = 'center';
  ctx.fillStyle = '#AD1457';
  ctx.font = 'bold 20px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillText('涂色部分', 650, 62);
  drawFrac(ctx, 650, 104, k, n, 62, '#AD1457');
  ctx.font = '20px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#7A3550';
  ctx.fillText('平均分成 ' + n + ' 份', 650, 262);
  ctx.fillText('涂了 ' + k + ' 份', 650, 292);

  simReadout();
}

function simReadout() {
  var el = document.getElementById('simReadout');
  var n = SIM.n, k = SIM.k;
  if (el) el.textContent = '平均分成 ' + n + ' 份，涂 ' + k + ' 份 = ' + k + '/' + n;
  var tip = document.getElementById('simTip');
  if (!tip) return;
  if (k === 0) tip.textContent = '还没涂色，点「涂色 +1」看看分子怎么变';
  else if (k === n) tip.textContent = '涂满了：' + n + '/' + n + ' 就是整个 1';
  else if (n >= 8) tip.textContent = '份数变多，每份更小：1/' + n + ' < 1/4';
  else tip.textContent = '分母是总份数 ' + n + '，分子是涂色份数 ' + k;
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

function simMoreParts() {
  if (SIM.busy) return;
  if (SIM.n >= 12) { simLog('最多分 12 份，先重置吧'); simDraw(); return; }
  SIM.n++;
  if (SIM.k > SIM.n) SIM.k = SIM.n;
  simLog('份数 +1 → 平均分成 ' + SIM.n + ' 份，每份变成 1/' + SIM.n + '（更小了）', true);
  simDraw();
}

function simFewerParts() {
  if (SIM.busy) return;
  if (SIM.n <= 2) { simLog('最少分 2 份'); simDraw(); return; }
  SIM.n--;
  if (SIM.k > SIM.n) SIM.k = SIM.n;
  simLog('份数 −1 → 平均分成 ' + SIM.n + ' 份，每份变成 1/' + SIM.n + '（更大了）', false);
  simDraw();
}

function simAddSlice() {
  if (SIM.busy) return;
  if (SIM.k >= SIM.n) { simLog('已经涂满 ' + SIM.n + ' 份啦'); simDraw(); return; }
  SIM.k++;
  simLog('多涂 1 份 → ' + SIM.k + '/' + SIM.n, SIM.k === SIM.n);
  simDraw();
}

function simSubSlice() {
  if (SIM.busy) return;
  if (SIM.k <= 0) { simLog('已经一份都没涂啦'); simDraw(); return; }
  SIM.k--;
  simLog('少涂 1 份 → ' + SIM.k + '/' + SIM.n, false);
  simDraw();
}

function simDemo() {
  if (SIM.busy) return;
  SIM.busy = true;
  SIM.n = 4; SIM.k = 0; SIM.log = [];
  simLog('演示：平均分成 4 份，一份一份涂', true);
  simDraw();
  var timer = setInterval(function () {
    if (SIM.k >= SIM.n) {
      clearInterval(timer);
      simLog('涂满 4 份 = 4/4 = 整个 1', true);
      SIM.busy = false;
      simDraw();
      return;
    }
    SIM.k++;
    simLog('涂 ' + SIM.k + ' 份 → ' + SIM.k + '/4', SIM.k === SIM.n);
    simDraw();
  }, 800);
}

function simReset() {
  if (SIM.busy) return;
  SIM.n = 4; SIM.k = 1; SIM.log = [];
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('已重置：平均分成 4 份，涂 1 份');
  simDraw();
}

// ===== 引入页：答案卡「他错在哪」（防御性，本课文未直接调用）=====
function toggleAns(btn) {
  var card = btn && btn.closest ? btn.closest('.ans-card') : null;
  if (!card) return;
  card.classList.toggle('open');
  btn.textContent = card.classList.contains('open') ? '收起' : '他错在哪';
}

// ===== 仿真：分数条相加（分母固定 6，红 a 份 + 青 b 份）=====
var SIM_W = 860, SIM_H = 332;
var SIM = { n: 6, a: 2, b: 1, busy: false, log: [] };

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

  var n = SIM.n, a = SIM.a, b = SIM.b, s = a + b;
  var x = 100, y = 66, w = 660, h = 100, segW = w / n;

  // 分数条：前 a 份红，接着 b 份青
  for (var i = 0; i < n; i++) {
    ctx.fillStyle = i < a ? '#E65100' : (i < a + b ? '#00838F' : '#FDE8D8');
    ctx.fillRect(x + i * segW, y, segW, h);
    // 分隔线
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.strokeRect(x + i * segW, y, segW, h);
  }
  // 外框
  ctx.strokeStyle = '#E65100';
  ctx.lineWidth = 4;
  ctx.strokeRect(x, y, w, h);
  // 每段标 1/n
  ctx.textAlign = 'center';
  ctx.font = '15px "Courier New",monospace';
  for (var j = 0; j < n; j++) {
    ctx.fillStyle = j < a + b ? '#FFFFFF' : '#B08968';
    ctx.fillText('1/' + n, x + j * segW + segW / 2, y + h / 2 + 5);
  }

  // 图例
  ctx.textAlign = 'left';
  ctx.font = '16px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#E65100';
  ctx.fillRect(x, y + h + 14, 16, 16);
  ctx.fillText('红 ' + a + ' 份', x + 24, y + h + 28);
  ctx.fillStyle = '#00838F';
  ctx.fillRect(x + 130, y + h + 14, 16, 16);
  ctx.fillText('青 ' + b + ' 份', x + 154, y + h + 28);
  ctx.fillStyle = '#7A4A20';
  ctx.fillText('合起来 ' + s + ' 份，分母仍是 ' + n, x + 260, y + h + 28);

  // 算式：a/n + b/n = s/n
  var topY = 244, size = 50;
  drawFrac(ctx, 250, topY, a, n, size, '#E65100');
  ctx.textAlign = 'center';
  ctx.fillStyle = '#7A4A20';
  ctx.font = 'bold 40px "Courier New",monospace';
  ctx.fillText('+', 335, topY + 34);
  drawFrac(ctx, 415, topY, b, n, size, '#00838F');
  ctx.fillStyle = '#7A4A20';
  ctx.fillText('=', 495, topY + 34);
  drawFrac(ctx, 580, topY, s, n, size, '#2E7D32');

  simReadout();
}

function simReadout() {
  var el = document.getElementById('simReadout');
  var n = SIM.n, a = SIM.a, b = SIM.b, s = a + b;
  if (el) el.textContent = a + '/' + n + ' + ' + b + '/' + n + ' = ' + s + '/' + n;
  var tip = document.getElementById('simTip');
  if (!tip) return;
  if (s >= n) tip.textContent = '合满 ' + n + ' 份 = ' + n + '/' + n + '，就是一整条';
  else tip.textContent = '分母 ' + n + ' 不变，分子 ' + a + ' + ' + b + ' 在相加';
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

function simAplus() {
  if (SIM.busy) return;
  if (SIM.a + SIM.b >= SIM.n) { simLog('已经合满 ' + SIM.n + ' 份啦'); simDraw(); return; }
  SIM.a++;
  simLog('红 +1 → ' + SIM.a + '/' + SIM.n + ' + ' + SIM.b + '/' + SIM.n + ' = ' + (SIM.a + SIM.b) + '/' + SIM.n, true);
  simDraw();
}

function simAminus() {
  if (SIM.busy) return;
  if (SIM.a <= 0) { simLog('红的已经没有啦'); simDraw(); return; }
  SIM.a--;
  simLog('红 −1 → ' + SIM.a + '/' + SIM.n + ' + ' + SIM.b + '/' + SIM.n + ' = ' + (SIM.a + SIM.b) + '/' + SIM.n, false);
  simDraw();
}

function simBplus() {
  if (SIM.busy) return;
  if (SIM.a + SIM.b >= SIM.n) { simLog('已经合满 ' + SIM.n + ' 份啦'); simDraw(); return; }
  SIM.b++;
  simLog('青 +1 → ' + SIM.a + '/' + SIM.n + ' + ' + SIM.b + '/' + SIM.n + ' = ' + (SIM.a + SIM.b) + '/' + SIM.n, true);
  simDraw();
}

function simBminus() {
  if (SIM.busy) return;
  if (SIM.b <= 0) { simLog('青的已经没有啦'); simDraw(); return; }
  SIM.b--;
  simLog('青 −1 → ' + SIM.a + '/' + SIM.n + ' + ' + SIM.b + '/' + SIM.n + ' = ' + (SIM.a + SIM.b) + '/' + SIM.n, false);
  simDraw();
}

function simDemo() {
  if (SIM.busy) return;
  SIM.busy = true;
  SIM.a = 0; SIM.b = 0; SIM.log = [];
  simLog('演示：分母固定 6，先放红，再放青', true);
  simDraw();
  var phase = 0;
  var timer = setInterval(function () {
    if (phase === 0) { SIM.a = 1; simLog('红 1 份 → 1/6', false); }
    else if (phase === 1) { SIM.a = 2; simLog('红 2 份 → 2/6', false); }
    else if (phase === 2) { SIM.b = 1; simLog('青 1 份 → 2/6 + 1/6 = 3/6', true); }
    else {
      clearInterval(timer);
      simLog('分母一直是 6，只有分子在变', true);
      SIM.busy = false;
      simDraw();
      return;
    }
    phase++;
    simDraw();
  }, 800);
}

function simReset() {
  if (SIM.busy) return;
  SIM.a = 2; SIM.b = 1; SIM.log = [];
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('已重置：2/6 + 1/6 = 3/6');
  simDraw();
}

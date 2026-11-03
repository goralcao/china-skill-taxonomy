// ===== 引入页：答案卡「他错在哪」（防御性，本课文未直接调用）=====
function toggleAns(btn) {
  var card = btn && btn.closest ? btn.closest('.ans-card') : null;
  if (!card) return;
  card.classList.toggle('open');
  btn.textContent = card.classList.contains('open') ? '收起' : '他错在哪';
}

// ===== 仿真：沿边走一圈（四条边依次亮起并累加）=====
var SIM_W = 860, SIM_H = 332;
var SIM = { L: 6, W: 4, step: 0, busy: false, log: [] };
var SIDES = [
  { name: '上边', dim: 'L' },
  { name: '右边', dim: 'W' },
  { name: '下边', dim: 'L' },
  { name: '左边', dim: 'W' }
];

function simIsSquare() { return SIM.L === SIM.W; }

function simAccum(n) {
  // 前 n 条边的累计长度
  var sum = 0;
  for (var i = 0; i < n; i++) sum += (SIDES[i].dim === 'L' ? SIM.L : SIM.W);
  return sum;
}

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  var L = SIM.L, W = SIM.W;
  var scale = Math.min(42, 640 / L, 240 / W);
  var w = L * scale, h = W * scale;
  var x0 = (SIM_W - w) / 2, y0 = (SIM_H - h) / 2;
  var x1 = x0 + w, y1 = y0 + h;

  // 底面：浅色填充 + 细边
  ctx.fillStyle = '#E4F0DF';
  ctx.fillRect(x0, y0, w, h);
  ctx.strokeStyle = '#C2DEC0';
  ctx.lineWidth = 3;
  ctx.strokeRect(x0, y0, w, h);

  // 四条边（左→右坐标），按点亮顺序高亮
  var seg = [
    { x: x0, y: y0, x2: x1, y2: y0, dim: 'L' }, // 上
    { x: x1, y: y0, x2: x1, y2: y1, dim: 'W' }, // 右
    { x: x1, y: y1, x2: x0, y2: y1, dim: 'L' }, // 下
    { x: x0, y: y1, x2: x0, y2: y0, dim: 'W' }  // 左
  ];
  for (var i = 0; i < 4; i++) {
    var on = SIM.step > i;
    ctx.beginPath();
    ctx.moveTo(seg[i].x, seg[i].y);
    ctx.lineTo(seg[i].x2, seg[i].y2);
    ctx.lineWidth = on ? 8 : 3;
    ctx.strokeStyle = on ? '#FB8C00' : '#C2DEC0';
    ctx.lineCap = 'round';
    ctx.stroke();
    if (on) {
      // 走过的那条边，起点画个圆点
      ctx.beginPath();
      ctx.arc(seg[i].x, seg[i].y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#C62828';
      ctx.fill();
    }
  }

  // 边长标注
  ctx.font = 'bold 17px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.textAlign = 'center';
  var labL = simIsSquare() ? ('边长 ' + L + ' 厘米') : ('长 ' + L + ' 厘米');
  var labW = simIsSquare() ? ('边长 ' + W + ' 厘米') : ('宽 ' + W + ' 厘米');
  ctx.fillStyle = '#2E7D32';
  ctx.fillText(labL, (x0 + x1) / 2, y0 - 12);
  ctx.fillText(labL, (x0 + x1) / 2, y1 + 26);
  ctx.textAlign = 'right';
  ctx.fillText(labW, x0 - 12, (y0 + y1) / 2 + 6);
  ctx.textAlign = 'left';
  ctx.fillText(labW, x1 + 12, (y0 + y1) / 2 + 6);

  // 中间累计读数
  ctx.textAlign = 'center';
  var done = SIM.step >= 4;
  var per = 2 * (L + W);
  if (SIM.step === 0) {
    ctx.font = 'bold 22px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = '#7A8B78';
    ctx.fillText('点「沿边走一步」，从一条边出发', (x0 + x1) / 2, (y0 + y1) / 2 - 4);
    ctx.font = '18px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillText('周长 = 沿边一圈的长度', (x0 + x1) / 2, (y0 + y1) / 2 + 26);
  } else if (!done) {
    ctx.font = 'bold 20px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = '#FB8C00';
    ctx.fillText('已走 ' + SIM.step + ' 条边，共 ' + simAccum(SIM.step) + ' 厘米', (x0 + x1) / 2, (y0 + y1) / 2 - 4);
    ctx.font = '18px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = '#7A8B78';
    ctx.fillText('还剩 ' + (4 - SIM.step) + ' 条边', (x0 + x1) / 2, (y0 + y1) / 2 + 26);
  } else {
    ctx.font = 'bold 26px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = '#2E7D32';
    ctx.fillText('周长 = ' + per + ' 厘米', (x0 + x1) / 2, (y0 + y1) / 2 - 2);
    ctx.font = '17px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = '#00695C';
    ctx.fillText(simIsSquare() ? ('边长×4 = ' + L + '×4') : ('(长+宽)×2 = (' + L + '+' + W + ')×2'), (x0 + x1) / 2, (y0 + y1) / 2 + 28);
  }

  simReadout();
}

function simReadout() {
  var el = document.getElementById('simReadout');
  if (!el) return;
  var L = SIM.L, W = SIM.W, per = 2 * (L + W);
  if (SIM.step === 0) {
    el.textContent = '准备：' + (simIsSquare() ? ('边长 ' + L + ' 厘米') : ('长 ' + L + ' 厘米，宽 ' + W + ' 厘米'));
  } else if (SIM.step >= 4) {
    el.textContent = '完成：周长 = ' + per + ' 厘米' + (simIsSquare() ? ('（' + L + '×4）') : ('（(' + L + '+' + W + ')×2）'));
  } else {
    el.textContent = '已走 ' + SIM.step + ' 条边：共 ' + simAccum(SIM.step) + ' 厘米';
  }
  var tip = document.getElementById('simTip');
  if (!tip) return;
  if (SIM.step === 0) tip.textContent = '点「沿边走一步」，看四条边依次加进来';
  else if (SIM.step >= 4) tip.textContent = simIsSquare() ? '四条边一样长，所以能写成 边长×4' : '长走了 2 次、宽走了 2 次，就是 (长+宽)×2';
  else tip.textContent = '还剩 ' + (4 - SIM.step) + ' 条边，别只加两条';
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

function simWalkOne() {
  var i = SIM.step; // 0..3
  var s = SIDES[i];
  var len = (s.dim === 'L' ? SIM.L : SIM.W);
  SIM.step++;
  var sum = simAccum(SIM.step);
  var desc = '第 ' + (i + 1) + ' 条边（' + s.name + '，' + (simIsSquare() ? '边长' : (s.dim === 'L' ? '长' : '宽')) + '）+' + len + ' → 共 ' + sum + ' 厘米';
  simLog(desc, SIM.step === 4);
  simDraw();
}

function simNext() {
  if (SIM.busy) return;
  if (SIM.step >= 4) { simLog('四条边都走完啦，点「重置」再走一遍～'); simDraw(); return; }
  simWalkOne();
}

function simDemo() {
  if (SIM.busy) return;
  SIM.busy = true;
  SIM.step = 0; SIM.log = [];
  simLog('演示：沿边走一圈，从上面这条边出发', true);
  simDraw();
  var timer = setInterval(function () {
    if (SIM.step >= 4) {
      clearInterval(timer);
      simLog('走满一圈：周长 = ' + (2 * (SIM.L + SIM.W)) + ' 厘米', true);
      SIM.busy = false;
      simDraw();
      return;
    }
    simWalkOne();
  }, 850);
}

function simLonger() {
  if (SIM.busy) return;
  if (SIM.L >= 10) { simLog('长最多 10 厘米，先重置吧'); simDraw(); return; }
  SIM.L++; SIM.step = 0;
  simLog('长 +1 → 长 ' + SIM.L + '、宽 ' + SIM.W + '，周长会多 2 厘米', true);
  simDraw();
}

function simWider() {
  if (SIM.busy) return;
  if (SIM.W >= 7) { simLog('宽最多 7 厘米，先重置吧'); simDraw(); return; }
  SIM.W++; SIM.step = 0;
  simLog('宽 +1 → 长 ' + SIM.L + '、宽 ' + SIM.W + '，周长会多 2 厘米', true);
  simDraw();
}

function simSquare() {
  if (SIM.busy) return;
  SIM.W = SIM.L; SIM.step = 0;
  simLog('变成正方形：四条边都 ' + SIM.L + ' 厘米，周长 = ' + SIM.L + '×4 = ' + (4 * SIM.L), true);
  simDraw();
}

function simReset() {
  if (SIM.busy) return;
  SIM.L = 6; SIM.W = 4; SIM.step = 0; SIM.log = [];
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('已重置：长 6 厘米，宽 4 厘米');
  simDraw();
}

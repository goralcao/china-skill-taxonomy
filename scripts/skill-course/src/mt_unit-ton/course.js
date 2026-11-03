// ===== 引入页：答案卡「他错在哪 / 为什么对」 =====
function toggleAns(btn) {
  var card = btn.closest('.ans-card');
  if (!card) return;
  card.classList.toggle('open');
  btn.textContent = card.classList.contains('open')
    ? (card.querySelector('.ans-why').textContent.indexOf('差了') >= 0 ? '收起' : '收起')
    : (card.querySelector('.ans-num').textContent.indexOf('≈') >= 0 ? '为什么对' : '他错在哪');
}

// ===== 仿真：质量液位桶（每桶 1000 kg，满桶即 1 吨）=====
var SIM_W = 860, SIM_H = 332;
var OBJ = { cow: 500, rice: 25, kid: 30 };                       // 每种物体的质量（kg）
var NAME = { cow: '1 头牛', rice: '1 袋米', kid: '1 个学生' };
var SIM = { mass: 0, busy: false, log: [] };
var CAP = 1000;                                                  // 每桶容量 = 1 吨

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  var bx = 250, bw = 360, baseY = 270, topY = 70;
  var nBuckets = Math.max(1, Math.ceil(SIM.mass / CAP));
  nBuckets = Math.min(nBuckets, 5);
  var gapC = 26;
  var bucketW = (bw - (nBuckets - 1) * gapC) / nBuckets;

  for (var b = 0; b < nBuckets; b++) {
    var fillMass = (b < nBuckets - 1) ? CAP : (SIM.mass - b * CAP);
    if (fillMass > CAP) fillMass = CAP;
    if (fillMass < 0) fillMass = 0;
    var frac = fillMass / CAP;
    var x = bx + b * (bucketW + gapC);
    var full = fillMass >= CAP - 0.001;

    // 桶外框
    ctx.strokeStyle = '#1B5E20';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, topY, bucketW, baseY - topY);

    // 填充（液面）
    var fh = frac * (baseY - topY);
    ctx.fillStyle = full ? '#F9A825' : '#43A047';
    ctx.fillRect(x + 3, baseY - fh, bucketW - 6, fh);

    // 1 吨刻度线（桶顶）
    if (b === 0) {
      ctx.strokeStyle = '#F9A825';
      ctx.setLineDash([8, 6]);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(bx - 14, topY);
      ctx.lineTo(bx + bw + 14, topY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#F9A825';
      ctx.font = 'bold 15px "Microsoft YaHei","Noto Sans SC",sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('1 吨 = 1000 kg', bx + bw + 12, topY - 8);
    }

    // 桶标签
    ctx.fillStyle = '#5B7A55';
    ctx.font = '14px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.textAlign = 'center';
    if (full) {
      ctx.fillStyle = '#F9A825';
      ctx.font = 'bold 15px "Microsoft YaHei",sans-serif';
      ctx.fillText('✔ ' + (b + 1) + ' 吨', x + bucketW / 2, baseY + 22);
    } else {
      ctx.fillText((b + 1) + ' 吨', x + bucketW / 2, baseY + 22);
    }
  }

  simReadout();
}

function simReadout() {
  var el = document.getElementById('simReadout');
  if (el) el.textContent = SIM.mass + ' kg';
  var tip = document.getElementById('simTip');
  if (!tip) return;
  if (SIM.mass === 0) {
    tip.textContent = '地磅是空的';
  } else if (SIM.mass % CAP === 0) {
    tip.textContent = '🎉 正好 ' + (SIM.mass / CAP) + ' 吨！';
  } else if (SIM.mass < CAP) {
    var left = CAP - SIM.mass;
    tip.textContent = '还差 ' + left + ' kg 到 1 吨（≈ ' + Math.ceil(left / 25) + ' 袋米）';
  } else {
    var rem = CAP - (SIM.mass % CAP);
    tip.textContent = '已过 1 吨，再攒 ' + rem + ' kg 满下一吨';
  }
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

function simAdd(kind, n) {
  if (SIM.busy) return;
  for (var k = 0; k < n; k++) {
    SIM.mass += OBJ[kind];
    simLog('+ ' + OBJ[kind] + ' kg（' + NAME[kind] + '） → 累计 ' + SIM.mass + ' kg');
  }
  simReadout();
  simDraw();
}

function simSub(kind, n) {
  if (SIM.busy) return;
  for (var k = 0; k < n; k++) {
    if (SIM.mass <= 0) break;
    SIM.mass = Math.max(0, SIM.mass - OBJ[kind]);
    simLog('− ' + OBJ[kind] + ' kg（' + NAME[kind] + '） → 累计 ' + SIM.mass + ' kg');
  }
  simReadout();
  simDraw();
}

function simDemo() {
  if (SIM.busy) return;
  SIM.busy = true;
  SIM.mass = 0; SIM.log = [];
  simReadout(); simDraw();
  simLog('演示：40 袋大米（每袋 25 kg）怎么凑成 1 吨', true);
  var i = 0;
  var timer = setInterval(function () {
    for (var k = 0; k < 4 && i < 40; k++) { SIM.mass += OBJ.rice; i++; }
    simReadout(); simDraw();
    if (i >= 40) {
      clearInterval(timer);
      simLog('25 × 40 = 1000 kg = 1 吨！第 1 桶满了，变金色', true);
      simLog('（换成 2 头牛：500 × 2，也是 1 吨）');
      SIM.busy = false;
    }
  }, 360);
}

function simReset() {
  if (SIM.busy) return;
  SIM.mass = 0; SIM.log = [];
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simReadout(); simDraw();
}

// ===== 引入页：答案卡「他错在哪」（防御性，本课文未直接调用）=====
function toggleAns(btn) {
  var card = btn && btn.closest ? btn.closest('.ans-card') : null;
  if (!card) return;
  card.classList.toggle('open');
  btn.textContent = card.classList.contains('open') ? '收起' : '他错在哪';
}

// ===== 仿真：竖式步进器（从个位起，一位一位乘，进位接住）=====
var SIM_W = 860, SIM_H = 332;
var PLACE = ['个位', '十位', '百位', '千位', '万位', '十万位'];
var SIM = { a: 208, b: 4, step: 0, plan: null, busy: false, log: [] };

// 预先算好每一步：进位 / 写下的数字 / 最终积
function computePlan(a, b) {
  var digits = String(a).split('').map(Number); // 左→右
  var cols = digits.length;
  var carryIn = [], carryOut = [], write = [], dAt = [];
  var c = 0;
  for (var r = 0; r < cols; r++) {
    var d = digits[cols - 1 - r]; // 右起第 r 位
    var p = d * b + c;
    carryIn[r] = c;
    write[r] = p % 10;
    c = Math.floor(p / 10);
    carryOut[r] = c;
    dAt[r] = d;
  }
  return { digits: digits, cols: cols, carryIn: carryIn, carryOut: carryOut, write: write, dAt: dAt, lead: c, product: a * b };
}

function simSetup(a, b) {
  SIM.a = a; SIM.b = b; SIM.step = 0; SIM.plan = computePlan(a, b);
}

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  if (!SIM.plan) simSetup(SIM.a, SIM.b);
  var plan = SIM.plan;
  var cols = plan.cols;
  var cellW = 62;
  var blockW = cols * cellW;
  var blockRight = SIM_W / 2 + blockW / 2;
  var blockLeft = blockRight - blockW;
  var colCenterX = function (r) { return blockRight - cellW / 2 - r * cellW; };

  var yCarry = 56, yNum = 112, yLine = 146, yProd = 202;

  // 乘数 × b（写在数的右侧同一行）
  ctx.font = 'bold 30px "Courier New",monospace';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FF6F00';
  ctx.fillText('× ' + SIM.b, blockRight + 18, yNum + 10);

  // 上层被乘数
  ctx.font = 'bold 34px "Courier New",monospace';
  ctx.textAlign = 'center';
  for (var i = 0; i < cols; i++) {
    var r = cols - 1 - i; // 左→右转为右起索引
    var x = colCenterX(r);
    // 当前正在算的那一位，画个浅橙高亮框
    if (SIM.step < cols && SIM.step === r) {
      ctx.fillStyle = 'rgba(255,111,0,0.14)';
      ctx.fillRect(x - cellW / 2 + 4, yNum - 32, cellW - 8, 46);
    }
    ctx.fillStyle = '#006064';
    ctx.fillText(String(plan.digits[i]), x, yNum + 10);
  }

  // 进位小字（红），写在它要进到的那一位上方
  ctx.font = 'bold 18px "Courier New",monospace';
  for (var r2 = 0; r2 < cols - 1; r2++) {
    if (SIM.step > r2 && plan.carryOut[r2] > 0) {
      ctx.fillStyle = '#C62828';
      ctx.fillText(String(plan.carryOut[r2]), colCenterX(r2 + 1), yCarry + 8);
    }
  }

  // 横线（若最终积多一位，向左延伸一格）
  var lineLeft = plan.lead > 0 ? blockLeft - cellW : blockLeft;
  ctx.strokeStyle = '#37474F';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(lineLeft - 10, yLine);
  ctx.lineTo(blockRight + 10, yLine);
  ctx.stroke();

  // 下层积
  ctx.font = 'bold 34px "Courier New",monospace';
  ctx.textAlign = 'center';
  for (var r3 = 0; r3 < cols; r3++) {
    if (SIM.step > r3) {
      ctx.fillStyle = '#006064';
      ctx.fillText(String(plan.write[r3]), colCenterX(r3), yProd + 10);
    }
  }
  if (plan.lead > 0 && SIM.step >= cols) {
    ctx.fillStyle = '#006064';
    ctx.fillText(String(plan.lead), colCenterX(cols), yProd + 10);
  }

  simReadout();
}

function simReadout() {
  var el = document.getElementById('simReadout');
  if (!el) return;
  if (!SIM.plan) simSetup(SIM.a, SIM.b);
  if (SIM.step === 0) {
    el.textContent = '准备：' + SIM.a + ' × ' + SIM.b;
  } else if (SIM.step >= SIM.plan.cols) {
    el.textContent = '完成：' + SIM.a + ' × ' + SIM.b + ' = ' + SIM.plan.product;
  } else {
    el.textContent = '算到：' + SIM.a + ' × ' + SIM.b + '（已算 ' + SIM.step + ' 位）';
  }
  var tip = document.getElementById('simTip');
  if (!tip) return;
  if (SIM.step === 0) tip.textContent = '点「下一步」逐位算，注意进位';
  else if (SIM.step >= SIM.plan.cols) tip.textContent = '看！中间的 0 也乘了、进位也接住了';
  else tip.textContent = '正在算第 ' + (SIM.step + 1) + ' 位，进位的小红字写在它左边';
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

// 算一位：描述 + 推进 step + 重绘
function simComputeOne() {
  var r = SIM.step;
  var plan = SIM.plan;
  var ci = plan.carryIn[r], d = plan.dAt[r], p = d * SIM.b + ci, w = p % 10, co = Math.floor(p / 10);
  SIM.step++;
  var place = PLACE[r] || ('第' + (r + 1) + '位');
  var desc = '第 ' + place + '：' + d + ' × ' + SIM.b;
  if (ci > 0) desc += ' + 进位 ' + ci;
  desc += ' = ' + p + '，写 ' + w;
  if (co > 0) desc += '，进 ' + co;
  simLog(desc, SIM.step === 1 || r === plan.cols - 1);
  simDraw();
}

function simStep() {
  if (SIM.busy) return;
  if (!SIM.plan) simSetup(SIM.a, SIM.b);
  if (SIM.step >= SIM.plan.cols) {
    simLog('已经是最后一步啦，点「重置」再算一遍～');
    simDraw();
    return;
  }
  simComputeOne();
}

function simPrev() {
  if (SIM.busy) return;
  if (SIM.step <= 0) { simLog('已经退到最前啦'); simDraw(); return; }
  SIM.step--;
  simDraw();
}

function simDemo(a, b) {
  if (SIM.busy) return;
  SIM.busy = true;
  simSetup(a, b); SIM.log = [];
  simLog('演示：' + a + ' × ' + b + ' —— 从个位开始一位一位乘', true);
  simDraw();
  var timer = setInterval(function () {
    if (SIM.step >= SIM.plan.cols) {
      clearInterval(timer);
      simLog(a + ' × ' + b + ' = ' + SIM.plan.product + '，全部算完！', true);
      SIM.busy = false;
      simDraw();
      return;
    }
    simComputeOne();
  }, 950);
}

function simReset() {
  if (SIM.busy) return;
  simSetup(208, 4); SIM.log = [];
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('已重置：准备算 208 × 4');
  simDraw();
}

// ===== 引入页：答案卡「他错在哪」（防御性，本课文未直接调用）=====
function toggleAns(btn) {
  var card = btn && btn.closest ? btn.closest('.ans-card') : null;
  if (!card) return;
  card.classList.toggle('open');
  btn.textContent = card.classList.contains('open') ? '收起' : '他错在哪';
}

// ===== 仿真：竖式除法步进器（从高位起，逐位除）=====
var SIM_W = 860, SIM_H = 332;
var SIM = { a: 84, b: 4, step: 0, plan: null, busy: false, log: [] };

function divPlan(a, b) {
  var digits = String(a).split('').map(Number); // 左→右
  var len = digits.length;
  var rem = 0, qdigits = [], rems = [], curs = [];
  for (var i = 0; i < len; i++) {
    var cur = rem * 10 + digits[i];
    var q = Math.floor(cur / b);
    rem = cur % b;
    curs.push(cur); qdigits.push(q); rems.push(rem);
  }
  // 前导 0（如 24÷4 的最高位商 0）不画出来
  var lead = 0;
  while (lead < len - 1 && qdigits[lead] === 0) lead++;
  return {
    digits: digits, len: len, qdigits: qdigits, rems: rems, curs: curs,
    lead: lead, quotient: Math.floor(a / b), remainder: a % b
  };
}

function simSetup(a, b) { SIM.a = a; SIM.b = b; SIM.step = 0; SIM.plan = divPlan(a, b); }

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  if (!SIM.plan) simSetup(SIM.a, SIM.b);
  var plan = SIM.plan, len = plan.len, b = SIM.b;
  var cellW = 52;
  var startX = 300; // 被除数第一个数字的中心
  var colX = function (i) { return startX + i * cellW; };
  var endX = colX(len - 1) + cellW / 2 + 10;

  // 除数
  ctx.textAlign = 'right';
  ctx.font = 'bold 34px "Courier New",monospace';
  ctx.fillStyle = '#EF6C00';
  ctx.fillText(String(b), 262, 190);

  // 竖线 + 横线（除号框）
  ctx.strokeStyle = '#00796B';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(278, 120); ctx.lineTo(278, 205); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(278, 150); ctx.lineTo(endX, 150); ctx.stroke();

  // 被除数
  ctx.textAlign = 'center';
  ctx.font = 'bold 34px "Courier New",monospace';
  for (var i = 0; i < len; i++) {
    // 当前正在算的那一位，浅橙高亮
    if (SIM.step < len && SIM.step === i) {
      ctx.fillStyle = 'rgba(239,108,0,0.14)';
      ctx.fillRect(colX(i) - cellW / 2 + 4, 158, cellW - 8, 42);
    }
    ctx.fillStyle = '#00796B';
    ctx.fillText(String(plan.digits[i]), colX(i), 190);
  }

  // 商（逐位出现，前导 0 不画）
  for (var j = 0; j < len; j++) {
    if (SIM.step > j && j >= plan.lead) {
      ctx.fillStyle = '#C62828';
      ctx.fillText(String(plan.qdigits[j]), colX(j), 140);
    }
  }

  // 每一步的余数（下面一行）
  ctx.textAlign = 'left';
  ctx.font = '17px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#00695C';
  var lastRem = SIM.step > 0 ? plan.rems[SIM.step - 1] : null;
  var remTxt = '当前余数：' + (lastRem === null ? '—' : lastRem);
  ctx.fillText(remTxt, 90, 250);

  // 已完成的总商/余数
  if (SIM.step >= len) {
    ctx.textAlign = 'center';
    ctx.font = 'bold 24px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = '#00796B';
    var tail = plan.remainder > 0 ? (' 余 ' + plan.remainder) : '';
    ctx.fillText(SIM.a + ' ÷ ' + b + ' = ' + plan.quotient + tail, 430, 300);
  }

  simReadout();
}

function simReadout() {
  var el = document.getElementById('simReadout');
  if (!el) return;
  if (!SIM.plan) simSetup(SIM.a, SIM.b);
  var plan = SIM.plan;
  if (SIM.step === 0) {
    el.textContent = '准备：' + SIM.a + ' ÷ ' + SIM.b;
  } else if (SIM.step >= plan.len) {
    var tail = plan.remainder > 0 ? (' 余 ' + plan.remainder) : '';
    el.textContent = '完成：' + SIM.a + ' ÷ ' + SIM.b + ' = ' + plan.quotient + tail;
  } else {
    el.textContent = '已除 ' + SIM.step + ' 位，当前余数 ' + plan.rems[SIM.step - 1];
  }
  var tip = document.getElementById('simTip');
  if (!tip) return;
  if (SIM.step === 0) tip.textContent = '从最高位除起，商写在对齐的那一位';
  else if (SIM.step >= plan.len) tip.textContent = '验算：商×除数+余数，能不能回到 ' + SIM.a;
  else tip.textContent = '余数必须比除数 ' + SIM.b + ' 小';
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

function simStepOne() {
  var r = SIM.step;
  var plan = SIM.plan;
  var cur = plan.curs[r], q = plan.qdigits[r], rem = plan.rems[r];
  SIM.step++;
  var desc = '第 ' + (r + 1) + ' 位：' + cur + ' ÷ ' + SIM.b + ' = ' + q;
  if (rem > 0) desc += ' 余 ' + rem;
  else desc += '，正好除尽';
  simLog(desc, SIM.step === 1 || r === plan.len - 1);
  simDraw();
}

function simStep() {
  if (SIM.busy) return;
  if (!SIM.plan) simSetup(SIM.a, SIM.b);
  if (SIM.step >= SIM.plan.len) { simLog('已经除完啦，点「重置」再算一遍～'); simDraw(); return; }
  simStepOne();
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
  simLog('演示：' + a + ' ÷ ' + b + ' —— 从最高位一位一位除', true);
  simDraw();
  var timer = setInterval(function () {
    if (SIM.step >= SIM.plan.len) {
      clearInterval(timer);
      var tail = SIM.plan.remainder > 0 ? (' 余 ' + SIM.plan.remainder) : '';
      simLog(a + ' ÷ ' + b + ' = ' + SIM.plan.quotient + tail, true);
      SIM.busy = false;
      simDraw();
      return;
    }
    simStepOne();
  }, 900);
}

function simReset() {
  if (SIM.busy) return;
  simSetup(84, 4); SIM.log = [];
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('已重置：准备算 84 ÷ 4');
  simDraw();
}

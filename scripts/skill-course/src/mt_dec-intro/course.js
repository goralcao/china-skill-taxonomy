// ===== 引入页：答案卡「他错在哪」（防御性，本课文未直接调用）=====
function toggleAns(btn) {
  var card = btn && btn.closest ? btn.closest('.ans-card') : null;
  if (!card) return;
  card.classList.toggle('open');
  btn.textContent = card.classList.contains('open') ? '收起' : '他错在哪';
}

// ===== 仿真：十格条（涂几格 = 零点几）=====
var SIM_W = 860, SIM_H = 332;
var SIM = { n: 3, busy: false, log: [] };
var CN = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

function simDec() {
  return SIM.n >= 10 ? '1.0' : '0.' + SIM.n;
}

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  var n = SIM.n;
  var x0 = 70, y0 = 74, cellW = 72, bh = 88;

  // 标题
  ctx.textAlign = 'center';
  ctx.font = 'bold 23px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#6A1B9A';
  ctx.fillText('1 条纸分成 10 格，涂了 ' + n + ' 格', SIM_W / 2, 36);

  // 十格条
  for (var i = 0; i < 10; i++) {
    var x = x0 + i * cellW;
    var on = i < n;
    ctx.fillStyle = on ? '#00ACC1' : '#F2EAF8';
    ctx.fillRect(x, y0, cellW, bh);
    ctx.strokeStyle = '#6A1B9A';
    ctx.lineWidth = 1.4;
    ctx.strokeRect(x, y0, cellW, bh);

    ctx.textAlign = 'center';
    ctx.font = 'bold 20px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = on ? '#FFFFFF' : '#B39DCC';
    ctx.fillText(String(i + 1), x + cellW / 2, y0 + bh / 2 + 7);

    ctx.font = '13px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = on ? 'rgba(255,255,255,.9)' : '#C6B6D8';
    ctx.fillText('0.1', x + cellW / 2, y0 + bh - 10);
  }
  ctx.strokeStyle = '#6A1B9A';
  ctx.lineWidth = 2.6;
  ctx.strokeRect(x0, y0, cellW * 10, bh);

  // 左侧：分数写法
  var fx = 150, fy = 232;
  ctx.textAlign = 'center';
  ctx.font = '14px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#8E6BA8';
  ctx.fillText('分数', fx, fy - 46);
  ctx.font = 'bold 34px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#6A1B9A';
  ctx.fillText(String(n), fx, fy - 8);
  ctx.strokeStyle = '#6A1B9A';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(fx - 30, fy + 2);
  ctx.lineTo(fx + 30, fy + 2);
  ctx.stroke();
  ctx.fillText('10', fx, fy + 40);
  ctx.font = '14px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#8E6BA8';
  ctx.fillText(n === 10 ? '十分之十' : '十分之' + CN[n], fx, fy + 66);

  // 中间：等号 + 小数写法
  ctx.font = 'bold 30px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#4A2C63';
  ctx.fillText('=', 260, fy + 6);

  ctx.font = '14px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#00838F';
  ctx.fillText('小数', 360, fy - 46);
  ctx.font = 'bold 42px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillText(simDec(), 360, fy + 12);
  ctx.font = '14px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#00838F';
  ctx.fillText(n >= 10 ? '就是一' : '零点' + CN[n], 360, fy + 46);

  // 右侧：数位表
  var bx = 536, by = 200, bw = 104, bhh = 58;
  var intPart = n >= 10 ? '1' : '0';
  var tenth = n >= 10 ? '0' : String(n);
  [[bx, '整数部分', intPart], [bx + bw + 30, '十分位', tenth]].forEach(function (c) {
    ctx.textAlign = 'center';
    ctx.font = '13px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = '#8E6BA8';
    ctx.fillText(c[1], c[0] + bw / 2, by - 10);
    ctx.fillStyle = '#F7F1FC';
    ctx.fillRect(c[0], by, bw, bhh);
    ctx.strokeStyle = '#C9B0DC';
    ctx.lineWidth = 1.4;
    ctx.strokeRect(c[0], by, bw, bhh);
    ctx.font = 'bold 30px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = '#6A1B9A';
    ctx.fillText(c[2], c[0] + bw / 2, by + bhh / 2 + 11);
  });
  ctx.font = '13px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#8E6BA8';
  ctx.textAlign = 'center';
  ctx.fillText('小数点', bx + bw + 15, by + bhh + 18);

  // 底部提示
  ctx.font = '15px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#6A1B9A';
  ctx.fillText(n >= 10 ? '10 个 0.1 合起来正好是 1，整数部分变 1、十分位归 0' : '还差 ' + (10 - n) + ' 格就满 1', SIM_W / 2, 316);

  simReadout();
}

function simReadout() {
  var n = SIM.n;
  var el = document.getElementById('simReadout');
  if (el) {
    if (n === 0) el.textContent = '0 = 一格都没涂';
    else if (n >= 10) el.textContent = '1.0 = 十分之十，10 个 0.1 合起来就是 1';
    else el.textContent = simDec() + ' = 十分之' + CN[n] + '，' + n + ' 个 0.1';
  }
  var tip = document.getElementById('simTip');
  if (!tip) return;
  if (n === 0) tip.textContent = '一格都没涂，那就是 0';
  else if (n >= 10) tip.textContent = '涂满了：10 个 0.1 就是 1';
  else tip.textContent = '再涂 ' + (10 - n) + ' 格就满 1 了';
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

function simSet(v) {
  var before = SIM.n;
  SIM.n = Math.max(0, Math.min(10, v));
  if (SIM.n === before) return;
  if (SIM.n === 10) simLog('涂满 10 格：10 个 0.1 = 1', true);
  else if (SIM.n === 0) simLog('一格都没涂：就是 0', true);
  else simLog('涂 ' + SIM.n + ' 格 → ' + simDec(), false);
  simDraw();
}

function simPlus() { if (!SIM.busy) simSet(SIM.n + 1); }
function simMinus() { if (!SIM.busy) simSet(SIM.n - 1); }

function simFill5() {
  if (SIM.busy) return;
  simSet(5);
  simLog('涂 5 格：0.5 = 十分之五，也就是 5 角（0.5 元）', true);
}

function simFill10() {
  if (SIM.busy) return;
  simSet(10);
}

function simClear() {
  if (SIM.busy) return;
  SIM.n = 0; SIM.log = [];
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('清零：一格都没涂');
  simDraw();
}

function simReset() {
  if (SIM.busy) return;
  SIM.n = 3; SIM.log = [];
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('已重置：涂 3 格 = 0.3');
  simDraw();
}

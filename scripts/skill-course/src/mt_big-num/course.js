// ===== 仿真：数位表拨珠（12 位 / 三级）=====
var SIM_W = 880, SIM_H = 360;
var SIM = { digits: [], busy: false, log: [] };

// digits[0] = 个位 …… digits[11] = 千亿位
var DIGIT_NAMES = ['个', '十', '百', '千'];
var GROUP_NAMES = ['', '万', '亿'];
var CN_NUM = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

function simInit() {
  if (SIM.digits.length) return;
  SIM.digits = [];
  for (var i = 0; i < 12; i++) SIM.digits.push(0);
  SIM.digits[5] = 8;   // 默认八十万
}

// 一组四位的读法（arr 低位在前：个、十、百、千）
function groupRead(arr) {
  var out = '', zeroPending = false, started = false;
  for (var i = 3; i >= 0; i--) {
    var v = arr[i];
    if (v === 0) { if (started) zeroPending = true; continue; }
    if (zeroPending) { out += '零'; zeroPending = false; }
    out += CN_NUM[v] + (i === 0 ? '' : DIGIT_NAMES[i]);
    started = true;
  }
  // 中文习惯：开头的「一十」读作「十」（十二亿，不是一十二亿）
  return out.replace(/^一十/, '十');
}

function readBigNum(digits) {
  var parts = [], needZero = false;
  for (var g = 2; g >= 0; g--) {
    var arr = [digits[g * 4], digits[g * 4 + 1], digits[g * 4 + 2], digits[g * 4 + 3]];
    var allZero = arr[0] + arr[1] + arr[2] + arr[3] === 0;
    if (allZero) { if (parts.length) needZero = true; continue; }
    if (parts.length && arr[3] === 0) needZero = true;
    if (needZero) { parts.push('零'); needZero = false; }
    parts.push(groupRead(arr) + GROUP_NAMES[g]);
  }
  return parts.length ? parts.join('') : '零';
}

function writeBigNum(digits) {
  var s = digits.slice().reverse().join('').replace(/^0+/, '') || '0';
  var out = [];
  while (s.length > 4) { out.unshift(s.slice(-4)); s = s.slice(0, -4); }
  out.unshift(s);
  return out.join(' ');
}

function simDraw() {
  simInit();
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  var colW = 64, gap = 6, x0 = 30;
  var groupColor = ['#E8F5E9', '#FFF8E1', '#FFEBEE'];
  var groupEdge = ['#A5D6A7', '#FFE082', '#FFCDD2'];
  var groupText = ['#2E7D32', '#EF6C00', '#C62828'];

  for (var i = 0; i < 12; i++) {
    var g = Math.floor(i / 4);
    var posInGroup = i % 4;
    var x = x0 + i * (colW + gap) + g * 6;

    // 组底色
    ctx.fillStyle = groupColor[g];
    ctx.fillRect(x, 34, colW, 176);
    ctx.strokeStyle = groupEdge[g];
    ctx.lineWidth = 1.4;
    ctx.strokeRect(x, 34, colW, 176);

    // 位名
    ctx.textAlign = 'center';
    ctx.font = '13px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = groupText[g];
    ctx.fillText(DIGIT_NAMES[posInGroup], x + colW / 2, 26);

    // ＋ 按钮
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = groupText[g];
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(x + 12, 42, colW - 24, 26, 6);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = groupText[g];
    ctx.font = 'bold 17px monospace';
    ctx.fillText('+', x + colW / 2, 61);

    // 数字
    var v = SIM.digits[i];
    ctx.font = 'bold 40px monospace';
    ctx.fillStyle = v === 0 ? '#8C9B7C' : '#1B5E20';
    ctx.fillText(String(v), x + colW / 2, 128);

    // － 按钮
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = groupText[g];
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(x + 12, 142, colW - 24, 26, 6);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = groupText[g];
    ctx.font = 'bold 17px monospace';
    ctx.fillText('−', x + colW / 2, 161);

    // 组名（最低位那列标）
    if (posInGroup === 0) {
      ctx.font = '12px "Microsoft YaHei","Noto Sans SC",sans-serif';
      ctx.fillStyle = groupText[g];
      ctx.fillText(GROUP_NAMES[g] ? GROUP_NAMES[g] + '级' : '个级', x + colW / 2, 200);
    }
  }

  // 写法
  ctx.textAlign = 'center';
  ctx.font = '13px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#6B7A5E';
  ctx.fillText('数字写法（每四位一组）', SIM_W / 2, 228);
  ctx.font = 'bold 24px monospace';
  ctx.fillStyle = '#1B5E20';
  ctx.fillText(writeBigNum(SIM.digits), SIM_W / 2, 258);

  // 读法
  ctx.font = '13px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#6B7A5E';
  ctx.fillText('读作', SIM_W / 2, 286);
  ctx.font = 'bold 30px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#EF6C00';
  ctx.fillText(readBigNum(SIM.digits), SIM_W / 2, 324);

  simReadout();
}

function simReadout() {
  var el = document.getElementById('simReadout');
  if (el) el.textContent = '读作：' + readBigNum(SIM.digits);
  var tip = document.getElementById('simTip');
  if (!tip) return;
  var t = writeBigNum(SIM.digits);
  var zeros = (t.match(/0/g) || []).length;
  tip.textContent = '写法 ' + t + '　共 ' + (t.replace(/ /g, '').length) + ' 位，含 ' + zeros + ' 个 0';
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

function simDigit(idx, delta) {
  if (SIM.busy) return;
  if (idx < 0 || idx > 11) return;
  var before = SIM.digits[idx];
  SIM.digits[idx] = (before + delta + 10) % 10;
  var name = (GROUP_NAMES[Math.floor(idx / 4)] || '') + DIGIT_NAMES[idx % 4] + '位';
  simLog(name + '：' + before + ' → ' + SIM.digits[idx] + '，读作 ' + readBigNum(SIM.digits), true);
  simDraw();
}

function simClear() {
  if (SIM.busy) return;
  for (var i = 0; i < 12; i++) SIM.digits[i] = 0;
  simLog('全部归零，读作零', true);
  simDraw();
}

function simDemo() {
  if (SIM.busy) return;
  simClear();
  SIM.digits[5] = 8;
  simLog('八十万 = 80 个万：万级写 80，个级四个 0', true);
  simDraw();
}

function simDemo2() {
  if (SIM.busy) return;
  simClear();
  SIM.digits[6] = 1; SIM.digits[3] = 2; SIM.digits[0] = 3;
  simLog('1002003：中间两个 0 只读一个「零」', true);
  simDraw();
}

function simReset() {
  if (SIM.busy) return;
  for (var i = 0; i < 12; i++) SIM.digits[i] = 0;
  SIM.digits[5] = 8;
  SIM.log = [];
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('已重置：八十万');
  simDraw();
}

// 点击画布：上半区加 1，下半区减 1
(function () {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  cv.addEventListener('click', function (e) {
    var r = cv.getBoundingClientRect();
    var x = (e.clientX - r.left) * cv.width / r.width;
    var y = (e.clientY - r.top) * cv.height / r.height;
    if (y < 34 || y > 186) return;
    var colW = 64, gap = 6, x0 = 30, idx = -1;
    for (var i = 0; i < 12; i++) {
      var g = Math.floor(i / 4);
      var cx = x0 + i * (colW + gap) + g * 6;
      if (x >= cx && x <= cx + colW) { idx = i; break; }
    }
    if (idx < 0) return;
    simDigit(idx, y < 78 ? 1 : -1);
  });
})();

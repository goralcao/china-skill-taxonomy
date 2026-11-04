// ===== 仿真：竖式除法步进器（试商高亮） =====
var SIM_W = 880, SIM_H = 380;
var SIM = { caseIdx: 0, i: 0, log: [] };

var SIM_CASES = [
  {
    a: 192, b: 24, est: 20, estWord: '四舍',
    steps: [
      { q: 0, mul: false, rem: null, tone: 'idle',
        head: '① 先看除数，估个数',
        lines: ['24 的个位是 4，够不上 5', '按「四舍」看成整十数 20'],
        log: '192 ÷ 24：把 24 看成 20' },
      { q: 9, mul: false, rem: null, tone: 'trial',
        head: '② 试商 9',
        lines: ['192 里有几个 20？', '192 ÷ 20 大约商 9'],
        log: '试商 9（橙色框里那个数）' },
      { q: 9, mul: true, rem: null, tone: 'bad',
        head: '③ 乘回去：装不下',
        lines: ['9 × 24 = 216', '216 比 192 大，商 9 大了'],
        log: '9 × 24 = 216 > 192，商大了' },
      { q: 8, mul: false, rem: null, tone: 'trial',
        head: '④ 往小调一格：改 8',
        lines: ['9 减 1 得 8', '再乘回去验一次'],
        log: '调商：9 → 8' },
      { q: 8, mul: true, rem: null, tone: 'trial',
        head: '⑤ 再乘一次',
        lines: ['8 × 24 = 192', '正好等于被除数'],
        log: '8 × 24 = 192，正好' },
      { q: 8, mul: true, rem: 0, tone: 'ok',
        head: '⑥ 成立',
        lines: ['192 ÷ 24 = 8', '余 0，比 24 小 ✓'],
        log: '结果：192 ÷ 24 = 8' }
    ]
  },
  {
    a: 197, b: 28, est: 30, estWord: '五入',
    steps: [
      { q: 0, mul: false, rem: null, tone: 'idle',
        head: '① 先看除数，估个数',
        lines: ['28 的个位是 8，够上 5 了', '按「五入」看成整十数 30'],
        log: '197 ÷ 28：把 28 看成 30' },
      { q: 6, mul: false, rem: null, tone: 'trial',
        head: '② 试商 6',
        lines: ['197 ÷ 30 大约商 6', '先写个 6 试试'],
        log: '试商 6' },
      { q: 6, mul: true, rem: null, tone: 'trial',
        head: '③ 乘回去',
        lines: ['6 × 28 = 168', '168 < 197，还能减'],
        log: '6 × 28 = 168 < 197，可以减' },
      { q: 6, mul: true, rem: 29, tone: 'bad',
        head: '④ 看余数：29 比 28 大',
        lines: ['197 − 168 = 29', '29 里还藏着一份 28'],
        log: '余 29 ≥ 28，说明商小了' },
      { q: 7, mul: false, rem: null, tone: 'trial',
        head: '⑤ 往大调一格：改 7',
        lines: ['6 加 1 得 7', '余数里那份 28 分出去'],
        log: '调商：6 → 7' },
      { q: 7, mul: true, rem: null, tone: 'trial',
        head: '⑥ 再乘一次',
        lines: ['7 × 28 = 196', '196 < 197，装得下'],
        log: '7 × 28 = 196' },
      { q: 7, mul: true, rem: 1, tone: 'ok',
        head: '⑦ 成立',
        lines: ['197 ÷ 28 = 7 余 1', '余 1，比 28 小 ✓'],
        log: '结果：197 ÷ 28 = 7 余 1' }
    ]
  },
  {
    a: 145, b: 31, est: 30, estWord: '四舍',
    steps: [
      { q: 0, mul: false, rem: null, tone: 'idle',
        head: '① 先看除数，估个数',
        lines: ['31 的个位是 1，够不上 5', '按「四舍」看成整十数 30'],
        log: '145 ÷ 31：把 31 看成 30' },
      { q: 4, mul: false, rem: null, tone: 'trial',
        head: '② 试商 4',
        lines: ['145 ÷ 30 大约商 4', '先写个 4 试试'],
        log: '试商 4' },
      { q: 4, mul: true, rem: null, tone: 'trial',
        head: '③ 乘回去',
        lines: ['4 × 31 = 124', '124 < 145，能减'],
        log: '4 × 31 = 124 < 145' },
      { q: 4, mul: true, rem: 21, tone: 'trial',
        head: '④ 看余数',
        lines: ['145 − 124 = 21', '21 比 31 小，减不动了'],
        log: '余 21 < 31，成立' },
      { q: 4, mul: true, rem: 21, tone: 'ok',
        head: '⑤ 一次就试准',
        lines: ['145 ÷ 31 = 4 余 21', '不用调商，一次到位'],
        log: '结果：145 ÷ 31 = 4 余 21' }
    ]
  }
];

function simCur() { return SIM_CASES[SIM.caseIdx]; }
function simStep() { return simCur().steps[SIM.i]; }

function simTone(t) {
  if (t === 'trial') return '#EF6C00';
  if (t === 'bad') return '#C62828';
  if (t === 'ok') return '#2E7D32';
  return '#4A6B62';
}

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  var c = simCur(), st = simStep();
  var FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';

  // ---- 顶部：估算提示 ----
  ctx.textAlign = 'left';
  ctx.font = '15px ' + FONT;
  ctx.fillStyle = '#4A6B62';
  ctx.fillText('把 ' + c.b + ' 看成 ' + c.est + '（' + c.estWord + '）', 48, 42);

  ctx.textAlign = 'right';
  ctx.font = 'bold 15px ' + FONT;
  ctx.fillStyle = '#00695C';
  ctx.fillText('例题 ' + (SIM.caseIdx + 1) + ' / ' + SIM_CASES.length, 838, 42);

  // ---- 竖式 ----
  var VX = 262, TOP = 112, RIGHT = 404, BOT = 344;
  ctx.strokeStyle = '#00695C';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(VX, TOP); ctx.lineTo(VX, BOT);
  ctx.moveTo(VX, TOP); ctx.lineTo(426, TOP);
  ctx.stroke();

  var BF = 'bold 34px ' + FONT;

  // 除数
  ctx.textAlign = 'right';
  ctx.font = BF;
  ctx.fillStyle = '#00695C';
  ctx.fillText(String(c.b), VX - 16, 176);

  // 被除数
  ctx.fillText(String(c.a), RIGHT, 176);

  // 商（试商高亮框）
  if (st.q > 0) {
    var qs = String(st.q);
    ctx.font = BF;
    var qw = ctx.measureText(qs).width;
    var col = simTone(st.tone);
    ctx.fillStyle = col;
    ctx.fillText(qs, RIGHT, 96);
    if (st.tone === 'trial' || st.tone === 'bad') {
      ctx.strokeStyle = col;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(RIGHT - qw - 8, 56, qw + 16, 44);
      ctx.setLineDash([]);
    }
  }

  // 乘积
  if (st.mul) {
    var prod = st.q * c.b;
    ctx.font = BF;
    ctx.fillStyle = st.tone === 'bad' ? '#C62828' : '#00897B';
    ctx.fillText(String(prod), RIGHT, 244);
  }

  // 减号线
  if (st.mul) {
    var w = ctx.measureText(String(st.q * c.b)).width + 26;
    ctx.strokeStyle = '#00695C';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(RIGHT - w, 262); ctx.lineTo(RIGHT + 12, 262);
    ctx.stroke();
  }

  // 余数
  if (st.rem !== null && st.rem !== undefined) {
    ctx.textAlign = 'right';
    ctx.font = BF;
    ctx.fillStyle = st.tone === 'bad' ? '#C62828' : '#2E7D32';
    ctx.fillText(String(st.rem), RIGHT, 316);
  }

  // ---- 右侧说明面板 ----
  var PX = 466, PW = 384;
  ctx.fillStyle = '#F2FAF8';
  ctx.strokeStyle = '#A5C9C0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(PX, 86, PW, 258, 14);
  } else {
    ctx.rect(PX, 86, PW, 258);
  }
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.font = 'bold 21px ' + FONT;
  ctx.fillStyle = simTone(st.tone);
  ctx.fillText(st.head, PX + 24, 134);

  ctx.font = '16px ' + FONT;
  ctx.fillStyle = '#2E4A45';
  for (var k = 0; k < st.lines.length; k++) {
    ctx.fillText(st.lines[k], PX + 24, 176 + k * 30);
  }

  // 底部小结
  var last = SIM.i === c.steps.length - 1;
  ctx.font = 'bold 17px ' + FONT;
  ctx.fillStyle = last ? '#2E7D32' : '#7E938E';
  ctx.fillText(last ? '这一步站稳了，可以往下写' : '点「下一步」继续', PX + 24, 316);

  // ---- 状态区 ----
  var rd = document.getElementById('simReadout');
  if (rd) {
    if (last) {
      rd.textContent = c.a + ' ÷ ' + c.b + ' = ' + st.q + (st.rem ? ' 余 ' + st.rem : '');
    } else {
      rd.textContent = c.a + ' ÷ ' + c.b + ' · 第 ' + (SIM.i + 1) + ' / ' + c.steps.length + ' 步';
    }
  }
  var tp = document.getElementById('simTip');
  if (tp) tp.textContent = st.head;
}

function simLog(msg, hl) {
  var box = document.getElementById('simLog');
  if (!box) return;
  var d = document.createElement('div');
  if (hl) d.className = 'hl';
  d.textContent = msg;
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
}

function simNext() {
  var c = simCur();
  if (SIM.i < c.steps.length - 1) {
    SIM.i++;
    simLog(simStep().log, simStep().tone === 'bad');
    simDraw();
  } else {
    simLog('这个例题已经走到最后一步了，换个例题试试', true);
  }
}

function simPrev() {
  if (SIM.i > 0) {
    SIM.i--;
    simDraw();
  }
}

function simCase(d) {
  d = (d === undefined || isNaN(d)) ? 1 : d;
  SIM.caseIdx = (SIM.caseIdx + d + SIM_CASES.length) % SIM_CASES.length;
  SIM.i = 0;
  SIM.log = [];
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  var c = simCur();
  simLog('换例题：' + c.a + ' ÷ ' + c.b, true);
  simDraw();
}

function simReset() {
  SIM.caseIdx = 0;
  SIM.i = 0;
  SIM.log = [];
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('已重置到第一个例题：192 ÷ 24');
  simDraw();
}

function simDemo() {
  SIM.caseIdx = 0;
  SIM.i = 0;
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simDraw();
  var timer = setInterval(function () {
    var c = simCur();
    if (SIM.i >= c.steps.length - 1) { clearInterval(timer); return; }
    simNext();
  }, 900);
}

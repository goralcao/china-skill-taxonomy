// ===== 仿真：表达式树，一步一步收缩 =====
var SIM_W = 880, SIM_H = 380;

var NODES = {
  r: { op: '−', l: 'a', rr: 'd', x: 452, y: 72 },
  a: { op: '×', l: 'b', rr: 'c', x: 306, y: 148 },
  b: { op: '+', l: 'p', rr: 'q', x: 210, y: 224 },
  c: { val: 3, x: 404, y: 224 },
  d: { op: '÷', l: 's', rr: 't', x: 598, y: 148 },
  p: { val: 145, x: 148, y: 300 },
  q: { val: 55, x: 274, y: 300 },
  s: { val: 120, x: 534, y: 224 },
  t: { val: 4, x: 662, y: 224 }
};

var STEPS = [
  { id: 'b', expr: '145 + 55', val: 200, why: '括号里的先算' },
  { id: 'd', expr: '120 ÷ 4', val: 30, why: '乘除排在加减前面' },
  { id: 'a', expr: '200 × 3', val: 600, why: '乘除算完，回到外层' },
  { id: 'r', expr: '600 − 30', val: 570, why: '最后才轮到减法' }
];

var SIM = { i: 0, log: [] };

function simDone() {
  var m = {};
  for (var k = 0; k < SIM.i; k++) m[STEPS[k].id] = STEPS[k].val;
  return m;
}

function nodeLabel(id, done) {
  if (done[id] !== undefined) return String(done[id]);
  var n = NODES[id];
  return n.op ? n.op : String(n.val);
}

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  var FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';
  var done = simDone();
  var cur = SIM.i < STEPS.length ? STEPS[SIM.i] : null;

  // 标题
  ctx.textAlign = 'left';
  ctx.font = 'bold 17px ' + FONT;
  ctx.fillStyle = '#37474F';
  ctx.fillText('(145 + 55) × 3 − 120 ÷ 4', 40, 38);
  ctx.font = '13px ' + FONT;
  ctx.fillStyle = '#78909C';
  ctx.fillText('已算 ' + SIM.i + ' / ' + STEPS.length + ' 步', 40, 60);

  // 连线
  for (var id in NODES) {
    var n = NODES[id];
    if (!n.l) continue;
    var kids = [n.l, n.rr];
    for (var k = 0; k < 2; k++) {
      var kid = NODES[kids[k]];
      ctx.strokeStyle = done[kids[k]] !== undefined ? '#A5D6A7' : '#CFD8DC';
      ctx.lineWidth = done[kids[k]] !== undefined ? 2.4 : 1.6;
      ctx.beginPath();
      ctx.moveTo(n.x, n.y + 18);
      ctx.lineTo(kid.x, kid.y - 18);
      ctx.stroke();
    }
  }

  // 节点
  var NW = 74, NH = 38;
  for (var nid in NODES) {
    var nd = NODES[nid];
    var isDone = done[nid] !== undefined;
    var isCur = cur && cur.id === nid;
    var bx = nd.x - NW / 2, by = nd.y - NH / 2;

    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(bx, by, NW, NH, 9);
    else ctx.rect(bx, by, NW, NH);

    if (isDone) {
      ctx.fillStyle = '#E8F5E9';
      ctx.strokeStyle = '#2E7D32';
      ctx.lineWidth = 2;
    } else if (isCur) {
      ctx.fillStyle = '#FFF3E0';
      ctx.strokeStyle = '#EF6C00';
      ctx.lineWidth = 2.6;
    } else if (nd.op) {
      ctx.fillStyle = '#ECEFF1';
      ctx.strokeStyle = '#90A4AE';
      ctx.lineWidth = 1.6;
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#B0BEC5';
      ctx.lineWidth = 1.6;
    }
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    var label = nodeLabel(nid, done);
    if (isDone) {
      ctx.font = 'bold 17px ' + FONT;
      ctx.fillStyle = '#1B5E20';
    } else if (nd.op) {
      ctx.font = 'bold 21px ' + FONT;
      ctx.fillStyle = '#37474F';
    } else {
      ctx.font = 'bold 17px ' + FONT;
      ctx.fillStyle = '#37474F';
    }
    ctx.fillText(label, nd.x, nd.y + 7);
  }

  // 右侧步骤列表
  var LX = 706, LY = 96;
  ctx.textAlign = 'left';
  ctx.font = 'bold 13px ' + FONT;
  ctx.fillStyle = '#78909C';
  ctx.fillText('运算步骤', LX, LY - 16);

  for (var s = 0; s < STEPS.length; s++) {
    var st = STEPS[s];
    var yy = LY + s * 52;
    var state = s < SIM.i ? 'done' : (s === SIM.i ? 'cur' : 'wait');

    ctx.fillStyle = state === 'done' ? '#E8F5E9' : (state === 'cur' ? '#FFF3E0' : '#F5F7F8');
    ctx.strokeStyle = state === 'done' ? '#A5D6A7' : (state === 'cur' ? '#FFB74D' : '#E0E5E8');
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(LX, yy, 152, 42, 7);
    else ctx.rect(LX, yy, 152, 42);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 13px ' + FONT;
    ctx.fillStyle = state === 'done' ? '#2E7D32' : (state === 'cur' ? '#E65100' : '#90A4AE');
    ctx.fillText((state === 'done' ? '✓ ' : (state === 'cur' ? '▸ ' : '  ')) + st.expr, LX + 10, yy + 19);

    ctx.font = '12px ' + FONT;
    ctx.fillStyle = state === 'wait' ? '#B0BEC5' : '#546E7A';
    ctx.fillText('= ' + st.val, LX + 10, yy + 35);
  }

  // 最终结果
  if (SIM.i >= STEPS.length) {
    ctx.textAlign = 'left';
    ctx.font = 'bold 15px ' + FONT;
    ctx.fillStyle = '#2E7D32';
    ctx.fillText('四步走完，整棵树缩成一个数 570', 40, 352);
  }

  // 状态
  var rd = document.getElementById('simReadout');
  if (rd) rd.textContent = SIM.i >= STEPS.length ? '(145 + 55) × 3 − 120 ÷ 4 = 570' : '(145 + 55) × 3 − 120 ÷ 4';
  var tp = document.getElementById('simTip');
  if (tp) tp.textContent = cur ? ('这一步：' + cur.why) : '全部算完，最后得 570';
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
  if (SIM.i < STEPS.length) {
    var st = STEPS[SIM.i];
    SIM.i++;
    simLog(st.expr + ' = ' + st.val + '（' + st.why + '）', SIM.i === STEPS.length);
    simDraw();
  } else {
    simLog('已经算完了，结果是 570', true);
  }
}

function simPrev() {
  if (SIM.i > 0) { SIM.i--; simDraw(); }
}

function simReset() {
  SIM.i = 0;
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('重来：先从最里面的括号开始');
  simDraw();
}

function simDemo() {
  SIM.i = 0;
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simDraw();
  var timer = setInterval(function () {
    if (SIM.i >= STEPS.length) { clearInterval(timer); return; }
    simNext();
  }, 900);
}

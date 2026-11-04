// ===== 仿真：撕下三个角，顶点重合拼成平角 180° =====
var SIM_W = 880, SIM_H = 360;
var SIM_A = { x: 110, y: 270 }, SIM_B = { x: 430, y: 270 };
var SIM_O = { x: 670, y: 270 }, SIM_R = 112;
var SIM_COL = ['#26C6DA', '#FFA726', '#66BB6A'];
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';

// 四个三角形：一般 / 等腰锐角 / 直角（藏 ∠3）/ 钝角（藏 ∠3）
var SIM_CASES = [
  { name: '风筝骨架 · 一般', x: 230, y: 90, hide3: false },
  { name: '等腰锐角', x: 270, y: 60, hide3: false },
  { name: '直角三角板', x: 383, y: 157, hide3: true },
  { name: '红领巾 · 钝角', x: 270, y: 245, hide3: true }
];

var SIM = { i: 0, step: 0, x: 230, y: 90, hot: [] };

function simDist(p, q) { return Math.sqrt((p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y)); }

function simAngle(p, q, r) {
  var v1x = p.x - q.x, v1y = p.y - q.y, v2x = r.x - q.x, v2y = r.y - q.y;
  var n1 = Math.sqrt(v1x * v1x + v1y * v1y) || 1, n2 = Math.sqrt(v2x * v2x + v2y * v2y) || 1;
  var c = (v1x * v2x + v1y * v2y) / (n1 * n2);
  return Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI;
}

function simInfo() {
  var C = { x: SIM.x, y: SIM.y };
  var ang = [
    simAngle(SIM_B, SIM_A, C),
    simAngle(SIM_A, SIM_B, C),
    simAngle(SIM_A, C, SIM_B)
  ];
  return { A: SIM_A, B: SIM_B, C: C, ang: ang, hide3: SIM_CASES[SIM.i].hide3 };
}

function simTxt(t, x, y, size, color, weight, align) {
  var ctx = document.getElementById('simCanvas').getContext('2d');
  ctx.save();
  ctx.font = (weight ? weight.trim() + ' ' : '') + size + 'px ' + SIM_FONT;
  ctx.fillStyle = color;
  ctx.textAlign = align || 'left';
  ctx.fillText(t, x, y);
  ctx.restore();
}

function simLine(x1, y1, x2, y2, color, w) {
  var ctx = document.getElementById('simCanvas').getContext('2d');
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = w || 2;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.restore();
}

// 在顶点 q 画一个内侧小扇形（半径 r），方向由 p、r 两条边决定
function simWedge(ctx, q, p, r2, rad, fill, stroke, dash) {
  var a1 = Math.atan2(p.y - q.y, p.x - q.x);
  var a2 = Math.atan2(r2.y - q.y, r2.x - q.x);
  var d = a2 - a1;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  ctx.save();
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(q.x, q.y);
  ctx.arc(q.x, q.y, rad, a1, a1 + d, d < 0);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.6; ctx.stroke(); }
  ctx.restore();
}

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  var f = simInfo();
  var A = f.A, B = f.B, C = f.C, ang = f.ang;
  SIM.hot = [];

  // ===== 左：三角形 + 三个角的扇形 =====
  simTxt('① 三角形上的三个角', 40, 34, 14, '#5D4037', 'bold ');
  ctx.save();
  ctx.fillStyle = 'rgba(93,64,55,.07)';
  ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(C.x, C.y); ctx.lineTo(B.x, B.y);
  ctx.closePath(); ctx.fill(); ctx.restore();
  simLine(A.x, A.y, C.x, C.y, '#5D4037', 2.4);
  simLine(C.x, C.y, B.x, B.y, '#5D4037', 2.4);
  simLine(A.x, A.y, B.x, B.y, '#5D4037', 2.4);

  var verts = [A, B, C];
  var pairs = [[B, C], [A, C], [A, B]];
  var letters = ['A', 'B', 'C'];
  for (var k = 0; k < 3; k++) {
    var q = verts[k];
    var torn = k < SIM.step;
    simWedge(ctx, q, pairs[k][0], pairs[k][1], 42,
      torn ? 'rgba(0,0,0,.02)' : SIM_COL[k],
      torn ? '#CFD8DC' : '#FFFFFF', torn ? [4, 3] : null);
    var lab = (f.hide3 && k === 2) ? '?' : (Math.round(ang[k]) + '°');
    var lowC = (k === 2 && C.y > 210);
    simTxt(lab, q.x + (k === 2 ? 0 : (k === 0 ? 22 : -22)),
      q.y + (k === 2 ? (lowC ? -30 : 34) : -16),
      14, torn ? '#B0BEC5' : '#263238', 'bold ', 'center');
    simTxt(letters[k], q.x + (k === 0 ? -12 : (k === 1 ? 12 : 0)),
      q.y + (k === 2 ? (lowC ? 18 : -20) : 20),
      12, '#8D6E63', 'bold ', 'center');
    SIM.hot.push({ x: q.x, y: q.y, r: 48, k: k });
  }

  var sumAll = ang[0] + ang[1] + ang[2];
  simTxt('∠1 ' + Math.round(ang[0]) + '°　∠2 ' + Math.round(ang[1]) + '°　∠3 ' +
    (f.hide3 ? '?' : Math.round(ang[2]) + '°') + '　→　合计 ' + Math.round(sumAll) + '°',
    40, 322, 14, '#5D4037', 'bold ');
  if (f.hide3) {
    simTxt('∠3 = 180° − ' + Math.round(ang[0]) + '° − ' + Math.round(ang[1]) + '° = ' + Math.round(ang[2]) + '°',
      40, 346, 14, '#C62828', 'bold ');
  } else {
    simTxt('三个角加起来永远是一条直线', 40, 346, 13, '#607D8B');
  }

  // ===== 右：平角拼图 =====
  simLine(490, 18, 490, 344, '#F0E4DE', 1.4);
  simTxt('② 撕下来，顶点重合往直线上拼', 512, 34, 14, '#5D4037', 'bold ');

  var theta = Math.PI;
  var done = 0;
  for (var m = 0; m < 3; m++) {
    var a = ang[m] * Math.PI / 180;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(SIM_O.x, SIM_O.y);
    ctx.arc(SIM_O.x, SIM_O.y, SIM_R, theta, theta + a);
    ctx.closePath();
    if (m < SIM.step) {
      ctx.fillStyle = SIM_COL[m]; ctx.fill();
      ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2; ctx.stroke();
    } else {
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = '#D7CCC8'; ctx.lineWidth = 1.4; ctx.stroke();
    }
    ctx.restore();
    var mid = theta + a / 2;
    if (m < SIM.step) {
      simTxt(Math.round(ang[m]) + '°',
        SIM_O.x + Math.cos(mid) * SIM_R * 0.62,
        SIM_O.y + Math.sin(mid) * SIM_R * 0.62 + 5,
        15, '#263238', 'bold ', 'center');
      done += ang[m];
    }
    theta += a;
  }

  simLine(SIM_O.x - SIM_R - 16, SIM_O.y, SIM_O.x + SIM_R + 16, SIM_O.y, '#5D4037', 3);
  simTxt('平角 180°', SIM_O.x, SIM_O.y + 24, 13, '#5D4037', 'bold ', 'center');

  if (SIM.step === 3) {
    simTxt(Math.round(ang[0]) + '° + ' + Math.round(ang[1]) + '° + ' + Math.round(ang[2]) +
      '° = 180°，正好一条直线', 512, 322, 16, '#2E7D32', 'bold ');
    simTxt('三角形内角和 = 180°，与形状、大小都无关', 512, 346, 13, '#00695C');
  } else {
    simTxt('已拼 ' + Math.round(done) + '°　还差 ' + Math.round(180 - done) + '°', 512, 322, 16, '#E65100', 'bold ');
    simTxt('再撕一个角过来，看能不能铺满', 512, 346, 13, '#8D6E63');
  }
  simTxt(SIM_CASES[SIM.i].name, 512, 60, 12, '#B0BEC5');

  // ===== 状态栏 =====
  var rd = document.getElementById('simReadout');
  if (rd) rd.textContent = '已拼 ' + Math.round(done) + '° / 180°' +
    (SIM.step === 3 ? '，拼满了' : '，还差 ' + Math.round(180 - done) + '°');
  var tp = document.getElementById('simTip');
  if (tp) tp.textContent = '三个角：' + Math.round(ang[0]) + '° / ' + Math.round(ang[1]) + '° / ' +
    (f.hide3 ? '?' : Math.round(ang[2]) + '°');
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

function simCase(k) {
  if (k === undefined || isNaN(k)) k = (SIM.i + 1) % SIM_CASES.length;
  k = ((k % SIM_CASES.length) + SIM_CASES.length) % SIM_CASES.length;
  SIM.i = k;
  SIM.x = SIM_CASES[k].x; SIM.y = SIM_CASES[k].y;
  SIM.step = 0;
  simDraw();
  var f = simInfo();
  simLog('换形状「' + SIM_CASES[k].name + '」：三个角 ' + Math.round(f.ang[0]) + '° / ' +
    Math.round(f.ang[1]) + '° / ' + Math.round(f.ang[2]) + '°', true);
}

function simNext() {
  if (SIM.step < 3) {
    SIM.step++;
    var f = simInfo();
    simLog('撕下第 ' + SIM.step + ' 个角：' + Math.round(f.ang[SIM.step - 1]) + '°');
    simDraw();
    if (SIM.step === 3) simLog('三个角铺满半平面，正好 180°，三角形内角和得证', true);
  } else {
    simCase(SIM.i + 1);
  }
}

function simPrev() {
  if (SIM.step > 0) { SIM.step--; simDraw(); }
  else { simCase(SIM.i - 1); SIM.step = 3; simDraw(); }
}

function simReset() {
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simCase(0);
  simLog('重来：三个角还在三角形上，一个都没撕');
}

function simDemo() {
  simCase(0);
  var t = setInterval(function () {
    if (SIM.step >= 3) { clearInterval(t); return; }
    simNext();
  }, 900);
}

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.getAttribute('data-bound')) return;
  cv.setAttribute('data-bound', '1');
  cv.style.cursor = 'pointer';
  cv.addEventListener('click', function (e) {
    var r = cv.getBoundingClientRect();
    var x = (e.clientX - r.left) * (SIM_W / r.width);
    var y = (e.clientY - r.top) * (SIM_H / r.height);
    for (var i = 0; i < SIM.hot.length; i++) {
      var h = SIM.hot[i];
      if (Math.sqrt((x - h.x) * (x - h.x) + (y - h.y) * (y - h.y)) < h.r) {
        SIM.step = h.k + 1;
        simDraw();
        simLog('点第 ' + (h.k + 1) + ' 个角，直接撕到这一步');
        return;
      }
    }
    simNext();
  });
}

// ===== 仿真：拖顶点 C，三个角、三条边与两张分类标签实时重算 =====
var SIM_W = 880, SIM_H = 360;
var SIM_A = { x: 150, y: 286 }, SIM_B = { x: 430, y: 286 };
var SIM_U = 28;                       // 28 px = 1 厘米，底边 280 px = 10 厘米
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';

// 六个预设：(230,60) 锐角不等边 / (290,44) 等边 / (389,187) 直角不等边
//          (290,146) 等腰直角 / (290,120) 等腰锐角 / (290,250) 钝角等腰
var SIM_CASES = [
  { name: '屋顶 · 锐角不等边', x: 230, y: 60 },
  { name: '路牌 · 等边', x: 290, y: 44 },
  { name: '三角板 · 直角不等边', x: 389, y: 187 },
  { name: '等腰直角', x: 290, y: 146 },
  { name: '等腰锐角', x: 290, y: 120 },
  { name: '红领巾 · 钝角等腰', x: 290, y: 250 }
];

var SIM = { i: 0, x: 230, y: 60, drag: false };

function simUnit(x, y) {
  var n = Math.sqrt(x * x + y * y) || 1;
  return { x: x / n, y: y / n };
}

function simDist(p, q) { return Math.sqrt((p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y)); }

// 角在 q，两边指向 p 与 r
function simAngle(p, q, r) {
  var v1x = p.x - q.x, v1y = p.y - q.y, v2x = r.x - q.x, v2y = r.y - q.y;
  var n1 = Math.sqrt(v1x * v1x + v1y * v1y) || 1, n2 = Math.sqrt(v2x * v2x + v2y * v2y) || 1;
  var c = (v1x * v2x + v1y * v2y) / (n1 * n2);
  return Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI;
}

function simInfo() {
  var C = { x: SIM.x, y: SIM.y };
  var aa = simAngle(SIM_B, SIM_A, C);
  var bb = simAngle(SIM_A, SIM_B, C);
  var cc = simAngle(SIM_A, C, SIM_B);
  var la = simDist(SIM_B, C) / SIM_U;   // BC
  var lb = simDist(SIM_A, C) / SIM_U;   // AC
  var lc = simDist(SIM_A, SIM_B) / SIM_U; // AB
  var mx = Math.max(aa, bb, cc);
  var angle = mx > 90.8 ? '钝角三角形' : (mx >= 89.2 ? '直角三角形' : '锐角三角形');
  var e1 = Math.abs(la - lb) < 0.22, e2 = Math.abs(lb - lc) < 0.22, e3 = Math.abs(la - lc) < 0.22;
  var side = (e1 && e2 && e3) ? '等边三角形' : ((e1 || e2 || e3) ? '等腰三角形' : '不等边三角形');
  return { A: SIM_A, B: SIM_B, C: C, ang: [aa, bb, cc], len: [lc, la, lb], max: mx, angle: angle, side: side };
}

function simTag(x, y, w, h, text, on, color) {
  var ctx = document.getElementById('simCanvas').getContext('2d');
  ctx.save();
  ctx.fillStyle = on ? color : '#F1F5F1';
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, 7);
  else ctx.rect(x, y, w, h);
  ctx.fill();
  ctx.strokeStyle = on ? color : '#CFDCD0';
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.fillStyle = on ? '#FFFFFF' : '#7A8A7C';
  ctx.font = (on ? 'bold ' : '') + '15px ' + SIM_FONT;
  ctx.textAlign = 'center';
  ctx.fillText(text, x + w / 2, y + h / 2 + 5);
  ctx.restore();
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

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  var f = simInfo();
  var A = f.A, B = f.B, C = f.C;

  // ===== 左：三角形 =====
  ctx.save();
  ctx.fillStyle = 'rgba(46,125,50,.10)';
  ctx.beginPath();
  ctx.moveTo(A.x, A.y); ctx.lineTo(C.x, C.y); ctx.lineTo(B.x, B.y);
  ctx.closePath(); ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = '#2E7D32';
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(A.x, A.y); ctx.lineTo(C.x, C.y); ctx.lineTo(B.x, B.y);
  ctx.closePath(); ctx.stroke();
  ctx.restore();

  // 顶点与字母
  [[A, 'A'], [B, 'B']].forEach(function (o) {
    ctx.save();
    ctx.fillStyle = '#2E7D32';
    ctx.beginPath(); ctx.arc(o[0].x, o[0].y, 5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    simTxt(o[1], o[0].x - 8, o[0].y + 22, 13, '#2E7D32', 'bold ');
  });

  // 顶点 C：橙色可拖动手柄
  ctx.save();
  ctx.fillStyle = '#FFB300';
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(C.x, C.y, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
  simTxt('C', C.x, C.y + 5, 13, '#3E2723', 'bold ', 'center');
  simTxt('拖我', C.x + 20, C.y - 10, 12, '#E65100');

  // 三个角的度数（沿角平分线外推 30px）
  function angPos(q, p, r) {
    var v1 = simUnit(p.x - q.x, p.y - q.y), v2 = simUnit(r.x - q.x, r.y - q.y);
    var d = simUnit(v1.x + v2.x, v1.y + v2.y);
    return { x: q.x + d.x * 32, y: q.y + d.y * 32 + 5 };
  }
  var pos = [angPos(A, B, C), angPos(B, A, C), angPos(C, A, B)];
  for (var i = 0; i < 3; i++) {
    var isMax = Math.abs(f.ang[i] - f.max) < 0.01;
    simTxt(Math.round(f.ang[i]) + '°', pos[i].x, pos[i].y, 15,
      isMax ? '#E65100' : '#546E7A', 'bold ', 'center');
  }

  // 三条边长度
  simTxt(f.len[0].toFixed(1) + ' 厘米', (A.x + B.x) / 2, A.y + 24, 12, '#607D8B', '', 'center');
  simTxt(f.len[2].toFixed(1) + ' 厘米', (A.x + C.x) / 2 - 14, (A.y + C.y) / 2, 12, '#607D8B', '', 'right');
  simTxt(f.len[1].toFixed(1) + ' 厘米', (B.x + C.x) / 2 + 14, (B.y + C.y) / 2, 12, '#607D8B', '');

  // 底部两张标签合起来
  simTxt('按角：' + f.angle + '　｜　按边：' + f.side, 40, 340, 17, '#1B5E20', 'bold ');

  // ===== 右：六个分类标签 =====
  ctx.save();
  ctx.strokeStyle = '#E8F5E9'; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(628, 18); ctx.lineTo(628, 344); ctx.stroke();
  ctx.restore();

  simTxt('两张分类标签', 648, 30, 14, '#2E7D32', 'bold ');
  simTxt('按角分（看最大角）', 648, 54, 12.5, '#90A4AE');
  var angTags = ['锐角三角形', '直角三角形', '钝角三角形'];
  for (var k = 0; k < 3; k++) {
    simTag(648, 64 + k * 40, 200, 31, angTags[k], f.angle === angTags[k], '#2E7D32');
  }

  simTxt('按边分（数相等的边）', 648, 198, 12.5, '#90A4AE');
  var sideTags = ['不等边三角形', '等腰三角形', '等边三角形'];
  for (var m = 0; m < 3; m++) {
    simTag(648, 208 + m * 40, 200, 31, sideTags[m], f.side === sideTags[m], '#FFB300');
  }

  simTxt('三个角：' + Math.round(f.ang[0]) + '° / ' + Math.round(f.ang[1]) + '° / ' + Math.round(f.ang[2]) + '°',
    648, 332, 12.5, '#607D8B');
  simTxt(SIM_CASES[SIM.i].name, 648, 350, 12, '#B0BEC5');

  // ===== 状态栏 =====
  var rd = document.getElementById('simReadout');
  if (rd) rd.textContent = '按角：' + f.angle + '｜按边：' + f.side;
  var tp = document.getElementById('simTip');
  if (tp) tp.textContent = '最大角 ' + Math.round(f.max) + '°';
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

function simClamp(x, y) {
  x = Math.max(70, Math.min(560, x));
  y = Math.max(36, Math.min(264, y));
  var C = { x: x, y: y };
  if (simDist(C, SIM_A) < 24) C.y -= 24;
  if (simDist(C, SIM_B) < 24) C.y -= 24;
  return C;
}

function simSet(x, y) {
  var c = simClamp(x, y);
  SIM.x = c.x; SIM.y = c.y;
  simDraw();
  var f = simInfo();
  simLog('顶点移到 (' + Math.round(SIM.x) + ', ' + Math.round(SIM.y) + ') → ' + f.angle + ' + ' + f.side);
}

function simCase(k) {
  if (k === undefined || isNaN(k)) k = (SIM.i + 1) % SIM_CASES.length;
  k = ((k % SIM_CASES.length) + SIM_CASES.length) % SIM_CASES.length;
  SIM.i = k;
  var c = SIM_CASES[k];
  SIM.x = c.x; SIM.y = c.y;
  simDraw();
  var f = simInfo();
  simLog('形状「' + c.name + '」：最大角 ' + Math.round(f.max) + '° → ' + f.angle + ' + ' + f.side, true);
}

function simNext() { simCase(SIM.i + 1); }
function simPrev() { simCase(SIM.i - 1); }

function simReset() {
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simCase(0);
  simLog('重来：屋顶那一格，锐角 + 不等边');
}

function simDemo() {
  simCase(0);
  var t = setInterval(function () {
    if (SIM.i >= SIM_CASES.length - 1) { clearInterval(t); return; }
    simCase(SIM.i + 1);
  }, 1100);
}

function simPt(e) {
  var cv = document.getElementById('simCanvas');
  var r = cv.getBoundingClientRect();
  return {
    x: (e.clientX - r.left) * (SIM_W / r.width),
    y: (e.clientY - r.top) * (SIM_H / r.height)
  };
}

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.getAttribute('data-bound')) return;
  cv.setAttribute('data-bound', '1');
  cv.style.cursor = 'crosshair';
  cv.addEventListener('mousedown', function (e) {
    var p = simPt(e);
    var d = simDist(p, { x: SIM.x, y: SIM.y });
    if (d < 22) { SIM.drag = true; e.preventDefault(); }
    else { simSet(p.x, p.y); }
  });
  cv.addEventListener('mousemove', function (e) {
    if (!SIM.drag) return;
    var p = simPt(e);
    var c = simClamp(p.x, p.y);
    SIM.x = c.x; SIM.y = c.y;
    simDraw();
  });
  window.addEventListener('mouseup', function () {
    if (!SIM.drag) return;
    SIM.drag = false;
    var f = simInfo();
    simLog('松手：最大角 ' + Math.round(f.max) + '° → ' + f.angle + ' + ' + f.side);
  });
}

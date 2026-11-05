// ===== 六年级仿真通用绘图库（每课 course.js 前缀） =====
var SIM_W = 880, SIM_H = 360;
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';

function simCtx() { return document.getElementById('simCanvas').getContext('2d'); }

function simTxt(t, x, y, size, color, weight, align) {
  var ctx = simCtx();
  ctx.save();
  ctx.font = (weight ? weight + ' ' : '') + size + 'px ' + SIM_FONT;
  ctx.fillStyle = color;
  ctx.textAlign = align || 'left';
  ctx.fillText(t, x, y);
  ctx.restore();
}

function simLine(x1, y1, x2, y2, color, w, dash) {
  var ctx = simCtx();
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = w || 1.6; ctx.lineCap = 'round';
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.restore();
}

function simBox(x, y, w, h, fill, stroke, r) {
  var ctx = simCtx();
  r = (r === undefined) ? 8 : r;
  if (r > Math.min(w, h) / 2) r = Math.min(w, h) / 2;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.6; ctx.stroke(); }
  ctx.restore();
}

function simDot(x, y, r, fill, stroke) {
  var ctx = simCtx();
  ctx.save();
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.4; ctx.stroke(); }
  ctx.restore();
}

function simArc(cx, cy, r, a0, a1, fill, stroke, w) {
  var ctx = simCtx();
  ctx.save();
  ctx.beginPath(); ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, r, a0, a1); ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = w || 1.6; ctx.stroke(); }
  ctx.restore();
}

function simRing(cx, cy, r, color, w, dash) {
  var ctx = simCtx();
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = color; ctx.lineWidth = w || 1.6;
  if (dash) ctx.setLineDash(dash);
  ctx.stroke(); ctx.restore();
}

function simLog(msg) {
  var box = document.getElementById('simLog');
  if (!box) return;
  var d = document.createElement('div');
  d.className = 'sim-log-line'; d.innerHTML = msg;
  box.appendChild(d);
  if (box.children.length > 3) box.removeChild(box.firstChild);
  box.scrollTop = box.scrollHeight;
}

function simFrac(n, d) { return n + '/' + d; }
function simGcd(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }
function simReduce(n, d) { var g = simGcd(n, d); return [n / g, d / g]; }

// ===== 仿真：数轴双向延伸 —— 向左变小、向右变大 =====
var SIM_CASES = [0, 3, -2, -5, 6];
var SIM_LO = -10, SIM_HI = 10;
var SIM = { ci: 0, v: 0 };

function simStart() { return SIM_CASES[SIM.ci]; }
function simKind() {
  return SIM.v > 0 ? '正数' : SIM.v < 0 ? '负数' : '原点（既不正也不负）';
}
function simDist() { return Math.abs(SIM.v); }

function simDraw() {
  var ctx = simCtx();
  if (!ctx) return;
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.save(); ctx.fillStyle = '#FCFDFE'; ctx.fillRect(0, 0, SIM_W, SIM_H); ctx.restore();

  simTxt('第 ' + (SIM.ci + 1) + ' 组 · 当前 ' + (SIM.v > 0 ? '+' : '') + SIM.v +
         ' · ' + simKind(), 34, 34, 17, '#37474F', '700');
  simTxt('数轴以 0 为原点：向右是正数、向左是负数，越往右数越大',
         34, 58, 12.5, '#607D8B');

  // 数轴：只占左半区，右半区留给信息面板，避免互相遮挡
  var x0 = 40, x1 = 470, y = 176, W = x1 - x0;
  var step = W / (SIM_HI - SIM_LO);
  simLine(x0, y, x1, y, '#546E7A', 2);
  ctx.save();
  ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x1 - 10, y - 5); ctx.lineTo(x1 - 10, y + 5);
  ctx.closePath(); ctx.fillStyle = '#546E7A'; ctx.fill(); ctx.restore();

  for (var v = SIM_LO; v <= SIM_HI; v++) {
    var x = x0 + (v - SIM_LO) * step;
    var big = (v % 5 === 0);
    simLine(x, y - (big ? 8 : 5), x, y + (big ? 8 : 5), '#90A4AE', big ? 1.6 : 1);
    if (big || v === SIM.v) {
      simTxt(String(v), x, y + 26, big ? 12 : 11,
             v === SIM.v ? '#E53935' : (v < 0 ? '#0277BD' : '#37474F'),
             v === SIM.v ? '700' : '', 'center');
    }
    // 正负半轴底色（最后一格不画，避免溢出数轴右端）
    if (v < 0) simBox(x, y - 3, step, 6, 'rgba(79,195,247,.55)', null, 0);
    else if (v > 0 && v < SIM_HI) simBox(x, y - 3, step, 6, 'rgba(55,71,79,.22)', null, 0);
  }

  // 0 原点加粗
  var zx = x0 + (0 - SIM_LO) * step;
  simLine(zx, y - 12, zx, y + 12, '#37474F', 2.6);

  // 当前位置标记
  var px = x0 + (SIM.v - SIM_LO) * step;
  simLine(px, y - 30, px, y + 14, '#E53935', 2, [4, 3]);
  simDot(px, y, 9, '#E53935');
  simTxt((SIM.v > 0 ? '+' : '') + SIM.v, px, y - 38, 16, '#E53935', '700', 'center');
  simTxt('← 越往左越小（负数）', x0, y + 46, 11.5, '#0277BD', '700');
  simTxt('0 是分界', zx, y + 46, 11, '#37474F', '700', 'center');
  simTxt('越往右越大（正数）→', x1, y + 46, 11.5, '#37474F', '700', 'right');
  simTxt('正数可省略 + 号，负数的 − 号不能省', x0, y + 70, 11, '#607D8B');

  simDrawPanel();
  simRefresh();
}

function simDrawPanel() {
  simBox(500, 84, 346, 250, '#FFFFFF', '#B0BEC5', 10);
  simTxt('当前位置', 522, 112, 12, '#8D6E63');
  simTxt((SIM.v > 0 ? '+' : '') + SIM.v, 522, 144, 24, '#E53935', '700');
  simLine(522, 158, 824, 158, '#ECEFF1', 1.2);

  simTxt('性质', 522, 182, 12, '#8D6E63');
  simTxt(simKind(), 522, 208, 17, SIM.v < 0 ? '#0277BD' : '#37474F', '700');
  simTxt('离 0 的距离', 522, 236, 12, '#8D6E63');
  simTxt(simDist() + ' 格', 522, 260, 17, '#37474F', '700');

  simLine(522, 274, 824, 274, '#ECEFF1', 1.2);
  simTxt('正数 > 0 > 负数', 522, 298, 12.5, '#37474F', '700');
  simTxt('−8 < −3（离 0 越远反而越小）', 522, 320, 11.5, '#607D8B');
}

function simRefresh() {
  var ro = document.getElementById('simReadout');
  var tp = document.getElementById('simTip');
  if (ro) ro.textContent = '第 ' + (SIM.ci + 1) + ' 组 · 当前 ' +
    (SIM.v > 0 ? '+' : '') + SIM.v + ' · ' + simKind();
  if (tp) tp.textContent = SIM.v <= SIM_LO || SIM.v >= SIM_HI ? '到边界了，点「换起点」' : '点画布或按钮移动';
}

function simLeft() {
  if (SIM.v <= SIM_LO) { simLog('已经到最左端了，点「换起点」'); return; }
  SIM.v--;
  simDraw();
  simLog('向左 1 格 → <span class="hl">' + SIM.v + '</span>，数变小了');
}

function simRight() {
  if (SIM.v >= SIM_HI) { simLog('已经到最右端了，点「换起点」'); return; }
  SIM.v++;
  simDraw();
  simLog('向右 1 格 → <span class="hl">' + (SIM.v > 0 ? '+' : '') + SIM.v + '</span>，数变大了');
}

function simNextCase() {
  SIM.ci = (SIM.ci + 1) % SIM_CASES.length;
  SIM.v = simStart();
  simDraw();
  simLog('换起点：从 <span class="hl">' + (SIM.v > 0 ? '+' : '') + SIM.v + '</span> 出发');
}

function simReset() {
  SIM.v = simStart();
  simDraw();
  simLog('重来：回到本组起点');
}

function simRunAll() { SIM.v = SIM_HI; simDraw(); simLog('一键到最右端：+' + SIM_HI); }
function simCase() { return SIM.ci + '/' + SIM.v; }

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function (e) {
    var r = cv.getBoundingClientRect();
    var x = (e.clientX - r.left) * (SIM_W / r.width);
    if (x < SIM_W / 2) simLeft(); else simRight();
  });
}

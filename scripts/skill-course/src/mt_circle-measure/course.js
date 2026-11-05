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

// ===== 仿真：滚动量周长 → 切成小份 → 拼成长方形 → 读出 C 与 S =====
var SIM_CASES = [3, 4, 5, 6, 8];
var SIM = { ci: 0, step: 0, slices: 8 };
var PI = 3.14;

function simR() { return SIM_CASES[SIM.ci]; }
function simC() { return 2 * PI * simR(); }
function simS() { return PI * simR() * simR(); }

function simDraw() {
  var ctx = simCtx();
  if (!ctx) return;
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.save(); ctx.fillStyle = '#FCFFFE'; ctx.fillRect(0, 0, SIM_W, SIM_H); ctx.restore();

  var r = simR(), px = 20, rad = r * px;
  var names = ['还没滚', '滚了一圈', '切成小份', '拼成长方形', '读出公式'];
  simTxt('第 ' + (SIM.ci + 1) + ' 组 · 半径 ' + r + ' 厘米 · ' + names[SIM.step],
         34, 34, 17, '#00695C', '700');
  simTxt(SIM.step === 0 ? '一个半径 ' + r + ' 厘米的圆，先让它沿直尺滚一圈'
         : SIM.step === 1 ? '滚过的一整段就是周长 C = 2πr'
         : SIM.step === 2 ? '把圆平均切成 ' + SIM.slices + ' 份（切得越细越像长方形）'
         : SIM.step === 3 ? '交错拼起来：长 ≈ πr，宽 = r' : 'C = 2πr　·　S = πr × r = πr²',
         34, 58, 12.5, '#607D8B');

  var cx = 230, cy = 196;

  if (SIM.step === 0) {
    simRing(cx, cy, rad, '#00695C', 2.6);
    simDot(cx, cy, 5, '#00695C');
    simLine(cx, cy, cx + rad, cy, '#FF7043', 2.5);
    simTxt('r = ' + r, cx + rad / 2, cy - 10, 13, '#E65100', '700', 'center');
    simLine(70, cy + rad + 20, 440, cy + rad + 20, '#80CBC4', 2);
    simTxt('起点', 70, cy + rad + 40, 11, '#607D8B');
  } else if (SIM.step === 1) {
    // 直线跑道：标出 0 / πd / 2πr
    var x0 = 60, total = 360;
    simLine(x0, cy + 30, x0 + total, cy + 30, '#00695C', 2);
    for (var k = 0; k <= 3; k++) {
      var x = x0 + k * (total / 3);
      simLine(x, cy + 22, x, cy + 38, '#00695C', 1.6);
    }
    simTxt('0', x0, cy + 56, 11, '#607D8B', '', 'center');
    simTxt('d', x0 + total / 3, cy + 56, 11, '#607D8B', '', 'center');
    simTxt('2d', x0 + 2 * total / 3, cy + 56, 11, '#607D8B', '', 'center');
    simTxt('πd ≈ 3.14d', x0 + total, cy + 56, 12, '#E65100', '700', 'center');
    simRing(150, cy - 70, 34, '#80CBC4', 2);
    simTxt('滚一圈', 150, cy - 100, 12, '#00695C', '700', 'center');
    simTxt('C = πd = 2πr = ' + (2 * PI * r).toFixed(2) + ' 厘米',
           60, cy - 6, 15, '#00695C', '700');
  } else if (SIM.step === 2) {
    // 切开的圆：从圆心画多条半径
    simRing(cx, cy, rad, '#00695C', 2.2);
    for (var i = 0; i < SIM.slices; i++) {
      var ang = i * 2 * Math.PI / SIM.slices;
      simLine(cx, cy, cx + rad * Math.cos(ang), cy + rad * Math.sin(ang), '#80CBC4', 1.2);
    }
    simDot(cx, cy, 4, '#00695C');
    simTxt('切成 ' + SIM.slices + ' 份', cx, cy + rad + 24, 12.5, '#00695C', '700', 'center');
  } else {
    // 拼成的近似长方形
    var L = Math.min(360, PI * r * 18), W = Math.min(120, r * 18);
    var bx = 70, by = 150;
    simBox(bx, by, L, W, '#E0F2F1', '#00695C', 4);
    for (var s = 1; s < SIM.slices; s++) {
      simLine(bx + s * L / SIM.slices, by, bx + s * L / SIM.slices, by + W, '#80CBC4', 1);
    }
    simTxt('长 ≈ 半周长 πr', bx + L / 2, by - 14, 13, '#00695C', '700', 'center');
    simTxt('宽 = r', bx + L + 12, by + W / 2 + 4, 13, '#E65100', '700');
    simTxt('S = πr × r', bx + L / 2, by + W + 26, 14, '#00695C', '700', 'center');
  }

  simDrawPanel();
  simRefresh();
}

function simDrawPanel() {
  var r = simR();
  simBox(500, 84, 346, 258, '#FFFFFF', '#80CBC4', 10);
  simTxt('本组数据', 522, 112, 12, '#8D6E63');
  simTxt('r = ' + r + ' 厘米', 522, 142, 21, '#00695C', '700');
  simLine(522, 158, 824, 158, '#E0F2F1', 1.2);

  simTxt('周长（一圈）', 522, 182, 12, '#8D6E63');
  simTxt('C = 2×3.14×' + r + ' = ' + simC().toFixed(2) + ' 厘米', 522, 208, 14, '#00695C', '700');
  simTxt('面积（铺满）', 522, 236, 12, '#8D6E63');
  simTxt('S = 3.14×' + r + '² = ' + simS().toFixed(2) + ' 平方厘米', 522, 262, 14, '#E65100', '700');

  simLine(522, 280, 824, 280, '#E0F2F1', 1.2);
  simTxt('d = 2r = ' + (2 * r) + ' 厘米', 522, 298, 12, '#37474F');
  simTxt('半圆周长 = πr + 2r = ' + (PI * r + 2 * r).toFixed(2) + ' 厘米', 522, 320, 11.5, '#607D8B');
}

function simRefresh() {
  var ro = document.getElementById('simReadout');
  var tp = document.getElementById('simTip');
  var names = ['还没滚', '已滚一圈', '已切开', '已拼好', '已读出公式'];
  if (ro) ro.textContent = '第 ' + (SIM.ci + 1) + ' 组 · 半径 ' + simR() + ' 厘米 · ' + names[SIM.step];
  if (tp) tp.textContent = SIM.step >= 4 ? '算完了，点「换半径」' : '点画布或「下一步」继续';
}

function simStep() {
  if (SIM.step === 2 && SIM.slices < 24) SIM.slices += 8;
  if (SIM.step >= 4) { simLog('这组已经算完了，点「换半径」'); return; }
  SIM.step++;
  simDraw();
  var msgs = ['', '滚一圈：C = πd = 2πr = ' + simC().toFixed(2) + ' 厘米',
              '切成 ' + SIM.slices + ' 份，越细越接近长方形',
              '拼好：长 ≈ πr，宽 = r',
              'S = πr² = ' + simS().toFixed(2) + ' 平方厘米'];
  simLog(msgs[SIM.step]);
}

function simRunAll() {
  SIM.step = 4; SIM.slices = 24;
  simDraw();
  simLog('一键到底：r = ' + simR() + ' → C = ' + simC().toFixed(2) +
         ' 厘米，S = <span class="hl">' + simS().toFixed(2) + '</span> 平方厘米');
}

function simNextCase() {
  SIM.ci = (SIM.ci + 1) % SIM_CASES.length;
  SIM.step = 0; SIM.slices = 8;
  simDraw();
  simLog('换半径：<span class="hl">r = ' + simR() + ' 厘米</span>，从滚一圈开始');
}

function simReset() {
  SIM.step = 0; SIM.slices = 8;
  simDraw();
  simLog('重来：回到还没滚的圆');
}

function simCase() { return SIM.ci + '/' + SIM.step; }

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function () { simStep(); });
}

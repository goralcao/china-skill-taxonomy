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

// ===== 仿真：最不利原则逐个投放，逼近「至少」临界 =====
var SIM_CASES = [[4, 3], [7, 3], [5, 4], [10, 3], [13, 12]];
var SIM = { ci: 0, placed: 0 };

function simM() { return SIM_CASES[SIM.ci][0]; }
function simK() { return SIM_CASES[SIM.ci][1]; }
function simCase() { return SIM.ci + '/' + SIM.placed; }

function simCount(d) {
  var k = simK(), n = 0;
  for (var i = 0; i < SIM.placed; i++) if (i % k === d) n++;
  return n;
}
function simMax() {
  var mx = 0;
  for (var d = 0; d < simK(); d++) mx = Math.max(mx, simCount(d));
  return mx;
}
function simLeast() { return Math.ceil(simM() / simK()); }

function simDrawBoxes() {
  var k = simK();
  for (var d = 0; d < k; d++) {
    var col = d % 6, row = Math.floor(d / 6);
    var x = 40 + col * 66, y = 110 + row * 86;
    var cnt = simCount(d);
    simBox(x, y, 60, 62, cnt > 0 ? '#E0F7FA' : '#FFFFFF', '#4DD0E1', 6);
    if (cnt > 0) {
      var shown = Math.min(cnt, 3);
      for (var j = 0; j < shown; j++) {
        simDot(x + 14 + j * 16, y + 24, 6, '#00838F');
      }
      if (cnt > 3) simTxt('+' + (cnt - 3), x + 30, y + 48, 10, '#E65100', '700', 'center');
    }
    simTxt(String(cnt), x + 30, y + 54, 13, '#5D4037', '700', 'center');
    simTxt('第 ' + (d + 1) + ' 个', x + 30, y + 78, 10, '#8D6E63', '', 'center');
  }
}

function simDrawPanel() {
  var m = simM(), k = simK();
  simBox(500, 84, 346, 250, '#FFFFFF', '#D7CCC8', 10);
  simTxt('当前这一组', 522, 112, 12, '#8D6E63');
  simTxt(m + ' 个物体，' + k + ' 个抽屉', 522, 140, 18, '#5D4037', '700');
  simLine(522, 156, 824, 156, '#EFEBE9', 1.2);

  simTxt('已放入', 522, 180, 12, '#8D6E63');
  simTxt(SIM.placed + ' / ' + m + ' 个', 522, 206, 16, '#00838F', '700');
  simTxt('最多的抽屉现在有', 522, 234, 12, '#8D6E63');
  simTxt(simMax() + ' 个', 522, 258, 16, '#E65100', '700');

  simLine(522, 274, 824, 274, '#EFEBE9', 1.2);
  simTxt('全部放完时至少：' + simLeast() + ' 个', 522, 298, 13, '#5D4037', '700');
  simTxt('最不利原则：先轮流平均放', 522, 320, 11.5, '#8D6E63');
}

function simRefresh() {
  var ro = document.getElementById('simReadout');
  var tp = document.getElementById('simTip');
  if (ro) ro.textContent = '第 ' + (SIM.ci + 1) + ' 组 · ' + simM() + ' 个物体，' +
    simK() + ' 个抽屉 · 已放 ' + SIM.placed + ' / ' + simM();
  if (tp) tp.textContent = SIM.placed >= simM() ? '放完了，点「换一组」' : '点画布或按钮放一个';
}

function simDraw() {
  var ctx = simCtx();
  if (!ctx) return;
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.save(); ctx.fillStyle = '#FFFCFA'; ctx.fillRect(0, 0, SIM_W, SIM_H); ctx.restore();

  simTxt('第 ' + (SIM.ci + 1) + ' 组 · ' + simM() + ' 个物体，' + simK() +
         ' 个抽屉 · 已放 ' + SIM.placed + ' / ' + simM(), 34, 34, 17, '#5D4037', '700');
  simTxt('按最不利原则轮流放：先让每个抽屉只放 1 个，再看第 ' + (simK() + 1) + ' 个躲不躲得掉',
         34, 58, 12.5, '#8D6E63');

  simDrawBoxes();
  simDrawPanel();

  simTxt('放到第 ' + (simK() + 1) + ' 个时，必然有抽屉出现 2 个', 40, 306, 12, '#E65100', '700');
  simTxt('物体：第 ' + (SIM.placed) + ' 个 · 最多抽屉：' + simMax() +
         ' 个 · 保证至少：' + simLeast() + ' 个', 40, 330, 12, '#5D4037', '700');

  simRefresh();
}

function simDrop() {
  if (SIM.placed >= simM()) { simLog('已经放完了，点「换一组」或「重来」'); return; }
  SIM.placed++;
  simDraw();
  simLog('放入第 ' + SIM.placed + ' 个 → 第 ' + ((SIM.placed - 1) % simK() + 1) +
         ' 个抽屉，最多已有 <span class="hl">' + simMax() + '</span> 个');
}

function simNextCase() {
  SIM.ci = (SIM.ci + 1) % SIM_CASES.length;
  SIM.placed = 0;
  simDraw();
  simLog('换一组：<span class="hl">' + simM() + ' 个物体，' + simK() +
         ' 个抽屉</span>，至少数会是 ' + simLeast());
}

function simReset() {
  SIM.placed = 0;
  simDraw();
  simLog('重来：抽屉全部倒空');
}

function simRunAll() {
  SIM.placed = simM();
  simDraw();
  simLog('一键放满：最多抽屉 <span class="hl">' + simMax() +
         '</span> 个，正好是至少数 ' + simLeast());
}

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function () { simDrop(); });
}

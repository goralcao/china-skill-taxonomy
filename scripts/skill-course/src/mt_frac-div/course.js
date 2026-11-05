// ===== 仿真：几个饼分给几个人，每人几个 =====
var SIM_W = 880, SIM_H = 360;
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';

var SIM = { pies: 3, men: 4 };

var PIE_Y = 176, PIE_R = 57, PIE_GAP = 126;

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

function simFrac(cx, cy, a, b, size, color, w) {
  var ctx = simCtx();
  ctx.save();
  ctx.font = '700 ' + size + 'px ' + SIM_FONT;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(String(a), cx, cy - 9);
  ctx.fillText(String(b), cx, cy + size * 0.84);
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.58, cy);
  ctx.lineTo(cx + size * 0.58, cy);
  ctx.strokeStyle = color;
  ctx.lineWidth = w || 2.6;
  ctx.stroke();
  ctx.restore();
}

function simDrawPie(cx, cy, r, men) {
  var ctx = simCtx();
  var step = Math.PI * 2 / men;
  for (var i = 0; i < men; i++) {
    var a0 = -Math.PI / 2 + i * step;
    var a1 = a0 + step;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, a0, a1);
    ctx.closePath();
    ctx.fillStyle = i === 0 ? '#FFC107' : '#E8F5E9';
    ctx.fill();
    ctx.strokeStyle = '#66BB6A';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();
  }
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = '#2E7D32';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

// ---- 绘制 ----
function simDraw() {
  var ctx = simCtx();
  if (!ctx) return;

  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.save();
  ctx.fillStyle = '#FAFDF9';
  ctx.fillRect(0, 0, SIM_W, SIM_H);
  ctx.restore();

  simTxt(SIM.pies + ' 个饼，平均分给 ' + SIM.men + ' 人', 40, 46, 20, '#2E7D32', '700');
  simTxt('每个饼都切成 ' + SIM.men + ' 份，每人从每饼拿 1 份', 40, 70, 12.5, '#8D6E63');

  var gap = Math.min(PIE_GAP, (500 - 2 * PIE_R) / Math.max(1, SIM.pies - 1));
  var startX = 250 - (SIM.pies - 1) * gap / 2;
  for (var i = 0; i < SIM.pies; i++) {
    var cx = startX + i * gap;
    simDrawPie(cx, PIE_Y, PIE_R, SIM.men);
    simTxt('第 ' + (i + 1) + ' 个', cx, PIE_Y + PIE_R + 22, 11, '#A1887F', '', 'center');
  }

  // 合计
  simTxt(SIM.pies + ' 个 1/' + SIM.men + ' 合起来 = ' + SIM.pies + '/' + SIM.men + ' 个',
    250, 300, 14, '#2E7D32', '700', 'center');
  simTxt('涂色的那一小块，就是每人分到的部分', 250, 326, 11.5, '#A1887F', '', 'center');

  simDrawPanel();
  simRefresh();
}

function simDrawPanel() {
  simBox(520, 54, 330, 280, '#FFFFFF', '#C8E6C9', 10);

  simTxt('每人分到', 542, 84, 12.5, '#8D6E63');

  simFrac(626, 128, SIM.pies, SIM.men, 40, '#2E7D32');
  simTxt('个饼', 682, 146, 15, '#5D4037', '700');

  simLine(542, 182, 828, 182, '#E8F5E9', 1.2);

  simTxt('除法算式', 542, 206, 12, '#8D6E63');
  simTxt(SIM.pies + ' ÷ ' + SIM.men + ' = ' + SIM.pies + '/' + SIM.men, 542, 230, 15, '#2E7D32', '700');

  var big = SIM.pies > SIM.men;
  var same = SIM.pies === SIM.men;
  simTxt('被除数 ' + SIM.pies + ' → 分子', 542, 260, 11.5, '#E65100');
  simTxt('除数 ' + SIM.men + ' → 分母', 542, 280, 11.5, '#1565C0');

  simTxt(same ? '正好一人一个' : (big ? '每人能拿一整个还多' : '每人分不到一整个'),
    542, 310, 12, same ? '#2E7D32' : (big ? '#E65100' : '#8D6E63'), '700');
}

// ---- 交互 ----
function simRefresh() {
  var ro = document.getElementById('simReadout');
  if (ro) ro.textContent = SIM.pies + ' 个饼 ÷ ' + SIM.men + ' 人';
  var tp = document.getElementById('simTip');
  if (tp) {
    if (SIM.pies > SIM.men) tp.textContent = '饼比人多，每人超过一个';
    else if (SIM.pies === SIM.men) tp.textContent = '饼和人一样多，正好一人一个';
    else tp.textContent = '饼比人少，每人不到一个';
  }
}

function simLog(msg) {
  var box = document.getElementById('simLog');
  if (!box) return;
  var d = document.createElement('div');
  d.className = 'sim-log-line';
  d.innerHTML = msg;
  box.appendChild(d);
  if (box.children.length > 3) box.removeChild(box.firstChild);
  box.scrollTop = box.scrollHeight;
}

function simAddPie(n) {
  if (SIM.pies >= 5) {
    simLog('画布最多摆 5 个饼，先减一减吧');
    return;
  }
  SIM.pies++;
  simDraw();
  simLog('加一个饼：<span class="hl">' + SIM.pies + ' ÷ ' + SIM.men + ' = ' +
    SIM.pies + '/' + SIM.men + '</span> 个');
}

function simMan(n) {
  if (SIM.men >= 8) {
    simLog('人太多就切得太细了，最多 8 人');
    return;
  }
  SIM.men++;
  simDraw();
  simLog('加一个人：<span class="hl">' + SIM.pies + ' ÷ ' + SIM.men + ' = ' +
    SIM.pies + '/' + SIM.men + '</span> 个，每饼要切 ' + SIM.men + ' 份');
}

function simReset() {
  SIM.pies = 3;
  SIM.men = 4;
  simDraw();
  simLog('重来：3 个饼分给 4 个人');
}

function simCase() { return SIM.pies + '/' + SIM.men; }

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function (e) {
    var r = cv.getBoundingClientRect();
    var x = (e.clientX - r.left) * (SIM_W / r.width);
    if (x > 510) { simPie(1); return; }
    simMan(1);
  });
}

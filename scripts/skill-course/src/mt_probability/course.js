// ===== 仿真：转盘试验，看频率逼近理论值 =====
var SIM_W = 880, SIM_H = 360;
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';
var SIM_TOTAL = 8;

// reds = 金色（中奖）格数；red / blue = 累计次数；last = 上一次停在第几格
var SIM = { reds: 1, red: 0, blue: 0, last: -1 };

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

function simWheel() {
  var ctx = simCtx(), cx = 236, cy = 196, r = 108;
  for (var i = 0; i < SIM_TOTAL; i++) {
    var a1 = -Math.PI / 2 - Math.PI / SIM_TOTAL + i * 2 * Math.PI / SIM_TOTAL;
    var a2 = a1 + 2 * Math.PI / SIM_TOTAL;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, a1, a2);
    ctx.closePath();
    var gold = i < SIM.reds;
    ctx.fillStyle = gold ? (i % 2 ? '#FFC107' : '#FFD54F') : (i % 2 ? '#9C27B0' : '#BA68C8');
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = SIM.last === i ? 5 : 2;
    ctx.stroke();
    // 格内文字
    var mid = (a1 + a2) / 2;
    simTxt(String(i + 1), cx + Math.cos(mid) * r * 0.74, cy + Math.sin(mid) * r * 0.74 + 6, 15,
           '#FFFFFF', '700', 'center');
  }
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.18, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.strokeStyle = '#CE93D8';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // 指针
  ctx.beginPath();
  ctx.moveTo(cx, cy - r + 2);
  ctx.lineTo(cx - 11, cy - r - 24);
  ctx.lineTo(cx + 11, cy - r - 24);
  ctx.closePath();
  ctx.fillStyle = '#4A148C';
  ctx.fill();
  simTxt('指针', cx, cy - r - 32, 11, '#6A1B9A', '', 'center');
}

function simDraw() {
  var ctx = simCtx();
  ctx.clearRect(0, 0, SIM_W, SIM_H);

  simTxt('8 格转盘 · 金色 ' + SIM.reds + ' 格', 236, 30, 14, '#4A148C', '700', 'center');
  simWheel();

  var n = SIM.red + SIM.blue;
  var pr = n ? SIM.red / n : 0;
  var pb = n ? SIM.blue / n : 0;
  var th = SIM.reds / SIM_TOTAL;

  // 统计区
  var x0 = 420, barW = 330, y1 = 104, y2 = 176, bh = 26;
  simTxt('共转了 ' + n + ' 次', x0, 62, 16, '#4A148C', '700');
  simTxt('理论 ' + (th * 100).toFixed(1) + '%', x0 + barW + 46, 62, 12, '#E64A19', '700');

  simTxt('金色（中奖）', x0, y1 - 8, 12, '#B26A00');
  simBox(x0, y1, barW, bh, '#F3E5F5', null, 5);
  if (pr > 0) simBox(x0, y1, Math.max(3, barW * pr), bh, '#FFC107', null, 5);
  simTxt(SIM.red + ' 次', x0 + barW + 10, y1 + 18, 13, '#7A5B00', '700');
  simTxt((pr * 100).toFixed(1) + '%', x0 + barW + 56, y1 + 18, 12, '#B26A00');

  simTxt('紫色（没中）', x0, y2 - 8, 12, '#6A1B9A');
  simBox(x0, y2, barW, bh, '#F3E5F5', null, 5);
  if (pb > 0) simBox(x0, y2, Math.max(3, barW * pb), bh, '#9C27B0', null, 5);
  simTxt(SIM.blue + ' 次', x0 + barW + 10, y2 + 18, 13, '#4A148C', '700');
  simTxt((pb * 100).toFixed(1) + '%', x0 + barW + 56, y2 + 18, 12, '#6A1B9A');

  // 理论线：贯穿两条柱子
  var tx = x0 + barW * th;
  simLine(tx, y1 - 20, tx, y2 + bh + 6, '#E64A19', 1.6, [6, 4]);
  simTxt('↑ 理论线', tx + 6, y2 + bh + 22, 11, '#E64A19');

  // 结论
  simBox(x0, 236, barW + 90, 58, '#FAF6FC', '#E1BEE7', 8);
  simTxt('金色占 ' + SIM.reds + '/8，理论中奖率 ' + (th * 100).toFixed(1) + '%',
         x0 + 14, 258, 12.5, '#6A1B9A');
  simTxt(n === 0 ? '还没转，先按「转 100 次」看看' :
    (Math.abs(pr - th) < 0.02 ? '实际值已经贴住理论值了' :
      (n < 40 ? '次数太少，实际值还在乱跳' : '次数再多一些会更接近理论值')),
    x0 + 14, 280, 11.5, '#8E24AA');

  var ro = document.getElementById('simReadout');
  if (ro) ro.textContent = '8 格 · 金色 ' + SIM.reds + ' 格 · 已转 ' + n + ' 次';
  var tip = document.getElementById('simTip');
  if (tip) {
    tip.textContent = n === 0 ? ('理论中奖率 ' + SIM.reds + '/8') :
      (SIM.red + ' / ' + n + ' 次中奖 · 理论 ' + (th * 100).toFixed(1) + '%');
  }
}

function simLog(msg, hl) {
  var box = document.getElementById('simLog');
  if (!box) return;
  var d = document.createElement('div');
  d.className = 'sim-log-line' + (hl ? ' hl' : '');
  d.textContent = msg;
  box.appendChild(d);
  if (box.children.length > 2) box.removeChild(box.firstChild);
}

function simSpin(n) {
  var hit = 0;
  for (var i = 0; i < n; i++) {
    var r = Math.floor(Math.random() * SIM_TOTAL);
    SIM.last = r;
    if (r < SIM.reds) { SIM.red++; hit++; } else SIM.blue++;
  }
  simDraw();
  var total = SIM.red + SIM.blue;
  simLog('转 ' + n + ' 次：中 ' + hit + ' 次 · 累计 ' + SIM.red + '/' + total +
    ' = ' + (SIM.red / total * 100).toFixed(1) + '%');
}

function simAdd(d) {
  var nr = SIM.reds + d;
  if (nr < 0 || nr > SIM_TOTAL) { simLog('金色格数只能在 0 到 8 之间'); return; }
  SIM.reds = nr;
  SIM.red = 0; SIM.blue = 0; SIM.last = -1;
  simDraw();
  simLog('金色改成 ' + nr + ' 格，理论中奖率 ' + nr + '/8，统计清零');
}

function simReset() {
  SIM.reds = 1; SIM.red = 0; SIM.blue = 0; SIM.last = -1;
  simDraw();
  simLog('清零：金色 1 格，重新开始', true);
}

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.dataset.bound) return;
  cv.dataset.bound = '1';
  cv.style.cursor = 'pointer';
  cv.addEventListener('click', function (e) {
    var rect = cv.getBoundingClientRect();
    var x = (e.clientX - rect.left) * (SIM_W / rect.width);
    var y = (e.clientY - rect.top) * (SIM_H / rect.height);
    var dx = x - 236, dy = y - 196;
    if (Math.sqrt(dx * dx + dy * dy) > 118) return;
    simSpin(1);
  });
}

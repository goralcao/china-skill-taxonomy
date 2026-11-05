// ===== 仿真：一堆糖，分几份、取几份，看分数是多少 =====
var SIM_W = 880, SIM_H = 360;
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';

var SIM_TOTALS = [12, 8, 6, 18, 20, 24, 15];
var SIM = { ti: 0, total: 12, parts: 4, take: 1 };

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
  ctx.moveTo(cx - size * 0.52, cy);
  ctx.lineTo(cx + size * 0.52, cy);
  ctx.strokeStyle = color;
  ctx.lineWidth = w || 2.4;
  ctx.stroke();
  ctx.restore();
}

// ---- 份数工具 ----
function simPer() { return SIM.total / SIM.parts; }

function simValid(p) { return p >= 2 && p <= 6 && SIM.total % p === 0; }

function simFirstParts() {
  for (var p = 2; p <= 6; p++) if (simValid(p)) return p;
  return 2;
}

function simNextParts() {
  for (var k = 1; k <= 6; k++) {
    var p = SIM.parts + k;
    if (p > 6) break;
    if (simValid(p)) return p;
  }
  return simFirstParts();
}

// ---- 绘制 ----
function simDraw() {
  var ctx = simCtx();
  if (!ctx) return;

  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.save();
  ctx.fillStyle = '#FCF8FE';
  ctx.fillRect(0, 0, SIM_W, SIM_H);
  ctx.restore();

  var per = simPer();
  var parts = SIM.parts;

  simTxt(SIM.total + ' 颗糖', 40, 46, 22, '#4A148C', '700');
  simTxt('平均分成 ' + parts + ' 份', 40, 70, 13, '#8D6E63');

  // 糖阵：一列就是一份
  var cw = Math.min(150, 450 / parts);
  var ch = Math.min(56, 200 / per);
  var r = Math.min(22, cw * 0.3, ch * 0.32);
  var gw = (parts - 1) * cw;
  var gh = (per - 1) * ch;
  var x0 = 280 - gw / 2;
  var y0 = 188 - gh / 2;

  for (var p = 0; p < parts; p++) {
    var cx = x0 + p * cw;
    var on = p < SIM.take;
    if (on) {
      simBox(cx - cw * 0.36, y0 - r - 10, cw * 0.72, gh + r * 2 + 20, '#FFF3CD', '#FFB300', 8);
    } else {
      simBox(cx - cw * 0.36, y0 - r - 10, cw * 0.72, gh + r * 2 + 20,
        'rgba(255,255,255,.7)', '#E1BEE7', 8);
    }
    simTxt(String(p + 1), cx, y0 + gh + r + 28, 11, on ? '#B26A00' : '#B39DDB', '', 'center');
  }

  for (var j = 0; j < per; j++) {
    for (var i = 0; i < parts; i++) {
      var px = x0 + i * cw, py = y0 + j * ch;
      var hot = i < SIM.take;
      simBox(px - r, py - r, r * 2, r * 2, hot ? '#FFC107' : '#EDE7F6',
        hot ? '#F57F17' : '#CE93D8', r);
    }
  }

  // 底部一句话
  simTxt(SIM.total + ' 颗平均分成 ' + parts + ' 份，取其中 ' + SIM.take + ' 份',
    280, 330, 13.5, '#6A1B9A', '', 'center');

  simDrawPanel();
  simRefresh();
}

function simDrawPanel() {
  var per = simPer();
  simBox(552, 54, 298, 258, '#FFFFFF', '#E1BEE7', 10);

  simTxt('这个分数是', 570, 82, 12, '#8D6E63');
  simFrac(616, 128, SIM.take, SIM.parts, 36, '#4A148C');

  simTxt('取走的 ' + SIM.take + ' 份', 700, 118, 14, '#E65100', '700');
  simTxt('= ' + SIM.take + ' × ' + per + ' 颗', 700, 142, 14, '#E65100', '700');

  simLine(570, 172, 832, 172, '#F3E5F5', 1.2);

  simTxt('每份', 570, 196, 12, '#8D6E63');
  simTxt(per + ' 颗', 616, 196, 13, '#4A148C', '700');
  simTxt('共 ' + SIM.parts + ' 份', 700, 196, 12, '#8D6E63');
  simTxt(SIM.total + ' 颗', 800, 196, 13, '#4A148C', '700', 'right');

  simTxt('算式', 570, 226, 12, '#8D6E63');
  simTxt(SIM.total + ' ÷ ' + SIM.parts + ' × ' + SIM.take + ' = ' + (per * SIM.take) + ' 颗',
    570, 248, 13.5, '#5D4037');

  var tail = SIM.take === SIM.parts
    ? '取走了整堆，就是 ' + SIM.parts + '/' + SIM.parts + ' = 1'
    : (SIM.take === 1
      ? '取 1 份，分子就是 1'
      : '分子 ' + SIM.take + '，说明有 ' + SIM.take + ' 个 1/' + SIM.parts);
  simTxt(tail, 570, 288, 11.5, '#8D6E63');
}

// ---- 交互 ----
function simRefresh() {
  var ro = document.getElementById('simReadout');
  if (ro) ro.textContent = SIM.total + ' 颗 · 分 ' + SIM.parts + ' 份 · 取 ' + SIM.take + ' 份';
  var tp = document.getElementById('simTip');
  if (tp) {
    tp.textContent = SIM.take === 1
      ? '每份 ' + simPer() + ' 颗，点画布多取一份'
      : '已取 ' + SIM.take + ' 份 = ' + (SIM.take * simPer()) + ' 颗';
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

function simParts(k) {
  SIM.parts = simNextParts();
  if (SIM.take > SIM.parts) SIM.take = SIM.parts;
  simDraw();
  simLog('改成平均分 <span class="hl">' + SIM.parts + ' 份</span>：每份 ' + simPer() +
    ' 颗，一份就是 ' + SIM.parts + ' 分之一');
}

function simTake(k) {
  SIM.take = SIM.take >= SIM.parts ? 1 : SIM.take + 1;
  simDraw();
  simLog('取 <span class="hl">' + SIM.take + ' 份</span>：写作 ' + SIM.take + '/' + SIM.parts +
    '，实际是 ' + (SIM.take * simPer()) + ' 颗');
}

function simNextTotal() {
  SIM.ti = (SIM.ti + 1) % SIM_TOTALS.length;
  SIM.total = SIM_TOTALS[SIM.ti];
  SIM.parts = simFirstParts();
  SIM.take = 1;
  simDraw();
  simLog('换成一堆 <span class="hl">' + SIM.total + ' 颗</span>');
}

function simReset() {
  SIM.take = 1;
  SIM.parts = simFirstParts();
  simDraw();
  simLog('重来：只取 1 份');
}

function simCase() { return SIM.total + '/' + SIM.parts; }

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function (e) {
    var r = cv.getBoundingClientRect();
    var x = (e.clientX - r.left) * (SIM_W / r.width);
    if (x > 548) { simNextTotal(); return; }
    simTake(1);
  });
}

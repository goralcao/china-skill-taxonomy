// ===== 仿真：一层一层填单位立方体，看体积怎么累出来 =====
var SIM_W = 880, SIM_H = 360;
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';
var UX = 0.866, UY = 0.5, VX = -0.866, VY = 0.5;
var SIM_CASES = [[4, 3, 2], [5, 4, 3], [3, 3, 3], [6, 2, 2], [2, 2, 4]];
var SIM_COLORS = ['#4DB6AC', '#26A69A', '#00897B', '#FFB74D', '#FFA726', '#FB8C00'];

var SIM = { ci: 0, L: 4, W: 3, H: 2, layers: 0, u: 26, ox: 250, oy: 262 };

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

function simPoly(pts, fill, stroke, w) {
  var ctx = simCtx();
  ctx.save();
  ctx.beginPath();
  pts.forEach(function (q, i) { if (i === 0) ctx.moveTo(q[0], q[1]); else ctx.lineTo(q[0], q[1]); });
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = w || 1; ctx.stroke(); }
  ctx.restore();
}

function simP(i, j, k) {
  var u = SIM.u;
  return [SIM.ox + i * UX * u + j * VX * u,
          SIM.oy + i * UY * u + j * VY * u - k * u];
}

function simLayout() {
  var L = SIM.L, W = SIM.W, H = SIM.H;
  var u = Math.min(28, 300 / ((L + W) * UX), 190 / ((L + W) * UY + H));
  SIM.u = Math.max(14, u);
  SIM.ox = 250;
  SIM.oy = 268 - Math.min(30, H * SIM.u * 0.28);
}

function simLoad(i) {
  var c = SIM_CASES[i];
  SIM.ci = i; SIM.L = c[0]; SIM.W = c[1]; SIM.H = c[2];
  SIM.layers = 0;
  simLayout();
}

function simVolume() { return SIM.L * SIM.W * SIM.H; }
function simFilled() { return SIM.layers * SIM.L * SIM.W; }

function simDrawFrame() {
  var L = SIM.L, W = SIM.W, H = SIM.H, c = '#B2DFDB';
  var b = [simP(0, 0, 0), simP(L, 0, 0), simP(L, W, 0), simP(0, W, 0)];
  var t = [simP(0, 0, H), simP(L, 0, H), simP(L, W, H), simP(0, W, H)];
  for (var i = 0; i < 4; i++) {
    simLine(b[i][0], b[i][1], b[(i + 1) % 4][0], b[(i + 1) % 4][1], c, 1.2, [4, 3]);
    simLine(t[i][0], t[i][1], t[(i + 1) % 4][0], t[(i + 1) % 4][1], '#80CBC4', 1.4);
    simLine(b[i][0], b[i][1], t[i][0], t[i][1], c, 1.2, [4, 3]);
  }
}

function simUnit(i, j, k, color) {
  var A = simP(i, j, k), B = simP(i + 1, j, k), C = simP(i + 1, j + 1, k), D = simP(i, j + 1, k);
  var A2 = simP(i, j, k + 1), B2 = simP(i + 1, j, k + 1), C2 = simP(i + 1, j + 1, k + 1), D2 = simP(i, j + 1, k + 1);
  simPoly([B, C, C2, B2], color, '#006064', 0.9);
  simPoly([C, D, D2, C2], color, '#006064', 0.9);
  simPoly([A2, B2, C2, D2], color, '#006064', 1.1);
}

// ---- 绘制 ----
function simDraw() {
  var ctx = simCtx();
  if (!ctx) return;
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.save(); ctx.fillStyle = '#FAFEFE'; ctx.fillRect(0, 0, SIM_W, SIM_H); ctx.restore();

  simTxt('第 ' + (SIM.ci + 1) + ' 组：' + SIM.L + ' × ' + SIM.W + ' × ' + SIM.H + ' cm 的盒子',
         34, 38, 18, '#006064', '700');
  simTxt('每个小方块都是 1 cm³；一层 = 长 × 宽 块，层数 = 高', 34, 62, 12.5, '#546E7A');

  simDrawFrame();
  for (var k = 0; k < SIM.layers; k++) {
    var color = SIM_COLORS[k % SIM_COLORS.length];
    for (var s = 0; s <= SIM.L + SIM.W - 2; s++) {
      for (var i = 0; i < SIM.L; i++) {
        var j = s - i;
        if (j < 0 || j >= SIM.W) continue;
        simUnit(i, j, k, color);
      }
    }
  }
  if (SIM.layers === 0) {
    simTxt('盒子还是空的，点「① 加一层」', 250, 150, 13, '#90A4AE', '', 'center');
  }

  // 尺寸标注
  simTxt('长 ' + SIM.L + ' cm', simP(SIM.L / 2, 0, 0)[0] - 6, simP(SIM.L / 2, 0, 0)[1] + 20, 11.5, '#006064', '700', 'center');
  simTxt('宽 ' + SIM.W + ' cm', simP(SIM.L, SIM.W / 2, 0)[0] + 24, simP(SIM.L, SIM.W / 2, 0)[1] + 4, 11.5, '#006064', '700');
  simTxt('高 ' + SIM.H + ' 层', simP(0, SIM.W, SIM.H)[0] - 30, simP(0, SIM.W, SIM.H)[1] - 8, 11.5, '#E65100', '700');

  simDrawPanel();
  simRefresh();
}

function simDrawPanel() {
  var vol = simVolume(), filled = simFilled();
  simBox(516, 54, 330, 280, '#FFFFFF', '#B2DFDB', 10);

  simTxt('盒子尺寸', 538, 84, 12, '#8D6E63');
  simTxt(SIM.L + ' × ' + SIM.W + ' × ' + SIM.H + ' cm', 538, 110, 19, '#006064', '700');

  simLine(538, 126, 824, 126, '#E0F2F1', 1.2);

  simTxt('每层', 538, 150, 12, '#8D6E63');
  simTxt(SIM.L + ' × ' + SIM.W + ' = ' + (SIM.L * SIM.W) + ' 块', 538, 172, 14, '#006064', '700');
  simTxt('已填层数', 538, 196, 12, '#8D6E63');
  simTxt(SIM.layers + ' / ' + SIM.H, 660, 196, 14, '#E65100', '700');
  simTxt('已用方块', 538, 220, 12, '#8D6E63');
  simTxt(filled + ' 个 1 cm³', 660, 220, 14, '#006064', '700');

  simLine(538, 238, 824, 238, '#E0F2F1', 1.2);

  simTxt('整个盒子体积', 538, 260, 12, '#8D6E63');
  simTxt(vol + ' cm³', 538, 286, 20, '#004D40', '700');
  simTxt('= ' + (vol / 1000) + ' dm³ = ' + vol + ' mL = ' + (vol / 1000) + ' L',
         538, 308, 12, '#546E7A');
  simTxt(SIM.layers === SIM.H ? '✓ 已填满，数一数正好是长×宽×高' : '还没填满，继续加一层',
         538, 328, 12, SIM.layers === SIM.H ? '#00695C' : '#C62828', '700');
}

// ---- 交互 ----
function simRefresh() {
  var ro = document.getElementById('simReadout');
  var tp = document.getElementById('simTip');
  if (ro) ro.textContent = SIM.L + ' × ' + SIM.W + ' × ' + SIM.H + ' · 已填 ' +
    SIM.layers + '/' + SIM.H + ' 层 · ' + simFilled() + ' cm³';
  if (tp) tp.textContent = SIM.layers === SIM.H ? '填满了，点「换尺寸」' : '点画布加一层';
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

function simAddLayer() {
  if (SIM.layers >= SIM.H) { simLog('已经填满了，共 <span class="hl">' + simVolume() + ' cm³</span>'); return; }
  SIM.layers++;
  simDraw();
  simLog('加第 ' + SIM.layers + ' 层：多 ' + (SIM.L * SIM.W) + ' 块，累计 <span class="hl">' +
    simFilled() + ' cm³</span>' + (SIM.layers === SIM.H ? '，<span class="hl">填满了</span>' : ''));
}

function simFillAll() {
  if (SIM.layers === SIM.H) { simLog('已经填满了'); return; }
  SIM.layers = SIM.H;
  simDraw();
  simLog('一次填满 ' + SIM.H + ' 层：<span class="hl">' + simVolume() + ' cm³</span> = ' +
    (simVolume() / 1000) + ' L');
}

function simNext() {
  simLoad((SIM.ci + 1) % SIM_CASES.length);
  simDraw();
  simLog('换尺寸：<span class="hl">' + SIM.L + ' × ' + SIM.W + ' × ' + SIM.H +
    ' cm</span>，总共 ' + simVolume() + ' cm³');
}

function simReset() {
  simLoad(SIM.ci);
  simDraw();
  simLog('重来：盒子清空，从头一层一层填');
}

function simCase() { return SIM.L + 'x' + SIM.W + 'x' + SIM.H + '/' + SIM.layers; }

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function () { simAddLayer(); });
}

simLoad(0);

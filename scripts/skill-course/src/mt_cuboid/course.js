// ===== 仿真：搭一个长方体框架，看 12 条棱怎么分成三组 =====
var SIM_W = 880, SIM_H = 360;
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';
var UX = 0.866, UY = 0.5, VX = -0.866, VY = 0.5;
var CX = 292, CY = 176;

var SIM_CASES = [[5, 4, 3], [8, 5, 2], [6, 6, 4], [4, 4, 4]];

var SIM = { ci: 0, L: 5, W: 4, H: 3, u: 30, ox: 0, oy: 0, l: false, w: false, h: false };

var SIM_GC = { l: '#1565C0', w: '#EF6C00', h: '#2E7D32' };
var SIM_GN = { l: '长', w: '宽', h: '高' };

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
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke(); }
  ctx.restore();
}

function simPoly(pts, fill) {
  var ctx = simCtx();
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.restore();
}

// ---- 等轴测投影 ----
function simP(i, j, k) {
  return [SIM.ox + i * SIM.L * UX * SIM.u + j * SIM.W * VX * SIM.u,
          SIM.oy + i * SIM.L * UY * SIM.u + j * SIM.W * VY * SIM.u - k * SIM.H * SIM.u];
}

function simLayout() {
  SIM.u = 250 / (SIM.H + 0.5 * SIM.L + 0.5 * SIM.W);
  var wide = (SIM.L + SIM.W) * 0.866 * SIM.u;
  if (wide > 450) SIM.u = 450 / ((SIM.L + SIM.W) * 0.866);
  var minX = -SIM.W * 0.866 * SIM.u, maxX = SIM.L * 0.866 * SIM.u;
  var minY = -SIM.H * SIM.u, maxY = (0.5 * SIM.L + 0.5 * SIM.W) * SIM.u;
  SIM.ox = CX - (minX + maxX) / 2;
  SIM.oy = CY - (minY + maxY) / 2;
}

function simEdges() {
  var out = [], j, k, i;
  for (j = 0; j < 2; j++) for (k = 0; k < 2; k++) out.push({ g: 'l', a: [0, j, k], b: [1, j, k] });
  for (i = 0; i < 2; i++) for (k = 0; k < 2; k++) out.push({ g: 'w', a: [i, 0, k], b: [i, 1, k] });
  for (i = 0; i < 2; i++) for (j = 0; j < 2; j++) out.push({ g: 'h', a: [i, j, 0], b: [i, j, 1] });
  return out;
}

function simHidden(a, b) {
  var H = [0, 1, 0];
  function eq(p) { return p[0] === H[0] && p[1] === H[1] && p[2] === H[2]; }
  return eq(a) || eq(b);
}

// ---- 绘制 ----
function simDraw() {
  var ctx = simCtx();
  if (!ctx) return;
  simLayout();

  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.save();
  ctx.fillStyle = '#FFFBF8';
  ctx.fillRect(0, 0, SIM_W, SIM_H);
  ctx.restore();

  simTxt(SIM.L + ' × ' + SIM.W + ' × ' + SIM.H + ' 厘米', 40, 44, 19, '#BF360C', '700');

  // 三个可见面：搭满后才逐渐显出来
  var full = (SIM.l && SIM.w && SIM.h);
  ctx.save();
  ctx.globalAlpha = full ? 0.62 : 0.2;
  simPoly([simP(0, 0, 1), simP(1, 0, 1), simP(1, 1, 1), simP(0, 1, 1)], '#BBDEFB');
  simPoly([simP(0, 0, 0), simP(1, 0, 0), simP(1, 0, 1), simP(0, 0, 1)], '#FFE0B2');
  simPoly([simP(1, 0, 0), simP(1, 1, 0), simP(1, 1, 1), simP(1, 0, 1)], '#C8E6C9');
  ctx.restore();

  var edges = simEdges();
  var i, e, p, q;

  // 未放的棱：虚线打底
  for (i = 0; i < edges.length; i++) {
    e = edges[i];
    if (SIM[e.g]) continue;
    p = simP(e.a[0], e.a[1], e.a[2]);
    q = simP(e.b[0], e.b[1], e.b[2]);
    var hid = simHidden(e.a, e.b);
    simLine(p[0], p[1], q[0], q[1], hid ? '#CFD8DC' : '#B0BEC5', hid ? 1.4 : 1.8, [5, 5]);
  }

  // 已放的棱
  for (i = 0; i < edges.length; i++) {
    e = edges[i];
    if (!SIM[e.g]) continue;
    p = simP(e.a[0], e.a[1], e.a[2]);
    q = simP(e.b[0], e.b[1], e.b[2]);
    simLine(p[0], p[1], q[0], q[1], SIM_GC[e.g], 5);
  }

  // 顶点
  for (var a = 0; a < 2; a++) {
    for (var b = 0; b < 2; b++) {
      for (var c = 0; c < 2; c++) {
        var v = simP(a, b, c);
        simBox(v[0] - 3.4, v[1] - 3.4, 6.8, 6.8, '#37474F', null, 3.4);
      }
    }
  }

  // 颜色图例
  simLine(42, 310, 68, 310, '#1565C0', 5);
  simTxt('长', 76, 315, 12.5, '#5D4037');
  simLine(112, 310, 138, 310, '#EF6C00', 5);
  simTxt('宽', 146, 315, 12.5, '#5D4037');
  simLine(182, 310, 208, 310, '#2E7D32', 5);
  simTxt('高', 216, 315, 12.5, '#5D4037');

  simDrawPanel();
  simRefresh();
}

function simDrawPanel() {
  simBox(552, 34, 298, 214, '#FFFFFF', '#FFCC80', 10);

  var rows = [
    { k: 'l', v: SIM.L, y: 62 },
    { k: 'w', v: SIM.W, y: 122 },
    { k: 'h', v: SIM.H, y: 182 }
  ];
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i], on = SIM[r.k];
    simBox(568, r.y, 8, 34, on ? SIM_GC[r.k] : '#E0E0E0', null, 4);
    simTxt(SIM_GN[r.k], 588, r.y + 23, 15, '#3E2723', '700');
    simTxt(r.v + ' 厘米', 632, r.y + 23, 14, '#5D4037');
    simTxt(on ? '4 条 ✓' : '4 条', 830, r.y + 22, 12.5,
      on ? SIM_GC[r.k] : '#BDBDBD', on ? '700' : '', 'right');
  }

  simLine(568, 106, 834, 106, '#FFE0B2', 1);
  simLine(568, 166, 834, 166, '#FFE0B2', 1);

  // 底面
  var done = (SIM.l ? 4 : 0) + (SIM.w ? 4 : 0) + (SIM.h ? 4 : 0);
  simTxt('已放 ' + done + ' / 12 条', 568, 236, 13, done === 12 ? '#2E7D32' : '#A1887F',
    done === 12 ? '700' : '');

  // 底部结论
  var all = (SIM.l && SIM.w && SIM.h);
  var sum = (SIM.L + SIM.W + SIM.H) * 4;
  simTxt('12 条棱 · 共 ' + sum + ' 厘米', 552, 282, 17, all ? '#2E7D32' : '#BCAAA4', '700');
  simTxt('（' + SIM.L + ' + ' + SIM.W + ' + ' + SIM.H + '）× 4 = ' + sum, 552, 304, 12.5, '#A1887F');
  simTxt('面 6 · 棱 12 · 顶点 8', 40, 72, 12, '#A1887F');

  if (all && SIM.L === SIM.W && SIM.W === SIM.H) {
    simTxt('12 条棱全一样长 → 正方体', 552, 330, 12.5, '#7B1FA2', '700');
  } else if (all) {
    simTxt('三组各 4 条，齐了', 552, 330, 12.5, '#2E7D32', '700');
  }
}

// ---- 交互 ----
function simRefresh() {
  var ro = document.getElementById('simReadout');
  var done = (SIM.l ? 4 : 0) + (SIM.w ? 4 : 0) + (SIM.h ? 4 : 0);
  if (ro) ro.textContent = SIM.L + ' × ' + SIM.W + ' × ' + SIM.H + ' · 已放 ' + done + '/12';

  var tp = document.getElementById('simTip');
  if (tp) {
    if (SIM.L === SIM.W && SIM.W === SIM.H) tp.textContent = '长宽高相等，这是正方体';
    else if (SIM.l && SIM.w && SIM.h) tp.textContent = '12 条棱搭齐了，换个尺寸再看看';
    else tp.textContent = '点画布也能搭一组';
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

function simAdd() {
  if (!SIM.l) {
    SIM.l = true;
    simDraw();
    simLog('放上 4 条<span class="hl">长棱</span>：都是 ' + SIM.L + ' 厘米');
  } else if (!SIM.w) {
    SIM.w = true;
    simDraw();
    simLog('放上 4 条<span class="hl">宽棱</span>：都是 ' + SIM.W + ' 厘米');
  } else if (!SIM.h) {
    SIM.h = true;
    simDraw();
    simLog('放上 4 条<span class="hl">高棱</span>：都是 ' + SIM.H + ' 厘米 —— 12 条齐了，4 + 4 + 4');
  } else {
    simLog('已经搭完 12 条了，点「换尺寸」或「重搭」');
  }
}

function simNextCase() {
  SIM.ci = (SIM.ci + 1) % SIM_CASES.length;
  SIM.L = SIM_CASES[SIM.ci][0];
  SIM.W = SIM_CASES[SIM.ci][1];
  SIM.H = SIM_CASES[SIM.ci][2];
  SIM.l = SIM.w = SIM.h = false;
  simDraw();
  simLog('换成 <span class="hl">' + SIM.L + ' × ' + SIM.W + ' × ' + SIM.H +
    '</span>，棱长总和 ' + (SIM.L + SIM.W + SIM.H) * 4 + ' 厘米');
}

function simReset() {
  SIM.l = SIM.w = SIM.h = false;
  simDraw();
  simLog('拆掉重搭');
}

function simAll() {
  SIM.l = SIM.w = SIM.h = true;
  simDraw();
  simLog('一次搭完：长 4 条 + 宽 4 条 + 高 4 条 = <span class="hl">12 条</span>');
}

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function (e) {
    var r = cv.getBoundingClientRect();
    var x = (e.clientX - r.left) * (SIM_W / r.width);
    var y = (e.clientY - r.top) * (SIM_H / r.height);
    if (x > 548) return;
    simAdd();
  });
}

// ===== 仿真：分数条拼接 —— 通分后相加 =====
var SIM_W = 880, SIM_H = 360;
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';

// [a分子, a分母, b分子, b分母]
var SIM_CASES = [[3, 8, 2, 8], [1, 4, 1, 6], [2, 3, 1, 4],
                 [3, 10, 1, 2], [5, 6, 1, 3], [1, 2, 1, 8]];
var SIM = { ci: 0, a: [3, 8], b: [2, 8], unified: false, added: false };

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

function simGcd(a, b) { return b === 0 ? a : simGcd(b, a % b); }
function simLcm(a, b) { return a * b / simGcd(a, b); }

function simFracText(cx, cy, a, b, size, color) {
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
  ctx.lineWidth = 2.6;
  ctx.stroke();
  ctx.restore();
}

function simBar(x, y, w, h, den, num, fill, rest, stroke) {
  var ctx = simCtx();
  var cw = w / den;
  ctx.save();
  simBox(x, y, w, h, rest, stroke, 4);
  for (var i = 0; i < den; i++) {
    if (i < num) {
      ctx.fillStyle = fill;
      ctx.fillRect(x + i * cw + 1.2, y + 1.2, cw - 2.4, h - 2.4);
    }
    if (i > 0) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + i * cw, y); ctx.lineTo(x + i * cw, y + h); ctx.stroke();
    }
  }
  simBox(x, y, w, h, null, stroke, 4);
  ctx.restore();
}

function simCurrent() {
  return { a: SIM.a, b: SIM.b, L: simLcm(SIM.a[1], SIM.b[1]) };
}

function simUnifiedNums() {
  var c = simCurrent(), L = c.L;
  return [c.a[0] * (L / c.a[1]), c.b[0] * (L / c.b[1]), L];
}

// ---- 绘制 ----
function simDraw() {
  var ctx = simCtx();
  if (!ctx) return;

  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.save();
  ctx.fillStyle = '#FDFBFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);
  ctx.restore();

  var c = simCurrent();
  var u = simUnifiedNums();
  var L = u[2], na = u[0], nb = u[1];

  simTxt('第 ' + (SIM.ci + 1) + ' 组：把两条分数条切成一样宽的小块', 34, 40, 18, '#5E35B1', '700');
  var sameDen = SIM.a[1] === SIM.b[1];
  var sub = SIM.unified ? '已通分：公分母 ' + L + '，两条都切成 ' + L + ' 份'
            : sameDen ? '分母本来就相同：两条都切成 ' + SIM.a[1] + ' 份，格子一样宽，可以直接加'
            : '还没通分：一条切 ' + SIM.a[1] + ' 份、一条切 ' + SIM.b[1] + ' 份，格子不一样宽';
  simTxt(sub, 34, 64, 12.5, (SIM.unified || sameDen) ? '#2E7D32' : '#E65100');

  var bx = 34, bw = 452, bh = 38;
  var da = SIM.unified ? L : SIM.a[1];
  var db = SIM.unified ? L : SIM.b[1];
  var pa = SIM.unified ? na : SIM.a[0];
  var pb = SIM.unified ? nb : SIM.b[0];

  simTxt(SIM.unified ? (na + '/' + L) : (SIM.a[0] + '/' + SIM.a[1]),
         bx, 100, 13, '#5E35B1', '700');
  simBar(bx + 66, 80, bw - 66, bh, da, pa, '#B39DDB', '#F1EAFB', '#7E57C2');

  simTxt('＋', bx, 158, 18, '#90A4AE', '700');
  simTxt(SIM.unified ? (nb + '/' + L) : (SIM.b[0] + '/' + SIM.b[1]),
         bx, 178, 13, '#E65100', '700');
  simBar(bx + 66, 158, bw - 66, bh, db, pb, '#FFB300', '#FFF8E1', '#FF8F00');

  simLine(bx + 66, 212, bx + bw, 212, '#D1C4E9', 1.4, [5, 4]);

  if (SIM.added) {
    simTxt('＝', bx, 258, 18, '#5E35B1', '700');
    simBar(bx + 66, 232, bw - 66, 44, L, na + nb, '#7E57C2', '#F1EAFB', '#5E35B1');
    simTxt('共 ' + (na + nb) + ' 个 1/' + L + ' → ' + (na + nb) + '/' + L,
           bx + 66, 302, 13, '#4A148C', '700');
  } else {
    simTxt('＝', bx, 258, 18, '#B0BEC5', '700');
    simBox(bx + 66, 232, bw - 66, 44, '#F7F4FB', '#D1C4E9', 4);
    simTxt('点「相加」看结果', bx + bw / 2 + 20, 259, 13, '#9E9E9E', '', 'center');
  }

  simDrawPanel();
  simRefresh();
}

function simDrawPanel() {
  var u = simUnifiedNums(), L = u[2], na = u[0], nb = u[1];
  simBox(510, 54, 336, 280, '#FFFFFF', '#D1C4E9', 10);

  simTxt('算式', 532, 84, 12.5, '#8D6E63');
  simTxt(SIM.a[0] + '/' + SIM.a[1] + ' ＋ ' + SIM.b[0] + '/' + SIM.b[1],
         532, 110, 17, '#5E35B1', '700');

  simLine(532, 126, 824, 126, '#EDE7F6', 1.2);

  if (!SIM.unified && SIM.a[1] !== SIM.b[1]) {
    simTxt('公分母', 532, 150, 12, '#8D6E63');
    simTxt('lcm(' + SIM.a[1] + ', ' + SIM.b[1] + ') = ' + L, 532, 174, 15, '#E65100', '700');
    simTxt('先点「① 通分」', 532, 200, 12.5, '#9E9E9E');
    simTxt('两条格子不一样宽，', 532, 232, 12, '#8D6E63');
    simTxt('现在还不能把格数相加。', 532, 252, 12, '#8D6E63');
  } else if (!SIM.unified) {
    simTxt('分母相同', 532, 150, 12, '#8D6E63');
    simTxt('两条都切成 ' + SIM.a[1] + ' 份', 532, 176, 15, '#2E7D32', '700');
    simTxt('格子本来就一样宽，不用通分', 532, 202, 12.5, '#5D4037', '700');
    simTxt('直接点「② 相加」', 532, 230, 12.5, '#9E9E9E');
  } else if (!SIM.added) {
    simTxt('通分完成', 532, 150, 12, '#8D6E63');
    simTxt(na + '/' + L + ' ＋ ' + nb + '/' + L, 532, 176, 17, '#2E7D32', '700');
    simTxt('分母相同了，只加分子', 532, 202, 12.5, '#5D4037', '700');
    simTxt('点「② 相加」看结果条', 532, 230, 12, '#9E9E9E');
  } else {
    var s = na + nb, g = simGcd(s, L);
    simTxt('结果', 532, 150, 12, '#8D6E63');
    simFracText(596, 182, s, L, 32, '#5E35B1');
    if (g > 1) {
      simTxt('＝', 646, 182, 16, '#90A4AE', '700');
      simFracText(716, 182, s / g, L / g, 32, '#2E7D32');
      simTxt('约分后', 532, 226, 12, '#2E7D32', '700');
    } else {
      simTxt('已是最简，不用约分', 668, 182, 13, '#2E7D32', '700');
      simTxt('分子 ' + s + ' 和分母 ' + L + ' 互质', 532, 226, 12, '#9E9E9E');
    }
    simTxt(s > L ? '结果大于 1，比一整条还长' : '结果小于 1，不到一整条',
           532, 262, 12, s > L ? '#E65100' : '#5D4037', '700');
  }

  simTxt('分母相同 → 只加减分子', 532, 310, 12, '#4A148C', '700');
}

// ---- 交互 ----
function simRefresh() {
  var ro = document.getElementById('simReadout');
  var tp = document.getElementById('simTip');
  var u = simUnifiedNums(), L = u[2], na = u[0], nb = u[1];
  if (ro) {
    if (SIM.added) {
      var s = na + nb, g = simGcd(s, L);
      ro.textContent = SIM.a[0] + '/' + SIM.a[1] + ' ＋ ' + SIM.b[0] + '/' + SIM.b[1] +
        ' ＝ ' + s + '/' + L + (g > 1 ? '（＝' + (s / g) + '/' + (L / g) + '）' : '');
    } else if (SIM.unified) {
      ro.textContent = na + '/' + L + ' ＋ ' + nb + '/' + L + '（已通分）';
    } else {
      ro.textContent = SIM.a[0] + '/' + SIM.a[1] + ' ＋ ' + SIM.b[0] + '/' + SIM.b[1];
    }
  }
  if (tp) {
    tp.textContent = SIM.added ? '点画布换下一组'
      : (SIM.unified || SIM.a[1] === SIM.b[1]) ? '点「② 相加」' : '点「① 通分」';
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

function simUnify() {
  if (SIM.a[1] === SIM.b[1]) {
    simLog('这组分母都是 <span class="hl">' + SIM.a[1] + '</span>，格子本来就一样宽，直接点「② 相加」');
    return;
  }
  if (SIM.unified) { simLog('这组已经通分过了，公分母是 <span class="hl">' + simCurrent().L + '</span>'); return; }
  var u = simUnifiedNums();
  SIM.unified = true;
  simDraw();
  simLog('通分：公分母 <span class="hl">' + u[2] + '</span>，两个分数变成 ' +
    u[0] + '/' + u[2] + ' 和 ' + u[1] + '/' + u[2]);
}

function simAddFrac() {
  if (!SIM.unified && SIM.a[1] !== SIM.b[1]) { simLog('先点「① 通分」，格子不一样宽不能相加'); return; }
  if (SIM.added) { simLog('这组已经算完了，点「换一组」继续'); return; }
  var u = simUnifiedNums(), s = u[0] + u[1], g = simGcd(s, u[2]);
  SIM.added = true;
  simDraw();
  simLog('相加：<span class="hl">' + u[0] + '＋' + u[1] + '＝' + s + '</span>，得 ' + s + '/' + u[2] +
    (g > 1 ? '，约分后 ' + (s / g) + '/' + (u[2] / g) : '，已是最简'));
}

function simNext() {
  SIM.ci = (SIM.ci + 1) % SIM_CASES.length;
  var c = SIM_CASES[SIM.ci];
  SIM.a = [c[0], c[1]];
  SIM.b = [c[2], c[3]];
  SIM.unified = false;
  SIM.added = false;
  simDraw();
  simLog('换一组：<span class="hl">' + SIM.a[0] + '/' + SIM.a[1] + ' ＋ ' +
    SIM.b[0] + '/' + SIM.b[1] + '</span>');
}

function simReset() {
  SIM.ci = 0;
  var c = SIM_CASES[0];
  SIM.a = [c[0], c[1]];
  SIM.b = [c[2], c[3]];
  SIM.unified = false;
  SIM.added = false;
  simDraw();
  simLog('重来：3/8 ＋ 2/8，分母本来就相同');
}

function simStep() {
  if (SIM.added) { simNext(); return; }
  if (SIM.a[1] !== SIM.b[1] && !SIM.unified) { simUnify(); return; }
  simAddFrac();
}

function simCase() {
  return SIM.a[0] + '/' + SIM.a[1] + '+' + SIM.b[0] + '/' + SIM.b[1];
}

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function (e) {
    var r = cv.getBoundingClientRect();
    var x = (e.clientX - r.left) * (SIM_W / r.width);
    if (x > 500) { simNext(); return; }
    simStep();
  });
}

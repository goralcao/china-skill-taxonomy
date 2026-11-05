// ===== 仿真：天平分组模拟 —— 平均三份为什么最省 =====
var SIM_W = 880, SIM_H = 360;
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';
var SIM_CASES = [3, 9, 27, 81];

var SIM = { ci: 1, n: 9, split: 3, defective: 5, cand: [], weighed: 0, done: false, last: null };

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

function simTheory(n, s) { return Math.ceil(Math.log(n) / Math.log(s)); }

function simParts() {
  var len = SIM.cand.length, k = SIM.split;
  var base = Math.floor(len / k), rem = len % k, out = [], at = 0;
  for (var i = 0; i < k; i++) {
    var sz = base + (i < rem ? 1 : 0);
    out.push(SIM.cand.slice(at, at + sz));
    at += sz;
  }
  return out;
}

function simLoad(i, split) {
  SIM.ci = i;
  SIM.n = SIM_CASES[i];
  SIM.split = split;
  SIM.defective = Math.floor(SIM.n * 0.62);
  SIM.cand = [];
  for (var j = 0; j < SIM.n; j++) SIM.cand.push(j);
  SIM.weighed = 0;
  SIM.done = false;
  SIM.last = null;
}

// ---- 绘制 ----
function simDraw() {
  var ctx = simCtx();
  if (!ctx) return;
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.save(); ctx.fillStyle = '#FEFDFB'; ctx.fillRect(0, 0, SIM_W, SIM_H); ctx.restore();

  simTxt('第 ' + (SIM.ci + 1) + ' 组 · ' + SIM.n + ' 瓶，分 ' + SIM.split + ' 份', 34, 38, 18, '#4E342E', '700');
  simTxt('取两份上天平，按结果锁定含次品的那份；分 3 份时还有一份留在外面', 34, 62, 12.5, '#6D4C41');

  simDrawBalance();
  simDrawCandBar();
  simDrawPanel();
  simRefresh();
}

function simDrawBalance() {
  var cx = 252, cy = 140;
  var parts = simParts();
  var shown = SIM.last ? SIM.last.parts : parts;
  var hit = SIM.last ? SIM.last.hit : -1;
  var dy = SIM.last ? (hit === 0 ? 12 : hit === 1 ? -12 : 0) : 0;
  var lx = cx - 128, rx = cx + 128;
  var ly = cy - dy, ry = cy + dy;

  // 支架
  var ctx = simCtx();
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, cy + 6); ctx.lineTo(cx - 16, cy + 56); ctx.lineTo(cx + 16, cy + 56);
  ctx.closePath(); ctx.fillStyle = '#8D6E63'; ctx.fill();
  ctx.strokeStyle = '#4E342E'; ctx.lineWidth = 1.4; ctx.stroke();
  ctx.restore();
  simLine(cx - 40, cy + 58, cx + 40, cy + 58, '#4E342E', 2.4);

  // 横梁
  simLine(lx, ly, rx, ry, '#4E342E', 3.2);
  simDot(cx, cy, 5, '#26A69A', '#FFFFFF');

  // 吊绳 + 托盘
  [lx, rx].forEach(function (x, i) {
    var y = i === 0 ? ly : ry;
    simLine(x, y, x, y + 34, '#8D6E63', 1.4);
    var isHit = (hit === i);
    simBox(x - 56, y + 34, 112, 42, isHit ? '#80CBC4' : '#EFEBE9',
           isHit ? '#00695C' : '#BCAAA4', 6);
    simTxt('第 ' + (i + 1) + ' 份', x, y + 52, 11.5, isHit ? '#004D40' : '#6D4C41', '700', 'center');
    simTxt(shown[i] ? shown[i].length + ' 瓶' : '—', x, y + 70, 12, isHit ? '#004D40' : '#4E342E', '700', 'center');
  });

  // 留在外面的第三份（放到右上方，避开托盘）
  if (SIM.split === 3) {
    var isHit3 = (hit === 2);
    simBox(398, 90, 98, 48, isHit3 ? '#80CBC4' : '#F5F5F5',
           isHit3 ? '#00695C' : '#CFD8DC', 6);
    simTxt(isHit3 ? '✓ 第 3 份（次品）' : '第 3 份 · 不上秤',
           447, 110, 11, isHit3 ? '#004D40' : '#78909C', '700', 'center');
    simTxt((shown[2] ? shown[2].length : 0) + ' 瓶', 447, 130, 12,
           isHit3 ? '#004D40' : '#546E7A', '700', 'center');
  }

  // 结果文字
  if (!SIM.last) {
    simTxt('还没称：点「① 称一次」开始', 34, 248, 14, '#8D6E63');
  } else {
    var res = hit === 0 ? '左边翘起（轻）→ 次品在左盘' :
              hit === 1 ? '右边翘起（轻）→ 次品在右盘' :
              hit === 2 ? '天平平衡 → 次品在没上秤那份' : '右边翘起（轻）→ 次品在右盘';
    simTxt(res, 34, 248, 14, '#00695C', '700');
  }
}

function simDot(x, y, r, fill, stroke) {
  var ctx = simCtx();
  ctx.save();
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
  ctx.restore();
}

function simDrawCandBar() {
  var x = 34, y = 282, w = 452, h = 26;
  simTxt('嫌疑范围：候选 ' + SIM.cand.length + ' / ' + SIM.n + ' 瓶　·　已排除 ' +
         (SIM.n - SIM.cand.length) + ' 瓶', x, y - 8, 12, '#4E342E', '700');
  simBox(x, y, w, h, '#EFEBE9', '#D7CCC8', 5);
  var ratio = SIM.cand.length / SIM.n;
  if (ratio > 0) simBox(x + 1, y + 1, Math.max(4, (w - 2) * ratio), h - 2, '#26A69A', null, 4);
}

function simDrawPanel() {
  simBox(516, 54, 330, 280, '#FFFFFF', '#D7CCC8', 10);

  simTxt('数量', 538, 84, 12, '#8D6E63');
  simTxt(SIM.n + ' 瓶', 538, 110, 21, '#4E342E', '700');
  simTxt('分法：' + SIM.split + ' 份' + (SIM.split === 3 ? '（最优）' : '（对照）'),
         538, 134, 13, SIM.split === 3 ? '#00695C' : '#C62828', '700');

  simLine(538, 150, 824, 150, '#EFEBE9', 1.2);

  simTxt('已称次数', 538, 174, 12, '#8D6E63');
  simTxt(SIM.weighed + ' 次', 538, 200, 21, '#4E342E', '700');
  simTxt('理论最少：' + simTheory(SIM.n, SIM.split) + ' 次', 676, 200, 13, '#00695C', '700');

  simTxt('当前候选：' + SIM.cand.length + ' 瓶', 538, 228, 12.5, '#4E342E', '700');
  simTxt('每次缩到约 1/' + SIM.split, 538, 250, 12.5, '#6D4C41', '700');

  simLine(538, 266, 824, 266, '#EFEBE9', 1.2);

  if (SIM.done) {
    simTxt('✓ 找到了：第 ' + (SIM.defective + 1) + ' 瓶', 538, 292, 15, '#00695C', '700');
    simTxt(SIM.split === 3 ? '分 3 份，次数最少' : '换成 3 份会更省', 538, 314, 12, '#4E342E', '700');
  } else {
    simTxt('还没找到，继续称', 538, 292, 14, '#C62828', '700');
    simTxt('点「① 称一次」或画布', 538, 314, 12, '#8D6E63');
  }
}

// ---- 交互 ----
function simRefresh() {
  var ro = document.getElementById('simReadout');
  var tp = document.getElementById('simTip');
  if (ro) ro.textContent = SIM.n + ' 瓶 · 分 ' + SIM.split + ' 份 · 已称 ' +
    SIM.weighed + ' 次 · 候选 ' + SIM.cand.length + ' 瓶';
  if (tp) tp.textContent = SIM.done ? '找到了，点「重来」再试' : '点画布称一次';
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

function simWeigh() {
  if (SIM.done) { simLog('已经找到第 <span class="hl">' + (SIM.defective + 1) + '</span> 瓶了，点「重来」或「换数量」'); return; }
  var parts = simParts(), before = SIM.cand.length, hit = -1;
  for (var i = 0; i < parts.length; i++) {
    if (parts[i].indexOf(SIM.defective) >= 0) { hit = i; break; }
  }
  if (hit < 0) hit = parts.length - 1;
  SIM.cand = parts[hit];
  SIM.weighed++;
  SIM.last = { parts: parts, hit: hit, before: before };
  if (SIM.cand.length === 1) SIM.done = true;
  simDraw();
  var sizes = parts.map(function (p) { return p.length; }).join('、');
  simLog('第 ' + SIM.weighed + ' 次：分成 <span class="hl">' + sizes + '</span>，次品落在第 ' +
    (hit + 1) + ' 份，嫌疑 ' + before + ' → ' + SIM.cand.length + ' 瓶' +
    (SIM.done ? '，<span class="hl">找到了</span>' : ''));
}

function simSplit(k) {
  simLoad(SIM.ci, k);
  simDraw();
  simLog('改成分 <span class="hl">' + k + ' 份</span>：理论最少 ' + simTheory(SIM.n, k) + ' 次，重新称');
}

function simNext() {
  simLoad((SIM.ci + 1) % SIM_CASES.length, SIM.split);
  simDraw();
  simLog('换数量：<span class="hl">' + SIM.n + ' 瓶</span>，分 ' + SIM.split + ' 份，理论最少 ' +
    simTheory(SIM.n, SIM.split) + ' 次');
}

function simReset() {
  simLoad(SIM.ci, SIM.split);
  simDraw();
  simLog('重来：' + SIM.n + ' 瓶，分 ' + SIM.split + ' 份');
}

function simCase() { return SIM.n + '/' + SIM.split + '/' + SIM.weighed; }

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function () { simWeigh(); });
}

simLoad(1, 3);

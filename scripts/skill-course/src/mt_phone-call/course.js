// ===== 仿真：时间轴扩散 —— 过 1 分钟，人数翻一倍 =====
var SIM_W = 880, SIM_H = 360;
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';
var SIM_TARGETS = [7, 15, 31, 63];

var SIM = { ti: 1, target: 15, minute: 0 };

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

function simPow2(n) { return Math.pow(2, n); }
function simStudents(m) { return simPow2(m) - 1; }
function simNew(m) { return m === 0 ? 0 : simPow2(m - 1); }
function simMinFor(n) {
  var p = 1, k = 0;
  while (p < n + 1) { p *= 2; k++; }
  return k;
}

function simRowY(m) { return 96 + m * 37; }

function simRowX(m, i) {
  var n = m === 0 ? 1 : simNew(m);
  var sp = Math.min(34, 340 / Math.max(1, n));
  return 310 - (n - 1) * sp / 2 + i * sp;
}

function simRowR(m) {
  var n = m === 0 ? 1 : simNew(m);
  var sp = Math.min(34, 340 / Math.max(1, n));
  return Math.min(8, sp * 0.38);
}

// ---- 绘制 ----
function simDraw() {
  var ctx = simCtx();
  if (!ctx) return;
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.save(); ctx.fillStyle = '#FFFCFA'; ctx.fillRect(0, 0, SIM_W, SIM_H); ctx.restore();

  simTxt('第 ' + (SIM.ti + 1) + ' 组 · 要通知 ' + SIM.target + ' 个同学', 34, 38, 18, '#BF360C', '700');
  simTxt('每层圆点是「这一分钟新通知的人」，下一层永远是上一层的两倍', 34, 62, 12.5, '#6D4C41');

  // 前几层的父子连线
  for (var m = 1; m <= Math.min(SIM.minute, 3); m++) {
    var pn = m === 1 ? 1 : simNew(m - 1);
    var cn = simNew(m);
    for (var i = 0; i < pn; i++) {
      var px = simRowX(m - 1, i), py = simRowY(m - 1);
      for (var d = 0; d < 2; d++) {
        var ci = i * 2 + d;
        if (ci >= cn) break;
        simLine(px, py + 6, simRowX(m, ci), simRowY(m) - 6, '#FFCC80', 1.2);
      }
    }
  }

  // 逐层节点：只画已经发生的层，未发生的用虚线占位
  for (var k = 0; k <= 6; k++) {
    var n = k === 0 ? 1 : simNew(k);
    var y = simRowY(k);
    var active = k <= SIM.minute;
    var label = k === 0 ? '老师 1 人' : ('第' + k + '分 +' + n);
    simTxt(label, 34, y + 4, 11.5, active ? '#BF360C' : '#CDBDBD', active ? '700' : '');
    if (active) {
      var r = simRowR(k);
      for (var j = 0; j < n; j++) {
        simDot(simRowX(k, j), y, r,
               k === 0 ? '#FFB74D' : '#4FC3F7',
               k === 0 ? '#E65100' : '#0288D1');
      }
    } else {
      simLine(150, y, 470, y, '#ECEFF1', 1.2, [5, 5]);
      simTxt('还没到这一分钟', 310, y - 6, 10.5, '#CFD8DC', '', 'center');
    }
  }

  simDrawPanel();
  simRefresh();
}

function simDrawPanel() {
  var need = simMinFor(SIM.target), students = simStudents(SIM.minute);
  var left = Math.max(0, SIM.target - students);
  simBox(516, 54, 330, 280, '#FFFFFF', '#FFCC80', 10);

  simTxt('目标：通知', 538, 84, 12, '#8D6E63');
  simTxt(SIM.target + ' 个同学', 538, 110, 20, '#BF360C', '700');
  simTxt('学生数 + 1 = ' + (SIM.target + 1) + '，最少 ' + need + ' 分钟', 538, 134, 12.5, '#01579B', '700');

  simLine(538, 150, 824, 150, '#FFF3E0', 1.2);

  simTxt('现在第', 538, 174, 12, '#8D6E63');
  simTxt(SIM.minute + ' 分钟', 620, 174, 14, '#BF360C', '700');
  simTxt('这一分钟新通知', 538, 198, 12, '#8D6E63');
  simTxt(simNew(SIM.minute) + ' 人', 692, 198, 14, '#0288D1', '700');
  simTxt('累计学生', 538, 222, 12, '#8D6E63');
  simTxt(students + ' 人', 660, 222, 14, '#BF360C', '700');
  simTxt('含老师共', 538, 244, 12, '#8D6E63');
  simTxt(simPow2(SIM.minute) + ' 人', 660, 244, 13, '#546E7A', '700');

  simLine(538, 258, 824, 258, '#FFF3E0', 1.2);

  simTxt('还差', 538, 282, 12, '#8D6E63');
  simTxt(left + ' 人', 620, 282, 15, left ? '#C62828' : '#2E7D32', '700');
  simTxt('最少需要 ' + need + ' 分钟', 690, 282, 13, '#01579B', '700');
  simTxt(left === 0 ? '✓ 已经通知完所有人' : '继续过 1 分钟看看',
         538, 308, 13, left === 0 ? '#2E7D32' : '#C62828', '700');
  simTxt('学生数 = 2ⁿ − 1　·　含老师 = 2ⁿ', 538, 328, 11.5, '#6D4C41');
}

// ---- 交互 ----
function simRefresh() {
  var ro = document.getElementById('simReadout');
  var tp = document.getElementById('simTip');
  if (ro) ro.textContent = '通知 ' + SIM.target + ' 人 · 第 ' + SIM.minute +
    ' 分钟 · 已通知 ' + Math.min(simStudents(SIM.minute), SIM.target) + ' 人';
  if (tp) tp.textContent = simStudents(SIM.minute) >= SIM.target ? '通知完了，点「换目标人数」' : '点画布过 1 分钟';
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

function simNextMinute() {
  if (SIM.minute >= 6) { simLog('最多演示到第 6 分钟，点「换目标人数」或「重来」'); return; }
  SIM.minute++;
  simDraw();
  simLog('第 ' + SIM.minute + ' 分钟：新通知 <span class="hl">' + simNew(SIM.minute) +
    ' 人</span>，累计学生 <span class="hl">' + simStudents(SIM.minute) + ' 人</span>');
}

function simRunAll() {
  var need = simMinFor(SIM.target);
  SIM.minute = Math.min(6, need);
  simDraw();
  simLog('一键到底：通知 ' + SIM.target + ' 人最少 <span class="hl">' + need +
    ' 分钟</span>（学生数 2ⁿ − 1）');
}

function simNextTarget() {
  SIM.ti = (SIM.ti + 1) % SIM_TARGETS.length;
  SIM.target = SIM_TARGETS[SIM.ti];
  SIM.minute = 0;
  simDraw();
  simLog('换目标：通知 <span class="hl">' + SIM.target + ' 人</span>，最少 ' +
    simMinFor(SIM.target) + ' 分钟');
}

function simReset() {
  SIM.minute = 0;
  simDraw();
  simLog('重来：回到第 0 分钟，只有老师知道消息');
}

function simCase() { return SIM.target + '/' + SIM.minute; }

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function () { simNextMinute(); });
}

// ===== 仿真：四根柱子先合后分、移多补少削平 =====
var SIM_W = 880, SIM_H = 360;
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';
var SIM_BASE = 280;                 // 柱子基线
var SIM_BX = [70, 170, 270, 370];   // 四根柱的 x
var SIM_BW = 64;
var SIM_PX = 560;                   // 右侧面板

var SIM_CASES = [
  { name: '跳绳 · 悬殊版', data: [80, 120, 70, 130], unit: '下' },
  { name: '收集矿泉水瓶', data: [18, 24, 15, 23], unit: '个' },
  { name: '每天阅读', data: [30, 45, 25, 40], unit: '分钟' },
  { name: '来了个 100', data: [20, 22, 18, 100], unit: '分' }
];

// step: 0 原始 / 1 求总数 / 2 画平均线 / 3 移多补少 / 4 齐平完成
var SIM = { i: 0, step: 0, k: 0, vals: SIM_CASES[0].data.slice(), hot: [] };

function simCtx() { return document.getElementById('simCanvas').getContext('2d'); }

function simTxt(t, x, y, size, color, weight, align) {
  var ctx = simCtx();
  ctx.save();
  ctx.font = (weight ? weight.trim() + ' ' : '') + size + 'px ' + SIM_FONT;
  ctx.fillStyle = color;
  ctx.textAlign = align || 'left';
  ctx.fillText(t, x, y);
  ctx.restore();
}

function simLine(x1, y1, x2, y2, color, w, dash) {
  var ctx = simCtx();
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = w || 2;
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.restore();
}

function simRect(x, y, w, h, fill, stroke, r) {
  var ctx = simCtx();
  r = r || 0;
  ctx.save();
  ctx.beginPath();
  if (r) {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  } else {
    ctx.rect(x, y, w, h);
  }
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.6; ctx.stroke(); }
  ctx.restore();
}

function simTotal() {
  var s = 0;
  for (var i = 0; i < SIM.vals.length; i++) s += SIM.vals[i];
  return s;
}
function simAvg() { return simTotal() / SIM.vals.length; }
function simMax() { return Math.max.apply(null, SIM.vals); }
function simMin() { return Math.min.apply(null, SIM.vals); }
function simScale() { return 175 / Math.max(1, simMax()); }
function simY(v) { return SIM_BASE - v * simScale(); }

function simCur() { return SIM_CASES[SIM.i]; }

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);
  SIM.hot = [];
  var vals = SIM.vals, n = vals.length;
  var total = simTotal(), avg = simAvg(), sc = simScale(), avgY = simY(avg);
  var step = SIM.step;

  simTxt('① 四根柱子，高高低低', 40, 30, 14, '#006064', 'bold ');
  simTxt('② 先合后分，再削平', SIM_PX, 30, 14, '#006064', 'bold ');

  // 基线
  simLine(46, SIM_BASE, 452, SIM_BASE, '#006064', 2);

  // 平均线（step>=2）
  if (step >= 2) {
    simLine(46, avgY, 452, avgY, '#FF8F00', 2, [7, 5]);
    simTxt('平均 ' + avg, 456, avgY + 5, 13, '#E65100', 'bold ');
  }

  // 四根柱子
  for (var i = 0; i < n; i++) {
    var x = SIM_BX[i], v = vals[i], top = simY(v);
    var sel = (i === SIM.k);

    if (step === 4) {
      // 齐平：画到平均线，原高度用淡灰虚线标出
      simRect(x, avgY, SIM_BW, SIM_BASE - avgY, '#FFB74D', '#E65100', 4);
      simLine(x, top, x + SIM_BW, top, '#B0BEC5', 1.4, [4, 4]);
      simTxt(String(avg), x + SIM_BW / 2, avgY - 8, 15, '#E65100', 'bold ', 'center');
    } else {
      simRect(x, top, SIM_BW, SIM_BASE - top, '#4DD0E1', sel ? '#E65100' : '#00838F', 4);
      // step 3 柱顶留给「多 / 补」标注，避免与数值叠在一起
      if (step < 3) simTxt(String(v), x + SIM_BW / 2, top - 8, 15, '#006064', 'bold ', 'center');

      // step 3：多出 / 不足
      if (step === 3) {
        if (v > avg) {
          simRect(x, top, SIM_BW, avgY - top, 'rgba(198,40,40,.16)', '#E57373', 0);
          simTxt('多 +' + (v - avg), x + SIM_BW / 2, (top + avgY) / 2 + 5, 12, '#C62828', 'bold ', 'center');
        } else if (v < avg) {
          simRect(x, avgY, SIM_BW, top - avgY, 'rgba(46,125,50,.10)', '#66BB6A', 0);
          simLine(x, top, x + SIM_BW, top, '#2E7D32', 1.6, [4, 3]);
          simTxt('补 +' + (avg - v), x + SIM_BW / 2, (top + avgY) / 2 + 5, 12, '#2E7D32', 'bold ', 'center');
        }
      }
    }

    simTxt('第 ' + (i + 1) + ' 根', x + SIM_BW / 2, 300, 12, sel ? '#E65100' : '#607D8B', sel ? 'bold ' : '', 'center');
    SIM.hot.push({
      x: x, y: 40, w: SIM_BW, h: SIM_BASE - 40,
      fn: (function (idx) { return function () { simPick(idx); }; })(i)
    });
  }

  // 总数条（step>=1）
  if (step >= 1) {
    simRect(60, 320, 360, 22, '#FFE0B2', '#FF8F00', 5);
    simTxt('总数 ' + total + ' = 四根加起来', 240, 336, 12.5, '#E65100', 'bold ', 'center');
  }

  // 右侧四个步骤条
  var expr = vals.join(' + ');
  var steps = [
    '① 四个数：' + vals.join(' / '),
    '② 求总数：' + expr + ' = ' + total,
    '③ 数份数：一共 ' + n + ' 份',
    '④ 平均数：' + total + ' ÷ ' + n + ' = ' + avg
  ];
  for (var k = 0; k < 4; k++) {
    var y0 = 64 + k * 52;
    var done = k < step, cur = k === step;
    var bg = done ? '#E8F5E9' : (cur ? '#FFF3E0' : '#F5FAFA');
    var st = done ? '#A5D6A7' : (cur ? '#FF8F00' : '#B2DFDB');
    simRect(SIM_PX, y0, 296, 44, bg, st, 8);
    var mark = done ? '✓' : (cur ? '→' : String(k + 1));
    simTxt(mark, SIM_PX + 14, y0 + 28, 15,
      done ? '#2E7D32' : (cur ? '#E65100' : '#90A4AE'), 'bold ');
    simTxt(steps[k], SIM_PX + 36, y0 + 28, 13.5,
      done ? '#2E7D32' : (cur ? '#E65100' : '#607D8B'), cur ? 'bold ' : '');
  }

  // 结论框
  var cy = 280;
  var allDone = step >= 4;
  simRect(SIM_PX, cy, 296, 58, allDone ? '#E8F5E9' : '#F5FAFA', allDone ? '#66BB6A' : '#B2DFDB', 10);
  simTxt(allDone ? '削平后每根都是 ' + avg : '再按「下一步」继续',
    SIM_PX + 16, cy + 26, 17, allDone ? '#2E7D32' : '#006064', 'bold ');
  simTxt('总数 ' + total + ' 不变 · 平均在 ' + simMin() + ' ~ ' + simMax() + ' 之间',
    SIM_PX + 16, cy + 48, 12, '#607D8B');

  simRefresh();
}

function simRefresh() {
  var vals = SIM.vals;
  var total = simTotal(), avg = simAvg();
  var rd = document.getElementById('simReadout');
  var tp = document.getElementById('simTip');
  var msgs = [
    '原始数据：' + vals.join(' / '),
    '合成总数：' + vals.join(' + ') + ' = ' + total,
    '平均线画好了：' + total + ' ÷ ' + vals.length + ' = ' + avg,
    '移多补少：多出的正好补上缺的',
    '四根齐平，平均数就是 ' + avg
  ];
  if (rd) rd.textContent = msgs[SIM.step] || msgs[0];
  if (tp) tp.textContent = '总数 ' + total + ' · ' + vals.length + ' 人 · 平均 ' + avg;
}

function simLog(msg, hl) {
  var box = document.getElementById('simLog');
  if (!box) return;
  var d = document.createElement('div');
  d.className = 'sim-log-line';
  if (hl) { var s = document.createElement('span'); s.className = 'hl'; s.textContent = msg; d.appendChild(s); }
  else d.textContent = msg;
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
}

function simPick(k) {
  if (k === undefined || isNaN(k) || k < 0 || k >= SIM.vals.length) return;
  SIM.k = k;
  simDraw();
  simLog('选中第 ' + (k + 1) + ' 根（' + SIM.vals[k] + '），按「给这根加 4」看平均线怎么动');
}

function simBump() {
  SIM.vals[SIM.k] += 4;
  simDraw();
  simLog('第 ' + (SIM.k + 1) + ' 根加到 ' + SIM.vals[SIM.k] + '：总数变 ' + simTotal() +
    '，平均线抬到 ' + simAvg(), true);
}

function simNext() {
  if (SIM.step >= 4) {
    simLog('四根都齐平了，平均数就是 ' + simAvg() + '，可以换一组数据', true);
    return;
  }
  SIM.step++;
  simDraw();
  var msgs = [
    '',
    '第一步：把四根合起来，总数 ' + simTotal(),
    '第二步：画平均线，' + simTotal() + ' ÷ ' + SIM.vals.length + ' = ' + simAvg(),
    '第三步：高于平均线的匀给低于平均线的，多出与不足正好相等',
    '第四步：四根齐平在 ' + simAvg() + '，这个高度就是平均数'
  ];
  simLog(msgs[SIM.step]);
  if (SIM.step === 4) simLog('削平完成，总数 ' + simTotal() + ' 一点没变', true);
}

function simPrev() {
  if (SIM.step > 0) { SIM.step--; simDraw(); simLog('退回上一步'); }
  else simLog('已经回到原始数据了');
}

function simCase(k) {
  if (k === undefined || isNaN(k)) k = (SIM.i + 1) % SIM_CASES.length;
  k = ((k % SIM_CASES.length) + SIM_CASES.length) % SIM_CASES.length;
  SIM.i = k; SIM.step = 0; SIM.k = 0;
  SIM.vals = SIM_CASES[k].data.slice();
  simDraw();
  simLog('换一组「' + simCur().name + '」：' + SIM.vals.join(' / ') +
    '，总数 ' + simTotal() + '，平均 ' + simAvg(), true);
}

function simReset() {
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  SIM.step = 0; SIM.k = 0;
  SIM.vals = simCur().data.slice();
  simDraw();
  simLog('重来：四根柱子回到高低不齐的样子');
}

function simDemo() {
  simReset();
  var k = 0;
  var timer = setInterval(function () {
    if (k >= 4) { clearInterval(timer); return; }
    SIM.step = k + 1;
    simDraw();
    simLog('第 ' + (k + 1) + ' 步完成');
    if (k === 3) simLog('自动演示完成，四根齐平在 ' + simAvg(), true);
    k++;
  }, 700);
}

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function (e) {
    var rect = cv.getBoundingClientRect();
    var x = (e.clientX - rect.left) * SIM_W / rect.width;
    var y = (e.clientY - rect.top) * SIM_H / rect.height;
    for (var i = 0; i < SIM.hot.length; i++) {
      var h = SIM.hot[i];
      if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) { h.fn(); return; }
    }
  });
}

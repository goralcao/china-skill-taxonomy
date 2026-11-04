// ===== 仿真：沿对称轴逐点翻折，镜像点距离联动 =====
var SIM_W = 880, SIM_H = 360;
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';
var SIM_AX = 440;          // 对称轴 x
var SIM_CM = 20;           // 20px = 1 厘米
var SIM_STEP = 40;         // 每次挪 2 厘米

// 每个案例首尾两点都落在对称轴上，闭合后正好是「半个图形」
var SIM_CASES = [
  {
    name: '菱形', axes: '1 条',
    pts: [[440, 80], [280, 180], [440, 280]],
    names: ['A', 'B', 'C']
  },
  {
    name: '半个爱心', axes: '1 条',
    pts: [[440, 80], [360, 100], [280, 180], [300, 260], [440, 280]],
    names: ['A', 'B', 'C', 'D', 'E']
  },
  {
    name: '半只蝴蝶', axes: '1 条',
    pts: [[440, 120], [360, 80], [260, 120], [240, 200], [340, 220], [440, 200]],
    names: ['A', 'B', 'C', 'D', 'E', 'F']
  },
  {
    name: '阶梯小树', axes: '1 条',
    pts: [[440, 80], [360, 80], [360, 160], [280, 160], [280, 260], [440, 260]],
    names: ['A', 'B', 'C', 'D', 'E', 'F']
  }
];

// step = 已翻的点数；k = 当前操作的点；shift = 0/1/2 三档距离
var SIM = { i: 0, step: 0, k: 1, shift: 0, hot: [] };

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

function simPanel(x, y, w, h, fill, stroke, r) {
  var ctx = simCtx();
  r = r || 8;
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

function simCircle(x, y, rad, fill, stroke) {
  var ctx = simCtx();
  ctx.save();
  ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.8; ctx.stroke(); }
  ctx.restore();
}

function simPoly(pts, mirror, fill, stroke, dash) {
  var ctx = simCtx();
  ctx.save();
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath();
  for (var i = 0; i < pts.length; i++) {
    var x = mirror ? (2 * SIM_AX - pts[i].x) : pts[i].x;
    if (i === 0) ctx.moveTo(x, pts[i].y);
    else ctx.lineTo(x, pts[i].y);
  }
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
  ctx.restore();
}

function simCur() { return SIM_CASES[SIM.i]; }

function simPts() {
  var c = simCur();
  return c.pts.map(function (p, idx) {
    var x = p[0];
    if (idx === SIM.k) x -= SIM.shift * SIM_STEP;
    return { x: x, y: p[1], name: c.names[idx], onAxis: (p[0] === SIM_AX), idx: idx };
  });
}

function simMirror(p) { return { x: 2 * SIM_AX - p.x, y: p.y }; }

function simDist(p) { return (SIM_AX - p.x) / SIM_CM; }

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);
  SIM.hot = [];
  var c = simCur();
  var pts = simPts();
  var n = pts.length;
  var full = SIM.step >= n;

  simTxt('① 左边的半个图形', 30, 30, 14, '#6A1B9A', 'bold ');
  simTxt('② 翻过去的镜像点', 470, 30, 14, '#6A1B9A', 'bold ');

  // 对称轴
  simLine(SIM_AX, 50, SIM_AX, 302, '#FFB74D', 2.2, [7, 5]);
  simTxt('对称轴', SIM_AX, 320, 13, '#E65100', 'bold ', 'center');

  // 右半：未翻完只给淡灰虚线轮廓，翻完填充成完整图形
  simPoly(pts, true, full ? '#FCE4EC' : null, full ? '#AD1457' : '#E1BEE7', full ? null : [5, 5]);
  // 左半
  simPoly(pts, false, '#F3E5F5', '#8E24AA', null);

  // 已翻的相邻点之间描实线
  if (SIM.step > 1) {
    for (var j = 1; j < SIM.step; j++) {
      var q1 = simMirror(pts[j - 1]), q2 = simMirror(pts[j]);
      simLine(q1.x, q1.y, q2.x, q2.y, '#F06292', 2.6);
    }
  }

  // 对应点之间的水平虚线（垂直于对称轴）
  for (var i = 0; i < n; i++) {
    if (pts[i].onAxis) continue;
    var m = simMirror(pts[i]);
    var active = (i === SIM.k);
    if (i < SIM.step || active) {
      simLine(pts[i].x, pts[i].y, m.x, m.y,
        active ? '#E65100' : '#CE93D8', active ? 1.8 : 1.1, [4, 4]);
    }
  }

  // 活跃点的距离标注
  var ap = pts[SIM.k];
  if (ap && !ap.onAxis) {
    var am = simMirror(ap);
    var d = simDist(ap);
    simTxt(d + ' 厘米', (ap.x + SIM_AX) / 2, ap.y + 18, 12.5, '#E65100', 'bold ', 'center');
    simTxt(d + ' 厘米', (SIM_AX + am.x) / 2, ap.y + 18, 12.5, '#E65100', 'bold ', 'center');
  }

  // 左半的点（实心紫 + 标签）
  for (var a = 0; a < n; a++) {
    var p = pts[a];
    simCircle(p.x, p.y, 7, a === SIM.k ? '#E65100' : '#6A1B9A', '#FFFFFF');
    simTxt(p.name, p.x, p.y - 14, 13, a === SIM.k ? '#E65100' : '#6A1B9A', 'bold ', 'center');
    SIM.hot.push({
      x: p.x - 16, y: p.y - 16, w: 32, h: 32,
      fn: (function (idx) { return function () { simPick(idx); }; })(a)
    });
  }

  // 右半的点：已翻实心粉，未翻空心灰
  for (var b = 0; b < n; b++) {
    if (pts[b].onAxis) continue;
    var mm = simMirror(pts[b]);
    var done = b < SIM.step;
    simCircle(mm.x, mm.y, 7, done ? '#F06292' : '#FFFFFF', done ? '#AD1457' : '#CE93D8');
    simTxt(pts[b].name + '′', mm.x, mm.y - 14, 13,
      done ? '#AD1457' : '#B0BEC5', done ? 'bold ' : '', 'center');
    SIM.hot.push({
      x: mm.x - 16, y: mm.y - 16, w: 32, h: 32,
      fn: (function (idx) { return function () { simPick(idx); }; })(b)
    });
  }

  // 左下：距离读数
  simPanel(24, 240, 190, 100, '#FDF7FB', '#E1BEE7', 10);
  simTxt('对应点到对称轴', 38, 264, 13, '#6A1B9A', 'bold ');
  if (ap && !ap.onAxis) {
    var dd = simDist(ap);
    simTxt(ap.name + ' ：' + dd + ' 厘米', 38, 290, 15, '#6A1B9A', 'bold ');
    simTxt(ap.name + '′：' + dd + ' 厘米', 38, 314, 15, '#AD1457', 'bold ');
    simTxt('两段一样长 ✓', 38, 334, 12.5, '#2E7D32', 'bold ');
  }

  // 右下：结论
  simPanel(668, 240, 190, 100, '#FCE4EC', '#F8BBD0', 10);
  simTxt('翻折的三条规矩', 682, 264, 13, '#AD1457', 'bold ');
  simTxt('连线垂直于轴', 682, 290, 13.5, '#6A1B9A');
  simTxt('轴平分 AA′', 682, 312, 13.5, '#6A1B9A');
  simTxt('轴上的点不动', 682, 334, 13.5, '#6A1B9A');

  simRefresh();
}

function simRefresh() {
  var c = simCur();
  var rd = document.getElementById('simReadout');
  var tp = document.getElementById('simTip');
  if (rd) {
    if (SIM.step === 0) rd.textContent = '还没翻：右边淡灰的是预期位置';
    else if (SIM.step >= c.pts.length) rd.textContent = '翻完了，两边沿对称轴完全重合';
    else rd.textContent = '已翻 ' + SIM.step + '/' + c.pts.length + ' 个点，右半正在长出来';
  }
  if (tp) tp.textContent = c.name + ' · 对称轴 ' + c.axes;
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
  var pts = simPts();
  if (k === undefined || isNaN(k) || k < 0 || k >= pts.length || pts[k].onAxis) return;
  SIM.k = k; SIM.shift = 0;
  simDraw();
  simLog('选中点 ' + pts[k].name + '，按「动一动这个点」看它和 ' + pts[k].name + '′ 怎么一起动');
}

function simMove() {
  SIM.shift = (SIM.shift + 1) % 3;
  simDraw();
  var p = simPts()[SIM.k];
  var d = simDist(p);
  simLog('挪动 ' + p.name + '：到轴 ' + d + ' 厘米，' + p.name + '′ 同步到轴 ' + d + ' 厘米，始终相等', true);
}

function simNext() {
  var c = simCur();
  if (SIM.step >= c.pts.length) {
    simLog('每个点都翻过去了，沿对称轴对折完全重合', true);
    return;
  }
  var p = simPts()[SIM.step];
  SIM.step++;
  simDraw();
  if (p.onAxis) simLog('第 ' + SIM.step + ' 个点 ' + p.name + ' 在对称轴上，翻过去还是它自己');
  else simLog('第 ' + SIM.step + ' 个点 ' + p.name + ' → ' + p.name + '′：到轴都是 ' + simDist(p) + ' 厘米');
  if (SIM.step === c.pts.length) simLog('翻完了，右半长出来，两边沿对称轴完全重合', true);
}

function simPrev() {
  if (SIM.step > 0) { SIM.step--; simDraw(); simLog('放回一个点，重新翻'); }
  else simLog('已经回到最开始了');
}

function simCase(k) {
  if (k === undefined || isNaN(k)) k = (SIM.i + 1) % SIM_CASES.length;
  k = ((k % SIM_CASES.length) + SIM_CASES.length) % SIM_CASES.length;
  SIM.i = k; SIM.step = 0; SIM.k = 1; SIM.shift = 0;
  simDraw();
  var c = simCur();
  simLog('换图形「' + c.name + '」：共 ' + c.pts.length + ' 个点，一个个翻过去', true);
}

function simReset() {
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  SIM.step = 0; SIM.shift = 0;
  simDraw();
  simLog('重来：半个图形还在左边，一个点都没翻');
}

function simDemo() {
  simReset();
  var c = simCur();
  var n = c.pts.length;
  var k = 0;
  var timer = setInterval(function () {
    if (SIM.i !== SIM_CASES.indexOf(c)) { clearInterval(timer); return; }
    if (k >= n) { clearInterval(timer); return; }
    var p = simPts()[k];
    SIM.step = k + 1;
    simDraw();
    simLog('第 ' + (k + 1) + ' 个点 ' + p.name + ' → ' + p.name + '′' + (p.onAxis ? '（在轴上，不动）' : '（到轴 ' + simDist(p) + ' 厘米）'));
    if (k === n - 1) simLog('自动演示完成，两边完全重合', true);
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

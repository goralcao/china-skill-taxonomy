// ===== 仿真：三根小棒调长度，比长度 / 看两弧能否交上 =====
var SIM_W = 880, SIM_H = 360;
var SIM_U1 = 20, SIM_U2 = 11;          // 左区每厘米像素：比长度 / 闭合图
var SIM_AX = 34, SIM_AY1 = 48, SIM_AY2 = 104, SIM_BH = 28;
var SIM_BL = { x: 50, y: 306 };
var SIM_PX = 490;
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';

// 六个案例：能围成 / 够不着 / 正好压平 / 等腰 / 细长 / 等边
var SIM_CASES = [
  { name: '衣架 3·4·5', a: 3, b: 4, c: 5 },
  { name: '背带 3·4·8', a: 3, b: 4, c: 8 },
  { name: '压平 3·5·8', a: 3, b: 5, c: 8 },
  { name: '车架 5·5·8', a: 5, b: 5, c: 8 },
  { name: '三角架 2·6·7', a: 2, b: 6, c: 7 },
  { name: '等边 4·4·4', a: 4, b: 4, c: 4 }
];

var SIM = { i: 0, a: 3, b: 4, c: 5, hot: [], segs: [] };

function simNorm() {
  var arr = [
    { idx: 0, key: 'a', len: SIM.a, col: '#00838F', name: 'A' },
    { idx: 1, key: 'b', len: SIM.b, col: '#FF7043', name: 'B' },
    { idx: 2, key: 'c', len: SIM.c, col: '#546E7A', name: 'C' }
  ];
  // 最长的一根放平作底边；另两根保持 A、B 的原有次序，读数才是「3 + 4」而不是「4 + 3」
  var bi = 0;
  for (var i = 1; i < 3; i++) if (arr[i].len > arr[bi].len) bi = i;
  var shorts = [];
  for (var j = 0; j < 3; j++) if (j !== bi) shorts.push(arr[j]);
  return { base: arr[bi], s1: shorts[0], s2: shorts[1], all: arr };
}

function simGap() {
  var n = simNorm();
  return (n.s1.len + n.s2.len) - n.base.len;
}

function simLine(x1, y1, x2, y2, color, w, dash) {
  var ctx = document.getElementById('simCanvas').getContext('2d');
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = w || 1.5;
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function simTxt(t, x, y, size, color, weight, align) {
  var ctx = document.getElementById('simCanvas').getContext('2d');
  ctx.save();
  ctx.font = (weight ? weight.trim() + ' ' : '') + size + 'px ' + SIM_FONT;
  ctx.fillStyle = color;
  ctx.textAlign = align || 'left';
  ctx.fillText(t, x, y);
  ctx.restore();
}

function simBox(x, y, w, h, fill, stroke, r) {
  var ctx = document.getElementById('simCanvas').getContext('2d');
  ctx.save();
  ctx.fillStyle = fill;
  ctx.beginPath();
  if (ctx.roundRect && r) ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
  ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.4; ctx.stroke(); }
  ctx.restore();
}

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  var n = simNorm();
  var base = n.base, s1 = n.s1, s2 = n.s2;
  var sum = s1.len + s2.len;
  var gap = sum - base.len;
  var can = gap > 0;
  SIM.hot = [];
  SIM.segs = [];

  // ===== A 区：两根短的接起来，跟最长的一根比 =====
  simTxt('① 两根短的接起来，跟最长的一根比', SIM_AX, 30, 14, '#00838F', 'bold ');
  simTxt(gap > 0 ? '多出 ' + gap + ' 厘米' : (gap === 0 ? '刚好齐平' : '还差 ' + (-gap) + ' 厘米'),
    462, 30, 13, gap > 0 ? '#2E7D32' : (gap === 0 ? '#E65100' : '#C62828'), 'bold ', 'right');

  var x1 = SIM_AX;
  simBox(x1, SIM_AY1, s1.len * SIM_U1, SIM_BH, s1.col, null, 4);
  simBox(x1 + s1.len * SIM_U1, SIM_AY1, s2.len * SIM_U1, SIM_BH, s2.col, null, 4);
  simBox(x1, SIM_AY2, base.len * SIM_U1, SIM_BH, '#CFD8DC', '#90A4AE', 4);
  SIM.segs.push({ x: x1, y: SIM_AY1, w: s1.len * SIM_U1, h: SIM_BH, idx: s1.idx });
  SIM.segs.push({ x: x1 + s1.len * SIM_U1, y: SIM_AY1, w: s2.len * SIM_U1, h: SIM_BH, idx: s2.idx });
  SIM.segs.push({ x: x1, y: SIM_AY2, w: base.len * SIM_U1, h: SIM_BH, idx: base.idx });

  simTxt(String(s1.len), x1 + s1.len * SIM_U1 / 2, SIM_AY1 + 20, 15, '#FFFFFF', 'bold ', 'center');
  simTxt(String(s2.len), x1 + (s1.len + s2.len / 2) * SIM_U1, SIM_AY1 + 20, 15, '#FFFFFF', 'bold ', 'center');
  simTxt(String(base.len), x1 + base.len * SIM_U1 / 2, SIM_AY2 + 20, 15, '#37474F', 'bold ', 'center');
  simTxt('短 + 短', x1, SIM_AY1 - 8, 12, '#607D8B');
  simTxt('最长边', x1, SIM_AY2 - 8, 12, '#607D8B');

  var sumX = SIM_AX + sum * SIM_U1;
  var baseX = SIM_AX + base.len * SIM_U1;
  simLine(sumX, 40, sumX, 148, '#FFCA28', 1.6, [5, 4]);

  if (gap > 0) {
    simLine(baseX, 92, sumX, 92, '#2E7D32', 2.2);
    simLine(baseX, 87, baseX, 97, '#2E7D32', 2);
    simLine(sumX, 87, sumX, 97, '#2E7D32', 2);
  } else if (gap < 0) {
    simLine(sumX, 92, baseX, 92, '#C62828', 2.2);
    simLine(sumX, 87, sumX, 97, '#C62828', 2);
    simLine(baseX, 87, baseX, 97, '#C62828', 2);
  }

  var cmp = gap > 0 ? '>' : (gap === 0 ? '=' : '<');
  simTxt(s1.len + ' + ' + s2.len + ' = ' + sum + ' ' + cmp + ' ' + base.len +
    (gap > 0 ? '，多出 ' + gap + ' 厘米' : (gap === 0 ? '，正好齐平' : '，还差 ' + (-gap) + ' 厘米')),
    SIM_AX, 172, 16, gap > 0 ? '#00695C' : (gap === 0 ? '#E65100' : '#C62828'), 'bold ');

  simLine(26, 188, 462, 188, '#E0F2F1', 1.2);

  // ===== B 区：两弧能不能交上 =====
  var d = base.len * SIM_U2;
  var r1 = s1.len * SIM_U2, r2 = s2.len * SIM_U2;
  var BRx = SIM_BL.x + d;

  // 两根短棒能扫到的弧（只画朝向中间的半段）
  ctx.save();
  ctx.setLineDash([5, 4]);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = s1.col;
  ctx.beginPath();
  ctx.arc(SIM_BL.x, SIM_BL.y, r1, Math.PI * 1.5, Math.PI * 1.99);
  ctx.stroke();
  ctx.strokeStyle = s2.col;
  ctx.beginPath();
  ctx.arc(BRx, SIM_BL.y, r2, Math.PI * 1.01, Math.PI * 1.5);
  ctx.stroke();
  ctx.restore();

  // 底边（最长的一根，放平）
  simLine(SIM_BL.x, SIM_BL.y, BRx, SIM_BL.y, '#90A4AE', 6);

  if (can) {
    var xx = (d * d + r1 * r1 - r2 * r2) / (2 * d);
    var hh = Math.sqrt(Math.max(0, r1 * r1 - xx * xx));
    var Px = SIM_BL.x + xx, Py = SIM_BL.y - hh;

    ctx.save();
    ctx.fillStyle = 'rgba(0,131,143,.10)';
    ctx.beginPath();
    ctx.moveTo(SIM_BL.x, SIM_BL.y);
    ctx.lineTo(Px, Py);
    ctx.lineTo(BRx, SIM_BL.y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    simLine(SIM_BL.x, SIM_BL.y, Px, Py, s1.col, 5);
    simLine(Px, Py, BRx, SIM_BL.y, s2.col, 5);
    ctx.save();
    ctx.fillStyle = '#00838F';
    ctx.beginPath();
    ctx.arc(Px, Py, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    simTxt('顶点', Px + 9, Py - 6, 12, '#00695C');

    simTxt('② 两弧能交上吗', 240, 232, 13, '#546E7A');
    simTxt('✓ 两弧交上了', 240, 264, 19, '#2E7D32', 'bold ');
    simTxt('交点抬成第三个顶点', 240, 290, 13, '#00695C');
    simTxt('三角形围得成', 240, 314, 13, '#00695C');
  } else {
    // 两根短棒压平贴着底边，中间留缺口
    simLine(SIM_BL.x, SIM_BL.y - 10, SIM_BL.x + r1, SIM_BL.y - 10, s1.col, 6);
    simLine(BRx, SIM_BL.y - 10, BRx - r2, SIM_BL.y - 10, s2.col, 6);
    var gx1 = SIM_BL.x + r1, gx2 = BRx - r2;
    if (gap < 0) {
      simLine(gx1, SIM_BL.y - 10, gx2, SIM_BL.y - 10, '#C62828', 2.2, [4, 3]);
      simLine(gx1, SIM_BL.y - 16, gx1, SIM_BL.y - 4, '#C62828', 2);
      simLine(gx2, SIM_BL.y - 16, gx2, SIM_BL.y - 4, '#C62828', 2);
      simTxt('差 ' + (-gap) + ' 厘米', (gx1 + gx2) / 2, SIM_BL.y - 22, 12, '#C62828', 'bold ', 'center');
    } else {
      simTxt('刚好碰上', (gx1 + gx2) / 2, SIM_BL.y - 22, 12, '#E65100', 'bold ', 'center');
    }

    simTxt('② 两弧能交上吗', 240, 232, 13, '#546E7A');
    if (gap === 0) {
      simTxt('✗ 两弧刚好相切', 240, 264, 18, '#E65100', 'bold ');
      simTxt('三根压成一条直线', 240, 290, 13, '#BF360C');
      simTxt('没有高度，不算三角形', 240, 314, 13, '#BF360C');
    } else {
      simTxt('✗ 两弧碰不上', 240, 264, 18, '#C62828', 'bold ');
      simTxt('两端还差 ' + (-gap) + ' 厘米', 240, 290, 13, '#C62828');
      simTxt('怎么摆都合不拢', 240, 314, 13, '#C62828');
    }
  }
  simTxt('最长边 ' + base.len + ' 厘米', (SIM_BL.x + BRx) / 2, SIM_BL.y + 24, 12, '#78909C', '', 'center');

  // ===== C 区：三根长度 + 判定 =====
  simLine(476, 18, 476, 344, '#E0F2F1', 1.4);
  simTxt('三根小棒（厘米）', SIM_PX, 30, 14, '#00838F', 'bold ');

  var keys = ['a', 'b', 'c'];
  for (var k = 0; k < 3; k++) {
    var row = n.all[k];
    var ry = 66 + k * 44;
    simBox(SIM_PX, ry - 9, 18, 18, row.col, null, 3);
    simTxt(row.name + ' = ' + SIM[keys[k]] + ' 厘米', SIM_PX + 28, ry + 6, 16, '#0E3035', 'bold ');

    var mx = 716, px = 756, bw = 30, bh = 26;
    simBox(mx, ry - 13, bw, bh, '#F3FAFA', '#A5CFCE', 5);
    simBox(px, ry - 13, bw, bh, '#F3FAFA', '#A5CFCE', 5);
    simTxt('−', mx + bw / 2, ry + 6, 17, '#00838F', 'bold ', 'center');
    simTxt('+', px + bw / 2, ry + 6, 17, '#00838F', 'bold ', 'center');
    SIM.hot.push({ x: mx, y: ry - 13, w: bw, h: bh, idx: k, d: -1 });
    SIM.hot.push({ x: px, y: ry - 13, w: bw, h: bh, idx: k, d: 1 });
  }

  simLine(SIM_PX, 184, 852, 184, '#E0F2F1', 1.2);
  simTxt('关键一比：短 + 短  vs  最长', SIM_PX, 206, 13, '#90A4AE');
  simTxt(s1.len + ' + ' + s2.len + ' = ' + sum, SIM_PX, 238, 23, '#00838F', 'bold ');
  var rel = gap > 0 ? '>' : (gap === 0 ? '=' : '<');
  simTxt(sum + ' ' + rel + ' ' + base.len,
    SIM_PX, 268, 20, gap > 0 ? '#2E7D32' : (gap === 0 ? '#E65100' : '#C62828'), 'bold ');
  simTxt('另两组不用查：最长边已比谁都长', SIM_PX, 294, 12, '#90A4AE');
  simTxt(can ? '✓ 能围成' : '✗ 围不成', SIM_PX, 328, 24,
    can ? '#2E7D32' : '#C62828', 'bold ');
  simTxt(SIM_CASES[SIM.i].name, SIM_PX, 348, 12, '#B0BEC5');

  // ===== 状态栏 =====
  var rd = document.getElementById('simReadout');
  if (rd) {
    rd.textContent = s1.len + ' + ' + s2.len + ' = ' + sum + ' ' +
      (gap > 0 ? '> ' : (gap === 0 ? '= ' : '< ')) + base.len + '，' +
      (can ? '能围成' : (gap === 0 ? '压成直线' : '围不成'));
  }
  var tp = document.getElementById('simTip');
  if (tp) {
    tp.textContent = can ? ('最长边 ' + base.len + ' 厘米，多出 ' + gap + ' 厘米')
      : (gap === 0 ? '刚好齐平，抬不起顶点' : '还差 ' + (-gap) + ' 厘米');
  }
}

function simLog(msg, hl) {
  var box = document.getElementById('simLog');
  if (!box) return;
  var d = document.createElement('div');
  if (hl) d.className = 'hl';
  d.textContent = msg;
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
}

function simCase(k) {
  if (k === undefined || isNaN(k)) k = (SIM.i + 1) % SIM_CASES.length;
  k = ((k % SIM_CASES.length) + SIM_CASES.length) % SIM_CASES.length;
  SIM.i = k;
  var c = SIM_CASES[k];
  SIM.a = c.a; SIM.b = c.b; SIM.c = c.c;
  simDraw();
  var g = simGap();
  simLog('案例「' + c.name + '」：' + (g > 0 ? '多出 ' + g + ' 厘米，能围成' :
    (g === 0 ? '正好齐平，压成直线' : '还差 ' + (-g) + ' 厘米，围不成')), true);
}

function simNext() {
  simCase(SIM.i + 1);
}

function simPrev() {
  simCase(SIM.i - 1);
}

function simReset() {
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simCase(0);
  simLog('重来：A=3、B=4、C=5 厘米，先从能围成的一组看起');
}

function simLen(idx, delta) {
  var keys = ['a', 'b', 'c'];
  if (idx < 0 || idx > 2 || !keys[idx]) return;
  var v = SIM[keys[idx]] + (delta > 0 ? 1 : -1);
  if (v < 1 || v > 10) return;
  SIM[keys[idx]] = v;
  var g = simGap();
  simLog('把 ' + ['A', 'B', 'C'][idx] + ' 调成 ' + v + ' 厘米 → ' +
    (g > 0 ? '多出 ' + g + ' 厘米，能围成' : (g === 0 ? '正好齐平' : '还差 ' + (-g) + ' 厘米')));
  simDraw();
}

function simDemo() {
  simCase(0);
  var t = setInterval(function () {
    if (SIM.i >= SIM_CASES.length - 1) { clearInterval(t); return; }
    simCase(SIM.i + 1);
  }, 1100);
}

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.getAttribute('data-bound')) return;
  cv.setAttribute('data-bound', '1');
  cv.style.cursor = 'pointer';
  cv.addEventListener('click', function (e) {
    var r = cv.getBoundingClientRect();
    var x = (e.clientX - r.left) * (SIM_W / r.width);
    var y = (e.clientY - r.top) * (SIM_H / r.height);
    for (var i = 0; i < SIM.hot.length; i++) {
      var h = SIM.hot[i];
      if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) {
        simLen(h.idx, h.d);
        return;
      }
    }
    for (var j = 0; j < SIM.segs.length; j++) {
      var s = SIM.segs[j];
      if (x >= s.x && x <= s.x + s.w && y >= s.y && y <= s.y + s.h) {
        simLen(s.idx, 1);
        return;
      }
    }
  });
}

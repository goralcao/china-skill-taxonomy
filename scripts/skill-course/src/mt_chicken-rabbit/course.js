// ===== 仿真：一只一只把腿少的换成腿多的，看总数逼近目标 =====
var SIM_W = 880, SIM_H = 360;
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';

// 格区与脚数条的位置
var SIM_GX = 24, SIM_GY = 58, SIM_GW = 428, SIM_GH = 238;
var SIM_BAR_X = 512, SIM_BAR_W = 64, SIM_BAR_TOP = 62, SIM_BAR_BOT = 296;

var SIM_CASES = [
  { name: '笼子里的鸡和兔', heads: 8,  feet: 26, unit: '脚', u2: '只', cnt: '个头', cn: '头',
    a: '鸡',   b: '兔',   bu: '只', ka: 'chicken', kb: 'rabbit' },
  { name: '另一个笼子',     heads: 10, feet: 32, unit: '脚', u2: '只', cnt: '个头', cn: '头',
    a: '鸡',   b: '兔',   bu: '只', ka: 'chicken', kb: 'rabbit' },
  { name: '再来一笼',       heads: 9,  feet: 30, unit: '脚', u2: '只', cnt: '个头', cn: '头',
    a: '鸡',   b: '兔',   bu: '只', ka: 'chicken', kb: 'rabbit' },
  { name: '停车场',         heads: 12, feet: 40, unit: '轮', u2: '个', cnt: '辆车', cn: '辆',
    a: '摩托', b: '汽车', bu: '辆', ka: 'moto',    kb: 'car' }
];

// i = 案例序号；swap = 已经换成「腿多的那种」的只数（从左往右数）
var SIM = { i: 0, swap: 0, hot: -1 };

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
  ctx.strokeStyle = color; ctx.lineWidth = w || 2; ctx.lineCap = 'round';
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.restore();
}

function simPanel(x, y, w, h, fill, stroke, r) {
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

function simCircle(x, y, rad, fill, stroke) {
  var ctx = simCtx();
  ctx.save();
  ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.6; ctx.stroke(); }
  ctx.restore();
}

function simCur() { return SIM_CASES[SIM.i]; }
function simFeet() { return simCur().heads * 2 + SIM.swap * 2; }
function simMax() {
  var f = simCur().feet;
  var m = Math.ceil((f + 4) / 8) * 8;
  return Math.max(m, simCur().heads * 4);
}

// 网格：多少个头就排多少格，格宽格高自适应
function simGrid() {
  var n = simCur().heads;
  var cols = n <= 8 ? 4 : (n <= 10 ? 5 : 4);
  var rows = Math.ceil(n / cols);
  var gap = 10;
  var gw = (SIM_GW - (cols - 1) * gap) / cols;
  var gh = (SIM_GH - (rows - 1) * gap) / rows;
  return { cols: cols, rows: rows, gap: gap, gw: gw, gh: gh };
}

function simCell(k) {
  var g = simGrid();
  var c = k % g.cols, r = Math.floor(k / g.cols);
  return {
    x: SIM_GX + c * (g.gw + g.gap),
    y: SIM_GY + r * (g.gh + g.gap),
    w: g.gw, h: g.gh
  };
}

// 一只动物的画法；s 是缩放系数，基准格 60 x 80，中心在 (cx, cy)
function simUnit(cx, cy, s, kind) {
  var ctx = simCtx();
  var isRabbit = (kind === 'rabbit');
  var isCar = (kind === 'car');
  var isMoto = (kind === 'moto');
  var body, legColor, legN;

  if (kind === 'chicken' || kind === 'rabbit') {
    body = isRabbit ? '#8D6E63' : '#FFC107';
    legColor = isRabbit ? '#5D4037' : '#E65100';
    legN = isRabbit ? 4 : 2;

    // 兔子：两只长耳朵（椭圆，看得清是耳不是线）
    if (isRabbit) {
      ctx.save();
      ctx.beginPath(); ctx.ellipse(cx - 7 * s, cy - 28 * s, 4 * s, 12 * s, -0.12, 0, Math.PI * 2);
      ctx.fillStyle = body; ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + 7 * s, cy - 28 * s, 4 * s, 12 * s, 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      // 耳内浅色
      ctx.save();
      ctx.beginPath(); ctx.ellipse(cx - 7 * s, cy - 28 * s, 1.8 * s, 7 * s, -0.12, 0, Math.PI * 2);
      ctx.fillStyle = '#EFEBE4'; ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + 7 * s, cy - 28 * s, 1.8 * s, 7 * s, 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 身体
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy + 8 * s, 17 * s, 13 * s, 0, 0, Math.PI * 2);
    ctx.fillStyle = body; ctx.fill();
    ctx.restore();

    // 头
    simCircle(cx, cy - 10 * s, 11 * s, body);

    if (isRabbit) {
      simCircle(cx - 4 * s, cy - 12 * s, 2.2 * s, '#2B1B14');
      simCircle(cx + 4 * s, cy - 12 * s, 2.2 * s, '#2B1B14');
      simCircle(cx + 15 * s, cy + 6 * s, 4 * s, '#EFEBE4');   // 短尾巴
    } else {
      // 尖喙
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx + 9 * s, cy - 13 * s);
      ctx.lineTo(cx + 19 * s, cy - 9 * s);
      ctx.lineTo(cx + 9 * s, cy - 5 * s);
      ctx.closePath();
      ctx.fillStyle = '#E65100'; ctx.fill();
      ctx.restore();
      simCircle(cx + 3 * s, cy - 13 * s, 2.2 * s, '#3E2723');
      // 鸡冠
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx - 1 * s, cy - 21 * s, 4.5 * s, 3 * s, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#E65100'; ctx.fill();
      ctx.restore();
    }

    // 腿
    var spread = legN === 4 ? 11 : 8;
    var start = legN === 4 ? -1.5 : -0.5;
    for (var i = 0; i < legN; i++) {
      var xx = cx + (start + i) * spread * s;
      simLine(xx, cy + 18 * s, xx, cy + 33 * s, legColor, 3 * s);
      simLine(xx - 3.5 * s, cy + 33 * s, xx + 3.5 * s, cy + 33 * s, legColor, 2.6 * s);
    }
    return;
  }

  if (isCar) {
    // 车顶 + 车窗
    simPanel(cx - 15 * s, cy - 24 * s, 30 * s, 18 * s, '#4E342E', null, 4 * s);
    simPanel(cx - 11 * s, cy - 21 * s, 22 * s, 12 * s, '#B0BEC5', null, 2 * s);
    // 车身
    simPanel(cx - 25 * s, cy - 8 * s, 50 * s, 24 * s, '#4E342E', null, 5 * s);
    // 4 个轮子
    for (var w = 0; w < 4; w++) {
      var wx = cx + (-18 + w * 12) * s;
      simCircle(wx, cy + 20 * s, 7.5 * s, '#2B1B14');
      simCircle(wx, cy + 20 * s, 2.8 * s, '#D7CCC8');
    }
    return;
  }

  // 摩托车：两个大轮 + 车架 + 车把 + 座位
  simCircle(cx - 18 * s, cy + 16 * s, 10 * s, '#2B1B14');
  simCircle(cx + 18 * s, cy + 16 * s, 10 * s, '#2B1B14');
  simCircle(cx - 18 * s, cy + 16 * s, 3.6 * s, '#D7CCC8');
  simCircle(cx + 18 * s, cy + 16 * s, 3.6 * s, '#D7CCC8');
  ctx.save();
  ctx.strokeStyle = '#8D6E63'; ctx.lineWidth = 4.5 * s; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - 18 * s, cy + 14 * s);
  ctx.lineTo(cx - 4 * s, cy - 4 * s);
  ctx.lineTo(cx + 12 * s, cy - 2 * s);
  ctx.lineTo(cx + 18 * s, cy + 14 * s);
  ctx.stroke();
  ctx.restore();
  simLine(cx - 7 * s, cy - 7 * s, cx + 3 * s, cy - 7 * s, '#4E342E', 5 * s);
  simLine(cx + 11 * s, cy - 6 * s, cx + 17 * s, cy - 16 * s, '#4E342E', 3.4 * s);
}

function simDraw() {
  var ctx = simCtx();
  var c = simCur();
  var feet = simFeet();
  var maxV = simMax();

  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FDFAF6';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  // ===== 左侧标题 =====
  simTxt(c.name + '：' + c.heads + ' ' + c.cnt + '，' + c.feet + ' ' + c.u2 + c.unit, SIM_GX, 34, 16, '#4E342E', 'bold');
  simTxt('点任意一格可以换回来，前 ' + SIM.swap + ' ' + c.bu + '是' + c.b, SIM_GX, 52, 12, '#8D6E63');

  // ===== 格子 =====
  var g = simGrid();
  var s = Math.min(g.gw / 60, g.gh / 80);
  for (var k = 0; k < c.heads; k++) {
    var cell = simCell(k);
    var isB = k < SIM.swap;
    var fill = isB ? '#EFEBE4' : '#FFF8E1';
    var edge = isB ? '#8D6E63' : '#FFD166';
    simPanel(cell.x, cell.y, cell.w, cell.h, fill, edge, 7);
    simUnit(cell.x + cell.w / 2, cell.y + cell.h / 2, s, isB ? c.kb : c.ka);
  }

  // ===== 脚数条 =====
  simTxt(c.unit + '数合计', SIM_BAR_X + SIM_BAR_W / 2, 52, 12.5, '#6D4C41', 'bold', 'center');

  // 轨道
  simPanel(SIM_BAR_X, SIM_BAR_TOP, SIM_BAR_W, SIM_BAR_BOT - SIM_BAR_TOP, '#EFEBE4', '#D7CCC8', 10);

  // 当前值
  var hCur = (feet / maxV) * (SIM_BAR_BOT - SIM_BAR_TOP);
  var barTop = SIM_BAR_BOT - hCur;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(SIM_BAR_X + 4, barTop, SIM_BAR_W - 8, hCur, 8)
                : ctx.rect(SIM_BAR_X + 4, barTop, SIM_BAR_W - 8, hCur);
  ctx.fillStyle = feet === c.feet ? '#2E7D32' : '#FFB300';
  ctx.fill();
  ctx.restore();

  // 刻度
  for (var v = 0; v <= maxV; v += 8) {
    var y = SIM_BAR_BOT - (v / maxV) * (SIM_BAR_BOT - SIM_BAR_TOP);
    simLine(SIM_BAR_X + SIM_BAR_W, y, SIM_BAR_X + SIM_BAR_W + 8, y, '#B0BEC5', 1.2);
    simTxt(String(v), SIM_BAR_X + SIM_BAR_W + 14, y + 4, 11.5, '#8D6E63');
  }

  // 目标线
  var yT = SIM_BAR_BOT - (c.feet / maxV) * (SIM_BAR_BOT - SIM_BAR_TOP);
  simLine(SIM_BAR_X - 12, yT, SIM_BAR_X + SIM_BAR_W + 32, yT, '#E65100', 2, [6, 4]);
  simPanel(SIM_BAR_X + 6, yT - 27, 52, 18, 'rgba(255,255,255,.95)', '#E65100', 4);
  simTxt('目标 ' + c.feet, SIM_BAR_X + 32, yT - 14, 10.5, '#E65100', 'bold', 'center');


  // ===== 右侧算式 =====
  var PX = 660;
  var total = c.heads;
  var assume = total * 2;
  var diff = c.feet - assume;
  var need = diff / 2;

  simTxt('三次换算', PX, 84, 13, '#8D6E63', 'bold');

  var rows = [
    { t: '① 全当' + c.a + '：2 × ' + total + ' = ' + assume, ok: true },
    { t: '② 求差：' + c.feet + ' − ' + assume + ' = ' + diff, ok: SIM.swap > 0 },
    { t: '③ 求商：' + diff + ' ÷ 2 = ' + need, ok: feet === c.feet }
  ];
  for (var r = 0; r < rows.length; r++) {
    var yy = 116 + r * 44;
    simPanel(PX - 10, yy - 22, 212, 36, rows[r].ok ? '#FFF8E1' : '#FFFFFF', rows[r].ok ? '#FFE082' : '#E0DCD4', 7);
    simTxt(rows[r].t, PX, yy, 14, rows[r].ok ? '#4E342E' : '#A1887F');
  }

  // 结论
  var done = feet === c.feet;
  simPanel(PX - 10, 246, 212, 62, done ? '#E8F5E9' : '#FFFFFF', done ? '#66BB6A' : '#D7CCC8', 8);
  if (done) {
    simTxt(c.b + ' ' + SIM.swap + ' ' + c.bu + ' · ' + c.a + ' ' + (total - SIM.swap) + ' ' + c.bu, PX + 6, 272, 15, '#2E7D32', 'bold');
    simTxt(c.cn + ' ' + total + ' ✓　' + c.unit + ' ' + c.feet + ' ✓', PX + 6, 294, 13, '#2E7D32');
  } else {
    var left = c.feet - feet;
    simTxt('还差 ' + left + ' ' + c.u2 + c.unit, PX + 6, 272, 15, '#E65100', 'bold');
    simTxt('再换 ' + (left / 2) + ' ' + c.bu + c.b + '就够', PX + 6, 294, 13, '#8D6E63');
  }

  // ===== 底部提示 =====
  simLine(SIM_GX, 316, 856, 316, '#E0DCD4', 1.2);
  var tip = '每换一' + c.bu + c.b + '，' + c.cn + '数不变，' + c.unit + '加 2。差几' + c.u2 + c.unit + '就换几' + c.bu + '。';
  simTxt(tip, SIM_GX, 340, 13, '#8D6E63');

  simRefresh();
}

function simRefresh() {
  var c = simCur();
  var feet = simFeet();
  var rd = document.getElementById('simReadout');
  var tp = document.getElementById('simTip');
  if (!rd || !tp) return;
  rd.textContent = c.a + ' ' + (c.heads - SIM.swap) + ' · ' + c.b + ' ' + SIM.swap + ' · ' + c.unit + ' ' + feet;
  if (feet < c.feet) {
    tp.textContent = '还差 ' + (c.feet - feet) + ' ' + c.u2 + c.unit;
    tp.style.color = '#E65100';
  } else if (feet === c.feet) {
    tp.textContent = '正好 ' + c.feet + ' ' + c.u2 + c.unit + '，换 ' + SIM.swap + ' ' + c.bu;
    tp.style.color = '#2E7D32';
  } else {
    tp.textContent = '超了 ' + (feet - c.feet) + ' ' + c.u2 + c.unit + '，换多了';
    tp.style.color = '#C62828';
  }
}

function simLog(msg, hl) {
  var box = document.getElementById('simLog');
  if (!box) return;
  var d = document.createElement('div');
  d.className = 'sim-log-line';
  if (hl) d.style.color = '#2E7D32';
  d.textContent = msg;
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
}

// ===== 操作 =====
function simNext() {
  var c = simCur();
  if (SIM.swap >= c.heads) { simLog('已经全是' + c.b + '了，再换就超过' + c.cnt); simDraw(); return; }
  SIM.swap++;
  var feet = simFeet();
  if (feet === c.feet) {
    simLog('第 ' + SIM.swap + ' ' + c.bu + '换完，' + c.unit + '数正好 ' + c.feet + '——停手', true);
  } else if (feet > c.feet) {
    simLog('第 ' + SIM.swap + ' ' + c.bu + '换完，' + c.unit + '数 ' + feet + '，超了 ' + (feet - c.feet));
  } else {
    simLog('换第 ' + SIM.swap + ' ' + c.bu + '：' + c.unit + ' ' + feet + '，还差 ' + (c.feet - feet));
  }
  simDraw();
}

function simPrev() {
  if (SIM.swap <= 0) { simLog('已经全是' + simCur().a + '，退不动了'); simDraw(); return; }
  SIM.swap--;
  simLog('退回一' + simCur().bu + '：' + simCur().unit + ' ' + simFeet());
  simDraw();
}

function simAll() {
  var c = simCur();
  SIM.swap = c.heads;
  simLog('全换成' + c.b + '：' + simCur().unit + ' ' + simFeet() + '，比目标多 ' + (simFeet() - c.feet));
  simDraw();
}

function simPick(k) {
  var c = simCur();
  if (k < 0 || k >= c.heads) return;
  if (k < SIM.swap) {
    SIM.swap = k;
    simLog('把第 ' + (k + 1) + ' ' + c.bu + '换回' + c.a + '，现在 ' + c.unit + ' ' + simFeet());
  } else {
    SIM.swap = k + 1;
    var feet = simFeet();
    if (feet === c.feet) simLog('换到第 ' + (k + 1) + ' ' + c.bu + '，' + c.unit + '正好 ' + c.feet, true);
    else simLog('换到第 ' + (k + 1) + ' ' + c.bu + '，' + c.unit + ' ' + feet + '，还差 ' + (c.feet - feet));
  }
  simDraw();
}

function simCase(dir) {
  if (dir === undefined || isNaN(dir)) dir = 1;
  SIM.i = (SIM.i + dir + SIM_CASES.length) % SIM_CASES.length;
  SIM.swap = 0;
  var c = simCur();
  simLog('换一题：' + c.name + '，' + c.heads + ' ' + c.cnt + ' ' + c.feet + ' ' + c.u2 + c.unit);
  simDraw();
}

function simReset() {
  SIM.swap = 0;
  simLog('重来，全部当' + simCur().a);
  simDraw();
}

var SIM_TIMER = null;
function simDemo() {
  if (SIM_TIMER) { clearInterval(SIM_TIMER); SIM_TIMER = null; }
  SIM.swap = 0;
  simDraw();
  simLog('自动演示开始');
  SIM_TIMER = setInterval(function () {
    var c = simCur();
    if (SIM.swap >= c.heads || simFeet() >= c.feet) {
      clearInterval(SIM_TIMER); SIM_TIMER = null;
      simLog('停：' + c.unit + ' ' + simFeet() + '，' + c.b + ' ' + SIM.swap + ' ' + c.bu, true);
      return;
    }
    SIM.swap++;
    simDraw();
  }, 620);
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
    var c = simCur();
    for (var k = 0; k < c.heads; k++) {
      var cell = simCell(k);
      if (x >= cell.x && x <= cell.x + cell.w && y >= cell.y && y <= cell.y + cell.h) {
        simPick(k);
        return;
      }
    }
  });
}

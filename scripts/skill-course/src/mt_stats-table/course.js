// ===== 引入页：答案卡「他错在哪」（防御性，本课文未直接调用）=====
function toggleAns(btn) {
  var card = btn && btn.closest ? btn.closest('.ans-card') : null;
  if (!card) return;
  card.classList.toggle('open');
  btn.textContent = card.classList.contains('open') ? '收起' : '他错在哪';
}

// ===== 仿真：复式统计表 + 看表高亮 =====
var SIM_W = 860, SIM_H = 332;
var SIM = { m1: 120, w1: 100, m2: 110, w2: 130, sel: null, busy: false, log: [] };
var COLX = [120, 240, 370, 500, 630];
var ROWY = [60, 120, 176, 232, 288];

function simCell(ctx, ci, ri, text, opt) {
  var x = COLX[ci], y = ROWY[ri], w = COLX[ci + 1] - COLX[ci], h = ROWY[ri + 1] - ROWY[ri];
  ctx.fillStyle = (opt && opt.bg) || '#FFFFFF';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#3949AB';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = ((opt && opt.bold) ? 'bold ' : '') + ((opt && opt.size) || 18) + 'px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = (opt && opt.color) || '#1B2138';
  ctx.fillText(text, x + w / 2, y + h / 2 + 1);
  ctx.textBaseline = 'alphabetic';
}

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  var m1 = SIM.m1, w1 = SIM.w1, m2 = SIM.m2, w2 = SIM.w2;
  var mt = m1 + m2, wt = w1 + w2, c1 = m1 + w1, c2 = m2 + w2, total = mt + wt;

  var HDR = { bg: '#E6E9F7', color: '#3949AB', bold: true, size: 16 };
  var TOT = { bg: '#B2DFDB', color: '#00695C', bold: true, size: 18 };
  var CELL = { bg: '#FFFFFF', color: '#1B2138', size: 18 };
  var LABEL = { bg: '#F5F6FC', color: '#1B2138', bold: true, size: 17 };

  // 表头
  simCell(ctx, 0, 0, '项目', HDR);
  simCell(ctx, 1, 0, '三（1）班', HDR);
  simCell(ctx, 2, 0, '三（2）班', HDR);
  simCell(ctx, 3, 0, '合计', HDR);
  // 男生
  simCell(ctx, 0, 1, '男生', LABEL);
  simCell(ctx, 1, 1, String(m1), CELL);
  simCell(ctx, 2, 1, String(m2), CELL);
  simCell(ctx, 3, 1, String(mt), TOT);
  // 女生
  simCell(ctx, 0, 2, '女生', LABEL);
  simCell(ctx, 1, 2, String(w1), CELL);
  simCell(ctx, 2, 2, String(w2), CELL);
  simCell(ctx, 3, 2, String(wt), TOT);
  // 合计
  simCell(ctx, 0, 3, '合计', TOT);
  simCell(ctx, 1, 3, String(c1), TOT);
  simCell(ctx, 2, 3, String(c2), TOT);
  simCell(ctx, 3, 3, String(total), { bg: '#00897B', color: '#FFFFFF', bold: true, size: 19 });

  // 高亮
  var s = SIM.sel;
  ctx.fillStyle = 'rgba(0,137,123,0.20)';
  if (s && s.t === 'row') {
    var ri = s.k === 'm' ? 1 : 2;
    ctx.fillRect(COLX[0], ROWY[ri], COLX[4] - COLX[0], ROWY[ri + 1] - ROWY[ri]);
  } else if (s && s.t === 'col') {
    var ci = s.k;
    ctx.fillRect(COLX[ci], ROWY[0], COLX[ci + 1] - COLX[ci], ROWY[4] - ROWY[0]);
  } else if (s && s.t === 'total') {
    ctx.fillRect(COLX[0], ROWY[3], COLX[4] - COLX[0], ROWY[4] - ROWY[3]);
    ctx.fillRect(COLX[3], ROWY[0], COLX[4] - COLX[3], ROWY[4] - ROWY[0]);
  }
  // 高亮后再描一次网格，保证线条清晰
  if (s) {
    ctx.strokeStyle = 'rgba(0,105,92,0.55)';
    ctx.lineWidth = 2;
    ctx.strokeRect(COLX[0], ROWY[0], COLX[4] - COLX[0], ROWY[4] - ROWY[0]);
  }

  // 右侧提示
  ctx.textAlign = 'left';
  ctx.font = '16px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#5C6BC0';
  ctx.fillText('横 → 班级', 660, 120);
  ctx.fillText('竖 ↓ 性别', 660, 150);
  ctx.fillStyle = '#00897B';
  ctx.fillText('合计 = 相加', 660, 190);

  simReadout();
}

function simReadout() {
  var el = document.getElementById('simReadout');
  var m1 = SIM.m1, w1 = SIM.w1, m2 = SIM.m2, w2 = SIM.w2;
  var mt = m1 + m2, wt = w1 + w2, c1 = m1 + w1, c2 = m2 + w2, total = mt + wt;
  var s = SIM.sel;
  var txt = '复式统计表：横看班级，竖看性别';
  if (s && s.t === 'row') {
    if (s.k === 'm') txt = '男生行：三（1）' + m1 + ' 元、三（2）' + m2 + ' 元，合计 ' + mt + ' 元';
    else txt = '女生行：三（1）' + w1 + ' 元、三（2）' + w2 + ' 元，合计 ' + wt + ' 元';
  } else if (s && s.t === 'col') {
    if (s.k === 1) txt = '三（1）班列：男 ' + m1 + ' 元、女 ' + w1 + ' 元，合计 ' + c1 + ' 元';
    else txt = '三（2）班列：男 ' + m2 + ' 元、女 ' + w2 + ' 元，合计 ' + c2 + ' 元';
  } else if (s && s.t === 'total') {
    txt = '全年级总计 ' + total + ' 元（三1 ' + c1 + ' + 三2 ' + c2 + '）';
  }
  if (el) el.textContent = txt;

  var tip = document.getElementById('simTip');
  if (!tip) return;
  if (!s) tip.textContent = '点按钮高亮某一行或某一列';
  else if (s.t === 'row') tip.textContent = '横着看一行：比的是同一组别在两个班的情况';
  else if (s.t === 'col') tip.textContent = '竖着看一列：比的是同一个班男女两组';
  else tip.textContent = '合计行 + 合计列，最后交叉出总计';
}

function simLog(msg, hl) {
  SIM.log.push({ t: msg, hl: !!hl });
  if (SIM.log.length > 5) SIM.log.shift();
  var box = document.getElementById('simLog');
  if (!box) return;
  box.innerHTML = SIM.log.map(function (x) {
    return '<div' + (x.hl ? ' class="hl"' : '') + '>· ' + x.t + '</div>';
  }).join('');
}

function simRow(k) {
  if (SIM.busy) return;
  SIM.sel = { t: 'row', k: k };
  var name = k === 'm' ? '男生' : '女生';
  var mt = SIM.m1 + SIM.m2, wt = SIM.w1 + SIM.w2;
  simLog('看' + name + '行：合计 ' + (k === 'm' ? mt : wt) + ' 元', true);
  simDraw();
}

function simCol(c) {
  if (SIM.busy) return;
  SIM.sel = { t: 'col', k: c };
  var c1 = SIM.m1 + SIM.w1, c2 = SIM.m2 + SIM.w2;
  simLog('看三（' + c + '）班列：合计 ' + (c === 1 ? c1 : c2) + ' 元', true);
  simDraw();
}

function simTotal() {
  if (SIM.busy) return;
  SIM.sel = { t: 'total' };
  simLog('看总计：全年级 ' + (SIM.m1 + SIM.w1 + SIM.m2 + SIM.w2) + ' 元', true);
  simDraw();
}

function simReset() {
  if (SIM.busy) return;
  SIM.m1 = 120; SIM.w1 = 100; SIM.m2 = 110; SIM.w2 = 130; SIM.sel = null; SIM.log = [];
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('已重置：三（1）120/100，三（2）110/130');
  simDraw();
}

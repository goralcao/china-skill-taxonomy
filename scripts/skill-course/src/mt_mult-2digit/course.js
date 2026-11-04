// ===== 仿真：三位数乘两位数竖式步进器（两步分层）=====
var SIM_W = 880, SIM_H = 360;
var SIM_POOL = [[145, 12], [236, 34], [408, 25]];
var SIM = { idx: 0, a: 145, b: 12, step: 0, log: [] };
var SIM_CW = 24;

function simPart() {
  var a = SIM.a, b = SIM.b;
  var ones = b % 10, tens = Math.floor(b / 10);
  return {
    ones: ones, tens: tens,
    p1: a * ones, p2: a * tens, total: a * b
  };
}

function simStepText(s) {
  var p = simPart();
  if (s === 0) return '先拆：' + SIM.a + ' × ' + SIM.b + ' = ' + SIM.a + ' × ' + (SIM.b - p.ones) + ' + ' + SIM.a + ' × ' + p.ones;
  if (s === 1) return '第一笔 个位 ' + p.ones + ' × ' + SIM.a + ' = ' + p.p1 + '，末位对齐个位';
  if (s === 2) return '第二笔 十位 ' + p.tens + ' × ' + SIM.a + ' = ' + p.p2 + ' 个十 = ' + (p.p2 * 10) + '，末位对齐十位';
  return '两行相加 ' + p.p1 + ' + ' + (p.p2 * 10) + ' = ' + p.total;
}

// 逐字符右对齐写一串数字（等宽间距，保证数位对得齐）
function simNum(ctx, str, rightX, y, color, size) {
  var w = SIM_CW, n = str.length;
  ctx.font = 'bold ' + (size || 26) + 'px "Courier New", Consolas, monospace';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  for (var i = 0; i < n; i++) {
    ctx.fillText(str[i], rightX - w / 2 - w * (n - 1 - i), y);
  }
}

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  var p = simPart(), s = SIM.step;

  // ---- 标题 ----
  ctx.textAlign = 'center';
  ctx.font = 'bold 19px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#004D40';
  ctx.fillText(SIM.a + ' × ' + SIM.b + '：面积模型拆两块，竖式摞两行', SIM_W / 2, 32);

  // ---- 左：面积模型 ----
  var mx = 50, mw = 320, ty = 78, by = 300, split = 225;
  var upOn = (s >= 2), downOn = (s >= 1);

  // 上块 = 乘十位
  ctx.fillStyle = upOn ? '#FFCCBC' : '#EFF4F3';
  ctx.fillRect(mx, ty, mw, split - ty);
  ctx.strokeStyle = upOn ? '#BF360C' : '#C7D4D0';
  ctx.lineWidth = upOn ? 2.5 : 1.5;
  ctx.strokeRect(mx, ty, mw, split - ty);

  // 下块 = 乘个位
  ctx.fillStyle = downOn ? '#B2DFDB' : '#EFF4F3';
  ctx.fillRect(mx, split, mw, by - split);
  ctx.strokeStyle = downOn ? '#00695C' : '#C7D4D0';
  ctx.lineWidth = downOn ? 2.5 : 1.5;
  ctx.strokeRect(mx, split, mw, by - split);

  ctx.textAlign = 'center';
  if (upOn) {
    ctx.font = 'bold 15px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = '#BF360C';
    ctx.fillText(SIM.a + ' × ' + (p.tens * 10) + '（十位那笔）', mx + mw / 2, 148);
    ctx.font = 'bold 17px "Courier New", monospace';
    ctx.fillText('= ' + (p.p2 * 10), mx + mw / 2, 178);
  } else {
    ctx.font = '14px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = '#93A8A2';
    ctx.fillText('这一块还没算', mx + mw / 2, 158);
  }
  if (downOn) {
    ctx.font = 'bold 15px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = '#00695C';
    ctx.fillText(SIM.a + ' × ' + p.ones + '（个位）', mx + mw / 2, 252);
    ctx.font = 'bold 17px "Courier New", monospace';
    ctx.fillText('= ' + p.p1, mx + mw / 2, 278);
  } else {
    ctx.font = '14px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = '#93A8A2';
    ctx.fillText('这一块还没算', mx + mw / 2, 268);
  }

  // 模型说明
  ctx.textAlign = 'left';
  ctx.font = '13px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#4A6B62';
  ctx.fillText('面积模型（示意，不按比例）', mx, ty - 12);
  if (s >= 3) {
    ctx.font = 'bold 15px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = '#004D40';
    ctx.fillText('两块合起来 = ' + p.total, mx, by + 26);
  } else {
    ctx.font = '13px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = '#93A8A2';
    ctx.fillText('两块还没合起来', mx, by + 26);
  }

  // 中间箭头
  ctx.strokeStyle = '#A9CFC5';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(mx + mw + 20, 190);
  ctx.lineTo(520, 190);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(514, 184); ctx.lineTo(524, 190); ctx.lineTo(514, 196);
  ctx.fillStyle = '#A9CFC5'; ctx.fill();
  ctx.textAlign = 'center';
  ctx.font = '13px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#4A6B62';
  ctx.fillText('写成竖式', mx + mw + 88, 180);

  // ---- 右：竖式 ----
  var rightX = 792;
  var sa = String(SIM.a), sb = String(SIM.b);
  var s1 = String(p.p1), s2 = String(p.p2), st = String(p.total);
  var lineW = Math.max(sa.length, st.length) + 1;
  var lx1 = rightX - SIM_CW * lineW - 8, lx2 = rightX + 6;

  // 被乘数
  simNum(ctx, sa, rightX, 104, '#004D40');
  // 乘数（× 在左）
  simNum(ctx, sb, rightX, 142, '#004D40');
  simNum(ctx, '×', rightX - SIM_CW * sb.length, 142, '#004D40');
  // 横线
  ctx.strokeStyle = '#004D40';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(lx1, 160); ctx.lineTo(lx2, 160); ctx.stroke();

  // 第一行部分积（绿色，末位对齐个位）
  if (s >= 1) {
    simNum(ctx, s1, rightX, 198, '#00695C');
  } else {
    ctx.textAlign = 'right';
    ctx.font = '13px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = '#B6C6C1';
    ctx.fillText('第一笔还没算', rightX, 198);
  }

  // 第二行部分积（橙色，左移一格 = 末位对齐十位）
  if (s >= 2) {
    simNum(ctx, s2, rightX - SIM_CW, 234, '#BF360C');
  } else {
    ctx.textAlign = 'right';
    ctx.font = '13px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = '#B6C6C1';
    ctx.fillText('第二笔还没算', rightX, 234);
  }

  // 第二道横线 + 结果
  if (s >= 3) {
    ctx.strokeStyle = '#004D40';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(lx1, 252); ctx.lineTo(lx2, 252); ctx.stroke();
    simNum(ctx, st, rightX, 292, '#004D40');
  }

  // 空位提示：第二行右边那一格空着
  if (s >= 2) {
    ctx.strokeStyle = '#E0A88C';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 3]);
    ctx.strokeRect(rightX - SIM_CW + 2, 214, SIM_CW - 4, 26);
    ctx.setLineDash([]);
    ctx.textAlign = 'left';
    ctx.font = '12px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = '#8C6E5A';
    ctx.fillText('右边空出的这一格，就是省掉的 0', 536, 268);
  }

  // 竖式图例
  ctx.textAlign = 'left';
  ctx.font = '12.5px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#00695C';
  ctx.fillRect(536, 186, 11, 11);
  ctx.fillText('个位那笔', 552, 197);
  ctx.fillStyle = '#BF360C';
  ctx.fillRect(536, 222, 11, 11);
  ctx.fillText('十位那笔', 552, 233);

  simReadout();
}

function simReadout() {
  var p = simPart();
  var el = document.getElementById('simReadout');
  if (el) el.textContent = '第 ' + (SIM.step + 1) + ' 步 / 共 4 步';
  var tip = document.getElementById('simTip');
  if (tip) tip.textContent = simStepText(SIM.step);
  var note = document.getElementById('simNote');
  if (note) {
    note.textContent = SIM.step >= 3
      ? p.p1 + ' + ' + (p.p2 * 10) + ' = ' + p.total
      : '已算：' + (SIM.step >= 1 ? p.p1 : '—') + (SIM.step >= 2 ? ' 与 ' + (p.p2 * 10) : '');
  }
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

function simNext() {
  if (SIM.step >= 3) { simLog('已经到最后一步了，点「换一题」再来一组', false); return; }
  SIM.step++;
  simLog(simStepText(SIM.step), true);
  simDraw();
}

function simPrev() {
  if (SIM.step <= 0) { simLog('已经在第一步了', false); return; }
  SIM.step--;
  simLog('退回：' + simStepText(SIM.step), false);
  simDraw();
}

function simJump(n) {
  SIM.step = Math.max(0, Math.min(3, n));
  simLog('直接跳到：' + simStepText(SIM.step), true);
  simDraw();
}

function simSwap() {
  SIM.idx = (SIM.idx + 1) % SIM_POOL.length;
  SIM.a = SIM_POOL[SIM.idx][0];
  SIM.b = SIM_POOL[SIM.idx][1];
  SIM.step = 0;
  simLog('换一题：' + SIM.a + ' × ' + SIM.b, true);
  simDraw();
}

function simReset() {
  SIM.idx = 0;
  SIM.a = SIM_POOL[0][0];
  SIM.b = SIM_POOL[0][1];
  SIM.step = 0;
  SIM.log = [];
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('已重置：' + SIM.a + ' × ' + SIM.b + '，回到第 1 步');
  simDraw();
}

function simDemo() {
  SIM.step = 0;
  SIM.log = [];
  simDraw();
  var i = 0;
  var timer = setInterval(function () {
    i++;
    SIM.step = i;
    simDraw();
    if (i >= 3) clearInterval(timer);
  }, 700);
}

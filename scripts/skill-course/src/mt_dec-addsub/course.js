// ===== 引入页：答案卡「他错在哪」（防御性，本课文未直接调用）=====
function toggleAns(btn) {
  var card = btn && btn.closest ? btn.closest('.ans-card') : null;
  if (!card) return;
  card.classList.toggle('open');
  btn.textContent = card.classList.contains('open') ? '收起' : '他错在哪';
}

// ===== 仿真：两条小数条 + 小数点对齐的竖式 =====
var SIM_W = 860, SIM_H = 332;
var SIM = { ia: 0, da: 3, ib: 0, db: 4, op: '+', busy: false, log: [] };
var C_A = '#FFA000', C_B = '#26C6DA', C_R = '#5C6BC0';

function simNum(ip, d) { return String(ip) + '.' + d; }
function simOpSign(op) { return op === '+' ? '+' : '−'; }
function simCount(ip, d) { return ip * 10 + d; }

function simCalc() {
  var na = simCount(SIM.ia, SIM.da), nb = simCount(SIM.ib, SIM.db);
  var ok = true, nr;
  if (SIM.op === '+') nr = na + nb;
  else { if (na < nb) { ok = false; nr = 0; } else nr = na - nb; }
  return {
    na: na, nb: nb, nr: nr, ok: ok,
    ir: Math.floor(nr / 10), dr: nr % 10,
    carry: SIM.op === '+' && nr >= 10,
    borrow: SIM.op === '-' && ok && SIM.da < SIM.db
  };
}

function simCell(ctx, x, y, w, h, on, color) {
  ctx.fillStyle = on ? color : '#F1F2FA';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#1A237E';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(x, y, w, h);
}

function simChip(ctx, x, y, label) {
  ctx.fillStyle = '#FFECB3';
  ctx.fillRect(x, y, 34, 34);
  ctx.strokeStyle = '#FFA000';
  ctx.lineWidth = 1.8;
  ctx.strokeRect(x, y, 34, 34);
  ctx.textAlign = 'center';
  ctx.font = 'bold 18px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#8D6E00';
  ctx.fillText(label, x + 17, y + 24);
}

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  var r = simCalc();
  var cell = 30, barX = 168, gw = cell * 10;

  // 三行：A、B、结果
  var rows = [
    { ip: SIM.ia, d: SIM.da, color: C_A, y: 46, label: '第一个数' },
    { ip: SIM.ib, d: SIM.db, color: C_B, y: 122, label: '第二个数' },
    { ip: r.ir, d: r.dr, color: C_R, y: 214, label: '结果' }
  ];

  rows.forEach(function (row, idx) {
    ctx.textAlign = 'left';
    ctx.font = '12.5px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = '#7679A0';
    ctx.fillText(row.label, 34, row.y - 8);

    ctx.font = 'bold 24px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = idx === 2 ? '#3949AB' : '#1A237E';
    ctx.fillText(simNum(row.ip, row.d), 34, row.y + 26);

    if (row.ip > 0) simChip(ctx, 122, row.y - 4, String(row.ip));

    for (var i = 0; i < 10; i++) {
      simCell(ctx, barX + i * cell, row.y - 4, cell, 34, i < row.d, row.color);
    }

    ctx.textAlign = 'right';
    ctx.font = '12.5px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = idx === 2 ? '#3949AB' : '#7679A0';
    var c = simCount(row.ip, row.d);
    ctx.fillText(c + ' 个 0.1', barX + gw + 78, row.y + 18);
  });

  // 运算符（A、B 之间）
  ctx.textAlign = 'center';
  ctx.font = 'bold 26px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#1A237E';
  ctx.fillText(SIM.op, 132, 108);

  // 结果分隔线
  ctx.strokeStyle = '#C9CBE4';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(34, 190);
  ctx.lineTo(barX + gw + 80, 190);
  ctx.stroke();

  // ===== 右侧竖式：三个列位固定 =====
  var colInt = 640, colDot = 672, colTen = 702;
  ctx.strokeStyle = '#FFA000';
  ctx.lineWidth = 1.6;
  ctx.setLineDash([6, 5]);
  ctx.beginPath();
  ctx.moveTo(colDot + 8, 52);
  ctx.lineTo(colDot + 8, 214);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.font = 'bold 26px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#1A237E';
  // 第一行
  ctx.fillText(String(SIM.ia), colInt, 92);
  ctx.fillText('.', colDot + 8, 92);
  ctx.fillText(String(SIM.da), colTen, 92);
  // 第二行
  ctx.fillStyle = '#FF6F00';
  ctx.fillText(SIM.op, colInt - 32, 146);
  ctx.fillStyle = '#1A237E';
  ctx.fillText(String(SIM.ib), colInt, 146);
  ctx.fillText('.', colDot + 8, 146);
  ctx.fillText(String(SIM.db), colTen, 146);
  // 横线
  ctx.strokeStyle = '#1A237E';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(colInt - 46, 160);
  ctx.lineTo(colTen + 26, 160);
  ctx.stroke();
  // 结果
  ctx.fillStyle = r.ok ? '#3949AB' : '#C62828';
  ctx.fillText(r.ok ? String(r.ir) : '?', colInt, 206);
  if (r.ok) {
    ctx.fillText('.', colDot + 8, 206);
    ctx.fillText(String(r.dr), colTen, 206);
  } else {
    ctx.font = '15px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = '#C62828';
    ctx.fillText('不够减', colTen - 6, 206);
  }

  ctx.font = '12.5px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#FF8F00';
  ctx.fillText('小数点对齐', colDot + 8, 232);

  // 底部：进位 / 退位提示
  ctx.textAlign = 'center';
  ctx.font = 'bold 17px "Microsoft YaHei","Noto Sans SC",sans-serif';
  if (r.carry) {
    ctx.fillStyle = '#C62828';
    ctx.fillText('满十进一：' + r.nr + ' 个 0.1 = 1 个整 + ' + r.dr + ' 个 0.1', SIM_W / 2, 306);
  } else if (r.borrow) {
    ctx.fillStyle = '#C62828';
    ctx.fillText('退一当十：' + r.na + ' 个 0.1 − ' + r.nb + ' 个 0.1 = ' + r.nr + ' 个 0.1', SIM_W / 2, 306);
  } else if (!r.ok) {
    ctx.fillStyle = '#C62828';
    ctx.fillText('小数减大数，三年级还不算', SIM_W / 2, 306);
  } else {
    ctx.fillStyle = '#3949AB';
    ctx.fillText(simNum(SIM.ia, SIM.da) + ' ' + simOpSign(SIM.op) + ' ' + simNum(SIM.ib, SIM.db) + ' 就是 ' + r.na + ' 个 0.1 ' + simOpSign(SIM.op) + ' ' + r.nb + ' 个 0.1', SIM_W / 2, 306);
  }

  simReadout(r);
}

function simReadout(r) {
  r = r || simCalc();
  var a = simNum(SIM.ia, SIM.da), b = simNum(SIM.ib, SIM.db);
  var el = document.getElementById('simReadout');
  if (el) {
    if (!r.ok) el.textContent = a + ' − ' + b + '：不够减，先别算';
    else el.textContent = a + ' ' + simOpSign(SIM.op) + ' ' + b + ' = ' + simNum(r.ir, r.dr);
  }
  var tip = document.getElementById('simTip');
  if (!tip) return;
  if (!r.ok) tip.textContent = '小数减大数，三年级还不算';
  else if (r.carry) tip.textContent = r.na + ' + ' + r.nb + ' = ' + r.nr + ' 个 0.1，满十进一 → ' + simNum(r.ir, r.dr);
  else if (r.borrow) tip.textContent = a + ' 是 ' + r.na + ' 个 0.1，' + r.na + ' − ' + r.nb + ' = ' + r.nr + ' 个 0.1';
  else tip.textContent = r.na + ' 个 0.1' + (SIM.op === '+' ? ' 加 ' : ' 减 ') + r.nb + ' 个 0.1，是 ' + r.nr + ' 个 0.1';
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

function simPreset(kind) {
  if (SIM.busy) return;
  if (kind === 'add') { SIM.ia = 0; SIM.da = 3; SIM.ib = 0; SIM.db = 4; SIM.op = '+'; }
  else if (kind === 'carry') { SIM.ia = 0; SIM.da = 7; SIM.ib = 0; SIM.db = 6; SIM.op = '+'; }
  else if (kind === 'sub') { SIM.ia = 0; SIM.da = 9; SIM.ib = 0; SIM.db = 4; SIM.op = '-'; }
  else { SIM.ia = 1; SIM.da = 2; SIM.ib = 0; SIM.db = 5; SIM.op = '-'; }
  var r = simCalc();
  if (r.carry) simLog('0.7 + 0.6：13 个 0.1，满十进一 → 1.3', true);
  else if (r.borrow) simLog('1.2 − 0.5：12 个 0.1 − 5 个 0.1 = 7 个 0.1 → 0.7', true);
  else if (!r.ok) simLog('小数减大数，先换个题', false);
  else simLog(simNum(SIM.ia, SIM.da) + ' ' + simOpSign(SIM.op) + ' ' + simNum(SIM.ib, SIM.db) + ' = ' + simNum(r.ir, r.dr), false);
  simDraw();
}

function simBPlus() {
  if (SIM.busy) return;
  if (SIM.db < 9) SIM.db++;
  else { SIM.db = 0; if (SIM.ib < 1) SIM.ib++; }
  var r = simCalc();
  simLog('第二个数变成 ' + simNum(SIM.ib, SIM.db) + '：' + (r.ok ? '结果 ' + simNum(r.ir, r.dr) : '不够减了'), !r.ok);
  simDraw();
}

function simBMinus() {
  if (SIM.busy) return;
  if (SIM.db > 0) SIM.db--;
  else if (SIM.ib > 0) { SIM.ib--; SIM.db = 9; }
  var r = simCalc();
  simLog('第二个数变成 ' + simNum(SIM.ib, SIM.db) + '：' + (r.ok ? '结果 ' + simNum(r.ir, r.dr) : '不够减了'), !r.ok);
  simDraw();
}

function simReset() {
  if (SIM.busy) return;
  SIM.ia = 0; SIM.da = 3; SIM.ib = 0; SIM.db = 4; SIM.op = '+'; SIM.log = [];
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('已重置：0.3 + 0.4');
  simDraw();
}

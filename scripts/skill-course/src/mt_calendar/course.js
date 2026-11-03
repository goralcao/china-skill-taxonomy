// ===== 引入页：答案卡「他错在哪」（防御性，本课文未直接调用）=====
function toggleAns(btn) {
  var card = btn && btn.closest ? btn.closest('.ans-card') : null;
  if (!card) return;
  card.classList.toggle('open');
  btn.textContent = card.classList.contains('open') ? '收起' : '他错在哪';
}

// ===== 仿真：年历拆解器（12 个月各占一格，换年份看二月）=====
var SIM_W = 860, SIM_H = 332;
var SIM = { year: 2024, mode: 'all', busy: false, log: [] };
var BASE_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var C_BIG = '#EF6C00', C_SMALL = '#5E35B1', C_FEB = '#00897B';
var C_OFF_FILL = '#F3F0FA', C_OFF_LINE = '#E2DCF0', C_OFF_TEXT = '#BCB2D4';

function simIsLeap(y) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

function simMonthDays(y, m) {
  if (m === 2) return simIsLeap(y) ? 29 : 28;
  return BASE_DAYS[m - 1];
}

function simYearDays(y) {
  var s = 0;
  for (var m = 1; m <= 12; m++) s += simMonthDays(y, m);
  return s;
}

function simMonthColor(m) {
  if (m === 2) return C_FEB;
  return simMonthDays(SIM.year, m) === 31 ? C_BIG : C_SMALL;
}

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  var y = SIM.year, leap = simIsLeap(y), total = simYearDays(y);

  // 顶部读数
  ctx.textAlign = 'center';
  ctx.font = 'bold 23px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#4527A0';
  ctx.fillText(y + ' 年 · ' + (leap ? '闰年' : '平年') + ' · 全年 ' + total + ' 天', SIM_W / 2, 32);

  ctx.font = '15px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#6D5C99';
  var hint = '二月 ' + (leap ? 29 : 28) + ' 天';
  if (SIM.mode === 'big') hint = '亮着的都是 31 天的月，一共 7 个';
  else if (SIM.mode === 'small') hint = '亮着的都是 30 天的月，一共 4 个';
  else if (SIM.mode === 'feb') hint = '只有二月会变：闰年 29、平年 28';
  ctx.fillText(hint, SIM_W / 2, 56);

  // 12 个格：4 列 × 3 行
  var cols = 4, rows = 3, cw = 196, ch = 72, gx = 18, gy = 14;
  var x0 = (SIM_W - (cols * cw + (cols - 1) * gx)) / 2, y0 = 70;

  for (var i = 0; i < 12; i++) {
    var m = i + 1;
    var d = simMonthDays(y, m);
    var col = i % cols, row = Math.floor(i / cols);
    var x = x0 + col * (cw + gx), yy = y0 + row * (ch + gy);

    var on = true;
    if (SIM.mode === 'big') on = (m !== 2 && d === 31);
    else if (SIM.mode === 'small') on = (m !== 2 && d === 30);
    else if (SIM.mode === 'feb') on = (m === 2);

    var fill = on ? simMonthColor(m) : C_OFF_FILL;
    var line = on ? 'rgba(255,255,255,.55)' : C_OFF_LINE;
    var txt = on ? '#FFFFFF' : C_OFF_TEXT;

    ctx.fillStyle = fill;
    ctx.fillRect(x, yy, cw, ch);
    ctx.strokeStyle = line;
    ctx.lineWidth = on ? 2 : 1;
    ctx.strokeRect(x, yy, cw, ch);

    ctx.textAlign = 'left';
    ctx.font = 'bold 20px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = txt;
    ctx.fillText(m + ' 月', x + 16, yy + 30);

    ctx.font = '14px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = on ? 'rgba(255,255,255,.88)' : C_OFF_TEXT;
    var tag = (m === 2) ? (d === 29 ? '闰年' : '平年') : (d === 31 ? '大月' : '小月');
    ctx.fillText(tag, x + 16, yy + 56);

    ctx.textAlign = 'right';
    ctx.font = 'bold 30px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = txt;
    ctx.fillText(String(d), x + cw - 16, yy + 46);
    ctx.font = '13px "Microsoft YaHei","Noto Sans SC",sans-serif';
    ctx.fillStyle = on ? 'rgba(255,255,255,.85)' : C_OFF_TEXT;
    ctx.fillText('天', x + cw - 16, yy + 64);
  }

  simReadout();
}

function simReadout() {
  var y = SIM.year, leap = simIsLeap(y), total = simYearDays(y);
  var el = document.getElementById('simReadout');
  if (el) el.textContent = y + ' 年（' + (leap ? '闰年' : '平年') + '）全年 ' + total + ' 天';
  var tip = document.getElementById('simTip');
  if (!tip) return;
  if (SIM.mode === 'big') tip.textContent = '31 天的月有 7 个：1、3、5、7、8、10、12';
  else if (SIM.mode === 'small') tip.textContent = '30 天的月有 4 个：4、6、9、11';
  else if (SIM.mode === 'feb') tip.textContent = '二月是唯一会变的一格，闰年才 29 天';
  else tip.textContent = '先标一遍大月，看能亮几格';
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

function simSetYear(v) {
  if (v < 1900 || v > 2100) {
    simLog('只在 1900—2100 之间看，已经到头了', false);
    return;
  }
  SIM.year = v;
  var leap = simIsLeap(v);
  simLog('切到 ' + v + ' 年：' + (leap ? '闰年' : '平年') + '，二月 ' + (leap ? 29 : 28) + ' 天', true);
  simDraw();
}

function simPrevYear() { if (!SIM.busy) simSetYear(SIM.year - 1); }
function simNextYear() { if (!SIM.busy) simSetYear(SIM.year + 1); }

function simBig() {
  if (SIM.busy) return;
  SIM.mode = 'big';
  simLog('标出大月：31 天的月一共 7 个', true);
  simDraw();
}

function simSmall() {
  if (SIM.busy) return;
  SIM.mode = 'small';
  simLog('标出小月：30 天的月一共 4 个', true);
  simDraw();
}

function simFeb() {
  if (SIM.busy) return;
  SIM.mode = 'feb';
  simLog('找出二月：' + SIM.year + ' 年是 ' + simMonthDays(SIM.year, 2) + ' 天', true);
  simDraw();
}

function simAll() {
  if (SIM.busy) return;
  SIM.mode = 'all';
  simLog('看全部：12 个月一起显示', false);
  simDraw();
}

function simReset() {
  if (SIM.busy) return;
  SIM.year = 2024; SIM.mode = 'all'; SIM.log = [];
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('已重置：回到 2024 年');
  simDraw();
}

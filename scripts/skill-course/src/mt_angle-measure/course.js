// ===== 仿真：量角器（内外两圈同时显示）=====
var SIM_W = 880, SIM_H = 360;
var SIM = { deg: 60, busy: false, log: [] };

function simKind(d) {
  if (d === 90) return '直角';
  if (d === 180) return '平角';
  if (d < 90) return '锐角';
  return '钝角';
}

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  var cx = 300, cy = 280, R = 210;

  // 量角器半圆底
  ctx.beginPath();
  ctx.arc(cx, cy, R, Math.PI, 0);
  ctx.closePath();
  ctx.fillStyle = '#E3F2FD';
  ctx.fill();
  ctx.strokeStyle = '#01579B';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 内半圆（空白区）
  ctx.beginPath();
  ctx.arc(cx, cy, R - 62, Math.PI, 0);
  ctx.closePath();
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.strokeStyle = '#B8D2EA';
  ctx.lineWidth = 1;
  ctx.stroke();

  // 刻度
  for (var d = 0; d <= 180; d += 5) {
    var rad = Math.PI - d * Math.PI / 180;
    var len = (d % 10 === 0) ? 16 : 8;
    var r1 = R - 2, r2 = R - 2 - len;
    ctx.beginPath();
    ctx.moveTo(cx + r1 * Math.cos(rad), cy - r1 * Math.sin(rad));
    ctx.lineTo(cx + r2 * Math.cos(rad), cy - r2 * Math.sin(rad));
    ctx.strokeStyle = d % 10 === 0 ? '#01579B' : '#8FB4D4';
    ctx.lineWidth = d % 10 === 0 ? 1.4 : 0.9;
    ctx.stroke();
  }

  // 内外圈数字（每 30°）
  ctx.textAlign = 'center';
  ctx.font = '12px monospace';
  for (var a = 0; a <= 180; a += 30) {
    var rad2 = Math.PI - a * Math.PI / 180;
    // 外圈：右边 0 → 左边 180
    ctx.fillStyle = '#01579B';
    ctx.fillText(String(a), cx + (R - 30) * Math.cos(rad2), cy - (R - 30) * Math.sin(rad2) + 4);
    // 内圈：左边 0 → 右边 180（即 180 - a）
    ctx.fillStyle = '#EF6C00';
    ctx.fillText(String(180 - a), cx + (R - 48) * Math.cos(rad2), cy - (R - 48) * Math.sin(rad2) + 4);
  }

  // 角：固定边（0°）+ 可动边
  ctx.strokeStyle = '#01579B';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + 235, cy);
  ctx.stroke();

  var rr = Math.PI - SIM.deg * Math.PI / 180;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + 235 * Math.cos(rr), cy - 235 * Math.sin(rr));
  ctx.strokeStyle = '#C62828';
  ctx.stroke();

  // 顶点
  ctx.beginPath();
  ctx.arc(cx, cy, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#C62828';
  ctx.fill();

  // 角度弧
  ctx.beginPath();
  ctx.arc(cx, cy, 70, Math.PI, rr, true);
  ctx.strokeStyle = '#FFB300';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.font = 'bold 15px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#EF6C00';
  var midAng = Math.PI - (SIM.deg / 2) * Math.PI / 180;
  ctx.fillText(SIM.deg + '°', cx + 104 * Math.cos(midAng), cy - 104 * Math.sin(midAng) + 6);

  // 右侧读数区
  var rx = 570;
  ctx.textAlign = 'left';
  ctx.font = '15px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#5B7B9A';
  ctx.fillText('这个角是', rx, 82);

  ctx.font = 'bold 46px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#01579B';
  ctx.fillText(SIM.deg + '°', rx, 134);

  ctx.font = 'bold 20px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#EF6C00';
  ctx.fillText(simKind(SIM.deg), rx, 168);

  ctx.font = '14px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#5B7B9A';
  ctx.fillText('外圈读 ' + SIM.deg + '°', rx, 208);
  ctx.fillStyle = '#9AA7B5';
  ctx.fillText('内圈读 ' + (180 - SIM.deg) + '°（错的）', rx, 232);
  ctx.fillStyle = '#5B7B9A';
  ctx.fillText('两圈相加 = 180°', rx, 256);

  // 提示条
  ctx.fillStyle = '#F5F9FE';
  ctx.fillRect(rx - 12, 276, 268, 52);
  ctx.strokeStyle = '#B8D2EA';
  ctx.lineWidth = 1;
  ctx.strokeRect(rx - 12, 276, 268, 52);
  ctx.font = '13px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#01579B';
  ctx.fillText('零刻度线在右边', rx, 298);
  ctx.fillText('→ 只看外圈', rx, 318);

  simReadout();
}

function simReadout() {
  var el = document.getElementById('simReadout');
  if (el) el.textContent = SIM.deg + '° · ' + simKind(SIM.deg);
  var tip = document.getElementById('simTip');
  if (tip) tip.textContent = '零在右边，读外圈 ' + SIM.deg + '°；内圈那个 ' + (180 - SIM.deg) + '° 是错的';
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

function simSet(d, why) {
  if (SIM.busy) return;
  SIM.deg = Math.max(0, Math.min(180, d));
  simLog((why || '调到') + ' ' + SIM.deg + '°，' + simKind(SIM.deg) + '；内圈读成 ' + (180 - SIM.deg) + '°', true);
  simDraw();
}

function simPlus() { simSet(SIM.deg + 5); }
function simMinus() { simSet(SIM.deg - 5); }
function simRight() { simSet(90, '直角'); }
function simFlat() { simSet(180, '平角'); }
function simSharpen() { simSet(30, '锐角'); }
function simObtuse() { simSet(120, '钝角'); }

function simReset() {
  if (SIM.busy) return;
  SIM.deg = 60;
  SIM.log = [];
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('已重置：60°，锐角');
  simDraw();
}

// ===== 引入页：答案卡「他错在哪」（防御性，本课文未直接调用）=====
function toggleAns(btn) {
  var card = btn && btn.closest ? btn.closest('.ans-card') : null;
  if (!card) return;
  card.classList.toggle('open');
  btn.textContent = card.classList.contains('open') ? '收起' : '他错在哪';
}

// ===== 仿真：方格地图按方向走（上北下南左西右东）=====
var SIM_W = 860, SIM_H = 332;
var GRID = 8;
var SIM = { gx: 4, gy: 4, sx: 4, sy: 4, trail: [[4, 4]], busy: false, log: [] };

function simClampInt(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  var cell = 34, x0 = 80, y0 = 30;
  var gsize = GRID * cell;

  // 底色
  ctx.fillStyle = '#F2F7FD';
  ctx.fillRect(x0, y0, gsize, gsize);

  // 走过的格子淡黄
  ctx.fillStyle = '#FFF4C2';
  for (var t = 0; t < SIM.trail.length; t++) {
    ctx.fillRect(x0 + SIM.trail[t][0] * cell, y0 + SIM.trail[t][1] * cell, cell, cell);
  }

  // 网格线
  ctx.strokeStyle = '#B9D4F0';
  ctx.lineWidth = 1;
  for (var i = 0; i <= GRID; i++) {
    ctx.beginPath(); ctx.moveTo(x0 + i * cell, y0); ctx.lineTo(x0 + i * cell, y0 + gsize); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x0, y0 + i * cell); ctx.lineTo(x0 + gsize, y0 + i * cell); ctx.stroke();
  }
  // 外框
  ctx.strokeStyle = '#1565C0';
  ctx.lineWidth = 3;
  ctx.strokeRect(x0, y0, gsize, gsize);

  // 方位标注（网格四周）
  ctx.textAlign = 'center';
  ctx.font = 'bold 16px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#1565C0';
  ctx.fillText('北', x0 + gsize / 2, y0 - 10);
  ctx.fillText('南', x0 + gsize / 2, y0 + gsize + 22);
  ctx.textAlign = 'right';
  ctx.fillText('西', x0 - 10, y0 + gsize / 2 + 5);
  ctx.textAlign = 'left';
  ctx.fillText('东', x0 + gsize + 10, y0 + gsize / 2 + 5);

  // 起点标记
  var scx = x0 + SIM.sx * cell + cell / 2, scy = y0 + SIM.sy * cell + cell / 2;
  ctx.beginPath();
  ctx.arc(scx, scy, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#9E9E9E';
  ctx.fill();

  // 小人
  var cx = x0 + SIM.gx * cell + cell / 2, cy = y0 + SIM.gy * cell + cell / 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 12, 0, Math.PI * 2);
  ctx.fillStyle = '#F9A825';
  ctx.fill();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 3;
  ctx.stroke();

  // 右侧指南针
  var ccx = 650, ccy = 166, R = 66;
  ctx.beginPath(); ctx.arc(ccx, ccy, R, 0, Math.PI * 2);
  ctx.fillStyle = '#E3EEFA'; ctx.fill();
  ctx.strokeStyle = '#1565C0'; ctx.lineWidth = 3; ctx.stroke();
  ctx.strokeStyle = '#1565C0'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(ccx, ccy - R); ctx.lineTo(ccx, ccy + R); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ccx - R, ccy); ctx.lineTo(ccx + R, ccy); ctx.stroke();
  ctx.fillStyle = '#1565C0';
  ctx.font = 'bold 18px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('北', ccx, ccy - R - 10);
  ctx.fillText('南', ccx, ccy + R + 24);
  ctx.fillText('东', ccx + R + 16, ccy + 6);
  ctx.fillText('西', ccx - R - 16, ccy + 6);

  // 位移说明
  var dx = SIM.gx - SIM.sx;
  var dn = SIM.sy - SIM.gy; // 向北为正
  ctx.textAlign = 'center';
  ctx.font = 'bold 20px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#1565C0';
  var dtext = (dx === 0 && dn === 0) ? '还在起点' : simMoveText(dx, dn);
  ctx.fillText(dtext, ccx, ccy + R + 62);

  simReadout();
}

function simMoveText(dx, dn) {
  var parts = [];
  if (dx > 0) parts.push('向东 ' + dx + ' 格');
  else if (dx < 0) parts.push('向西 ' + (-dx) + ' 格');
  if (dn > 0) parts.push('向北 ' + dn + ' 格');
  else if (dn < 0) parts.push('向南 ' + (-dn) + ' 格');
  return '从起点：' + parts.join('、');
}

function simReadout() {
  var el = document.getElementById('simReadout');
  var dx = SIM.gx - SIM.sx, dn = SIM.sy - SIM.gy;
  if (el) el.textContent = (dx === 0 && dn === 0) ? '从起点出发，还没走' : simMoveText(dx, dn);
  var tip = document.getElementById('simTip');
  if (!tip) return;
  tip.textContent = '地图上：上北、下南、左西、右东';
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

function simPushTrail() {
  SIM.trail.push([SIM.gx, SIM.gy]);
}

function simMove(dir) {
  if (SIM.busy) return;
  var ox = SIM.gx, oy = SIM.gy;
  if (dir === 'E') { if (SIM.gx >= GRID - 1) { simLog('已经到最东边了'); simDraw(); return; } SIM.gx++; }
  else if (dir === 'W') { if (SIM.gx <= 0) { simLog('已经到最西边了'); simDraw(); return; } SIM.gx--; }
  else if (dir === 'N') { if (SIM.gy <= 0) { simLog('已经到最北边了'); simDraw(); return; } SIM.gy--; }
  else if (dir === 'S') { if (SIM.gy >= GRID - 1) { simLog('已经到最南边了'); simDraw(); return; } SIM.gy++; }
  simPushTrail();
  var name = { E: '东', W: '西', N: '北', S: '南' }[dir];
  simLog('向' + name + '走 1 格 → ' + simMoveText(SIM.gx - SIM.sx, SIM.sy - SIM.gy), false);
  simDraw();
}

function simEast() { simMove('E'); }
function simWest() { simMove('W'); }
function simNorth() { simMove('N'); }
function simSouth() { simMove('S'); }

function simDemo() {
  if (SIM.busy) return;
  SIM.busy = true;
  SIM.gx = SIM.sx; SIM.gy = SIM.sy; SIM.trail = [[SIM.sx, SIM.sy]]; SIM.log = [];
  simLog('演示：从起点出发，先向东 2 格，再向北 1 格', true);
  simDraw();
  var route = ['E', 'E', 'N'];
  var i = 0;
  var timer = setInterval(function () {
    if (i >= route.length) {
      clearInterval(timer);
      simLog('到终点：在起点的东北方向（东 2、北 1）', true);
      SIM.busy = false;
      simDraw();
      return;
    }
    var d = route[i];
    if (d === 'E') SIM.gx++; else if (d === 'W') SIM.gx--;
    else if (d === 'N') SIM.gy--; else SIM.gy++;
    simPushTrail();
    var name = { E: '东', W: '西', N: '北', S: '南' }[d];
    simLog('向' + name + ' 1 格 → ' + simMoveText(SIM.gx - SIM.sx, SIM.sy - SIM.gy), i === route.length - 1);
    simDraw();
    i++;
  }, 750);
}

function simReset() {
  if (SIM.busy) return;
  SIM.gx = 4; SIM.gy = 4; SIM.trail = [[4, 4]]; SIM.log = [];
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('已重置：小人回到地图中心');
  simDraw();
}

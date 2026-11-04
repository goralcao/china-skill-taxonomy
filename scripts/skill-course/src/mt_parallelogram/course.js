// ===== 仿真：拖顶点变形，看对边还平不平行 =====
var SIM_W = 880, SIM_H = 360;
var SIM = { mode: 'para', skew: 120, topW: 200, log: [] };
var SIM_BASE = 320;      // 底边像素长
var SIM_TOP_Y = 134;     // 上边 y
var SIM_BOT_Y = 290;     // 下边 y
var SIM_LEFT = 120, SIM_RIGHT = 440;
var PX_PER_CM = 4;

function simGeom() {
  var topW = (SIM.mode === 'para') ? SIM_BASE : SIM.topW;
  var skew = (SIM.mode === 'para') ? SIM.skew : 0;
  var cxU = (SIM_LEFT + SIM_RIGHT) / 2 - topW / 2 + skew;
  return {
    topW: topW, skew: skew, cxU: cxU,
    A: { x: cxU, y: SIM_TOP_Y },
    B: { x: cxU + topW, y: SIM_TOP_Y },
    C: { x: SIM_RIGHT, y: SIM_BOT_Y },
    D: { x: SIM_LEFT, y: SIM_BOT_Y }
  };
}

function simLegsParallel(g) {
  var lx = g.D.x - g.A.x, rx = g.C.x - g.B.x;
  return Math.abs(lx - rx) < 0.6;
}

function simCm(px) { return Math.round(px / PX_PER_CM); }

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  var g = simGeom();
  var legsPar = simLegsParallel(g);
  var h = SIM_BOT_Y - SIM_TOP_Y;

  // 标题
  ctx.textAlign = 'center';
  ctx.font = 'bold 19px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#4527A0';
  ctx.fillText(SIM.mode === 'para' ? '平行四边形：两组对边都平行' : '梯形：只有一组对边平行', SIM_W / 2, 40);

  // 图形
  ctx.beginPath();
  ctx.moveTo(g.A.x, g.A.y);
  ctx.lineTo(g.B.x, g.B.y);
  ctx.lineTo(g.C.x, g.C.y);
  ctx.lineTo(g.D.x, g.D.y);
  ctx.closePath();
  ctx.fillStyle = SIM.mode === 'para' ? '#EDE7F6' : '#FFF3E0';
  ctx.fill();
  ctx.strokeStyle = SIM.mode === 'para' ? '#4527A0' : '#E65100';
  ctx.lineWidth = 3;
  ctx.stroke();

  // 上边、下边加深（平行的那一组）
  ctx.strokeStyle = '#FFA000';
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(g.A.x, g.A.y); ctx.lineTo(g.B.x, g.B.y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(g.D.x, g.D.y); ctx.lineTo(g.C.x, g.C.y); ctx.stroke();

  // 高：从上边左端垂直落到底
  ctx.strokeStyle = '#FFA000';
  ctx.lineWidth = 2.2;
  ctx.setLineDash([7, 5]);
  ctx.beginPath(); ctx.moveTo(g.A.x, g.A.y); ctx.lineTo(g.A.x, SIM_BOT_Y); ctx.stroke();
  ctx.setLineDash([]);
  // 直角标记
  ctx.strokeStyle = '#E65100';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(g.A.x + 12, SIM_BOT_Y); ctx.lineTo(g.A.x + 12, SIM_BOT_Y - 12); ctx.lineTo(g.A.x, SIM_BOT_Y - 12);
  ctx.stroke();
  ctx.textAlign = 'left';
  ctx.font = '13px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#E65100';
  ctx.fillText('高 ' + simCm(h) + ' 厘米', g.A.x + 16, SIM_TOP_Y + 78);

  // 顶点
  [[g.A, '上边左顶点'], [g.B, '上边右顶点']].forEach(function (it) {
    ctx.beginPath();
    ctx.arc(it[0].x, it[0].y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#FF7043';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // 边长标注
  ctx.textAlign = 'center';
  ctx.font = '13px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#4527A0';
  ctx.fillText('下底 ' + simCm(SIM_BASE) + ' 厘米', (SIM_LEFT + SIM_RIGHT) / 2, SIM_BOT_Y + 24);
  ctx.fillStyle = '#E65100';
  ctx.fillText((SIM.mode === 'para' ? '上边 ' : '上底 ') + simCm(g.topW) + ' 厘米', g.cxU + g.topW / 2, SIM_TOP_Y - 14);

  // ---- 右侧判定面板 ----
  var px = 660, py = 96;
  ctx.textAlign = 'left';
  ctx.font = 'bold 15px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#4527A0';
  ctx.fillText('对边是否平行', px, py);

  ctx.font = '14px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#2E7D32';
  ctx.fillText('✓ 上边 ∥ 下边', px, py + 34);
  ctx.fillStyle = legsPar ? '#2E7D32' : '#C62828';
  ctx.fillText((legsPar ? '✓ ' : '✗ ') + '左腰 ∥ 右腰', px, py + 66);

  ctx.strokeStyle = '#C5B8E0';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(px, py + 84); ctx.lineTo(px + 190, py + 84); ctx.stroke();

  ctx.font = 'bold 15px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = SIM.mode === 'para' ? '#4527A0' : '#E65100';
  ctx.fillText(SIM.mode === 'para' ? '→ 平行四边形' : '→ 梯形', px, py + 112);
  ctx.font = '13px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#6E5FA8';
  ctx.fillText(SIM.mode === 'para' ? '两组对边都平行' : '只有一组对边平行', px, py + 136);

  // 底部提示
  ctx.textAlign = 'center';
  ctx.font = '13.5px "Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = '#1A1230';
  var tip = (SIM.mode === 'para')
    ? '上边右移 ' + simCm(SIM.skew) + ' 厘米：四条边长度不变，四个角变了，对边仍然平行'
    : '上底缩到 ' + simCm(g.topW) + ' 厘米：两条腰不平行了，只剩一组对边平行';
  ctx.fillText(tip, SIM_W / 2, 338);

  simReadout(legsPar);
}

function simReadout(legsPar) {
  var g = simGeom();
  var el = document.getElementById('simReadout');
  if (el) {
    el.textContent = (SIM.mode === 'para' ? '平行四边形' : '梯形') + ' · ' +
      (legsPar ? '两组对边都平行' : '只有一组对边平行');
  }
  var tip = document.getElementById('simTip');
  if (tip) {
    tip.textContent = (SIM.mode === 'para')
      ? '上边右移 ' + simCm(SIM.skew) + ' 厘米，四条边长度没变，两组对边始终平行'
      : '上底 ' + simCm(g.topW) + ' 厘米，两条腰已经不平行了';
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

function simSkew(d) {
  if (SIM.mode !== 'para') { simLog('梯形模式下上边只能变短变长，点「切换」回到平行四边形再移', false); return; }
  SIM.skew = Math.max(20, Math.min(160, SIM.skew + d));
  simLog('上边右移 ' + simCm(SIM.skew) + ' 厘米，两组对边仍平行（四边形还是平行四边形）', true);
  simDraw();
}

function simTop(d) {
  if (SIM.mode !== 'trap') { simLog('平行四边形模式下上边长度固定，点「切换梯形」才能改', false); return; }
  SIM.topW = Math.max(120, Math.min(300, SIM.topW + d));
  var g = simGeom();
  simLog('上底 ' + simCm(g.topW) + ' 厘米，两条腰' + (simLegsParallel(g) ? '还平行（已变成平行四边形）' : '不平行了'), true);
  simDraw();
}

function simMode() {
  SIM.mode = (SIM.mode === 'para') ? 'trap' : 'para';
  simLog(SIM.mode === 'para' ? '切回平行四边形：两组对边都平行' : '切成梯形：只有上底与下底平行', true);
  simDraw();
}

function simReset() {
  SIM.mode = 'para';
  SIM.skew = 120;
  SIM.topW = 200;
  SIM.log = [];
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('已重置：平行四边形，两组对边都平行');
  simDraw();
}

function simDemo() {
  SIM.mode = 'para';
  SIM.skew = 40;
  simDraw();
  var k = 0;
  var timer = setInterval(function () {
    k++;
    SIM.skew = 40 + k * 20;
    if (SIM.skew > 160) { clearInterval(timer); SIM.mode = 'trap'; SIM.topW = 200; }
    simDraw();
  }, 600);
}

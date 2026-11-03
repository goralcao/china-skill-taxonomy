// ===== 引入页：答案卡「他错在哪」 =====
function toggleAns(btn) {
  var card = btn.closest('.ans-card');
  if (!card) return;
  card.classList.toggle('open');
  btn.textContent = card.classList.contains('open') ? '收起' : '他错在哪';
}

// ===== 仿真：数位桶（满十打包 / 借一拆包）=====
var SIM_W = 860, SIM_H = 332;
var SIM = { c: [0, 0, 0], anim: null, flash: [0, 0, 0], log: [] };
var BX = [140, 430, 720];                     // 个位 / 十位 / 百位
var BNAME = ['个位', '十位', '百位'];
var BUNIT = ['一', '十', '百'];
var BCOLOR = ['#42A5F5', '#1565C0', '#0D47A1'];
var BTOP = 62, BBOT = 296, BW = 148;
var BLK = 26, GAP = 6, ROWH = 32, PER_ROW = 4;

function simRound(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* 第 i 个桶里第 k 个方块的左下角坐标（自底向上堆） */
function simBlockPos(i, k) {
  var row = Math.floor(k / PER_ROW), col = k % PER_ROW;
  var totalW = PER_ROW * BLK + (PER_ROW - 1) * GAP;
  return {
    x: BX[i] - totalW / 2 + col * (BLK + GAP),
    y: BBOT - 14 - BLK - row * ROWH
  };
}

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  for (var i = 0; i < 3; i++) {
    var cx = BX[i];
    simRound(ctx, cx - BW / 2, BTOP, BW, BBOT - BTOP, 14);
    ctx.fillStyle = '#F4FAFF';
    ctx.fill();
    ctx.strokeStyle = '#BBD9F0';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#1565C0';
    ctx.font = 'bold 22px "Noto Sans SC","Microsoft YaHei",sans-serif';
    ctx.fillText(BNAME[i], cx, 48);

    for (var k = 0; k < SIM.c[i]; k++) {
      var p = simBlockPos(i, k);
      simRound(ctx, p.x, p.y, BLK, BLK, 4);
      ctx.fillStyle = BCOLOR[i];
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.75)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.fillStyle = '#5B7A99';
    ctx.font = 'bold 19px "Consolas",monospace';
    ctx.fillText('× ' + SIM.c[i], cx, 324);
  }

  if (SIM.anim) simDrawAnim(ctx);
  simDrawFlash(ctx);
}

function simDrawAnim(ctx) {
  var a = SIM.anim;
  var t = (performance.now() - a.t0) / a.dur;
  if (t > 1) t = 1;
  var e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;   // ease-in-out

  if (a.kind === 'carry') {
    var target = simBlockPos(a.from + 1, SIM.c[a.from + 1]);
    var tx = target.x + BLK / 2, ty = target.y + BLK / 2;
    for (var k = 0; k < 10; k++) {
      var p = simBlockPos(a.from, k);
      var scale = 1 - 0.72 * e;
      var size = BLK * scale;
      var x = p.x + BLK / 2 + (tx - p.x - BLK / 2) * e;
      var y = p.y + BLK / 2 + (ty - p.y - BLK / 2) * e;
      simRound(ctx, x - size / 2, y - size / 2, size, size, 4);
      ctx.fillStyle = BCOLOR[a.from];
      ctx.globalAlpha = 1 - 0.3 * e;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  if (a.kind === 'borrow') {
    var p1 = simBlockPos(a.from, SIM.c[a.from] - 1);
    var dst = simBlockPos(a.from - 1, SIM.c[a.from - 1] + 9);
    var cx1 = p1.x + BLK / 2 + (dst.x + BLK / 2 - p1.x - BLK / 2) * e;
    var cy1 = p1.y + BLK / 2 + (dst.y + BLK / 2 - p1.y - BLK / 2) * e;
    simRound(ctx, cx1 - BLK / 2, cy1 - BLK / 2, BLK, BLK, 4);
    ctx.fillStyle = BCOLOR[a.from];
    ctx.fill();
    ctx.strokeStyle = '#D84315';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (t > 0.55) {
      var alpha = (t - 0.55) / 0.45;
      for (var j = 0; j < 10; j++) {
        var q = simBlockPos(a.from - 1, SIM.c[a.from - 1] + j);
        simRound(ctx, q.x, q.y, BLK, BLK, 4);
        ctx.fillStyle = BCOLOR[a.from - 1];
        ctx.globalAlpha = alpha * 0.6;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
  }
}

function simDrawFlash(ctx) {
  var now = performance.now();
  for (var i = 0; i < 3; i++) {
    var dt = now - SIM.flash[i];
    if (!SIM.flash[i] || dt > 1100) continue;
    var alpha = 1 - dt / 1100;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#D84315';
    ctx.font = 'bold 30px "Consolas",monospace';
    ctx.textAlign = 'center';
    ctx.fillText('+1', BX[i], 32 - 8 * (1 - alpha));
    ctx.strokeStyle = 'rgba(216,67,21,' + (alpha * 0.8) + ')';
    ctx.lineWidth = 3;
    simRound(ctx, BX[i] - BW / 2 - 3, BTOP - 3, BW + 6, BBOT - BTOP + 6, 16);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

// ---- 读数 / 提示 / 日志 ----
function simValue() { return SIM.c[0] + SIM.c[1] * 10 + SIM.c[2] * 100; }

function simReadout() {
  var el = document.getElementById('simReadout');
  if (el) el.textContent = String(simValue());
  var tip = document.getElementById('simTip');
  if (tip) {
    if (simValue() === 0) {
      tip.textContent = '现在三个桶都是空的';
    } else {
      tip.textContent = '现在是 ' + simValue() + '：' + SIM.c[2] + ' 个百、' + SIM.c[1] + ' 个十、' + SIM.c[0] + ' 个一';
    }
  }
}

function simLog(msg, hl) {
  SIM.log.push({ t: msg, hl: !!hl });
  if (SIM.log.length > 4) SIM.log.shift();
  var box = document.getElementById('simLog');
  if (!box) return;
  box.innerHTML = SIM.log.map(function (x) {
    return '<div' + (x.hl ? ' class="hl"' : '') + '>· ' + x.t + '</div>';
  }).join('');
}

// ---- 动画 + 队列 ----
function simAnimCarry(from, done) {
  SIM.anim = { kind: 'carry', from: from, t0: performance.now(), dur: 760 };
  var tick = function () {
    var t = (performance.now() - SIM.anim.t0) / SIM.anim.dur;
    simDraw();
    if (t >= 1) {
      SIM.anim = null;
      SIM.c[from] -= 10;
      SIM.c[from + 1] += 1;
      SIM.flash[from + 1] = performance.now();
      simReadout();
      simDraw();
      done();
      return;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function simAnimBorrow(from, done) {
  SIM.anim = { kind: 'borrow', from: from, t0: performance.now(), dur: 680 };
  var tick = function () {
    var t = (performance.now() - SIM.anim.t0) / SIM.anim.dur;
    simDraw();
    if (t >= 1) {
      SIM.anim = null;
      SIM.c[from] -= 1;
      SIM.c[from - 1] += 10;
      SIM.flash[from - 1] = performance.now();
      simReadout();
      simDraw();
      done();
      return;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

var SIMQ = [];
function simNext() {
  if (!SIMQ.length) { simReadout(); return; }
  SIMQ[0](function () { SIMQ.shift(); setTimeout(simNext, 20); });
}
function simPush(fn) {
  SIMQ.push(fn);
  if (SIMQ.length === 1) simNext();
}
function runSeq(steps, done) {
  var k = 0;
  (function step() {
    if (k >= steps.length) { done(); return; }
    steps[k++](step);
  })();
}

// ---- 操作 ----
function opAdd(i) {
  return function (done) {
    SIM.c[i] += 1;
    simReadout();
    simDraw();
    if (SIM.c[i] >= 10 && i < 2) {
      simLog(BNAME[i] + '满 10 → 捆成 1 捆，送进' + BNAME[i + 1], true);
      simAnimCarry(i, done);
      return;
    }
    if (SIM.c[i] >= 10 && i === 2) {
      simLog('百位也满了——到千位了，这一课先练到三位数', true);
    }
    setTimeout(done, 160);
  };
}

function opSub(i) {
  return function (done) {
    if (SIM.c[i] > 0) {
      SIM.c[i] -= 1;
      simReadout();
      simDraw();
      setTimeout(done, 160);
      return;
    }
    // 本位空了：往左边找最近的非空桶
    var j = i + 1;
    while (j < 3 && SIM.c[j] === 0) j++;
    if (j >= 3) {
      simLog(BNAME[i] + '已经是空的，左边也没有可借的了', true);
      setTimeout(done, 320);
      return;
    }
    simLog(BNAME[i] + '空了 → 向' + BNAME[j] + '借 1 个' + BUNIT[j] + '，拆成 10 个' + BUNIT[i], true);
    var steps = [];
    for (var lv = j; lv > i; lv--) {
      (function (from) {
        steps.push(function (next) { simAnimBorrow(from, next); });
      })(lv);
    }
    steps.push(function (next) {
      SIM.c[i] -= 1;
      simReadout();
      simDraw();
      setTimeout(next, 140);
    });
    runSeq(steps, done);
  };
}

function simAdd(i, n) {
  for (var k = 0; k < n; k++) simPush(opAdd(i));
}
function simSub(i, n) {
  for (var k = 0; k < n; k++) simPush(opSub(i));
}

function simDemo() {
  if (SIMQ.length) return;
  SIM.c = [0, 0, 0];
  SIM.log = [];
  simReadout();
  simDraw();
  simLog('先把 476 摆进桶里：4 个百、7 个十、6 个一');
  SIM.c = [6, 7, 4];
  simReadout();
  simDraw();
  simPush(function (done) {
    simLog('先加个位：358 的 8 个一');
    setTimeout(done, 700);
  });
  simAdd(0, 8);
  simPush(function (done) {
    simLog('再加十位：358 的 5 个十');
    setTimeout(done, 700);
  });
  simAdd(1, 5);
  simPush(function (done) {
    simLog('最后加百位：358 的 3 个百');
    setTimeout(done, 700);
  });
  simAdd(2, 3);
  simPush(function (done) {
    simLog('476 + 358 = ' + simValue() + '，进位发生了 2 次', true);
    setTimeout(done, 600);
  });
}

function simReset() {
  if (SIMQ.length) return;
  SIM.c = [0, 0, 0];
  SIM.log = [];
  SIM.flash = [0, 0, 0];
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simReadout();
  simDraw();
}

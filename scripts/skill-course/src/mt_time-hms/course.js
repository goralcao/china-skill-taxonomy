// ===== p3 钟面刻度 =====
function buildClockTicks() {
  var g = document.getElementById('ticks');
  if (!g || g.childNodes.length) return;
  var cx = 150, cy = 150, R = 132;
  for (var i = 0; i < 60; i++) {
    var a = i / 60 * Math.PI * 2 - Math.PI / 2;
    var big = (i % 5 === 0);
    var r1 = big ? R - 20 : R - 11;
    var ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    ln.setAttribute('x1', cx + Math.cos(a) * r1);
    ln.setAttribute('y1', cy + Math.sin(a) * r1);
    ln.setAttribute('x2', cx + Math.cos(a) * (R - 6));
    ln.setAttribute('y2', cy + Math.sin(a) * (R - 6));
    ln.setAttribute('stroke', big ? '#1A3A5C' : '#9FB4C8');
    ln.setAttribute('stroke-width', big ? '3' : '1.4');
    g.appendChild(ln);
  }
  var nums = document.getElementById('nums');
  if (nums) {
    for (var n = 1; n <= 12; n++) {
      var an = n / 12 * Math.PI * 2 - Math.PI / 2;
      var tx = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      tx.setAttribute('x', cx + Math.cos(an) * (R - 44));
      tx.setAttribute('y', cy + Math.sin(an) * (R - 44));
      tx.textContent = String(n);
      nums.appendChild(tx);
    }
  }
}

// ===== 仿真：三针联动钟面 =====
var CLOCK = { total: 7 * 3600, dragging: null };
var CLOCK_CX = 320, CLOCK_CY = 220, CLOCK_R = 170;

function clockAngleOf(unit) {
  var t = CLOCK.total;
  if (unit === 'sec') return (t % 60) / 60 * Math.PI * 2;
  if (unit === 'min') return (Math.floor(t / 60) % 60) / 60 * Math.PI * 2;
  return (Math.floor(t / 3600) % 12) / 12 * Math.PI * 2;
}

function drawHand(ctx, ang, len, width, color) {
  var a = ang - Math.PI / 2;
  ctx.beginPath();
  ctx.moveTo(CLOCK_CX, CLOCK_CY);
  ctx.lineTo(CLOCK_CX + Math.cos(a) * len, CLOCK_CY + Math.sin(a) * len);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.stroke();
}

function drawClock() {
  var c = document.getElementById('clockCanvas');
  if (!c) return;
  var ctx = c.getContext('2d');
  var W = c.width, H = c.height;
  ctx.clearRect(0, 0, W, H);

  ctx.beginPath();
  ctx.arc(CLOCK_CX, CLOCK_CY, CLOCK_R, 0, Math.PI * 2);
  ctx.fillStyle = '#FBFDFF';
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#1A3A5C';
  ctx.stroke();

  for (var i = 0; i < 60; i++) {
    var a = i / 60 * Math.PI * 2 - Math.PI / 2;
    var big = (i % 5 === 0);
    var r1 = big ? CLOCK_R - 20 : CLOCK_R - 10;
    ctx.beginPath();
    ctx.moveTo(CLOCK_CX + Math.cos(a) * r1, CLOCK_CY + Math.sin(a) * r1);
    ctx.lineTo(CLOCK_CX + Math.cos(a) * (CLOCK_R - 4), CLOCK_CY + Math.sin(a) * (CLOCK_R - 4));
    ctx.strokeStyle = big ? '#1A3A5C' : '#9FB4C8';
    ctx.lineWidth = big ? 4 : 2;
    ctx.stroke();
  }

  ctx.fillStyle = '#1A3A5C';
  ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (var n = 1; n <= 12; n++) {
    var a2 = n / 12 * Math.PI * 2 - Math.PI / 2;
    ctx.fillText(String(n), CLOCK_CX + Math.cos(a2) * (CLOCK_R - 50), CLOCK_CY + Math.sin(a2) * (CLOCK_R - 50));
  }

  drawHand(ctx, clockAngleOf('hour'), CLOCK_R * 0.5, 10, '#1A3A5C');
  drawHand(ctx, clockAngleOf('min'), CLOCK_R * 0.72, 7, '#1565C0');
  drawHand(ctx, clockAngleOf('sec'), CLOCK_R * 0.86, 3, '#D93025');

  ctx.beginPath();
  ctx.arc(CLOCK_CX, CLOCK_CY, 9, 0, Math.PI * 2);
  ctx.fillStyle = '#1A3A5C';
  ctx.fill();

  updateClockText();
}

function pad2(n) { return n < 10 ? '0' + n : String(n); }

function updateClockText() {
  var t = CLOCK.total;
  var h = Math.floor(t / 3600) % 24;
  var m = Math.floor(t / 60) % 60;
  var s = Math.floor(t) % 60;
  var readout = document.getElementById('clockReadout');
  if (readout) readout.textContent = pad2(h) + ':' + pad2(m) + ':' + pad2(s);
  var tip = document.getElementById('clockTip');
  if (tip) {
    if (m === 0 && s === 0) {
      tip.textContent = '分针和秒针都指着 12 —— 整点，两根针叠在一起了';
    } else if (s === 0) {
      tip.textContent = '秒针跑满 1 圈（60 秒），分针才走 ' + m + ' 小格';
    } else {
      tip.textContent = '秒针在第 ' + s + ' 小格，分针在第 ' + m + ' 小格';
    }
  }
}

function clockStep(unit, n) {
  if (unit === 'hour') CLOCK.total += 3600 * n;
  else CLOCK.total += 60 * n;
  CLOCK.total = ((CLOCK.total % 86400) + 86400) % 86400;
  drawClock();
}

function clockReset() {
  CLOCK.total = 7 * 3600;
  drawClock();
}

function clockPointerPos(e) {
  var c = document.getElementById('clockCanvas');
  var r = c.getBoundingClientRect();
  var x = (e.clientX - r.left) * (c.width / r.width);
  var y = (e.clientY - r.top) * (c.height / r.height);
  var dx = x - CLOCK_CX, dy = y - CLOCK_CY;
  var ang = Math.atan2(dy, dx) + Math.PI / 2;
  if (ang < 0) ang += Math.PI * 2;
  return { ang: ang, dist: Math.sqrt(dx * dx + dy * dy) };
}

function clockPickHand(pos) {
  if (pos.dist < 18 || pos.dist > CLOCK_R + 20) return null;
  var best = null, bestDiff = 0.35;
  ['sec', 'min', 'hour'].forEach(function(u) {
    var d = Math.abs(pos.ang - clockAngleOf(u));
    if (d > Math.PI) d = Math.PI * 2 - d;
    if (d < bestDiff) { bestDiff = d; best = u; }
  });
  return best;
}

function clockApplyAngle(unit, ang) {
  var frac = ang / (Math.PI * 2);
  var t = CLOCK.total;
  if (unit === 'sec') {
    var s = Math.round(frac * 60) % 60;
    CLOCK.total = Math.floor(t / 60) * 60 + s;
  } else if (unit === 'min') {
    var m = Math.round(frac * 60) % 60;
    CLOCK.total = Math.floor(t / 3600) * 3600 + m * 60 + (t % 60);
  } else {
    var h = Math.round(frac * 12) % 12;
    CLOCK.total = Math.floor(t / 43200) * 43200 + h * 3600 + (t % 3600);
  }
  drawClock();
}

(function bindClockDrag(){
  var c = document.getElementById('clockCanvas');
  if (!c) return;
  c.style.touchAction = 'none';
  c.addEventListener('pointerdown', function(e) {
    var pos = clockPointerPos(e);
    var unit = clockPickHand(pos);
    if (!unit) return;
    CLOCK.dragging = unit;
    c.setPointerCapture && c.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  c.addEventListener('pointermove', function(e) {
    if (!CLOCK.dragging) return;
    var pos = clockPointerPos(e);
    clockApplyAngle(CLOCK.dragging, pos.ang);
    e.preventDefault();
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function(ev) {
    c.addEventListener(ev, function() { CLOCK.dragging = null; });
  });
})();

// ===== 1 分钟圆环 =====
var minuteTimer = null;
function startMinuteRing() {
  var btn = document.getElementById('p5timerBtn');
  var out = document.getElementById('p5ring');
  if (!btn || !out || minuteTimer) return;
  var left = 60;
  btn.disabled = true;
  out.textContent = '60 秒';
  minuteTimer = setInterval(function() {
    left--;
    out.textContent = left + ' 秒' + (left === 0 ? ' —— 整整 1 分钟，就是 60 秒' : '');
    if (left <= 0) {
      clearInterval(minuteTimer);
      minuteTimer = null;
      btn.disabled = false;
      btn.textContent = '再走一次';
    }
  }, 1000);
}


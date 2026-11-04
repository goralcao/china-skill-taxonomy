// ===== 仿真：时间轴排程 =====
var SIM_W = 880, SIM_H = 348;
var SIM = { caseIdx: 0, planIdx: 0, log: [] };

var SIM_CASES = [
  {
    name: '沏茶', unit: '分钟', max: 14,
    plans: [
      {
        name: '一件一件做', total: 14,
        note: '六件事首尾相接，中间没有一段是空的',
        lanes: [
          { label: '人', items: [
            { n: '洗壶', s: 0, e: 1, c: 'warm' },
            { n: '接水', s: 1, e: 2, c: 'warm' },
            { n: '烧水 8 分钟', s: 2, e: 10, c: 'hot' },
            { n: '洗茶杯', s: 10, e: 12, c: 'warm' },
            { n: '找茶叶', s: 12, e: 13, c: 'warm' },
            { n: '沏茶', s: 13, e: 14, c: 'warm' }
          ] }
        ]
      },
      {
        name: '同时做', total: 11,
        note: '烧水的 8 分钟里，人把洗杯、找茶顺手做掉',
        lanes: [
          { label: '人', items: [
            { n: '洗壶', s: 0, e: 1, c: 'warm' },
            { n: '接水', s: 1, e: 2, c: 'warm' },
            { n: '洗茶杯', s: 2, e: 4, c: 'cool' },
            { n: '找茶叶', s: 4, e: 5, c: 'cool' },
            { n: '沏茶', s: 10, e: 11, c: 'warm' }
          ] },
          { label: '水壶', items: [
            { n: '烧水 8 分钟', s: 2, e: 10, c: 'hot' }
          ] }
        ]
      }
    ]
  },
  {
    name: '烙饼', unit: '分钟', max: 12,
    plans: [
      {
        name: '两张两张烙', total: 12,
        note: '后两次锅里只放一张，空着一半',
        lanes: [
          { label: '锅', items: [
            { n: '饼①②正', s: 0, e: 3, c: 'warm' },
            { n: '饼①②反', s: 3, e: 6, c: 'warm' },
            { n: '饼③正', s: 6, e: 9, c: 'idle' },
            { n: '饼③反', s: 9, e: 12, c: 'idle' }
          ] }
        ]
      },
      {
        name: '交替着烙', total: 9,
        note: '每次锅里都放满 2 个面，3 次就烙完',
        lanes: [
          { label: '锅', items: [
            { n: '饼①②正', s: 0, e: 3, c: 'cool' },
            { n: '饼①反 饼③正', s: 3, e: 6, c: 'cool' },
            { n: '饼②反 饼③反', s: 6, e: 9, c: 'cool' }
          ] }
        ]
      }
    ]
  }
];

var SIM_PLOT_L = 146, SIM_PLOT_R = 838, SIM_TOP = 132;
var SIM_LANE_H = 54, SIM_LANE_GAP = 22;

function simCur() { return SIM_CASES[SIM.caseIdx]; }
function simCurPlan() { return simCur().plans[SIM.planIdx]; }
function simX(t) {
  return SIM_PLOT_L + (t / simCur().max) * (SIM_PLOT_R - SIM_PLOT_L);
}

function simFill(c) {
  if (c === 'hot') return { bg: '#FF8A65', st: '#BF360C', fg: '#FFFFFF' };
  if (c === 'cool') return { bg: '#B3E5FC', st: '#0288D1', fg: '#01579B' };
  if (c === 'idle') return { bg: '#ECEFF1', st: '#B0BEC5', fg: '#607D8B' };
  return { bg: '#FFCCBC', st: '#BF360C', fg: '#4E1B06' };
}

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  var c = simCur(), p = simCurPlan();
  var FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';

  // 标题
  ctx.textAlign = 'left';
  ctx.font = 'bold 19px ' + FONT;
  ctx.fillStyle = '#BF360C';
  ctx.fillText(c.name + '：' + p.name, 46, 42);

  ctx.font = '14px ' + FONT;
  ctx.fillStyle = '#7A5A4C';
  ctx.fillText(p.note, 46, 64);

  // 时间刻度
  var step = c.max <= 12 ? 2 : 2;
  ctx.textAlign = 'center';
  ctx.font = '11px ' + FONT;
  for (var t = 0; t <= c.max; t += step) {
    var x = simX(t);
    ctx.strokeStyle = t === 0 ? '#C9A899' : '#F0DCD4';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, SIM_TOP - 22);
    ctx.lineTo(x, SIM_TOP + p.lanes.length * (SIM_LANE_H + SIM_LANE_GAP));
    ctx.stroke();
    ctx.fillStyle = '#9C7A6C';
    ctx.fillText(String(t), x, SIM_TOP - 28);
  }

  // 泳道
  for (var l = 0; l < p.lanes.length; l++) {
    var lane = p.lanes[l];
    var ly = SIM_TOP + l * (SIM_LANE_H + SIM_LANE_GAP);

    // 泳道背景
    ctx.fillStyle = '#FDF4F0';
    ctx.fillRect(SIM_PLOT_L, ly, SIM_PLOT_R - SIM_PLOT_L, SIM_LANE_H);

    ctx.textAlign = 'right';
    ctx.font = 'bold 13px ' + FONT;
    ctx.fillStyle = '#7A5A4C';
    ctx.fillText(lane.label, SIM_PLOT_L - 12, ly + SIM_LANE_H / 2 + 5);

    for (var i = 0; i < lane.items.length; i++) {
      var it = lane.items[i];
      var x1 = simX(it.s), x2 = simX(it.e);
      var col = simFill(it.c);
      var w = x2 - x1;

      ctx.fillStyle = col.bg;
      ctx.strokeStyle = col.st;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x1 + 2, ly + 3, w - 4, SIM_LANE_H - 6, 5);
      else ctx.rect(x1 + 2, ly + 3, w - 4, SIM_LANE_H - 6);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.font = '12px ' + FONT;
      ctx.fillStyle = col.fg;
      if (w >= 46) {
        ctx.fillText(it.n, (x1 + x2) / 2, ly + SIM_LANE_H / 2 + 4);
      } else {
        ctx.font = '10px ' + FONT;
        ctx.fillText(it.n.slice(0, 2), (x1 + x2) / 2, ly + SIM_LANE_H / 2 + 4);
      }
    }
  }

  // 并行高亮：水壶泳道那段
  if (p.lanes.length > 1) {
    var up = p.lanes[1].items[0];
    ctx.strokeStyle = '#0288D1';
    ctx.lineWidth = 1.6;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(simX(up.s) + 2, SIM_TOP - 6, simX(up.e) - simX(up.s) - 4,
      p.lanes.length * (SIM_LANE_H + SIM_LANE_GAP) - SIM_LANE_GAP + 8);
    ctx.setLineDash([]);
  }

  // 总时长
  var ty = SIM_TOP + p.lanes.length * (SIM_LANE_H + SIM_LANE_GAP) + 34;
  ctx.textAlign = 'left';
  ctx.font = 'bold 15px ' + FONT;
  ctx.fillStyle = '#BF360C';
  ctx.fillText('总时长', 46, ty);

  ctx.font = 'bold 30px ' + FONT;
  ctx.fillStyle = '#BF360C';
  ctx.fillText(p.total + ' 分钟', 116, ty + 2);

  // 结束标记
  var ex = simX(p.total);
  ctx.strokeStyle = '#BF360C';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.moveTo(ex, SIM_TOP - 16);
  ctx.lineTo(ex, ty - 22);
  ctx.stroke();
  ctx.setLineDash([]);



  // 状态
  var rd = document.getElementById('simReadout');
  if (rd) rd.textContent = c.name + ' · ' + p.name + ' · ' + p.total + ' 分钟';
  var tp = document.getElementById('simTip');
  if (tp) tp.textContent = p.note;
}

function simLog(msg, hl) {
  var box = document.getElementById('simLog');
  if (!box) return;
  var d = document.createElement('div');
  if (hl) d.className = 'hl';
  d.textContent = msg;
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
}

function simPlan(k) {
  k = (k === undefined || isNaN(k)) ? 1 : k;
  var c = simCur();
  SIM.planIdx = (SIM.planIdx + k + c.plans.length) % c.plans.length;
  var p = simCurPlan();
  simLog(c.name + ' · ' + p.name + '：总时长 ' + p.total + ' 分钟', p.total <= c.plans[0].total && SIM.planIdx !== 0);
  simDraw();
}

function simCase(dir) {
  dir = (dir === undefined || isNaN(dir)) ? 1 : dir;
  SIM.caseIdx = (SIM.caseIdx + dir + SIM_CASES.length) % SIM_CASES.length;
  SIM.planIdx = 0;
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('换案例：' + simCur().name, true);
  simDraw();
}

function simReset() {
  SIM.caseIdx = 0;
  SIM.planIdx = 0;
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('已重置：沏茶 · 一件一件做 · 14 分钟');
  simDraw();
}

function simDemo() {
  SIM.caseIdx = 0;
  SIM.planIdx = 0;
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simDraw();
  var k = 0;
  var timer = setInterval(function () {
    k++;
    if (k > 3) { clearInterval(timer); return; }
    simPlan(1);
    if (k === 2) simCase(1);
  }, 1400);
}

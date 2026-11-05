// ===== 六年级仿真通用绘图库（每课 course.js 前缀） =====
var SIM_W = 880, SIM_H = 360;
var SIM_FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';

function simCtx() { return document.getElementById('simCanvas').getContext('2d'); }

function simTxt(t, x, y, size, color, weight, align) {
  var ctx = simCtx();
  ctx.save();
  ctx.font = (weight ? weight + ' ' : '') + size + 'px ' + SIM_FONT;
  ctx.fillStyle = color;
  ctx.textAlign = align || 'left';
  ctx.fillText(t, x, y);
  ctx.restore();
}

function simLine(x1, y1, x2, y2, color, w, dash) {
  var ctx = simCtx();
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = w || 1.6; ctx.lineCap = 'round';
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.restore();
}

function simBox(x, y, w, h, fill, stroke, r) {
  var ctx = simCtx();
  r = (r === undefined) ? 8 : r;
  if (r > Math.min(w, h) / 2) r = Math.min(w, h) / 2;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.6; ctx.stroke(); }
  ctx.restore();
}

function simDot(x, y, r, fill, stroke) {
  var ctx = simCtx();
  ctx.save();
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.4; ctx.stroke(); }
  ctx.restore();
}

function simArc(cx, cy, r, a0, a1, fill, stroke, w) {
  var ctx = simCtx();
  ctx.save();
  ctx.beginPath(); ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, r, a0, a1); ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = w || 1.6; ctx.stroke(); }
  ctx.restore();
}

function simRing(cx, cy, r, color, w, dash) {
  var ctx = simCtx();
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = color; ctx.lineWidth = w || 1.6;
  if (dash) ctx.setLineDash(dash);
  ctx.stroke(); ctx.restore();
}

function simLog(msg) {
  var box = document.getElementById('simLog');
  if (!box) return;
  var d = document.createElement('div');
  d.className = 'sim-log-line'; d.innerHTML = msg;
  box.appendChild(d);
  if (box.children.length > 3) box.removeChild(box.firstChild);
  box.scrollTop = box.scrollHeight;
}

function simFrac(n, d) { return n + '/' + d; }
function simGcd(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }
function simReduce(n, d) { var g = simGcd(n, d); return [n / g, d / g]; }

// ===== 阅读课样板 mt_read-mark「圈画与批注」：仿真与「留痕迹」互动 =====
// 设计依据：chinese-reading-writing.md 阅读五段（起疑→取证→对齐→说清→换文）
// 红线：只判「有没有痕迹、依据在哪」，不判「好不好」；关键词命中 ≠ 理解；
//       开放表达永不给否定结论；连线与依据分别记录，防止一一对应排除法。
// 仿真页是「依据链工作台」：点左边原文句 → 点右边想法 → 连成一环，不给分数。

var CN_CASES = [
  {
    name: '窗台上的麻雀',
    lines: [
      { p: 1, t: '它歪着头，一动不动，像在听屋里的动静。' },
      { p: 1, t: '我把作业本翻到新的一页，没敢合上，怕纸响惊了它。' },
      { p: 3, t: '玻璃里映着它自己，它跟那个影子对望了整整一个早上。' }
    ],
    ideas: [
      '它很小心，一直没飞走',
      '我不想惊动它',
      '我原先猜它饿了，后来发现猜错了'
    ]
  },
  {
    name: '雨里的一把伞',
    lines: [
      { p: 1, t: '我把伞往同桌那边挪了挪，自己半边肩膀湿了一路。' },
      { p: 1, t: '他一路都在讲笑话，没发现伞偏了。' },
      { p: 2, t: '到家我才发现，书包里那本作业本倒是干的。' }
    ],
    ideas: [
      '我特意把伞让给了他',
      '他一点也没察觉',
      '我原先以为书包会湿，结果猜错了'
    ]
  }
];

var SIM = { ci: 0, links: [], selL: null, hits: [], bound: false };

function simCase() { return CN_CASES[SIM.ci]; }
function simLinked(l, i) {
  return SIM.links.some(function (x) { return x.l === l && x.i === i; });
}
function simSetReadout() {
  var el = document.getElementById('simReadout');
  if (el) el.textContent = '依据链已连 ' + SIM.links.length + ' / 3 环（不判对错）';
}
function simWrap(t, n) {
  return t.length <= n ? [t] : [t.slice(0, n), t.slice(n)];
}

function simDraw() {
  var ctx = simCtx();
  ctx.fillStyle = '#FBF8F0';
  ctx.fillRect(0, 0, SIM_W, SIM_H);
  var c = simCase();
  SIM.hits = [];

  simTxt('把想法接回原文：' + c.name, 28, 30, 18, '#2E5C4A', '700');
  simTxt('文中写的', 28, 52, 13, '#7A7263', '700');
  simTxt('我想的', 590, 52, 13, '#7A7263', '700');

  var ys = [66, 146, 226];
  // 左：原文句块（可点）
  for (var l = 0; l < 3; l++) {
    var on = SIM.selL === l;
    simBox(24, ys[l], 400, 62, on ? '#FFF2C9' : '#FFFFFF', on ? '#E0A93B' : '#DDD3BE', 10);
    var ls = simWrap(c.lines[l].t, 20);
    for (var k = 0; k < ls.length; k++) simTxt(ls[k], 38, ys[l] + 25 + k * 22, 15, '#2B2B28', '600');
    simTxt('第 ' + c.lines[l].p + ' 段', 380, ys[l] + 55, 11, '#7A7263', '400', 'right');
    SIM.hits.push({ x: 24, y: ys[l], w: 400, h: 62, kind: 'l', idx: l });
  }
  // 右：想法块（可点）
  for (var i = 0; i < 3; i++) {
    var used = SIM.links.some(function (x) { return x.i === i; });
    simBox(480, ys[i], 376, 62, used ? '#FBE9DD' : '#FFFFFF', used ? '#C0622F' : '#DDD3BE', 10);
    var is = simWrap(c.ideas[i], 19);
    for (var m = 0; m < is.length; m++) simTxt(is[m], 496, ys[i] + 25 + m * 22, 15, '#2B2B28', '600');
    SIM.hits.push({ x: 480, y: ys[i], w: 376, h: 62, kind: 'i', idx: i });
  }
  // 中：连线（已连实线橙，未连淡虚线）
  for (var a = 0; a < 3; a++) {
    for (var b = 0; b < 3; b++) {
      var linked = simLinked(a, b);
      if (!linked && !(a === b)) continue;
      simLine(424, ys[a] + 31, 480, ys[b] + 31,
              linked ? '#C0622F' : '#E6DECB', linked ? 2.6 : 1, linked ? null : [4, 4]);
      if (linked) simDot(452, (ys[a] + ys[b]) / 2 + 31, 4, '#C0622F', null);
    }
  }

  simBox(24, 306, 832, 40, '#EDF3EE', null, 8);
  simTxt('依据链已连 ' + SIM.links.length + ' / 3 环', 40, 331, 16, '#2E5C4A', '700');
  simTxt('点左边一句原文，再点右边一个想法 —— 不打分，只看想法能不能指回第几句',
          250, 331, 13, '#4A463E', '400');
  simSetReadout();
}

function simLink(l, i) {
  var c = simCase();
  if (l < 0 || l > 2 || i < 0 || i > 2) return;
  if (simLinked(l, i)) { simLog('这一环已经连过了，换一句试试'); return; }
  SIM.links.push({ l: l, i: i });
  SIM.selL = null;
  simLog('第 ' + c.lines[l].p + ' 段那句 → 撑住了「<span class="hl">' + c.ideas[i] + '</span>」');
  simDraw();
}

function simPick(kind, idx) {
  if (kind === 'l') {
    SIM.selL = idx;
    simLog('选中第 ' + simCase().lines[idx].p + ' 段那句，再点右边一个想法');
    simDraw();
    return;
  }
  if (SIM.selL === null) { simLog('先点左边一句原文，再点右边的想法'); simDraw(); return; }
  simLink(SIM.selL, idx);
}

function simNextCase() {
  SIM.ci = (SIM.ci + 1) % CN_CASES.length;
  SIM.links = []; SIM.selL = null;
  simLog('换一篇：<span class="hl">' + simCase().name + '</span>，只用划和连，重新找依据');
  simDraw();
}
function simReset() {
  SIM.links = []; SIM.selL = null;
  simLog('重来：原文和想法都还在，把连过的线先收回去');
  simDraw();
}
function simDemo() {
  SIM.links = [{ l: 0, i: 0 }, { l: 1, i: 1 }, { l: 2, i: 2 }];
  SIM.selL = null;
  simLog('看老师连一条：<span class="hl">先自己试一次，再看不迟</span>。第三环是「我猜错了」，它也算一条真痕迹。');
  simDraw();
}
function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.__simBound) return;
  cv.__simBound = true;
  cv.addEventListener('click', function (e) {
    var r = cv.getBoundingClientRect();
    var x = (e.clientX - r.left) * (SIM_W / r.width);
    var y = (e.clientY - r.top) * (SIM_H / r.height);
    for (var j = 0; j < SIM.hits.length; j++) {
      var h = SIM.hits[j];
      if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) { simPick(h.kind, h.idx); return; }
    }
  });
}

// ===================== 五段里的「留痕迹」互动（都不判分） =====================

// 1 起疑 p2：点句子标灰「我在这儿停了一下」
function bindDoubt() {
  var box = document.getElementById('rdText');
  if (!box || box.__bound) return;
  box.__bound = true;
  box.addEventListener('click', function (e) {
    var el = e.target.closest('.rd-s');
    if (!el) return;
    el.classList.toggle('stopped');
    var n = box.querySelectorAll('.rd-s.stopped').length;
    var out = document.getElementById('rdNote');
    if (out) out.innerHTML = '停了 <b>' + n + '</b> 下。灰的是你读过又卡住过的整句——'
      + '<b>点哪句都行，不判对错</b>；落在整句上才算，落在空白处不算。';
  });
}

// 2 取证 p3：先选符号，再点句子划黄；想法框非空即可，都不判对错
function bindEvidence() {
  var root = document.getElementById('evBox');
  if (!root || root.__bound) return;
  root.__bound = true;
  var sym = '';
  function refresh() {
    var marked = root.querySelectorAll('.ev-s.marked').length;
    var idea = document.getElementById('evIdea');
    var has = idea && idea.value.trim().length > 0;
    var out = document.getElementById('evNote');
    if (out) out.innerHTML = '已取证 <b>' + marked + '</b> 处 · 想法' + (has ? '已写下' : '还没写')
      + '（<b>只记痕迹，不判对错</b>，写不完整也能往下走）';
    if (idea) { try { localStorage.setItem('cn_read_mark_idea', idea.value.trim()); } catch (e) { } }
  }
  root.addEventListener('click', function (e) {
    var b = e.target.closest('.ev-sym');
    if (b) {
      root.querySelectorAll('.ev-sym').forEach(function (n) { n.classList.remove('on'); });
      b.classList.add('on'); sym = b.getAttribute('data-s');
      var w = document.getElementById('evWhy');
      if (w) w.innerHTML = '选了「' + sym + '」。现在点一句原文，把它划下来。';
      return;
    }
    var s = e.target.closest('.ev-s');
    if (s) {
      s.classList.toggle('marked');
      if (s.classList.contains('marked')) {
        var badge = s.querySelector('.ev-badge');
        if (badge) badge.textContent = sym || '～';
      }
      var w2 = document.getElementById('evWhy');
      if (w2) w2.innerHTML = '这一句在<b>第 ' + s.getAttribute('data-p') + ' 段</b>。'
        + '依据要能指回第几句；<b>划中不等于读懂</b>，还得说得出「我是从哪句知道的」。';
      refresh();
      return;
    }
  });
  var idea = document.getElementById('evIdea');
  if (idea) idea.addEventListener('input', refresh);
}

// 3 对齐 p5：4 句卡 → 2 观点槽 + 都不支撑筐；连线后强制补「第几句」，分别记录
function bindAlign() {
  var root = document.getElementById('alBox');
  if (!root || root.__bound) return;
  root.__bound = true;
  var sel = null;
  function refresh() {
    var placed = root.querySelectorAll('.ev-card[data-slot]').length;
    var why = root.querySelectorAll('.ev-card[data-para]').length;
    var out = document.getElementById('alNote');
    if (out) out.innerHTML = '已归位 <b>' + placed + ' / 4</b> · 依据补了 <b>' + why + ' / 4</b>'
      + '（<b>连线和依据分别记，不判对错</b>）';
  }
  root.addEventListener('click', function (e) {
    var para = e.target.closest('.ev-para');
    // 依据按钮优先：卡片归位后会被移进槽里，此时它同时命中 .ev-slot
    if (para) {
      var c2 = para.closest('.ev-card');
      if (c2) {
        c2.setAttribute('data-para', para.getAttribute('data-p'));
        c2.querySelectorAll('.ev-para').forEach(function (n) { n.classList.remove('on'); });
        para.classList.add('on');
        var w3 = document.getElementById('alWhy');
        if (w3) w3.innerHTML = '依据记在第 <b>' + para.getAttribute('data-p') + ' 段</b>。'
          + '要是想法和原文对不上，只提示「再读第 ' + para.getAttribute('data-p') + ' 段」，不给分数、不说对错。';
        refresh();
      }
      return;
    }
    var card = e.target.closest('.ev-card');
    var slot = e.target.closest('.ev-slot');
    if (card) {
      root.querySelectorAll('.ev-card').forEach(function (n) { n.classList.remove('on'); });
      card.classList.add('on'); sel = card;
      var w = document.getElementById('alWhy');
      if (w) w.innerHTML = '选中第 ' + card.getAttribute('data-n') + ' 张卡。点右边一个槽把它放进去；'
        + '放完还要补一句「我是根据第几句连的」。';
      return;
    }
    if (slot && sel) {
      sel.setAttribute('data-slot', slot.getAttribute('data-slot'));
      slot.appendChild(sel);
      sel.classList.remove('on');
      sel = null;
      var w2 = document.getElementById('alWhy');
      if (w2) w2.innerHTML = '放好了。<b>现在点这张卡下面的「第几段」</b>，把依据补上——'
        + '连线归连线，依据归依据，两样都留痕才算数。';
      refresh();
      return;
    }
  });
  refresh();
}

// 5 换文 p8：新短文只用「划」和「连」+ 三条自查，只回执不判分
function bindTransfer() {
  var root = document.getElementById('trBox');
  if (!root || root.__bound) return;
  root.__bound = true;
  root.addEventListener('click', function (e) {
    var s = e.target.closest('.tr-s');
    if (s) {
      s.classList.toggle('marked');
      var n = root.querySelectorAll('.tr-s.marked').length;
      var out = document.getElementById('trNote');
      if (out) out.innerHTML = '自发划了 <b>' + n + '</b> 处（<b>不判对错</b>）。'
        + '换了一篇没提示的短文，工具条只剩「划」和「连」——看还能不能自己找到依据。';
      return;
    }
    var ck = e.target.closest('.tr-ck');
    if (ck) {
      ck.classList.toggle('on');
      var k = root.querySelectorAll('.tr-ck.on').length;
      var a = document.getElementById('trAdvice');
      if (a) a.innerHTML = '自查勾了 <b>' + k + ' / 3</b> 条。'
        + '三条都只问「能不能指回原文」，不问「读懂了没有」——<b>勾不满也照样能翻页</b>。';
      return;
    }
  });
}

// 存起来 p10：结算必须显示学生自己留下的依据链
function updateMyChain() {
  var el = document.getElementById('myChain');
  if (!el) return;
  var idea = '';
  try { idea = localStorage.getItem('cn_read_mark_idea') || ''; } catch (e) { }
  el.innerHTML = idea
    ? '<b>你留下的依据链</b>　我的想法：' + idea.replace(/</g, '&lt;')
      + '　→　回到原文，指出是从第几句知道的 → 用「因为……所以我认为……」说清。'
    : '<b>你留下的依据链</b>　（还没存想法。回到「取证」那一页写一句，它就会出现在这里。）';
}

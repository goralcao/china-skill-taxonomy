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

var CN = {"leftTitle": "文本里的线索", "rightTitle": "我猜 / 后来", "linkNoun": "环", "readout": "预测链已连 %N% / %T% 环（不判对错）", "canvasTitle": "把猜接回线索：%N%", "footCount": "依据链已连 %N% / %T% %U%", "footNote": "点左边一条线索，再点右边一个「我猜／后来」——不打分，只看猜能不能指回原文", "legend": "连线记「连没连」，依据另记「第几句」，两样分开留痕", "logLink": "第 %P% 段那条线索 → 接住了「%T%」", "logPickLeft": "选中第 %P% 段那条线索，再点右边一个「我猜／后来」", "logNeedLeft": "先点左边一条线索，再点右边的猜想", "logDup": "这一环已经连过了，换一句试试", "logNext": "换一篇：%N%，只用划线索和连成链，重新猜一次", "logReset": "重来：线索和猜想都还在，把连过的线先收回去", "logDemo": "看老师连一条：先自己猜一次，再看不迟。第三条「猜错了」也是一条真痕迹。", "badgeFmt": "第 %P% 段", "demoLinks": [[0, 0], [1, 1], [2, 2]], "doubtNote": "停了 <b>%N%</b> 下。灰的是你读过又卡住过的整句——<b>点哪句都行，不判对错</b>；落在整句上才算，落在空白处不算。", "doubtUnit": "下", "evWhySym": "选了「%S%」这种线索来源。现在点一句原文，把它划下来。", "evWhyLine": "这条线索在<b>第 %P% 段</b>。猜要能指回原文；<b>猜中不等于读懂</b>，还得说得出「我是从哪句猜的」。", "evNote": "已找线索 <b>%N%</b> 处 · %H%（<b>只记痕迹，不判对错</b>，写不完整也能往下走）", "evHas": "我猜已写下", "evNone": "我猜还没写", "alWhyCard": "选中第 %N% 张卡。点右边一栏把它放进去；放完还要补一句「我是根据第几句连的」。", "alWhySlot": "放好了。<b>现在点这张卡下面的「第几段」</b>，把依据补上——归栏归栏，依据归依据，两样都留痕才算数。", "alWhyPara": "依据记在第 <b>%P% 段</b>。要是猜和原文对不上，只提示「再读第 %P% 段」，不给分数、不说对错。", "alNote": "已归位 <b>%N% / %T%</b> · 依据补了 <b>%W% / %T%</b>（<b>连线和依据分别记，不判对错</b>）", "trNote": "自发划了 <b>%N%</b> 处（<b>不判对错</b>）。换了一篇没提示的短文，只剩「划线索」和「连成链」——看还能不能自己猜、自己对照。", "trAdvice": "自查勾了 <b>%N% / %T%</b> 条。三条都只问「猜能不能指回原文」，不问「猜对了没有」——<b>勾不满也照样能翻页</b>。", "myLabel": "你留下的预测链", "myEmpty": "（还没存。回到「取证」那一页写一句「我猜……因为……」，它就会出现在这里。）", "myTail": "　→　回到原文，指出是从第几句猜的 → 用「我猜……因为……后来……」说清。", "defaultSym": "上", "replay": false, "replayNote": "回放了 <b>%N%</b> 遍（<b>只回放，不评分</b>）。听不出好坏没关系，机器不下结论。", "cases": [{"name": "总也倒不了的老屋", "left": [{"p": 1, "t": "老屋说：「我到了倒下的时候了。」"}, {"p": 2, "t": "小猫请求再站一晚，老屋说「好吧，我就再站一个晚上」。"}, {"p": 3, "t": "后来又来了老母鸡、小蜘蛛，老屋一次次答应了。"}], "right": ["我猜后面还会有人来求老屋", "我猜老屋每次都会答应", "我原先猜它今晚就倒，后来发现猜错了"]}, {"name": "雨里的一把伞（换文）", "left": [{"p": 1, "t": "放学时雨下得很急，我把伞往同桌那边挪了挪。"}, {"p": 1, "t": "他一路都在讲笑话，没发现伞偏了。"}, {"p": 2, "t": "到家我才发现，书包里那本作业本倒是干的。"}], "right": ["我猜他到家才会发现", "我猜作业本能保住", "我原先以为书包会湿，后来发现猜错了"]}], "colors": {"primary": "#2E5C7A", "accent": "#C0782F", "primarySoft": "#E8F0F7", "accentSoft": "#FBEAD9", "line": "#DDD3BE", "paper": "#FBF8F0", "ink": "#2B2B28", "muted": "#7A7263"}, "lsKey": "cn_mt_read_predict_idea", "ringTotal": 3};
// ===== 阅读课「五段」通用仿真与留痕迹互动 =====
// 每课数据由 run_r.py 注入为全局 CN。设计约定（chinese-reading-writing.md）：
// 只判「有没有痕迹、依据在哪」，不判「好不好」；关键词命中 ≠ 理解；
// 开放表达永不给否定结论；连线与依据分别记录，防止一一对应排除法。
// 仿真页是「依据链工作台」：点左边原文句 → 点右边想法 → 连成一环，不给分数。
// 结构测试契约：simAdd / simDemo / simNextCase / simReset / simBind / SIM.hits / 画布着色。

var SIM = { ci: 0, links: [], selL: null, hits: [], bound: false,
            replayCount: 0, replayStep: 0, replayLine: 0 };

function simCase() { return CN.cases[SIM.ci]; }
function simRingTotal() { return CN.ringTotal || simCase().right.length; }
function simFmt(s, kv) {
  var out = String(s);
  for (var k in kv) if (Object.prototype.hasOwnProperty.call(kv, k))
    out = out.split('%' + k + '%').join(kv[k]);
  return out;
}
function simLinked(l, i) {
  return SIM.links.some(function (x) { return x.l === l && x.i === i; });
}
function simPlain(s) { return String(s).replace(/<[^>]+>/g, ''); }
function simSetReadout() {
  var el = document.getElementById('simReadout');
  if (!el) return;
  var n = simRingTotal();
  var txt = simFmt(CN.readout, { N: SIM.links.length, T: n });
  if (CN.replay) txt = simFmt(simPlain(CN.replayNote), { N: SIM.replayCount }) + ' · ' + txt;
  el.textContent = txt;
}
function simWrap(t, n) {
  return t.length <= n ? [t] : [t.slice(0, n), t.slice(n)];
}

function simDraw() {
  var ctx = simCtx(), C = CN.colors;
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, SIM_W, SIM_H);
  var c = simCase(), n = simRingTotal();
  SIM.hits = [];

  simTxt(simFmt(CN.canvasTitle, { N: c.name }), 28, 30, 18, C.primary, '700');
  simTxt(CN.leftTitle, 28, 52, 13, C.muted, '700');
  simTxt(CN.rightTitle, 590, 52, 13, C.muted, '700');

  var ys = [66, 146, 226];
  // 左：原文句块（可点）
  for (var l = 0; l < 3; l++) {
    var on = SIM.selL === l;
    simBox(24, ys[l], 400, 62, on ? '#FFF2C9' : '#FFFFFF', on ? '#E0A93B' : C.line, 10);
    var ls = simWrap(c.left[l].t, 20);
    for (var k = 0; k < ls.length; k++) simTxt(ls[k], 38, ys[l] + 25 + k * 22, 15, C.ink, '600');
    simTxt(simFmt(CN.badgeFmt, { P: c.left[l].p }), 412, ys[l] + 55, 11, C.muted, '400', 'right');
    SIM.hits.push({ x: 24, y: ys[l], w: 400, h: 62, kind: 'l', idx: l });
  }
  // 右：想法块（可点）
  for (var i = 0; i < 3; i++) {
    var used = SIM.links.some(function (x) { return x.i === i; });
    simBox(480, ys[i], 376, 62, used ? C.accentSoft : '#FFFFFF', used ? C.accent : C.line, 10);
    var is = simWrap(c.right[i], 19);
    for (var m = 0; m < is.length; m++) simTxt(is[m], 496, ys[i] + 25 + m * 22, 15, C.ink, '600');
    SIM.hits.push({ x: 480, y: ys[i], w: 376, h: 62, kind: 'i', idx: i });
  }
  // 中：连线（已连实线朱砂，未连淡虚线）
  for (var a = 0; a < 3; a++) {
    for (var b = 0; b < 3; b++) {
      var linked = simLinked(a, b);
      if (!linked && !(a === b)) continue;
      simLine(424, ys[a] + 31, 480, ys[b] + 31,
              linked ? C.accent : '#E6DECB', linked ? 2.6 : 1, linked ? null : [4, 4]);
      if (linked) simDot(452, (ys[a] + ys[b]) / 2 + 31, 4, C.accent, null);
    }
  }

  simBox(24, 306, 832, 40, C.primarySoft, null, 8);
  if (CN.replay) {
    // 朗读课：只回放节拍，不评分。按标点把句子切成「拍」，拍与拍之间留一道停顿刻度。
    var li = SIM.replayLine, line = c.left[li] || c.left[0];
    var chars = line.t.split(''), bx = 40, seg = 0;
    ctx.save(); ctx.font = '17px ' + SIM_FONT;
    for (var q = 0; q < chars.length && bx < 545; q++) {
      var ch = chars[q], isP = /[，。？！、；：]/.test(ch);
      var bw2 = isP ? 20 : 28;
      var bg = (seg % 2 === 0) ? C.primarySoft : C.accentSoft;
      var fc = (seg % 2 === 0) ? C.primary : C.accent;
      simBox(bx, 313, bw2 - 4, 26, bg, fc, 4);
      simTxt(ch, bx + (bw2 - 4) / 2, 332, 17, fc, isP ? '700' : '400', 'center');
      bx += bw2;
      if (isP) {                       // 标点＝一拍结束：竖线 + 空隙，就是「停半拍」
        simLine(bx + 2, 313, bx + 2, 339, C.accent, 1.8);
        bx += 12; seg++;
      }
    }
    ctx.restore();
    simTxt('已回放 ' + SIM.replayCount + ' 遍 · 不评分', 596, 331, 15, C.primary, '700');
  } else {
    simTxt(simFmt(CN.footCount, { N: SIM.links.length, T: n, U: CN.linkNoun }),
           40, 331, 16, C.primary, '700');
    simTxt(CN.footNote, 268, 331, 13, C.ink, '400');
  }
  simSetReadout();
}

function simLink(l, i) {
  var c = simCase(), n = simRingTotal();
  if (l < 0 || l > 2 || i < 0 || i > 2) return;
  if (simLinked(l, i)) { simLog(CN.logDup); return; }
  SIM.links.push({ l: l, i: i });
  SIM.selL = null;
  simLog(simFmt(CN.logLink, { P: c.left[l].p, T: '<span class="hl">' + c.right[i] + '</span>' }));
  simDraw();
}
// 结构测试入口：与数学/语言知识课保持同一签名
function simAdd(l, i) { simLink(l, i); }

function simPick(kind, idx) {
  var c = simCase();
  if (kind === 'l') {
    if (CN.replay) {
      SIM.replayCount++; SIM.replayStep = 0; SIM.replayLine = idx;
    }
    SIM.selL = idx;
    simLog(simFmt(CN.logPickLeft, { P: c.left[idx].p }));
    simDraw();
    return;
  }
  if (SIM.selL === null) { simLog(CN.logNeedLeft); simDraw(); return; }
  simLink(SIM.selL, idx);
}

function simNextCase() {
  SIM.ci = (SIM.ci + 1) % CN.cases.length;
  SIM.links = []; SIM.selL = null; SIM.replayStep = 0; SIM.replayLine = 0;
  simLog(simFmt(CN.logNext, { N: simCase().name }));
  simDraw();
}
function simReset() {
  SIM.links = []; SIM.selL = null; SIM.replayCount = 0; SIM.replayStep = 0;
  simLog(CN.logReset);
  simDraw();
}
function simDemo() {
  SIM.links = []; SIM.selL = null;
  var pairs = CN.demoLinks || [[0, 0], [1, 1], [2, 2]];
  for (var k = 0; k < pairs.length; k++) SIM.links.push({ l: pairs[k][0], i: pairs[k][1] });
  if (CN.replay) { SIM.replayCount++; SIM.replayStep = 99; }
  simLog(CN.logDemo);
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
    if (out) out.innerHTML = simFmt(CN.doubtNote, { N: n });
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
    if (out) out.innerHTML = simFmt(CN.evNote, {
      N: marked, H: has ? CN.evHas : CN.evNone
    });
    if (idea) { try { localStorage.setItem(CN.lsKey, idea.value.trim()); } catch (e) { } }
  }
  root.addEventListener('click', function (e) {
    var b = e.target.closest('.ev-sym');
    if (b) {
      root.querySelectorAll('.ev-sym').forEach(function (n) { n.classList.remove('on'); });
      b.classList.add('on'); sym = b.getAttribute('data-s');
      var w = document.getElementById('evWhy');
      if (w) w.innerHTML = simFmt(CN.evWhySym, { S: sym });
      return;
    }
    var s = e.target.closest('.ev-s');
    if (s) {
      s.classList.toggle('marked');
      if (s.classList.contains('marked')) {
        var badge = s.querySelector('.ev-badge');
        if (badge) badge.textContent = sym || CN.defaultSym;
      }
      var w2 = document.getElementById('evWhy');
      if (w2) w2.innerHTML = simFmt(CN.evWhyLine, { P: s.getAttribute('data-p') });
      refresh();
      return;
    }
  });
  var idea = document.getElementById('evIdea');
  if (idea) idea.addEventListener('input', refresh);
}

// 3 对齐 p5：句卡 → 观点槽 + 都不支撑筐；连线后强制补「第几句」，分别记录
function bindAlign() {
  var root = document.getElementById('alBox');
  if (!root || root.__bound) return;
  root.__bound = true;
  var sel = null;
  var total = root.querySelectorAll('.ev-card').length;
  function refresh() {
    var placed = root.querySelectorAll('.ev-card[data-slot]').length;
    var why = root.querySelectorAll('.ev-card[data-para]').length;
    var out = document.getElementById('alNote');
    if (out) out.innerHTML = simFmt(CN.alNote, { N: placed, W: why, T: total });
  }
  root.addEventListener('click', function (e) {
    var para = e.target.closest('.ev-para');
    // 依据按钮优先：卡片归位后会被移进槽里，此时它同时命中 .ev-slot
    if (para) {
      var c2 = para.closest('.ev-card');
      if (c2) {
        var pv = para.getAttribute('data-p');
        c2.setAttribute('data-para', pv);
        c2.querySelectorAll('.ev-para').forEach(function (n) { n.classList.remove('on'); });
        para.classList.add('on');
        var w3 = document.getElementById('alWhy');
        if (w3) w3.innerHTML = simFmt(CN.alWhyPara, { P: pv });
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
      if (w) w.innerHTML = simFmt(CN.alWhyCard, { N: card.getAttribute('data-n') });
      return;
    }
    if (slot && sel) {
      sel.setAttribute('data-slot', slot.getAttribute('data-slot'));
      slot.appendChild(sel);
      sel.classList.remove('on');
      sel = null;
      var w2 = document.getElementById('alWhy');
      if (w2) w2.innerHTML = CN.alWhySlot;
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
  var total = root.querySelectorAll('.tr-ck').length;
  root.addEventListener('click', function (e) {
    var s = e.target.closest('.tr-s');
    if (s) {
      s.classList.toggle('marked');
      var n = root.querySelectorAll('.tr-s.marked').length;
      var out = document.getElementById('trNote');
      if (out) out.innerHTML = simFmt(CN.trNote, { N: n });
      return;
    }
    var ck = e.target.closest('.tr-ck');
    if (ck) {
      ck.classList.toggle('on');
      var k = root.querySelectorAll('.tr-ck.on').length;
      var a = document.getElementById('trAdvice');
      if (a) a.innerHTML = simFmt(CN.trAdvice, { N: k, T: total });
      return;
    }
  });
}

// 存起来 p10：结算必须显示学生自己留下的依据链
function updateMyChain() {
  var el = document.getElementById('myChain');
  if (!el) return;
  var idea = '';
  try { idea = localStorage.getItem(CN.lsKey) || ''; } catch (e) { }
  el.innerHTML = idea
    ? '<b>' + CN.myLabel + '</b>　' + idea.replace(/</g, '&lt;') + CN.myTail
    : '<b>' + CN.myLabel + '</b>　' + CN.myEmpty;
}

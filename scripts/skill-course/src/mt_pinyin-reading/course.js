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

var CN = {"mode": "bridge", "readout": "已摆 %N% / %T% 处（不判对错）", "canvasTitle": "把「%N%」接起来：拼音 → 字音 → 字形 → 一小句", "legend": "深色＝已经摆好的　灰色＝还没选的那一块", "panelTitle": "这一组接出了什么", "currentLabel": "摆出来的是：", "noteLabel": "这一块管：", "panelEmpty": "（还没摆，点下面候选块试试）", "panelBottom": ["不打分。放回句子里读一遍，讲不通就换个字，", "不是接得越多越好。"], "logAdd": "第 %N% 块摆了「%T%」", "logNext": "换一组：把「%N%」再接一次", "logReset": "重来：台子还在，摆的几块先收回去", "logDemo": "看老师摆这一组：先自己试一次，再看不迟", "annCountText": "已圈出 %N% / %T% 处（点错不标红，也不拦你）", "annMiss": "「%W%」不是带拼音的字。找一找头上标着拼音的那几个？", "annHintText": "淡黄底的是三个带拼音的字。点一点，看拼音怎么帮上忙。", "sampleFold": "摆完再看老师摆的 ▾", "sampleUnfold": "收起老师摆的 ▴", "draftOk": "已记下你摆的那一组。摆没摆看得出，读得准不准不打分。", "draftEmpty": "还没摆也能往下走，但至少要摆出一组——这一组就是今天的成果。", "myLabel": "你接好的那一组", "myEmpty": "（还没存。回到「摆一摆」那一页，摆一组再点存起来。）", "slotCount": 3, "endPunct": "", "annCount": 3, "phText": "□", "resultLabel": "接上了读一读：", "footNote": "点拼音，再点它带出的字 —— 不打分，只看接上以后能不能读通一小句", "toneLabels": {"ˉ": "一声", "ˊ": "二声", "ˇ": "三声", "ˋ": "四声"}, "toneMap": {"a": {"ˉ": "ā", "ˊ": "á", "ˇ": "ǎ", "ˋ": "à"}, "o": {"ˉ": "ō", "ˊ": "ó", "ˇ": "ǒ", "ˋ": "ò"}, "e": {"ˉ": "ē", "ˊ": "é", "ˇ": "ě", "ˋ": "è"}, "i": {"ˉ": "ī", "ˊ": "í", "ˇ": "ǐ", "ˋ": "ì"}, "u": {"ˉ": "ū", "ˊ": "ú", "ˇ": "ǔ", "ˋ": "ù"}, "ü": {"ˉ": "ǖ", "ˊ": "ǘ", "ˇ": "ǚ", "ˋ": "ǜ"}}, "cases": [{"name": "mā 的一家", "slots": [{"ask": "选拼音", "opts": ["mā", "mà", "mǎ"], "note": "声调不同，字也不同", "notes": ["mā：妈妈", "mà：骂人", "mǎ：小马"]}, {"ask": "选汉字", "opts": ["妈", "骂", "马"], "note": "看准字形再接上", "notes": ["妈：女字旁", "骂：两个口", "马：一匹马"]}]}, {"name": "qīng 的一家", "slots": [{"ask": "选拼音", "opts": ["qīng", "qíng", "qǐng"], "note": "要看句子才定得下来", "notes": ["qīng：青草", "qíng：晴天", "qǐng：请坐"]}, {"ask": "选汉字", "opts": ["青", "晴", "请"], "note": "同一个音，三个字", "notes": ["青：颜色", "晴：日字旁，跟太阳有关", "请：言字旁，跟说话有关"]}]}, {"name": "shū 的一家", "slots": [{"ask": "选拼音", "opts": ["shū", "shú", "shǔ"], "note": "先拼准，再看字形", "notes": ["shū：读书", "shú：熟了", "shǔ：数一数"]}, {"ask": "选汉字", "opts": ["书", "熟", "数"], "note": "接上以后读一小句", "notes": ["书：我读书", "熟：饭熟了", "数：数星星"]}]}], "readNotes": {"a": "mā 接「妈」，mà 接「骂」。声调一换，字就换了，先看准帽子。", "b": "qīng 可能是青、晴、请。拼音只管音，到底哪个字要看句子。"}, "annGood": {"mā": "拼音在字头上，先读准它，再去认下面的字。", "qīng": "同一个音有好几个字，要靠句子定下来。", "shū": "「我读 shū」里，句子说的是「书」。"}, "rubAdvice": {"先读准音了吗": "回去看看声调，帽子一换，字可能就换了。", "再看字形了吗": "同一个拼音会有好几个字，别只盯着拼音。", "连成一小句了吗": "把字放回句子里读一读，能说出意思才算通。"}, "colors": {"primary": "#1F5C6B", "accent": "#A8532B", "primarySoft": "#E2F0F2", "accentSoft": "#FBEAD9", "line": "#DDD3BE", "paper": "#FBF8F0", "ink": "#2B2B28", "muted": "#7A7263"}, "lsKey": "cn_mt_pinyin_reading_pinyin"};
// ===== 一年级「拼音识字链」音节台 + 留痕迹互动 =====
// 每课数据由 run_py.py 注入为全局 CN。设计约定（chinese-design.md）：
// 开放表达一律不判对错，只留下痕迹；Canvas 只报「已摆几处」，不给分数。
// CN.mode = tone（四声台）/ blend（拼读台）/ whole（整体认读台）/ bridge（识字桥）
// 结构测试契约：simAdd / simDemo / simNextCase / simReset / simBind / SIM.hits / 画布着色。

var SIM = { ci: 0, picked: [], note: '', hits: [], bound: false };

function simCase() { return CN.cases[SIM.ci]; }
function simSlotCount() { return simCase().slots.length; }
function simAdded() { return SIM.picked.filter(function (x) { return !!x; }).length; }
function simFmt(s, n, t) {
  return String(s).replace(/%N%/g, n).replace(/%T%/g, t);
}
function simSetReadout() {
  var el = document.getElementById('simReadout');
  if (el) el.textContent = simFmt(CN.readout, simAdded(), simSlotCount());
}
// 调号是组合字符，小字号下会糊成一个点；候选块一律显示中文名（一声/二声/…）
function simOptLabel(op) {
  return (CN.toneLabels && CN.toneLabels[op]) || op;
}
// 带调韵母查表：韵母 + 声调 -> ā / á / ǎ / à
function simToned(base, tone) {
  var m = (CN.toneMap || {})[base];
  return (m && m[tone]) || base;
}
// 把已摆的几块拼成要读出来的东西（只用于展示，不判对错）
function simCompose() {
  var mode = CN.mode || 'blend', P = SIM.picked;
  if (mode === 'tone') {
    if (!P[0]) return '';
    return P[1] ? simToned(P[0], P[1]) : P[0];
  }
  if (mode === 'blend') {
    if (!P[0] && !P[1]) return '';
    return (P[0] || '') + (P[1] ? simToned(P[1], P[2] || 'ˉ') : '');
  }
  if (mode === 'whole') return P[0] || '';
  if (mode === 'bridge') return (P[0] || '') + (P[1] ? ' ↔ ' + P[1] : '');
  return '';
}

function simDraw() {
  var ctx = simCtx(), C = CN.colors;
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, SIM_W, SIM_H);
  var c = simCase(), n = simSlotCount(), mode = CN.mode || 'blend';
  SIM.hits = [];

  simTxt(simFmt(CN.canvasTitle, c.name, n), 30, 30, 19, C.primary, '700');

  // ---- 上部：音节台（四种 mode 各画各的） ----
  simBox(24, 48, 528, 116, '#FFFFFF', C.line, 12);
  simTxt(CN.resultLabel || '拼出来是：', 38, 70, 14, C.muted, '400');
  var P = SIM.picked, i, bx;

  if (mode === 'tone') {
    // 韵母 → 声调曲线 → 带调韵母
    var slots = [[40, 96, '韵母'], [168, 132, '声调'], [332, 150, '读一读']];
    for (i = 0; i < 3; i++) {
      var s = slots[i];
      simBox(s[0], 82, s[1], 62, i === 2 ? C.accentSoft : C.primarySoft,
             i === 2 ? C.accent : C.line, 10);
      simTxt(s[2], s[0] + 8, 100, 14, C.muted, '400');
    }
    simTxt(P[0] || '□', 40 + 96 / 2, 128, 34, P[0] ? C.primary : C.muted, '700', 'center');
    // 四声曲线：平 / 升 / 折 / 降
    if (P[1]) {
      var tx = 168, ty = 112;
      ctx.save(); ctx.strokeStyle = C.accent; ctx.lineWidth = 3.6; ctx.lineCap = 'round';
      ctx.beginPath();
      if (P[1] === 'ˉ') { ctx.moveTo(tx + 18, ty); ctx.lineTo(tx + 114, ty); }
      else if (P[1] === 'ˊ') { ctx.moveTo(tx + 18, ty + 14); ctx.lineTo(tx + 114, ty - 16); }
      else if (P[1] === 'ˇ') { ctx.moveTo(tx + 18, ty - 2); ctx.lineTo(tx + 62, ty + 16); ctx.lineTo(tx + 114, ty - 16); }
      else { ctx.moveTo(tx + 18, ty - 16); ctx.lineTo(tx + 114, ty + 16); }
      ctx.stroke(); ctx.restore();
    }
    simTxt(P[1] ? simOptLabel(P[1]) : '□', 168 + 132 / 2, 140, 19,
           P[1] ? C.accent : C.muted, '700', 'center');
    simTxt(simCompose() || '□', 332 + 150 / 2, 130, 36,
           simCompose() ? C.accent : C.muted, '700', 'center');
    simTxt('一声平　二声升　三声拐弯　四声降', 38, 158, 13, C.muted, '400');
  } else if (mode === 'blend') {
    // 声母 | 韵母 | 声调  →  拼成的音节
    var labs = ['声母', '韵母', '声调'], ws = [104, 104, 104], xs = [38, 158, 278];
    for (i = 0; i < 3; i++) {
      simBox(xs[i], 78, ws[i], 58, P[i] ? C.primarySoft : '#F5F3EC',
             P[i] ? C.primary : C.line, 9);
      simTxt(labs[i], xs[i] + 8, 96, 14, C.muted, '400');
      var cell = P[i] ? (i === 2 ? simOptLabel(P[i]) : P[i]) : '□';
      simTxt(cell, xs[i] + ws[i] / 2, 126, cell.length > 2 ? 22 : 30,
             P[i] ? C.primary : C.muted, '700', 'center');
      if (i < 2) simTxt('＋', xs[i] + ws[i] + 4, 118, 22, C.accent, '700', 'center');
    }
    simTxt('→', 392, 118, 24, C.accent, '700', 'center');
    simBox(418, 78, 118, 58, C.accentSoft, C.accent, 9);
    simTxt('拼一拼', 426, 96, 14, C.muted, '400');
    simTxt(simCompose() || '□', 418 + 118 / 2, 126, 30,
           simCompose() ? C.accent : C.muted, '700', 'center');
    simTxt('前音轻短后音重，两音相连猛一碰', 38, 158, 13, C.muted, '400');
  } else if (mode === 'whole') {
    // 整体认读音节：一个大卡 + 「不拆开」斜杠圈 + 例字
    simBox(40, 78, 186, 62, C.primarySoft, C.primary, 9);
    simTxt('整体记，不拼', 50, 96, 14, C.muted, '400');
    simTxt(P[0] || '□', 40 + 186 / 2, 130, 32, P[0] ? C.primary : C.muted, '700', 'center');
    simRing(268, 108, 21, C.accent, 2.4);
    simLine(254, 94, 282, 122, C.accent, 2.4);
    simBox(310, 78, 226, 62, C.accentSoft, C.accent, 9);
    simTxt('它带出的字', 320, 96, 14, C.muted, '400');
    simTxt(P[1] || '□', 310 + 226 / 2, 130, 28, P[1] ? C.accent : C.muted, '700', 'center');
    simTxt('zhi chi shi ri　zi ci si　yi wu yu', 38, 158, 13, C.muted, '400');
  } else { // bridge
    // 拼音卡 ↔ 汉字卡，两槽都摆才连实线
    simBox(40, 78, 186, 62, C.primarySoft, C.primary, 9);
    simTxt('拼音', 50, 96, 14, C.muted, '400');
    simTxt(P[0] || '□', 40 + 186 / 2, 130, 28, P[0] ? C.primary : C.muted, '700', 'center');
    simBox(326, 78, 210, 62, C.accentSoft, C.accent, 9);
    simTxt('汉字', 336, 96, 14, C.muted, '400');
    simTxt(P[1] || '□', 326 + 210 / 2, 130, 30, P[1] ? C.accent : C.muted, '700', 'center');
    var linked = !!(P[0] && P[1]);
    simLine(232, 108, 320, 108, linked ? C.accent : C.line, linked ? 3 : 1.6, linked ? null : [5, 5]);
    simTxt(linked ? '接上了' : '还没接上', 276, 100, 13,
           linked ? C.accent : C.muted, '600', 'center');
    simTxt('拼音是拐棍：先读准音，再认出字，最后读一小句', 38, 158, 13, C.muted, '400');
  }

  // ---- 中部：候选块（一年级字号加大，调号显示中文名） ----
  var sy = 176;
  for (var s2 = 0; s2 < n; s2++) {
    var sl = c.slots[s2], picked = P[s2];
    simTxt(sl.ask, 30, sy + 26, 18, C.primary, '700');
    bx = 150;
    for (var o = 0; o < sl.opts.length; o++) {
      var op = sl.opts[o], label = simOptLabel(op);
      var w2 = Math.max(58, label.length * 22 + 26);
      var isOn = picked === op;
      simBox(bx, sy + 2, w2, 36, isOn ? C.accentSoft : '#FFFFFF',
             isOn ? C.accent : C.line, 8);
      simTxt(label, bx + w2 / 2, sy + 27, label.length > 2 ? 17 : 20,
             isOn ? C.accent : C.ink, isOn ? '700' : '600', 'center');
      SIM.hits.push({ x: bx, y: sy + 2, w: w2, h: 36, slot: s2, opt: o, kind: 'opt' });
      bx += w2 + 10;
    }
    sy += 46;
  }

  // ---- 底部：教学提示条 ----
  simBox(24, 316, 528, 30, C.primarySoft, null, 8);
  simTxt(CN.footNote, 36, 336, 13, C.primary, '600');

  // ---- 右侧面板：只报痕迹，不给分数 ----
  simBox(568, 48, 288, 268, '#FFFFFF', C.line, 12);
  simTxt(CN.panelTitle, 588, 76, 16, C.primary, '700');
  simLine(588, 86, 836, 86, C.line, 1);
  simTxt('已摆　' + simAdded() + ' / ' + n + ' 处', 588, 118, 22, C.accent, '700');
  simTxt(CN.currentLabel || '摆出来的是：', 588, 150, 15, C.muted, '400');
  var full = simCompose() || '（还没摆齐）';
  simTxt(full.length > 12 ? full.slice(0, 12) : full, 588, 182, 22, C.ink, '700');
  if (full.length > 12) simTxt(full.slice(12), 588, 206, 18, C.ink, '700');
  simTxt(CN.noteLabel || '这一块管：', 588, 232, 15, C.muted, '400');
  var nt = SIM.note || (CN.panelEmpty || '（还没摆，点下面候选块试试）');
  simTxt(nt.length > 14 ? nt.slice(0, 14) : nt, 588, 254, 14, C.primary, '600');
  if (nt.length > 14) simTxt(nt.slice(14, 28), 588, 272, 13, C.primary, '600');
  simBox(584, 284, 256, 26, C.primarySoft, null, 8);
  simTxt(CN.panelBottom[0], 594, 302, 12, C.primary, '600');

  simSetReadout();
}

function simAdd(slot, opt) {
  var c = simCase(), n = simSlotCount();
  if (slot < 0 || slot > n - 1) return;
  var sl = c.slots[slot];
  if (!sl || opt < 0 || opt >= sl.opts.length) return;
  SIM.picked[slot] = sl.opts[opt];
  SIM.note = (sl.notes && sl.notes[opt]) || sl.note || '';
  simLog(simFmt(CN.logAdd, slot + 1, sl.opts[opt]) + (SIM.note ? ' → ' + SIM.note : ''));
  simDraw();
}
function simNextCase() {
  SIM.ci = (SIM.ci + 1) % CN.cases.length;
  SIM.picked = [];
  SIM.note = '';
  simLog(simFmt(CN.logNext, simCase().name, simSlotCount()));
  simDraw();
}
function simReset() {
  SIM.picked = [];
  SIM.note = '';
  simLog(CN.logReset);
  simDraw();
}
function simDemo() {
  var c = simCase(), n = simSlotCount();
  SIM.picked = [];
  for (var s = 0; s < n; s++) SIM.picked[s] = c.slots[s].opts[0];
  SIM.note = (c.slots[n - 1].notes && c.slots[n - 1].notes[0]) || c.slots[n - 1].note || '';
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
    for (var i = 0; i < SIM.hits.length; i++) {
      var h = SIM.hits[i];
      if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) {
        simAdd(h.slot, h.opt); return;
      }
    }
  });
}

// ===================== 非仿真页的「留痕迹」互动 =====================

// p2 听一听：点哪个都给解释，不判对错（soft choice）
function bindReadPair() {
  var box = document.getElementById('readPair');
  if (!box || box.__bound) return;
  box.__bound = true;
  box.addEventListener('click', function (e) {
    var el = e.target.closest('.read-line');
    if (!el) return;
    box.querySelectorAll('.read-line').forEach(function (n) { n.classList.remove('picked'); });
    el.classList.add('picked');
    var out = document.getElementById('readNote');
    var k = el.getAttribute('data-k');
    if (out) out.innerHTML = '<b>你点了这一个</b>　' + (CN.readNotes[k] || '');
  });
}

// p3 看一看：圈画只计数，不判错
function bindAnnotate() {
  var box = document.getElementById('annLine');
  if (!box || box.__bound) return;
  box.__bound = true;
  var good = CN.annGood, target = CN.annCount || 3;
  function refresh() {
    var n2 = box.querySelectorAll('.ann-w.on').length;
    var cnt = document.getElementById('annCount');
    if (cnt) cnt.textContent = simFmt(CN.annCountText, n2, target);
  }
  box.addEventListener('click', function (e) {
    var el = e.target.closest('.ann-w');
    if (!el) return;
    var t = el.getAttribute('data-t');
    el.classList.toggle('on');
    var out = document.getElementById('annWhy');
    if (out) {
      if (good[t]) out.innerHTML = '<b>「' + t + '」</b>　' + good[t];
      else out.innerHTML = CN.annMiss.replace(/%W%/g, t);
    }
    refresh();
  });
  var btn = document.getElementById('annHintBtn');
  if (btn && !btn.__bound) {
    btn.__bound = true;
    btn.addEventListener('click', function () {
      box.querySelectorAll('.ann-w').forEach(function (n2) {
        if (good[n2.getAttribute('data-t')] && !n2.classList.contains('on')) n2.classList.add('hint');
      });
      var out = document.getElementById('annWhy');
      if (out) out.innerHTML = CN.annHintText;
    });
  }
}

// p5 摆一摆：支架块、先摆后看、只判「摆没摆」
function bindDraft() {
  var box = document.getElementById('draftBox');
  if (!box || box.__bound) return;
  box.__bound = true;
  box.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip-btn');
    if (chip) {
      var ta = document.getElementById('draftRow3');
      if (ta) { ta.value += (chip.getAttribute('data-ins') || chip.textContent); ta.focus(); }
      return;
    }
    var fold = e.target.closest('.sample-fold');
    if (fold) {
      var body = document.getElementById('sampleBody');
      if (body) {
        var open = body.style.display === 'block';
        body.style.display = open ? 'none' : 'block';
        fold.textContent = open ? (CN.sampleFold || '摆完再看老师摆的 ▾') : (CN.sampleUnfold || '收起老师摆的 ▴');
      }
      return;
    }
    var save = e.target.closest('#draftSave');
    if (save) {
      var rows = ['draftRow1', 'draftRow2', 'draftRow3'].map(function (id) {
        var el = document.getElementById(id); return el ? el.value.trim() : '';
      });
      var last = rows.filter(Boolean).pop() || '';
      try { localStorage.setItem(CN.lsKey, last); } catch (err) { }
      var st = document.getElementById('draftState');
      if (st) st.textContent = last ? CN.draftOk : CN.draftEmpty;
    }
  });
}

// p8 查一查：三维量规，输出建议不给分数
function bindRubric() {
  var box = document.getElementById('rubricBox');
  if (!box || box.__bound) return;
  box.__bound = true;
  box.addEventListener('click', function (e) {
    var lv = e.target.closest('.rub-level');
    if (!lv) return;
    var dim = lv.closest('.rub-dim');
    dim.querySelectorAll('.rub-level').forEach(function (n) { n.classList.remove('on'); });
    lv.classList.add('on');
    var out = document.getElementById('rubAdvice');
    if (out) {
      var name = dim.getAttribute('data-name');
      var low = lv.getAttribute('data-k') !== '优秀';
      out.innerHTML = low
        ? '<b>「' + name + '」还没到优秀</b>　' + (CN.rubAdvice[name] || '') + ' 只改这一处，不用整组重摆。'
        : '<b>「' + name + '」到优秀了</b>　换下一维看看，或者读给同桌听。';
    }
  });
}

// p10 存起来：结算页必须显示学生自己摆的那一组
function updateMySentence() {
  var el = document.getElementById('mySentence');
  if (!el) return;
  var s = '';
  try { s = localStorage.getItem(CN.lsKey) || ''; } catch (err) { }
  el.innerHTML = s
    ? '<b>' + (CN.myLabel || '你摆好的那一组') + '</b>　' + s.replace(/</g, '&lt;')
    : '<b>' + (CN.myLabel || '你摆好的那一组') + '</b>　' + (CN.myEmpty || '（还没存。回到「摆一摆」那一页，摆一组再点存起来。）');
}

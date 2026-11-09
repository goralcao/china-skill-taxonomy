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

var CN = {"mode": "vocab", "readout": "已摆 %N% / %T% 处（不判对错）", "canvasTitle": "把「%N%」摆出来：一块一块试，不着急读对", "legend": "深色＝已经摆好的　灰色＝还没选的那一块", "panelTitle": "这一组摆出了什么", "currentLabel": "摆出来的是：", "noteLabel": "这一块管：", "panelEmpty": "（还没摆，点下面候选块试试）", "panelBottom": ["不打分。出声读一遍：拗口就换一块，", "不是摆得越多越好。"], "logAdd": "第 %N% 块摆了「%T%」", "logNext": "换一组：把「%N%」再摆一次", "logReset": "重来：台子还在，摆的几块先收回去", "logDemo": "看老师摆这一组：先自己试一次，再看不迟", "annCountText": "已圈出 %N% / %T% 处（点错不标红，也不拦你）", "annMiss": "「%W%」不是这一课的词或短语，再看看别处？", "annHintText": "淡黄底的是一个数词、一个颜色词和一个小短语。点一点，看它们怎么凑成一句。", "sampleFold": "摆完再看老师摆的 ▾", "sampleUnfold": "收起老师摆的 ▴", "draftOk": "已记下你摆的那一组。摆没摆看得出，读得准不准不打分。", "draftEmpty": "还没摆也能往下走，但至少要摆出一组——这一组就是今天的成果。", "myLabel": "你摆好的那一组", "myEmpty": "（还没存。回到「描一描」那一页，摆一组再点存起来。）", "slotCount": 3, "annCount": 3, "resultLabel": "摆出来的是：", "footNote": "点下面一块，看它落到台子哪儿 —— 不打分，只看有没有摆齐", "cases": [{"name": "a red apple", "slots": [{"ask": "选英文词", "opts": ["red", "three", "blue"], "notes": ["red：颜色词", "three：数词", "blue：颜色词"]}, {"ask": "选中文义", "opts": ["红色", "三", "蓝色"], "notes": ["红色：red", "三：three", "蓝色：blue"]}, {"ask": "选小短语", "opts": ["a red apple", "a apple red", "red a apple"], "notes": ["颜色在名词前", "词序反了", "a 的位置不对"]}]}, {"name": "three books", "slots": [{"ask": "选英文词", "opts": ["three", "two", "ten"], "notes": ["three：3", "two：2", "ten：10"]}, {"ask": "选中文义", "opts": ["三", "二", "十"], "notes": ["三：three", "二：two", "十：ten"]}, {"ask": "选小短语", "opts": ["three books", "books three", "a three book"], "notes": ["数词在名词前", "词序反了", "复数和冠词不对"]}]}, {"name": "a blue bag", "slots": [{"ask": "选英文词", "opts": ["blue", "green", "black"], "notes": ["blue：蓝", "green：绿", "black：黑"]}, {"ask": "选中文义", "opts": ["蓝色", "绿色", "黑色"], "notes": ["蓝色：blue", "绿色：green", "黑色：black"]}, {"ask": "选小短语", "opts": ["a blue bag", "a bag blue", "blue a bag"], "notes": ["颜色在名词前", "词序反了", "a 的位置不对"]}]}], "readNotes": {"a": "a red apple　一个红苹果　—— 先听，再跟读一遍。", "b": "three blue books　三本蓝色的书　—— 两组放一起，比一比哪里不一样。"}, "annGood": {"red": "颜色词 red，放在名词前。", "three": "数词 three，回答 How many。", "a red apple": "词放进短语：a + 颜色 + 名词。"}, "rubAdvice": {"词认全了吗": "回去把数词和颜色词各补一个，别只写一类。", "放进短语了吗": "把颜色词放到名词前面，前面再加 a 或数字。", "在情境里用了吗": "指着身边的东西数一数、说一说颜色。"}, "colors": {"primary": "#3B4FA8", "accent": "#D2603A", "primarySoft": "#E8ECF8", "accentSoft": "#FBEAD9", "line": "#DCD5C6", "paper": "#FBF9F4", "ink": "#2B2B33", "muted": "#7A7263"}, "lsKey": "en_mt_en_num_color"};
// ===== 三年级「英语字母拼读链」学习台 + 留痕迹互动 =====
// 每课数据由 run_py.py 注入为全局 CN。设计约定（chinese-design.md）：
// 开放表达一律不判对错，只留下痕迹；Canvas 只报「已摆几处」，不给分数。
// CN.mode = letter（字母名形音台）/ trace（四线三格台）/ blend（CVC 拼读台）/ vocab（词汇卡台）
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
// 候选块标签：可给英文选项配中文注释，避免小字号下看不清
function simOptLabel(op) {
  return (CN.optLabels && CN.optLabels[op]) || op;
}
// 把已摆的几块拼成要读出来的东西（只用于展示，不判对错）
function simCompose() {
  var mode = CN.mode || 'blend', P = SIM.picked;
  if (mode === 'letter') return P[0] ? (P[0] + (P[1] ? ' ' + P[1] : '') + (P[2] ? ' · ' + P[2] : '')) : '';
  if (mode === 'trace') return P[0] ? (P[0] + (P[1] ? ' / ' + P[1] : '')) : '';
  if (mode === 'blend') return (P[0] || '') + (P[1] || '') + (P[2] || '');
  if (mode === 'vocab') return P[0] ? (P[0] + (P[1] ? ' ↔ ' + P[1] : '') + (P[2] ? ' · ' + P[2] : '')) : '';
  return '';
}

function simDraw() {
  var ctx = simCtx(), C = CN.colors;
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, SIM_W, SIM_H);
  var c = simCase(), n = simSlotCount(), mode = CN.mode || 'blend';
  SIM.hits = [];

  simTxt(simFmt(CN.canvasTitle, c.name, n), 30, 30, 19, C.primary, '700');

  // ---- 上部：主台（四种 mode 各画各的） ----
  simBox(24, 48, 528, 116, '#FFFFFF', C.line, 12);
  simTxt(CN.resultLabel || '摆出来的是：', 38, 70, 14, C.muted, '400');
  var P = SIM.picked, i, bx;

  if (mode === 'letter') {
    // 大写 → 小写 → 名称音押韵组：字母名、形、音一次对上
    var ls = [[40, 96, '大写'], [168, 132, '小写'], [332, 150, '名称音 / 同韵组']];
    for (i = 0; i < 3; i++) {
      var s = ls[i];
      simBox(s[0], 82, s[1], 62, i === 2 ? C.accentSoft : C.primarySoft,
             i === 2 ? C.accent : C.line, 10);
      simTxt(s[2], s[0] + 8, 100, 14, C.muted, '400');
    }
    simTxt(P[0] || '□', 40 + 96 / 2, 130, 36, P[0] ? C.primary : C.muted, '700', 'center');
    simTxt(P[1] || '□', 168 + 132 / 2, 130, 34, P[1] ? C.accent : C.muted, '700', 'center');
    simTxt(P[2] || '□', 332 + 150 / 2, 128, P[2] && P[2].length > 6 ? 16 : 21,
           P[2] ? C.accent : C.muted, '700', 'center');
    simTxt('字母名 ≠ 字母音：A 的名称音是 /eɪ/，在 cat 里读 /æ/', 38, 158, 13, C.muted, '400');

  } else if (mode === 'trace') {
    // 四线三格：四条基线 + 字母占位 + 占格判断 + 笔顺
    simBox(36, 76, 360, 76, '#FFFFFF', C.line, 6);
    for (i = 0; i < 4; i++) {
      simLine(44, 86 + i * 20, 388, 86 + i * 20, i === 2 ? C.accent : C.line,
              i === 2 ? 2 : 1.2, i === 2 ? null : [5, 4]);
    }
    simTxt(P[0] || '□', 210, 132, 44, P[0] ? C.primary : C.muted, '700', 'center');
    simBox(408, 78, 132, 72, C.accentSoft, C.accent, 9);
    simTxt('占格', 418, 96, 14, C.muted, '400');
    simTxt(P[1] || '□', 408 + 132 / 2, 130, P[1] && P[1].length > 4 ? 15 : 19,
           P[1] ? C.accent : C.muted, '700', 'center');
    simTxt('大写一律上两格；小写看有没有「辫」和「尾」', 38, 158, 13, C.muted, '400');

  } else if (mode === 'blend') {
    // 首字母 | 元音 | 尾字母 → 拼成 CVC 单词
    var labs = ['首字母', '元音', '尾字母'], ws = [104, 104, 104], xs = [38, 158, 278];
    for (i = 0; i < 3; i++) {
      simBox(xs[i], 78, ws[i], 58, P[i] ? C.primarySoft : '#F5F3EC',
             P[i] ? C.primary : C.line, 9);
      simTxt(labs[i], xs[i] + 8, 96, 14, C.muted, '400');
      var cell = P[i] || '□';
      simTxt(cell, xs[i] + ws[i] / 2, 126, 30, P[i] ? C.primary : C.muted, '700', 'center');
      if (i < 2) simTxt('＋', xs[i] + ws[i] + 4, 118, 22, C.accent, '700', 'center');
    }
    simTxt('→', 392, 118, 24, C.accent, '700', 'center');
    simBox(418, 78, 118, 58, C.accentSoft, C.accent, 9);
    simTxt('拼出来', 426, 96, 14, C.muted, '400');
    var w = simCompose();
    simTxt(w || '□', 418 + 118 / 2, 126, w.length > 4 ? 21 : 30,
           w ? C.accent : C.muted, '700', 'center');
    simTxt('一个音一个音拼过去，别把字母名读进来', 38, 158, 13, C.muted, '400');

  } else { // vocab
    // 英文词 ↔ 中文义 ↔ 小情境（词不离句）
    simBox(36, 78, 150, 62, C.primarySoft, C.primary, 9);
    simTxt('英文词', 46, 96, 14, C.muted, '400');
    simTxt(P[0] || '□', 36 + 150 / 2, 130, P[0] && P[0].length > 7 ? 17 : 25,
           P[0] ? C.primary : C.muted, '700', 'center');
    simTxt('↔', 196, 118, 24, C.accent, '700', 'center');
    simBox(222, 78, 140, 62, C.accentSoft, C.accent, 9);
    simTxt('中文义', 232, 96, 14, C.muted, '400');
    simTxt(P[1] || '□', 222 + 140 / 2, 130, 26, P[1] ? C.accent : C.muted, '700', 'center');
    simBox(374, 78, 166, 62, C.primarySoft, C.line, 9);
    simTxt('放进一小句', 384, 96, 14, C.muted, '400');
    simTxt(P[2] || '□', 374 + 166 / 2, 130, P[2] && P[2].length > 8 ? 14 : 18,
           P[2] ? C.primary : C.muted, '700', 'center');
    simTxt('词不离句：把词放进 a red apple 这样的小短语里', 38, 158, 13, C.muted, '400');
  }

  // ---- 中部：候选块（点一个摆一块，不判对错） ----
  var sy = 176;
  for (var s2 = 0; s2 < n; s2++) {
    var sl = c.slots[s2], picked = P[s2];
    simTxt(sl.ask, 30, sy + 26, 18, C.primary, '700');
    bx = 150;
    for (var o = 0; o < sl.opts.length; o++) {
      var op = sl.opts[o], label = simOptLabel(op);
      var w2 = Math.max(58, label.length * 15 + 26);
      var isOn = picked === op;
      simBox(bx, sy + 2, w2, 36, isOn ? C.accentSoft : '#FFFFFF',
             isOn ? C.accent : C.line, 8);
      simTxt(label, bx + w2 / 2, sy + 27, label.length > 6 ? 15 : 19,
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
  if (full.length > 12) simTxt(full.slice(12, 24), 588, 206, 18, C.ink, '700');
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

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

var CN = {"readout": "已点 %N% / %T% 处（不判对错）", "canvasTitle": "给「%N%」点上该点的符号：先看清关系，再落笔", "legend": "深色＝原句　彩色＝你补的符号", "panelTitle": "这一句留下了什么", "currentLabel": "当前句子：", "noteLabel": "这一处回答了：", "panelEmpty": "（还没点，点左边符号块试试）", "panelBottom": ["不打分。读一遍：别扭就换个符号，", "不是点得越多越好。"], "logAdd": "第 %N% 处点了「%T%」", "logNext": "换一组：把「%N%」再点一次", "logReset": "重来：句子还在，点的几处先收回去", "logDemo": "看老师点这一句：先自己试一次，再看不迟", "annCountText": "已圈出 %N% / %T% 处（点错不标红，也不拦你）", "annMiss": "「%W%」不是并列的词，不用在它后面点顿号。再看看别处？", "annHintText": "淡黄底的是三个并列的词。点一点，看看顿号该落在哪儿。", "sampleFold": "写完再看参考稿 ▾", "sampleUnfold": "收起参考稿 ▴", "draftOk": "已记下你写的那一句。写没写看得出，写得好不好不打分。", "draftEmpty": "还没写也能往下走，但至少要写出一行——这一行就是今天的成果。", "myLabel": "你点好的那一句", "myEmpty": "（还没存。回到「写下来」那一页，写一行再点存起来。）", "slotCount": 3, "endPunct": "", "annCount": 3, "cases": [{"name": "并列词语", "seq": ["桃", 0, "李", 1, "杏", 2, "苹果", "，", "都是水果", "。"], "slots": [{"ask": "第 1 处", "opts": ["、", "，", "；"], "note": "并列词语之间用顿号"}, {"ask": "第 2 处", "opts": ["、", "，", "；"], "note": "还是顿号，停顿比逗号短"}, {"ask": "第 3 处", "opts": ["、", "，", "；"], "note": "三个词并列，三处都用顿号"}]}, {"name": "作品名", "seq": ["我读了", 0, "西游记", 1, "和", 2, "稻草人", 3, "两本书", "。"], "slots": [{"ask": "书名前面", "opts": ["《", "“", "，"], "note": "书名号左半，套住作品名"}, {"ask": "书名后面", "opts": ["》", "”", "、"], "note": "书名号右半，和左半成对"}, {"ask": "第二本前", "opts": ["《", "、", "；"], "note": "并列的书名号之间不加顿号"}, {"ask": "第二本后", "opts": ["》", "，", "。"], "note": "再补一个右半，两本书都套好"}]}, {"name": "并列分句", "seq": ["他爱读书", 0, "她爱画画", 1, "我爱唱歌", 2, "。"], "slots": [{"ask": "第 1 处", "opts": ["；", "、", "，"], "note": "并列分句之间用分号"}, {"ask": "第 2 处", "opts": ["；", "、", "，"], "note": "还是分号，两边都能单独成句"}, {"ask": "句末", "opts": ["。", "；", "、"], "note": "整句说完，用句号收住"}]}], "readNotes": {"a": "三个词是并列的，中间只用顿号停半拍。换成逗号就显得拖，换成句号更不对。", "b": "「他爱读书」「她爱画画」是两句能站住的小句，并列时分号；书名用《》套起来。"}, "annGood": {"桃": "第一个并列词，它后面要落一个顿号。", "李": "第二个并列词，前后都是顿号。", "杏": "第三个并列词，它是最后一个，后面接「都是水果」。"}, "rubAdvice": {"点全了没": "回去数一数空位，把漏掉的那一处补上。", "点得对吗": "先看是并列的词还是并列的分句，再换符号。", "读得顺吗": "小声读一遍，把让你卡住的那个符号换短一点或长一点。"}, "colors": {"primary": "#1F4E79", "accent": "#B5651D", "primarySoft": "#E8F0F7", "accentSoft": "#FBEAD9", "line": "#DDD3BE", "paper": "#FBF8F0", "ink": "#2B2B28", "muted": "#7A7263"}, "lsKey": "cn_mt_punct_advanced_sentence"};
// ===== 六段「语言知识课」通用仿真与留痕迹互动 =====
// 每课数据由 run_k.py 注入为全局 CN。设计约定（chinese-design.md）：
// 开放表达一律不判对错，只留下痕迹；Canvas 只报「已添几处」，不给分数。
// 结构测试契约：simAdd / simDemo / simNextCase / simReset / simBind / SIM.hits / 画布着色。

var SIM = { ci: 0, picked: [], note: '', hits: [], bound: false };

function simCase() { return CN.cases[SIM.ci]; }
function simSlotCount() { return simCase().slots.length; }
function simAdded() { return SIM.picked.filter(function (x) { return !!x; }).length; }

// 句子由 seq 描述：数字＝第几号槽（学生添的），字符串＝骨架（不动）。
function simSentence() {
  var c = simCase(), out = [];
  for (var i = 0; i < c.seq.length; i++) {
    var it = c.seq[i];
    if (typeof it === 'number') {
      if (SIM.picked[it]) out.push({ t: SIM.picked[it], isNew: true });
      else if (CN.phText) out.push({ t: CN.phText, isNew: false, ph: true });
    } else out.push({ t: it, isNew: false });
  }
  if (CN.endPunct !== '') out.push({ t: CN.endPunct || '。', isNew: false });
  return out;
}
function simSentenceText() {
  return simSentence().map(function (w) { return w.t; }).join('');
}
function simFmt(s, n, t) {
  return String(s).replace(/%N%/g, n).replace(/%T%/g, t);
}
function simSetReadout() {
  var el = document.getElementById('simReadout');
  if (el) el.textContent = simFmt(CN.readout, simAdded(), simSlotCount());
}

function simDraw() {
  var ctx = simCtx(), C = CN.colors;
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, SIM_W, SIM_H);
  var c = simCase(), n = simSlotCount();
  SIM.hits = [];

  simTxt(simFmt(CN.canvasTitle, c.name, n), 30, 30, 18, C.primary, '700');

  // ---- 句子区：词块横排，超出换行 ----
  simBox(24, 48, 528, 92, '#FFFFFF', C.line, 12);
  var words = simSentence(), x = 38, y = 66, maxX = 542, bh = 30;
  ctx.save();
  ctx.font = '19px ' + SIM_FONT;
  for (var i = 0; i < words.length; i++) {
    var w = words[i];
    var tw = ctx.measureText(w.t).width + 20;
    if (x + tw > maxX) { x = 38; y += 38; }
    var col = w.ph ? C.muted : (w.isNew ? C.accent : C.primary);
    var bg = w.ph ? '#F1EFE7' : (w.isNew ? C.accentSoft : C.primarySoft);
    simBox(x, y, tw, bh, bg, col, 7);
    simTxt(w.t, x + tw / 2, y + 21, 19, col, w.isNew ? '700' : '600', 'center');
    x += tw + 6;
  }
  ctx.restore();
  simTxt(CN.legend, 38, 132, 12, C.muted, '400');

  // ---- 槽区：每行一个 ask + 三个候选词块 ----
  var sy = 156;
  for (var s = 0; s < n; s++) {
    var sl = c.slots[s], picked = SIM.picked[s];
    simTxt(sl.ask, 30, sy + 22, 16, C.primary, '700');
    var bx = 116;
    for (var o = 0; o < sl.opts.length; o++) {
      var op = sl.opts[o];
      var w2 = Math.max(42, op.length * 15 + 20);
      var isOn = picked === op;
      simBox(bx, sy + 2, w2, 28, isOn ? C.accentSoft : '#FFFFFF', isOn ? C.accent : C.line, 6);
      simTxt(op, bx + w2 / 2, sy + 21, 15, isOn ? C.accent : C.ink, isOn ? '700' : '400', 'center');
      SIM.hits.push({ x: bx, y: sy + 2, w: w2, h: 28, slot: s, opt: o, kind: 'opt' });
      bx += w2 + 8;
    }
    sy += n >= 4 ? 30 : 40;
  }

  // ---- 右侧面板：只报痕迹，不给分数 ----
  simBox(568, 48, 288, 268, '#FFFFFF', C.line, 12);
  simTxt(CN.panelTitle, 588, 76, 15, C.primary, '700');
  simLine(588, 86, 836, 86, C.line, 1);
  simTxt((CN.panelAddedLabel || '已添') + '　' + simAdded() + ' / ' + n + ' 处', 588, 118, 20, C.accent, '700');
  simTxt(CN.currentLabel || '当前句子：', 588, 150, 13, C.muted, '400');
  var full = simSentenceText();
  var lines = full.length > 15 ? [full.slice(0, 15), full.slice(15)] : [full];
  for (var L = 0; L < lines.length; L++) {
    simTxt(lines[L], 588, 174 + L * 24, 14, C.ink, '600');
  }
  var ny = 174 + lines.length * 24 + 14;
  simTxt(CN.noteLabel || '这一处回答了：', 588, ny, 13, C.muted, '400');
  simTxt(SIM.note || (CN.panelEmpty || '（还没添，点左边词块试试）'), 588, ny + 24, 13, C.primary, '600');
  simBox(584, 262, 256, 42, C.primarySoft, null, 8);
  simTxt(CN.panelBottom[0], 596, 280, 12, C.primary, '600');
  simTxt(CN.panelBottom[1], 596, 297, 12, C.primary, '600');

  simSetReadout();
}

function simAdd(slot, opt) {
  var c = simCase(), n = simSlotCount();
  if (slot < 0 || slot > n - 1) return;
  var sl = c.slots[slot];
  if (!sl || opt < 0 || opt >= sl.opts.length) return;
  SIM.picked[slot] = sl.opts[opt];
  SIM.note = sl.note;
  simLog(simFmt(CN.logAdd, slot + 1, sl.opts[opt]) + ' → ' + sl.note);
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
  SIM.note = c.slots[n - 1].note;
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

// p2 读进去：点哪句都给解释，不判对错（soft choice）
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
    if (out) out.innerHTML = '<b>你点了这一句</b>　' + (CN.readNotes[k] || '');
  });
}

// p3 看出来：圈画只计数，不判错
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

// p5 写下来：支架词、先写后看范文、只判「写没写」
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
        fold.textContent = open ? (CN.sampleFold || '写完再看参考稿 ▾') : (CN.sampleUnfold || '收起参考稿 ▴');
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

// p8 评一评：三维量规，输出建议不给分数
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
        ? '<b>「' + name + '」还没到优秀</b>　' + (CN.rubAdvice[name] || '') + ' 只改这一处，不用整句重写。'
        : '<b>「' + name + '」到优秀了</b>　换下一维看看，或者读给同桌听。';
    }
  });
}

// p10 存起来：结算页必须显示学生自己写的那一句
function updateMySentence() {
  var el = document.getElementById('mySentence');
  if (!el) return;
  var s = '';
  try { s = localStorage.getItem(CN.lsKey) || ''; } catch (err) { }
  el.innerHTML = s
    ? '<b>' + (CN.myLabel || '你写的那一句') + '</b>　' + s.replace(/</g, '&lt;')
    : '<b>' + (CN.myLabel || '你写的那一句') + '</b>　' + (CN.myEmpty || '（还没存。回到「写下来」那一页，写一行再点存起来。）');
}

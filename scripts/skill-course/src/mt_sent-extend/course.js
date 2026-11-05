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

// ===== 语文样板课 mt_sent-extend「扩句」：仿真与互动 =====
// 设计约定（chinese-design.md）：开放表达不判对错，只留下痕迹。
// Canvas 是「句子积木台」：点一个词块 → 插进句子 → 句子变一次，不给分数。

var CN_CASES = [
  {
    name: '小鸟飞', base: ['小鸟', '飞'],
    slots: [
      { ask: '什么样的', opts: ['可爱的', '毛茸茸的', '浑身雪白的'], note: '写出样子，贴着名词「小鸟」' },
      { ask: '在哪里', opts: ['在树枝上', '在屋檐下', '在晨光里'], note: '说清地方，贴着动作「飞」' },
      { ask: '怎样地', opts: ['快活地', '轻轻地', '一圈一圈地'], note: '写出飞的样子，贴着动作「飞」' }
    ]
  },
  {
    name: '小猫叫', base: ['小猫', '叫'],
    slots: [
      { ask: '什么样的', opts: ['毛茸茸的', '浑身雪白的', '圆滚滚的'], note: '写出样子，贴着名词「小猫」' },
      { ask: '在哪里', opts: ['在墙角', '在窗台上', '在院子里'], note: '说清地方，贴着动作「叫」' },
      { ask: '怎样地', opts: ['懒洋洋地', '一声接一声地', '细声细气地'], note: '写出叫的样子，贴着动作「叫」' }
    ]
  },
  {
    name: '小草长', base: ['小草', '长'],
    slots: [
      { ask: '什么样的', opts: ['嫩绿的', '刚冒尖的', '沾着露珠的'], note: '写出样子，贴着名词「小草」' },
      { ask: '在哪里', opts: ['在田埂上', '在石缝里', '在春雨后'], note: '说清地方，贴着动作「长」' },
      { ask: '怎样地', opts: ['悄悄地', '一天一寸地', '使劲儿地'], note: '写出长的样子，贴着动作「长」' }
    ]
  }
];

var SIM = { ci: 0, picked: [null, null, null], note: '', hits: [], bound: false };

function simCase() { return CN_CASES[SIM.ci]; }
function simAdded() { return SIM.picked.filter(function (x) { return !!x; }).length; }

// 句子词块：骨架是 base[0]/base[1]，插入的词标 new
function simSentence() {
  var c = simCase(), out = [];
  if (SIM.picked[0]) out.push({ t: SIM.picked[0], isNew: true });
  out.push({ t: c.base[0], isNew: false });
  if (SIM.picked[1]) out.push({ t: SIM.picked[1], isNew: true });
  if (SIM.picked[2]) out.push({ t: SIM.picked[2], isNew: true });
  out.push({ t: c.base[1], isNew: false });
  out.push({ t: '。', isNew: false });
  return out;
}

function simSentenceText() {
  return simSentence().map(function (w) { return w.t; }).join('');
}

function simSetReadout() {
  var el = document.getElementById('simReadout');
  if (el) el.textContent = '已添 ' + simAdded() + ' / 3 处（不判对错）';
}

function simDraw() {
  var ctx = simCtx();
  ctx.fillStyle = '#FBF8F0';
  ctx.fillRect(0, 0, SIM_W, SIM_H);
  var c = simCase();
  SIM.hits = [];

  simTxt('把「' + c.name + '」加具体：骨架不动，只往上面加肉', 30, 30, 18, '#2E5C4A', '700');

  // ---- 句子区：词块横排，超出换行 ----
  simBox(24, 48, 528, 92, '#FFFFFF', '#DDD3BE', 12);
  var words = simSentence(), x = 38, y = 66, maxX = 542, bh = 30;
  ctx.save();
  ctx.font = '19px ' + SIM_FONT;
  for (var i = 0; i < words.length; i++) {
    var w = words[i];
    var tw = ctx.measureText(w.t).width + 20;
    if (x + tw > maxX) { x = 38; y += 38; }
    var col = w.isNew ? '#C0622F' : '#2E5C4A';
    var bg = w.isNew ? '#FBE9DD' : '#EDF3EE';
    simBox(x, y, tw, bh, bg, col, 7);
    simTxt(w.t, x + tw / 2, y + 21, 19, col, w.isNew ? '700' : '600', 'center');
    x += tw + 6;
  }
  ctx.restore();
  simTxt('墨绿＝句子骨架　朱砂＝你添的那一处', 38, 132, 12, '#7A7263', '400');

  // ---- 槽区：三行，每行一个 ask + 三个候选词块 ----
  var sy = 156;
  for (var s = 0; s < 3; s++) {
    var sl = c.slots[s];
    var picked = SIM.picked[s];
    simTxt(sl.ask, 30, sy + 22, 16, '#2E5C4A', '700');
    var bx = 116;
    for (var o = 0; o < sl.opts.length; o++) {
      var op = sl.opts[o];
      var w2 = op.length * 15 + 20;
      var isOn = picked === op;
      simBox(bx, sy + 2, w2, 28, isOn ? '#FBE9DD' : '#FFFFFF', isOn ? '#C0622F' : '#DDD3BE', 6);
      simTxt(op, bx + w2 / 2, sy + 21, 15, isOn ? '#C0622F' : '#4A463E', isOn ? '700' : '400', 'center');
      SIM.hits.push({ x: bx, y: sy + 2, w: w2, h: 28, slot: s, opt: o });
      bx += w2 + 8;
    }
    sy += 40;
  }

  // ---- 右侧面板：只报痕迹，不给分数 ----
  simBox(568, 48, 288, 268, '#FFFFFF', '#DDD3BE', 12);
  simTxt('这一句留下了什么', 588, 76, 15, '#2E5C4A', '700');
  simLine(588, 86, 836, 86, '#DDD3BE', 1);
  simTxt('已添　' + simAdded() + ' / 3 处', 588, 118, 20, '#C0622F', '700');
  simTxt('当前句子：', 588, 150, 13, '#7A7263', '400');
  var full = simSentenceText();
  // 长句折成两行
  var lines = full.length > 15 ? [full.slice(0, 15), full.slice(15)] : [full];
  for (var L = 0; L < lines.length; L++) {
    simTxt(lines[L], 588, 174 + L * 24, 14, '#2B2B28', '600');
  }
  var ny = 174 + lines.length * 24 + 14;
  simTxt('这一处回答了：', 588, ny, 13, '#7A7263', '400');
  simTxt(SIM.note || '（还没添，点左边词块试试）', 588, ny + 24, 13, '#2E5C4A', '600');
  simBox(584, 262, 256, 42, '#EDF3EE', null, 8);
  simTxt('不打分。读一遍：别扭就换个词，', 596, 280, 12, '#2E5C4A', '600');
  simTxt('不是加得不够多。', 596, 297, 12, '#2E5C4A', '600');

  simSetReadout();
}

function simAdd(slot, opt) {
  var c = simCase();
  if (slot < 0 || slot > 2) return;
  var sl = c.slots[slot];
  if (!sl || opt < 0 || opt >= sl.opts.length) return;
  SIM.picked[slot] = sl.opts[opt];
  SIM.note = sl.note;
  simLog('第 ' + (slot + 1) + ' 处添了「<span class="hl">' + sl.opts[opt] + '</span>」→ ' + sl.note);
  simDraw();
}

function simNextCase() {
  SIM.ci = (SIM.ci + 1) % CN_CASES.length;
  SIM.picked = [null, null, null];
  SIM.note = '';
  simLog('换一组：把「<span class="hl">' + simCase().name + '</span>」写具体');
  simDraw();
}

function simReset() {
  SIM.picked = [null, null, null];
  SIM.note = '';
  simLog('重来：骨架还在，添的三处先收回去');
  simDraw();
}

function simDemo() {
  var c = simCase();
  SIM.picked = [c.slots[0].opts[0], c.slots[1].opts[0], c.slots[2].opts[0]];
  SIM.note = c.slots[2].note;
  simLog('看老师改这一句：<span class="hl">先自己试一次，再看不迟</span>');
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
        simAdd(h.slot, h.opt);
        return;
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
  var notes = {
    a: '这句只说了「谁、做什么」。你能想出这只鸟多大、什么颜色、在哪儿吗？想不出，就是画面没给够。',
    b: '多了三样东西：样子（可爱的）、地方（树枝上）、飞的样子（快活地）。画面就是被这三样撑起来的。'
  };
  box.addEventListener('click', function (e) {
    var el = e.target.closest('.read-line');
    if (!el) return;
    box.querySelectorAll('.read-line').forEach(function (n) { n.classList.remove('picked'); });
    el.classList.add('picked');
    var out = document.getElementById('readNote');
    if (out) out.innerHTML = '<b>你点了这一句</b>　' + notes[el.getAttribute('data-k')];
  });
}

// p3 看出来：圈画只计数，不判错
function bindAnnotate() {
  var box = document.getElementById('annLine');
  if (!box || box.__bound) return;
  box.__bound = true;
  var good = { '可爱': '写在「小鸟」前面，回答「什么样的」——这是样子。',
               '树枝上': '写在「飞」前面，回答「在哪儿」——这是地方。',
               '快活': '写在「飞」前面，回答「怎样地」——这是飞的样子。' };
  function refresh() {
    var n = box.querySelectorAll('.ann-w.on').length;
    var cnt = document.getElementById('annCount');
    if (cnt) cnt.textContent = '已圈出 ' + n + ' / 3 处（点错不标红，也不拦你）';
  }
  box.addEventListener('click', function (e) {
    var el = e.target.closest('.ann-w');
    if (!el) return;
    var t = el.getAttribute('data-t');
    el.classList.toggle('on');
    var out = document.getElementById('annWhy');
    if (out) {
      if (good[t]) out.innerHTML = '<b>「' + t + '」</b>　' + good[t];
      else out.innerHTML = '「' + t + '」是句子的骨架或数量，不是撑起画面的修饰语。再看看别处？';
    }
    refresh();
  });
  var btn = document.getElementById('annHintBtn');
  if (btn && !btn.__bound) {
    btn.__bound = true;
    btn.addEventListener('click', function () {
      box.querySelectorAll('.ann-w').forEach(function (n) {
        if (good[n.getAttribute('data-t')] && !n.classList.contains('on')) n.classList.add('hint');
      });
      var out = document.getElementById('annWhy');
      if (out) out.innerHTML = '淡黄底的是还没被注意到的三处。点一点，看看它回答了哪个问题。';
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
      if (ta) { ta.value += (ta.value && !/[\s，。]$/.test(ta.value) ? '' : '') + chip.textContent; ta.focus(); }
      return;
    }
    var fold = e.target.closest('.sample-fold');
    if (fold) {
      var body = document.getElementById('sampleBody');
      if (body) { var open = body.style.display === 'block'; body.style.display = open ? 'none' : 'block'; fold.textContent = open ? '写完再看参考稿 ▾' : '收起参考稿 ▴'; }
      return;
    }
    var save = e.target.closest('#draftSave');
    if (save) {
      var rows = ['draftRow1', 'draftRow2', 'draftRow3'].map(function (id) {
        var el = document.getElementById(id); return el ? el.value.trim() : '';
      });
      var last = rows.filter(Boolean).pop() || '';
      try { localStorage.setItem('cn_sent_extend_sentence', last); } catch (err) { }
      var st = document.getElementById('draftState');
      if (st) st.textContent = last ? '已记下你写的那一句。写没写看得出，写得好不好不打分。' : '还没写也能往下走，但至少要写出一行——这一行就是今天的成果。';
    }
  });
}

// p8 评一评：三维量规，输出建议不给分数
function bindRubric() {
  var box = document.getElementById('rubricBox');
  if (!box || box.__bound) return;
  box.__bound = true;
  var adviceMap = {
    '添了没': '回去再添一处：样子或地方，挑一样补上就行。',
    '添得对吗': '读一遍那一句，把别扭的那个词换个位置。',
    '看得见吗': '补一个能让人想出样子的具体词，别再加形容词。'
  };
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
        ? '<b>「' + name + '」还没到优秀</b>　' + adviceMap[name] + ' 只改这一处，不用整句重写。'
        : '<b>「' + name + '」到优秀了</b>　换下一维看看，或者读给同桌听。';
    }
  });
}

// p10 存起来：结算页必须显示学生自己写的那一句
function updateMySentence() {
  var el = document.getElementById('mySentence');
  if (!el) return;
  var s = '';
  try { s = localStorage.getItem('cn_sent_extend_sentence') || ''; } catch (err) { }
  el.innerHTML = s
    ? '<b>你写的那一句</b>　' + s.replace(/</g, '&lt;')
    : '<b>你写的那一句</b>　（还没存。回到「写下来」那一页，写一行再点「存进句子本」。）';
}

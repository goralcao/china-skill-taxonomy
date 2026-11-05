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

// ===== 写作课样板 mt_write-diary「学写日记」：仿真与「留痕迹」互动 =====
// 设计依据：chinese-reading-writing.md 写作五段（起意→搭骨架→起草→改→出刊）
// 红线：能给学生看的只有「事实」，不能给的是「判断」；
//       构思不能只给一个输入框（先撒 8 张卡再收 1 张进主格）；
//       修改必须点中一句才允许打勾，改的是句子不是错别字；
//       错别字不属于「改」；不按字数/好词好句打分，不先发范文。
// 仿真页是「体检单」：点一条清单 → 全文高亮可疑句 → 点中一句才记下一处改动。

var CN_CASES = [
  {
    name: '放学的伞',
    lines: [
      '放学后我回到家，然后放下书包，然后拿出作业本，然后开始写。',
      '我听见窗外有鸟叫。我跑过去看，什么也没看见。',
      '我很开心，很好玩。这一天就这样过去了。'
    ],
    checks: [
      { name: '数「然后」，超过 2 个删 1 个', act: '删', line: 0, color: '#C62828',
        how: '句子可点，点中后把多余的「然后」划掉，计数减一' },
      { name: '连续两句都「我……」开头', act: '换', line: 1, color: '#2E7D32',
        how: '点中第二句，把开头换个说法' },
      { name: '只有动作没有感觉', act: '增', line: 1, color: '#1565C0',
        how: '点中该句，插入「我听见 / 我看见」' },
      { name: '三段头一句连起来读不通', act: '调', line: 2, color: '#1565C0',
        how: '拖动段序，让三段的头一句接得上' },
      { name: '圈出「很开心」「很好玩」', act: '换', line: 2, color: '#2E7D32',
        how: '点中后给一个具体动作，别再用空词' }
    ]
  },
  {
    name: '早上的猫',
    lines: [
      '早上我起床，然后刷牙，然后吃饭，然后背书包出门。',
      '我看见一只猫。我蹲下来，它一下跑走了。',
      '今天真好，真高兴。就这样吧。'
    ],
    checks: [
      { name: '数「然后」，超过 2 个删 1 个', act: '删', line: 0, color: '#C62828',
        how: '点中这句，删掉一个「然后」' },
      { name: '连续两句都「我……」开头', act: '换', line: 1, color: '#2E7D32',
        how: '点中第二句，换个开头' },
      { name: '只有动作没有感觉', act: '增', line: 1, color: '#1565C0',
        how: '点中该句，补一句「我听见 / 我看见」' },
      { name: '三段头一句连起来读不通', act: '调', line: 2, color: '#1565C0',
        how: '把三段的顺序调一调' },
      { name: '圈出「真好」「真高兴」', act: '换', line: 2, color: '#2E7D32',
        how: '点中后换成具体动作' }
    ]
  }
];

var SIM = { ci: 0, sel: null, fixed: [false, false, false, false, false],
            changed: [false, false, false], hits: [], bound: false };

function simCase() { return CN_CASES[SIM.ci]; }
function simFixedCount() { return SIM.fixed.filter(function (x) { return x; }).length; }
function simSetReadout() {
  var el = document.getElementById('simReadout');
  if (el) el.textContent = '已改 ' + simFixedCount() + ' / 5 处（改的是句子，不是错别字）';
}
function simWrap(t, n) { return t.length <= n ? [t] : [t.slice(0, n), t.slice(n)]; }

function simDraw() {
  var ctx = simCtx();
  ctx.fillStyle = '#FBF8F0';
  ctx.fillRect(0, 0, SIM_W, SIM_H);
  var c = simCase();
  SIM.hits = [];

  simTxt('按体检单改：' + c.name, 28, 30, 18, '#2E5C4A', '700');
  simTxt('我的草稿（点一句才算改过）', 28, 52, 13, '#7A7263', '700');
  simTxt('体检单（先点一条）', 548, 52, 13, '#7A7263', '700');

  var ys = [66, 146, 226];
  for (var l = 0; l < 3; l++) {
    var target = SIM.sel !== null && c.checks[SIM.sel].line === l;
    var done = SIM.changed[l];
    simBox(24, ys[l], 496, 62, done ? '#E8F5E9' : (target ? '#FFF2C9' : '#FFFFFF'),
           done ? '#2E7D32' : (target ? '#E0A93B' : '#DDD3BE'), 10);
    var ls = simWrap(c.lines[l], 26);
    for (var k = 0; k < ls.length; k++) simTxt(ls[k], 38, ys[l] + 25 + k * 22, 15, '#2B2B28', '600');
    simTxt('第 ' + (l + 1) + ' 段' + (done ? '  ✓ 已改' : ''), 500, ys[l] + 55, 11,
           done ? '#2E7D32' : '#7A7263', '700', 'right');
    SIM.hits.push({ x: 24, y: ys[l], w: 496, h: 62, kind: 'l', idx: l });
  }

  var cy = 66;
  for (var i = 0; i < 5; i++) {
    var ck = c.checks[i], on = SIM.sel === i, ok = SIM.fixed[i];
    simBox(540, cy, 316, 40, ok ? '#E8F5E9' : (on ? '#FFF2C9' : '#FFFFFF'),
           ok ? '#2E7D32' : (on ? '#E0A93B' : '#DDD3BE'), 8);
    simDot(558, cy + 20, 7, ok ? '#2E7D32' : ck.color, null);
    simTxt((ok ? '✓ ' : (i + 1) + '. ') + ck.name, 574, cy + 25, 13,
           ok ? '#2E7D32' : '#4A463E', ok ? '700' : '600');
    SIM.hits.push({ x: 540, y: cy, w: 316, h: 40, kind: 'c', idx: i });
    cy += 46;
  }
  // 选中清单 → 目标段的提示连线
  if (SIM.sel !== null) {
    var t = c.checks[SIM.sel].line;
    simLine(520, ys[t] + 31, 540, 66 + SIM.sel * 46 + 20, '#E0A93B', 1.6, [4, 4]);
  }

  simBox(24, 306, 832, 40, '#EDF3EE', null, 8);
  simTxt('已改 ' + simFixedCount() + ' / 5 处', 40, 331, 16, '#2E5C4A', '700');
  simTxt(SIM.sel !== null
    ? '第 ' + (SIM.sel + 1) + ' 条：' + c.checks[SIM.sel].how
    : '先点右边一条体检项，再点左边一句 —— 不打分，只记改动落在哪句',
    250, 331, 12, '#4A463E', '400');
  simSetReadout();
}

function simCheck(i) {
  var c = simCase();
  if (i < 0 || i > 4) return;
  if (SIM.fixed[i]) { simLog('这一条已经改过了，换一条看看'); return; }
  SIM.sel = i;
  simLog('第 ' + (i + 1) + ' 条「<span class="hl">' + c.checks[i].name + '</span>」→ '
    + c.checks[i].act + '：' + c.checks[i].how);
  simDraw();
}

function simFixLine(line) {
  var c = simCase();
  if (SIM.sel === null) { simLog('先点右边一条体检项，再点左边一句'); simDraw(); return; }
  var i = SIM.sel, ck = c.checks[i];
  SIM.fixed[i] = true;
  SIM.changed[line] = true;
  SIM.sel = null;
  simLog('点中第 ' + (line + 1) + ' 句 → 记下一处「<span class="hl">' + ck.act + '</span>」。'
    + '改的是句子，不是错别字。');
  simDraw();
}

function simPick(kind, idx) {
  if (kind === 'c') { simCheck(idx); return; }
  if (SIM.sel === null) { simLog('先点右边一条体检项，再点左边一句'); simDraw(); return; }
  simFixLine(idx);
}

function simDemo() {
  SIM.fixed = [true, true, true, true, true];
  SIM.changed = [true, true, true];
  SIM.sel = null;
  simLog('看老师改这一句：<span class="hl">先自己试一次，再看不迟</span>。五条都落在句子上，一个错别字也没改。');
  simDraw();
}
function simNextCase() {
  SIM.ci = (SIM.ci + 1) % CN_CASES.length;
  SIM.sel = null; SIM.fixed = [false, false, false, false, false]; SIM.changed = [false, false, false];
  simLog('换一篇草稿：<span class="hl">' + simCase().name + '</span>，体检单还是这五条');
  simDraw();
}
function simReset() {
  SIM.sel = null; SIM.fixed = [false, false, false, false, false]; SIM.changed = [false, false, false];
  simLog('重来：草稿还在，打过的勾先收回去');
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

// 1 起意 p2：先「撒」（点卡进素材池）再「收」（点 1 张进主格），另点 3 个想写的词
function bindIdea() {
  var root = document.getElementById('idBox');
  if (!root || root.__bound) return;
  root.__bound = true;
  var cnt = 0;
  function refresh() {
    var pool = root.querySelectorAll('.id-card.in-pool').length;
    var main = root.querySelectorAll('.id-main .id-card').length;
    var words = root.querySelectorAll('.id-word.on').length;
    var out = document.getElementById('idNote');
    if (out) out.innerHTML = '素材池 <b>' + pool + '</b> 张 · 主格 <b>' + main + ' / 1</b> 张 · 想写的词 <b>'
      + words + ' / 3</b>（<b>不判好坏</b>，选哪张都行）';
  }
  root.addEventListener('click', function (e) {
    var card = e.target.closest('.id-card');
    if (card) {
      if (card.closest('.id-wall')) {
        var clone = card.cloneNode(true);
        clone.classList.add('in-pool');
        clone.setAttribute('data-n', card.getAttribute('data-n'));
        root.querySelector('.id-pool').appendChild(clone);
        cnt++;
        var w = document.getElementById('idWhy');
        if (w) w.innerHTML = '撒进素材池了。<b>再点池里的一张卡</b>，把它收进主格当今天的主线——'
          + '构思不能只给一个空输入框，先撒再收才想得出来。';
        refresh();
        return;
      }
      if (card.closest('.id-pool')) {
        var box = root.querySelector('.id-main');
        box.innerHTML = '';
        var c2 = card.cloneNode(true);
        c2.classList.remove('in-pool');
        box.appendChild(c2);
        var w2 = document.getElementById('idWhy');
        if (w2) w2.innerHTML = '主线定了：<b>' + card.textContent.trim() + '</b>。'
          + '日记只写这一件，别写成从早到晚的流水账。再点 3 个「我还要写的词」。';
        refresh();
        return;
      }
      return;
    }
    var word = e.target.closest('.id-word');
    if (word) {
      word.classList.toggle('on');
      var w3 = document.getElementById('idWhy');
      if (w3) w3.innerHTML = '勾了「' + word.textContent.trim() + '」。'
        + '这三个词是等下起草时要用上的，不是好词好句库，也不用抄。';
      refresh();
    }
  });
  refresh();
}

// 2 搭骨架 p3：事件条排序 + 每格功能 + 详略，只回执不判好坏
function bindBone() {
  var root = document.getElementById('boBox');
  if (!root || root.__bound) return;
  root.__bound = true;
  function refresh() {
    var fns = 0;
    root.querySelectorAll('.bo-fn').forEach(function (n) { if (n.value.trim()) fns++; });
    var lv = root.querySelectorAll('.bo-level.on').length;
    var out = document.getElementById('boNote');
    if (out) out.innerHTML = '三格功能 <b>' + fns + ' / 3</b> · 详略 <b>' + lv + ' / 3</b>'
      + '（<b>不判好坏</b>，填不完整也能往下走）';
  }
  root.addEventListener('click', function (e) {
    var up = e.target.closest('.bo-up');
    if (up) {
      var row = up.closest('.bo-row'), prev = row.previousElementSibling;
      if (prev && prev.classList.contains('bo-row')) row.parentNode.insertBefore(row, prev);
      var w = document.getElementById('boWhy');
      if (w) w.innerHTML = '顺序调了一次。三段头一句连起来读一遍；读不通就再调，别一路「然后」到底。';
      return;
    }
    var l = e.target.closest('.bo-level');
    if (l) {
      l.closest('.bo-row').querySelectorAll('.bo-level').forEach(function (n) { n.classList.remove('on'); });
      l.classList.add('on');
      var w2 = document.getElementById('boWhy');
      if (w2) w2.innerHTML = '这段标成「<b>' + l.textContent.trim() + '</b>」。'
        + '详的那段多写几行，略的一段带过——每格都有个任务，才不是流水账。';
      refresh();
    }
  });
  root.querySelectorAll('.bo-fn').forEach(function (n) { n.addEventListener('input', refresh); });
  refresh();
}

// 3 起草 p5：日期天气前置锁定 + 三格输入，只判「写没写」
function bindDiaryDraft() {
  var root = document.getElementById('ddBox');
  if (!root || root.__bound) return;
  root.__bound = true;
  function refresh() {
    var d = document.getElementById('ddDate'), w = document.getElementById('ddWeather');
    var locked = d && w && d.value.trim() && w.value.trim();
    var head = document.getElementById('ddHeadState');
    if (head) head.innerHTML = locked
      ? '<b>格式已定</b>　' + d.value.trim() + '　' + w.value.trim() + '　→ 下面三格随便写，不拦你'
      : '先填日期和天气，把日记的格式定下来；没填也照样能写（不拦路）。';
    var rows = ['ddR1', 'ddR2', 'ddR3'].map(function (id) {
      var el = document.getElementById(id); return el ? el.value.trim() : '';
    });
    var n = rows.filter(Boolean).length;
    var out = document.getElementById('ddNote');
    if (out) out.innerHTML = '三格写了 <b>' + n + ' / 3</b> 行（<b>只判写没写，不判好坏</b>）。'
      + '参考稿要先写再看，这里没有范文。';
    if (rows.some(Boolean)) {
      try {
        localStorage.setItem('cn_write_diary_text', rows.filter(Boolean).join('\n'));
        localStorage.setItem('cn_write_diary_head', (d ? d.value.trim() : '') + '　' + (w ? w.value.trim() : ''));
      } catch (e) { }
    }
  }
  root.addEventListener('input', refresh);
  root.addEventListener('click', function (e) {
    if (e.target.closest('#ddSave')) {
      refresh();
      var st = document.getElementById('ddState');
      if (st) st.textContent = '已记下你写的三格。存进本子不等于写得好，下一页才按体检单改。';
    }
  });
  refresh();
}

// 5 出刊 p8：拼好的全文 + 署名 + 三条自查，只回执
function bindPublish() {
  var root = document.getElementById('pbBox');
  if (!root || root.__bound) return;
  root.__bound = true;
  function paint() {
    var head = '', text = '';
    try {
      head = localStorage.getItem('cn_write_diary_head') || '';
      text = localStorage.getItem('cn_write_diary_text') || '';
    } catch (e) { }
    var box = document.getElementById('pbPage');
    if (box) box.innerHTML = (head ? '<b>' + head.replace(/</g, '&lt;') + '</b><br>' : '')
      + (text ? text.replace(/</g, '&lt;').replace(/\n/g, '<br>')
              : '（还没起草。回到「起草」那一页写三格，它就会出现在这页书上。）');
  }
  root.addEventListener('click', function (e) {
    var ck = e.target.closest('.pb-ck');
    if (ck) {
      ck.classList.toggle('on');
      var k = root.querySelectorAll('.pb-ck.on').length;
      var a = document.getElementById('pbAdvice');
      if (a) a.innerHTML = '自查勾了 <b>' + k + ' / 3</b> 条。'
        + '三条只问「这一段清楚吗」，不问「写得好不好」——<b>勾不满也照样能出刊</b>。';
      return;
    }
    if (e.target.closest('#pbGo')) {
      paint();
      var sign = document.getElementById('pbSign');
      try { localStorage.setItem('cn_write_diary_sign', sign ? sign.value.trim() : ''); } catch (e) { }
      var st = document.getElementById('pbState');
      if (st) st.textContent = '已出刊：这是你的一页书。署名写不写都行，分数没有，排行榜也没有。';
    }
  });
  paint();
}

// 存起来 p10：结算必须显示学生自己写的一页书
function updateMyPage() {
  var el = document.getElementById('myPage');
  if (!el) return;
  var head = '', text = '', sign = '';
  try {
    head = localStorage.getItem('cn_write_diary_head') || '';
    text = localStorage.getItem('cn_write_diary_text') || '';
    sign = localStorage.getItem('cn_write_diary_sign') || '';
  } catch (e) { }
  el.innerHTML = text
    ? '<b>我的一页书</b>　' + (head ? head.replace(/</g, '&lt;') + '　' : '')
      + text.replace(/</g, '&lt;').replace(/\n/g, '／')
      + (sign ? '　—— ' + sign.replace(/</g, '&lt;') : '')
    : '<b>我的一页书</b>　（还没起草。回到「起草」那一页写三格，它就会出现在这里。）';
}

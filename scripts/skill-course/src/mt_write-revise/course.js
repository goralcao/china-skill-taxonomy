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

var CN = {"leftTitle": "旧文（点一句才算改过）", "rightTitle": "体检单（先点一条）", "canvasTitle": "按体检单改：%N%", "readout": "已改 %N% / %T% 处（改的是句子，不是错别字）", "footCount": "已改 %N% / %T% 处", "footNote": "先点右边一条体检项，再点左边一句 —— 不打分，只记改动落在哪句", "logPickCheck": "第 %N% 条「%T%」→ %A%：%H%", "logNeedCheck": "先点右边一条体检项，再点左边一句", "logFixed": "点中第 %N% 句 → 记下一处「%A%」。改的是句子，不是错别字。", "logDup": "这一条已经改过了，换一条看看", "logNext": "换一篇旧文：%N%，体检单还是这五条", "logReset": "重来：草稿还在，打过的勾先收回去", "logDemo": "看老师改这一句：先自己试一次，再看不迟。五条都落在句子上，一个错别字也没改。", "ideaWhy0": "花 <b>10 分钟</b>把 8 张旧文句卡翻一遍：先随便点进素材池，再收 1 张进主格当「我最想删的一句」，最后点 3 个「我还要用的词」。", "ideaNote0": "素材池 0 张 · 主格 0 / 1 张 · 想写的词 0 / 3（不判好坏）", "ideaWhyPool": "撒进素材池了。<b>再点池里的一张卡</b>，把它收进主格当今天的主线——构思不能只给一个空输入框，先撒再收才想得出来。", "ideaWhyMain": "这轮只改这一句：<b>%T%</b>。别想着整篇重写，先敢删一处。再点 3 个「我还要用的词」。", "ideaWhyWord": "勾了「%T%」。这三个词是等下写「改后」要用上的，不是好词好句库，也不用抄。", "ideaNoteFmt": "素材池 <b>%P%</b> 张 · 主格 <b>%M% / 1</b> 张 · 想写的词 <b>%W% / 3</b>（<b>不判好坏</b>，选哪张都行）", "boneWhy0": "每格都填一句「这层要让人知道___」，再点一下详略。三层可以上移调顺序，别一上来就只改错别字。", "boneNote0": "三格功能 0 / 3 · 详略 0 / 3（不判好坏，填不完整也能往下走）", "boneNoteFmt": "三格功能 <b>%N% / 3</b> · 详略 <b>%L% / 3</b>（<b>不判好坏</b>，填不完整也能往下走）", "boneWhyUp": "顺序调了一次。三层连起来读一遍：字词、句子、内容都查到了吗？不通就再调。", "boneWhyLevel": "这段标成「<b>%T%</b>」。句子层多写几行，把删掉哪一句说清楚；字词层带过。", "draftHead0": "先填旧文第几句和打算怎么改，把这一轮定下来；没填也照样能写（不拦路）。", "draftHeadOk": "<b>格式已定</b>　%V%　→ 下面三格随便写，不拦你", "draftNote0": "三格写了 0 / 3 行（只判写没写，不判好坏）。这里没有范文。", "draftNoteFmt": "三格写了 <b>%N% / 3</b> 行（<b>只判写没写，不判好坏</b>）。这里不写新作文，只读旧文改一处。", "draftState": "已记下原句、改后和理由。存进本子不等于改得好，下一页才按体检单核一遍。", "publishAdvice0": "三条只问「这一段清楚吗」，不问「写得好不好」——勾不满也照样能出刊。", "publishAdviceFmt": "自查勾了 <b>%N% / %T%</b> 条。三条只问「这一段清楚吗」，不问「写得好不好」——<b>勾不满也照样能出刊</b>。", "publishState": "已出刊：这是你的一页书。署名写不写都行，分数没有，排行榜也没有。", "publishEmpty": "（还没起草。回到「起草」那一页写三格，它就会出现在这页书上。）", "myLabel": "我改好的一页", "myEmpty": "（还没读旧文。回到「读旧文」那一页写三格，它就会出现在这里。）", "charGrid": false, "replay": false, "cases": [{"name": "放学的伞（旧文）", "lines": ["放学后我回到家，然后放下书包，然后拿出作业本，然后开始写。", "我听见窗外有鸟叫。我跑过去看，什么也没看见。", "我很开心，很好玩。这一天就这样过去了。"], "checks": [{"name": "数「然后」，超过 2 个删 1 个", "act": "删", "line": 0, "color": "#C62828", "how": "点中这句，把多余的「然后」整句划掉，计数减一"}, {"name": "连续两句都「我……」开头", "act": "换", "line": 1, "color": "#2E7D32", "how": "点中第二句，把开头换个说法"}, {"name": "只有动作没有感觉", "act": "增", "line": 1, "color": "#1565C0", "how": "点中该句，插入「我听见 / 我看见」"}, {"name": "三段头一句连起来读不通", "act": "调", "line": 2, "color": "#1565C0", "how": "点中这句，把段序调到读得通"}, {"name": "圈出「很开心」「很好玩」", "act": "换", "line": 2, "color": "#2E7D32", "how": "点中后给一个具体动作，别再用空词"}]}, {"name": "早上的猫（换文）", "lines": ["早上我起床，然后刷牙，然后吃饭，然后背书包出门。", "我看见一只猫。我蹲下来，它一下跑走了。", "今天真好，真高兴。就这样吧。"], "checks": [{"name": "数「然后」，超过 2 个删 1 个", "act": "删", "line": 0, "color": "#C62828", "how": "点中这句，删掉一个「然后」"}, {"name": "连续两句都「我……」开头", "act": "换", "line": 1, "color": "#2E7D32", "how": "点中第二句，换个开头"}, {"name": "只有动作没有感觉", "act": "增", "line": 1, "color": "#1565C0", "how": "点中该句，补一句「我听见 / 我看见」"}, {"name": "三段头一句连起来读不通", "act": "调", "line": 2, "color": "#1565C0", "how": "点中这句，把三段的顺序调一调"}, {"name": "圈出「真好」「真高兴」", "act": "换", "line": 2, "color": "#2E7D32", "how": "点中后换成具体动作"}]}], "colors": {"primary": "#4A4A6B", "accent": "#A6552F", "primarySoft": "#EAE8F1", "accentSoft": "#FBEAD9", "line": "#DDD3BE", "paper": "#FBF8F0", "ink": "#2B2B28", "muted": "#7A7263"}, "lsText": "cn_mt_write_revise_text", "lsHead": "cn_mt_write_revise_head", "lsSign": "cn_mt_write_revise_sign", "checkTotal": 5};
// ===== 写作课「五段」通用仿真与留痕迹互动 =====
// 每课数据由 run_w.py 注入为全局 CN。设计约定（chinese-reading-writing.md）：
// 能给学生看的只有「事实」，不能给的是「判断」；构思不能只给一个输入框；
// 修改必须点中一句才允许打勾，改的是句子不是错别字；错别字不属于「改」；
// 不按字数/好词好句打分，不先发范文。
// 仿真页是「体检单」：点一条清单 → 全文高亮可疑句 → 点中一句才记下一处改动。
// 结构测试契约：simAdd / simDemo / simNextCase / simReset / simBind / SIM.hits / 画布着色。

var SIM = { ci: 0, sel: null, fixed: [], changed: [], hits: [], bound: false };

function simCase() { return CN.cases[SIM.ci]; }
function simCheckTotal() { return CN.checkTotal || simCase().checks.length; }
function simFixedCount() {
  var n = 0;
  for (var i = 0; i < SIM.fixed.length; i++) if (SIM.fixed[i]) n++;
  return n;
}
function simFmt(s, kv) {
  var out = String(s);
  for (var k in kv) if (Object.prototype.hasOwnProperty.call(kv, k))
    out = out.split('%' + k + '%').join(kv[k]);
  return out;
}
function simWrap(t, n) {
  if (t.length <= n) return [t];
  var cut = n;
  // 别把「，。」这类标点单独甩到第二行，往前借一两个字
  while (cut > n - 4 && /^[，。？！、；：]/.test(t.slice(cut))) cut--;
  return [t.slice(0, cut), t.slice(cut)];
}
function simSetReadout() {
  var el = document.getElementById('simReadout');
  if (el) el.textContent = simFmt(CN.readout, { N: simFixedCount(), T: simCheckTotal() });
}

function simDraw() {
  var ctx = simCtx(), C = CN.colors;
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, SIM_W, SIM_H);
  var c = simCase(), n = simCheckTotal();
  SIM.hits = [];

  simTxt(simFmt(CN.canvasTitle, { N: c.name }), 28, 30, 18, C.primary, '700');
  simTxt(CN.leftTitle, 28, 52, 13, C.muted, '700');
  simTxt(CN.rightTitle, 548, 52, 13, C.muted, '700');

  if (CN.charGrid) {
    // 写字课：左边是三个田字格，点一格才算「对过」，绝不给字形打分
    for (var g = 0; g < 3; g++) {
      var gx = 40 + g * 150, gy = 88;
      var done = SIM.changed[g];
      var target = SIM.sel !== null && c.checks[SIM.sel].line === g;
      simBox(gx, gy, 110, 110, done ? '#E8F5E9' : (target ? '#FFF2C9' : '#FFFFFF'),
             done ? '#2E7D32' : (target ? '#E0A93B' : C.line), 6);
      simLine(gx + 55, gy, gx + 55, gy + 110, '#E0A93B', 1, [4, 4]);
      simLine(gx, gy + 55, gx + 110, gy + 55, '#E0A93B', 1, [4, 4]);
      simTxt(c.lines[g], gx + 55, gy + 72, 44, done ? '#2E7D32' : C.ink, '600', 'center');
      simTxt('第 ' + (g + 1) + ' 格' + (done ? '  ✓ 已对' : ''), gx + 55, gy + 132, 12,
             done ? '#2E7D32' : C.muted, '700', 'center');
      SIM.hits.push({ x: gx, y: gy, w: 110, h: 110, kind: 'l', idx: g });
    }
    simTxt('先点右边一条书写规范，再点左边一格 —— 只对照，不说写得好不好', 40, 250, 14, C.ink, '400');
  } else {
    var ys = [66, 146, 226];
    for (var l = 0; l < 3; l++) {
      var target2 = SIM.sel !== null && c.checks[SIM.sel].line === l;
      var done2 = SIM.changed[l];
      simBox(24, ys[l], 496, 62, done2 ? '#E8F5E9' : (target2 ? '#FFF2C9' : '#FFFFFF'),
             done2 ? '#2E7D32' : (target2 ? '#E0A93B' : C.line), 10);
      var ls = simWrap(c.lines[l], 26);
      for (var k = 0; k < ls.length; k++)
        simTxt(ls[k], 38, ys[l] + 25 + k * 22, 15, C.ink, '600');
      simTxt('第 ' + (l + 1) + ' 段' + (done2 ? '  ✓ 已改' : ''), 500, ys[l] + 55, 11,
             done2 ? '#2E7D32' : C.muted, '700', 'right');
      SIM.hits.push({ x: 24, y: ys[l], w: 496, h: 62, kind: 'l', idx: l });
    }
    if (SIM.sel !== null) {
      var t = c.checks[SIM.sel].line;
      simLine(520, ys[t] + 31, 540, 66 + SIM.sel * 46 + 20, '#E0A93B', 1.6, [4, 4]);
    }
  }

  var cy = 66;
  for (var i = 0; i < n; i++) {
    var ck = c.checks[i], on = SIM.sel === i, ok = SIM.fixed[i];
    simBox(540, cy, 316, 40, ok ? '#E8F5E9' : (on ? '#FFF2C9' : '#FFFFFF'),
           ok ? '#2E7D32' : (on ? '#E0A93B' : C.line), 8);
    simDot(558, cy + 20, 7, ok ? '#2E7D32' : ck.color, null);
    simTxt((ok ? '✓ ' : (i + 1) + '. ') + ck.name, 574, cy + 25, 13,
           ok ? '#2E7D32' : '#4A463E', ok ? '700' : '600');
    SIM.hits.push({ x: 540, y: cy, w: 316, h: 40, kind: 'c', idx: i });
    cy += 46;
  }

  simBox(24, 306, 832, 40, C.primarySoft, null, 8);
  simTxt(simFmt(CN.footCount, { N: simFixedCount(), T: n }), 40, 331, 16, C.primary, '700');
  simTxt(SIM.sel !== null
    ? '第 ' + (SIM.sel + 1) + ' 条：' + c.checks[SIM.sel].how
    : CN.footNote, 250, 331, 12, C.ink, '400');
  simSetReadout();
}

function simCheck(i) {
  var c = simCase();
  if (i < 0 || i >= simCheckTotal()) return;
  if (SIM.fixed[i]) { simLog(CN.logDup); return; }
  SIM.sel = i;
  simLog(simFmt(CN.logPickCheck, {
    N: i + 1, T: '<span class="hl">' + c.checks[i].name + '</span>',
    A: c.checks[i].act, H: c.checks[i].how
  }));
  simDraw();
}

function simFixLine(line) {
  var c = simCase();
  if (SIM.sel === null) { simLog(CN.logNeedCheck); simDraw(); return; }
  var i = SIM.sel, ck = c.checks[i];
  SIM.fixed[i] = true;
  SIM.changed[line] = true;
  SIM.sel = null;
  simLog(simFmt(CN.logFixed, { N: line + 1, A: '<span class="hl">' + ck.act + '</span>' }));
  simDraw();
}

// 结构测试入口：与数学 / 阅读 / 语言知识课保持同一签名
// a = 第几条体检项，b = 点中第几句（两步留痕的合成入口）
function simAdd(a, b) {
  if (typeof a !== 'number') a = 0;
  if (typeof b !== 'number') b = 0;
  simCheck(a);
  simFixLine(b);
}

function simPick(kind, idx) {
  if (kind === 'c') { simCheck(idx); return; }
  if (SIM.sel === null) { simLog(CN.logNeedCheck); simDraw(); return; }
  simFixLine(idx);
}

function simDemo() {
  for (var i = 0; i < simCheckTotal(); i++) SIM.fixed[i] = true;
  for (var j = 0; j < 3; j++) SIM.changed[j] = true;
  SIM.sel = null;
  simLog(CN.logDemo);
  simDraw();
}
function simNextCase() {
  SIM.ci = (SIM.ci + 1) % CN.cases.length;
  SIM.sel = null;
  SIM.fixed = []; SIM.changed = [];
  for (var i = 0; i < simCheckTotal(); i++) SIM.fixed[i] = false;
  for (var j = 0; j < 3; j++) SIM.changed[j] = false;
  simLog(simFmt(CN.logNext, { N: simCase().name }));
  simDraw();
}
function simReset() {
  SIM.sel = null;
  SIM.fixed = []; SIM.changed = [];
  for (var i = 0; i < simCheckTotal(); i++) SIM.fixed[i] = false;
  for (var j = 0; j < 3; j++) SIM.changed[j] = false;
  simLog(CN.logReset);
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
  function refresh() {
    var pool = root.querySelectorAll('.id-card.in-pool').length;
    var main = root.querySelectorAll('.id-main .id-card').length;
    var words = root.querySelectorAll('.id-word.on').length;
    var out = document.getElementById('idNote');
    if (out) out.innerHTML = simFmt(CN.ideaNoteFmt, { P: pool, M: main, W: words });
  }
  root.addEventListener('click', function (e) {
    var card = e.target.closest('.id-card');
    if (card) {
      if (card.closest('.id-wall')) {
        var clone = card.cloneNode(true);
        clone.classList.add('in-pool');
        root.querySelector('.id-pool').appendChild(clone);
        var w = document.getElementById('idWhy');
        if (w) w.innerHTML = CN.ideaWhyPool;
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
        if (w2) w2.innerHTML = simFmt(CN.ideaWhyMain, { T: card.textContent.trim() });
        refresh();
        return;
      }
      return;
    }
    var word = e.target.closest('.id-word');
    if (word) {
      word.classList.toggle('on');
      var w3 = document.getElementById('idWhy');
      if (w3) w3.innerHTML = simFmt(CN.ideaWhyWord, { T: word.textContent.trim() });
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
    if (out) out.innerHTML = simFmt(CN.boneNoteFmt, { N: fns, L: lv });
  }
  root.addEventListener('click', function (e) {
    var up = e.target.closest('.bo-up');
    if (up) {
      var row = up.closest('.bo-row'), prev = row.previousElementSibling;
      if (prev && prev.classList.contains('bo-row')) row.parentNode.insertBefore(row, prev);
      var w = document.getElementById('boWhy');
      if (w) w.innerHTML = CN.boneWhyUp;
      return;
    }
    var l = e.target.closest('.bo-level');
    if (l) {
      l.closest('.bo-row').querySelectorAll('.bo-level').forEach(function (n) { n.classList.remove('on'); });
      l.classList.add('on');
      var w2 = document.getElementById('boWhy');
      if (w2) w2.innerHTML = simFmt(CN.boneWhyLevel, { T: l.textContent.trim() });
      refresh();
    }
  });
  root.querySelectorAll('.bo-fn').forEach(function (n) { n.addEventListener('input', refresh); });
  refresh();
}

// 3 起草 p5：格式条前置锁定 + 三格输入，只判「写没写」
function bindDraft() {
  var root = document.getElementById('ddBox');
  if (!root || root.__bound) return;
  root.__bound = true;
  function refresh() {
    var h1 = document.getElementById('ddH1'), h2 = document.getElementById('ddH2');
    var locked = h1 && h2 && h1.value.trim() && h2.value.trim();
    var head = document.getElementById('ddHeadState');
    if (head) head.innerHTML = locked
      ? simFmt(CN.draftHeadOk, { V: h1.value.trim() + '　' + h2.value.trim() })
      : CN.draftHead0;
    var rows = ['ddR1', 'ddR2', 'ddR3'].map(function (id) {
      var el = document.getElementById(id); return el ? el.value.trim() : '';
    });
    var n = rows.filter(Boolean).length;
    var out = document.getElementById('ddNote');
    if (out) out.innerHTML = simFmt(CN.draftNoteFmt, { N: n });
    if (rows.some(Boolean)) {
      try {
        localStorage.setItem(CN.lsText, rows.filter(Boolean).join('\n'));
        localStorage.setItem(CN.lsHead, (h1 ? h1.value.trim() : '') + '　' + (h2 ? h2.value.trim() : ''));
      } catch (e) { }
    }
  }
  root.addEventListener('input', refresh);
  root.addEventListener('click', function (e) {
    if (e.target.closest('#ddSave')) {
      refresh();
      var st = document.getElementById('ddState');
      if (st) st.textContent = CN.draftState;
    }
  });
  refresh();
}

// 4 出刊 p8：拼好的全文 + 署名 + 三条自查，只回执
function bindPublish() {
  var root = document.getElementById('pbBox');
  if (!root || root.__bound) return;
  root.__bound = true;
  function paint() {
    var head = '', text = '';
    try {
      head = localStorage.getItem(CN.lsHead) || '';
      text = localStorage.getItem(CN.lsText) || '';
    } catch (e) { }
    var box = document.getElementById('pbPage');
    if (box) box.innerHTML = (head ? '<b>' + head.replace(/</g, '&lt;') + '</b><br>' : '')
      + (text ? text.replace(/</g, '&lt;').replace(/\n/g, '<br>') : CN.publishEmpty);
  }
  root.addEventListener('click', function (e) {
    var ck = e.target.closest('.pb-ck');
    if (ck) {
      ck.classList.toggle('on');
      var k = root.querySelectorAll('.pb-ck.on').length;
      var a = document.getElementById('pbAdvice');
      if (a) a.innerHTML = simFmt(CN.publishAdviceFmt, { N: k, T: root.querySelectorAll('.pb-ck').length });
      return;
    }
    if (e.target.closest('#pbGo')) {
      paint();
      var sign = document.getElementById('pbSign');
      try { localStorage.setItem(CN.lsSign, sign ? sign.value.trim() : ''); } catch (e) { }
      var st = document.getElementById('pbState');
      if (st) st.textContent = CN.publishState;
    }
  });
  paint();
}

// 5 存起来 p10：结算必须显示学生自己写的一页书
function updateMyPage() {
  var el = document.getElementById('myPage');
  if (!el) return;
  var head = '', text = '', sign = '';
  try {
    head = localStorage.getItem(CN.lsHead) || '';
    text = localStorage.getItem(CN.lsText) || '';
    sign = localStorage.getItem(CN.lsSign) || '';
  } catch (e) { }
  el.innerHTML = text
    ? '<b>' + CN.myLabel + '</b>　' + (head ? head.replace(/</g, '&lt;') + '　' : '')
      + text.replace(/</g, '&lt;').replace(/\n/g, '／')
      + (sign ? '　—— ' + sign.replace(/</g, '&lt;') : '')
    : '<b>' + CN.myLabel + '</b>　' + CN.myEmpty;
}

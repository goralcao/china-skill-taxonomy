/* 前置诊断引擎：纯函数、无 DOM、无依赖。
 *
 * 浏览器里是 window.DiagEngine，Node 里 require() 即可跑测试。
 * 会话对象是可 JSON 序列化的纯数据，刷新页面不丢进度就看它。
 *
 * 这套引擎只做一件事：给定一个目标知识点，沿先修边往回找，判断「他到底从哪一步
 * 开始没学会」。它不判「这个孩子数学好不好」，也不预测分数。
 *
 * 判定规则（三条，全部围绕「一道题说明不了什么」）：
 *   1. 一个点要连续答对 need 题才算掌握（need = min(2, 题库题数)）。只答对一道，
 *      可能只是蒙对。
 *   2. 中途答错，不立刻判不会，而是就这个点再出一道更基础的确认题。
 *       确认题对  → 不稳（shaky）：会，但不牢。不往回追。
 *       确认题也错 → 薄弱（weak）：真不会。这时才向先修回溯。
 *       （一次对一次错更像粗心或不熟；两次都错才足以说明这个点没建立。）
 *   3. 答对就把它所有先修标成「推断掌握」，不再问——省题，但结果页会区分
 *      「直接测得」和「推断得出」。
 *
 * 没有题的知识点标「未测」，不阻塞、不回溯。覆盖率只有 4%，硬要追溯下去
 * 会得到一串「未测」，还不如老实说这里没测。
 */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.DiagEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var DEFAULT_LIMIT = 12;
  var DEFAULT_SEED = 'diag';

  /* ------------------------------------------------------------------ 图 */

  function buildGraph(topics, deps, questions) {
    var byId = Object.create(null);
    var order = Object.create(null);
    topics.forEach(function (t, i) {
      byId[t.id] = t;
      order[t.id] = i;
    });

    var prereqs = Object.create(null);
    var dependents = Object.create(null);
    topics.forEach(function (t) {
      prereqs[t.id] = [];
      dependents[t.id] = [];
    });

    var seen = Object.create(null);
    deps.forEach(function (d) {
      if (!byId[d.topicId] || !byId[d.prerequisiteId]) return;
      var k = d.topicId + '<' + d.prerequisiteId;
      if (seen[k]) return;
      seen[k] = true;
      var strength = d.strength === 'soft' ? 'soft' : 'hard';
      prereqs[d.topicId].push({ id: d.prerequisiteId, strength: strength });
      dependents[d.prerequisiteId].push({ id: d.topicId, strength: strength });
    });

    // hard 在前、soft 在后，同级按 topics.json 的顺序——保证同一个图每次跑结果一致
    function rank(e) {
      return (e.strength === 'hard' ? 0 : 1) * 1e6 + order[e.id];
    }
    Object.keys(prereqs).forEach(function (id) {
      prereqs[id].sort(function (a, b) { return rank(a) - rank(b); });
      dependents[id].sort(function (a, b) { return order[a.id] - order[b.id]; });
    });

    var bank = Object.create(null);
    topics.forEach(function (t) { bank[t.id] = []; });
    (questions || []).forEach(function (q) {
      if (q && bank[q.topicId]) bank[q.topicId].push(q);
    });
    // 先出标准题（概念），确认题再用基础题（计算）；同难度按题号
    var DIFF = { basic: 0, standard: 1, challenge: 2 };
    Object.keys(bank).forEach(function (id) {
      bank[id].sort(function (a, b) {
        var da = DIFF[a.difficulty] == null ? 1 : DIFF[a.difficulty];
        var db = DIFF[b.difficulty] == null ? 1 : DIFF[b.difficulty];
        if (da !== db) return db - da;         // standard 在前
        return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
      });
    });

    return {
      topics: topics, byId: byId, order: order,
      prereqs: prereqs, dependents: dependents, bank: bank,
      _anc: Object.create(null)
    };
  }

  /** 严格祖先（不含自身）。图有环就抛错——环会让回溯永远停不下来。 */
  function ancestors(graph, id) {
    if (graph._anc[id]) return graph._anc[id];
    graph._visiting = graph._visiting || Object.create(null);
    if (graph._visiting[id]) throw new Error('先修图存在环：' + id);
    graph._visiting[id] = true;
    var out = Object.create(null);
    (graph.prereqs[id] || []).forEach(function (p) {
      out[p.id] = true;
      var up = ancestors(graph, p.id);
      Object.keys(up).forEach(function (a) { out[a] = true; });
    });
    graph._visiting[id] = false;
    graph._anc[id] = out;
    return out;
  }

  /** 从目标往上，按拓扑顺序（先修在前）列出全部点。用于展示完整路径。 */
  function ancestorPath(graph, id) {
    var set = ancestors(graph, id);
    var ids = Object.keys(set);
    // 按 topics.json 顺序排，等价于按教材推进顺序
    ids.sort(function (a, b) { return graph.order[a] - graph.order[b]; });
    return ids;
  }

  function needOf(graph, id) {
    var n = (graph.bank[id] || []).length;
    if (!n) return 0;
    return Math.min(2, n);
  }

  /* ------------------------------------------------------------- 出题顺序 */

  // 只要同 seed 同题，选项顺序就一样。用字符串哈希，不依赖 Math.random。
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function seedNum(seed, salt) {
    return hash(String(seed) + '|' + String(salt));
  }

  /** 确定性洗牌（Fisher–Yates + 线性同余）。答案位置不固定，但可复现。 */
  function shuffle(arr, seed) {
    var a = arr.slice();
    var s = seed >>> 0 || 1;
    for (var i = a.length - 1; i > 0; i--) {
      s = (s * 1103515245 + 12345) >>> 0;
      var j = s % (i + 1);
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function present(graph, q, seed) {
    // 每道题按 id 派生的种子洗选项：同一题永远同一个顺序，不同题互不影响
    var out = {
      id: q.id, topicId: q.topicId, type: q.type, prompt: q.prompt,
      answer: q.answer, explanation: q.explanation || '',
      difficulty: q.difficulty || 'standard'
    };
    if (q.type === 'choice') {
      out.choices = shuffle(q.choices || [], seedNum(seed, q.id));
      out.refute = q.refute || null;
    }
    return out;
  }

  /* ------------------------------------------------------------- 会话 */

  function createSession(graph, targets, opts) {
    opts = opts || {};
    var list = (Array.isArray(targets) ? targets : [targets]).filter(function (id) {
      return graph.byId[id];
    });
    if (!list.length) throw new Error('没有可诊断的目标知识点');
    if (graph._visiting) delete graph._visiting;

    var session = {
      version: 1,
      seed: opts.seed || DEFAULT_SEED,
      limit: opts.limit || DEFAULT_LIMIT,
      targets: list,
      stack: list.slice().reverse(),   // 栈尾先出，所以反转后才先问第一个目标
      results: Object.create(null),    // id -> {state, how, reason}
      asked: [],                       // 出过的题
      tries: Object.create(null),      // id -> {right, wrong}
      why: Object.create(null),        // id -> 进入原因
      cursor: null,                    // 当前正在问的点
      cursorQ: null,
      done: false,
      stopReason: ''
    };

    list.forEach(function (id) {
      session.why[id] = { kind: 'target' };
    });

    // 目标没有题，就沿着先修往上找最近的有题的点，明说「改测它」
    var start = pickStart(graph, list);
    session.stack = start.stack;
    session.startNote = start.note;
    return session;
  }

  function pickStart(graph, targets) {
    var usable = targets.filter(function (id) { return needOf(graph, id) > 0; });
    if (usable.length === targets.length) {
      return { stack: usable.slice().reverse(), note: '' };
    }
    // 有目标没题：往上找一层有题的先修
    var stack = [];
    var missing = [];
    targets.forEach(function (id) {
      if (needOf(graph, id) > 0) { stack.push(id); return; }
      missing.push(id);
      var found = [];
      var q = (graph.prereqs[id] || []).slice();
      var guard = 0;
      while (q.length && guard++ < 40) {
        var p = q.shift();
        if (needOf(graph, p.id) > 0) found.push(p.id);
        else q = q.concat(graph.prereqs[p.id] || []);
      }
      if (found.length) stack = stack.concat(found.slice(0, 3));
    });
    return {
      stack: stack.reverse(),
      note: missing.length
        ? '「' + missing.map(function (id) { return graph.byId[id].name; }).join('」「') +
          '」还没有诊断题，改测它依赖的下层知识点。'
        : ''
    };
  }

  function stateOf(session, id) {
    return session.results[id] ? session.results[id].state : null;
  }

  function tried(session, id) {
    return session.tries[id] || { right: 0, wrong: 0 };
  }

  function askedIds(session) {
    var s = Object.create(null);
    session.asked.forEach(function (a) { s[a.qid] = true; });
    return s;
  }

  /** 该点下一道没出过的题；全部出过就返回 null。 */
  function nextQuestionFor(graph, session, id) {
    var bank = graph.bank[id] || [];
    var used = askedIds(session);
    var fresh = bank.filter(function (q) { return !used[q.id]; });
    if (!fresh.length) return null;
    var t = tried(session, id);
    // 第一题：优先 standard（概念）；已经错过一次：优先 basic（更基础）
    if (t.wrong > 0) {
      var easy = fresh.filter(function (q) { return q.difficulty === 'basic'; });
      if (easy.length) return easy[0];
    }
    return fresh[0];
  }

  function nextItem(graph, session) {
    if (session.done) return null;
    if (session.asked.length >= session.limit) {
      session.done = true;
      session.stopReason = 'limit';
      return null;
    }

    var queue = session.stack;
    while (queue.length) {
      var id = queue[queue.length - 1];
      if (stateOf(session, id)) { queue.pop(); continue; }
      var need = needOf(graph, id);
      if (!need) {
        session.results[id] = { state: 'untested', how: 'none', reason: '没有诊断题' };
        queue.pop();
        // 无题的点不往下追：追下去也还是没有题
        continue;
      }
      var q = nextQuestionFor(graph, session, id);
      if (!q) {
        // 题出完了还没判定：按已答对题数定，至少一题才算过
        var t = tried(session, id);
        session.results[id] = t.right > 0 && t.wrong === 0
          ? { state: 'mastered', how: 'direct', reason: '题已出完，答对 ' + t.right + ' 题' }
          : { state: t.wrong > 0 ? 'weak' : 'untested', how: 'direct', reason: '题已出完' };
        queue.pop();
        continue;
      }
      session.cursor = id;
      session.cursorQ = q.id;
      var w = session.why[id] || { kind: 'target' };
      return {
        topicId: id,
        topic: graph.byId[id],
        question: present(graph, q, session.seed),
        attempt: tried(session, id).right + tried(session, id).wrong + 1,
        need: need,
        why: w,
        index: session.asked.length + 1,
        limit: session.limit
      };
    }

    session.done = true;
    if (!session.stopReason) session.stopReason = 'exhausted';
    return null;
  }

  /** verdict: 'right' | 'wrong' | 'skip'（不会）。返回新的 session，不修改入参。 */
  function applyAnswer(graph, session, verdict, payload) {
    var s = JSON.parse(JSON.stringify(session));
    var id = s.cursor;
    if (!id || !s.cursorQ) return s;

    s.tries[id] = s.tries[id] || { right: 0, wrong: 0 };
    var ok = verdict === 'right';
    if (ok) s.tries[id].right += 1; else s.tries[id].wrong += 1;

    s.asked.push({
      qid: s.cursorQ, topicId: id, verdict: ok ? 'right' : (verdict === 'skip' ? 'skip' : 'wrong'),
      answer: payload && payload.answer != null ? payload.answer : ''
    });

    var t = s.tries[id];
    var need = needOf(graph, id);

    if (ok) {
      if (t.wrong === 0 && t.right >= need) {
        // 一道没错、连对满额：掌握
        s.results[id] = { state: 'mastered', how: 'direct', reason: '连续答对 ' + t.right + ' 题' };
        inferAncestors(graph, s, id);
      } else if (t.wrong > 0) {
        // 错过一次又答对：会，但不牢。不追问，也不往回追
        s.results[id] = { state: 'shaky', how: 'direct', reason: '一题对一题错' };
      }
      // 其余情况（没错过但还没连对满额）：留在栈顶继续问
    } else if (t.wrong >= 2) {
      s.results[id] = { state: 'weak', how: 'direct', reason: '两道题都没过' };
      pushPrereqs(graph, s, id);
    } else if (!nextQuestionFor(graph, s, id)) {
      // 只有一道题，错了就没法确认——保守判薄弱
      s.results[id] = { state: 'weak', how: 'direct', reason: '唯一一道题没过' };
      pushPrereqs(graph, s, id);
    }
    // 剩下一错、还有题：留在栈顶，下一轮出确认题

    if (s.results[id]) {
      s.stack = s.stack.filter(function (x) { return x !== id || !s.results[x]; });
    }
    s.cursor = null;
    s.cursorQ = null;
    return s;
  }

  function inferAncestors(graph, s, id) {
    Object.keys(ancestors(graph, id)).forEach(function (a) {
      if (s.results[a] && s.results[a].how === 'direct') return;
      s.results[a] = { state: 'mastered', how: 'inferred', reason: '由「' + graph.byId[id].name + '」推断' };
    });
  }

  function pushPrereqs(graph, s, id) {
    var label = graph.byId[id].name;
    var ps = graph.prereqs[id] || [];
    // 逆序压栈：prereqs 已按 hard 在前排好，逆着压进去，栈尾才是第一个 hard 先修
    for (var i = ps.length - 1; i >= 0; i--) {
      var p = ps[i];
      if (s.results[p.id]) continue;
      if (needOf(graph, p.id) === 0) {
        s.results[p.id] = { state: 'untested', how: 'none', reason: '没有诊断题' };
        continue;
      }
      if (s.stack.indexOf(p.id) >= 0) continue;
      s.stack.push(p.id);
      s.why[p.id] = { kind: 'backtrack', from: id, fromName: label, strength: p.strength };
    }
  }

  /* ------------------------------------------------------------- 汇总 */

  var ORDER = { weak: 0, shaky: 1, untested: 2, mastered: 3 };

  function summarize(graph, session) {
    var ids = Object.keys(session.results);
    var byState = { mastered: [], shaky: [], weak: [], untested: [] };
    ids.forEach(function (id) {
      var r = session.results[id];
      if (byState[r.state]) byState[r.state].push(id);
    });

    // 根因 = 判了薄弱，但它的先修里没有别的薄弱点。也就是说：往回追到这里就断了。
    // 先在硬先修链上找——硬先修断了，说明这条线确实堵在这儿；
    // 硬链上找不到（薄弱的都是顺着软边追下来的），再放宽到全部先修。
    function noWeakBelow(id, hardOnly) {
      return !(graph.prereqs[id] || []).some(function (p) {
        if (hardOnly && p.strength !== 'hard') return false;
        return stateOf(session, p.id) === 'weak';
      });
    }
    var roots = byState.weak.filter(function (id) { return noWeakBelow(id, true); });
    if (!roots.length) roots = byState.weak.filter(function (id) { return noWeakBelow(id, false); });
    // 根因排不稳的先修里若还有未测的，说明这条线索没查完
    var openEnds = roots.filter(function (id) {
      return (graph.prereqs[id] || []).some(function (p) {
        return !session.results[p.id];
      });
    });

    var sortByOrder = function (a, b) { return graph.order[a] - graph.order[b]; };
    var path = byState.weak.concat(byState.shaky);
    path.sort(function (a, b) {
      var ga = graph.byId[a].gradeRangeStart || 0;
      var gb = graph.byId[b].gradeRangeStart || 0;
      if (ga !== gb) return ga - gb;
      return sortByOrder(a, b);
    });

    // 目标的上游里从没被测到的点（不是"没有题"，是"这轮没轮到"）
    var untouched = [];
    session.targets.forEach(function (tid) {
      ancestorPath(graph, tid).forEach(function (id) {
        if (!session.results[id]) untouched.push(id);
      });
    });

    return {
      targets: session.targets,
      mastered: byState.mastered.sort(sortByOrder),
      masteredDirect: byState.mastered.filter(function (id) { return session.results[id].how === 'direct'; }).sort(sortByOrder),
      shaky: byState.shaky.sort(sortByOrder),
      weak: byState.weak.sort(sortByOrder),
      untested: byState.untested.sort(sortByOrder),
      roots: roots.sort(sortByOrder),
      openEnds: openEnds,
      path: path,
      untouched: untouched,
      askedCount: session.asked.length,
      stopReason: session.stopReason || (session.done ? 'exhausted' : ''),
      startNote: session.startNote || ''
    };
  }

  return {
    buildGraph: buildGraph,
    createSession: createSession,
    nextItem: nextItem,
    applyAnswer: applyAnswer,
    summarize: summarize,
    ancestors: ancestors,
    ancestorPath: ancestorPath,
    needOf: needOf,
    stateOf: stateOf,
    hash: hash
  };
});

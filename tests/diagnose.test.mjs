/* 诊断引擎的规则测试：每条判定都对应一个「学生实际长什么样」的场景。
 * 跑法：node tests/diagnose.test.mjs
 */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const E = require('../templates/diagnose.js');

/* ------------------------------------------------------------ 造一张小图
 *
 *   a（1 年级，2 题）──hard──> b（2 年级，2 题）──hard──> c（3 年级，2 题）
 *   z（1 年级，0 题）──hard──> c
 *   s（1 年级，2 题）──soft──> c
 */
const topics = [
  { id: 'a', name: '甲', gradeRangeStart: 1, gradeRangeEnd: 1 },
  { id: 'b', name: '乙', gradeRangeStart: 2, gradeRangeEnd: 2 },
  { id: 'c', name: '丙', gradeRangeStart: 3, gradeRangeEnd: 3 },
  { id: 'z', name: '无题点', gradeRangeStart: 1, gradeRangeEnd: 1 },
  { id: 's', name: '软先修', gradeRangeStart: 1, gradeRangeEnd: 1 }
];
const deps = [
  { topicId: 'b', prerequisiteId: 'a', strength: 'hard' },
  { topicId: 'c', prerequisiteId: 'b', strength: 'hard' },
  { topicId: 'c', prerequisiteId: 'z', strength: 'hard' },
  { topicId: 'c', prerequisiteId: 's', strength: 'soft' }
];
function q(tid, n, diff) {
  return {
    id: tid + '_q' + n, topicId: tid, type: 'numeric',
    difficulty: diff || 'standard', prompt: tid + ' 第 ' + n + ' 题', answer: '1'
  };
}
const questions = [
  q('a', 1, 'standard'), q('a', 2, 'basic'),
  q('b', 1, 'standard'), q('b', 2, 'basic'),
  q('c', 1, 'standard'), q('c', 2, 'basic'),
  q('s', 1, 'standard'), q('s', 2, 'basic')
];
const G = E.buildGraph(topics, deps, questions);

let pass = 0;
function ok(name, fn) {
  try {
    fn();
    pass++;
    console.log('  ✓ ' + name);
  } catch (e) {
    console.log('  ✗ ' + name);
    throw e;
  }
}

/** 按脚本答题：script 里每项是 'right' | 'wrong'，答完后返回 {session, items} */
function run(target, script, opts) {
  let s = E.createSession(G, target, opts);
  const items = [];
  for (let i = 0; i < script.length; i++) {
    const it = E.nextItem(G, s);
    if (!it) break;
    items.push(it);
    s = E.applyAnswer(G, s, script[i]);
  }
  return { session: s, items };
}

console.log('图与顺序');
ok('先修按 hard 优先、soft 在后', () => {
  const order = G.prereqs.c.map(p => p.id + ':' + p.strength);
  assert.deepEqual(order, ['b:hard', 'z:hard', 's:soft']);
});
ok('祖先集合包含跨层节点', () => {
  assert.deepEqual(Object.keys(E.ancestors(G, 'c')).sort(), ['a', 'b', 's', 'z']);
});
ok('有环要报错，不能死循环', () => {
  const g2 = E.buildGraph(topics, deps.concat([{ topicId: 'a', prerequisiteId: 'c', strength: 'hard' }]), questions);
  assert.throws(() => E.ancestors(g2, 'c'), /环/);
});

console.log('掌握判定');
ok('连续答对 2 题才算掌握', () => {
  const { session } = run('b', ['right']);
  assert.equal(E.stateOf(session, 'b'), null, '只答对一题不应判掌握');
});
ok('答对满额判掌握，并推断祖先掌握', () => {
  const { session } = run('b', ['right', 'right']);
  assert.equal(session.results.b.state, 'mastered');
  assert.equal(session.results.b.how, 'direct');
  assert.equal(session.results.a.state, 'mastered');
  assert.equal(session.results.a.how, 'inferred', '祖先应是推断掌握');
});
ok('推断得到的祖先不会被当成直接测过', () => {
  const { session } = run('b', ['right', 'right']);
  const sum = E.summarize(G, session);
  assert.deepEqual(sum.masteredDirect, ['b']);
});

console.log('两颗都错才回溯');
ok('一错一对 → 不稳，不往回追', () => {
  const { session, items } = run('c', ['wrong', 'right']);
  assert.equal(items.length, 2);
  assert.equal(items[1].topicId, 'c', '第二题应该还在原点做确认');
  assert.equal(session.results.c.state, 'shaky');
  assert.equal(session.results.b, undefined, '不稳不应触发回溯');
});
ok('两错 → 薄弱，向先修回溯', () => {
  const { session, items } = run('c', ['wrong', 'wrong', 'wrong', 'wrong']);
  assert.equal(session.results.c.state, 'weak');
  assert.equal(items[2].topicId, 'b', '应回溯到第一个 hard 先修');
  assert.equal(items[2].why.kind, 'backtrack');
  assert.equal(items[2].why.from, 'c');
});
ok('确认题优先出更基础的那道', () => {
  const { items } = run('c', ['wrong', 'right']);
  assert.equal(items[1].question.difficulty, 'basic');
});
ok('只有一道题的点，错了直接判薄弱', () => {
  const g3 = E.buildGraph(topics, deps, [q('a', 1), q('c', 1)]);
  let s = E.createSession(g3, 'a');
  E.nextItem(g3, s);            // 必须先出题，applyAnswer 才知道在答哪一道
  s = E.applyAnswer(g3, s, 'wrong');
  assert.equal(s.results.a.state, 'weak');
});

console.log('没有题的点不阻塞');
ok('先修没题时标未测，其余照常往下走', () => {
  const { session, items } = run('c', ['wrong', 'wrong', 'wrong', 'right', 'right']);
  assert.equal(session.results.z.state, 'untested');
  assert.ok(items.every(it => it.topicId !== 'z'), '无题的点不该出题');
});
ok('目标本身没题时改测下层，并说明原因', () => {
  const g4 = E.buildGraph(topics, deps, [q('a', 1), q('a', 2)]);
  const s = E.createSession(g4, 'c');
  assert.match(s.startNote, /还没有诊断题/);
  const it = E.nextItem(g4, s);
  assert.equal(it.topicId, 'a');
});

console.log('结果汇总');
ok('根因是回溯链的末端', () => {
  const { session } = run('c', ['wrong', 'wrong', 'wrong', 'wrong', 'wrong', 'wrong']);
  const sum = E.summarize(G, session);
  assert.deepEqual(sum.weak, ['a', 'b', 'c']);
  assert.deepEqual(sum.roots, ['a'], '只有最底层那个才是根因');
});
ok('学习路径按年级从低到高', () => {
  const { session } = run('c', ['wrong', 'wrong', 'wrong', 'wrong']);
  const sum = E.summarize(G, session);
  const gs = sum.path.map(id => G.byId[id].gradeRangeStart);
  assert.deepEqual(gs, gs.slice().sort((x, y) => x - y));
});
ok('没轮到的上游点列进 untouched，不冒充已掌握', () => {
  const { session } = run('c', ['wrong', 'wrong', 'wrong', 'wrong']);
  const sum = E.summarize(G, session);
  assert.ok(sum.untouched.includes('s'), '软先修没测过，要如实列出');
});

console.log('题量与可复现');
ok('达到上限就停，stopReason 记 limit', () => {
  const { session } = run('c', ['wrong', 'wrong', 'wrong', 'wrong', 'wrong', 'wrong'], { limit: 3 });
  assert.equal(session.asked.length, 3);
  assert.equal(session.stopReason, 'limit');
});
ok('同 seed 出的题和选项顺序一致', () => {
  const a = run('c', ['wrong', 'right'], { seed: 'x' });
  const b = run('c', ['wrong', 'right'], { seed: 'x' });
  assert.deepEqual(a.items.map(i => i.question.id), b.items.map(i => i.question.id));
  assert.deepEqual(a.items[0].question.choices, b.items[0].question.choices);
});
ok('applyAnswer 不改入参', () => {
  let s = E.createSession(G, 'b');
  const before = JSON.stringify(s);
  E.applyAnswer(G, s, 'right');
  assert.equal(JSON.stringify(s), before);
});

console.log('\n' + pass + ' 项通过');

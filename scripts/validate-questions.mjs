#!/usr/bin/env node
/**
 * 诊断题库校验：题目能不能真的拿来判分。
 *
 * 用法：node scripts/validate-questions.mjs
 * 退出码：0 = 通过（允许警告），1 = 有阻断项
 *
 * 题库是从课件里抽出来的（scripts/build-questions.py），所以这里查的不是「题出得好不好」，
 * 而是「抽得对不对」：题干有没有残留标签、答案在不在选项里、有没有两题一模一样、
 * 源位置还在不在。题出得好不好只有一线教师能判。
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const QPATH = path.join(ROOT, 'data/questions.json');
const MAX_PROMPT = 220;
const MIN_PROMPT = 6;

const fails = [];
const warns = [];
const fail = (id, msg) => fails.push(`[fail] ${id}: ${msg}`);
const warn = (id, msg) => warns.push(`[warn] ${id}: ${msg}`);

if (!fs.existsSync(QPATH)) {
  console.error('读不到 data/questions.json，先跑 python3 scripts/build-questions.py');
  process.exit(1);
}

let topics = [];
try {
  topics = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/topics.json'), 'utf8')).topics;
} catch (e) {
  console.error('读不到 data/topics.json，先跑 python3 scripts/build.py');
  process.exit(1);
}
const topicById = new Map(topics.map(t => [t.id, t]));

const bank = JSON.parse(fs.readFileSync(QPATH, 'utf8'));
const qs = bank.questions || [];
const seenId = new Set();
const seenPrompt = new Map();
const perTopic = new Map();

for (const q of qs) {
  const id = q.id || '(无 id)';

  // 1. id 唯一
  if (!q.id) fail(id, '缺 id');
  else if (seenId.has(q.id)) fail(id, 'id 重复');
  else seenId.add(q.id);

  // 2. 挂靠的主题存在
  if (!q.topicId) fail(id, '缺 topicId');
  else if (!topicById.has(q.topicId)) fail(id, `topicId ${q.topicId} 不在图谱里`);
  else perTopic.set(q.topicId, (perTopic.get(q.topicId) || 0) + 1);

  // 3. 题干：非空、长度合理、没有残留标签
  const prompt = String(q.prompt || '');
  if (!prompt.trim()) fail(id, '题干为空');
  else {
    if (prompt.length < MIN_PROMPT) warn(id, `题干只有 ${prompt.length} 字，可能脱离课件后读不懂`);
    if (prompt.length > MAX_PROMPT) warn(id, `题干 ${prompt.length} 字，偏长`);
    if (/<[a-zA-Z/][^>]*>/.test(prompt)) fail(id, '题干残留 HTML 标签');
    if (/&[a-z]+;|&#\d+;/.test(prompt)) fail(id, '题干残留 HTML 实体');
  }

  // 4. 题型与答案
  if (!['choice', 'numeric'].includes(q.type)) fail(id, `未知题型 ${q.type}`);
  if (q.answer === undefined || q.answer === null || q.answer === '') fail(id, '缺答案');

  if (q.type === 'choice') {
    const opts = q.choices || [];
    if (opts.length < 2) fail(id, `只有 ${opts.length} 个选项`);
    if (opts.length > 6) warn(id, `${opts.length} 个选项，偏多`);
    if (!opts.includes(q.answer)) fail(id, `答案「${q.answer}」不在选项里`);
    if (new Set(opts).size !== opts.length) fail(id, '选项有重复');
    // 错项要能说出为什么错，否则答错只得到一句「不对」
    if (q.refute) {
      const missing = opts.filter(o => o !== q.answer && !q.refute[o]);
      if (missing.length) warn(id, `${missing.length} 个错项没有「为什么错」`);
      const extra = Object.keys(q.refute).filter(k => !opts.includes(k));
      if (extra.length) fail(id, `refute 里的「${extra[0]}」不是选项`);
    }
  } else if (q.type === 'numeric') {
    if (!/^-?\d+(\.\d+)?$/.test(String(q.answer))) {
      warn(id, `数值题答案「${q.answer}」不是纯数字，判分要按文本比对`);
    }
    if (/[（(]只填数字/.test(prompt)) {
      // 提示语本身就要求只填数字，正常
    }
  }

  // 5. 同一句话不能挂在两个点上（抽题时按主题去重，这里再兜一次）
  if (prompt) {
    const prev = seenPrompt.get(prompt);
    if (prev && prev !== q.topicId) fail(id, `题干与 ${prev} 下的题重复`);
    else seenPrompt.set(prompt, q.topicId);
  }

  // 6. 出处可追溯
  if (!q.origin) warn(id, '缺 origin，改课件后无从对照');
  else {
    const src = q.origin.split('#')[0];
    if (!fs.existsSync(path.join(ROOT, src))) fail(id, `origin 指向的文件不存在：${src}`);
  }
}

// 7. 每点题数：1 题的点判掌握偏松，2 题以上才谈得上「连续答对」
let thin = 0;
for (const [tid, n] of perTopic) {
  if (n < 2) { thin++; warn(tid, `只有 ${n} 道题，答对一次就判掌握，偏松`); }
  if (n > 6) warn(tid, `${n} 道题，超出诊断用量`);
}

const covered = perTopic.size;
const pct = (covered / topics.length * 100).toFixed(1);
console.log(`题库校验：${qs.length} 题 · 覆盖 ${covered} / ${topics.length} 个主题（${pct}%）` +
  (thin ? ` · 其中 ${thin} 个点只有 1 题` : ''));

for (const w of warns.slice(0, 30)) console.log(w);
if (warns.length > 30) console.log(`… 另有 ${warns.length - 30} 项警告`);

if (fails.length) {
  for (const f of fails.slice(0, 40)) console.log(f);
  if (fails.length > 40) console.log(`… 另有 ${fails.length - 40} 项`);
  console.log(`\n${fails.length} 项阻断，${warns.length} 项警告`);
  process.exit(1);
}
console.log(`\n全部通过（${warns.length} 项警告）`);

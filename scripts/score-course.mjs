#!/usr/bin/env node
/**
 * 课件「教学合理性」评分。
 *
 * validate-courses.mjs 管的是「有没有写对」——字段、字数、外链、题目数。
 * 这个脚本管的是「写得合不合理」——有没有分步揭示、答错有没有解释、
 * 和图谱接上没有、文案是不是空话。
 *
 * 用法：
 *   node scripts/score-course.mjs                 # 全部课件打分
 *   node scripts/score-course.mjs mt_mult-1digit  # 只打一个（支持前缀）
 *   node scripts/score-course.mjs --json          # 机器可读
 *   node scripts/score-course.mjs --min 70        # 有课件低于 70 分则退出码 1
 *
 * 评分不是考试，是体检表：每一项都给出扣分理由，照着改就行。
 * 手写页面（没有 content.json）只打能打的维度，其余显示「—」，不参与总分。
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const jsonOut = args.includes('--json');
const minIdx = args.indexOf('--min');
const MIN = minIdx >= 0 ? Number(args[minIdx + 1]) : 0;
const only = args.find(a => !a.startsWith('--') && a !== String(MIN));

const DIMS = [
  { key: 'action', name: '认知动作', short: '动作', max: 10 },
  { key: 'reveal', name: '分步揭示', short: '揭示', max: 15 },
  { key: 'feedback', name: '概念反馈', short: '反馈', max: 15 },
  { key: 'pitfall', name: '迷思覆盖', short: '迷思', max: 10 },
  { key: 'graph', name: '图谱挂接', short: '图谱', max: 15 },
  { key: 'assess', name: '形成性评价', short: '评价', max: 10 },
  { key: 'pace', name: '节奏', short: '节奏', max: 5 },
  { key: 'single', name: '单文件', short: '单文', max: 10 },
  { key: 'hook', name: '开场衔接', short: '开场', max: 5 },
  { key: 'copy', name: '文案', short: '文案', max: 5 },
];

const ACTIONS = ['比较', '分解', '变换', '逼近', '累积', '模拟', '构造', '辨析', '构思'];
const VISUAL = ['vertical', 'geometry', 'numberline', 'clock', 'sim', 'coords'];
const BANNED = ['本节课', '我们一起来', '让我们一起', '众所周知', '同学们'];

const readJSON = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const topics = readJSON(path.join(ROOT, 'data/topics.json')).topics;
const topicById = new Map(topics.map(t => [t.id, t]));
const edges = readJSON(path.join(ROOT, 'data/dependencies.json')).dependencies;
const hasEdge = (from, to) => edges.some(e => e.prerequisiteId === from && e.topicId === to);

function scoreCourse(dir) {
  const meta = readJSON(path.join(ROOT, 'courses', dir, 'meta.json'));
  const contentPath = path.join(ROOT, 'courses', dir, 'content.json');
  const engine = fs.existsSync(contentPath);
  const content = engine ? readJSON(contentPath) : null;
  const steps = (content && content.steps) || [];
  const topic = topicById.get(meta.topicId);
  const dims = {};
  const put = (key, score, note) => {
    dims[key] = { score: score === null ? null : Math.round(score), note };
  };

  // 1. 认知动作：一节课只承载一个
  const act = meta.cognitiveAction;
  if (ACTIONS.includes(act)) put('action', 10, `认知动作：${act}`);
  else if (!act) put('action', 0, '没声明 cognitiveAction，说不清这节课让学生做什么');
  else put('action', 0, `cognitiveAction「${act}」不在白名单`);

  if (!engine) {
    for (const k of ['reveal', 'feedback', 'pitfall', 'assess']) {
      put(k, null, '手写页面没有 content.json，这一维打不了分（可迁移到引擎）');
    }
  } else {
    // 2. 分步揭示：可视化步骤能不能一步一步演
    const visual = steps.filter(s => VISUAL.includes(s.type));
    if (!visual.length) {
      put('reveal', 15, '没有可视化步骤，这一维不扣分');
    } else {
      // 分数图的分步就是「一份一份涂」，页面已经静态给出目标份数，
      // 再演示一遍反而会涂到满格，所以 demo:false 在这里不算缺陷。
      const demoed = visual.filter(s =>
        s.demo !== false || (s.shape && s.shape.preset === 'fraction'));
      const ratio = demoed.length / visual.length;
      put('reveal', ratio * 15, ratio === 1
        ? `${demoed.length} 个可视化步骤都能分步演`
        : `${visual.length - demoed.length} 个可视化步骤关了演示（demo:false）`);
    }

    // 3. 概念反馈：错项有没有说清「错在哪」
    // 语文表达类没有对错题，这一维改看「有没有解释性文案」——易错点、参照稿、旁批
    const isLang = meta.subject === '语文' || (content && content.subject === '语文');
    // 拼音题和典故的「想一想」也是选择题，只是选项藏在 body 里
    const choices = steps.filter(s => {
      if (s.type === 'choice') return true;
      if (s.type === 'pinyin' || s.type === 'story') {
        const b = s.body || s;
        return Array.isArray(b.options) && b.options.length > 1;
      }
      return false;
    });
    const quizzes = steps.filter(s => s.type === 'quiz');
    const qTotal = choices.length + quizzes.length;
    if (!qTotal && isLang) {
      const explained = steps.filter(s => s.note || (s.body && (s.body.after || s.body.sampleNote))).length;
      put('feedback', explained ? 12 : 0, explained
        ? `${explained} 个环节带解释文案（无对错题，反馈不走判分）`
        : '既没有对错题，也没有任何解释文案，学生错了也不知道错在哪');
    } else if (!qTotal) {
      put('feedback', 0, '没有检测题，也就没有反馈');
    } else {
      let got = 0;
      let bare = 0;
      for (const s of choices) {
        const b = s.body || s;
        const opts = b.options || [];
        const ans = b.answer !== undefined ? b.answer : s.answer;
        const mc = b.misconception || s.misconception || {};
        const wrong = opts.filter(o => o !== ans);
        const covered = wrong.filter(o => mc[o]).length;
        got += wrong.length ? covered / wrong.length : 0;
        if (covered < wrong.length) bare++;
      }
      for (const s of quizzes) {
        got += s.why ? 1 : 0;
        if (!s.why) bare++;
      }
      put('feedback', (got / qTotal) * 15, bare
        ? `${bare} 道题答错时只显示对错，没解释原因`
        : '每道题答错都有解释');
    }

    // 4. 迷思覆盖：至少指出一个「最容易错的地方」
    const flat = JSON.stringify(steps);
    const hasWarn = /"warn":true/.test(flat);
    const hasPitfall = /错|漏|误|别把|坑/.test(flat);
    if (hasWarn) put('pitfall', 10, '有明确标注的易错点');
    else if (hasPitfall) put('pitfall', 6, '提到了易错，但没标 warn:true');
    else put('pitfall', 0, '整节课没指出一个易错点');
  }

  // 5. 图谱挂接：前置、后续、课标都要能对上
  let graph = 0;
  const pre = meta.prerequisites || [];
  const preBad = pre.filter(id => !hasEdge(id, meta.topicId));
  const preExpected = edges.filter(e => e.topicId === meta.topicId).length;
  if (!preExpected) graph += 5;
  else if (!pre.length) graph += 0;
  else graph += 5 * ((pre.length - preBad.length) / pre.length);

  const next = meta.next || [];
  const nextBad = next.filter(id => !hasEdge(meta.topicId, id));
  const nextExpected = edges.filter(e => e.prerequisiteId === meta.topicId).length;
  if (!nextExpected) graph += 5;
  else if (!next.length) graph += 0;
  else graph += 5 * ((next.length - nextBad.length) / next.length);

  const own = new Set((topic && topic.standards) || []);
  const stdOk = (meta.standards || []).length && (meta.standards || []).every(s => own.has(s));
  graph += stdOk ? 5 : 0;

  const gNotes = [];
  if (preBad.length) gNotes.push(`前置 ${preBad.join('、')} 不在图谱的入边里`);
  if (preExpected && !pre.length) gNotes.push('前置空着，但图谱里有入边');
  if (nextBad.length) gNotes.push(`后续 ${nextBad.join('、')} 不在图谱的出边里`);
  if (nextExpected && !next.length) gNotes.push('后续空着，但图谱里有出边');
  if (!stdOk) gNotes.push('课标编号缺失或不属于该主题');
  put('graph', graph, gNotes.length ? gNotes.join('；') : '前置/后续/课标都对得上');

  // 6. 形成性评价：至少两道，才看得出会不会
  if (!engine) {
    put('assess', null, '手写页面：题目数未知');
  } else {
    // 语文的「留下痕迹」环节（圈画/动笔/自评）与检测题同权
    const HOME = ['quiz', 'choice', 'annotate', 'draft', 'rubric', 'predict', 'poemNote', 'senses', 'checkup',
      'pinyin', 'story', 'readAloud', 'writeChar'];
    const qTotal = steps.filter(s => HOME.includes(s.type)).length;
    if (qTotal >= 2) put('assess', 10, `${qTotal} 个可验证环节`);
    else if (qTotal === 1) put('assess', 5, '只有 1 个可验证环节，看不出是否真会');
    else put('assess', 0, '没有可验证环节');
  }

  // 7. 节奏：一次交互 2~7 分钟（drill 1~4），整节 8~20 分钟
  const per = meta.duration && meta.interactions ? meta.duration / meta.interactions : 0;
  const lo = meta.template === 'drill' ? 1 : 2;
  const hi = meta.template === 'drill' ? 4 : 7;
  const paceOk = per >= lo && per <= hi && meta.duration >= 8 && meta.duration <= 20;
  put('pace', paceOk ? 5 : 0,
    `${meta.duration} 分钟 / ${meta.interactions} 次交互${paceOk ? '' : '，节奏失衡'}`);

  // 8. 单文件：产物不外链、不超 300KB
  const distPath = path.join(ROOT, 'viz/courses', dir, 'index.html');
  if (!fs.existsSync(distPath)) {
    put('single', 0, '还没构建出 dist（先跑 python3 scripts/build.py）');
  } else {
    const html = fs.readFileSync(distPath, 'utf8');
    const kb = Math.round(Buffer.byteLength(html) / 1024);
    if (/<script[^>]+src=|<link[^>]+href=/.test(html)) put('single', 0, '产物里有外链');
    else if (kb > 300) put('single', 0, `产物 ${kb}KB，超过 300KB`);
    else if (kb > 200) put('single', 7, `产物 ${kb}KB，偏大`);
    else put('single', 10, `产物 ${kb}KB，单文件`);
  }

  // 9. 开场衔接：第一屏是不是具体问题，有没有顺手检查前置
  if (!engine) {
    put('hook', null, '手写页面：开场结构未知');
  } else {
    const first = steps[0] || {};
    const head = (first.title || '') + (first.lead || '');
    const concrete = /\d|[？?]/.test(head);
    const pretest = steps.slice(0, 3).some(s => s.type === 'quiz' || s.type === 'choice');
    if (pretest && concrete) put('hook', 5, '开场是具体问题，前三步内有前测');
    else if (concrete) put('hook', 3, '开场具体，但没有前测（前置够不够不知道）');
    else if (/(就是|是|叫做)/.test(head)) put('hook', 2, '开场先给结论，学生没有需要解决的问题');
    else put('hook', 0, '开场是套话，学生不知道今天要解决什么');
  }

  // 10. 文案：标题具体，不说套话
  const flatAll = JSON.stringify(content || meta);
  const titled = steps.filter(s => s.title && s.title.trim());
  const badTitle = steps.filter(s => s.title && s.title.length > 26);
  const bannedHit = BANNED.filter(w => flatAll.includes(w));
  let copy = 5;
  if (engine && titled.length / Math.max(1, steps.length) < 0.8) copy -= 2;
  copy -= Math.min(2, badTitle.length);
  copy -= Math.min(2, bannedHit.length);
  const cNotes = [];
  if (bannedHit.length) cNotes.push(`出现套话：${bannedHit.join('、')}`);
  if (badTitle.length) cNotes.push(`${badTitle.length} 个标题超过 26 字`);
  put('copy', copy, cNotes.length ? cNotes.join('；') : '标题具体，没有套话');

  if (!engine) {
    return { dir, topicId: meta.topicId, title: meta.title, status: meta.status, engine, dims, total: null };
  }
  const scored = DIMS.filter(d => dims[d.key].score !== null);
  const raw = scored.reduce((n, d) => n + dims[d.key].score, 0);
  const max = scored.reduce((n, d) => n + d.max, 0);
  return {
    dir,
    topicId: meta.topicId,
    title: meta.title,
    status: meta.status,
    engine,
    dims,
    total: Math.round((raw / max) * 100),
  };
}

const dirs = fs.readdirSync(path.join(ROOT, 'courses'))
  .filter(d => fs.existsSync(path.join(ROOT, 'courses', d, 'meta.json')))
  .filter(d => !only || d === only || d.includes(only))
  .sort();

const results = dirs.map(scoreCourse);

if (jsonOut) {
  console.log(JSON.stringify(results, null, 2));
} else {
  const width = s => [...String(s)].reduce((k, ch) => k + (ch.charCodeAt(0) > 255 ? 2 : 1), 0);
  const pad = (s, n) => String(s) + ' '.repeat(Math.max(0, n - width(s)));
  console.log(pad('课件', 32) + DIMS.map(d => pad(d.short, 7)).join('') + '总分');
  console.log('─'.repeat(32 + DIMS.length * 7 + 4));
  for (const r of results) {
    const cells = DIMS.map(d => {
      const v = r.dims[d.key].score;
      return pad(v === null ? '—' : v, 7);
    }).join('');
    console.log(pad(r.topicId, 32) + cells + (r.total === null ? '—' : r.total));
  }

  console.log('\n扣分明细：');
  for (const r of results) {
    const lost = DIMS.filter(d => r.dims[d.key].score !== null && r.dims[d.key].score < d.max);
    console.log(`\n${r.topicId}  ${r.total === null ? '未评分（手写页面）' : r.total + ' 分'}`);
    if (r.total === null) { console.log('  手写页面，教学维度未计分'); continue; }
    if (!lost.length) { console.log('  满分'); continue; }
    for (const d of lost) {
      const x = r.dims[d.key];
      console.log(`  ${d.name} ${x.score}/${d.max}　${x.note}`);
    }
  }
  const scoredList = results.filter(r => r.total !== null);
  const avg = scoredList.reduce((n, r) => n + r.total, 0) / Math.max(1, scoredList.length);
  console.log(`\n平均 ${avg.toFixed(1)} 分（${scoredList.length} 节引擎课件）`);
  const manual = results.filter(r => r.total === null).map(r => r.topicId);
  if (manual.length) console.log(`手写页面未计分：${manual.join('、')}`);
}

const low = results.filter(r => r.total !== null && r.status === 'reviewed' && r.total < MIN);
if (MIN && low.length) {
  console.error(`\n低于 ${MIN} 分的已发布课件：${low.map(r => `${r.topicId}(${r.total})`).join('、')}`);
  process.exit(1);
}

#!/usr/bin/env node
/**
 * 课件脚手架：从图谱与教学研究生成一个可编辑的引擎型课件。
 *
 * 用法：
 *   node scripts/new-course.mjs <topicId> [--template=explain] [--renderer=vertical] [--force]
 *   node scripts/new-course.mjs --batch 3 [--template=explain] [--force]   # 按年级批量
 *
 * 生成：
 *   courses/<topicId>/meta.json      元数据
 *   courses/<topicId>/content.json   步骤数据（引擎渲染）
 *   courses/<topicId>/index.html     薄壳（构建时内联引擎与内容）
 *
 * 草稿里带 TODO 的地方需要人工改写：把教学研究的书面语换成对学生说的话。
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const flag = k => {
  const hit = args.find(a => a.startsWith(`--${k}=`));
  return hit ? hit.split('=')[1] : null;
};
const has = k => args.includes(`--${k}`);

const TEMPLATES = ['explain', 'drill', 'explore', 'review'];
const RENDERERS = ['text', 'vertical', 'geometry', 'solid', 'numberline', 'coords', 'clock', 'sim', 'chart', 'diagram', 'equation'];

const read = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
let topicsDoc, researchDoc, depsDoc, coursesDoc;
try {
  topicsDoc = read('data/topics.json');
  researchDoc = read('data/teaching-research.json');
  depsDoc = read('data/dependencies.json');
  coursesDoc = fs.existsSync(path.join(ROOT, 'data/courses.json')) ? read('data/courses.json') : { courses: [] };
} catch (e) {
  console.error('读不到 data/*.json，先跑 python3 scripts/build.py');
  process.exit(1);
}

const template = flag('template') || 'explain';
const renderer = flag('renderer') || 'text';
if (!TEMPLATES.includes(template)) {
  console.error(`--template 只能是 ${TEMPLATES.join(' / ')}`);
  process.exit(1);
}
if (!RENDERERS.includes(renderer)) {
  console.error(`--renderer 只能是 ${RENDERERS.join(' / ')}`);
  process.exit(1);
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const existing = new Set((coursesDoc.courses || []).map(c => c.topicId));

/* ── 单个主题 ─────────────────────────────────────────── */
function scaffold(topicId, opts = {}) {
  const topic = topicsDoc.topics.find(t => t.id === topicId);
  if (!topic) throw new Error(`找不到主题 ${topicId}`);
  const research = researchDoc.records.find(r => r.topicId === topicId);
  const prereqs = depsDoc.dependencies.filter(d => d.topicId === topicId).map(d => d.prerequisiteId);
  const nexts = depsDoc.dependencies.filter(d => d.prerequisiteId === topicId).map(d => d.topicId);

  const acts = (research && research.learn && research.learn.activities) || [];
  const errors = (research && research.assess && research.assess.errors) || [];

  const steps = [];
  steps.push({
    type: 'intro',
    title: topic.name,
    lead: topic.description,
    bullets: topic.evidence.map((e, i) => ({
      text: (i === 0 ? '<b>学完能做到：</b>' : '') + esc(e),
    })),
  });

  acts.forEach((a, i) => {
    steps.push({
      type: 'text',
      title: `第 ${i + 1} 步`,
      paras: [
        'TODO 把这一步改写成对学生说的话（第二人称、短句），并配一个可操作的动作。',
        `<span class="muted">原始活动：${esc(a.action)}</span>`,
      ],
      note: `期望体会：${esc(a.insight)}　反馈建议：${esc(a.feedback)}`,
    });
  });

  if (errors.length) {
    steps.push({
      type: 'text',
      title: '最容易错的地方',
      paras: errors.map(e => '· ' + esc(e)),
      warn: true,
    });
  }

  steps.push({
    type: 'quiz',
    title: '试试看',
    question: (research && research.assess && research.assess.task) || 'TODO 出一道题',
    answer: 0,
    unit: '',
    hint: 'TODO 补一句思路提示',
    why: errors[0] || 'TODO 补一条真实错因',
  });

  steps.push({
    type: 'summary',
    title: '小结',
    points: topic.evidence,
  });

  const content = {
    topicId,
    title: topic.name,
    subject: topic.subject,
    grade: topic.gradeRangeStart,
    template: opts.template || template,
    renderer: opts.renderer || renderer,
    version: '0.1.0',
    steps,
  };

  const meta = {
    topicId,
    title: topic.name,
    template: content.template,
    renderer: content.renderer,
    duration: 12,
    interactions: steps.filter(s => s.type === 'quiz' || s.type === 'choice').length,
    grade: topic.gradeRangeStart,
    subject: topic.subject,
    standards: topic.standards.slice(0, 2),
    prerequisites: prereqs,
    next: nexts.slice(0, 2),
    objectives: topic.evidence.slice(0, 3),
    status: 'draft',
    author: 'TODO',
    license: 'CC-BY-SA-4.0',
    version: '0.1.0',
    updatedAt: new Date().toISOString().slice(0, 10),
  };

  const outDir = path.join(ROOT, 'courses', topicId);
  if (fs.existsSync(outDir) && !opts.force) {
    throw new Error(`courses/${topicId}/ 已存在，覆盖请加 --force`);
  }
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'meta.json'), JSON.stringify(meta, null, 2) + '\n', 'utf8');
  fs.writeFileSync(path.join(outDir, 'content.json'), JSON.stringify(content, null, 2) + '\n', 'utf8');

  const layout = fs.readFileSync(path.join(ROOT, 'templates', 'layout.html'), 'utf8');
  fs.writeFileSync(
    path.join(outDir, 'index.html'),
    layout.replace(/\{\{TITLE\}\}/g, esc(topic.name)),
    'utf8',
  );
  return { topicId, steps: steps.length };
}

/* ── 批量：按年级列出可生成的主题 ─────────────────────── */
if (has('batch')) {
  const gradeArg = args[args.indexOf('--batch') + 1];
  const grade = Number(gradeArg);
  if (!grade) {
    console.error('用法：node scripts/new-course.mjs --batch 3');
    process.exit(1);
  }
  const list = topicsDoc.topics
    .filter(t => t.subject === '数学' && t.gradeRangeStart === grade)
    .sort((a, b) => (a.textbooks[0] || '').localeCompare(b.textbooks[0] || ''));

  console.log(`三年级数学共 ${list.length} 个主题：\n`);
  list.forEach(t => {
    const done = existing.has(t.id) ? '✓ 已有' : '  待建';
    console.log(`  ${done}  ${(t.textbooks[0] || '-').padEnd(16)} ${t.name}`);
  });
  console.log(`\n生成单个：node scripts/new-course.mjs <topicId> --renderer=vertical`);
  process.exit(0);
}

/* ── 单主题入口 ───────────────────────────────────────── */
const topicId = args.find(a => !a.startsWith('--'));
if (!topicId) {
  console.error('用法：node scripts/new-course.mjs <topicId> [--template=explain] [--renderer=text]');
  process.exit(1);
}
try {
  const r = scaffold(topicId, { force: has('force') });
  console.log(`已生成 courses/${r.topicId}/（${r.steps} 个步骤，状态 draft）`);
  console.log('\n待办：');
  console.log('  1. 改 content.json 里的 TODO，把书面语换成对学生说的话');
  console.log('  2. 按主题换成合适的 step 类型（vertical / geometry / numberline / clock）');
  console.log('  3. 核对答案，把 meta.status 改成 reviewed');
  console.log('\n本地预览：python3 -m http.server 8000 --directory courses/' + r.topicId);
  console.log('校验：node scripts/validate-courses.mjs');
} catch (e) {
  console.error(e.message);
  process.exit(1);
}

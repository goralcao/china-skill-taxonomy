#!/usr/bin/env node
/**
 * 课件层校验：结构与质量门槛。
 *
 * 用法：node scripts/validate-courses.mjs
 * 退出码：0 = 通过（允许警告），1 = 有阻断项
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const COURSE_DIR = path.join(ROOT, 'courses');
const TEMPLATES = ['explain', 'drill', 'explore', 'review'];
const STATUSES = ['draft', 'reviewed', 'deprecated'];
const MAX_BYTES = 300 * 1024;

const fails = [];
const warns = [];
let checked = 0;

function fail(dir, msg) { fails.push(`[fail] ${dir}: ${msg}`); }
function warn(dir, msg) { warns.push(`[warn] ${dir}: ${msg}`); }

let topics = [];
try {
  topics = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/topics.json'), 'utf8')).topics;
} catch (e) {
  console.error('读不到 data/topics.json，先跑 python3 scripts/build.py');
  process.exit(1);
}
const topicById = new Map(topics.map(t => [t.id, t]));

if (!fs.existsSync(COURSE_DIR)) {
  console.log('courses/ 目录不存在，跳过（尚未创建课件）');
  process.exit(0);
}

const dirs = fs.readdirSync(COURSE_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .sort();

if (!dirs.length) {
  console.log('courses/ 下没有课件');
  process.exit(0);
}

for (const name of dirs) {
  const dir = path.join(COURSE_DIR, name);
  const metaPath = path.join(dir, 'meta.json');
  const htmlPath = path.join(dir, 'index.html');
  const rel = `courses/${name}`;

  if (!fs.existsSync(metaPath)) { fail(rel, '缺 meta.json'); continue; }
  if (!fs.existsSync(htmlPath)) { fail(rel, '缺 index.html'); continue; }

  let meta;
  try {
    meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  } catch (e) {
    fail(rel, 'meta.json 不是合法 JSON：' + e.message);
    continue;
  }

  // 1. 必填字段
  const required = ['topicId', 'title', 'template', 'duration', 'interactions',
    'status', 'author', 'license', 'version', 'updatedAt'];
  const missing = required.filter(k => meta[k] === undefined || meta[k] === '');
  if (missing.length) fail(rel, 'meta.json 缺字段：' + missing.join(', '));

  // 2. topicId 存在，且目录名一致
  const topic = topicById.get(meta.topicId);
  if (!topic) fail(rel, `topicId ${meta.topicId} 不在 topics.json 里`);
  if (topic && topic.id !== name) fail(rel, `目录名 ${name} 与 topicId ${meta.topicId} 不一致`);

  // 3. 模板合法
  if (!TEMPLATES.includes(meta.template)) fail(rel, `template 非法：${meta.template}`);

  // 4. 课标必须是主题已有的
  if (topic && Array.isArray(meta.standards)) {
    const own = new Set(topic.standards);
    for (const s of meta.standards) {
      if (!own.has(s)) fail(rel, `课标 ${s} 不在主题的 standards 里`);
    }
  }

  // 5. 状态与许可
  if (!STATUSES.includes(meta.status)) fail(rel, `status 非法：${meta.status}`);
  if (meta.license !== 'CC-BY-SA-4.0') fail(rel, `license 必须是 CC-BY-SA-4.0，当前 ${meta.license}`);

  // 6. duration / interactions 范围与比例
  if (typeof meta.duration !== 'number' || meta.duration < 5 || meta.duration > 25) {
    fail(rel, `duration 应在 5~25 分钟，当前 ${meta.duration}`);
  }
  if (typeof meta.interactions !== 'number' || meta.interactions < 2) {
    fail(rel, `interactions 至少 2，当前 ${meta.interactions}`);
  }
  if (meta.duration && meta.interactions) {
    const per = meta.duration / meta.interactions;
    if (per < 2 || per > 7) warn(rel, `每个交互平均 ${per.toFixed(1)} 分钟，偏离 2~7 的合理区间`);
  }

  // 7. HTML 静态检查
  const html = fs.readFileSync(htmlPath, 'utf8');
  const bytes = Buffer.byteLength(html, 'utf8');

  if (/<script[^>]+src=/i.test(html)) fail(rel, 'HTML 引用了外部脚本（课件必须自包含）');
  if (/<link[^>]+href=["']https?:/i.test(html)) fail(rel, 'HTML 引用了外部样式');
  if (/<img[^>]+src=["']https?:/i.test(html)) fail(rel, 'HTML 引用了外部图片');
  if (bytes > MAX_BYTES) fail(rel, `单文件 ${(bytes / 1024).toFixed(0)}KB，超过 ${MAX_BYTES / 1024}KB 上限`);
  if (!/<html[^>]+lang=["']zh-CN["']/i.test(html)) fail(rel, '缺 <html lang="zh-CN">');
  if (!/<meta[^>]+name=["']viewport["']/i.test(html)) fail(rel, '缺 viewport meta');
  if (!/<title>[^<]{4,}<\/title>/i.test(html)) fail(rel, '缺 <title>');

  // 8. 交互步骤数一致
  const steps = (html.match(/data-step=/g) || []).length;
  const stepSections = (html.match(/<section[^>]+data-step=/g) || []).length;
  if (stepSections !== meta.interactions) {
    fail(rel, `meta.interactions=${meta.interactions}，HTML 里 ${stepSections} 个 data-step 小节`);
  }

  // 9. 易错点与键盘
  if (!/class=["'][^"']*pitfall/.test(html)) warn(rel, '没有 .pitfall 易错点提示');
  if (/\.\.\/\.\.\/index\.html/.test(html)) {
    fail(rel, '源课件里应写 ../../viz/index.html，构建时会改写成部署路径');
  }
  if (!/ArrowRight|ArrowLeft/.test(html)) warn(rel, '没有方向键切换步骤');

  // 10. 答案表复算
  const m = html.match(/window\.__ANSWERS\s*=\s*(\[[\s\S]*?\]);/);
  if (!m) {
    warn(rel, '没有 window.__ANSWERS，无法复算答案');
  } else {
    let answers;
    try {
      answers = JSON.parse(m[1]);
    } catch (e) {
      fail(rel, '__ANSWERS 不是合法 JSON：' + e.message);
      answers = null;
    }
    if (answers) {
      for (const a of answers) {
        if (a.expr === undefined) continue;
        let got;
        try { got = Function('"use strict";return (' + a.expr + ')')(); }
        catch (e) { fail(rel, `答案 ${a.id} 表达式无法计算：${a.expr}`); continue; }
        if (got !== a.value) fail(rel, `答案 ${a.id} 复算不符：expr 得 ${got}，标注 ${a.value}`);
      }
    }
  }

  // 11. 主题年段与课件年级一致
  if (topic && meta.grade && (meta.grade < topic.gradeRangeStart || meta.grade > topic.gradeRangeEnd)) {
    warn(rel, `meta.grade=${meta.grade} 不在主题年级区间 ${topic.gradeRangeStart}~${topic.gradeRangeEnd}`);
  }

  checked++;
}

console.log(`课件校验：${checked} 个`);
for (const w of warns) console.log(w);
if (fails.length) {
  for (const f of fails) console.log(f);
  console.log(`\n${fails.length} 项阻断，${warns.length} 项警告`);
  process.exit(1);
}
console.log(`\n全部通过（${warns.length} 项警告）`);

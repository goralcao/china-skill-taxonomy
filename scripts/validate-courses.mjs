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
const ACTIONS = ['比较', '分解', '变换', '逼近', '累积', '模拟', '构造'];
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

  // 5.1 认知动作：reviewed 的课件必须声明，且只能是一个
  if (meta.cognitiveAction !== undefined && !ACTIONS.includes(meta.cognitiveAction)) {
    fail(rel, `cognitiveAction 非法：${meta.cognitiveAction}（可选 ${ACTIONS.join(' / ')}）`);
  } else if (meta.status === 'reviewed' && !meta.cognitiveAction) {
    fail(rel, 'reviewed 的课件必须声明 cognitiveAction（一节课只承载一个认知动作）');
  }

  // 6. duration / interactions 范围与比例
  if (typeof meta.duration !== 'number' || meta.duration < 5 || meta.duration > 25) {
    fail(rel, `duration 应在 5~25 分钟，当前 ${meta.duration}`);
  }
  if (typeof meta.interactions !== 'number' || meta.interactions < 2) {
    fail(rel, `interactions 至少 2，当前 ${meta.interactions}`);
  }
  if (meta.duration && meta.interactions) {
    const per = meta.duration / meta.interactions;
    const lo = meta.template === 'drill' ? 1 : 2;
    const hi = meta.template === 'drill' ? 4 : 7;
    if (per < lo || per > hi) {
      warn(rel, `每个交互平均 ${per.toFixed(1)} 分钟，偏离 ${lo}~${hi} 的合理区间`);
    }
  }

  // 7. HTML 静态检查
  const html = fs.readFileSync(htmlPath, 'utf8');
  const bytes = Buffer.byteLength(html, 'utf8');

  // 源文件允许引用 templates/ 下的共享样式与呈现器（构建时内联）；
  // 除此之外的任何 <script src> / <link href> 都不允许。
  const scriptSrcs = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
  scriptSrcs.forEach(src => {
    if (!/^(\.\.\/)+templates\/(renderers|engine)\.js$/.test(src)) {
      fail(rel, `HTML 引用了外部脚本：${src}（只允许 templates/renderers.js 或 engine.js）`);
    }
  });
  const linkHrefs = [...html.matchAll(/<link[^>]+href=["']([^"']+)["']/gi)].map(m => m[1]);
  linkHrefs.forEach(href => {
    if (!/^(\.\.\/)+templates\/base\.css$/.test(href)) {
      fail(rel, `HTML 引用了外部样式：${href}（只允许 templates/base.css）`);
    }
  });
  // renderer 白名单 + 是否真的调用了对应呈现器
  const RENDERERS = ['text', 'vertical', 'geometry', 'solid', 'division', 'molecule', 'pyramid', 'calendar', 'decimalBar', 'barGroup', 'compass', 'numberline', 'coords', 'clock', 'sim', 'diagram', 'equation', 'law', 'triangle', 'counter', 'angle', 'quad', 'decGrid', 'mult2', 'fracMeaning', 'fracOps', 'volume', 'pairs', 'treePlant', 'symmetry', 'chart', 'mean', 'polyArea', 'factorGrid'];
  if (meta.renderer && !RENDERERS.includes(meta.renderer)) {
    fail(rel, `meta.renderer=${meta.renderer} 不在白名单（${RENDERERS.join(' / ')}）`);
  } else if (meta.renderer && meta.renderer !== 'text' && !html.includes('content-loader')
             && !html.includes('CR.' + meta.renderer + '(')) {
    // 引擎型课件的 CR 调用在 engine.js 里，源码看不到，跳过这条
    warn(rel, `renderer=${meta.renderer}，但没找到 CR.${meta.renderer}( 调用`);
  }

  if (/<img[^>]+src=["']https?:/i.test(html)) fail(rel, 'HTML 引用了外部图片');
  if (/(?:src|href)=["']https?:\/\//i.test(html)) fail(rel, 'HTML 引用了 http(s) 外部资源');
  if (bytes > MAX_BYTES) fail(rel, `单文件 ${(bytes / 1024).toFixed(0)}KB，超过 ${MAX_BYTES / 1024}KB 上限`);
  if (!/<html[^>]+lang=["']zh-CN["']/i.test(html)) fail(rel, '缺 <html lang="zh-CN">');
  if (!/<meta[^>]+name=["']viewport["']/i.test(html)) fail(rel, '缺 viewport meta');
  if (!/<title>[^<]{4,}<\/title>/i.test(html)) fail(rel, '缺 <title>');

  // 7.5 构建产物必须完全自包含（源文件可以共享 templates/，产物不行）
  const distPath = path.join(ROOT, 'viz', 'courses', path.basename(dir), 'index.html');
  if (fs.existsSync(distPath)) {
    const dist = fs.readFileSync(distPath, 'utf8');
    if (/<script[^>]+src=/i.test(dist)) fail(rel, '构建产物里还有 <script src>，未被内联');
    if (/<link[^>]+href=/i.test(dist)) fail(rel, '构建产物里还有 <link href>，未被内联');
    if (!/window\.__GRAPH\s*=/.test(dist)) fail(rel, '构建产物缺 window.__GRAPH（图谱延伸数据未注入）');
  }

  // 7.8 引擎型课件：内容在 content.json，校验步骤与答案
  const contentPath = path.join(dir, 'content.json');
  const isEngine = fs.existsSync(contentPath);
  let engineSteps = null;
  if (isEngine) {
    let content = null;
    try { content = JSON.parse(fs.readFileSync(contentPath, 'utf8')); }
    catch (e) { fail(rel, 'content.json 不是合法 JSON：' + e.message); }
    if (content) {
      if (content.topicId !== meta.topicId) fail(rel, `content.topicId=${content.topicId} 与 meta 不一致`);
      if (!Array.isArray(content.steps) || !content.steps.length) {
        fail(rel, 'content.steps 为空');
      } else {
        engineSteps = content.steps;
        const TYPES = ['intro', 'text', 'vertical', 'geometry', 'solid', 'division', 'molecule', 'pyramid', 'calendar', 'decimal', 'table', 'compass', 'numberline', 'clock', 'law', 'triangle', 'counter', 'angle', 'quad', 'decGrid', 'mult2', 'fracMeaning', 'fracOps', 'volume', 'pairs', 'treePlant', 'symmetry', 'chart', 'mean', 'polyArea', 'factorGrid', 'quiz', 'choice', 'summary'];
        let quizzes = 0;
        content.steps.forEach((st, i) => {
          if (!TYPES.includes(st.type)) fail(rel, `第 ${i + 1} 步 type=${st.type} 不合法`);
          if (st.type === 'quiz') {
            quizzes++;
            if (typeof st.answer !== 'number') fail(rel, `第 ${i + 1} 步 quiz.answer 必须是数字`);
            if (!st.question) fail(rel, `第 ${i + 1} 步 quiz 缺 question`);
          }
          if (st.type === 'choice') {
            quizzes++;
            if (!Array.isArray(st.options) || st.options.length < 2) fail(rel, `第 ${i + 1} 步 choice 选项不足`);
            else if (!st.options.includes(st.answer)) fail(rel, `第 ${i + 1} 步 choice.answer 不在选项里`);
            if (st.misconception !== undefined) {
              const mc = st.misconception;
              if (!mc || typeof mc !== 'object' || Array.isArray(mc)) {
                fail(rel, `第 ${i + 1} 步 choice.misconception 必须是「选项 → 错因」的对象`);
              } else {
                for (const [opt, why] of Object.entries(mc)) {
                  if (!st.options.includes(opt)) fail(rel, `第 ${i + 1} 步 misconception 的「${opt}」不在选项里`);
                  if (opt === st.answer) fail(rel, `第 ${i + 1} 步 misconception 不能给正确答案写错因`);
                  if (typeof why !== 'string' || !why.trim()) fail(rel, `第 ${i + 1} 步 misconception「${opt}」缺错因`);
                  else if (why.length > 80) fail(rel, `第 ${i + 1} 步 misconception「${opt}」超过 80 字`);
                }
                const missing = (st.options || []).filter(o => o !== st.answer && !mc[o]);
                if (missing.length) warn(rel, `第 ${i + 1} 步 choice 有 ${missing.length} 个错项没写 misconception`);
              }
            }
          }
          if (st.type === 'vertical') {
            const pr = st.problem || {};
            const val = pr.op === '÷' ? Number(pr.a) / Number(pr.b)
              : pr.op === '×' ? Number(pr.a) * Number(pr.b)
              : pr.op === '-' ? Number(pr.a) - Number(pr.b) : Number(pr.a) + Number(pr.b);
            if (!isFinite(val)) fail(rel, `第 ${i + 1} 步 vertical 的算式不成立`);
          }
        });
        if (quizzes !== meta.interactions) {
          fail(rel, `meta.interactions=${meta.interactions}，content 里 ${quizzes} 道题`);
        }
        // 至少要有一处易错点
        const hasPitfall = content.steps.some(st =>
          st.warn ||
          (st.note && /错|漏|误|别/.test(st.note)) ||
          (Array.isArray(st.bullets) && st.bullets.some(b => b.warn)));
        if (!hasPitfall) warn(rel, 'content 里没有易错点提示');
      }
    }
    if (!/content-loader|window\.__CONTENT/.test(html)) {
      fail(rel, '引擎型课件的 index.html 缺 content-loader 或 __CONTENT');
    }
  }

  // 8. 交互步骤数一致：多步页面看 data-step，单页题库看 __ANSWERS 条数
  const answersMatch = html.match(/window\.__ANSWERS\s*=\s*(\[[\s\S]*?\]);/);
  let answers = null;
  if (answersMatch) {
    try { answers = JSON.parse(answersMatch[1]); }
    catch (e) { fail(rel, '__ANSWERS 不是合法 JSON：' + e.message); }
  }
  const stepSections = (html.match(/<section[^>]+data-step=/g) || []).length;
  const actCount = (html.match(/\sdata-interaction[\s>]/g) || []).length;
  if (isEngine) {
    // 步骤由引擎运行时生成，源码里没有 data-step，已在上一步按 content.steps 校验
  } else if (actCount > 0) {
    if (actCount !== meta.interactions) {
      fail(rel, `meta.interactions=${meta.interactions}，HTML 里 ${actCount} 个 data-interaction 控件`);
    }
  } else if (stepSections > 0) {
    if (stepSections !== meta.interactions) {
      fail(rel, `meta.interactions=${meta.interactions}，HTML 里 ${stepSections} 个 data-step 小节`);
    }
  } else if (!answers || !answers.length) {
    fail(rel, '既没有 data-step 小节，也没有 __ANSWERS 题库');
  } else if (answers.length !== meta.interactions) {
    fail(rel, `meta.interactions=${meta.interactions}，题库 ${answers.length} 题`);
  }

  // 9. 易错点与键盘
  if (!isEngine && !/class=["'][^"']*pitfall/.test(html)) warn(rel, '没有 .pitfall 易错点提示');
  if (/\.\.\/\.\.\/index\.html/.test(html)) {
    fail(rel, '源课件里应写 ../../viz/index.html，构建时会改写成部署路径');
  }
  if (stepSections > 0 && !/ArrowRight|ArrowLeft/.test(html)) warn(rel, '没有方向键切换步骤');

  // 10. 答案表复算
  if (!answers) {
    if (!isEngine) warn(rel, '没有可解析的 window.__ANSWERS，无法复算答案');
  } else {
    {
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

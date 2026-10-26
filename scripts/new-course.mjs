#!/usr/bin/env node
/**
 * 课件脚手架：从图谱与教学研究自动带入内容，生成可编辑的草稿。
 *
 * 用法：
 *   node scripts/new-course.mjs <topicId> [--template=explain|drill|explore|review] [--force]
 *
 * 生成：
 *   courses/<topicId>/meta.json
 *   courses/<topicId>/index.html   （结构完整、内容待改写）
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const topicId = args.find(a => !a.startsWith('--'));
const tplArg = (args.find(a => a.startsWith('--template=')) || '').split('=')[1];
const force = args.includes('--force');

if (!topicId) {
  console.error('用法：node scripts/new-course.mjs <topicId> [--template=explain] [--force]');
  process.exit(1);
}

const read = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
let topicsDoc, researchDoc;
try {
  topicsDoc = read('data/topics.json');
  researchDoc = read('data/teaching-research.json');
} catch (e) {
  console.error('读不到 data/*.json，先跑 python3 scripts/build.py');
  process.exit(1);
}

const topic = topicsDoc.topics.find(t => t.id === topicId);
if (!topic) {
  console.error(`找不到主题 ${topicId}`);
  process.exit(1);
}
const deps = read('data/dependencies.json').dependencies;
const prereqs = deps.filter(d => d.topicId === topicId).map(d => d.prerequisiteId);
const nexts = deps.filter(d => d.prerequisiteId === topicId).map(d => d.topicId);
const research = researchDoc.records.find(r => r.topicId === topicId);

const template = tplArg || 'explain';
if (!['explain', 'drill', 'explore', 'review'].includes(template)) {
  console.error('--template 只能是 explain / drill / explore / review');
  process.exit(1);
}

const outDir = path.join(ROOT, 'courses', topicId);
if (fs.existsSync(outDir) && !force) {
  console.error(`courses/${topicId}/ 已存在。确认覆盖请加 --force`);
  process.exit(1);
}
fs.mkdirSync(outDir, { recursive: true });

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const activities = research?.learn?.activities || [];
const errors = research?.assess?.errors || [];
const levels = research?.assess?.levels || [];
const interactionCount = Math.max(2, activities.length + 2);

const meta = {
  topicId,
  title: topic.name + '：一节可以动手的课',
  template,
  duration: 12,
  interactions: interactionCount,
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
  updatedAt: new Date().toISOString().slice(0, 10)
};
fs.writeFileSync(path.join(outDir, 'meta.json'), JSON.stringify(meta, null, 2) + '\n', 'utf8');

const stepsHtml = activities.map((a, i) => `
  <section class="step" data-step="${i + 2}">
    <h2>第 ${i + 1} 步：${esc(a.insight)}</h2>
    <p class="todo">TODO 把这一步改写成对学生说的话，并加一个可操作的动作（点 / 拖 / 输 / 选）。</p>
    <div class="card tip">
      <p style="margin:0">原始活动：${esc(a.action)}</p>
      <p style="margin:6px 0 0" class="muted">期望体会：${esc(a.insight)}　反馈建议：${esc(a.feedback)}</p>
    </div>
    <div class="card pitfall"><b>常见错法：</b>${esc(errors[i % Math.max(1, errors.length)] || 'TODO 补一条真实错例')}</div>
  </section>`).join('\n');

const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(topic.name)} · 学阶图谱课件</title>
<style>
  :root { --bg:#0a0f18; --panel:#0f1620; --card:#141d29; --line:#24303f; --text:#e8edf5;
    --dim:#8b98ab; --accent:#ffd166; --ok:#4ade80; --bad:#f87171; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--text); line-height:1.7;
    font-family:system-ui,-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;
    padding:0 16px calc(80px + env(safe-area-inset-bottom,0px)); }
  header { position:sticky; top:0; background:rgba(10,15,24,.94); padding:10px 0;
    border-bottom:1px solid var(--line); display:flex; gap:12px; align-items:center; }
  .back { color:var(--dim); text-decoration:none; font-size:13px; }
  main { max-width:720px; margin:0 auto; padding-top:16px; }
  .step { display:none; } .step.active { display:block; }
  h1 { font-size:20px; margin:0 0 6px; } h2 { font-size:17px; margin:0 0 10px; }
  .card { background:var(--panel); border:1px solid var(--line); border-radius:12px;
    padding:14px 16px; margin:14px 0; }
  .card.tip { border-left:3px solid var(--accent); } .card.pitfall { border-left:3px solid var(--bad); }
  .muted { color:var(--dim); font-size:13.5px; } .todo { color:var(--bad); font-size:13px; }
  footer { position:fixed; left:0; right:0; bottom:0; display:flex; justify-content:space-between;
    gap:12px; padding:10px 16px calc(10px + env(safe-area-inset-bottom,0px));
    background:rgba(10,15,24,.96); border-top:1px solid var(--line); }
  .btn { padding:11px 18px; border-radius:10px; border:1px solid var(--line); background:var(--card);
    color:var(--text); font-size:15px; min-height:44px; }
  .btn.primary { background:var(--accent); color:#1a1300; border-color:var(--accent); font-weight:600; }
</style>
</head>
<body>
<header>
  <a class="back" href="../../viz/index.html#t=${topicId}">← 回到图谱</a>
  <span class="muted" style="margin-left:auto">${esc(topic.subject)} · ${topic.gradeRangeStart} 年级</span>
</header>
<main>
  <section class="step active" data-step="1">
    <h1>${esc(topic.name)}</h1>
    <p class="muted">${esc(topic.description)}</p>
    <div class="card">
      <p style="margin:0"><b>学完能做到：</b>${topic.evidence.map(esc).join('；')}</p>
    </div>
    <p class="todo">TODO 用一个真实情境替换上面这段（学生身边的事、能算能看的东西）。</p>
  </section>
${stepsHtml}

  <section class="step" data-step="${interactionCount}">
    <h2>小结</h2>
    <p class="todo">TODO 用两三句话收束，写清「记住什么、什么时候用」。</p>
    <div class="card">
      <p style="margin:0"><b>诊断任务：</b>${esc(research?.assess?.task || 'TODO')}</p>
      <p style="margin:6px 0 0" class="muted">达标表现：${esc(levels[levels.length - 1] || 'TODO')}</p>
    </div>
    <a class="next-card" href="../../viz/index.html#t=${nexts[0] || topicId}">
      接着学：<b>${esc(nexts[0] ? (topicsDoc.topics.find(t => t.id === nexts[0]) || {}).name || '（待补）' : '（暂无后继）')}</b>
    </a>
  </section>
</main>
<footer>
  <button class="btn" id="prev">上一步</button>
  <button class="btn primary" id="next">下一步</button>
</footer>
<script>
(function () {
  var TOPIC_ID = '${topicId}';
  var cur = 1;
  var sections = [].slice.call(document.querySelectorAll('.step'));
  var total = sections.length;
  window.__ANSWERS = [];

  function show(n) {
    cur = Math.max(1, Math.min(total, n));
    sections.forEach(function (s) { s.classList.toggle('active', Number(s.dataset.step) === cur); });
    document.getElementById('prev').disabled = cur === 1;
    document.getElementById('next').textContent = cur === total ? '完成' : '下一步';
  }
  document.getElementById('prev').onclick = function () { show(cur - 1); };
  document.getElementById('next').onclick = function () {
    if (cur === total) {
      try {
        localStorage.setItem('stx.course.' + TOPIC_ID, JSON.stringify({
          done: true, score: 1, at: Date.now(), v: '${meta.version}'
        }));
      } catch (e) {}
      document.getElementById('next').textContent = '已完成';
      document.getElementById('next').disabled = true;
      return;
    }
    show(cur + 1);
  };
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' && cur < total) show(cur + 1);
    if (e.key === 'ArrowLeft' && cur > 1) show(cur - 1);
  });
  // 线上分享链接用 ?sharecode= 鉴权，回跳时带上
  (function () {
    var sc = new URLSearchParams(location.search).get('sharecode');
    if (!sc) return;
    [].slice.call(document.querySelectorAll('a[href*="index.html"]')).forEach(function (a) {
      var href = a.getAttribute('href');
      if (href.indexOf('sharecode=') >= 0) return;
      var i = href.indexOf('#');
      var base = i >= 0 ? href.slice(0, i) : href;
      var tail = i >= 0 ? href.slice(i) : '';
      a.setAttribute('href', base + '?sharecode=' + encodeURIComponent(sc) + tail);
    });
  })();

  show(1);
})();
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');

console.log(`已生成 courses/${topicId}/`);
console.log(`  meta.json  ${meta.interactions} 个交互步骤，状态 ${meta.status}`);
console.log(`  index.html ${(Buffer.byteLength(html) / 1024).toFixed(1)}KB`);
console.log(`\n预览：python3 -m http.server 8000 --directory courses/${topicId}`);
console.log(`校验：node scripts/validate-courses.mjs`);
console.log(`\n待办：把标红的 TODO 改成对学生说的话，补一个可操作的动作，然后把 meta.status 改成 reviewed。`);

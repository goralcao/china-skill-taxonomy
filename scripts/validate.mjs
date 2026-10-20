#!/usr/bin/env node
/**
 * 数据校验脚本（无第三方依赖）：
 *   node scripts/validate.mjs
 *
 * 校验内容：
 *   1. manifest 中登记的各数据文件 SHA-256 校验和
 *   2. 主题 / 依赖 / 课标 / 教材 / 域摘要的结构完整性（字段、枚举、取值范围）
 *   3. 依赖边端点存在、无自环、无重复、无反向边
 *   4. 先修图是有向无环图（DAG，拓扑排序）
 *   5. 先修年级不晚于主题年级（prerequisite.gradeRangeEnd <= topic.gradeRangeStart）
 *   6. 课标编号可解析、教材引用可解析（版本/册次/单元号/块标签均存在）
 *   7. 域摘要 (学科, 领域, 学段) 不重复
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(root, 'data');

const read = (name) => JSON.parse(readFileSync(join(dataDir, name), 'utf8'));
const raw = (name) => readFileSync(join(dataDir, name));

const manifest = read('manifest.json');
const topicsDoc = read('topics.json');
const depsDoc = read('dependencies.json');
const standardsDoc = read('curriculum-standards.json');
const textbooksDoc = read('textbooks.json');
const clustersDoc = read('clusters.json');

const errors = [];
const warnings = [];
const fail = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

/* ---------- 1. 校验和 ---------- */
for (const [name, info] of Object.entries(manifest.files ?? {})) {
  const digest = createHash('sha256').update(raw(name)).digest('hex');
  if (digest !== info.sha256) fail(`校验和不匹配: data/${name}（manifest 记录 ${info.sha256}，实际 ${digest}）`);
}

/* ---------- 2. 结构校验 ---------- */
const TOPIC_TYPES = new Set(['CONCEPTUAL', 'PROCEDURAL', 'REPRESENTATIONAL', 'LANGUAGE', 'META']);
const SUBJECTS = new Set(['数学', '语文', '英语']);

const topics = topicsDoc.topics;
const seenIds = new Set();
for (const t of topics) {
  const where = t.id ?? t.name ?? '(未知主题)';
  for (const f of ['id', 'type', 'subject', 'domain', 'name', 'description', 'gradeRangeStart',
    'gradeRangeEnd', 'stage', 'evidence', 'assessmentPrompt', 'standards', 'textbooks']) {
    if (t[f] === undefined || t[f] === null) fail(`主题 ${where} 缺少字段 ${f}`);
  }
  if (seenIds.has(t.id)) fail(`主题 id 重复: ${t.id}`);
  seenIds.add(t.id);
  if (!/^mt_[a-z0-9-]+$/.test(t.id)) fail(`主题 id 格式非法: ${t.id}`);
  if (!TOPIC_TYPES.has(t.type)) fail(`主题 ${where} type 非法: ${t.type}`);
  if (!SUBJECTS.has(t.subject)) fail(`主题 ${where} subject 非法: ${t.subject}`);
  if (!(t.gradeRangeStart >= 1 && t.gradeRangeStart <= 6)) fail(`主题 ${where} gradeRangeStart 越界`);
  if (!(t.gradeRangeEnd >= 1 && t.gradeRangeEnd <= 6)) fail(`主题 ${where} gradeRangeEnd 越界`);
  if (t.gradeRangeStart > t.gradeRangeEnd) fail(`主题 ${where} 年级区间颠倒`);
  if (t.subject === '英语' && t.gradeRangeStart < 3) fail(`英语主题 ${where} 年级小于 3`);
  if (!Array.isArray(t.evidence) || t.evidence.length < 2 || t.evidence.length > 3) {
    fail(`主题 ${where} evidence 应为 2~3 条`);
  }
  if (!String(t.assessmentPrompt).includes('{{name}}')) fail(`主题 ${where} assessmentPrompt 缺少 {{name}} 占位符`);
  if (t.standards.length < 1) fail(`主题 ${where} 未关联课标`);
}

const deps = depsDoc.dependencies;
const seenEdges = new Set();
const edgeSet = new Set();
for (const d of deps) {
  const key = `${d.topicId}->${d.prerequisiteId}`;
  if (d.topicId === d.prerequisiteId) fail(`自环边: ${key}`);
  if (seenEdges.has(key)) fail(`重复边: ${key}`);
  seenEdges.add(key);
  if (edgeSet.has(`${d.prerequisiteId}->${d.topicId}`)) fail(`双向边: ${key} 与其反向边同时存在`);
  edgeSet.add(key);
  if (!['hard', 'soft'].includes(d.strength)) fail(`边 ${key} strength 非法: ${d.strength}`);
  if (!d.reason || d.reason.length > 60) fail(`边 ${key} reason 缺失或过长`);
  if (!seenIds.has(d.topicId) || !seenIds.has(d.prerequisiteId)) fail(`边端点不存在: ${key}`);
}

/* ---------- 4. DAG 校验（Kahn 拓扑排序） ---------- */
const indegree = new Map(topics.map((t) => [t.id, 0]));
const out = new Map(topics.map((t) => [t.id, []]));
for (const d of deps) {
  if (!indegree.has(d.topicId) || !indegree.has(d.prerequisiteId)) continue;
  indegree.set(d.topicId, indegree.get(d.topicId) + 1);
  out.get(d.prerequisiteId).push(d.topicId);
}
const queue = topics.filter((t) => indegree.get(t.id) === 0).map((t) => t.id);
let sorted = 0;
while (queue.length) {
  const cur = queue.pop();
  sorted += 1;
  for (const nxt of out.get(cur) ?? []) {
    indegree.set(nxt, indegree.get(nxt) - 1);
    if (indegree.get(nxt) === 0) queue.push(nxt);
  }
}
if (sorted !== topics.length) {
  fail(`先修图存在环：${topics.length - sorted} 个主题无法拓扑排序`);
}

/* ---------- 5. 先修年级规则 ---------- */
const byId = new Map(topics.map((t) => [t.id, t]));
for (const d of deps) {
  const a = byId.get(d.topicId);
  const b = byId.get(d.prerequisiteId);
  if (!a || !b) continue;
  if (b.gradeRangeEnd > a.gradeRangeStart) {
    fail(`先修年级晚于主题: ${a.name}(${a.gradeRangeStart}) 的先修 ${b.name}(${b.gradeRangeStart}~${b.gradeRangeEnd})`);
  }
}

/* ---------- 6. 课标与教材引用 ---------- */
const stdCodes = new Set(standardsDoc.standards.map((s) => s.code));
for (const t of topics) {
  for (const c of t.standards) {
    if (!stdCodes.has(c)) fail(`主题 ${t.name} 引用不存在的课标编号: ${c}`);
  }
}

const versionBySlug = new Map(textbooksDoc.versions.map((v) => [v.slug, v]));
const bookByRef = (vslug, bslug) => {
  const v = versionBySlug.get(vslug);
  if (!v) return { error: `不存在的教材版本: ${vslug}` };
  const book = v.books.find((b) => b.slug === bslug);
  if (!book) return { error: `版本 ${vslug} 中不存在册次: ${bslug}` };
  return { v, book };
};
for (const t of topics) {
  for (const ref of t.textbooks) {
    const m = ref.match(/^(pep-math|tongbian-chinese|pep-english):([1-6][ab])(?::(u[1-9]))?(?:#(.+))?$/);
    if (!m) {
      fail(`主题 ${t.name} 教材引用格式非法: ${ref}`);
      continue;
    }
    const [, vslug, bslug, unitPart, blockPart] = m;
    const { v, book, error } = bookByRef(vslug, bslug);
    if (error) {
      fail(`主题 ${t.name} 教材引用无效: ${ref}（${error}）`);
      continue;
    }
    if (unitPart) {
      const n = Number(unitPart.slice(1));
      const limit = book.units?.length ?? v.unitCounts?.[bslug] ?? 0;
      if (n > limit) fail(`主题 ${t.name} 教材引用单元号越界: ${ref}（该册仅 ${limit} 个单元）`);
    }
    if (blockPart && !(book.blocks ?? []).includes(blockPart)) {
      fail(`主题 ${t.name} 教材引用块标签不存在: ${ref}`);
    }
    if (book.grade !== Number(bslug[0])) fail(`主题 ${t.name} 教材引用册次与年级不符: ${ref}`);
    // 允许引用更低年级的单元作为先修锚点；只对超出主题年级上限的引用告警
    const grade = Number(bslug[0]);
    if (grade > t.gradeRangeEnd) {
      warn(`主题 ${t.name}（${t.gradeRangeStart}~${t.gradeRangeEnd} 年级）引用了更高年级教材: ${ref}`);
    }
  }
}

/* ---------- 6.5 教学研究层 ---------- */
const research = read('teaching-research.json');
const topicsSha = createHash('sha256').update(raw('topics.json')).digest('hex');
if (research.topicFileSha256 !== topicsSha) {
  fail(`teaching-research.json 的 topicFileSha256 与 data/topics.json 实际字节不符（图谱变更后需重新构建）`);
}
if (research.taxonomyVersion !== topicsDoc.version) {
  fail(`教学研究层 taxonomyVersion(${research.taxonomyVersion}) 与 topics.json version(${topicsDoc.version}) 不一致`);
}
const researchTopics = new Set();
for (const rec of research.records) {
  const where = rec.topicId;
  if (researchTopics.has(where)) fail(`教学研究记录重复: ${where}`);
  researchTopics.add(where);
  const t = byId.get(where);
  if (!t) { fail(`教学研究记录指向不存在的主题: ${where}`); continue; }
  if (rec.topicName !== t.name) fail(`教学研究记录 topicName 与主题不符: ${where}`);
  if (rec.subject !== t.subject) fail(`教学研究记录学科与主题不符: ${where}`);
  if (rec.gradeRangeStart !== t.gradeRangeStart || rec.gradeRangeEnd !== t.gradeRangeEnd) {
    fail(`教学研究记录年级与主题不符: ${where}`);
  }
  if (rec.verified !== false) fail(`教学研究记录 verified 必须为 false: ${where}`);
  if (!['high', 'medium', 'low'].includes(rec.confidence)) fail(`教学研究记录 confidence 非法: ${where}`);
  if (!rec.pedagogy || rec.pedagogy.length < 60 || rec.pedagogy.length > 200) {
    fail(`教学研究记录 pedagogy 长度越界: ${where}`);
  }
  if (!rec.learn?.summary || !Array.isArray(rec.learn?.activities) || rec.learn.activities.length < 2) {
    fail(`教学研究记录 learn 字段不完整: ${where}`);
  }
  for (const a of rec.learn.activities) {
    for (const f of ['action', 'insight', 'feedback', 'rationale']) {
      if (!a[f] || a[f].length > 80) fail(`教学研究记录活动字段 ${f} 不合规: ${where}`);
    }
  }
  if (!rec.assess?.task || !Array.isArray(rec.assess.levels) || rec.assess.levels.length < 2) {
    fail(`教学研究记录 assess 字段不完整: ${where}`);
  }
  if (!Array.isArray(rec.sources) || rec.sources.length < 1) fail(`教学研究记录缺少来源: ${where}`);
}
// 覆盖清单必须与实际情况一致
const expectedMissing = topics.filter(t => !researchTopics.has(t.id)).map(t => t.id).sort();
const actualMissing = [...research.coverage.missingTopicIds].sort();
if (JSON.stringify(expectedMissing) !== JSON.stringify(actualMissing)) {
  fail(`教学研究覆盖清单 missingTopicIds 与实际不符（期望 ${expectedMissing.length} 个，实际 ${actualMissing.length} 个）`);
}
const researchBySubject = {};
for (const t of topics) {
  const s = researchBySubject[t.subject] = researchBySubject[t.subject] || { covered: 0, total: 0 };
  s.total += 1;
  if (researchTopics.has(t.id)) s.covered += 1;
}
for (const [subject, cnt] of Object.entries(researchBySubject)) {
  const declared = research.coverage.subjects[subject];
  if (!declared || declared.total !== cnt.total || declared.covered !== cnt.covered) {
    fail(`教学研究覆盖清单与 ${subject} 实际不符: 声明 ${JSON.stringify(declared)}，实际 ${JSON.stringify(cnt)}`);
  }
}

/* ---------- 7. 域摘要与层级 ---------- */
const topicIdSet = new Set(topics.map(t => t.id));
const clusterKeys = new Set();
const clusterIds = new Set();
for (const c of clustersDoc.clusters) {
  const key = `${c.subject}|${c.domain}|${c.stage}`;
  if (clusterKeys.has(key)) fail(`域摘要重复: ${key}`);
  clusterKeys.add(key);
  if (!SUBJECTS.has(c.subject)) fail(`域摘要学科非法: ${c.subject}`);
  if (!c.id) fail(`域摘要缺少 id: ${key}`);
  else if (clusterIds.has(c.id)) fail(`域摘要 id 重复: ${c.id}`);
  else clusterIds.add(c.id);
  if (!Array.isArray(c.topicIds) || !c.topicIds.length) fail(`域摘要 topicIds 为空: ${key}`);
  else for (const tid of c.topicIds) {
    if (!topicIdSet.has(tid)) fail(`域摘要 ${key} 引用了不存在的主题: ${tid}`);
  }
}
const topicToCluster = new Map();
for (const t of topics) {
  const key = `${t.subject}|${t.domain}|${t.stage}`;
  if (!clusterKeys.has(key)) warn(`主题 ${t.name} 缺少对应域摘要: ${key}`);
  if (!t.clusterId) fail(`主题缺少 clusterId: ${t.id}`);
  else {
    if (!clusterIds.has(t.clusterId)) fail(`主题 ${t.id} 的 clusterId 不存在: ${t.clusterId}`);
    if (topicToCluster.has(t.clusterId) && topicToCluster.get(t.clusterId) !== t.id) {
      // 同簇多主题是正常的，仅检查主题未被重复登记到多个簇
    }
    topicToCluster.set(t.id, t.clusterId);
  }
}
// 双向一致：簇登记的主题 ↔ 主题声明的簇
for (const c of clustersDoc.clusters) {
  for (const tid of c.topicIds || []) {
    const t = topics.find(x => x.id === tid);
    if (t && t.clusterId !== c.id) fail(`主题 ${tid} 的 clusterId(${t.clusterId}) 与簇登记(${c.id})不一致`);
  }
}
// 每个主题恰好属于一个簇
{
  const seen = new Set();
  for (const c of clustersDoc.clusters) for (const tid of c.topicIds || []) {
    if (seen.has(tid)) fail(`主题被多个簇登记: ${tid}`);
    seen.add(tid);
  }
  for (const t of topics) if (!seen.has(t.id)) fail(`主题未被任何簇登记: ${t.id}`);
}

/* ---------- 报告 ---------- */
const perSubject = {};
for (const t of topics) {
  perSubject[t.subject] = (perSubject[t.subject] ?? 0) + 1;
}
console.log('学阶图谱 · 数据校验');
console.log('-----------------------------------');
console.log(`主题 ${topics.length}（${Object.entries(perSubject).map(([k, v]) => `${k} ${v}`).join('，')}）`);
console.log(`依赖边 ${deps.length}（hard ${deps.filter((d) => d.strength === 'hard').length} / soft ${deps.filter((d) => d.strength === 'soft').length}）`);
console.log(`课标条目 ${standardsDoc.standards.length} · 教材版本 ${textbooksDoc.versions.length} · 域摘要 ${clustersDoc.clusters.length}`);
console.log(`教学研究记录 ${research.records.length}（数学 ${researchBySubject['数学']?.covered ?? 0}/${researchBySubject['数学']?.total ?? 0}，语文 ${researchBySubject['语文']?.covered ?? 0}，英语 ${researchBySubject['英语']?.covered ?? 0}）`);
console.log(`DAG 拓扑排序: ${sorted}/${topics.length}`);
if (warnings.length) {
  console.log(`\n警告 ${warnings.length} 条:`);
  for (const w of warnings) console.log(`  [warn] ${w}`);
}
if (errors.length) {
  console.log(`\n校验失败，共 ${errors.length} 个问题:`);
  for (const e of errors) console.log(`  [fail] ${e}`);
  process.exit(1);
}
console.log('\n全部校验通过。');

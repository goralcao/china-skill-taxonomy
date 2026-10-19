/**
 * 教学研究层专项测试：
 *   node --test scripts/teaching-research.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (name) => JSON.parse(readFileSync(join(root, 'data', name), 'utf8'));

const topicsDoc = read('topics.json');
const research = read('teaching-research.json');
const byId = new Map(topicsDoc.topics.map(t => [t.id, t]));

test('教学研究记录与 topics.json 一一联结', () => {
  for (const rec of research.records) {
    const t = byId.get(rec.topicId);
    assert.ok(t, `记录指向不存在的主题: ${rec.topicId}`);
    assert.equal(rec.topicName, t.name);
    assert.equal(rec.subject, t.subject);
    assert.equal(rec.gradeRangeStart, t.gradeRangeStart);
  }
});

test('记录主题不重复', () => {
  const ids = research.records.map(r => r.topicId);
  assert.equal(new Set(ids).size, ids.length);
});

test('topicFileSha256 绑定 topics.json 当前字节', () => {
  const sha = createHash('sha256').update(readFileSync(join(root, 'data', 'topics.json'))).digest('hex');
  assert.equal(research.topicFileSha256, sha);
});

test('覆盖清单与 records 一致', () => {
  const covered = new Set(research.records.map(r => r.topicId));
  const expectedMissing = topicsDoc.topics.filter(t => !covered.has(t.id)).map(t => t.id);
  assert.deepEqual([...research.coverage.missingTopicIds].sort(), expectedMissing.sort());
  for (const [subject, cnt] of Object.entries(research.coverage.subjects)) {
    const total = topicsDoc.topics.filter(t => t.subject === subject).length;
    const cov = topicsDoc.topics.filter(t => t.subject === subject && covered.has(t.id)).length;
    assert.equal(cnt.total, total);
    assert.equal(cnt.covered, cov);
  }
});

test('每条记录字段完整且未标为已验证', () => {
  for (const rec of research.records) {
    assert.equal(rec.verified, false);
    assert.ok(['high', 'medium', 'low'].includes(rec.confidence));
    assert.ok(rec.pedagogy.length >= 60 && rec.pedagogy.length <= 200);
    assert.ok(rec.learn.summary.length >= 30 && rec.learn.summary.length <= 120);
    assert.ok(rec.learn.activities.length >= 2 && rec.learn.activities.length <= 3);
    assert.ok(rec.learn.constraints.length >= 1);
    assert.ok(rec.assess.levels.length >= 2);
    assert.ok(rec.sources.length >= 1);
  }
});

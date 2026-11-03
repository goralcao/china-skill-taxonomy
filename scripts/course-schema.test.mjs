/**
 * 课件结构常量的护栏：node --test scripts/course-schema.test.mjs
 *
 * 这组测试守的是一个已经翻过的车：渲染器白名单在三个脚本里各抄一份，
 * 语文的 poemNote / draft / checkup 加进校验脚本时没同步脚手架，
 * `--renderer=poemNote` 被挡在门外，只能先生成 text 再手改。
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  ROOT, TEMPLATES, RENDERERS, STEP_TYPES, CR_RENDERERS,
  LANG_ACTIONS, SUGGESTED, readCatalog,
} from './course-schema.mjs';

const readScript = name => readFileSync(join(ROOT, 'scripts', name), 'utf8');
const courseIds = () => readdirSync(join(ROOT, 'courses'), { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

test('清单来自引擎源码，不是手抄', () => {
  const now = readCatalog();
  const utils = ['graphNav', 'extend', 'graphHref', 'reduced'];
  assert.deepEqual(STEP_TYPES, now.stepTypes, 'STEP_TYPES 与 engine.js 的 RENDER 表脱节');
  assert.deepEqual(CR_RENDERERS, now.crKeys.filter(k => !utils.includes(k)),
    'CR_RENDERERS 与 renderers.js 的 global.CR 脱节');
  assert.ok(STEP_TYPES.length >= 40, 'RENDER 表解析失败？只剩 ' + STEP_TYPES.length + ' 个步骤');
  assert.ok(CR_RENDERERS.length >= 40, 'CR 解析失败？只剩 ' + CR_RENDERERS.length + ' 个呈现器');
});

test('RENDERERS 里没有幽灵项：每个都能追溯到 CR 或 RENDER 表', () => {
  const known = new Set(['text', ...CR_RENDERERS, ...STEP_TYPES]);
  const ghosts = RENDERERS.filter(v => !known.has(v));
  assert.deepEqual(ghosts, [], `白名单里有引擎根本不认的值：${ghosts.join(', ')}`);
});

test('RENDERERS 不包含纯工具成员', () => {
  for (const util of ['graphNav', 'extend', 'graphHref', 'reduced']) {
    assert.ok(!RENDERERS.includes(util), `${util} 是图谱连接件，不能当 meta.renderer`);
  }
});

test('语文动手环节都是引擎认得的步骤类型', () => {
  const stray = LANG_ACTIONS.filter(t => !STEP_TYPES.includes(t));
  assert.deepEqual(stray, [], `LANG_ACTIONS 里有引擎不认的步骤：${stray.join(', ')}`);
});

test('按学科推荐的值都在白名单内', () => {
  for (const [subject, list] of Object.entries(SUGGESTED)) {
    assert.ok(list.length > 0, `${subject} 没有推荐值`);
    const bad = list.filter(v => !RENDERERS.includes(v));
    assert.deepEqual(bad, [], `${subject} 推荐了不存在的 renderer：${bad.join(', ')}`);
  }
});

test('模板清单与校验脚本一致', () => {
  assert.deepEqual(TEMPLATES, ['explain', 'drill', 'explore', 'review']);
});

test('实际课件没有越界：每个 type 与 renderer 都被引擎支持', () => {
  const problems = [];
  for (const id of courseIds()) {
    const contentPath = join(ROOT, 'courses', id, 'content.json');
    const metaPath = join(ROOT, 'courses', id, 'meta.json');
    if (!existsSync(contentPath)) continue; // 手写页面，另有一套校验
    const content = JSON.parse(readFileSync(contentPath, 'utf8'));
    for (const [i, st] of (content.steps || []).entries()) {
      if (!STEP_TYPES.includes(st.type)) problems.push(`${id} 第 ${i + 1} 步 type=${st.type}`);
    }
    if (existsSync(metaPath)) {
      const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
      if (meta.renderer && !RENDERERS.includes(meta.renderer)) {
        problems.push(`${id} meta.renderer=${meta.renderer}`);
      }
    }
  }
  assert.deepEqual(problems, [], '有课件用了引擎画不出来的步骤或渲染器：\n' + problems.join('\n'));
});

test('三个脚本都从 course-schema 取清单，不再各留一份', () => {
  for (const name of ['new-course.mjs', 'validate-courses.mjs', 'score-course.mjs']) {
    const src = readScript(name);
    assert.match(src, /from '\.\/course-schema\.mjs'/, `${name} 没有引用 course-schema.mjs`);
    assert.doesNotMatch(src, /^const RENDERERS = \[/m, `${name} 又手抄了一份 RENDERERS`);
    assert.doesNotMatch(src, /^const ACTIONS = \[/m, `${name} 又手抄了一份 ACTIONS`);
    assert.doesNotMatch(src, /^const TYPES = \[/m, `${name} 又手抄了一份步骤类型表`);
    assert.doesNotMatch(src, /'poemNote',\s*'senses'/, `${name} 里还留着步骤内联列表`);
  }
});

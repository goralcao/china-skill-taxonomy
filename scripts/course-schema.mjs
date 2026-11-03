/**
 * 课件层的结构常量——只此一份，别再复制到各个脚本里。
 *
 * 起因：new-course / validate-courses / score-course 各抄了一份白名单，
 * 语文的 poemNote、draft、checkup 加进校验脚本时忘了同步脚手架，
 * 结果 `--renderer=poemNote` 被脚手架挡下，只能先生成 text 再手改 meta。
 *
 * 所以这里的 renderer 与 step 类型不从硬编码来，而是**从引擎源码里解析**：
 *   templates/renderers.js  → global.CR 的键（能画什么）
 *   templates/engine.js     → RENDER 表的键（能走什么步骤）
 * 源码改了常量自动跟上；常量被误改，course-schema.test.mjs 会红。
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(here, '..');

export const TEMPLATES = ['explain', 'drill', 'explore', 'review'];
export const STATUSES = ['draft', 'reviewed', 'deprecated'];
export const ACTIONS = ['比较', '分解', '变换', '逼近', '累积', '模拟', '构造', '辨析', '构思'];
export const MAX_BYTES = 300 * 1024;

/** CR 里不是呈现器的成员：图谱连接件与工具函数，不能当 meta.renderer 用 */
const CR_UTILITIES = new Set(['graphNav', 'extend', 'graphHref', 'reduced']);

/** 引擎里只做流程包装、不当「主呈现器」的步骤 */
const CONTROL_STEPS = new Set(['intro', 'summary', 'quiz', 'choice']);

/** 语文的一次「交互」= 一次动手环节，不是一道题 */
export const LANG_ACTIONS = [
  'quiz', 'choice', 'annotate', 'draft', 'rubric', 'sentBuild', 'pairMatch',
  'transform', 'punctPick', 'predict', 'poemNote', 'senses', 'checkup',
  'pinyin', 'story', 'readAloud', 'writeChar',
];

/** 从 startIdx 处的 `{` 开始配平，返回闭合 `}` 的下标（跳过字符串与注释） */
function matchBrace(src, startIdx) {
  let depth = 0;
  for (let i = startIdx; i < src.length; i++) {
    const ch = src[i];
    if (ch === '/' && src[i + 1] === '/') {
      i = src.indexOf('\n', i);
      if (i < 0) break;
    } else if (ch === '/' && src[i + 1] === '*') {
      i = src.indexOf('*/', i);
      if (i < 0) break;
      i += 1;
    } else if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch;
      for (i += 1; i < src.length; i++) {
        if (src[i] === '\\') i += 1;
        else if (src[i] === quote) break;
      }
    } else if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/** 取出 `marker`（形如 `global.CR = {`）这个对象字面量里第一层的键 */
function objectKeys(src, marker, keyIndent) {
  const at = src.indexOf(marker);
  if (at < 0) throw new Error(`源码里找不到 ${marker}`);
  const open = src.indexOf('{', at);
  const close = matchBrace(src, open);
  if (close < 0) throw new Error(`${marker} 的括号没有闭合`);
  const body = src.slice(open, close);
  const re = new RegExp(`^\\s{${keyIndent}}([A-Za-z0-9_]+)\\s*:`, 'gm');
  return [...body.matchAll(re)].map(m => m[1]);
}

/** 读源码，得到引擎真正支持的两份清单 */
export function readCatalog(root = ROOT) {
  const renderersSrc = readFileSync(join(root, 'templates', 'renderers.js'), 'utf8');
  const engineSrc = readFileSync(join(root, 'templates', 'engine.js'), 'utf8');
  return {
    crKeys: objectKeys(renderersSrc, 'global.CR = {', 4),
    stepTypes: objectKeys(engineSrc, 'var RENDER = {', 6),
  };
}

const catalog = readCatalog();

/** CR 里真能画东西的那些（去掉图谱连接件） */
export const CR_RENDERERS = catalog.crKeys.filter(k => !CR_UTILITIES.has(k));

/** content.steps[].type 的合法值：就是引擎 RENDER 表里有的 */
export const STEP_TYPES = catalog.stepTypes;

/**
 * meta.renderer 的合法值。
 * 数学课件写呈现器名（vertical / circle），语文课件写主步骤名
 * （poemNote / draft / checkup），两种都算数，所以取并集。
 */
export const RENDERERS = [
  ...new Set([
    'text',
    ...CR_RENDERERS,
    ...STEP_TYPES.filter(t => !CONTROL_STEPS.has(t)),
  ]),
];

/** 按学科给脚手架用的推荐值，省得每次都去翻源码 */
export const SUGGESTED = {
  语文: LANG_ACTIONS.filter(t => t !== 'quiz' && t !== 'choice'),
  数学: ['vertical', 'geometry', 'numberline', 'circle', 'circleMeasure', 'fracMeaning', 'decimal', 'counter', 'chart'],
};

# 前置诊断

图谱能告诉你「这一步依赖什么」，但回答不了「他到底卡在哪」。
前置诊断就是补这一块：选一个目标知识点，出几道题，答错就沿先修边往回追，
直到追出「从哪一步开始没学会」。

线上入口：图谱页 → 点任意知识点 → 面板上方「🧪 测一测」。
工具栏的「◎ 可测 50」可以只显示有题的点。

## 能做什么，不能做什么

| 能做 | 不能做 |
|---|---|
| 判断某个知识点**有没有**建立起来 | 判断「数学好不好」「考多少分」 |
| 顺着先修边找到**具体的**卡点 | 替代老师判断「为什么不会」 |
| 给出按年级从低到高的补课顺序 | 保证补完就一定跟上（诊断只覆盖有题的点） |
| 把孩子实际答的题留成记录 | 认识题型以外的能力（口算速度、阅读速度） |

**覆盖率是硬约束。** 题库只覆盖 50 / 1273 个知识点（3.9%），全部来自已经做过课件的点。
其余 1223 个点没有题，诊断会直接说「这个点还没有诊断题」，并列出相邻的可测点——
不假装能测。

## 判定规则

一道题说明不了什么。整套规则都在处理「怎么用几道题下一个不那么武断的结论」。

1. **连续答对 `need` 题才算掌握**，`need = min(2, 该点题数)`。只答对一道可能只是蒙对。
2. **中途答错，不立刻判不会**，而是就这个点再出一道更基础的确认题：
   - 确认题**对** → 记「不稳」（shaky）。会，但不牢。**不往回追。**
   - 确认题**也错** → 记「薄弱」（weak）。**这时才向先修回溯。**
3. 答对就把它所有先修标成「推断掌握」，不再问——省题，但结果页会区分
   「直接测得」和「推断得出」。
4. 没有题的点标「未测」，不阻塞、不回溯。

第 2 条是关键。一次对一次错，更可能是粗心或不熟；两次都错，才足以说明这个点没建立。
如果把「答错一次」直接当成「不会」，孩子会被拖回去重学一堆其实会的东西。

**回溯顺序**：先硬先修（hard），再辅助先修（soft）；同级按 `topics.json` 的顺序。
栈是深度优先的——先把这个点的先修问完，再问上一个点的下一个先修。

**根因**：判了薄弱、但它的先修里没有别的薄弱点，就是根因。先在硬先修链上找，
硬链上找不到（薄弱的都是顺着软边追下来的）再放宽到全部先修。

## 题库

`data/questions.json`，由 `scripts/build-questions.py` 从课件里抽。

题目来源只有一处：`courses/*/content.json` 里可判分的环节。不从别处另写一套，
否则课件改了题、题库没改，学生测出来的和课上讲的对不上。

| 课件里的类型 | 抽成 | 说明 |
|---|---|---|
| `quiz` | `numeric` | `answer` 是数字，`unit` 并进题干 |
| `choice` | `choice` | `misconception` 变成每个错项的「为什么错」 |
| `pinyin` | `choice` | 题干由词语和目标字位置拼出来 |
| `story` | 不抽 | 问的是「故事里这个人错在哪一步」，没读故事没法答 |

**排除**：`soft: true` 的题（语文课上「点一种看看推出什么结果」，不判错，不能用于判分）、
题干含「上图」「这四项加起来」这类指代而离开课件就没法作答的题。

字段：

| 字段 | 说明 |
|---|---|
| `id` | `<topicId>_q<N>` |
| `topicId` | 必须存在于 `data/topics.json` |
| `type` | `choice` / `numeric` |
| `difficulty` | `basic`（计算）/ `standard`（概念）。首题出 standard，确认题出 basic |
| `prompt` | 自包含题干，不依赖课件上下文 |
| `answer` | choice 是选项文字，numeric 是纯数字 |
| `choices` | choice 必填 |
| `explanation` | 答后展示 |
| `refute` | 每个错项一句「为什么错」，答错时只说错的那一条 |
| `origin` | `courses/<id>/content.json#step<N>`，改课件后可对照 |

## 现状与局限

- **109 题 / 50 个点**。35 个点 2 题，12 个点 3 题，3 个点只有 1 题。
  只有 1 题的点答对一次就判掌握，偏松——`validate-questions.mjs` 会对这 3 个点报警告。
- **题目和解析都出自课件原文，未经教师独立复核**（`audited: false`）。
  这和知识图谱、课件层是同一条限制：AI 生成的初稿，需要一线教师过一遍。
- **没有独立答案核验**。数学的数值题本可以像课标对齐那样做「表达式复算」，
  但现在题干是中文，答案表达式要人工写，暂未做。`refute` 也是课件作者写的，
  和答案同源——它能帮学生看懂错在哪，不能当作独立校验。
- **4 个手写课件不在题库里**（`mt_addsub-10000`、`mt_rect-area`、`mt_time-hms`、
  `mt_phys-s-momentum-conservation`）。它们没有 `content.json`，题目没有结构化，
  抽不出来。要补，得先把这 4 个课件改成引擎格式，或者单独手写题。

## 代码

| 文件 | 职责 |
|---|---|
| `templates/diagnose.js` | 引擎。纯函数、无 DOM、UMD，浏览器挂 `window.DiagEngine`，Node 里 `require` 可测 |
| `viz/diagnose.js` | 发布产物（build 时复制） |
| `viz/questions.js` | 题库，按需加载（46KB，不点「测一测」不下载） |
| `viz/index.html` | 出题与结果的界面（`startDiag` 起，约 300 行） |
| `scripts/build-questions.py` | 从课件抽题 |
| `scripts/validate-questions.mjs` | 题库校验：答案在选项里、题干无残留标签、出处可追溯 |
| `tests/diagnose.test.mjs` | 规则测试，18 项 |

引擎的会话对象可 JSON 序列化，所以刷新不丢进度：

```js
const G = DiagEngine.buildGraph(topics, deps, questions);
let s = DiagEngine.createSession(G, 'mt_dec-div', { limit: 12 });
const it = DiagEngine.nextItem(G, s);        // { topicId, question, attempt, why, ... }
s = DiagEngine.applyAnswer(G, s, 'wrong');  // 不改入参，返回新会话
const sum = DiagEngine.summarize(G, s);      // { roots, weak, shaky, mastered, path, ... }
```

浏览器里进度存在 `localStorage['stx.diag.v1']`，只留最近一轮、只对同一个目标生效；
诊断做完就清掉。

## 校验

```bash
node tests/diagnose.test.mjs       # 规则测试
node scripts/validate-questions.mjs  # 题库结构与自包含性
```

`validate-questions.mjs` 查的是「抽得对不对」，不查「题出得好不好」——
后者只有一线教师能判。

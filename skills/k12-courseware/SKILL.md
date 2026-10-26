---
name: k12-courseware
description: 把一个知识点做成单文件互动课件，或体检/改写已有课件。整合四条线——图谱定位、教学设计、可视化教学法、数值内核——产出必须通过 validate-courses 和 score-course。触发场景：做课件、生成课件、把这个知识点做成课件、课件改写、课件评分、课件为什么这么设计、三年级下除法课件。
---

# 做一个站得住的课件

不是「把知识排版成网页」。顺序是：**先定学生要做一个什么动作，再定用什么图，最后才写页面**。

四条来源各管一段，别混着用：

| 来源 | 借什么 | 用在哪一步 |
|---|---|---|
| 本仓库图谱 | 前置、解锁、课标、教材单元 | 第 0 步 |
| math-viz-kit（V1–V8） | 值不值得可视化、怎么分步揭示 | 第 1、3、4 步 |
| anthropics/k12-teacher-skills | 可观察的目标、前测、形成性检测、迷思干扰项 | 第 2 步 |
| edulab | 数值内核与模板分离，答案不手写 | 第 5 步 |

## 输入

- 一个 `topicId`（推荐）：`data/topics.json` 里的 id，如 `mt_mult-1digit`
- 或一句人话：「三年级下 除数是一位数的除法」——先按关键词查出 id，再往下走
- 或一个已有课件目录：走「改写」分支，先跑 `node scripts/score-course.mjs <dir>`

## 第 0 步 · 从图谱里把这个点取出来

```bash
python3 - <<'PY'
import json
T={t['id']:t for t in json.load(open('data/topics.json'))['topics']}
E=json.load(open('data/dependencies.json'))['dependencies']
tid='mt_mult-1digit'
t=T[tid]
print(t['name'], t['gradeRangeStart'], t['standards'])
print('前置', [(e['prerequisiteId'],e['strength']) for e in E if e['topicId']==tid])
print('解锁', [e['topicId'] for e in E if e['prerequisiteId']==tid])
PY
```

拿到四样东西：前置（学生必须会的）、解锁（学完往哪走）、课标编号、年级。

- 主题已有课件 → 改写分支，别新建
- 前置超过 4 个 → 这节课要压缩，挑最硬的两条写进 meta
- 年级跨度大（混龄主题）→ 以 `gradeRangeStart` 为准写内容

## 第 1 步 · EVAL：这个点值不值得做课件

三问，**至少一个 yes** 才继续：

1. 有没有「变与不变」的动态关系？（分针转一圈 = 1 小时；底不变高变大，面积跟着变）
2. 学生的典型误区能不能被过程直接纠正？（分母变大，分数反而变小）
3. 静态图要画好几张才说得清？

三个都 no，就停。拼音、古诗、单词表、课文结构，做成网页只是把纸搬上屏幕，不如做练习。

把结论写成一行，后面所有设计都围着它：

```
核心动态关系：____ → ____ → ____
```

## 第 2 步 · 教学设计（先写下来，再写 JSON）

产出五行，进 `meta.json`：

1. **目标 3 条，动词可观察**：能算出、能指出、能说明。不写「理解」「掌握」——没法验收。
2. **前测 1 题**：从前置知识点里出。答错说明先修不够，不是这节课的问题。
3. **主线**：情境 → 操作 → 归纳 → 符号 → 应用。顺序不能倒（V5：操作先于符号）。
4. **形成性检测 2–3 题**：每题必须写 `misconception`，错项来自学生真会犯的错，不是凑数。
5. **分层**（可选）：基础层一句、进阶层一句，放进 `summary.advice`。

> 判断标准：把教案给一个没教过这节课的老师，他能不能照着你写的目标判断「学生会不会」。

## 第 3 步 · 定一个认知动作，再选呈现方式

`cognitiveAction` 只能填一个：`比较` / `分解` / `变换` / `逼近` / `累积` / `模拟` / `构造`。

| 动作 | 学生的心理操作 | 常用 renderer | 典型课 |
|---|---|---|---|
| 分解 | 把整体拆成部分再合起来 | `vertical` `/` `geometry(fraction)` | 竖式、分数初步 |
| 累积 | 一个一个加起来，看总量 | `geometry(rectGrid/perimeter)` | 面积、周长 |
| 比较 | 两个量比大小、比倍数 | `numberline` `/` `geometry(rectGrid)` | 倍的认识、吨 |
| 变换 | 图形动了，量没变或按规律变 | `geometry(cut)` `/` `coords` | 剪拼、平移旋转 |
| 逼近 | 越来越接近某个值 | `numberline` `/` `chart` | 估算、极限（高中） |
| 模拟 | 条件变了，结果怎么变 | `sim` | 动量守恒、电路 |
| 构造 | 按规则把对象搭出来 | `solid` `/` `geometry` | 长方体、展开图、作图 |

选两个就是两节课。硬塞在一节里，学生会记住动画，记不住关系。

## 第 4 步 · 排步骤（8–10 步）

- 第 1 步用**一个具体的错**或**一个具体的问题**开场，不用「今天我们来学习……」。
  好：`208 × 4，错的人大多错在这一位`
  坏：`本节我们将学习多位数乘一位数`
- 一步只做一件事。`text` 步超过 3 条 bullet 就该拆。
- 可视化步骤要给 `demo`（`vertical` / `perimeter` / `fraction` 自带逐位/逐边/逐份演算），它是这节课的核心动作。
- 公式和结论放在操作之后，别放页首。
- 小结 3 条 + 一句「接着学什么」，指向 `meta.next` 里真实存在的主题。
- 一屏最多 3 种强调色，颜色只表达一件事（V4）。

**练习步骤不加演示**。给正在做的题配「一步一步算」，等于把答案递过去。

## 第 5 步 · 数值内核：答案不要手写

content.json 里的每个数字都要能从题目条件算出来。先算，再写。

```bash
python3 - <<'PY'
a, b = 208, 4
digits = [int(c) for c in str(a)][::-1]
carry = 0
for i, d in enumerate(digits):
    p = d * b + carry
    print(f'第{i+1}位 {d}×{b}+{carry}={p}，写{p%10}，进{p//10}')
    carry = p // 10
print('结果', a*b)
PY
```

改一个数字要连带改三处讲解——这就是手写的代价。除法的试商/落数/减积还没有内核，先手算，把演算草稿留在 commit message 里。

## 第 6 步 · 生成、校验、打分

```bash
node scripts/new-course.mjs mt_xxx --template=explain --renderer=vertical
# 改 courses/mt_xxx/content.json 和 meta.json
python3 scripts/build.py
node scripts/validate-courses.mjs
node scripts/score-course.mjs mt_xxx
```

- **低于 90 分不提交**，按扣分明细逐条改
- 浏览器 390px 宽点一遍：能滑、能点、演示能停、答错有解释
- 产物必须单文件、零外链、小于 300KB

## 硬约束

- `reviewed` 的课件必须有 `cognitiveAction`、`standards`、≥2 道检测题、全部错项有 `misconception`
- `meta.prerequisites` / `meta.next` 必须是图谱里真实的边，不是猜的 id
- 动画只服务「核心动态关系」，装饰性动画删掉
- 不抄教材、教参、课标原文；讲解用自己的话

## 反模式

| 症状 | 改法 |
|---|---|
| 一屏三个知识点 | 拆课，或砍到只剩一个动作 |
| 逐字显示、闪烁、无意义的过渡 | 删，V1 不成立 |
| 答错只说「再想想」 | 写 `misconception`：学生为什么会这么想 |
| 练习步骤加「一步一步算」 | 泄题，去掉 |
| 小结写「继续加油」 | 指向 `next` 里具体的下一课 |
| 数字和讲解对不上 | 回到第 5 步，用脚本重算 |

## 文件在哪

| 要改什么 | 文件 |
|---|---|
| 步骤渲染 | `templates/engine.js` |
| 图形/竖式/数轴 | `templates/renderers.js` |
| 公共样式 | `templates/base.css` |
| 课件内容 | `courses/<topicId>/content.json` |
| 字段与流程说明 | `docs/COURSEWARE.md` |
| 评分口径 | `scripts/score-course.mjs` |

细节在 `references/`：`pedagogy.md`（八条规则怎么落地）、`steps.md`（十三种步骤的字段与写法）、`graph.md`（图谱关联的硬规则）、`rubric.md`（九维评分怎么补分）。

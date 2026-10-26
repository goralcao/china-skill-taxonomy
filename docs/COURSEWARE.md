# 课件层计划（Courseware）

> 状态：草案 · 2026-10-27 · 对应 v0.23 起
> 目标读者：维护者、贡献者、想要复用这套结构的团队

## 一、为什么加这一层

图谱回答「学什么、先学什么」，教学研究回答「怎么教」。这两层服务的是家长、老师和开发者，缺一个角色：**学生自己**。

学生拿着一句「掌握证据」没法自学。他需要的是：一个具体情境、一步步的操作、做错时的反馈、以及「我学完了」的确认。

所以第三层的形态不是文章，是**可交互、可完成、可回写**的课件。

## 二、边界

做：

- 每个课件绑定唯一 `topicId`，从图谱可直达
- 单文件 HTML，离线可用，无外部依赖、无追踪
- 完成状态回写图谱，参与「已掌握」判定
- 覆盖优先做「适合交互」的知识点，不强求全量

不做：

- 不做视频（编解码、TTS、渲染管线成本高，与静态站定位冲突）
- 不复制教材原题原文（自编或改编，出处只标课标与教材位置）
- 不做账号体系与云端同步（本地存储 + 导出，够用）
- 不做「AI 自动出题 + 自动判卷」的全自动闭环（正确性无法保证）

## 三、架构：四层与一个闭环

```
图谱层    1268 主题 · 1635 条先修 · 课标/教材锚点        （已有）
   ↓ 点击知识点
教学层    1268 条教学研究：教法 / 活动 / 诊断           （已有）
   ↓ 渲染
课件层    courses/<topicId>/  10~15 分钟交互页          （新增）
   ↓ 完成事件
反馈层    完成记录 → 掌握标记 → 缺口诊断 → 推荐下一篇     （新增）
   ↖______________________________________|
```

闭环成立的条件是「完成事件」可被图谱读到。做法：课件与图谱同源（同一域名/同一 `file://` 目录），课件结束时写 `localStorage["stx.course.<topicId>"] = {done, score, at}`，图谱读取后把该主题标为「有课件·已完成」，并与手动标记的「已掌握」分开展示。

## 四、数据模型

### 目录

```
courses/
  mt_math-3-time/
    index.html      # 自包含课件（内联 CSS/JS/SVG）
    meta.json       # 元数据
data/courses.json   # 构建产物：索引（不含正文）
schema/course.schema.json
```

正文不进入 `data/`，索引只保留元数据，避免把 4MB 的 `data.js` 继续撑大。

### meta.json

```json
{
  "topicId": "mt_math-3-time",
  "title": "时、分、秒：一小时为什么是 60 分钟",
  "template": "explain",
  "duration": 12,
  "interactions": 4,
  "grade": 3,
  "subject": "数学",
  "standards": ["math-2022:S1:NA:QTY"],
  "prerequisites": ["mt_math-2-clock"],
  "next": ["mt_math-3-date"],
  "objectives": ["能读出钟面上的时刻", "能换算时、分、秒"],
  "status": "reviewed",
  "author": "goral.cao",
  "license": "CC-BY-SA-4.0",
  "version": "1.0.0",
  "updatedAt": "2026-10-27"
}
```

字段约束：

| 字段 | 规则 |
|---|---|
| `topicId` | 必须存在于 `topics.json` |
| `template` | `explain` / `drill` / `explore` / `review` |
| `duration` | 5~25（分钟），与实际交互量匹配 |
| `interactions` | ≥2，且与 HTML 中 `data-step` 数量一致 |
| `standards` | 必须属于该主题已挂的课标编号 |
| `status` | `draft` / `reviewed` / `deprecated`，只有 `reviewed` 在图谱上显示入口 |
| `license` | 固定 `CC-BY-SA-4.0`（与内容层一致） |

### 索引 courses.json

```json
{
  "version": "v0.23.0",
  "schemaVersion": 1,
  "generatedAt": "2026-10-27",
  "counts": { "total": 12, "byTemplate": { "explain": 8, "drill": 4 }, "byStatus": { "reviewed": 10, "draft": 2 } },
  "courses": [ { ...meta.json, "path": "courses/mt_math-3-time/" } ]
}
```

## 五、四种模板

模板是「渲染器 + 交互组件库」，不是四套页面。内容以 JSON 传入，模板负责排版与判分。

| 模板 | 适用 | 页面结构 | 典型交互 |
|---|---|---|---|
| explain | 概念首次出现 | 情境 → 分步讲解（3~5 步）→ 中途检查 → 小结 | 点击揭示、拖拽排序、单选中途问 |
| drill | 计算、语法、拼写 | 示例 1 个 → 变式 4~6 题 → 错因反馈 → 复盘 | 输入判分、选项判分、逐步提示 |
| explore | 几何、物理、地理 | 参数面板 → 实时图形 → 观察任务 → 归纳 | 滑杆、拖点、切换条件 |
| review | 单元复习、错题 | 知识卡 → 连线/归类 → 综合题 | 匹配、分类、排序 |

共同要求：

- 每步一个 `data-step` 容器，支持键盘 `←/→` 切换
- 至少 1 个「易错点」提示，内容取自教学研究的 `assess.errors`
- 至少 1 个迁移题，取自 `assess.nextMoves`
- 结束页显示：用时、答对题数、掌握建议（对应 `assess.levels`）

## 六、生产流水线

### 脚手架

```bash
node scripts/new-course.mjs mt_math-3-time --template=explain
```

自动完成：

1. 从 `data/topics.json` 取主题名称、描述、掌握证据、课标、教材位置
2. 从 `data/teaching-research.json` 取 `pedagogy`、`activities`、`assess`
3. 生成 `courses/<topicId>/meta.json` 与 `index.html` 骨架，内容已填入可编辑的占位
4. 打印本地预览命令

### 人工改写

脚手架产出的是「结构完整的草稿」，需要人做的三件事：

- 把 `pedagogy` 的书面语改成对学生说的话（第二人称、短句）
- 为每个 `activity` 补一个可交互的动作（点、拖、输、选）
- 核对数字与事实（数学复算、文科核人名年代、英语核拼写）

### 校验

```bash
node scripts/validate-courses.mjs
```

规则见第七节。CI 中与 `validate.mjs` 并列执行。

### 批量

按「册」推进。一册 25~35 个知识点，两周一个批次：

```
周一  生成该册全部草稿（脚手架批量模式）
周二~周四  人工改写 + 抽检
周五  校验 + 预览 + 合并
下周一  随 patch release 发布
```

## 七、质量门槛

`validate-courses.mjs` 的检查项：

| # | 检查 | 失败后果 |
|---|---|---|
| 1 | `meta.json` 存在且字段齐全 | 阻断 |
| 2 | `topicId` 能在 `topics.json` 找到 | 阻断 |
| 3 | `template` 取值合法 | 阻断 |
| 4 | `standards` ⊆ 该主题的 `standards` | 阻断 |
| 5 | `interactions` 与 HTML 的 `data-step` 数一致 | 阻断 |
| 6 | HTML 无 `<script src=`、`<link href=` 外链 | 阻断 |
| 7 | 单文件 < 300KB | 阻断 |
| 8 | 含 `<html lang="zh-CN">`、`<title>`、`viewport` | 阻断 |
| 9 | 有 `data-step` 与「上一页/下一页」键盘处理 | 警告 |
| 10 | 有至少 1 处 `.pitfall`（易错点） | 警告 |
| 11 | `duration` 与 `interactions` 比例在 3~6 分钟/交互 | 警告 |
| 12 | 数学类：内联 `window.__ANSWERS` 中的数值能被 `eval` 复算通过 | 警告 |

正确性策略（按学科）：

- 数学：题干与答案写进 `window.__ANSWERS`，校验脚本用 Node 复算（后续接 sympy 做符号验算）
- 物理/化学：公式与单位显式校验（量纲表）
- 语文/历史：`window.__FACTS` 列出人名、年代、事件，人工核对清单
- 英语：`window.__WORDS` 词表校验拼写

## 八、闭环与推荐

### 完成回写

课件结束页调用：

```js
localStorage.setItem('stx.course.' + TOPIC_ID,
  JSON.stringify({ done: true, score: 0.8, at: Date.now(), v: '1.0.0' }));
```

图谱 `viz/index.html` 读取同前缀的键，在节点上叠加一个「小圆点」标记（区别于手动掌握的「金色环」）。

### 推荐下一篇

优先级：

1. 当前主题 `unlocks` 中尚未完成的、且课件存在的
2. 同册内 `next` 字段指定的
3. 同领域内 `centrality` 最高且未完成的

推荐卡片出现在课件结束页和图谱详情面板两处。

## 九、分发

- **GitHub Pages**：`courses/` 与 `viz/` 一起部署，自带 gzip，解决现在 4.1MB 未压缩的问题
- **深链**：`?t=<topicId>&course=1` 直接打开课件；课件结束可回跳图谱
- **学期包**：`courses/packs/grade-3-math-a.json` 列出该册课件顺序，供老师整册使用
- **打印**：每个课件提供 `?print=1` 的纯文本讲义视图（复用 `printArea` 逻辑）

## 十、路线图

| 阶段 | 时间 | 产出 | 验收标准 |
|---|---|---|---|
| P0 地基 | 1 周 | courses schema、校验器、脚手架、构建集成、Pages | `validate-courses` 通过；Pages 可访问；首屏 gzip 生效 |
| P1 样板 | 2 周 | 2 个模板 + 3 个样板（三年级数学 2、高中物理 1） | 手机上完整走完，完成状态回写图谱 |
| P2 一册 | 3 周 | 三年级数学上册全册（约 30 个） | 覆盖率 30/1268；发布 patch release |
| P3 闭环 | 2 周 | 推荐下一篇、学习路径转播放列表 | 从任一主题连续学 5 个不断链 |
| P4 扩展 | 持续 | 每两周新增一册；开放外部贡献 | 外部贡献者独立提交并合并 ≥3 个 |

## 十一、度量与节奏

`scripts/health.mjs` 每周输出：

```
课件覆盖率        3 / 1268（0.2%）
本周期新增        3
平均时长          12 分钟
平均交互          4.3
校验通过率        100%
孤立主题          0
连通分量          67（最大 7.6%）
课标未覆盖        11
首屏体积          4.1 MB / gzip 1.0 MB
```

数字变化自动开 issue（`health` 标签），避免「想不起来做什么」。

固定节奏：

- 每周一：health 报告
- 每周三：issue triage（内容 / bug / 结构三类）
- 每两周：patch release（课件包 + 修复）
- 每月：minor release（功能）
- 每季度：结构评审（schema 变更需迁移脚本）

## 十二、风险与取舍

| 风险 | 应对 |
|---|---|
| AI 生成内容出错 | 数学复算、文科事实清单、人工抽检 20% |
| 1268 个做不完 | 按册推进，公开覆盖率，不承诺全量 |
| 模板僵化 | 模板与内容分离，模板升级可批量重渲染 |
| 维护成本上升 | 课件是静态文件，无服务端；CI 只做静态校验 |
| 与教材版权冲突 | 不用原题原文，题目自编/改编，出处只标位置 |
| 完成标记失真 | 「课件完成」与「已掌握」分开显示，不自动等同 |

## 十三、决策记录

- **为什么单文件而不是构建式框架**：与 `viz/` 保持一致，`file://` 可直接打开，贡献者不需要装依赖；代价是模板复用靠复制而非 import，用脚手架缓解。
- **为什么元数据与正文分离**：索引要进 `data.js`，正文不能进；分离后索引可随图谱一起加载。
- **为什么不做视频**：链路长、成本高、难校验，且与「离线可用」冲突。
- **为什么先做三年级数学**：用户起点明确、交互性强、家长需求集中，适合验证模板；高中理科第二优先（3D/符号计算价值高但成本也高）。

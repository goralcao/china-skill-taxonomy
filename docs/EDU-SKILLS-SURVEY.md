# 教育类 Agent Skills 生态调研

调研时间：2026-10-27 · 目的：判断外部现成技能能不能接进本项目的课件层，哪一部分值得借，哪一部分不该碰。

## 一句话结论

现成的教育技能已经覆盖了「一道题」「一节课」「一个知识点」三种颗粒度，而且做得不差。但它们都停在**单点**上，缺的是**点与点之间怎么连**——哪个知识点该先学、这节课对应课标哪一条、学完往哪走。这恰好是本项目的地基。

所以正确的姿势不是「装一个技能替掉我们」，而是**它们做插件，我们做底座**：图谱负责路由（今天该学什么、前置够不够），技能负责把选中的那一个点做成页面。

## 调研范围

GitHub 仓库 + 官方文档 + 中文社区实操文章。筛选标准四条：能不能脱离作者环境跑、输出是什么形态、许可证是否允许二次使用、最近半年有没有维护。

## 四类技能

### 1. 备课与教学设计（课时级）

**[anthropics/k12-teacher-skills](https://github.com/anthropics/k12-teacher-skills)** — Apache-2.0，592 ★，2026-10 仍在更新。

Anthropic 官方为 Claude for Teachers 做的四个技能，附带一整套 eval 评分表：

| 技能 | 干什么 |
|---|---|
| `k12-lesson-plan-creation` | 从零写一节课：教案 + 学生材料 + 观察表，按学科路由到不同教学法 |
| `k12-lesson-differentiation` | 把已有的一节课改成三层（低于/达到/高于熟练） |
| `k12-lesson-prep` | 陪老师先把学生要做的任务自己做一遍，留一份备课笔记 |
| `k12-check-for-understanding` | 出 1–3 道 formative 小题，**干扰项来自有文献记录的迷思概念** |

两处值得直接抄思路：

- **eval rubric**。`evals/*/rubrics/*.csv` 把「一节好课」拆成可打分的行（clarifying_question、differentiation、math……）。我们的教学研究层现在只有字段和长度校验，没有质量评分——1200 多条记录里哪一条写得好，机器判断不了。
- **干扰项 = 迷思概念**。它出选择题不是随便凑三个错项，而是从学生真实会犯的错里取。我们的 `choice` 步骤现在错项是手写的，答错只显示「再想想」，浪费了一次纠错机会。

局限：课标体系是 CCSS / NGSS，字段是美式的；接不进我们的 `math-2022:S2:NA:NO` 编号，只能当写作参考。

**[ahao2001/teaching-materials](https://github.com/openclaw/skills)**（openclaw 收录）— 中小学课件、教案、任务单、单元卷的文档生成，模板驱动。工程上没太多可借的，胜在把「课型」列全了（新授/复习/练习/讲评）。

### 2. 知识点可视化（单点级）

**[edu-ai-builders/math-viz-kit](https://github.com/edu-ai-builders/math-viz-kit)** — 无许可证，83 ★，2026-04 后基本停更。

123 个交互式数学工具，小学 23 / 初中 23 / 高中 37 / 大学 44，每个是单文件 HTML，原生 Canvas/SVG，零构建。小学部分和我们已有的课件正面撞车：进位加减法、分数条比较器、周长走边框、时间与钟表、有余数除法、面积铺砖。

真正有价值的是它的两份文档：

- `数学可视化-skill.md`：EVAL（值不值得可视化）/ PRD（交互与布局）/ CODE（出 HTML）三模式。
- `system/教学法规则库-v1.md`：八条可执行规则，每条都是「一句话指令 → 研究依据 → 怎么落地 → 反面案例」。摘几条：
  - **V3 分步揭示**：初始只显示最小可理解单元，用户点了才展开，永远给重置入口。
  - **V5 操作先于符号**：公式默认隐藏，操作完再让公式「由现象归纳出来」。
  - **V7 单一认知动作**：一个页面只承载一个动作（比较/分解/变换/逼近/累积/模拟），多个就拆页。
  - **V8 概念反馈**：反馈不说对错，说「你刚才发现了什么」，最值钱的是揭示不变量。

**注意：仓库没有 LICENSE 文件**，默认保留所有权利。代码一行都不能复制，设计规则可以读、可以自己重写。

**[wy51ai/edulab](https://github.com/wy51ai/edulab)** — Apache-2.0，1674 ★，2026-10-23 还在更新，就是你看到的那套。

六个技能：立体几何 3D、解析几何 2D、化学反应 3D、数学/物理/化学讲解视频。架构比内容更值得看：

```
skills/edu-solid-geometry/
├── SKILL.md              # 给模型看的流程
├── template/lesson.html  # 数据驱动模板，一个 3D 渲染器吃所有题型
├── lib/geometry_kernel.py# sympy 精确计算：坐标、向量、答案
├── scripts/generate.py   # 命令行入口，不经过模型也能跑
└── references/           # 题型配方
```

三条设计值得记：

1. **kernel 与模板分离**。图形里的顶点、推导里的数值、答案卡上的结果来自同一份 sympy 计算，不会出现图上 30°、讲解说 60°。
2. **数据驱动模板**。加一个 `build_cone_volume()` 就多一种题型，前端不动。
3. **旁白驱动动画**。「指 → 动 → 留」按句子时间轴定位，不写死秒数。

它的问题是输出形态：Three.js / KaTeX 走 CDN，单个页面动辄几百 KB。这和我们「零依赖、单文件、离线可开」的硬约束直接冲突。

### 3. 讲解视频（成品级）

edulab 的 `edu-math-video` / `edu-physics-video` / `edu-chem-video`，以及 Manim 系 MCP（Manim Composer、manim-mcp）。

数学是手绘笔记本风、化学是墨绿黑板、物理是深蓝蓝图，1920×1080 MP4 + 中英字幕，TTS 用 GLM（付费）或 edge-tts（免费兜底）。质量确实能直接发 B 站。

对本项目的判断：**不做**。TTS 依赖外部 key，MP4 不进 git，一条视频几分钟的渲染时间也没法在 CI 里跑。但「分镜脚本」这个中间产物可以借——它要求每句旁白都对应图上一个动作，正好可以用来写课件的 `demoHint`。

### 4. 数据与工具底座

- **[Learning Commons Knowledge Graph](https://claude.com/connectors/learning-commons-knowledge-graph)**：美国各州课标 + 每条标准下面的进阶链。结构和我们几乎同构（标准 → 进阶 → 知识点），但覆盖的是美国课标，不能直接用；它的「connector 形态」值得学——图谱不该只是网站，应该能被别的 agent 查询。
- **GeoGebra 系**（如 `teaching-plan-analytic-geometry`）：自托管 GeoGebra + React 组件，交互能力强，但需要一个几十 MB 的 web3d 包，和单文件原则不兼容。
- **Wolfram Alpha / Fermat MCP**：精确计算兜底，属于「模型算错了怎么办」这一层，和 edulab 的 kernel 是同一个思路的两种实现。

## 对照表

| 项目 | 颗粒度 | 输出 | 外部依赖 | 许可 | 对本项目 |
|---|---|---|---|---|---|
| k12-teacher-skills | 一节课 | docx / 网页 | 课标 connector（可选） | Apache-2.0 | 借 eval 思路、迷思概念 |
| math-viz-kit | 一个知识点 | 单文件 HTML | 无 | **无 LICENSE** | 借 V1–V8 规则，代码不可用 |
| edulab（几何/化学） | 一道题 | HTML（CDN） | Three.js / KaTeX / sympy | Apache-2.0 | 借 kernel 分离、模板驱动 |
| edulab（视频） | 一道题 | MP4 | TTS key / ffmpeg | Apache-2.0 | 不接，借分镜写法 |
| teaching-materials | 一节课 | PPT / docx | 无 | 未标注 | 借课型清单 |
| Learning Commons KG | 一条标准 | API | 官方 connector | 专有 | 只作结构参照 |

## 三个能落地的改动

按性价比排，都不大，但都指向同一个方向：**让课件从「排版正确」走向「教学正确」**。

### P0 · 错项写清「错在哪」（已落地 v0.26.2）

`choice` 步骤增加可选字段 `misconception`：每个错项配一句为什么学生会这么想，答错时显示这句而不是「再想想」。

这同时满足 math-viz-kit 的 V8（反馈要揭示规律）和 k12-check-for-understanding 的做法（干扰项来自真实迷思）。校验规则：`misconception` 的 key 必须是选项之一，且不能等于正确答案。

落地时顺带修了一个潜伏的 bug：选择题的反馈节点原来是在点击时才塞进 `DocumentFragment`，而片段插入页面后就空了，所以 `hint` / `why` 其实一直没显示。改成渲染时留一个空槽位，点击只换内容。

### P1 · 每课声明一个认知动作

meta.json 增加 `cognitiveAction`，取值限定在 `比较 / 分解 / 变换 / 逼近 / 累积 / 模拟 / 构造`。V7 说一个页面只承载一个动作——声明出来，超范围的内容就得拆到下一课。

好处是它和图谱能对上：`分解`（竖式拆数位）、`变换`（图形剪拼）、`模拟`（动量守恒）本来就是不同的教学路径，将来可以按认知动作给课件分组，而不是按学科。

### P2 · 竖式的答案不要手写

现在 `208×4=832` 是写在 `content.json` 里的。人写的题会错，而且改一个数字要连带改三处讲解。edulab 的做法是用 kernel 算：`scripts/kernel/vertical.py` 接收 a、b、op，输出每一数位的积、进位位置、逐步文案，build 时写进 content.json。

同样的逻辑正好能解决三年级下的除法竖式——试商、落数、减积，手写极易错。

### 不做的事

- **引入 Three.js**：单文件 300KB 上限立刻破。真要 3D，用几十行等轴投影画 SVG 就够。
- **接 TTS 视频流水线**：产物不可版本管理，失败重试成本高。
- **整包安装 k12-teacher-skills 当生产依赖**：课标体系不同，只能当写作时的参考读物。

## 许可提醒

- **Apache-2.0**（k12-teacher-skills、edulab）：可商用、可改，但分发时要保留 `LICENSE` 和 `NOTICE`，改过的文件要注明。
- **无 LICENSE**（math-viz-kit）：默认保留所有权利。读它的规则、自己重写实现，是安全的；复制 HTML 源码进本仓库，不是。
- **本项目的许可不受影响**：上述内容一行都没进 `data/`，课件全部原创。

## 链接

- https://github.com/anthropics/k12-teacher-skills
- https://github.com/edu-ai-builders/math-viz-kit
- https://github.com/wy51ai/edulab
- https://github.com/xdelin/awesome-agent4edu （教育类 MCP / Skills 汇总清单）
- https://claude.com/connectors/learning-commons-knowledge-graph

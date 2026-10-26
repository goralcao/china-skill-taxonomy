<div align="center">

<h1>学阶图谱 · China Skill Taxonomy</h1>

<p><strong>1268 个微主题，按先修关系连成一张图。</strong><br>
每个主题写清楚三件事：学什么，会到什么程度算会，卡住了该往回补哪一步。</p>

<p>对齐义务教育（2022 年版）与普通高中（2017 年版 2020 年修订）课程标准<br>
覆盖 12 个学科、1~12 年级，每个主题配一份教学研究</p>

<p>
<img src="https://img.shields.io/badge/version-v0.22.4-blue?style=flat-square" alt="version">
<img src="https://img.shields.io/badge/subjects-12-informational?style=flat-square" alt="subjects">
<img src="https://img.shields.io/badge/topics-1268-brightgreen?style=flat-square" alt="topics">
<img src="https://img.shields.io/badge/prerequisite%20edges-1629-blueviolet?style=flat-square" alt="prerequisite edges">
<img src="https://img.shields.io/badge/data-ODbL%201.0-orange?style=flat-square" alt="data license">
<img src="https://img.shields.io/badge/content-CC%20BY--SA%204.0-yellow?style=flat-square" alt="content license">
<img src="https://img.shields.io/badge/format-JSON%20%2B%20single--file%20HTML-success?style=flat-square" alt="format">
</p>

<img src="docs/screenshot-star.png" width="100%" alt="学阶图谱：12 个学科、1268 个微主题的先修依赖星图">

</div>

在线预览：<https://acd118508358062b1.app.workbuddy.host/?sharecode=DHL4TJAQCG>

> v0.22.4 · 主题 1268 · 先修依赖 1629（hard 942 / soft 687）· 课标条目 186 · 域摘要 204 · 教学研究 1268 · 教材版本 26 · 学科 12

## 目录

- [这是什么](#这是什么)
- [项目特点](#项目特点)
- [已知的不足](#已知的不足)
- [覆盖范围](#覆盖范围)
- [快速开始](#快速开始)
- [数据说明](#数据说明)
- [数据来源与参考项目](#数据来源与参考项目)
- [许可证](#许可证)
- [路线图](#路线图)
- [贡献](#贡献)

## 这是什么

课标给范围和顺序，教材给章节和例题。家长拿着这两样东西，通常还是会卡在三个问题上：这个知识点要先会什么；学到什么程度算会；孩子说不会，该往回补哪一步。

这个项目把这三个问题做成数据。每个知识点是一个节点，先修关系是有向边，节点上挂着掌握证据、一句可以照着问的检查问题，以及一份「怎么教」的说明。全部以 JSON 发布，可以直接读，也可以接进自己的程序。

跟一份课标目录放在一起看，差别主要在这几处：

| | 课标目录 | 这里 |
|---|---|---|
| 一条记录是什么 | 一个领域或一章 | 一个知识点 |
| 记录之间 | 并列，没有先后 | 有先修边，标注硬依赖 / 软依赖和理由 |
| 学完的判据 | 范围要求 | 可观察的掌握证据 + 一句检查问题 |
| 给机器用 | PDF 或网页 | JSON + JSON Schema + 逐文件校验和 |

用的人大致分两类。一类是家长和老师，查某个年级该会什么，看孩子卡在哪一环，或者对照课标和教材定位一个知识点。另一类是开发者，把图谱接进自适应练习、课程规划、教材比对这类东西里。

## 项目特点

### 切到一节课讲得完的粒度

1268 个主题，大多数是一节课的量级，比如「20 以内进位加法」「定语从句」「动量守恒定律」。

切细的理由很实际。孩子说「函数没学好」，你没法直接补「函数」这一章。顺着依赖图往下走，可能断在「定义域」，也可能断在「单调性」的判断。定位到具体那一格，补起来才有数。

### 依赖写成图，不写成目录

1629 条边，每条标了 hard（不会先修就学不了）或 soft（有帮助但非必需），并附一句知识层面的理由，比如「动量守恒由动量定理在系统上推广」。

边反过来读就是「学会这个能解锁什么」。初中到高中的跨学段连接也在里面，所以补前置能一直往回追到小学。

### 每个主题配一份教学研究

1268 条记录，和主题一一对应。一条记录里有：教学要点与常见错误、两三个可以真做的活动（每个活动写了希望孩子体会到什么、做错了怎么反馈、为什么这么安排）、教学边界，以及一个诊断任务，分「不会 / 发展中 / 达标」三档，附典型错误和下一步。

这些文字是 AI 写的，经过结构校验，但没有经过实证验证。用法和边界见[下面的说明](#一条教学研究节选)。

### 课标和教材都落到具体编号

186 条课标条目，来自义务教育 2022 年版和普通高中 2017 年版 2020 年修订。每个主题挂 1~3 条编号，点开能看到该编号对应哪个领域、哪条要求。

教材做到单元级：26 套版本、册次和单元目录。其中包含 2024 年版修订教材的逐单元映射（137 条，多数附迁移说明），以及北师大版、苏教版数学和外研社版英语三套替代版本的对照。

### 可视化只有一个 HTML 文件

`viz/index.html` 加一个 `data.js`，没有构建步骤，没有外部依赖，也不用起服务器。三种布局（星图、长卷、热力），能搜索、按年级和领域筛选、追先修闭包、生成学习路径、标记已掌握。视图状态写进网址，复制链接就能定位到某个知识点。手机上单指平移、双指缩放。

### 数据可以自己重建

`data/` 里的 JSON 由 `src/` 的 Python 模块生成。`validate.mjs` 检查结构、引用完整性、DAG 有没有环、年级规则，以及每个文件的 SHA-256 是否对得上。改完数据跑三条命令，就知道有没有改坏。

<div align="center">
<img src="docs/screenshot-panel.png" width="100%" alt="主题详情：先修诊断、掌握证据、家长检查法、课标对齐与教材位置">
<img src="docs/screenshot-research.png" width="100%" alt="教学研究：教学要点、学习活动、诊断任务与来源">
<img src="docs/screenshot-mobile.png" width="24%" alt="移动端：单指平移、双指缩放、底部抽屉详情">
</div>

## 已知的不足

写在这里，省得用的人自己踩。

- 教学研究是 AI 撰写、经结构校验，但没有实证验证，来源也没有逐条联网复核。当参考，别当处方。
- 初中数学九下、初中语文和英语的部分册次仍用通行版目录，等修订版发布后替换。
- 1200 多个节点挤在一张星图里，1440 宽的屏幕上会偏密。星图适合看整体结构；找具体内容建议用搜索，或者先按学科筛一遍。
- 目前只有中文。术语和课标编号是中文体系的，翻成英文会失真，暂时没做。

## 覆盖范围

<img src="docs/screenshot-heatmap.png" width="100%" alt="知识点密度矩阵：12 个学科 × 1~12 年级">

| 学科 | 主题数 | 依赖边 | 课标条目 | 教学研究 | 年级 |
|---|---:|---:|---:|---:|---|
| 数学 | 234（小学 96 + 初中 82 + 高中 56） | 385 | 32 | 234 | 1~12 |
| 语文 | 177（小学 55 + 初中 67 + 高中 55） | 222 | 30 | 177 | 1~12 |
| 英语 | 140（小学 37 + 初中 55 + 高中 48） | 184 | 20 | 140 | 3~12 |
| 物理 | 98（初中 50 + 高中 48） | 117 | 11 | 98 | 8~12 |
| 化学 | 96（初中 42 + 高中 54） | 122 | 9 | 96 | 9~12 |
| 历史 | 115（初中 58 + 高中 57） | 128 | 11 | 115 | 7~12 |
| 地理 | 99（初中 49 + 高中 50） | 140 | 11 | 99 | 7~12 |
| 生物 | 109（初中 51 + 高中 58） | 107 | 14 | 109 | 7~12 |
| 科学 | 39（小学 1~6） | 52 | 14 | 39 | 1~6 |
| 道德与法治 | 61（小学 38 + 初中 23） | 84 | 21 | 61 | 1~9 |
| 思想政治 | 52（高中） | 45 | 7 | 52 | 10~12 |
| 技术 | 48（高中，信息技术 + 通用技术） | 43 | 6 | 48 | 10~12 |
| **合计** | **1268** | **1629** | **186** | **1268** | 1~12 |

小学 265、初中 477、高中 526。学科按各自开设的年级建模：科学只在小学，思想政治和技术只在高中，物理从八年级开始。校验脚本按学科区间卡，越界会报错。

## 快速开始

### 先看图谱

不想装任何东西，clone 下来用浏览器打开就行：

```bash
git clone https://github.com/goralcao/china-skill-taxonomy.git
cd china-skill-taxonomy
open viz/index.html        # macOS；Windows 用 start，Linux 用 xdg-open
```

如果浏览器对本地文件有限制，起一个静态服务：

```bash
python3 -m http.server 8000 --directory viz
# 打开 http://localhost:8000
```

### 把数据读进自己的代码

三个文件就能用起来：主题、依赖、教学研究。

```js
import topics from './data/topics.json' with { type: 'json' };
import deps from './data/dependencies.json' with { type: 'json' };
import research from './data/teaching-research.json' with { type: 'json' };

const byId = new Map(topics.topics.map(t => [t.id, t]));

// 学会「动量守恒定律」之前要先会什么
const prereqs = deps.dependencies
  .filter(d => d.topicId === 'mt_phys-s-momentum-conservation')
  .map(d => ({ name: byId.get(d.prerequisiteId).name, strength: d.strength, reason: d.reason }));

// 这个主题怎么教
const guidance = research.records.find(r => r.topicId === 'mt_phys-s-momentum-conservation');
console.log(prereqs, guidance.learn.activities.length);
```

```python
import json

topics = json.load(open('data/topics.json'))['topics']
deps = json.load(open('data/dependencies.json'))['dependencies']
by_id = {t['id']: t for t in topics}

# 反过来查：学完这一个，后面能通向什么
unlocks = [by_id[d['topicId']]['name'] for d in deps
           if d['prerequisiteId'] == 'mt_phys-s-momentum-theorem']
print(unlocks)
```

### 改完数据跑三条命令

```bash
node scripts/validate.mjs                        # 结构、引用、DAG、年级规则、SHA-256
node --test scripts/teaching-research.test.mjs   # 教学研究层专项测试
python3 scripts/build.py                         # 从 src/ 重新生成 data/ 与 viz/data.js
```

三条都过再提交。数据不要手改，改 `src/` 里的源文件。

### 目录结构

```
china-skill-taxonomy/
├── data/          # 构建产物：topics / dependencies / clusters / standards / textbooks / teaching-research / manifest
├── schema/        # JSON Schema（主题、依赖、课标、教材、教学研究）
├── src/           # 数据源：按学科拆分的 Python 模块（主题、课标、教材目录、教学研究）
├── scripts/       # build.py（生成 + 校验和）、validate.mjs、教学研究测试
├── viz/           # 单文件可视化（index.html + data.js）
├── docs/          # README 截图
├── PROVENANCE.md  # 数据来源与权利边界
├── CITATION.cff   # 引用信息
├── LICENSE        # ODbL 1.0（数据库）
└── LICENSE-CONTENT # CC BY-SA 4.0（原创文本）
```

## 数据说明

数据都在 [`data/`](data)，UTF-8 JSON，没有运行时依赖。字段定义在 [`schema/`](schema)，计数和逐文件 SHA-256 在 [`data/manifest.json`](data/manifest.json)。

| 文件 | 内容 |
|---|---|
| `topics.json` | 微主题（节点）：描述、掌握证据、家长检查法、类型、学段、课标与教材引用 |
| `dependencies.json` | 先修依赖（边）：`topicId` 依赖 `prerequisiteId`，标 hard / soft 和理由 |
| `curriculum-standards.json` | 课标条目：编号、出处、领域、主题、一句话概要 |
| `textbooks.json` | 教材版本、册次、单元目录；2024 版映射 `unitMap2024`、替代版本映射 `unitMapAlt` |
| `clusters.json` | 学科 → 领域簇 → 知识点的层级归组，以及写给家长的域摘要 |
| `teaching-research.json` | 教学研究记录 1268 条，附 authorship 披露与 coverage 清单 |
| `manifest.json` | 版本、计数、分学科统计、逐文件校验和 |

### 一个主题（节选）

```json
{
  "id": "mt_phys-s-momentum-conservation",
  "type": "CONCEPTUAL",
  "subject": "物理",
  "domain": "动量与守恒",
  "name": "动量守恒定律",
  "description": "系统不受外力或合外力为零时总动量不变；是自然界基本守恒律之一，适用于碰撞、爆炸等过程的分析。",
  "gradeRangeStart": 11,
  "gradeRangeEnd": 11,
  "stage": "第五学段（10~12年级）",
  "evidence": ["能说出动量守恒的条件", "能判断某过程动量是否守恒"],
  "assessmentPrompt": "让{{name}}分析冰面上两人互推后各自运动，总动量是否守恒并说明条件。",
  "standards": ["physics-2022:S5:CONS"],
  "textbooks": ["pep-physics-senior:11b:u1"],
  "clusterId": "cl-physics-d15-s5"
}
```

几个字段值得单独说：

- `id` 是稳定标识，依赖边和可视化都靠它引用。
- `type` 分五类：概念性、程序性、表征性、语言性、元认知。
- `assessmentPrompt` 是家长能直接照着问的一句话，`{{name}}` 是孩子的名字占位符。
- `standards` 格式为 `<学科>-2022:<学段>:<领域>`，可在课标文件里查到概要。
- `textbooks` 格式为 `<版本>:<册次>[:u<单元>][#块]`；`textbooks2024` 为空，表示这一册还没被新版替换。

### 一条依赖

```json
{
  "topicId": "mt_phys-s-momentum-conservation",
  "prerequisiteId": "mt_phys-s-momentum-theorem",
  "strength": "hard",
  "reason": "动量守恒由动量定理在系统上推广"
}
```

### 一条教学研究（节选）

```json
{
  "topicId": "mt_phys-s-momentum-conservation",
  "pedagogy": "动量守恒条件「系统合外力为零」常被记成「没有力」。教法是强调看系统外部有没有净力……",
  "learn": {
    "summary": "系统不受外力或合外力为零时总动量不变……",
    "activities": [
      {
        "action": "分析冰面上两人互推后各自运动，总动量是否守恒。",
        "insight": "内力不改变总动量。",
        "feedback": "若说有外力就提示冰面近似无摩擦。",
        "rationale": "用近似无外力情境建立守恒感。"
      }
    ],
    "constraints": ["只做情境分析，不真正在冰面或做爆炸实验。"]
  },
  "assess": {
    "task": "分析冰面上两人互推后各自运动，总动量是否守恒并说明条件。",
    "levels": ["不会：把「有力」当「不守恒」。", "达标：正确判断并说明合外力为零条件。"],
    "errors": ["把内部作用力当破坏守恒。"],
    "nextMoves": ["多练有/无外力对比。"]
  },
  "sources": [{ "claim": "课标要求理解动量守恒定律，能判断守恒条件并应用。", "source": "《普通高中物理课程标准（2017年版2020年修订）》" }],
  "confidence": "high",
  "verified": false
}
```

这些记录是 AI 写的，经过字段完整性、长度、来源白名单、主题联结和覆盖清单的校验，构建时还会检查引用能否解析。但它们没有经过实证验证，不是经验证有效的教学方案；引用来源也没有逐条联网复核。`verified` 一律是 `false`，`confidence` 是撰写时的自评，不是证据等级。文本全部原创，不抄课标、教材或教参原文。

## 数据来源与参考项目

### 参考了什么

数据组织方式参考了 [Marble Skill Taxonomy](https://github.com/withmarbleapp/os-taxonomy)：微主题、先修 DAG、课标对齐、分层许可、校验和这一套。对方的许可是 ODbL 1.0（数据库）加 CC BY-SA 4.0（内容），版权归 Generative Spark, Inc.。

这里的数据和文本都是自己写的，没有使用对方的任何内容、标识或字段值。如果你要做英文体系或别的国家的版本，那个仓库是个不错的起点。

| 项目 | 用在哪里 | 许可 / 性质 |
|---|---|---|
| [Marble Skill Taxonomy](https://github.com/withmarbleapp/os-taxonomy) | 方法学参考：数据组织、许可分层、先修追溯的交互 | ODbL 1.0 + CC BY-SA 4.0，© Generative Spark, Inc. |
| [TapXWorld/ChinaTextbook](https://github.com/TapXWorld/ChinaTextbook) | 教材册次结构；主题详情里的「原书 PDF」链接指向它 | 第三方开源仓库，只做外链，不镜像 |
| [电子课本网](http://www.dzkbw.com/) | 2024 年版修订教材的单元目录 | 第三方网站，只记录册次和单元名 |
| [国家中小学智慧教育平台](https://basic.smartedu.cn/) | 课标原文和电子教材的官方入口 | 官方平台，原文权利归发布方 |

### 各层的数据从哪来

| 层 | 来源 | 怎么处理 |
|---|---|---|
| 义务教育课标 | 教育部《义务教育课程方案和课程标准（2022 年版）》 | 只收编号和一句话概要，不转载原文 |
| 普通高中课标 | 教育部《普通高中课程方案和课程标准（2017 年版 2020 年修订）》 | 同上 |
| 教材结构 | 智慧教育平台、电子课本网、ChinaTextbook | 只记录册次、单元名和目录结构，不收教材正文 |
| 主题与依赖 | 原创撰写 | 描述、掌握证据、检查法、依赖理由都是自己写的 |
| 教学研究 | 组织撰写（AI 辅助 + 结构校验） | 原创文本，来源按白名单引用 |

逐层的权利说明和合规边界在 [`PROVENANCE.md`](PROVENANCE.md)。

### 引用

仓库里有 [`CITATION.cff`](CITATION.cff)，GitHub 会显示「Cite this repository」。也可以直接用：

```bibtex
@misc{china_skill_taxonomy_2026,
  title        = {学阶图谱 · China Skill Taxonomy},
  author       = {{China Skill Taxonomy contributors}},
  year         = {2026},
  version      = {v0.22.4},
  url          = {https://github.com/goralcao/china-skill-taxonomy},
  note         = {Database licensed under ODbL 1.0; content under CC BY-SA 4.0}
}
```

## 许可证

| 层 | 内容 | 许可证 |
|---|---|---|
| 数据库 | `data/` 里的数据集、结构、ID 和关系 | [ODbL 1.0](LICENSE)：可商用，需署名；衍生数据库要用同样的许可开放 |
| 内容 | 原创中文文本（描述、证据、检查法、依赖理由、域摘要、教学研究） | [CC BY-SA 4.0](LICENSE-CONTENT)：需署名，衍生内容同样方式共享 |
| 课标引用 | 课标编号和概要指向的原文 | 不属于本项目，以官方发布为准 |

ODbL 把「衍生数据库」和「产出作品」分开。拿这份数据做产品、训练模型、放进应用，都不需要开源你的产品；只有当你发布基于它的数据库时才需要同样开放。署名可以照抄这行：

> 学阶图谱 · China Skill Taxonomy (v0.22.4) · https://github.com/goralcao/china-skill-taxonomy · ODbL 1.0 (database) + CC BY-SA 4.0 (content)

## 路线图

<details>
<summary>已完成的版本和后续计划</summary>

| 版本 | 做了什么 |
|---|---|
| v0.2 ~ v0.3 | 教学研究层起步：数学 96、小学语文 55、小学英语 37 |
| v0.4 ~ v0.7 | 交互层：学习路径、掌握标记、教材直达、三级层级、多布局、2024 版教材映射 |
| v0.8 ~ v0.11 | 初中数学、语文、英语，K9 三科全量覆盖 |
| v0.12 | 搜索下拉、年级与领域筛选、悬停高亮、节点拖拽、深链分享、键盘导航 |
| v0.13 ~ v0.15 | 初中物理、化学、历史、地理；多版本教材目录与跨版本映射 |
| v0.16 ~ v0.18 | 科学、道德与法治、生物，十学科 742 主题全量覆盖 |
| v0.19 ~ v0.22 | 高中九科补齐，1268 主题、十二学科全量覆盖 |
| v0.22.1 ~ v0.22.4 | 图例可收缩、移动端触摸修复、README 与 CI 整理 |

还没做的：

- [ ] 初中段教材版本扩展（北师大版 / 苏科版初中数学、外研社版初中英语）
- [ ] 教学研究补充证据链接，并标出人工复核过的条目
- [ ] 提供 npm / PyPI 数据包和增量更新脚本
- [ ] 英文文档与字段说明

逐版本明细在 [CHANGELOG.md](CHANGELOG.md)。

</details>

## 贡献

补主题、修依赖、改课标和教材映射、重写教学研究，都欢迎。动手前看一眼 [CONTRIBUTING.md](CONTRIBUTING.md)，那里写了字段要求和几条硬规则（依赖不能成环、文本必须原创）。

提 PR 前跑一遍：

```bash
python3 scripts/build.py && node scripts/validate.mjs && node --test scripts/teaching-research.test.mjs
```

## 致谢

- [Marble Skill Taxonomy](https://github.com/withmarbleapp/os-taxonomy)：方法学上的参照（© Generative Spark, Inc.）
- [国家中小学智慧教育平台](https://basic.smartedu.cn/)：课标原文与电子教材入口
- [TapXWorld/ChinaTextbook](https://github.com/TapXWorld/ChinaTextbook)：教材册次与 PDF 索引
- [电子课本网](http://www.dzkbw.com/)：2024 年版教材目录

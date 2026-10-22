<div align="center">

<h1>学阶图谱 · China Skill Taxonomy</h1>

<p><strong>把中国 K12 的学习内容拆成 1268 个可教、可查的微主题，连成一张带先修关系的知识图谱。</strong></p>

<p>对齐《义务教育课程标准（2022 年版）》与《普通高中课程标准（2017 年版 2020 年修订）》<br>
覆盖 12 个学科 · 1~12 年级 · 每个主题配一份「怎么教」的教学研究 · 开放数据</p>

<p>
<img src="https://img.shields.io/badge/version-v0.22.3-blue?style=flat-square" alt="version">
<img src="https://img.shields.io/badge/subjects-12-informational?style=flat-square" alt="subjects">
<img src="https://img.shields.io/badge/topics-1268-brightgreen?style=flat-square" alt="topics">
<img src="https://img.shields.io/badge/prerequisite%20edges-1629-blueviolet?style=flat-square" alt="prerequisite edges">
<img src="https://img.shields.io/badge/data-ODbL%201.0-orange?style=flat-square" alt="data license">
<img src="https://img.shields.io/badge/content-CC%20BY--SA%204.0-yellow?style=flat-square" alt="content license">
<img src="https://img.shields.io/badge/format-JSON%20%2B%20single--file%20HTML-success?style=flat-square" alt="format">
</p>

<img src="docs/screenshot-star.png" width="100%" alt="学阶图谱：12 个学科、1268 个微主题的先修依赖星图">

</div>

**在线预览**：<https://acd118508358062b1.app.workbuddy.host/?sharecode=DHL4TJAQCG>

> **v0.22.3** · 主题 1268 · 先修依赖 1629（hard 942 / soft 687）· 课标条目 186 · 域摘要 204 · 教学研究 1268 · 教材版本 26 · 学科 12

## 目录

- [这是什么](#这是什么)
- [项目特点](#项目特点)
- [覆盖范围](#覆盖范围)
- [快速开始](#快速开始)
- [数据说明](#数据说明)
- [数据来源与参考项目](#数据来源与参考项目)
- [许可证](#许可证)
- [路线图](#路线图)
- [贡献](#贡献)

## 这是什么

大多数中文课程资料要么是一份平铺的课标目录，要么锁死在某个教辅产品里。本项目提供的是一张**连通的学习图谱**：每个知识点是一个节点，先修关系是边，每个节点还挂着「怎么教、怎么查」的说明。

| | 一份课标目录 | 学阶图谱 |
|---|---|---|
| 粒度 | 章节 / 领域 | 1268 个单一、可教、可检查的微主题 |
| 关系 | 并列，无先后 | 1629 条先修边（硬/软 + 知识上的理由），DAG 无环 |
| 家长视角 | 只有「学什么」 | 「学什么 + 会到什么程度 + 怎么检查 + 缺什么先补」 |
| 机器可用 | PDF / 网页 | JSON + JSON Schema + SHA-256 校验和 |
| 教师视角 | 需要自己拆解 | 每个主题配教学要点、学习活动、诊断任务与来源 |

三个典型用法：

1. **家长**：查某个年级到底该会什么，判断孩子卡在哪一环，按先修链补前置。
2. **教师 / 教研**：对照课标与教材定位一个知识点，取一组可直接改造的家庭或课堂活动。
3. **开发者 / 研究者**：把图谱接进自适应练习、课程规划、教材比对或教育类模型。

## 项目特点

| 特点 | 说明 |
|---|---|
| **微主题粒度** | 每个主题是单一知识点或能力点（如「20 以内进位加法」「定语从句」「动量守恒定律」「逻辑推理」），带类型标注、年级区间、所属领域 |
| **先修依赖图，而非目录树** | 每条边标注 `hard`（不会先修就学不了）/ `soft`（有帮助但非必需），并附一句知识上的原因；反向遍历即「解锁」，可跨学段连边（初中 → 高中） |
| **教学研究层 1:1 覆盖** | 1268 条记录与主题一一对应：教学要点与常见错误、2~3 个可操作活动（期望体会 / 反馈建议 / 安排理由）、教学边界、诊断任务（表现水平 / 典型错误 / 下一步）与来源 |
| **课标逐条对齐** | 186 条课标条目，覆盖义务教育 2022 年版与普通高中 2017 年版 2020 年修订；每个主题挂 1~3 条编号，可回溯到领域与主题 |
| **教材单元级锚定** | 26 套教材版本、册次与单元目录；含 2024 年版课标修订教材的逐单元映射（137 条单元映射，多数附内容迁移说明）与北师大/苏教版数学、外研社版英语的跨版本映射 |
| **开箱即用的可视化** | 单个 HTML + 一个 `data.js`，零外部依赖、无需服务器；星图 / 长卷 / 热力三种布局，搜索、筛选、先修追溯、学习路径、掌握标记、深链分享、移动端手势 |
| **可复现、可校验** | 数据由 `src/` 源模块构建；`validate.mjs` 校验结构、引用完整性、DAG 无环、年级规则与 SHA-256 校验和；教学研究层另有专项测试 |
| **分层许可** | 数据库用 ODbL 1.0（可商用，衍生数据库需保持开放），原创文本用 CC BY-SA 4.0；课标原文不属于本项目 |

<div align="center">
<img src="docs/screenshot-panel.png" width="100%" alt="主题详情：先修诊断、掌握证据、家长检查法、课标对齐与教材位置">
<img src="docs/screenshot-research.png" width="100%" alt="教学研究：教学要点、学习活动、诊断任务与来源">
<img src="docs/screenshot-mobile.png" width="24%" alt="移动端：单指平移、双指缩放、底部抽屉详情">
</div>

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

学段分布：小学 265 · 初中 477 · 高中 526。学科按各自开设年级建模（例如科学仅小学、思想政治与技术仅高中），校验脚本按学科区间强制约束。

## 快速开始

### 1. 看图谱（零依赖）

```bash
git clone <repository-url>
cd china-skill-taxonomy
open viz/index.html        # macOS；Windows 用 start，Linux 用 xdg-open
```

也可以起一个静态服务（避免个别浏览器对本地文件的安全限制）：

```bash
python3 -m http.server 8000 --directory viz
# 浏览器打开 http://localhost:8000
```

图谱支持三种布局（星图 / 长卷 / 热力）、按学科开关、年级与领域筛选、搜索直达、先修追溯、学习路径生成、掌握标记与网址深链。桌面端滚轮缩放、双击放大；移动端单指平移、双指捏合。

### 2. 当数据用

```js
import topics from './data/topics.json' with { type: 'json' };
import deps from './data/dependencies.json' with { type: 'json' };
import research from './data/teaching-research.json' with { type: 'json' };

const byId = new Map(topics.topics.map(t => [t.id, t]));

// 学会「动量守恒定律」之前，要先掌握什么
const prereqs = deps.dependencies
  .filter(d => d.topicId === 'mt_phys-s-momentum-conservation')
  .map(d => ({ name: byId.get(d.prerequisiteId).name, strength: d.strength, reason: d.reason }));

// 该主题的教学研究
const guidance = research.records.find(r => r.topicId === 'mt_phys-s-momentum-conservation');
console.log(prereqs, guidance.learn.activities.length);
```

```python
import json

topics = json.load(open('data/topics.json'))['topics']
deps = json.load(open('data/dependencies.json'))['dependencies']
by_id = {t['id']: t for t in topics}

# 反向查「解锁」：学了这一个，后面能通向什么
unlocks = [by_id[d['topicId']]['name'] for d in deps
           if d['prerequisiteId'] == 'mt_phys-s-momentum-theorem']
print(unlocks)
```

### 3. 校验与重新构建

```bash
node scripts/validate.mjs                        # 结构、引用、DAG、年级规则、SHA-256
node --test scripts/teaching-research.test.mjs   # 教学研究层专项测试
python3 scripts/build.py                         # 从 src/ 重新生成 data/ 与 viz/data.js
```

修改数据后请依次执行三件事，全部通过再提交。

### 4. 目录结构

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
└── LICENSE-CONTENT# CC BY-SA 4.0（原创文本）
```

## 数据说明

所有数据在 [`data/`](data)，UTF-8 JSON，无运行时依赖。字段定义见 [`schema/`](schema)，计数与逐文件 SHA-256 见 [`data/manifest.json`](data/manifest.json)。

| 文件 | 内容 |
|---|---|
| `topics.json` | 微主题（节点）：描述、掌握证据、家长检查法、类型、学段、课标与教材引用 |
| `dependencies.json` | 先修依赖（边）：`topicId` 依赖 `prerequisiteId`，标注 hard/soft 与理由 |
| `curriculum-standards.json` | 课标条目：编号、出处、领域、主题、一句话概要 |
| `textbooks.json` | 教材版本、册次、单元目录；2024 版映射 `unitMap2024`、其他版本映射 `unitMapAlt` |
| `clusters.json` | 学科 → 领域簇 → 知识点的层级归组与家长向域摘要 |
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

- `id`：稳定标识，被依赖边与可视化引用；`type`：概念性 / 程序性 / 表征性 / 语言性 / 元认知。
- `assessmentPrompt`：家长可直接照着问的一句话，`{{name}}` 为孩子的名字占位符。
- `standards`：`<学科>-2022:<学段>:<领域>`，可在课标文件中查到概要。
- `textbooks`：`<版本>:<册次>[:u<单元>][#块]`；`textbooks2024` 为空表示该册次尚未被新版替换。

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

**关于教学研究层的诚实披露**（与对标项目同一标准）：

- 记录由 **AI 撰写**，经结构化校验（字段完整性、长度约束、来源白名单、主题联结、覆盖清单）与构建期引用校验，但**未经实证验证**，是研究启发的建议，不是经验证有效的干预方案。
- 引用来源**未逐条联网复核**；`verified` 固定为 `false`，`confidence` 是撰写时的自评，不构成证据评级。
- 文本为原创撰写，未复制课标、教材或教参原文。

## 数据来源与参考项目

### 对标与参考的项目

| 项目 | 与本项目的关系 | 许可 / 性质 |
|---|---|---|
| [Marble Skill Taxonomy](https://github.com/withmarbleapp/os-taxonomy) | **方法学对标**：微主题 + 先修 DAG + 课标对齐 + 分层许可 + 校验和的组织方式，「先修追溯」的交互思路 | ODbL 1.0（数据库）+ CC BY-SA 4.0（内容），© Generative Spark, Inc.。本项目**未使用**其任何数据、文本或标识符 |
| [TapXWorld/ChinaTextbook](https://github.com/TapXWorld/ChinaTextbook) | 教材册次结构参照；主题详情中的「原书 PDF」链接指向该仓库 | 第三方开源仓库，本项目仅作**外链索引**，不镜像、不再分发 |
| [电子课本网](http://www.dzkbw.com/) | 2024 年版课标修订教材的单元目录来源（与启用时间表多源交叉核对） | 第三方网站目录信息，仅记录册次与单元名 |
| [国家中小学智慧教育平台](https://basic.smartedu.cn/) | 课标原文与电子教材的官方入口；教材来源链接的落点 | 官方平台，原文权利归发布方 |

### 分层来源

| 层 | 来源 | 处理方式 |
|---|---|---|
| 义务教育课标 | 教育部《义务教育课程方案和课程标准（2022 年版）》 | 只收录**结构化编号与一句话概要**，不转载原文 |
| 普通高中课标 | 教育部《普通高中课程方案和课程标准（2017 年版 2020 年修订）》 | 同上 |
| 教材结构 | 国家中小学智慧教育平台、电子课本网、ChinaTextbook | 只记录册次、单元名与目录结构，不收录教材正文 |
| 主题与依赖 | 本项目原创撰写 | 描述、掌握证据、检查法、依赖理由均为原创 |
| 教学研究 | 本项目组织撰写（AI 辅助，结构化校验） | 原创文本，来源以白名单引用 |

权利边界、逐层说明与合规声明见 [`PROVENANCE.md`](PROVENANCE.md)。

### 引用本项目

仓库内含 [`CITATION.cff`](CITATION.cff)，GitHub 会显示「Cite this repository」。也可直接使用：

```bibtex
@misc{china_skill_taxonomy_2026,
  title        = {学阶图谱 · China Skill Taxonomy},
  author       = {{China Skill Taxonomy contributors}},
  year         = {2026},
  version      = {v0.22.3},
  url          = {https://github.com/<your-org>/china-skill-taxonomy},
  note         = {Database licensed under ODbL 1.0; content under CC BY-SA 4.0}
}
```

## 许可证

| 层 | 内容 | 许可证 |
|---|---|---|
| 数据库 | `data/` 中的数据集、结构、ID 与各类关系 | [ODbL 1.0](LICENSE)：可商用、需署名；衍生数据库须以相同许可保持开放 |
| 内容 | 本项目原创中文文本（描述、证据、检查法、依赖理由、域摘要、教学研究） | [CC BY-SA 4.0](LICENSE-CONTENT)：需署名，衍生内容相同方式共享 |
| 课标引用 | 课标编号与概要所指向的原文 | 不属于本项目，以官方公布为准 |

ODbL 区分「衍生数据库」与「产出作品」：你可以把本数据用于产品、模型或应用而**不必开源你的产品**，只需把对图谱本身的改进以相同许可开放。署名建议：

> 学阶图谱 · China Skill Taxonomy (v0.22.3) · https://github.com/&lt;your-org&gt;/china-skill-taxonomy · ODbL 1.0 (database) + CC BY-SA 4.0 (content)

## 路线图

<details>
<summary>已完成版本与后续计划</summary>

| 版本 | 内容 |
|---|---|
| v0.2 ~ v0.3 | 教学研究层：数学 96 + 小学语文 55 + 小学英语 37 |
| v0.4 ~ v0.7 | 交互层：学习路径、掌握标记、教材直达、三级层级、多布局、2024 版教材映射 |
| v0.8 ~ v0.11 | 初中数学 / 语文 / 英语（数据层 + 教学研究），K9 三科全量覆盖 |
| v0.12 | 搜索下拉、年级/领域筛选、悬停高亮、节点拖拽、深链分享、键盘导航 |
| v0.13 ~ v0.15 | 初中物理 / 化学 / 历史 / 地理；多版本教材目录与跨版本映射 |
| v0.16 ~ v0.18 | 科学、道德与法治、生物，十学科 742 主题全量覆盖 |
| v0.19 ~ v0.22 | 高中九科：物理、化学、生物、历史、地理、思想政治、技术、语文、数学、英语，1268 主题全量覆盖 |
| v0.22.1 ~ v0.22.2 | 图例可收缩；移动端触摸命中与手势修复 |

后续计划：

- [ ] 初中段教材版本扩展（北师大版 / 苏科版初中数学、外研社版初中英语）
- [ ] 教学研究层补充证据链接与人工复核标记
- [ ] 提供 npm / PyPI 数据包与增量更新脚本
- [ ] 英文文档与字段说明

逐版本明细见 [CHANGELOG.md](CHANGELOG.md)。

</details>

## 贡献

欢迎补充主题、修正依赖、完善课标与教材映射、改进教学研究文本。开始前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

提 PR 前请确保全部通过：

```bash
python3 scripts/build.py && node scripts/validate.mjs && node --test scripts/teaching-research.test.mjs
```

## 致谢

- 方法学对标：[Marble Skill Taxonomy](https://github.com/withmarbleapp/os-taxonomy)（© Generative Spark, Inc.）
- 课标与电子教材入口：[国家中小学智慧教育平台](https://basic.smartedu.cn/)
- 教材册次与 PDF 索引：[TapXWorld/ChinaTextbook](https://github.com/TapXWorld/ChinaTextbook)
- 2024 年版教材目录：[电子课本网](http://www.dzkbw.com/)

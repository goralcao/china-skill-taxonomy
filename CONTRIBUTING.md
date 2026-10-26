# 贡献指南

感谢你愿意参与「学阶图谱」。这个项目的核心资产是**准确**：主题拆解得当、依赖方向正确、课标与教材引用无误。请在贡献时同样对待。

## 目录结构

```
src/                            数据源（Python 模块，data/*.json 由此生成，请勿直接改 data/）
  topics_<subject>[_junior|_senior].py   各学科主题、依赖边、域摘要
  standards_<subject>.py                 课标条目
  textbooks[_<subject>].py               教材版本与册次目录（含 2024 版与多版本）
  textbook_map_*.py                      知识点 → 教材单元映射
  teaching_research_<subject>[_…].py     教学研究记录（与主题 1:1）
  standards.py / textbooks.py            聚合入口（新增学科需在此注册）
scripts/
  build.py       由 src/ 生成 data/ 与 viz/data.js
  validate.mjs   数据校验
  teaching-research.test.mjs  教学研究层专项测试
schema/          JSON Schema（数据结构契约）
data/            构建产物（JSON 数据集 + manifest）
viz/             可视化页面（index.html + data.js）
```

## 添加或修改主题

1. 编辑对应学科的 `src/topics_<subject>.py`。
2. 字段要求（与 `schema/topic.schema.json` 一致）：
   - `key`：小写英文字母、数字、连字符，学科内唯一；
   - `type`：`CONCEPTUAL` / `PROCEDURAL` / `REPRESENTATIONAL` / `LANGUAGE` / `META`；
   - `description` 40~90 字，家长能看懂的平实语言，**原创表述**，不照抄教材；
   - `evidence` 2~3 条**可观察**的掌握证据（「能……」「会……」），不写「掌握……知识」这类不可观察的表述；
   - `assessment` 含 `{{name}}` 占位符的家长检查问题；
   - `standards` 1~3 个，只能使用 `src/standards.py` 中已定义的编号；
   - `textbooks` 格式 `<版本>:<册次>[:u<单元号>][#块标签]`，册次与单元号必须真实存在；
   - 所在册次已被 2024 版替换时，请在 `src/textbook_map_2024.py` 补一条映射（`refs` 用 `版本-2024:册次:uN` 或 `版本-2024:册次#活动名`，内容有迁移的附 `note`），构建期会自动校验引用可解析。
3. 依赖边规则：
   - `(A, B, strength, reason)` 表示 A 的先修是 B；`B.gradeEnd ≤ A.gradeStart`；
   - `hard` 用于「不会先修就学不了」，`soft` 用于「有帮助但非必需」；
   - `reason` ≤60 字，写知识层面的原因；
   - 不得自环、重复边、双向边；全图必须无环。
4. 重新构建并校验：

```bash
python3 scripts/build.py && node scripts/validate.mjs
```

必须全部通过（无 `[fail]`）才算完成。

## 添加或修改教学研究

教学研究层与主题**严格 1:1**（每个主题恰好一条记录），编辑对应的 `src/teaching_research_*.py`：

- `topic`：必须等于主题的 `key`，不得指向不存在的主题；
- `pedagogy` 60~200 字，写教学要点与常见错误；`summary` 30~120 字；
- `activities` 2~3 条，每条含 `action` / `insight` / `feedback` / `rationale`，各 ≤80 字；
- `assess` 至少 2 个表现水平，含 `task` / `levels` / `errors` / `nextMoves`；
- `sources` 至少 1 条，`source` 必须命中 `scripts/build.py` 中的来源白名单（课标 / 教材 / 教师教学用书）；
- `confidence` 取 `high` / `medium` / `low`；`verified` 由构建自动填 `false`，不要手写。

## 贡献课件

课件是最好上手的入口：一个知识点、一个模板、一份脚手架。

```bash
node scripts/new-course.mjs <topicId> --template=explain
```

生成后会得到 `courses/<topicId>/` 下的两个文件。要做的三件事：

1. 把教学研究里的书面语改成对学生说的话（第二人称、短句）
2. 给每个活动补一个可操作的动作（点、拖、输、选）
3. 核对数字与事实：数学复算、文科核人名年代、英语核拼写

硬性要求（`node scripts/validate-courses.mjs` 会检查）：

- 单文件，无外链脚本、样式、图片，体积小于 300KB
- 至少一处 `.pitfall` 易错点，答案写进 `window.__ANSWERS` 且能被复算
- `meta.interactions` 与 HTML 中 `data-step` 小节数一致
- 课标编号必须属于该主题已有的 `standards`

把 `meta.status` 从 `draft` 改成 `reviewed` 之后，图谱上才会出现课件入口。

## 提交前自查

- [ ] `node scripts/validate.mjs` 与 `node --test scripts/teaching-research.test.mjs` 均通过；
- [ ] 新主题的年级、课标编号、教材位置经过核对（课标看[国家中小学智慧教育平台](https://basic.smartedu.cn/)，教材看对应册次目录）；
- [ ] 所有文本为原创中文表述，无 emoji，无教材/课标原文摘抄；
- [ ] 如属较大改动，在 CHANGELOG.md 的「计划中」或未发布小节中说明。

## 命名约定

- 主题 `key` 用语义化短横线键（如 `frac-addsub`、`read-predict`）；
- 课标编号规则见 [PROVENANCE.md](PROVENANCE.md)；
- 提交信息用简体中文或英文，说清「改了什么、为什么」。

## 行为准则

保持友善与建设性。数据分歧时，以《义务教育课程方案和课程标准（2022年版）》和通行教材为准；无法取得一致的，开 issue 讨论。

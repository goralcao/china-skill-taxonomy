# 贡献指南

感谢你愿意参与「学阶图谱」。这个项目的核心资产是**准确**：主题拆解得当、依赖方向正确、课标与教材引用无误。请在贡献时同样对待。

## 目录结构

```
src/            数据源（Python 模块，data/*.json 由此生成，请勿直接改 data/）
  standards.py          课标条目
  textbooks.py          现役教材目录
  textbooks_2024.py     2024 年版课标修订教材目录（18 册，v0.7 起）
  textbook_map_2024.py  知识点 → 2024 版单元映射（v0.7 起）
  topics_math.py        数学主题、依赖边、域摘要
  topics_chinese.py     语文学科
  topics_english.py     英语学科
schema/         JSON Schema（数据结构契约）
scripts/
  build.py       由 src/ 生成 data/ 与 viz/data.js
  validate.mjs   数据校验
data/           构建产物（JSON 数据集 + manifest）
viz/            可视化页面
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

## 提交前自查

- [ ] `node scripts/validate.mjs` 通过；
- [ ] 新主题的年级、课标编号、教材位置经过核对（课标看[国家中小学智慧教育平台](https://basic.smartedu.cn/)，教材看对应册次目录）；
- [ ] 所有文本为原创中文表述，无 emoji，无教材/课标原文摘抄；
- [ ] 如属较大改动，在 CHANGELOG.md 的「计划中」或未发布小节中说明。

## 命名约定

- 主题 `key` 用语义化短横线键（如 `frac-addsub`、`read-predict`）；
- 课标编号规则见 [PROVENANCE.md](PROVENANCE.md)；
- 提交信息用简体中文或英文，说清「改了什么、为什么」。

## 行为准则

保持友善与建设性。数据分歧时，以《义务教育课程方案和课程标准（2022年版）》和通行教材为准；无法取得一致的，开 issue 讨论。

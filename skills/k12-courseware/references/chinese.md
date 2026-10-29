# 语文课件分册（Chinese）

> 适用：语文类知识点（句子与标点、阅读、习作、口语交际）。
> 先读 `SKILL.md` 的通用流程，本文只写语文的不同之处。

## 一、EVAL 的语文判据（重写第 1 步）

`SKILL.md` 的三问是为数学动态关系设计的，直接套会把全部语文判死。
语文改用这三问，**至少一个 yes 才继续**：

1. **有一个「操作在句子/文本上逐步生效」的过程吗？**
   （扩句逐层加长、直述转述逐处改、标点逐个点下去——学生做一次，句子就变一次）
2. **学生的典型错误能被「当场点出来」纠正吗？**
   （关联词套错、人称漏改、顿号逗号混用——错了能指着那一个词说为什么）
3. **要同时盯住三个以上位置才不出错吗？**
   （直述转述要同时动标点、人称、语气——分散注意力的正是可视化能帮的）

三个都 no 就停：拼音描红、字词抄写、课文朗读，做成网页只是把纸搬上屏幕。

## 二、认知动作

新增两个合法值：`辨析`（判断关系/对错/该用哪个）、`构思`（习作支架类，B/C 批用）。
一节课只承载一个认知动作，规则与数学相同。

## 三、学程骨架：先分清是哪一种语文课

**不要套数学的「情境 → 探究 → 例题 → 练习 → 小结」。** 数学每一步都在收敛到一个答案，
语文的每一段都在扩张学生的表达。

语文内部还要再分一层——**三种课型，三种形状**：

| 课型 | 产出物 | 骨架 | 文档 |
|---|---|---|---|
| 语言知识（句子、标点） | 改对的一处 | 六段（见下） | 本节 + `chinese-design.md` |
| **阅读** | 一条依据链 | 五段：起疑 → 取证 → 对齐 → 说清 → 换文 | `chinese-reading-writing.md` |
| **写作** | 一页能读的东西 | 五段：起意 → 搭骨架 → 起草 → 改 → 出刊 | `chinese-reading-writing.md` |

把阅读课写成「读进去 → 看出来 → 写下来 → 改一处 → 评一评」，学生会读完了还是说不出
「我是从哪句知道的」；把写作课写成同样的六段，构思那一步就被一个空输入框敷衍过去了。
**先判断课型，再选骨架。**

### 语言知识课的六段

| # | 环节 | 步骤类型 | 凭什么算"过去了" |
|---|---|---|---|
| 1 | 读进去 | `choice` + `soft:true` | 点过一次（点哪个都能看解释，不判对错） |
| 2 | 看出来 | `annotate` | 圈够 `min` 处（只报数量，不判错） |
| 3 | 写下来 | `draft` | 写够字数 / 写满行数（只判"写没写"） |
| 4 | 改一处 | `sentBuild` / `transform` / `punctPick` | 做完最后一个动作 |
| 5 | 评一评 | `rubric` | 三维都选过（输出"下一步改哪一处"，不打分） |
| 6 | 存起来 | `summary` | 点完成；这一句写入句子本 |

顺序铁律：**先写后评、先写后看范文**。三年级先看范文，全班会写成同一句。
例外只有全新格式（第一次学"被"字句）才先给短范例。

## 四、语文专属步骤类型

| 类型 | 用途 | 关键字段 |
|---|---|---|
| `annotate` | 圈画：在原文里点出语言现象，只计数不判错 | `body.text` 原文 · `body.marks[{t,why}]`（`t` 必须是原文里的连续片段，按出现顺序排列）· `body.min` · `body.after` · `body.revealLabel` |
| `draft` | 写下来：多行输入 + 支架词 + 先写后看的参考稿 | `body.rows` · `body.minChars` · `body.minPerRow` · `body.rowHints[]` · `body.chips[]` · `body.sample` · `body.sampleNote` · `body.done` |
| `rubric` | 自评量规：三维三级，输出建议不输出分数 | `body.dimensions[{name, levels:[{k,d}]}]` · `body.advice`（维度名用大白话，每级 ≤ 25 字） |
| `sentBuild` | 扩句积木：往基础句里逐层插修饰语 | `core` 基础句 · `slots[{ask,at,options,answer,why,hint}]`（at = 插入的汉字位置） |
| `pairMatch` | 关联词语配对：左列配右列，配对成功显示关联词 | `pairs[{left,right,word,why,hint}]` |
| `transform` | 直述↔转述：在原句上逐处替换 | `direct` 原句 · `changes[{label,from,to,pick,options,why,hint}]`（`to` 为空串时用 `pick` 指定选项文字，如"去掉"） |
| `punctPick` | 点句读：在句子空槽里选标点 | `items[{before,after,options,answer,why,hint}]` |
| `annotate`（符号版） | 批注符号：○ 关键词 / □ 人物 / ～ 好句 / ？不懂，先选符号再点词 | `body.symbols[{k,name,hint}]` · `marks[].sym` · `body.note`（旁批开关） |
| `predict` | 预测推想：分段揭示，每猜一次必须先从前文选一句依据 | `body.rounds[{ask,options,answer,because[],reveal,why}]` |
| `poemNote` | 古诗注释：注释卡送回诗句，归位后撤注复述 | `body.notes[{text,on,tag}]` · `body.recall{answer[],words[]}` |
| `senses` | 感官观察：四格感官 + 观察顺序，不排完不许写 | `body.senses[{k,name,hint}]` · `body.orders[]` |
| `checkup` | 修改体检：清单 + 文稿，点中一句才允许打勾 | `body.checks[{name,how,hits[],fix}]` |

两类实现方式要分清：

- **走 `renderers.js` 的四个**（`sentBuild` / `pairMatch` / `transform` / `punctPick`）——必须
  同步加进 `global.CR` 导出，否则 esbuild 树摇会把它剔掉；做完最后一个动作要回调 `spec.onDone`，
  引擎据此记"这一步留下了痕迹"，漏了结算就少算一项。
- **引擎内置的七个**（`annotate` / `draft` / `rubric` / `predict` / `poemNote` / `senses` / `checkup`）
  ——直接写在 `engine.js` 里，能访问 `stateOf(i)`，不进 `CR`，也不用管导出；但要在
  `finishLang()` 的 `TASK` 数组里登记，否则不算"可验证环节"。

学生自己判断的环节（如配对、预测）写 `demo:false`，不要出现"看老师改这一句"。

## 五、引擎里语文走另一条路

`engine.js` 用 `LANG = subject === '语文'` 分叉，五处差异：

| 行为 | 数学 | 语文 |
|---|---|---|
| 演示按钮 | 「▶ 一步一步算」 | 「▶ 看老师改这一句」，提示"先自己试一次，再看不迟" |
| 选择题 | 选错标红、不放行 | `soft:true` 时点哪个都能看解释；真知识题显式写 `hard:true` 才设门禁 |
| 结算 | 「X / Y 一次答对」 | 「X / Y 项留下了痕迹」+ 自评摘录 + 你写的那一句 |
| 写入 | `{done, score}` | `{done, kind:'chinese', marks, tasks, self, draft}`，并把这一句存进 `stx.sentences` |
| 回图谱提示 | 「已完成 · 答对 3/4」 | 「完成 · 5/6 项留下了痕迹」 |

`meta.interactions` 在语文里数的是**动手环节**（圈画/动笔/自评/改一处），不是题数；
`validate-courses.mjs` 与 `score-course.mjs` 已按语文口径分叉。

## 六、语文课件的特殊约束

- **标准：**语文主题当前未绑定课标编号（`standards` 留空数组），图谱挂接分暂少 5 分。
- **版权：**古诗原文可用（公有领域）；注释、练习、例句一律自编，不抄教材原题。
- **判分边界：**只有"唯一答案"的语言知识（的/地、顿号分号、关联词搭配）可以判对错；
  扩句、造句、加标点说理由一律不判分，只给量规与参考稿。
- **不做同伴互评**：单机离线没有真实同伴，伪互评比不互评更糟；替代品是"读出声、自己回听"。
- **笔顺：**识字写字类不在本分册范围；需要时用 hanzi-writer（MIT），不要手写 SVG 笔画。

## 七、题量与节奏

`duration / interactions` 仍保持 2~7。语文一课 13 分钟、5 个动手环节是基准配置：
读（1）+ 发现（1）+ 改一处（1）+ 写（1）+ 评（1）。

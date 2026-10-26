# 十四种步骤：字段、写法、什么时候用

引擎型课件的 `content.json` 只有一个 `steps` 数组。每一步是一屏，类型共十四种。

```json
{
  "topicId": "mt_mult-1digit",
  "title": "多位数乘一位数",
  "subject": "数学",
  "grade": 3,
  "template": "explain",
  "renderer": "vertical",
  "version": "1.0.0",
  "steps": []
}
```

## 总表

| 类型 | 用途 | 必需 | 常用可选 |
|---|---|---|---|
| `intro` | 开场，抛问题或抛错 | `title` | `lead` `bullets[{text,warn}]` |
| `text` | 归纳、讲道理 | `title` `paras[]` | `note` `muted` |
| `vertical` | 竖式演算 | `problem{a,b,op}` | `carries` `reveal` `caption` `note` `warn` `demoHint` |
| `geometry` | 图形（面积/周长/分数/剪拼） | `shape{preset,...}` | `revealTo` `caption` `note` `demo` `demoLabel` |
| `solid` | 立体图形（长方体/正方体/展开图） | `body{w,h,d,focus}` | `caption` `note` `demoLabel` `demoDone` |
| `pyramid` | 棱锥与线面角 | `body{a,h}` | `caption` `note` `demoLabel` |
| `division` | 除法竖式 | `body{a,b}` | `caption` `note` `demoLabel` |
| `molecule` | 分子与原子 | `body{atoms,bondsBefore,bondsAfter}` | `caption` `note` `label` |
| `calendar` | 年历 | `body{year}` | `caption` `note` `demoLabel` |
| `numberline` | 数轴、量感 | `line{min,max,step,...}` | `marks[]` `span` `caption` |
| `clock` | 钟面 | `absMinutes` | `caption` |
| `quiz` | 填数字 | `question` `answer`(number) | `unit` `hint` `why` `title` |
| `choice` | 选择题（带迷思反馈） | `question` `options[]` `answer` | `misconception{}` `hint` `why` `title` |
| `summary` | 小结 + 去向 | `title` `points[]` | `advice` |

除 `summary` 外，每步给 `title`。标题是这一屏的结论，不是栏目名。

## intro

```json
{
  "type": "intro",
  "title": "208 × 4，错的人大多错在这一位",
  "lead": "竖式只有三行，但中间那个 0 很容易出事。",
  "bullets": [
    { "text": "<b>一位一位乘</b>：乘到哪一位，积就写在哪一位下面。" },
    { "text": "<b>0 也要乘</b>：别忘了加上进位的 3。", "warn": true }
  ]
}
```

`warn: true` 的卡片是唯一一张强调卡，全课不超过 2 张。

## text

```json
{
  "type": "text",
  "title": "竖式其实是被压缩的口算",
  "paras": ["208×4 拆开就是 200×4 + 8×4。"],
  "note": "竖式只是把这三步叠起来写，省了重复的乘号。"
}
```

`paras` 每条一句话。超过 3 条，拆成两步。

## vertical

```json
{
  "type": "vertical",
  "title": "竖式：从个位开始",
  "problem": { "a": 208, "b": 4, "op": "×" },
  "carries": true,
  "caption": "注意十位上方的那个 <b>3</b>——它是 8×4 进上来的",
  "note": "三个数位都算完，答案是 <b>832</b>。",
  "demoHint": "点一次算一位：从个位开始，注意进位写在哪。"
}
```

- `op` 支持 `+` `-` `×`；`÷` 的逐步演算还没做，别用
- `demoHint` 是演示按钮下面那行小字，写「看什么」，不写「点这里」
- `reveal: "all"` 会一次性显示答案，只用于「先看一遍」

## geometry

```json
{
  "type": "geometry",
  "title": "沿着边，一条一条描",
  "shape": { "preset": "perimeter", "w": 5, "h": 3, "unit": "米" },
  "caption": "四条边加起来，就是周长",
  "demoLabel": "▶ 走一条边"
}
```

preset：

| preset | 参数 | 分步行为 |
|---|---|---|
| `rectGrid` | `rows` `cols` `unit` | 逐格铺满，计数累加 |
| `perimeter` | `w` `h` `unit` | 逐边走，边上色，中央累加式 |
| `cut` | 图形参数 | 剪拼变换 |
| `fraction` | `parts` `filled` | 逐份涂（静态已给目标时用 `demo:false`） |

`revealTo` 只在需要覆盖初始状态时显式给，不给就按 `shape` 初始化。

## solid

```json
{
  "type": "solid",
  "title": "一组一组地数面",
  "body": { "w": 6, "h": 4, "d": 3, "focus": "faces" },
  "caption": "同色是一组相对的面。",
  "demoLabel": "▶ 看一组面",
  "demoHint": "点一次高亮一组；也可以拖动图形转到背面。",
  "demoDone": "看完了"
}
```

`focus` 决定演示走哪几段：

| focus | 演示内容 |
|---|---|
| `faces` | 前后、左右、上下，三组 |
| `edges` | 长、高、宽各 4 条 |
| `vertices` | 8 个顶点 |
| `unfold` | 摊平成展开图 |
| `all` | 依次走完上面四段 |

`w` 是长（左右），`h` 是高（上下），`d` 是宽（前后）。图形可以拖动旋转，手指和鼠标都行；不拖时慢慢自转，尊重「减少动态效果」设置。

## pyramid

```json
{ "type": "pyramid", "title": "把射影画出来", "body": { "a": 2, "h": 2 },
  "demoLabel": "▶ 一步一步找角", "caption": "P 在底面的射影是中心 O。" }
```

正四棱锥，`a` 底边、`h` 高。演示依次画出侧棱、射影、夹角，角度由坐标算出，不是写死的。可拖动旋转。

`focus: "dihedral"` 切换到二面角：高亮棱与两个面，作两条垂线，标出二面角。

```json
{ "type": "pyramid", "body": { "a": 2, "h": 2, "focus": "dihedral" } }
```

## division

```json
{ "type": "division", "title": "72 ÷ 6", "body": { "a": 72, "b": 6 },
  "demoLabel": "▶ 算一步", "demoHint": "看它写在哪一行、哪一位。" }
```

试商、乘、减、落四步自动拆开，每一步配一句说明。余数、商的位数都由程序算，换数字不用改讲解。

## molecule

```json
{ "type": "molecule",
  "body": {
    "label": "氢气燃烧",
    "atoms": [
      { "el": "H", "from": [-160, -60], "to": [-120, -58] },
      { "el": "O", "from": [40, 0], "to": [-90, -30] }
    ],
    "bondsBefore": [[0, 1]],
    "bondsAfter": [[0, 1]]
  } }
```

`atoms` 里每个原子给起始和终点坐标（画布中心为原点）；`bondsBefore` / `bondsAfter` 是原子下标的连线。演示四步：清点 → 断键 → 搬家 → 成键。原子种类和个数自动统计在底部。

## calendar

```json
{ "type": "calendar", "title": "12 个月，三类天数", "body": { "year": 2023 },
  "demoLabel": "▶ 一类一类看", "demoHint": "点下面的年份，二月会变。" }
```

12 个月排成 4×3，按大月/小月/二月上色。演示三类天数，底部可切 2023/2024 看二月 28↔29，总数随之变化。

## numberline

```json
{
  "type": "numberline",
  "title": "把吨放到千克的数轴上",
  "line": {
    "min": 0, "max": 2000, "step": 500,
    "marks": [{ "v": 1000, "label": "1 吨" }, { "v": 500, "label": "半吨" }],
    "span": [0, 1000]
  },
  "caption": "0 到 1000 千克这一段，就是 <b>1 吨</b>"
}
```

## clock

```json
{ "type": "clock", "title": "8:30", "absMinutes": 510, "caption": "分针指在 6，就是 30 分" }
```

`absMinutes` 从 0 点算起：8:30 = 8×60+30 = 510。

## quiz

```json
{
  "type": "quiz",
  "title": "你来算",
  "question": "208 × 4 = ？",
  "answer": 832,
  "why": "十位忘了加进位的 3，就会写成 802。"
}
```

- `answer` 必须是数字，不能是字符串
- `why` 是答错时显示的那句，写「错在哪」，不写「再算一遍」

## choice

```json
{
  "type": "choice",
  "title": "先估一估",
  "question": "不算竖式，208 × 4 大约是多少？",
  "options": ["400 左右", "800 左右", "1600 左右"],
  "answer": "800 左右",
  "hint": "把 208 看成 200，200×4=800。",
  "misconception": {
    "400 左右": "把 208 看成了 100 多——百位是 2，不是 1。",
    "1600 左右": "200×4=800，估算不用再补一个 0。"
  }
}
```

- 每个错项都要有 `misconception`，键必须与选项字面一致
- 不能给正确答案写错因
- 错因 ≤80 字，一句话说清「学生为什么会这么想」

## summary

```json
{
  "type": "summary",
  "title": "记住这三句",
  "points": ["一位一位乘", "满几十进几", "末尾的 0 先不算"],
  "advice": "接着可以试「两位数乘两位数」——那是把这一步重复两次再相加。"
}
```

`advice` 指向 `meta.next` 里真实存在的课，不写「继续加油」。

## 顺序模板

```
intro → 可视化 → text（归纳）→ quiz → 可视化（第二个情形）→ quiz → choice → summary
```

8 步是常态。少于 6 步通常没讲透，多于 12 步学生会走神。

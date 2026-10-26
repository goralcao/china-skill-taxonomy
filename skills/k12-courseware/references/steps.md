# 十七种步骤：字段、写法、什么时候用

引擎型课件的 `content.json` 只有一个 `steps` 数组。每一步是一屏，类型共十七种。

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
| `decimal` | 小数条 | `body{a,b,op}` | `caption` `note` `demoLabel` |
| `table` | 复式统计表 | `body{categories,series}` | `caption` `note` `demoLabel` |
| `compass` | 方向与路线 | `body{}` | `caption` `note` `demoLabel` |
| `law` | 运算律（交换/结合/分配） | `body{mode,op,a,b,c}` | `caption` `note` `demoLabel` |
| `triangle` | 三角形（分类/内角和/三边） | `body{mode,...}` | `caption` `note` `demoLabel` |
| `counter` | 数位顺序表（大数） | `body{}` | `caption` `note` `demoLabel` |
| `mult2` | 多位数乘法竖式 | `body{a,b}` | `caption` `note` `demoLabel` |
| `chart` | 条形/折线统计图 | `body{mode,categories,series}` | `caption` `note` `demoLabel` |
| `mean` | 平均数（移多补少） | `body{values,labels}` | `caption` `note` `demoLabel` |
| `polyArea` | 多边形面积割补 | `body{mode}` | `caption` `note` `demoLabel` |
| `factorGrid` | 摆方格找因数 | `body{n}` | `caption` `note` `demoLabel` |
| `angle` | 量角器 | `body{deg}` | `caption` `note` `demoLabel` |
| `quad` | 平行四边形与梯形 | `body{shapes}` | `caption` `note` `demoLabel` |
| `decGrid` | 百格图（小数意义/性质） | `body{mode,value,compare}` | `caption` `note` `demoLabel` |
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

## decimal

```json
{ "type": "decimal", "title": "0.3 + 0.4 = 0.7", "body": { "a": 0.3, "b": 0.4, "op": "+" } }
```

十格条：`a`、`b` 各一条（只给 `a` 就是认识小数），`op` 是 `+` 或 `-`。演示逐条涂格，结果条自动算，全程按「几个 0.1」说话。

## table

```json
{ "type": "table", "body": {
  "categories": ["跳绳", "踢毽"],
  "series": [
    { "name": "男", "color": "#38bdf8", "values": [9, 5] },
    { "name": "女", "color": "#a78bfa", "values": [6, 8] }
  ] } }
```

复式统计表。演示逐行高亮、两行对比、最后给出合计（程序求和）。换数据不用改讲解。

## compass

```json
{ "type": "compass", "title": "先认方向，再走路线", "body": {} }
```

左边八方向罗盘，右边社区地图（学校 + 8 个地点）。演示：四个正方向 → 四个斜方向 → 高亮东北方向的公园并画出路线。

## law

```json
{ "type": "law", "title": "加法交换律", "body": { "mode": "commute", "op": "+", "a": 28, "b": 17 } }
```

运算律。`mode` 三种：

| mode | 画什么 | body |
|---|---|---|
| `commute` | 交换律：上下两式，下式的两个数滑动换位，结果相同 | `{mode,op,a,b}` |
| `associate` | 结合律：括号从前两个数移到后两个数，结果相同 | `{mode,op,a,b,c}` |
| `distribute` | 分配律：a×(b+c) 的长方形按自适应比例分成 a×b、a×c 两块 | `{mode,a,b,c}` |

`op` 是 `+` 或 `×`（`distribute` 固定乘法）。演示按步揭示：先算一边 → 换位置/括号 → 两边相等，并报出定律名称。

## triangle

```json
{ "type": "triangle", "title": "三角形的内角和", "body": { "mode": "angleSum", "A": 70, "B": 50, "C": 60 } }
```

三角形。`mode` 三种：

| mode | 画什么 | body |
|---|---|---|
| `classify` | 分类：按给定角度画一排三角形，逐个高亮并标注「按边·按角」 | `{mode,triangles:[{A,B,C}]}` |
| `angleSum` | 内角和：三个角依次拼到半圆上，正好是一条直线（平角 180°） | `{mode,A,B,C}` |
| `sides` | 三边关系：三根小棒逐条验「两边之和 > 第三边」，都过则画出三角形 | `{mode,a,b,c,counter}` |

`classify` 由角度反推边长（等角对等边），所以形状与分类必然自洽；`sides` 的 `counter` 是可选反例（如 2、3、6）。

## counter

```json
{ "type": "counter", "title": "满十进一，一路数到亿", "body": {} }
```

数位顺序表：九列数位按个级/万级/亿级分开。演示从「10 个一千是一万」一路满十进一到「10 个一千万是一亿」，收尾点明相邻计数单位进率都是十。

## mult2

```json
{ "type": "mult2", "title": "145 × 12 的两步", "body": { "a": 145, "b": 12 } }
```

多位数乘多位数竖式（三位数乘两位数起步）。演示按标准笔算顺序：先个位去乘（末位对齐个位），再十位去乘（得数**向左错一位**，旁注它实际表示多少），最后两段部分积相加。部分积用两种颜色区分。

## chart

```json
{ "type": "chart", "title": "最喜欢的图书种类", "body": { "mode": "bar",
  "categories": ["故事书", "科普书"], "series": [{ "name": "人数", "color": "#38bdf8", "values": [12, 9] }] } }
```

统计图。`mode=bar` 条形图（`series` 一条是单式、两条是复式，条形从基线逐条长出来，纵轴自动取「一格 = N」并标注）；`mode=line` 折线图（先描点再连线，讲升降趋势）。数据换一组，讲解不用改。

## mean

```json
{ "type": "mean", "title": "移多补少", "body": { "values": [8, 5, 11, 4], "labels": ["小明", "小红", "小刚", "小丽"] } }
```

平均数。平均数 = 总数 ÷ 个数 先画虚线；红色标出比平均数多的部分、绿色标出缺的部分；最后所有条形以基线为原点缩放拉平到平均高度——「移多补少」看得见。

## polyArea

```json
{ "type": "polyArea", "title": "平行四边形 → 长方形", "body": { "mode": "para" } }
```

面积公式推导。`mode=para` 沿高剪开、三角形平移补成长方形；`mode=tri` 两个完全一样的三角形旋转 180° 拼成平行四边形；`mode=trap` 两个完全一样的梯形拼合（底 = 上底+下底）。收尾给出公式。

## factorGrid

```json
{ "type": "factorGrid", "title": "12 的因数", "body": { "n": 12 } }
```

因数与倍数。把 n 个小正方形摆成所有长方形（1×12、2×6、3×4…），逐个揭示，收尾列出全部因数，并点明最小因数是 1、最大是它本身。

## angle

```json
{ "type": "angle", "title": "量角的三个动作", "body": { "deg": 60 } }
```

量角器：半圆刻度 + 中心 + 零刻度线。演示中心对顶点 → 零线对一边 → 读另一边；读数与「锐角/直角/钝角」分类实时显示。那条边**可以直接拖**，拖到哪度数跟到哪。

## quad

```json
{ "type": "quad", "title": "数箭头，数出几组平行", "body": { "shapes": ["parallelogram", "trapezoid", "rectangle"] } }
```

四边形一行排开，互相平行的两条边用同色成对箭头标出。`shapes` 可选 `parallelogram` / `trapezoid` / `rectangle`。演示逐个高亮并标「几组对边平行」，最后展示梯形的高。

## decGrid

```json
{ "type": "decGrid", "title": "小数的性质", "body": { "mode": "property", "value": 0.3, "compare": 0.30, "label": "0.3", "compareLabel": "0.30" } }
```

百格图：1 格是 0.01，一列是 0.1。`mode=meaning` 单图讲一个数（如 0.35 = 3 个 0.1 + 5 个 0.01）；`mode=property` 双图对比两个数涂格是否一样多，证明末尾添 0 大小不变。`label`/`compareLabel` 用于显示带末尾 0 的写法（Number 会把 0.30 存成 0.3）。

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

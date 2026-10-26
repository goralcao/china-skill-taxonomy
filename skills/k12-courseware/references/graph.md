# 图谱关联：三个字段必须是真的

课件不是孤立页面。学生从图谱点进来，页面顶部会显示「前置 → 本课 → 解锁」，这条链来自 `data/dependencies.json`，不是手写的。

## 数据长什么样

```json
// 一条依赖：prerequisiteId 先学，topicId 后学
{ "topicId": "mt_mult-1digit", "prerequisiteId": "mt_mul-tables-7-9", "strength": "hard", "reason": "…" }
```

`strength` 只有 `hard` / `soft`：hard 是缺了学不会，soft 是缺了会吃力。

## 怎么查

```bash
python3 - <<'PY'
import json
tid='mt_mult-1digit'
E=json.load(open('data/dependencies.json'))['dependencies']
T={t['id']:t for t in json.load(open('data/topics.json'))['topics']}
print('本课', T[tid]['name'], '| 课标', T[tid]['standards'])
print('前置', [(e['prerequisiteId'], e['strength']) for e in E if e['topicId']==tid])
print('解锁', [e['topicId'] for e in E if e['prerequisiteId']==tid])
PY
```

## meta 里要写对的三样

```json
{
  "prerequisites": ["mt_mul-tables-7-9", "mt_num-10000-recognition", "mt_addsub-10000"],
  "next": ["mt_mult-2digit", "mt_div-1digit"],
  "standards": ["math-2022:S2:NA:NO"]
}
```

| 字段 | 规则 | 错了会怎样 |
|---|---|---|
| `prerequisites` | 每个 id 必须是**指向本课的边** | 课程页前置为空，或者显示一个根本不存在的知识点 |
| `next` | 每个 id 必须是**从本课出发的边** | 小结的「接着学」指向死路 |
| `standards` | 必须是本课 `topic.standards` 的子集 | 构建直接失败 |

注意：允许只列一部分（比如入边有 5 条，只写最硬的 3 条），但列出来的必须真存在。

## 常见错

| 症状 | 原因 | 改法 |
|---|---|---|
| 前置 `mt_mult-table` | 主题 id 记成了课名缩写 | 用 `data/topics.json` 里的真 id，如 `mt_mul-tables-7-9` |
| 前置写成「上一课」 | 把教学顺序当成了依赖 | 依赖是「不会这个就学不会」，不是「上周讲过」 |
| `next` 写 `mt_mult-1digit`（放到倍的认识里） | 因果写反 | 倍的认识 → 乘一位数，不是反过来 |
| 没有出边却写了 `next` | 这个知识点是叶子 | `next: []`，advice 改成「可以回头看…」 |

## 页面上的关联

建课件时 `build.py` 会把四样东西注入 `window.__GRAPH`：前置、解锁、同域姊妹、课标与教材标签。`CR.graphNav(container, G)` 负责渲染顶部那条链，不用自己写。

所以：**meta 是数据契约，页面是它的投影**。meta 写错，页面上的链就断，校验脚本和评分脚本都会报。

## 教材单元

主题上的教材引用形如 `pep-math:3b:u5`，构建时转成「人教版数学 · 3 年级下 第 5 单元」。课件不直接写教材名，避免版本一变全要改；需要展示时用注入的 `textbookLabels`。

# 第四代互动课件 · 发布与推送手册

> **用途**：把「课件做完了」变成「线上能打开、链接能交付、远端已同步」的完整操作手册，供其它 agent 直接照抄执行。
> **适用范围**：`china-skill-taxonomy` 仓库内所有第四代 12 页互动课件（`deploy/<id>/index.html`），数学 52 课与语文 16 课同口径。
> **基线时间**：2026-11-07 · 仓库 `c5031f6` · 全库 84 条链接。
>
> 本文里的命令全部在本项目实际跑通；括号内的成功判据是**唯一可信的输出**，不要用退出码代替判断。

---

## 0. 先分清两条链路

「发布失败」最常见的原因，是把下面两条链路当成一件事、或漏掉其中一条。它们是**互相独立**的：

| 链路 | 做什么 | 产物 | 主命令 |
|---|---|---|---|
| **A. 资料库 4B** | 把 `deploy/<id>/index.html` 传到资料库，生成公开可访问的课件页 | `https://workbuddy.link/p/<node_id>` | `publish_to_library.py` |
| **B. GitHub 推送** | 把 `deploy/`、`links.json`、教师页等变更同步到远端仓库 | 远端 `main` 的 commit | `git push` |

**A 不通会表现为「链接打不开 / 打开是旧版」，B 不通只表现为「仓库没更新」**——两者互不影响，必须分别确认。

顺序铁律（跳任何一步都会以「发布失败」的形式暴露出来）：

```
4A 注入  →  发布前预检  →  两步法 4B  →  线上核验  →  收尾产物  →  GitHub 推送
  一次      每课一次       必须两次      每课一次      链接表/教师页    逐提交
```

---

## 1. 环境与路径常量

```bash
# 工程根
ROOT=/workspace/china-skill-taxonomy
cd "$ROOT"

# 技能脚本目录
SK=/root/.codebuddy/skills/interactive-courseware-builder/scripts

# Playwright（线上核验脚本需要）
export NODE_PATH=/root/.codebuddy/artifact/2f8a7d30-9c21-4f0b-1d50-5b66bbe00000/node_modules

# 若报「未找到 library 技能目录」，加这一行
export WB_LIBRARY_SKILL_DIR=/root/.codebuddy/skills/library
```

| 脚本 | 作用 | 成功判据 |
|---|---|---|
| `step4_inject.py` | 4A：注入教学控制标准件 | `RESULT: ALL OK - safe to --apply` |
| `pagesync-test-mqtt.js` | 4A：40 项逻辑回归 | `ALL PASS (40 项)` |
| `prepublish-check.py` | 发布前静态体检 | `RESULT: PASS` |
| `publish_to_library.py` | 4B：上传资料库 | stdout 含 `KS_IMPORT_OK` |
| `verify-library-online.js` | 线上真身核验 | `ONLINE VERIFY PASS` |
| `push-via-api.mjs` | GitHub API 兜底推送 | dry-run 变更清单一致 |

**网络基线**：`github.com` 偶尔 443 连接超时（约 134s），`api.github.com` 通常仍可用。推送前先测，别在超时里空等：

```bash
curl -sS -o /dev/null -w "github=%{http_code} %{time_total}s\n" https://github.com
curl -sS -o /dev/null -w "api=%{http_code} %{time_total}s\n" https://api.github.com
curl -sS -o /dev/null -w "link=%{http_code} %{time_total}s\n" https://workbuddy.link
```

---

## 2. 链路 A：资料库 4B 发布

### 2.1 变量与前提

```bash
ID=mt_xxx                          # 纯 ASCII 课程 id，也是 deploy/ 下的目录名
TITLE="课名：副标题"                # 资料库显示名，一般取 courses/$ID/meta.json 的 title
```

> **`--dir` 必须是纯 ASCII 路径**：用 `deploy/<id>`，不要用中文目录名，否则导入器打包会出问题。

前提：`courses/$ID/index.html` 已是第四代成品（12 页 / 14 题 / 1 Canvas / V4），且 `deploy/$ID/` 存在。

### 2.2 步骤 0 · 4A 注入（**只需做一次**）

```bash
cp courses/$ID/index.html deploy/$ID/index.html
python3.11 $SK/step4_inject.py --config /tmp/step4/g6/step4.json --html deploy/$ID/index.html --probe
# 末行必须是：RESULT: ALL OK - safe to --apply
python3.11 $SK/step4_inject.py --config /tmp/step4/g6/step4.json --html deploy/$ID/index.html --apply
node $SK/pagesync-test-mqtt.js deploy/$ID/index.html
# 末行必须是：ALL PASS (40 项)
```

`step4.json` 内容固定，四个测验 + 一个仿真，**不要改动页号**：

```json
{
  "quizzes": [
    {"act": "pre",  "quizId": "quizPre",  "page": "p1", "hasAvg": false},
    {"act": "mid1", "quizId": "quizMid1", "page": "p4", "hasAvg": false},
    {"act": "mid2", "quizId": "quizMid2", "page": "p7", "hasAvg": false},
    {"act": "post", "quizId": "quizPost", "page": "p9", "hasAvg": false}
  ],
  "sims": [{"act": "sim1", "page": "p6"}],
  "extraReps": []
}
```

> ⚠️ **重跑 `wpipe.sh` / `rpipe.sh` / `kpipe.sh` 或再次 4A 注入，会用 `courses/` 覆盖 `deploy/`，抹掉下面回写好的 `NODE_ID` 常量**。改完课件必须重新走一次 4B 发布回写，否则线上教师模式与页码同步失效。详见第 6 节红线。

### 2.3 步骤 1 · 发布前预检

```bash
python3.11 $SK/prepublish-check.py deploy/$ID/index.html --allow-empty-consts
# 末行必须是：RESULT: PASS
python3.11 $SK/publish_to_library.py --dir deploy/$ID --dry-run
```

- **首次发布前**常量（`NODE_ID` / `PUBLISH_BASE`）本来就是空的，必须加 `--allow-empty-consts`，否则这两项会报 FAIL。
- **第二步发布完成后**改用严格校验，确认常量已正确回写：

```bash
python3.11 $SK/prepublish-check.py deploy/$ID/index.html --node-id <node_id>
```

- 输出以**最后一行 `RESULT: PASS`** 为准；中间若出现个别 FAIL，先核对是否为第四代已知豁免项，不要直接放行。

### 2.4 步骤 2 · 两步法发布（**缺第二步必然出问题**）

```bash
# ① 新建节点：从 stdout 里抓 "node_block_id":"xxx"
python3.11 $SK/publish_to_library.py \
  --dir deploy/$ID --token host --title "$TITLE" | tee /tmp/pub1.log

# ② 带 --node-id 重发：这一步才会回写 NODE_ID / PUBLISH_BASE / 教师身份键
python3.11 $SK/publish_to_library.py \
  --dir deploy/$ID --token host --title "$TITLE" --node-id <node_id> | tee /tmp/pub2.log
```

**为什么不发两次不行**：第一次上传只创建节点，课件里的 `PUBLISH_BASE` 仍为空 → 二维码拼出坏地址、MQTT 订阅缺课程隔离导致跨课件串台、教师身份键未绑定。第二次以 `--node-id` 覆盖更新同一节点（**链接不变**），发布脚本才会把常量写回 HTML 再上传。

**关于 `--token host`**（踩坑率最高的一条）：

| 事实 | 说明 |
|---|---|
| `host` 只是**占位值** | 任意非空字符串都能通过 `--token` 的非空检查，项目约定统一填 `host` |
| 真鉴权不靠它 | `import_html.py` 用 `parse_known_args` 接收 `--token-stdin`，实际走宿主会话 `CODEBUDDY_SESSION_ID` + 内部网关 |
| 不传就报错 | 非 dry-run 且无 `--token`、也无 `CODEBUDDY_DOCUMENT_TOKEN` / `CODEBUDDY_GATEWAY_AUTH` 时，脚本直接报「非 dry-run 必须提供 --token」退出 |
| **绝不填真实 `op_` token** | 不要写进脚本、日志、commit；也不要把 token 硬编码进任何文件 |

**成功判据**：两次 stdout 都必须含 `KS_IMPORT_OK`。导入器**业务失败也返回 exit 0**，所以退出码不可信，必须解析 stdout。第一次还要能匹配到 `"node_block_id":"([A-Za-z0-9]+)"`。

### 2.5 步骤 3 · 线上真身核验

```bash
URL="https://workbuddy.link/p/<node_id>"
node $SK/verify-library-online.js "$URL" | tee /tmp/verify-$ID.log
# 末行必须是：ONLINE VERIFY PASS
```

本地四关（syntax / quiz-modify / jsdom 冒烟 / pagesync）全过 **不等于** 线上已生效——发布通道可能降级或覆盖落旧版本，必须拉线上真身核对 `NODE_ID` / `PUBLISH_BASE` / MQTT 双订阅 / 教师身份键四个标记。

顺带确认常量回写没破坏 4A 注入：

```bash
node $SK/pagesync-test-mqtt.js deploy/$ID/index.html | tail -1   # ALL PASS (40 项)
grep -o "var NODE_ID = '[^']*'" deploy/$ID/index.html | head -1 # 必须等于 <node_id>
```

### 2.6 步骤 4 · 收尾产物

单课发布成功后，下面三项要一起更新，否则「发布了但交付不出去」：

| 产物 | 规则 |
|---|---|
| `deploy/links.json` | 追加一条，字段 `no / course / title / nodeId / url`；**编号必须连续**（当前 1–84，语文占 69–84），`nodeId`、`url` 与发布记录逐条一致 |
| `deploy/hints/教师必看_<标题>.html` | 用官方母版 `references/templates/teacher-hint.html`，只替换标题、裸链、`1/12` 页码；**不要残留别的课件链接** |
| 分组链接总表 | 如 `deploy/小学语文16课_链接总表.html`，按课型分组，含教师入口两段式说明；语文另需写明「14 题只考唯一答案，开放表达不判分不标红」 |

教师页与总表生成后建议截图目视一次：检查标题/链接/页码是否完整、有无横向溢出。

### 2.7 批量发布

多课时不要手写循环，用两步法批量脚本（完整实现见**附录 B**）：

```bash
# 先单课试点，确认通道可用
python3.11 /tmp/step4/cn/pub_all.py --only mt_sent-extend

# 全量（支持断点续传：已成功的课写进 published.json，重跑会跳过/直接走第二步）
python3.11 /tmp/step4/cn/pub_all.py > /tmp/step4/cn/pub.log 2>&1

# 全量线上核验 + 部署版 40 项回归
bash /tmp/step4/cn/verify_all.sh > /tmp/step4/cn/verify_all.out 2>&1
```

`titles.json` 每课一条 `id / name / title / group / grade / no`，`title` 直接取 `courses/<id>/meta.json` 的 `title`（已是「课名：副标题」完整形式）。

---

## 3. 链路 B：GitHub 推送

### 3.1 标准方式（逐提交）

一次推多个 commit 会被 `commit_refs_rules` 拦截，必须逐提交推：

```bash
cd "$ROOT"
git rev-list --reverse origin/main..HEAD > /tmp/shas.txt
while read sha; do
  git push origin "$sha:refs/heads/main"
done < /tmp/shas.txt
git ls-remote origin main | head -1        # 必须单独确认，别只信 push 的 exit code
```

### 3.2 API 兜底（`github.com:443` 持续超时时）

`api.github.com` 走独立通道，通常仍可用：

```bash
node scripts/push-via-api.mjs --dry-run     # 先核对变更清单（本次语文收尾为 34 项）
node scripts/push-via-api.mjs              # 逐文件上传 blob，生成远端 commit
git fetch origin && git reset --hard origin/main   # ⚠ API 生成的 commit sha 与本地不同，必须对齐
```

> 脚本只上传 blob、**不改本地历史**，dry-run 安全。但最后一步 `reset --hard` 会丢弃本地未推送改动，务必先确认工作区干净。
> 2026-11-06 语文收尾时 `github.com` 连超时两次，dry-run 已备妥，**第三次标准推送成功**，因此未启用 API 通道，本地历史无分叉。

### 3.3 最终状态确认

```bash
git log -1 --oneline
echo "远端:       $(git ls-remote origin main 2>/dev/null | head -1 | cut -f1)"
echo "本地领先:   $(git rev-list --count origin/main..HEAD)"
echo "工作区变更: $(git status --short | wc -l)"
```

四项目标：本地 HEAD = 远端 HEAD、本地领先 0、工作区 0 变更。

---

## 4. 排障速查表

| 症状 | 原因 | 修复 |
|---|---|---|
| `非 dry-run 必须提供 --token` | 漏传 `--token` | 补 `--token host`（占位值，见 2.4） |
| 报「未找到 library 技能目录」 | 技能定位失败 | `export WB_LIBRARY_SKILL_DIR=/root/.codebuddy/skills/library` |
| 首次发布成功但二维码是坏码 / 教师模式不生效 / 跨课件串台 | **只发了一次**，常量没回写 | 带 `--node-id <id>` 重发第二次 |
| 脚本 exit 0 但链接打不开 | 导入器业务失败也 exit 0 | 只认 stdout 的 `KS_IMPORT_OK` 与 `node_block_id` |
| 预检 `NODE_ID` / `PUBLISH_BASE` 报 FAIL | 首次发布前常量本来就空 | 加 `--allow-empty-consts`；发布后改用 `--node-id` 严格校验 |
| `step4 --probe` 报 `PROBLEMS: N` | 锚点没对齐 | 先修锚点再 `--apply`，不要强行注入 |
| 线上打开是旧版本 | 发布通道降级或覆盖落旧版 | 重发第二步 + `verify-library-online.js` 核验 |
| 教师页里出现别的课件链接 | 套模板时没替换干净 | 用官方母版只替标题/裸链/页码，逐份抽查 |
| `git push` 卡在 `github.com:443` 超时 | 网络抖动 | 重试 2–3 次；仍不通走 `push-via-api.mjs`（见 3.2） |
| 一次推多 commit 被拒 | `commit_refs_rules` | 逐提交推送（见 3.1） |
| 重新生成课件后线上教师模式失效 | 流水线覆盖 `deploy/` 抹掉 `NODE_ID` | **重新走一次 4B 发布**回写常量（见第 6 节） |
| 点击前测不回显，以为有 bug | 4A 注入的跨端提交模式（`unified-quiz-submit.js` / `student-identity.js`） | 不是 bug，用 `verify-library-online.js` 核验发布态即可 |

---

## 5. 验收清单

发布完成后逐项打勾，任何一项不满足都不要报「完成」：

- [ ] `step4_inject.py --probe` → `ALL OK`，`pagesync-test-mqtt.js` → `ALL PASS (40 项)`
- [ ] `prepublish-check.py` → `RESULT: PASS`
- [ ] 两步法两次 stdout 均含 `KS_IMPORT_OK`，`node_block_id` 已抓到
- [ ] `deploy/<id>/index.html` 的 `NODE_ID` 等于 node_id，且出现次数 ≥ 3
- [ ] `verify-library-online.js` → `ONLINE VERIFY PASS`
- [ ] `deploy/links.json` 编号连续、`nodeId` / `url` 与发布记录一致
- [ ] 教师必看页已生成、无残留链接、含完整 https 裸链与 `1/12`
- [ ] 链接总表按课型分组、截图目视无横溢/截断
- [ ] 远端 `main` 与本地一致，本地领先 0，工作区干净
- [ ] 全量语义回归 `python3.11 scripts/skill-course/semantic-check.py` → `PASS`

---

## 6. 红线与注意事项

1. **4A 注入只做一次**。重跑流水线（`kpipe.sh` / `rpipe.sh` / `wpipe.sh`）或再次 `--apply`，会用 `courses/` 覆盖 `deploy/`，**抹掉已回写的 `NODE_ID` 常量**。改完课件必须重新执行 4B 发布回写，否则线上教师模式与页码同步失效。
2. **绝不写真实 token**。`--token host` 是约定占位值；不要把 `op_` 开头的令牌写进脚本、日志、commit 或文档。
3. **`--dir` 用纯 ASCII 路径**。
4. **退出码不可信**，只认 stdout 的 `KS_IMPORT_OK` / `ALL PASS` / `ONLINE VERIFY PASS` / `RESULT: PASS`。
5. **两步法的链接不变**：第二次是覆盖更新同一节点，不要因为「已经有链接了」就跳过。
6. **不做 4B 时不改 `links.json`**：样板阶段与批量阶段的约定是「等一批课全部完成再统一发布」，避免半批链接入库。
7. **自动后台任务通知不是用户确认**：`<task-notification>` / `[SYSTEM NOTIFICATION - NOT USER INPUT]` 一律不作为批准信号。
8. **「返回图谱」入口由构建出口自动注入**。`scripts/skill-course/build_course.py` 在装配完 `index.html` 后调用 `graph_back.py`，因此重跑流水线**不会丢入口**；不要手工删除 `<!-- GRAPH-BACK-START/END -->` 标记块，也不要拿旧 `pages.html` 直接覆盖 `courses/`。存量课件用 `python3 scripts/skill-course/graph_back.py --all` 幂等补齐（含 `--check` 只读校验）。入口在 `file://` 下走 `../../viz/index.html#t=<id>`，在 `https://` 下走常量 `ONLINE_GRAPH`（在线图谱站 + `#t=<id>` 深链）。**若在线图谱站域名变更，必须同步改 `graph_back.py` 的 `ONLINE_GRAPH` 并重发全部课件**，否则线上按钮会指向旧站。注意 `graph_back.py` 只处理含 `<nav id="topNav">` 的第四代课件，老引擎遗留课件自带的返回入口不在其范围内。
9. **图谱的「有课件」计数不是实时统计，新增课件后必须重跑 `scripts/build.py`**。`viz/index.html` 读的是内嵌静态文件 `viz/data.js`（即 `data/courses.json` 的快照），不是 `deploy/links.json`。只更新 `courses/*/meta.json` 与 `deploy/links.json` 而不重跑构建，图谱会一直显示旧数字，新课件在节点上也不会出现「打开课件」按钮。`build.py` 的 `build_courses()` 与 `sync_courses_to_viz()` 现在都按 `deploy/links.json` 的已发布白名单工作：排除未发布的老引擎课件、给每条写入 `url`（资料库正式课件地址）、并校验白名单与 `courses/` 一一对应。线上图谱应用托管的是 `viz/` 目录静态服务，**重跑构建后文件即时生效，不需要重新发布应用**；跳转由 `courseHref()` 自适应：`https://` 走 `url`，`file://` 退回 `viz/courses/<id>/index.html` 本地副本。

---

## 7. 当前基线（2026-11-08）

| 项 | 值 |
|---|---|
| 课件修复提交 | `5ccf639`（返回图谱入口；手册基线更新为另一次提交，HEAD 以 `git log -1` 为准） |
| 第四代课件 | 数学 52 课 + 语文 21 课 = **89 课全部上线** |
| `deploy/links.json` | **89 条**（编号 1–89；数学 1–68、语文 69–84、拼音 85–89） |
| 教师必看页 | `deploy/hints/教师必看_*.html` **89 份** |
| 语文设计文档 | `docs/design/chinese/*.md` **21 份** |
| 返回图谱入口 | 89 课线上 + 178 个本地文件（`courses/` 89 + `deploy/` 89）已注入；线上真身核验 **89 / 89**，按钮 href 指向在线图谱并带 `#t=<topicId>` |
| 线上核验 | 89 / 89 `ONLINE VERIFY PASS`；部署版 `ALL PASS (40 项)` 89 / 89 |
| 语义回归 | `SEMANTIC_CHECK: PASS 校验 518 题，不一致 0 处`（37 课登记） |
| 图谱课件索引 | `v0.49.5`：`data/courses.json` 与 `viz/data.js` 均为 **89 条**（数学 68 / 语文 21，全部带 `url`）；线上图谱显示「有课件 89」、筛选后 89 个知识点；`viz/courses/` 89 份副本均带返回图谱入口。浏览器验收：三个抽样节点（含此前漏收的 `mt_ratio`、`mt_pinyin-finals`）按钮可见且跳到 `workbuddy.link/p/<nodeId>`，`file://` 下退回本地副本，0 个 JS 报错 |
| 题库 | 重跑构建后从现存 `content.json` 重抽为 **104 题 / 48 个主题**，`validate-questions.mjs` 0 警告；旧 141 题中有 37 题的 `origin` 指向已删除的 `content.json`（HEAD 既有脏数据，旧版校验 37 项阻断） |
| 已知遗留 | `validate-courses.mjs` 对 12 门语文课件报 `duration 30 > 25`（HEAD 既有，与图谱索引修复无关）；第四代课件 `config.js` 里的题尚未接入题库抽取器，若要恢复「可测 63 个点」需另立任务 |

---

## 附录 A · 一键单课发布（参考实现，可落为 `scripts/publish-one.sh`）

把 4A → 预检 → 两步法 → 核验串起来，其它 agent 只传课程 ID。以下为参考片段，未写入仓库：

```bash
#!/bin/bash
set -euo pipefail
ID="$1"; TITLE="${2:-$(python3.11 -c "import json;print(json.load(open('courses/$ID/meta.json'))['title'])")}"
ROOT=/workspace/china-skill-taxonomy; cd "$ROOT"
SK=/root/.codebuddy/skills/interactive-courseware-builder/scripts
export NODE_PATH=/root/.codebuddy/artifact/2f8a7d30-9c21-4f0b-1d50-5b66bbe00000/node_modules

cp "courses/$ID/index.html" "deploy/$ID/index.html"
python3.11 "$SK/step4_inject.py" --config /tmp/step4/g6/step4.json \
  --html "deploy/$ID/index.html" --probe | grep 'ALL OK'
python3.11 "$SK/step4_inject.py" --config /tmp/step4/g6/step4.json \
  --html "deploy/$ID/index.html" --apply >/dev/null
node "$SK/pagesync-test-mqtt.js" "deploy/$ID/index.html" | grep 'ALL PASS'
python3.11 "$SK/prepublish-check.py" "deploy/$ID/index.html" --allow-empty-consts | grep 'RESULT: PASS'

OUT=$(python3.11 "$SK/publish_to_library.py" --dir "deploy/$ID" --token host --title "$TITLE")
echo "$OUT" | grep -q 'KS_IMPORT_OK' || { echo "$OUT"; exit 1; }
NID=$(echo "$OUT" | grep -o '"node_block_id":"[A-Za-z0-9]*"' | head -1 | cut -d'"' -f4)
[ -n "$NID" ] || { echo '未取到 node_block_id'; exit 1; }

OUT2=$(python3.11 "$SK/publish_to_library.py" --dir "deploy/$ID" --token host \
  --title "$TITLE" --node-id "$NID")
echo "$OUT2" | grep -q 'KS_IMPORT_OK' || { echo "$OUT2"; exit 1; }

node "$SK/verify-library-online.js" "https://workbuddy.link/p/$NID" | grep 'ONLINE VERIFY PASS'
echo "PUBLISHED: $ID → https://workbuddy.link/p/$NID"
```

> 用法：`bash scripts/publish-one.sh mt_xxx`。发布完仍需手工追加 `links.json` 与教师必看页（见 2.6）。

## 附录 B · 批量两步法发布（`/tmp/step4/cn/pub_all.py` 实际版本）

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""两步法批量发布：新建拿 node_id → 带 --node-id 重发回写常量。
支持断点续传（published.json）与 --only 单课试点。"""
import json, io, os, re, subprocess, sys

ROOT = '/workspace/china-skill-taxonomy'
SK = '/root/.codebuddy/skills/interactive-courseware-builder/scripts/publish_to_library.py'
DONE = '/tmp/step4/cn/published.json'

items = json.load(io.open('/tmp/step4/cn/titles.json', encoding='utf-8'))
if '--only' in sys.argv:
    only = sys.argv[sys.argv.index('--only') + 1]
    items = [x for x in items if x['id'] == only]

done = json.load(io.open(DONE, encoding='utf-8')) if os.path.exists(DONE) else {}

def pub(it, node_id=None):
    cmd = [sys.executable, SK, '--dir', os.path.join(ROOT, 'deploy', it['id']),
           '--token', 'host', '--title', it['title']]
    if node_id:
        cmd += ['--node-id', node_id]
    r = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, timeout=300)
    return r.stdout + r.stderr

for it in items:
    cid, title = it['id'], it['title']
    nid = done.get(cid, {}).get('nodeId')
    if nid:  # 断点续传：已发布过，直接走第二步重发回写
        out2 = pub(it, nid)
        if 'KS_IMPORT_OK' not in out2 or nid not in out2:
            print('[FAIL-2]', cid, nid); print(out2[-800:]); continue
        print('[OK-2]', cid, nid, flush=True); continue
    out1 = pub(it)
    m = re.search(r'"node_block_id":"([A-Za-z0-9]+)"', out1)
    if not m:
        print('[FAIL-1]', cid); print(out1[-1000:]); continue
    nid = m.group(1)
    out2 = pub(it, nid)
    if 'KS_IMPORT_OK' not in out2 or nid not in out2:
        print('[FAIL-2]', cid, nid); print(out2[-800:]); continue
    done[cid] = {'nodeId': nid, 'url': 'https://workbuddy.link/p/' + nid, 'title': title}
    io.open(DONE, 'w', encoding='utf-8').write(json.dumps(done, ensure_ascii=False, indent=1))
    print('[OK]', cid, nid, done[cid]['url'], flush=True)

print('---- 已发布 %d / 本轮 %d 课 ----' % (len(done), len(items)))
```

## 附录 C · 批量线上核验（`/tmp/step4/cn/verify_all.sh` 实际版本）

```bash
#!/bin/bash
cd /workspace/china-skill-taxonomy
SK=/root/.codebuddy/skills/interactive-courseware-builder/scripts
export NODE_PATH=/root/.codebuddy/artifact/2f8a7d30-9c21-4f0b-1d50-5b66bbe00000/node_modules
mkdir -p /tmp/step4/cn/online
OK=0; FAIL=0; : > /tmp/step4/cn/verify.log
for id in $(cat /tmp/step4/cn/list.txt); do
  URL=$(python3.11 -c "import json;print(json.load(open('/tmp/step4/cn/published.json'))['$id']['url'])")
  T=$(timeout 180 node "$SK/pagesync-test-mqtt.js" "deploy/$id/index.html" 2>&1 | tail -1)
  timeout 170 node "$SK/verify-library-online.js" "$URL" > "/tmp/step4/cn/online/$id.log" 2>&1
  R=$(grep 'RESULT:' "/tmp/step4/cn/online/$id.log" | tail -1)
  if echo "$T" | grep -q "ALL PASS" && echo "$R" | grep -q "ONLINE VERIFY PASS"; then
    echo "$id  RESULT: ONLINE VERIFY PASS  |  $T" | tee -a /tmp/step4/cn/verify.log
    OK=$((OK+1))
  else
    echo "$id  FAIL  online=[$R]  pagesync=[$T]" | tee -a /tmp/step4/cn/verify.log
    FAIL=$((FAIL+1))
  fi
done
echo "---- 线上核验成功 $OK / 失败 $FAIL ----" | tee -a /tmp/step4/cn/verify.log
```

## 附录 D · 数据格式

```jsonc
// /tmp/step4/cn/titles.json —— 每课一条
{ "id": "mt_poem-understand", "name": "借注释读懂《山行》",
  "title": "借注释读懂《山行》：把注释、诗句和画面接起来",
  "group": "阅读 · 五段", "grade": "三上", "isSample": false, "no": 75 }

// /tmp/step4/cn/published.json —— 断点续传记录
{ "mt_poem-understand": {
    "nodeId": "9MD0HGIpcKNT5Q0swYDh0W",
    "url": "https://workbuddy.link/p/9MD0HGIpcKNT5Q0swYDh0W",
    "title": "借注释读懂《山行》：把注释、诗句和画面接起来" } }

// deploy/links.json —— 每条字段（编号必须连续）
{ "no": 75, "course": "mt_poem-understand",
  "title": "借注释读懂《山行》：把注释、诗句和画面接起来",
  "nodeId": "9MD0HGIpcKNT5Q0swYDh0W",
  "url": "https://workbuddy.link/p/9MD0HGIpcKNT5Q0swYDh0W" }
```

> 核验日志（`verify.log`、`online/*.log`、`pub.log`）留在 `/tmp` 即可，**不入库**；与数学 g6 收尾提交口径一致。

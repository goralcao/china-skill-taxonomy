# -*- coding: utf-8 -*-
"""知识点 → 2024 年版课标修订教材的单元级映射。

口径：
  - 仅覆盖已出版 2024 版教材的册次（截至 2026 年 10 月：数学一至四上、语文一至四上、英语三至五上）；
  - refs 中的引用格式与 topic.textbooks 一致：版本:册次:uN（第 N 个常规单元）或 版本:册次#活动名
    （综合与实践活动，见 src/textbooks_2024.py）；
  - note 记录内容迁移/重组说明，refs 为空的条目表示内容已移出或暂未收录（如后移至未出版册次）；
  - 无条目的知识点表示其教材尚未被 2024 版替换（如数学四下、语文四下、英语六年级），仍沿用旧版引用。

映射依据：src/textbooks_2024.py 的真实目录 + 各册次新旧结构对照；迁移幅度大的条目附 note。
"""

MAP_2024 = {
    # ===================== 数学 =====================
    "num-10-recognition": {
        "refs": ["pep-math-2024:1a:u1", "pep-math-2024:1a:u2"],
        "note": "10 以内数的认识拆分为「5以内」与「6～10」两个单元，连续编排。",
    },
    "num-10-composition": {
        "refs": ["pep-math-2024:1a:u1", "pep-math-2024:1a:u2"],
        "note": "分与合在第一单元，数的组成在第二单元。",
    },
    "num-10-addsub": {
        "refs": ["pep-math-2024:1a:u1", "pep-math-2024:1a:u2"],
    },
    "num-10-mixed": {
        "refs": ["pep-math-2024:1a:u2"],
        "note": "连加、连减与加减混合编排在第二单元末。",
    },
    "num-20-recognition": {
        "refs": ["pep-math-2024:1a:u4"],
        "note": "新增「10的再认识」，从计数单位与位值制角度理解十进制。",
    },
    "num-20-carry": {
        "refs": ["pep-math-2024:1a:u5"],
    },
    "num-20-borrow": {
        "refs": ["pep-math-2024:1b:u2"],
    },
    "num-100-recognition": {
        "refs": ["pep-math-2024:1b:u3"],
    },
    "num-100-addsub": {
        "refs": ["pep-math-2024:1b:u3", "pep-math-2024:1b:u4"],
        "note": "100 以内简单加减法在「100以内数的认识」单元，口算加减法单设第四单元。",
    },
    "num-100-pen": {
        "refs": ["pep-math-2024:1b:u5"],
        "note": "100 以内加减法整体移至一年级下册，笔算单设第五单元。",
    },
    "mul-meaning": {
        "refs": ["pep-math-2024:2a:u2"],
        "note": "表内乘法集中在二上「1~6的表内乘法」。",
    },
    "mul-tables-2-6": {
        "refs": ["pep-math-2024:2a:u2"],
    },
    "mul-tables-7-9": {
        "refs": ["pep-math-2024:2a:u5"],
    },
    "div-avg": {
        "refs": ["pep-math-2024:2a:u3"],
        "note": "表内除法集中在二上「1～6的表内除法」。",
    },
    "div-tables-2-6": {
        "refs": ["pep-math-2024:2a:u3"],
    },
    "div-tables-7-9": {
        "refs": ["pep-math-2024:2a:u5"],
    },
    "mixed-two-steps": {
        "refs": ["pep-math-2024:3a:u2"],
        "note": "混合运算集中调整至三年级上册第二单元。",
    },
    "div-remainder": {
        "refs": ["pep-math-2024:2b:u1"],
    },
    "num-10000-recognition": {
        "refs": ["pep-math-2024:2b:u3"],
    },
    "addsub-10000": {
        "refs": ["pep-math-2024:2b:u4"],
    },
    "mass-g-kg": {
        "refs": ["pep-math-2024:3a#曹冲称象的故事"],
        "note": "克与千克由二下调整至三上综合与实践「曹冲称象的故事」（质量单位）。",
    },
    "time-hms": {
        "refs": ["pep-math-2024:2b#时间在哪里"],
        "note": "时、分、秒由三上调整至二下综合与实践「时间在哪里」。",
    },
    "unit-ton": {
        "refs": ["pep-math-2024:3a#曹冲称象的故事"],
        "note": "吨的认识融入三上「曹冲称象的故事」的质量单位学习。",
    },
    "mult-1digit": {
        "refs": ["pep-math-2024:3a:u4"],
    },
    "div-1digit": {
        "refs": ["pep-math-2024:3b:u2"],
    },
    "multiple": {
        "refs": ["pep-math-2024:2b:u2", "pep-math-2024:3a:u4"],
        "note": "「倍的认识」不再独立设单元：二下「数量间的乘除关系」初步学习，三上「多位数乘一位数」深化。",
    },
    "frac-intro": {
        "refs": ["pep-math-2024:3a:u6"],
    },
    "frac-same-addsub": {
        "refs": ["pep-math-2024:3a:u6"],
    },
    "dec-intro": {
        "refs": ["pep-math-2024:3b:u6"],
    },
    "dec-addsub": {
        "refs": ["pep-math-2024:3b:u6"],
    },
    "calendar": {
        "refs": ["pep-math-2024:3b#年、月、日的秘密"],
        "note": "年、月、日调整为三下综合与实践「年、月、日的秘密」。",
    },
    "shape-3d": {
        "refs": ["pep-math-2024:1a:u3"],
        "note": "「认识图形」更名「认识立体图形」，先立体后平面。",
    },
    "shape-2d": {
        "refs": ["pep-math-2024:1b:u1"],
    },
    "position-basic": {
        "refs": ["pep-math-2024:1a#数学游戏", "pep-math-2024:1a:u1"],
        "note": "新版无独立「位置」单元：相对位置融入入学「数学游戏」，「第几」在第一单元。",
    },
    "classify": {
        "refs": ["pep-math-2024:2a:u1"],
        "note": "分类与整理由一下调整至二上第一单元，增加多标准逐层分类。",
    },
    "pattern": {
        "refs": ["pep-math-2024:1b:u3", "pep-math-2024:2a:u2"],
        "note": "新版无独立「找规律」单元，规律探索融入「100以内数的认识」与乘法口诀学习。",
    },
    "length-cm-m": {
        "refs": ["pep-math-2024:2a:u4"],
    },
    "angle-intro": {
        "refs": ["pep-math-2024:3a:u5"],
        "note": "角的初步认识由二上调整至三上「线和角」单元。",
    },
    "observe-object": {
        "refs": ["pep-math-2024:3a:u1"],
        "note": "观察物体由二上调整至三上第一单元。",
    },
    "shape-move": {
        "refs": ["pep-math-2024:3b:u1"],
        "note": "图形的运动由二下调整至三下「生活中的运动现象」。",
    },
    "direction": {
        "refs": ["pep-math-2024:2a#校园小导游"],
        "note": "位置与方向（东、南、西、北）由三下调整至二上综合与实践「校园小导游」。",
    },
    "rect-perimeter": {
        "refs": ["pep-math-2024:3b:u3"],
        "note": "周长内容调整至三下「长方形和正方形」单元。",
    },
    "area-intro": {
        "refs": ["pep-math-2024:3b:u4"],
    },
    "rect-area": {
        "refs": ["pep-math-2024:3b:u4"],
    },
    "data-collect": {
        "refs": ["pep-math-2024:3b:u5"],
        "note": "数据收集整理由二下调整至三下「数据的收集与整理」。",
    },
    "stats-table": {
        "refs": ["pep-math-2024:3b:u5"],
        "note": "复式统计表并入三下「数据的收集与整理」单元。",
    },
    "measure-compare": {
        "refs": ["pep-math-2024:2a:u4", "pep-math-2024:2a#身体上的尺子"],
        "note": "估测与测量融入「厘米和米」及综合与实践「身体上的尺子」。",
    },
    "big-num": {
        "refs": ["pep-math-2024:4a:u1"],
        "note": "「大数的认识」更名「万以上数的认识」并精简。",
    },
    "area-hectare": {
        "refs": [],
        "note": "公顷和平方千米后移至五年级上册「多边形的面积」（2027 秋启用），暂未收录新版目录。",
    },
    "mult-2digit": {
        "refs": ["pep-math-2024:4a:u3"],
        "note": "「三位数乘两位数」与两位数乘两位数整合为「多位数乘两位数」。",
    },
    "div-2digit": {
        "refs": [],
        "note": "除数是两位数的除法调整至四年级下册（2027 春启用），暂未收录新版目录。",
    },
    "lines": {
        "refs": ["pep-math-2024:3a:u5"],
        "note": "线段、射线、直线由四上「线的认识」下移至三上「线和角」。",
    },
    "angle-measure": {
        "refs": ["pep-math-2024:4a:u2"],
        "note": "「角的度量」调整为四上第二单元（原第三单元）。",
    },
    "parallelogram": {
        "refs": ["pep-math-2024:4a:u5"],
    },
    "bar-chart": {
        "refs": ["pep-math-2024:4a:u6"],
        "note": "单式与复式条形统计图合并为「条形统计图」单元。",
    },
    "optimize": {
        "refs": [],
        "note": "新版不再单设「数学广角——优化」，沏茶、烙饼问题融入各单元练习。",
    },
    "chicken-rabbit": {
        "refs": ["pep-math-2024:4a:u7"],
        "note": "鸡兔同笼由四下调整至四上「复习与关联」选学内容。",
    },

    # ===================== 语文 =====================
    "pinyin-initials": {
        "refs": ["tongbian-chinese-2024:1a:u2", "tongbian-chinese-2024:1a:u3"],
        "note": "汉语拼音集中编排于第二至第四单元。",
    },
    "pinyin-finals": {
        "refs": ["tongbian-chinese-2024:1a:u2", "tongbian-chinese-2024:1a:u4"],
        "note": "单韵母在第二单元，复韵母与鼻韵母在第四单元。",
    },
    "pinyin-whole": {
        "refs": ["tongbian-chinese-2024:1a:u3", "tongbian-chinese-2024:1a:u4"],
        "note": "整体认读音节随拼音单元与语文园地学习。",
    },
    "pinyin-blending": {
        "refs": ["tongbian-chinese-2024:1a:u2", "tongbian-chinese-2024:1a:u3"],
    },
    "pinyin-reading": {
        "refs": ["tongbian-chinese-2024:1a:u4", "tongbian-chinese-2024:1a:u5"],
        "note": "拼音学完后进入阅读单元，借助拼音识字和阅读。",
    },
    "char-pictographic": {
        "refs": ["tongbian-chinese-2024:1a:u1", "tongbian-chinese-2024:1b:u1"],
        "note": "识字单元：一上「识字」（金木水火土、日月山川等）与一下「识字」。",
    },
    "char-radical": {
        "refs": ["tongbian-chinese-2024:1a:u1", "tongbian-chinese-2024:1b:u1"],
    },
    "char-stroke": {
        "refs": ["tongbian-chinese-2024:1a:u1", "tongbian-chinese-2024:1a:u2"],
        "note": "笔画笔顺在识字与汉语拼音单元中学习。",
    },
    "char-writing": {
        "refs": ["tongbian-chinese-2024:1a:u1", "tongbian-chinese-2024:1b:u1"],
    },
    "char-phonetic-order": {
        "refs": ["tongbian-chinese-2024:1a:u2", "tongbian-chinese-2024:1a:u3"],
        "note": "音序查字法依托汉语拼音，在拼音单元语文园地中学习。",
    },
    "char-radical-lookup": {
        "refs": ["tongbian-chinese-2024:2a:u2"],
        "note": "部首查字法调整至二上识字单元。",
    },
    "char-homophone": {
        "refs": ["tongbian-chinese-2024:2a:u2", "tongbian-chinese-2024:2a:u3"],
    },
    "word-understand": {
        "refs": ["tongbian-chinese-2024:2a:u3", "tongbian-chinese-2024:2a:u4"],
    },
    "word-accumulate": {
        "refs": ["tongbian-chinese-2024:2a:u1", "tongbian-chinese-2024:2a:u2"],
    },
    "word-idiom": {
        "refs": ["tongbian-chinese-2024:2b:u3", "tongbian-chinese-2024:2b:u5"],
        "note": "成语积累融入识字单元（神州谣、传统节日）与寓言单元。",
    },
    "sent-complete": {
        "refs": ["tongbian-chinese-2024:1a:u5", "tongbian-chinese-2024:1a:u7"],
        "note": "句子学习从一上阅读单元开始。",
    },
    "punct-basic": {
        "refs": ["tongbian-chinese-2024:1a:u5", "tongbian-chinese-2024:1a:u7"],
    },
    "sent-ba-bei": {
        "refs": ["tongbian-chinese-2024:2a:u3", "tongbian-chinese-2024:2a:u4"],
    },
    "sent-rhetoric": {
        "refs": ["tongbian-chinese-2024:2b:u1", "tongbian-chinese-2024:2b:u4"],
        "note": "比喻与拟人融入二下古诗/春天单元与想象单元。",
    },
    "sent-extend": {
        "refs": ["tongbian-chinese-2024:3a:u5"],
        "note": "把句子写具体融入三上习作「我们眼中的缤纷世界」。",
    },
    "sent-conjunction": {
        "refs": ["tongbian-chinese-2024:3a"],
        "note": "关联词语学习分散在三上各阅读单元与语文园地。",
    },
    "sent-quote": {
        "refs": ["tongbian-chinese-2024:3a:u4"],
        "note": "冒号、引号与直述转述在对话丰富的课文单元（如「在牛肚子里旅行」）中学习。",
    },
    "punct-advanced": {
        "refs": ["tongbian-chinese-2024:3b:u4"],
        "note": "顿号、分号与书名号在三下「古诗三首」「纸的发明」等单元学习。",
    },
    "read-aloud": {
        "refs": ["tongbian-chinese-2024:1a:u5", "tongbian-chinese-2024:1b:u2"],
    },
    "read-silent": {
        "refs": ["tongbian-chinese-2024:2a:u3", "tongbian-chinese-2024:2a:u4"],
        "note": "默读训练自二上阅读单元开始。",
    },
    "read-mark": {
        "refs": ["tongbian-chinese-2024:3a:u3", "tongbian-chinese-2024:3a:u6"],
        "note": "圈画与批注在预测单元和写景单元中训练。",
    },
    "read-predict": {
        "refs": ["tongbian-chinese-2024:3a:u3"],
        "note": "第三单元（「总也倒不了的老屋」等）为预测阅读策略单元。",
    },
    "read-ancient": {
        "refs": ["tongbian-chinese-2024:3a:u2", "tongbian-chinese-2024:3b:u2"],
        "note": "古诗三首集中于三上第二单元；文言文「守株待兔」在三下第二单元。",
    },
    "write-picture": {
        "refs": ["tongbian-chinese-2024:1b:u2", "tongbian-chinese-2024:1b:u3"],
        "note": "写话融入一下阅读单元（新版目录未单列写话栏目）。",
    },
    "write-imitate": {
        "refs": ["tongbian-chinese-2024:2a:u1", "tongbian-chinese-2024:2a:u3"],
        "note": "仿写与写话融入二上阅读单元。",
    },
    "write-diary": {
        "refs": ["tongbian-chinese-2024:3a:u2"],
        "note": "三上第二单元习作「写日记」。",
    },
    "write-observe": {
        "refs": ["tongbian-chinese-2024:3a:u5"],
        "note": "三上第五单元习作「我们眼中的缤纷世界」。",
    },
    "write-imagine": {
        "refs": ["tongbian-chinese-2024:3a:u3", "tongbian-chinese-2024:3a:u4"],
        "note": "续写故事、我来编童话。",
    },
    "write-revise": {
        "refs": ["tongbian-chinese-2024:3a:u4", "tongbian-chinese-2024:3a:u6"],
        "note": "习作修改与互评融入各习作单元。",
    },
    "oral-listen": {
        "refs": ["tongbian-chinese-2024:1a:u1", "tongbian-chinese-2024:1b:u1"],
        "note": "快乐读书吧与识字单元中的听故事、讲故事活动。",
    },
    "oral-discuss": {
        "refs": ["tongbian-chinese-2024:2a:u1", "tongbian-chinese-2024:2a:u4"],
        "note": "口语交际融入二上各单元（新版二上目录未单列口语交际栏目）。",
    },
    "oral-retell": {
        "refs": ["tongbian-chinese-2024:3a:u1", "tongbian-chinese-2024:3a:u3"],
        "note": "三上第一、三单元设口语交际。",
    },
    "poem-recite": {
        "refs": ["tongbian-chinese-2024:1a:u5", "tongbian-chinese-2024:1b:u4",
                 "tongbian-chinese-2024:1b:u6"],
        "note": "古诗文分布于一下第四单元「静夜思」、第六单元「古诗二首」等。",
    },
    "poem-understand": {
        "refs": ["tongbian-chinese-2024:3a:u2", "tongbian-chinese-2024:3b:u1"],
        "note": "借助注释理解古诗：三上「古诗三首」、三下「古诗三首」。",
    },
    "book-reading": {
        "refs": ["tongbian-chinese-2024:2a:u1", "tongbian-chinese-2024:3a:u4"],
        "note": "快乐读书吧：二上「读读童话故事」、三上「在那奇妙的王国里」。",
    },
    "sent-fix": {
        "refs": ["tongbian-chinese-2024:4a"],
        "note": "修改病句分散在四上各单元语文园地与阅读练习。",
    },
    "sent-compress": {
        "refs": ["tongbian-chinese-2024:4a"],
        "note": "缩句与提取主干分散在四上各单元语文园地。",
    },
    "read-question": {
        "refs": ["tongbian-chinese-2024:4a:u2"],
        "note": "四上第二单元为提问策略单元（与旧版单元主题一致）。",
    },
    "read-main": {
        "refs": ["tongbian-chinese-2024:4a:u4", "tongbian-chinese-2024:4a:u6"],
        "note": "把握主要内容融入神话单元与写景单元。",
    },
    "write-narrative": {
        "refs": ["tongbian-chinese-2024:4a:u5"],
        "note": "四上第五单元习作「生活万花筒」。",
    },
    "write-application": {
        "refs": ["tongbian-chinese-2024:4a:u8"],
        "note": "四上第八单元习作「写信」。",
    },

    # ===================== 英语 =====================
    "en-letter-name": {
        "refs": ["pep-english-2024:3a:u1"],
        "note": "字母名称音在「Letters and sounds」预备段与 Unit 1 中学习。",
    },
    "en-letter-write": {
        "refs": ["pep-english-2024:3a:u1"],
        "note": "字母书写规范在「Letters and sounds」预备段学习。",
    },
    "en-phonics": {
        "refs": ["pep-english-2024:3a:u1"],
        "note": "字母音与自然拼读依托「Letters and sounds」板块（见附录 2 Chants）。",
    },
    "en-spelling-rules": {
        "refs": ["pep-english-2024:4a"],
        "note": "新版未单设语音单元，字母组合发音规则融入各单元。",
    },
    "en-num-color": {
        "refs": ["pep-english-2024:3a:u5", "pep-english-2024:3a:u6"],
        "note": "颜色调整至第五单元「The colourful world」，数字调整至第六单元「Useful numbers」。",
    },
    "en-body-stationery": {
        "refs": ["pep-english-2024:3a:u3"],
        "note": "身体部位词汇融入动物单元（动物身体部位）；文具词汇散见于项目活动。",
    },
    "en-family": {
        "refs": ["pep-english-2024:3a:u2"],
        "note": "家庭成员由三下第二单元提前至三上第二单元「Different families」。",
    },
    "en-animals": {
        "refs": ["pep-english-2024:3a:u2", "pep-english-2024:3a:u3"],
        "note": "动物话题拆分：宠物在「Different families」，野生动物在「Amazing animals」。",
    },
    "en-food": {
        "refs": ["pep-english-2024:3a:u4", "pep-english-2024:3b:u4"],
        "note": "食物话题调整为三上「Plants around us」（植物的产出）与三下「Healthy food」。",
    },
    "en-weather": {
        "refs": ["pep-english-2024:4a:u5"],
        "note": "天气话题由四下调整至四上「The weather and us」。",
    },
    "en-clothes": {
        "refs": ["pep-english-2024:4a:u6"],
        "note": "服装话题由四下调整至四上「Changing for the seasons」。",
    },
    "en-jobs": {
        "refs": ["pep-english-2024:4a:u4"],
        "note": "职业话题调整为四上「Helping in the community」。",
    },
    "en-places": {
        "refs": ["pep-english-2024:4a:u3", "pep-english-2024:4a:u4"],
        "note": "场所话题调整为四上「Places we live in」等社区主题单元。",
    },
    "en-activities": {
        "refs": ["pep-english-2024:4a:u1", "pep-english-2024:4a:u5"],
        "note": "日常活动融入「Helping at home」「The weather and us」等单元。",
    },
    "en-transport": {
        "refs": ["pep-english-2024:5a"],
        "note": "交通与问路话题融入五年级各单元。",
    },
    "en-demonstratives": {
        "refs": ["pep-english-2024:3a:u1", "pep-english-2024:3a:u3"],
    },
    "en-pronouns": {
        "refs": ["pep-english-2024:3a:u1", "pep-english-2024:3a:u2"],
        "note": "人称代词与物主代词由三下提前至三上第一、二单元。",
    },
    "en-be-verb": {
        "refs": ["pep-english-2024:3a:u1", "pep-english-2024:3a:u2"],
        "note": "be 动词与名词单复数由三下提前至三上家庭与朋友话题单元。",
    },
    "en-yes-no-questions": {
        "refs": ["pep-english-2024:3a:u1", "pep-english-2024:3a:u2"],
        "note": "一般疑问句融入三上第一、二单元问句情境。",
    },
    "en-wh-questions": {
        "refs": ["pep-english-2024:3a:u1", "pep-english-2024:3a:u2"],
        "note": "特殊疑问句由三下提前至三上；各单元以 Big question 组织。",
    },
    "en-prepositions": {
        "refs": ["pep-english-2024:3a:u4", "pep-english-2024:3a:u2"],
        "note": "方位介词融入「Plants around us」与家庭话题。",
    },
    "en-present-simple": {
        "refs": ["pep-english-2024:5a:u1", "pep-english-2024:5a:u4"],
        "note": "一般现在时融入五年级日常话题单元。",
    },
    "en-progressive": {
        "refs": [],
        "note": "现在进行时在新版中的分布待五年级下册（2027 春）目录收录后确认。",
    },
    "en-greetings": {
        "refs": ["pep-english-2024:3a:u1", "pep-english-2024:3b:u1"],
        "note": "问候话题在三上「Making friends」与三下「Meeting new people」。",
    },
    "en-listening": {
        "refs": ["pep-english-2024:3a:u1", "pep-english-2024:3a:u3"],
        "note": "听话题贯穿三上各单元。",
    },
    "en-speaking-routine": {
        "refs": ["pep-english-2024:4a:u1", "pep-english-2024:4a:u4"],
        "note": "口头表达依托四上各单元 Project。",
    },
    "en-describing": {
        "refs": ["pep-english-2024:5a:u1", "pep-english-2024:5a:u6"],
    },
    "en-copying": {
        "refs": ["pep-english-2024:3a:u1", "pep-english-2024:3a:u5"],
    },
    "en-reading-pictures": {
        "refs": ["pep-english-2024:3a:u2", "pep-english-2024:3a:u3"],
        "note": "图文阅读融入动物与家庭单元；四上起设 Reading time。",
    },
    "en-guessing-words": {
        "refs": ["pep-english-2024:4a:u2", "pep-english-2024:4a:u3"],
    },
    "en-writing-short": {
        "refs": ["pep-english-2024:4a:u1", "pep-english-2024:4a:u4"],
        "note": "写几句话融入四上各单元 Project。",
    },
    "en-writing-passage": {
        "refs": ["pep-english-2024:5a:u1", "pep-english-2024:5a:u5"],
    },
    "en-culture": {
        "refs": ["pep-english-2024:5a:u6"],
        "note": "节日与文化话题见于五年级各单元及 Revision「New Year's party」。",
    },
    "en-learning-strategies": {
        "refs": ["pep-english-2024:3b:u3"],
        "note": "学习策略调整为三下「Learning better」单元。",
    },
}

# -*- coding: utf-8 -*-
"""知识点 → 外研社版小学英语（新标准，三年级起点）的单元级映射。

口径：
  - 主题主引用（topics_english.py 的 textbooks 字段）仍是 pep-english，本文件是「替代版本」映射层，
    与 src/textbook_map_2024.py 同为单元级对照；
  - refs 格式 fltrp-english:<册次>:u<N>，N 对应该册 units 列表第 N 项（从 1 开始），见
    src/textbooks_fltrp_english.py；
  - 外研版三上至六上为 2024~2026 年新版（Unit 结构，每册 6 个单元，三上另有 Welcome to school 预备单元），
    五下、六下站点仍为旧版（Module 结构，10 个模块 + Review Module），两者体例不同；
  - 字母、语音、书写、学习策略等主题在外研版无独立单元，refs 取该册最相关单元并在 note 中说明。

映射依据：src/textbooks_fltrp_english.py 的真实目录 + 与人教版 PEP 的话题册次对照。
"""

MAP_FLTRP_ENGLISH = {
    # ===================== 字母与语音 =====================
    "en-letter-name": {
        "refs": ["fltrp-english:3a:u1", "fltrp-english:3a:u2"],
        "note": "外研版无独立字母单元，字母认读随三上预备单元 Welcome to school 与 Unit 1 呈现。",
    },
    "en-letter-write": {
        "refs": ["fltrp-english:3a:u1", "fltrp-english:3a:u2"],
        "note": "外研版书写规范训练并入三上预备单元与 Unit 1 的抄写活动，未单设书写单元。",
    },
    "en-phonics": {
        "refs": ["fltrp-english:3a:u2", "fltrp-english:3a:u3"],
        "note": "外研版字母音与拼读渗透在三上各单元的语音板块，人教版 PEP 同样无独立拼读单元。",
    },
    "en-spelling-rules": {
        "refs": ["fltrp-english:4a:u1", "fltrp-english:4a:u3"],
        "note": "外研版未单列字母组合发音单元，四年级上的语音练习随各单元话题推进。",
    },

    # ===================== 词汇 =====================
    "en-num-color": {
        "refs": ["fltrp-english:3a:u4", "fltrp-english:3a:u5"],
        "note": "外研版颜色（Unit 3）与数字（Unit 4）分设两个单元，人教版 PEP 合并编排在三上前三单元。",
    },
    "en-body-stationery": {
        "refs": ["fltrp-english:3a:u3", "fltrp-english:3b:u2"],
        "note": "外研版文具在三上 Unit 2 My school things，身体部位在三下 Unit 2 Know your body，跨学期。",
    },
    "en-family": {
        "refs": ["fltrp-english:3a:u6"],
        "note": "外研版家庭话题在三上 Unit 5 We're family，人教版 PEP 在三下 My family，早一学期。",
    },
    "en-animals": {
        "refs": ["fltrp-english:3b:u1"],
        "note": "外研版动物话题在三下 Unit 1 Animal friends，人教版 PEP 在三上 We love animals，晚一学期。",
    },
    "en-food": {
        "refs": ["fltrp-english:3b:u3"],
        "note": "外研版食物话题在三下 Unit 3 Yummy food，人教版 PEP 在三上 Let's eat!，晚一学期。",
    },
    "en-weather": {
        "refs": ["fltrp-english:4a:u3", "fltrp-english:4a:u4"],
        "note": "外研版天气与季节分设四上 Unit 3、Unit 4，人教版 PEP 的天气单元在四下 Weather。",
    },
    "en-clothes": {
        "refs": ["fltrp-english:4b:u6"],
        "note": "外研版服装话题在四下 Unit 6 Cool clothes，与人教版 PEP 四下 My clothes 册次相同。",
    },
    "en-jobs": {
        "refs": ["fltrp-english:4b:u1"],
        "note": "外研版职业话题在四下 Unit 1 People at work，人教版 PEP 在四上 Meet my family。",
    },
    "en-places": {
        "refs": ["fltrp-english:4a:u5", "fltrp-english:4a:u6"],
        "note": "外研版场所与方位问答集中在四上 Unit 5 Let's go!、Unit 6 Find your way。",
    },
    "en-activities": {
        "refs": ["fltrp-english:4a:u1", "fltrp-english:4b:u5"],
        "note": "外研版活动短语分布在四上 Unit 1 I love sports 与四下 Unit 5 School activities。",
    },
    "en-transport": {
        "refs": ["fltrp-english:4a:u5", "fltrp-english:4a:u6"],
        "note": "外研版出行与问路提前到四上，人教版 PEP 的交通方式单元在五上 Ways to go to school。",
    },

    # ===================== 语法 =====================
    "en-demonstratives": {
        "refs": ["fltrp-english:3a:u3"],
        "note": "外研版指示代词随三上 Unit 2 指认文具的句型出现，教材不单设语法单元。",
    },
    "en-pronouns": {
        "refs": ["fltrp-english:3a:u6", "fltrp-english:3b:u1"],
        "note": "外研版人称与物主代词随三上 We're family、三下 Animal friends 的话题句型渗透。",
    },
    "en-be-verb": {
        "refs": ["fltrp-english:3a:u6", "fltrp-english:3b:u2"],
        "note": "外研版 be 动词与名词复数在三年级上下册话题句型中反复复现，无独立语法板块。",
    },
    "en-yes-no-questions": {
        "refs": ["fltrp-english:3a:u3", "fltrp-english:3b:u3"],
        "note": "外研版一般疑问句随三上、三下的猜测与确认活动出现，不单列疑问句单元。",
    },
    "en-wh-questions": {
        "refs": ["fltrp-english:3b:u4", "fltrp-english:3b:u5"],
        "note": "外研版特殊疑问句集中在三下以 What 引导的 Unit 4、Unit 5，人教版 PEP 在三下第一单元。",
    },
    "en-prepositions": {
        "refs": ["fltrp-english:3a:u7"],
        "note": "外研版方位介词随三上 Unit 6 My sweet home 描述房间与物品位置呈现。",
    },
    "en-present-simple": {
        "refs": ["fltrp-english:5b:u7"],
        "note": "外研版旧版五下 Module 7 讲一般现在时与三单（My father goes to work...），人教版 PEP 在五上。",
    },
    "en-progressive": {
        "refs": ["fltrp-english:5b:u10"],
        "note": "外研版现在进行时主要在六下 Module 3~5，超出本主题年级上限，暂取五下 Module 10 的现在时语篇。",
    },
    "en-going-to": {
        "refs": ["fltrp-english:5a:u5", "fltrp-english:6b:u2"],
        "note": "外研版 be going to 见于五上 Look into the future 与六下 Module 2，人教版 PEP 在六上第三单元。",
    },
    "en-past-tense": {
        "refs": ["fltrp-english:5b:u1", "fltrp-english:5b:u2"],
        "note": "外研版一般过去时提前到五下 Module 1、Module 2，人教版 PEP 在六下 Last weekend，晚一学年。",
    },
    "en-comparatives": {
        "refs": ["fltrp-english:5b:u5"],
        "note": "外研版无独立比较级单元，形容词与 too...for 用法集中在五下 Module 5，人教版 PEP 在六下第一单元。",
    },

    # ===================== 听说 =====================
    "en-greetings": {
        "refs": ["fltrp-english:3a:u1", "fltrp-english:3a:u2"],
        "note": "外研版问候与自我介绍在三上 Welcome to school、Unit 1 Let's be friends!，人教版 PEP 在三上 Hello!。",
    },
    "en-listening": {
        "refs": ["fltrp-english:3a:u1", "fltrp-english:3a:u4"],
        "note": "外研版不单设听力单元，听指令与抓关键信息贯穿三上预备单元及各单元听说活动。",
    },
    "en-speaking-routine": {
        "refs": ["fltrp-english:4a:u1", "fltrp-english:4a:u2"],
        "note": "外研版口头表达依托四上各单元的项目与拓展板块，人教版 PEP 同样没有独立的口语单元。",
    },
    "en-describing": {
        "refs": ["fltrp-english:5a:u4", "fltrp-english:5b:u5"],
        "note": "外研版连贯描述依托五上 Unit 4 A better me 与五下 Module 5 的形容词语篇。",
    },

    # ===================== 读写 =====================
    "en-copying": {
        "refs": ["fltrp-english:3a:u1", "fltrp-english:3a:u2"],
        "note": "外研版抄写与仿写随三上预备单元与 Unit 1 的书写练习进行，不单设书写单元。",
    },
    "en-reading-pictures": {
        "refs": ["fltrp-english:3a:u3", "fltrp-english:3b:u1"],
        "note": "外研版图文匹配阅读融入三上 Unit 2、三下 Unit 1 的配图语篇，无独立阅读单元。",
    },
    "en-guessing-words": {
        "refs": ["fltrp-english:4a:u3", "fltrp-english:4a:u6"],
        "note": "外研版猜词义训练融入四上各单元阅读语篇，人教版 PEP 也没有单独的词汇策略单元。",
    },
    "en-writing-short": {
        "refs": ["fltrp-english:4a:u1", "fltrp-english:4b:u5"],
        "note": "外研版写几句话依托四上 Unit 1 与四下 Unit 5 的写作任务，人教版 PEP 在四下第二单元。",
    },
    "en-writing-passage": {
        "refs": ["fltrp-english:5a:u4", "fltrp-english:5b:u6"],
        "note": "外研版小短文写作依托五上 A better me 与五下 Module 6 的旅行话题语篇。",
    },

    # ===================== 文化与学习策略 =====================
    "en-culture": {
        "refs": ["fltrp-english:5a:u6"],
        "note": "外研版单设五上 Unit 6 Enjoy the festivals 讲节日与文化，人教版 PEP 分散在五上各单元。",
    },
    "en-learning-strategies": {
        "refs": ["fltrp-english:5a:u4"],
        "note": "外研版无独立学习策略单元，自查与复习依托各单元 Wrap up、Check it 板块，此处取五上 A better me。",
    },
}

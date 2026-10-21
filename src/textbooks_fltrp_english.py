# -*- coding: utf-8 -*-
"""外研社版小学英语（新标准，三年级起点）册次与目录。

目录来源：电子课本网（http://www.dzkbw.com/books/waiyan/yingyu/）外研版「新标准三起」系列，
逐册抓取各册目录页的顶层条目（Starter / Unit / Module / Review 等），
单元内的小节（Get ready、Start up、Speed up、Fuel up、Hit it big、Wrap up、Check it、Let's explore）
以及附录、单词表、Plays 等后置材料不计入 units。

站点上该系列各册的版本年份：
    三上 sq3s_2024（2024 秋版）、三下 sq3x_2025（2025 春版）、
    四上 sq4s_2025（2025 秋版）、四下 sq4x_2026（2026 春版）、
    五上 sq5s_2026（2026 秋版）、五下 sq5x（未标年份，旧版）、
    六上 sq6s_2026（2026 秋版）、六下 sq6x（未标年份，旧版）。
即新版（Unit 结构）已出版到五上、六上，五下、六下仍为旧版（Module 结构），
同一年级上下册体例不完全衔接，做单元级映射时需注意。
"""

FLTRP_ENGLISH_VERSION = {
    "slug": "fltrp-english",
    "name": "外研社版英语（义务教育教科书·英语（新标准），三年级起点）",
    "subject": "英语",
    "gradeStart": 3,
    "note": "外语教学与研究出版社。小学 3~6 年级 8 册（三年级起点「新标准」系列）；目录抓取自电子课本网"
            "（dzkbw.com），各册版本年份见册次学期标记。三上至六上为 2024~2026 年新版，以 Unit 组织；"
            "五下、六下站点仍收录旧版，以 Module 组织，两代教材体例不同。",
    "books": [
        # —— 三年级上册（2024 秋版，站点 sq3s_2024）——
        ("3a", 3, "上", ["Welcome to school",
                        "Unit 1 Let's be friends!",
                        "Unit 2 My school things",
                        "Unit 3 It's a colourful world!",
                        "Unit 4 Fun with numbers",
                        "Unit 5 We're family",
                        "Unit 6 My sweet home"], []),
        # —— 三年级下册（2025 春版，站点 sq3x_2025）——
        ("3b", 3, "下", ["Unit 1 Animal friends",
                        "Unit 2 Know your body",
                        "Unit 3 Yummy food",
                        "Unit 4 What's your hobby?",
                        "Unit 5 What time is it?",
                        "Unit 6 A great week"], []),
        # —— 四年级上册（2025 秋版，站点 sq4s_2025）——
        ("4a", 4, "上", ["Unit 1 I love sports",
                        "Unit 2 Helping at home",
                        "Unit 3 What's the weather like?",
                        "Unit 4 Wonderful seasons",
                        "Unit 5 Let's go!",
                        "Unit 6 Find your way"], []),
        # —— 四年级下册（2026 春版，站点 sq4x_2026）——
        ("4b", 4, "下", ["Unit 1 People at work",
                        "Unit 2 How do you feel today?",
                        "Unit 3 Everyone's got talent!",
                        "Unit 4 Plant life",
                        "Unit 5 School activities",
                        "Unit 6 Cool clothes"], []),
        # —— 五年级上册（2026 秋版，站点 sq5s_2026）——
        ("5a", 5, "上", ["Unit 1 What's on your plate?",
                        "Unit 2 A green life",
                        "Unit 3 Happy together",
                        "Unit 4 A better me",
                        "Unit 5 Look into the future",
                        "Unit 6 Enjoy the festivals"], []),
        # —— 五年级下册（站点 sq5x，旧版，Module 1~10 + Review Module）——
        ("5b", 5, "下", ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5",
                        "Module 6", "Module 7", "Module 8", "Module 9", "Module 10",
                        "Review Module"], []),
        # —— 六年级上册（2026 秋版，站点 sq6s_2026）——
        ("6a", 6, "上", ["Unit 1 What do you do with money?",
                        "Unit 2 What's your opinion?",
                        "Unit 3 Wonderful nature",
                        "Unit 4 We can do it!",
                        "Unit 5 Health matters",
                        "Unit 6 See the world"], []),
        # —— 六年级下册（站点 sq6x，旧版，Module 1~10 + Review Module）——
        ("6b", 6, "下", ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5",
                        "Module 6", "Module 7", "Module 8", "Module 9", "Module 10",
                        "Review Module"], []),
    ],
}

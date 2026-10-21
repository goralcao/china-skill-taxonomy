# -*- coding: utf-8 -*-
"""教材目录。

单元结构参考两个来源：
1. ChinaTextbook 仓库（TapXWorld/ChinaTextbook）收录的通行版教材册次；
2. 国家中小学智慧教育平台「教材」栏目的电子教材（含 2024 年秋季起陆续启用、
   2026 年秋季完成替换的 2022 年版课标修订教材）。

说明：2022 年版课标修订版教材的单元编号与旧版存在差异，本目录以通行版的
单元结构作为主题锚点；新版教材的逐单元映射列入路线图（见 CHANGELOG.md）。
"""

SMARTEDU = {
    "name": "国家中小学智慧教育平台",
    "url": "https://basic.smartedu.cn/",
    "columns": ["教材", "课程教学", "课后服务", "教师研修"],
}

CHINATEXTBOOK = {
    "repo": "https://github.com/TapXWorld/ChinaTextbook",
    "note": "GitHub 上的 PDF 教材合集，收录小学、初中（含五•四学制）与高中教材。"
    "本项目仅引用其册次与版本结构作为教材对齐依据。",
}

# 每个版本: (slug, name, subject, grade_start, note, books)
# books: [(semester_slug, grade, semester, [unit_names], [block_tags])]
DETAILED_VERSIONS = [
    {
        "slug": "pep-math",
        "name": "人教版数学（义务教育教科书·数学）",
        "subject": "数学",
        "gradeStart": 1,
        "note": "人民教育出版社。小学 1~6 年级为通行版册次（ChinaTextbook 收录）；"
                "初中 7~9 年级为 2024 年版课标修订教材：7a~9a 实抓自电子课本网修订版，"
                "9b 修订版尚未发布、暂用通行版（旧版）目录。",
        "books": [
            ("1a", 1, "上", ["准备课", "位置", "1~5的认识和加减法", "认识图形（一）",
                            "6~10的认识和加减法", "11~20各数的认识", "认识钟表", "20以内的进位加法"], []),
            ("1b", 1, "下", ["认识图形（二）", "20以内的退位减法", "分类与整理", "100以内数的认识",
                            "认识人民币", "100以内的加法和减法（一）", "找规律"], []),
            ("2a", 2, "上", ["长度单位", "100以内的加法和减法（二）", "角的初步认识", "表内乘法（一）",
                            "观察物体（一）", "表内乘法（二）", "认识时间", "数学广角——搭配（一）"], []),
            ("2b", 2, "下", ["数据收集整理", "表内除法（一）", "图形的运动（一）", "表内除法（二）",
                            "混合运算", "有余数的除法", "万以内数的认识", "克和千克", "数学广角——推理"], []),
            ("3a", 3, "上", ["时、分、秒", "万以内的加法和减法（一）", "测量", "万以内的加法和减法（二）",
                            "倍的认识", "多位数乘一位数", "长方形和正方形", "分数的初步认识",
                            "数学广角——集合"], []),
            ("3b", 3, "下", ["位置和方向（一）", "除数是一位数的除法", "复式统计表", "两位数乘两位数",
                            "面积", "年、月、日", "小数的初步认识", "数学广角——搭配（二）",
                            "我们的校园"], []),
            ("4a", 4, "上", ["大数的认识", "公顷和平方千米", "角的度量", "三位数乘两位数",
                            "平行四边形和梯形", "除数是两位数的除法", "条形统计图",
                            "数学广角——优化"], []),
            ("4b", 4, "下", ["四则运算", "观察物体（二）", "运算定律", "小数的意义和性质", "三角形",
                            "小数的加法和减法", "图形的运动（二）", "平均数与条形统计图",
                            "数学广角——鸡兔同笼"], []),
            ("5a", 5, "上", ["小数乘法", "位置", "小数除法", "可能性", "简易方程", "多边形的面积",
                            "数学广角——植树问题", "总复习"], []),
            ("5b", 5, "下", ["观察物体（三）", "因数与倍数", "长方体和正方体", "分数的意义和性质",
                            "图形的运动（三）", "分数的加法和减法", "折线统计图",
                            "数学广角——找次品"], []),
            ("6a", 6, "上", ["分数乘法", "位置与方向（二）", "分数除法", "比", "圆", "百分数（一）",
                            "扇形统计图", "数学广角——数与形"], []),
            ("6b", 6, "下", ["负数", "百分数（二）", "圆柱与圆锥", "比例", "数学广角——鸽巢问题",
                            "整理和复习"], []),
            # —— 初中数学（2024 修订版，章节号全局连续；目录实抓自电子课本网）——
            # 9b 修订版尚未在源站发布，下方为通行版（旧版）目录，待修订版上市后替换
            ("7a", 7, "上", [
                "第一章 有理数",
                "第二章 有理数的运算",
                "第三章 代数式",
                "第四章 整式的加减",
                "第五章 一元一次方程",
                "第六章 几何图形初步",
            ], []),
            ("7b", 7, "下", [
                "第七章 相交线与平行线",
                "第八章 实数",
                "第九章 平面直角坐标系",
                "第十章 二元一次方程组",
                "第十一章 不等式与不等式组",
                "第十二章 数据的收集、整理与描述",
            ], []),
            ("8a", 8, "上", [
                "第十三章 三角形",
                "第十四章 全等三角形",
                "第十五章 轴对称",
                "第十六章 整式的乘法",
                "第十七章 因式分解",
                "第十八章 分式",
            ], []),
            ("8b", 8, "下", [
                "第十九章 二次根式",
                "第二十章 勾股定理",
                "第二十一章 四边形",
                "第二十二章 函数",
                "第二十三章 一次函数",
                "第二十四章 数据的分析",
            ], []),
            ("9a", 9, "上", [
                "第二十五章 一元二次方程",
                "第二十六章 二次函数",
                "第二十七章 反比例函数",
                "第二十八章 旋转",
                "第二十九章 圆",
                "第三十章 直线与圆的位置关系",
            ], []),
            ("9b", 9, "下", [
                "第二十六章 反比例函数",
                "第二十七章 相似",
                "第二十八章 锐角三角函数",
                "第二十九章 投影与视图",
            ], []),
        ],
    },
    {
        "slug": "tongbian-chinese",
        "name": "统编版语文（义务教育教科书·语文）",
        "subject": "语文",
        "gradeStart": 1,
        "note": "教育部统编教材，人民教育出版社出版；ChinaTextbook 收录。"
                "初中 7~9 年级为统编版（national unified edition），按主题单元编排，"
                "目录为通行单元主题（与现行统编教材一致）。",
        "books": [
            ("1a", 1, "上", [], ["我上学了", "汉语拼音", "识字", "课文", "口语交际", "快乐读书吧",
                               "和大人一起读", "语文园地"]),
            ("1b", 1, "下", [], ["识字", "课文", "口语交际", "快乐读书吧", "和大人一起读", "语文园地"]),
            ("2a", 2, "上", [], ["课文", "口语交际", "快乐读书吧", "写话", "语文园地"]),
            ("2b", 2, "下", [], ["课文", "口语交际", "快乐读书吧", "写话", "语文园地"]),
            ("3a", 3, "上", [], ["课文", "口语交际", "快乐读书吧", "习作", "语文园地"]),
            ("3b", 3, "下", [], ["课文", "口语交际", "快乐读书吧", "习作", "语文园地"]),
            ("4a", 4, "上", [], ["课文", "口语交际", "快乐读书吧", "习作", "语文园地"]),
            ("4b", 4, "下", [], ["课文", "口语交际", "快乐读书吧", "习作", "语文园地"]),
            ("5a", 5, "上", [], ["课文", "口语交际", "快乐读书吧", "习作", "语文园地"]),
            ("5b", 5, "下", [], ["课文", "口语交际", "快乐读书吧", "习作", "语文园地"]),
            ("6a", 6, "上", [], ["课文", "口语交际", "快乐读书吧", "习作", "语文园地"]),
            ("6b", 6, "下", [], ["课文", "口语交际", "快乐读书吧", "习作", "古诗词诵读",
                               "难忘小学生活", "语文园地"]),
            # —— 初中语文（统编版，7~9 年级；按主题单元编排）——
            ("7a", 7, "上", ["第一单元 四季美景", "第二单元 至爱亲情", "第三单元 学习生活",
                            "第四单元 人生之舟", "第五单元 动物与人", "第六单元 想象之翼"], []),
            ("7b", 7, "下", ["第一单元 群星闪耀", "第二单元 家国情怀", "第三单元 凡人小事",
                            "第四单元 修身正己", "第五单元 哲理之思", "第六单元 科幻探险"], []),
            ("8a", 8, "上", ["第一单元 新闻", "第二单元 人物传记", "第三单元 山川美景",
                            "第四单元 情感哲思", "第五单元 说明事物", "第六单元 情操志趣"], []),
            ("8b", 8, "下", ["第一单元 民风民俗", "第二单元 科技之光", "第三单元 古诗文",
                            "第四单元 演讲", "第五单元 游记", "第六单元 古诗文（二）"], []),
            ("9a", 9, "上", ["第一单元 诗歌", "第二单元 议论", "第三单元 小说",
                            "第四单元 议论（二）", "第五单元 小说（二）", "第六单元 古诗文"], []),
            ("9b", 9, "下", ["第一单元 诗歌（二）", "第二单元 小说", "第三单元 古诗文",
                            "第四单元 戏剧", "第五单元 古诗文（二）", "第六单元 古诗文（三）"], []),
        ],
        "unitCounts": {"1a": 8, "1b": 8, "2a": 8, "2b": 8, "3a": 8, "3b": 8,
                       "4a": 8, "4b": 8, "5a": 8, "5b": 8, "6a": 8, "6b": 6},
    },
    {
        "slug": "pep-english",
        "name": "人教版PEP英语（义务教育教科书·英语，三年级起点）",
        "subject": "英语",
        "gradeStart": 3,
        "note": "人民教育出版社，吴欣主编；ChinaTextbook 收录。英语课从三年级起始，"
                "grade 3~6 对应课标一级（3~4年级）与二级（5~6年级），"
                "grade 7~9 对应三级（7~9年级）；九年级为全一册（无上下分册）。",
        "books": [
            ("3a", 3, "上", ["Hello!", "Colours", "Look at me!", "We love animals",
                            "Let's eat!", "Happy birthday!"], []),
            ("3b", 3, "下", ["Welcome back to school!", "My family", "At the zoo",
                            "Where is my car?", "Do you like pears?", "How many?"], []),
            ("4a", 4, "上", ["My classroom", "My schoolbag", "My friends", "My home",
                            "Dinner's ready", "Meet my family"], []),
            ("4b", 4, "下", ["My school", "What time is it?", "Weather", "At the farm",
                            "My clothes", "Shopping"], []),
            ("5a", 5, "上", ["What's he like?", "My week", "What would you like?",
                            "What can you do?", "There is a big bed", "In a nature park"], []),
            ("5b", 5, "下", ["My day", "My favourite season", "My school calendar",
                            "When is the art show?", "Whose dog is it?", "Work quietly!"], []),
            ("6a", 6, "上", ["How can I get there?", "Ways to go to school", "My weekend plan",
                            "I have a pen pal", "What does he do?", "The story of rain"], []),
            ("6b", 6, "下", ["How tall are you?", "Last weekend", "Where did you go?",
                            "Then and now"], []),
            # —— 初中英语（人教版 Go for it!，7~9 年级；九年级为全一册）——
            ("7a", 7, "上", ["Starter Units", "Unit 1 My name's Gina", "Unit 2 This is my sister",
                            "Unit 3 Is this your pencil", "Unit 4 Where's my schoolbag",
                            "Unit 5 Do you have a soccer ball", "Unit 6 Do you like bananas",
                            "Unit 7 How much are these socks", "Unit 8 When is your birthday",
                            "Unit 9 My favorite subject is science"], []),
            ("7b", 7, "下", ["Unit 1 Can you play the guitar", "Unit 2 What time do you go to school",
                            "Unit 3 How do you get to school", "Unit 4 Don't eat in class",
                            "Unit 5 Why do you like pandas", "Unit 6 I'm watching TV",
                            "Unit 7 It's raining", "Unit 8 Is there a post office near here",
                            "Unit 9 What does he look like", "Unit 10 I'd like some noodles",
                            "Unit 11 How was your school trip", "Unit 12 What did you do last weekend"], []),
            ("8a", 8, "上", ["Unit 1 Where did you go on vacation", "Unit 2 How often do you exercise",
                            "Unit 3 I'm more outgoing than my sister", "Unit 4 What's the best movie theater",
                            "Unit 5 Do you want to watch a game show", "Unit 6 I'm going to study computer science",
                            "Unit 7 Will people have robots", "Unit 8 How do you make a banana milk shake",
                            "Unit 9 Can you come to my party", "Unit 10 If you go to the party, you'll have a great time"], []),
            ("8b", 8, "下", ["Unit 1 What's the matter", "Unit 2 I'll help to clean up the city parks",
                            "Unit 3 Could you please clean your room", "Unit 4 Why don't you talk to your parents",
                            "Unit 5 What were you doing when the rainstorm came", "Unit 6 An old man tried to move the mountains",
                            "Unit 7 What's the highest mountain in the world", "Unit 8 Have you read Treasure Island yet",
                            "Unit 9 Have you ever been to a museum", "Unit 10 I've had this bike for three years"], []),
            ("9a", 9, "全一册", ["Unit 1 How can we become good learners", "Unit 2 I think that mooncakes are delicious",
                            "Unit 3 Could you please tell me where the restrooms are", "Unit 4 I used to be afraid of the dark",
                            "Unit 5 What are the shirts made of", "Unit 6 When was it invented",
                            "Unit 7 Teenagers should be allowed to choose their own clothes", "Unit 8 It must belong to Carla",
                            "Unit 9 I like music that I can dance to", "Unit 10 You're supposed to shake hands",
                            "Unit 11 Sad movies make me cry", "Unit 12 Life is full of the unexpected",
                            "Unit 13 We're trying to save the earth", "Unit 14 I remember meeting all of you in Grade 7"], []),
        ],
    },
]

# —— 初中物理 / 化学 / 历史 / 地理（v0.13 新增）——
import textbooks_chemistry  # noqa: E402
import textbooks_geography  # noqa: E402
import textbooks_history  # noqa: E402
import textbooks_physics  # noqa: E402

DETAILED_VERSIONS.extend([
    textbooks_physics.PHYSICS_VERSION,
    textbooks_chemistry.CHEMISTRY_VERSION,
    textbooks_history.HISTORY_VERSION,
    textbooks_geography.GEOGRAPHY_VERSION,
])

# —— 替代教材版本（v0.15 新增：北师大版/苏教版数学、外研社版英语，主题主引用仍为人教版）——
import textbooks_bnu_math  # noqa: E402
import textbooks_fltrp_english  # noqa: E402
import textbooks_sj_math  # noqa: E402

DETAILED_VERSIONS.extend([
    textbooks_bnu_math.BNU_MATH_VERSION,
    textbooks_sj_math.SJ_MATH_VERSION,
    textbooks_fltrp_english.FLTRP_ENGLISH_VERSION,
])

# —— 小学科学与道德与法治（v0.16 新增）——
import textbooks_morality  # noqa: E402
import textbooks_science  # noqa: E402

DETAILED_VERSIONS.extend([
    textbooks_science.SCIENCE_VERSION,
    textbooks_morality.MORALITY_VERSION,
])

# —— 初中生物（v0.18 新增）——
import textbooks_biology  # noqa: E402

DETAILED_VERSIONS.extend([
    textbooks_biology.BIOLOGY_VERSION,
])

# ChinaTextbook 收录的小学教材版本清单（仅作来源记录，主题暂未对齐这些版本）
CHINATEXTBOOK_PRIMARY_VERSIONS = {
    "语文": ["统编版"],
    "数学": ["人教版", "北师大版", "苏教版", "冀教版", "北京版", "青岛版", "西南师大版", "西南大学版"],
    "英语": ["人教版（PEP，三年级起点）", "人教版（一年级起点）", "人教精通", "外研社版（陈琳/刘兆义/桂诗春）",
            "冀教版", "北京版", "北师大版", "译林版", "科普版", "闽教版", "湘少版", "沪教版",
            "陕旅版", "川教版", "接力版", "教科版", "清华大学版", "辽宁师大版", "重庆大学版",
            "鲁教湘教版", "粤教粤人版"],
    "科学": ["教科版", "人教鄂教版", "冀人版", "大象社版", "湘科版", "粤教粤科版", "苏教版", "青岛版"],
    "道德与法治": ["统编版"],
    "音乐": ["人音版", "人教版（五线谱/简谱）", "冀少版", "接力社版", "沪教版", "湘文艺版",
            "粤教花城版", "苏少版", "西南师大版", "辽海版"],
    "美术": ["人教版", "人美版", "冀美版", "岭南美版", "桂美版", "沪教版", "浙人美版", "湘美版",
            "苏少版", "赣美版", "辽海版"],
    "体育与健康": ["人教版", "冀教版", "北京版", "华东师大版", "未来社版", "科学社版"],
}

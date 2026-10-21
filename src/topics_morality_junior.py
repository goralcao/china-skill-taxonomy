# -*- coding: utf-8 -*-
"""初中道德与法治（七~九年级，统编版）主题、依赖边与领域簇。

数据来源与口径：
- 教材目录为统编版《义务教育教科书·道德与法治》7~9 年级 6 册的实抓目录
  （见 src/textbooks_morality.py，电子课本网 2026-10 抓取）；
  七上 2024 秋、八上 2025 秋、九上 2026 秋为 2022 年版课标修订版，
  七下/八下已同步启用，九下暂为旧版目录（2027 春替换）。
- 课标对齐《义务教育道德与法治课程标准（2022年版）》第四学段（7~9年级）的
  五大学习主题 + 道德教育（条目见 src/standards_morality.py）。
- 主题按「单元主题 → 可迁移的微主题」设计；八下「认识国家制度」与
  「走近国家机构」合并为一个主题，九下旧版三单元各自成主题。
- 主题描述、掌握证据、家长检查法均为原创撰写，未使用教材或课标原文。
- 本模块与小学阶段道德与法治共享同一图谱：跨学段先修边（如法治教育从小学
  「生活中的法律」衔接到初中「生活在法治社会」）在本模块 EDGES 中表达，
  先修主题 key 属于 topics_morality_primary.py，由 build 期全局登记。

台湾、香港、澳门均为中国领土不可分割的一部分；clusterId 由 build 期按
(subject=道德与法治, domain, stage=第四学段) 自动生成，故本文件不写 clusterId。
"""
SUBJECT = "道德与法治"

TOPICS = [
    # ===================== 生命安全与健康教育 =====================
    {
        "key": "mor-j-life",
        "type": "CONCEPTUAL",
        "domain": "生命安全与健康教育",
        "name": "珍爱我们的生命",
        "gradeStart": 7,
        "gradeEnd": 7,
        "description": "认识生命来之不易、独特而短暂，理解生命的价值在于奉献与责任，掌握敬畏生命、守护生命的具体做法，能辨析轻视生命的错误观念。",
        "evidence": [
            "能说出生命独特的两个表现",
            "能说出守护自己生命的两条具体做法",
        ],
        "assessment": "问{{name}}为什么说生命是独特而短暂的，这对我们珍惜时间有什么启发。",
        "standards": ["morality-2022:S4:MH"],
        "textbooks": ["tb-morality:7a:u3"],
    },
    {
        "key": "mor-j-youth",
        "type": "CONCEPTUAL",
        "domain": "生命安全与健康教育",
        "name": "珍惜青春时光",
        "gradeStart": 7,
        "gradeEnd": 7,
        "description": "了解青春期生理心理变化的特点与规律，学会悦纳自我、调节情绪、与异性正常交往，把握青春时光、培养高雅情趣，抵制不良诱惑。",
        "evidence": [
            "能说出青春期心理变化的两个特点",
            "能说出抵制不良诱惑的一条办法",
        ],
        "assessment": "请{{name}}说说最近情绪波动较大的一次经历，他是怎么调节的。",
        "standards": ["morality-2022:S4:MH"],
        "textbooks": ["tb-morality:7b:u1"],
    },
    {
        "key": "mor-j-vigor",
        "type": "CONCEPTUAL",
        "domain": "生命安全与健康教育",
        "name": "焕发青春活力",
        "gradeStart": 7,
        "gradeEnd": 7,
        "description": "认识情绪的多样性与可控性，学会表达、宣泄和调节情绪的方法，培养广泛而健康的兴趣爱好，在集体活动和审美体验中展现青春活力。",
        "evidence": [
            "能说出调节情绪的一种合理宣泄方式",
            "能说出自己的一个兴趣爱好及它的益处",
        ],
        "assessment": "问{{name}}考试前紧张是坏事吗，青春期应该怎样和情绪相处。",
        "standards": ["morality-2022:S4:MH"],
        "textbooks": ["tb-morality:7b:u2"],
    },

    # ===================== 道德修养与心理成长 =====================
    {
        "key": "mor-j-dream",
        "type": "CONCEPTUAL",
        "domain": "道德修养与心理成长",
        "name": "少年有梦",
        "gradeStart": 7,
        "gradeEnd": 7,
        "description": "理解梦想的意义与个人梦想同时代梦想的关系，知道实现梦想要靠努力、坚持和正确的方法，能把梦想分解为可执行的阶段目标。",
        "evidence": [
            "能说出自己的梦想及它与时代需要的联系",
            "能把一个大目标分解成本学期的三个小目标",
        ],
        "assessment": "让{{name}}写下十年后想成为的样子，并倒推现在要做哪三件事。",
        "standards": ["morality-2022:S4:MO"],
        "textbooks": ["tb-morality:7a:u1"],
    },
    {
        "key": "mor-j-growth",
        "type": "PROCEDURAL",
        "domain": "道德修养与心理成长",
        "name": "成长的时空",
        "gradeStart": 7,
        "gradeEnd": 7,
        "description": "学会与老师、同伴建立良好的关系，掌握友谊的建立与维护方法，正确看待网络交往与现实交往的差异，在更广阔的时空中定位自己的成长。",
        "evidence": [
            "能说出友谊需要尊重和界限的一条例子",
            "能比较网络交友与现实交友的一条风险差异",
        ],
        "assessment": "问{{name}}网友提出见面要求该怎么办，请他说明理由。",
        "standards": ["morality-2022:S4:MO"],
        "textbooks": ["tb-morality:7a:u2"],
    },
    {
        "key": "mor-j-goodlife",
        "type": "CONCEPTUAL",
        "domain": "道德修养与心理成长",
        "name": "追求美好人生",
        "gradeStart": 7,
        "gradeEnd": 7,
        "description": "了解不同人生态度带来的不同人生轨迹，理解奋斗、奉献、诚信是美好人生的底色，能初步规划自己的人生方向并愿意为之负责。",
        "evidence": [
            "能说出一种人生态度并分析它的后果",
            "能写出自己对「什么是美好人生」的理解",
        ],
        "assessment": "问{{name}}如果可以不劳而获，他还愿意努力吗，为什么。",
        "standards": ["morality-2022:S4:MO"],
        "textbooks": ["tb-morality:7a:u4"],
    },
    {
        "key": "mor-j-society",
        "type": "PROCEDURAL",
        "domain": "道德修养与心理成长",
        "name": "走进社会生活",
        "gradeStart": 8,
        "gradeEnd": 8,
        "description": "认识个人是社会的有机组成部分，了解亲社会行为的表现与养成途径，理解网络生活的规则与媒介素养，能在社会参与中实现自我价值。",
        "evidence": [
            "能说出亲社会行为的三个例子",
            "能分析一个网络热点事件中媒介素养的体现",
        ],
        "assessment": "请{{name}}说说最近参与的一次志愿或公益活动，带来了什么收获。",
        "standards": ["morality-2022:S4:MO"],
        "textbooks": ["tb-morality:8a:u1"],
    },
    {
        "key": "mor-j-duty",
        "type": "CONCEPTUAL",
        "domain": "道德修养与心理成长",
        "name": "勇担社会责任",
        "gradeStart": 8,
        "gradeEnd": 8,
        "description": "理解角色与责任的关系，知道承担责任要付出代价也会有回报，掌握奉献社会、服务他人的途径，能辨析逃避责任与过度担责的两种极端。",
        "evidence": [
            "能说出自己扮演的三个角色及对应责任",
            "能举出一个服务社会的具体行动方案",
        ],
        "assessment": "问{{name}}班级大扫除时有人溜走，这会给大家带来什么，责任应该怎样分担。",
        "standards": ["morality-2022:S4:MO"],
        "textbooks": ["tb-morality:8a:u3"],
    },
    {
        "key": "mor-j-future",
        "type": "PROCEDURAL",
        "domain": "道德修养与心理成长",
        "name": "走向未来的少年",
        "gradeStart": 9,
        "gradeEnd": 9,
        "description": "了解升学与职业选择的基本考量，理解劳动与职业无高低贵贱之分，学会把个人兴趣、能力与社会需要结合起来规划未来，做好迎接挑战的准备。",
        "evidence": [
            "能说出选择职业时应该考虑的三个因素",
            "能写一份简单的个人发展规划",
        ],
        "assessment": "让{{name}}采访一位从业者，说说这份职业需要什么能力与准备。",
        "standards": ["morality-2022:S4:MO"],
        "textbooks": ["tb-morality:9b:u3"],
    },

    # ===================== 法治教育 =====================
    {
        "key": "mor-j-law-society",
        "type": "CONCEPTUAL",
        "domain": "法治教育",
        "name": "生活在法治社会",
        "gradeStart": 7,
        "gradeEnd": 7,
        "description": "了解法律的产生、特征与作用，知道法律规范行为、保护权益、惩恶扬善，理解法治是现代文明的核心，树立对法律的信仰与敬畏。",
        "evidence": [
            "能说出法律与道德、纪律的区别",
            "能举出一个法律保护公民权益的例子",
        ],
        "assessment": "问{{name}}如果没有法律，只有道德，社会可能会乱在哪里。",
        "standards": ["morality-2022:S4:LE"],
        "textbooks": ["tb-morality:7b:u4"],
    },
    {
        "key": "mor-j-order",
        "type": "CONCEPTUAL",
        "domain": "法治教育",
        "name": "维护社会秩序",
        "gradeStart": 8,
        "gradeEnd": 8,
        "description": "认识社会规则与社会秩序的关系，了解诚实守信、文明有礼的公德要求，区分一般违法与犯罪，知道法定义务须履行、违法行为要担责。",
        "evidence": [
            "能区分一般违法行为与犯罪行为",
            "能说出维护秩序公民可以做的两件事",
        ],
        "assessment": "给{{name}}三个案例（闯红灯、诽谤、抢劫），请他判断分别属于哪类行为。",
        "standards": ["morality-2022:S4:LE"],
        "textbooks": ["tb-morality:8a:u2"],
    },
    {
        "key": "mor-j-constitution",
        "type": "CONCEPTUAL",
        "domain": "法治教育",
        "name": "坚持宪法至上",
        "gradeStart": 8,
        "gradeEnd": 8,
        "description": "了解宪法的产生与历史，理解宪法是国家的根本法、具有最高法律效力，知道宪法的核心价值追求是规范国家权力运行以保障公民权利。",
        "evidence": [
            "能说出宪法与普通法律的两点区别",
            "能解释为什么要「把权力关进制度的笼子」",
        ],
        "assessment": "问{{name}}为什么说宪法是「母法」，其他法律为什么不能和它冲突。",
        "standards": ["morality-2022:S4:LE"],
        "textbooks": ["tb-morality:8b:u1"],
    },
    {
        "key": "mor-j-rights",
        "type": "CONCEPTUAL",
        "domain": "法治教育",
        "name": "理解权利义务",
        "gradeStart": 8,
        "gradeEnd": 8,
        "description": "掌握公民基本权利与基本义务的内容，理解权利与义务相统一，学会依法行使权利、自觉履行义务，知道权利受侵害时的法律救济渠道。",
        "evidence": [
            "能列举公民的三项基本权利和三项基本义务",
            "能分析一个案例中权利与义务是否统一",
        ],
        "assessment": "问{{name}}言论自由是无限的吗，边界在哪里，请他结合义务说明。",
        "standards": ["morality-2022:S4:LE"],
        "textbooks": ["tb-morality:8b:u2"],
    },
    {
        "key": "mor-j-system",
        "type": "CONCEPTUAL",
        "domain": "法治教育",
        "name": "国家制度与国家机构",
        "gradeStart": 8,
        "gradeEnd": 8,
        "description": "了解人民代表大会制度是根本政治制度，认识中国共产党领导的多党合作和政治协商制度等基本政治制度，知道国家机构的组织与运行原则。",
        "evidence": [
            "能说出人民代表大会制度的地位与运作方式",
            "能指出政府、法院、检察院各自的性质",
        ],
        "assessment": "问{{name}}人大代表是怎样产生的、政府和人大是什么关系。",
        "standards": ["morality-2022:S4:LE"],
        "textbooks": ["tb-morality:8b:u3", "tb-morality:8b:u4"],
    },
    {
        "key": "mor-j-lawchina",
        "type": "CONCEPTUAL",
        "domain": "法治教育",
        "name": "建设法治中国",
        "gradeStart": 8,
        "gradeEnd": 8,
        "description": "了解科学立法、严格执法、公正司法、全民守法的全面依法治国格局，理解法治与自由、公平正义的关系，认识法治政府的建设与法治信仰的培育。",
        "evidence": [
            "能说出全面依法治国的十六字方针",
            "能举出一项法治建设成就并说明其意义",
        ],
        "assessment": "问{{name}}遇到不公平的事，他可以循哪些法治渠道解决。",
        "standards": ["morality-2022:S4:LE"],
        "textbooks": ["tb-morality:8b:u5"],
    },

    # ===================== 中华优秀传统文化 =====================
    {
        "key": "mor-j-tradition",
        "type": "CONCEPTUAL",
        "domain": "中华优秀传统文化",
        "name": "传承中华优秀传统文化",
        "gradeStart": 7,
        "gradeEnd": 7,
        "description": "了解中华优秀传统文化的主要内容与核心思想理念，认识其当代价值与创造性转化、创新性发展，增强文化自信与民族自豪感。",
        "evidence": [
            "能说出中华优秀传统文化的三个方面",
            "能举例说明传统文化在今天的新形态",
        ],
        "assessment": "问{{name}}故宫文创为什么受欢迎，这体现了传统文化的什么转化。",
        "standards": ["morality-2022:S4:CT"],
        "textbooks": ["tb-morality:7b:u3"],
    },

    # ===================== 党史与革命传统 =====================
    {
        "key": "mor-j-party",
        "type": "CONCEPTUAL",
        "domain": "党史与革命传统",
        "name": "坚持党的全面领导",
        "gradeStart": 9,
        "gradeEnd": 9,
        "description": "了解中国共产党的性质、宗旨和执政理念，理解党是最高政治领导力量，知道党的全面领导体现在治国理政各领域，认识党内民主与自我革命。",
        "evidence": [
            "能说出党的性质和根本宗旨",
            "能举出一个体现党的领导的领域实例",
        ],
        "assessment": "问{{name}}为什么说党政军民学、东西南北中，党是领导一切的。",
        "standards": ["morality-2022:S4:RT"],
        "textbooks": ["tb-morality:9a:u1"],
    },

    # ===================== 国情与时代使命 =====================
    {
        "key": "mor-j-interest",
        "type": "CONCEPTUAL",
        "domain": "国情与时代使命",
        "name": "维护国家利益",
        "gradeStart": 8,
        "gradeEnd": 8,
        "description": "认识国家利益的内涵与至上的地位，了解总体国家安全观的内容，知道维护国家安全、荣誉和利益是公民的基本义务，能对危害国家安全的行为说「不」。",
        "evidence": [
            "能说出总体国家安全观涵盖的几个方面",
            "能判断一个行为是否危害国家安全",
        ],
        "assessment": "问{{name}}在网上看到涉密照片该怎么做，国家利益为什么至上。",
        "standards": ["morality-2022:S4:GU"],
        "textbooks": ["tb-morality:8a:u4"],
    },
    {
        "key": "mor-j-newera",
        "type": "CONCEPTUAL",
        "domain": "国情与时代使命",
        "name": "进入新时代",
        "gradeStart": 9,
        "gradeEnd": 9,
        "description": "了解我国社会主要矛盾的变化与新时代的历史方位，认识高质量发展、共同富裕等发展战略，理解全面深化改革的必要性与成就。",
        "evidence": [
            "能说出新时代我国社会主要矛盾是什么",
            "能举出一个高质量发展或共同富裕的实例",
        ],
        "assessment": "问{{name}}「共同富裕」是不是同时富裕、同步富裕，请他辨析。",
        "standards": ["morality-2022:S4:GU"],
        "textbooks": ["tb-morality:9a:u2"],
    },
    {
        "key": "mor-j-journey",
        "type": "CONCEPTUAL",
        "domain": "国情与时代使命",
        "name": "奋进新征程",
        "gradeStart": 9,
        "gradeEnd": 9,
        "description": "了解第二个百年奋斗目标与两步走战略安排，认识新发展理念与构建新发展格局，理解中国式现代化的特征与路径。",
        "evidence": [
            "能说出两步走战略安排的内容",
            "能说出中国式现代化的一个特征",
        ],
        "assessment": "问{{name}}中国式现代化和西方现代化有什么不同，请他说说理解。",
        "standards": ["morality-2022:S4:GU"],
        "textbooks": ["tb-morality:9a:u3"],
    },
    {
        "key": "mor-j-dreamcn",
        "type": "CONCEPTUAL",
        "domain": "国情与时代使命",
        "name": "共圆中国梦",
        "gradeStart": 9,
        "gradeEnd": 9,
        "description": "理解中国梦的内涵与实现路径，认识奋斗成就梦想，把个人理想融入民族复兴伟业，增强做中国人的志气、骨气、底气。",
        "evidence": [
            "能说出中国梦的基本内涵",
            "能把自己的理想与国家需要联系起来谈",
        ],
        "assessment": "问{{name}}中华民族伟大复兴的中国梦，和个人的梦是什么关系。",
        "standards": ["morality-2022:S4:GU"],
        "textbooks": ["tb-morality:9a:u4"],
    },
    {
        "key": "mor-j-world",
        "type": "CONCEPTUAL",
        "domain": "国情与时代使命",
        "name": "我们共同的世界",
        "gradeStart": 9,
        "gradeEnd": 9,
        "description": "了解世界多极化、经济全球化、文化多样性、社会信息化的趋势，认识和平与发展是时代主题及面临的挑战，理解构建人类命运共同体的意义。",
        "evidence": [
            "能说出当今世界的四个发展趋势",
            "能解释人类命运共同体理念解决什么问题",
        ],
        "assessment": "问{{name}}为什么全球气候问题需要各国共同应对，这体现了什么理念。",
        "standards": ["morality-2022:S4:GU"],
        "textbooks": ["tb-morality:9b:u1"],
    },
    {
        "key": "mor-j-chinaworld",
        "type": "CONCEPTUAL",
        "domain": "国情与时代使命",
        "name": "世界舞台上的中国",
        "gradeStart": 9,
        "gradeEnd": 9,
        "description": "了解中国在世界格局中的地位与作用，认识中国智慧、中国方案（一带一路、全球发展倡议等），理解中国式现代化与世界的关系，增强国际胜任力。",
        "evidence": [
            "能说出一个中国方案并解释它回应了什么全球问题",
            "能说出中国在国际事务中担当的一个例子",
        ],
        "assessment": "问{{name}}「一带一路」给沿线国家带来了什么，体现了怎样的大国担当。",
        "standards": ["morality-2022:S4:GU"],
        "textbooks": ["tb-morality:9b:u2"],
    },
]


EDGES = [
    # —— 生命安全与健康教育 ——
    ("mor-j-life", "mor-p-selfhealth", "soft", "生命教育从小学健全人格延续"),
    ("mor-j-youth", "mor-p-teen", "soft", "青春期专题从小学少年成长衔接"),
    ("mor-j-youth", "mor-j-life", "hard", "珍惜青春以认识生命价值为前提"),
    ("mor-j-vigor", "mor-j-youth", "hard", "情绪管理是青春期专题的深化"),

    # —— 道德修养与心理成长 ——
    ("mor-j-growth", "mor-j-dream", "hard", "成长的时空以少年有梦为起点"),
    ("mor-j-goodlife", "mor-j-dream", "soft", "人生观教育从梦想谈起"),
    ("mor-j-goodlife", "mor-j-growth", "soft", "美好人生在成长关系中展开"),
    ("mor-j-society", "mor-j-law-society", "hard", "走进社会先认识法治社会"),
    ("mor-j-society", "mor-p-public", "soft", "社会认知从小学公共生活启蒙"),
    ("mor-j-duty", "mor-j-society", "soft", "责任在社会参与中培养"),
    ("mor-j-duty", "mor-j-goodlife", "soft", "担当是美好人生的实践路径"),
    ("mor-j-duty", "mor-p-labor", "soft", "责任意识从小学劳动体验开始"),
    ("mor-j-future", "mor-j-dreamcn", "soft", "少年未来与中国梦相连"),
    ("mor-j-future", "mor-p-dream", "soft", "人生规划从童年梦想出发"),
    ("mor-j-future", "mor-j-duty", "soft", "职业选择以责任意识为参照"),

    # —— 法治教育 ——
    ("mor-j-law-society", "mor-p-law", "hard", "法律学习从小学法治启蒙衔接"),
    ("mor-j-order", "mor-j-law-society", "hard", "社会秩序靠规则与法律维护"),
    ("mor-j-order", "mor-j-society", "soft", "秩序是社会生活的公共品"),
    ("mor-j-constitution", "mor-j-order", "hard", "宪法是治国安邦的总章程"),
    ("mor-j-constitution", "mor-p-citizen", "hard", "宪法学习从小学公民教育起步"),
    ("mor-j-rights", "mor-j-constitution", "hard", "权利义务由宪法予以规定"),
    ("mor-j-rights", "mor-p-legal-rights", "soft", "权利义务从小学维权启蒙衔接"),
    ("mor-j-system", "mor-j-constitution", "hard", "国家制度依据宪法确立"),
    ("mor-j-lawchina", "mor-j-rights", "hard", "法治中国以权利保障为核心"),
    ("mor-j-lawchina", "mor-j-system", "hard", "法治中国依托制度与机构运行"),

    # —— 中华优秀传统文化 ——
    ("mor-j-tradition", "mor-p-virtue", "soft", "传统文化从传统美德启蒙开始"),

    # —— 党史与革命传统 ——
    ("mor-j-party", "mor-j-constitution", "hard", "党的领导是宪法确立的根本原则"),
    ("mor-j-party", "mor-p-party-history", "hard", "党史学习从小学百年追梦延续"),
    ("mor-j-party", "mor-j-interest", "soft", "党的领导与国家利益紧密相连"),

    # —— 国情与时代使命 ——
    ("mor-j-interest", "mor-j-duty", "soft", "国家利益是社会责任的升华"),
    ("mor-j-interest", "mor-p-motherland", "soft", "国家利益从热爱祖国起步"),
    ("mor-j-newera", "mor-j-party", "hard", "新时代叙事从党的领导讲起"),
    ("mor-j-journey", "mor-j-newera", "hard", "新征程接新时代的历史方位"),
    ("mor-j-dreamcn", "mor-j-journey", "hard", "中国梦在新征程中实现"),
    ("mor-j-world", "mor-j-interest", "soft", "世界图景从国家利益出发理解"),
    ("mor-j-world", "mor-p-betterworld", "soft", "世界认知从小学共同世界启蒙"),
    ("mor-j-chinaworld", "mor-j-world", "hard", "中国角色放在世界格局中看"),
    ("mor-j-chinaworld", "mor-j-dreamcn", "soft", "大国担当以民族复兴为底气"),
]


CLUSTERS = [
    {"domain": "生命安全与健康教育", "stage": "第四学段（7~9年级）",
     "summary": "从认识生命的独特与价值，到把握青春期的身心变化、学会与情绪相处、培养健康情趣，再到理解人生态度决定人生走向。重点是帮助孩子建立稳定的自我认同和积极的生命观，遇到困惑知道向谁求助、用什么方法。"},
    {"domain": "道德修养与心理成长", "stage": "第四学段（7~9年级）",
     "summary": "以「少年有梦」为起点，处理师生、同伴与网络交往，理解奋斗与奉献是美好人生的底色；进而走进社会、承担责任，最终把个人规划与职业理想、国家需要结合起来。重点是完成从「被照顾的孩子」到「有担当的少年」的转变。"},
    {"domain": "法治教育", "stage": "第四学段（7~9年级）",
     "summary": "一条清晰的法治主线：从认识法律与法治社会，到理解宪法至上、公民权利义务相统一，再到国家制度与国家机构的运行，最后落脚全面依法治国的格局。重点是既树立对法律的信仰，也掌握依法维权、有序参与的方法。"},
    {"domain": "中华优秀传统文化", "stage": "第四学段（7~9年级）",
     "summary": "系统了解中华优秀传统文化的主要内容与核心思想理念，认识它在当代的创造性转化与创新性发展。重点是建立文化认同与文化自信，能理性区分精华与糟粕。"},
    {"domain": "党史与革命传统", "stage": "第四学段（7~9年级）",
     "summary": "了解中国共产党的性质、宗旨与执政理念，理解党的全面领导是历史的选择、人民的选择，认识党在革命、建设、改革中的中流砥柱作用。重点是理解「没有共产党就没有新中国、就没有中国特色社会主义」的历史逻辑。"},
    {"domain": "国情与时代使命", "stage": "第四学段（7~9年级）",
     "summary": "从维护国家利益与总体国家安全观出发，认识新时代的历史方位、新征程的战略安排与中国式现代化的路径，理解中国梦与个人梦的关系；最后把中国放在世界多极化、经济全球化的格局中，认识人类命运共同体理念与大国担当。重点是建立历史纵深与全球视野，增强做中国人的志气、骨气、底气。"},
]

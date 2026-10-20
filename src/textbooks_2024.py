# -*- coding: utf-8 -*-
"""2024 年版课标修订教材（人教版/统编版）的单元级目录数据。

数据来源与口径：
  - 目录抓取自电子课本网（dzkbw.com）各册目录页，按文档流顺序解析，避免同页条目乱序；
  - 单元结构与电子教材网、教习网等公开目录交叉核对（含「时间在哪里」「数学连环画」等
    综合与实践活动的归属，以及 2026 春二年级下册的完整结构）；
  - 仅收录目录结构（单元/课节名称与页码），不收录教材正文；教材版权归人民教育出版社所有；
  - 版别（edition）取自册次标题，如「2024秋版」；本表覆盖 2024 年秋季启用的新版教材，
    按年级逐年替换旧版（2024秋一年级 / 2025秋二三年级 / 2026秋四至六年级）。

单元类型（type）：
  unit       常规单元（引用格式 版本:册次:uN，N 仅数 unit）
  activity   综合与实践活动（引用格式 版本:册次#活动名）
  enrichment 数学广角等拓展栏目
  intro      入学教育（语文一年级上册）
  revision   英语复习单元

清洗规则（相对源站的规范化，均已核对无歧义）：
  - 合并「古诗二首」等子条目为「N 古诗二首（甲、乙）」；
  - 「X-Y」连字符转为「X·Y」（源站把两行目录并作一行）；
  - 修正源站明显笔误（「干米」→「千米」、「未尾」→「末尾」等）；
  - 归一多余空格（如「加、 减法」→「加、减法」）。
"""

SOURCE = {
    "name": "电子课本网（dzkbw.com）教材目录页",
    "base": "http://www.dzkbw.com/books/",
    "crossCheck": "电子教材网（sjds.net）、教习网（51jiaoxi.com）等公开目录交叉核对",
    "fetchedAt": "2026-10-21",
    "licenseNote": "仅收录目录结构，不收录教材正文；教材版权归人民教育出版社所有。",
}

EDITIONS = (

[
  {
    "slug": "pep-math-2024",
    "name": "人教版数学（2024年版）",
    "shortName": "人教版数学",
    "edition": "2024年版",
    "subject": "数学",
    "gradeStart": 1,
    "note": "依据《义务教育数学课程标准（2022年版）》修订的新版教材，2024 年秋季起分年级替换旧版；截至 2026 年秋季，小学一至四年级已使用新版。",
    "books": [
      {
        "slug": "1a",
        "grade": 1,
        "semester": "上",
        "edition": "2024秋",
        "title": "人教版一年级上册(2024秋版)数学",
        "source": "http://www.dzkbw.com/books/rjb/shuxue/xs1s_2024/",
        "units": [
          {
            "name": "数学游戏",
            "type": "activity",
            "page": 6,
            "lessons": [
              "在校园里找一找",
              "在操场上玩一玩",
              "在教室里认一认",
              "在教室里玩一玩"
            ]
          },
          {
            "no": 1,
            "name": "5以内数的认识和加、减法",
            "type": "unit",
            "page": 17,
            "lessons": [
              "1～5的认识",
              "比大小",
              "第几",
              "分与合",
              "1～5的加、减法（加法）",
              "1～5的加、减法（减法）",
              "0的认识和加、减法",
              "整理和复习"
            ]
          },
          {
            "no": 2,
            "name": "6～10的认识和加、减法",
            "type": "unit",
            "page": 39,
            "lessons": [
              "6～9的认识",
              "6、7的组成",
              "8、9的组成",
              "6和7的加、减法",
              "用加法解决问题",
              "用减法解决问题",
              "8和9的加、减法",
              "用加、减法解决问题",
              "10的认识",
              "10的加、减法",
              "连加、连减 加、减混合",
              "整理和复习"
            ]
          },
          {
            "no": 3,
            "name": "认识立体图形",
            "type": "unit",
            "page": 72,
            "lessons": [
              "认识立体图形",
              "解决问题",
              "拼一拼"
            ]
          },
          {
            "no": 4,
            "name": "11～20的认识",
            "type": "unit",
            "page": 78,
            "lessons": [
              "10的再认识",
              "11～20 的认识",
              "简单加、减法",
              "解决问题",
              "整理和复习"
            ]
          },
          {
            "no": 5,
            "name": "20以内的进位加法",
            "type": "unit",
            "page": 93,
            "lessons": [
              "9加几",
              "8、7、6 加几",
              "5、4、3、2 加几",
              "解决问题",
              "逆向用加法解决问题",
              "整理和复习"
            ]
          },
          {
            "no": 6,
            "name": "复习与关联",
            "type": "unit",
            "page": 108,
            "lessons": [
              "数与运算",
              "数量关系",
              "图形的认识"
            ]
          }
        ]
      },
      {
        "slug": "1b",
        "grade": 1,
        "semester": "下",
        "edition": "2025春",
        "title": "人教版一年级下册(2025春版)数学",
        "source": "http://www.dzkbw.com/books/rjb/shuxue/xs1x_2025/",
        "units": [
          {
            "no": 1,
            "name": "认识平面图形",
            "type": "unit",
            "page": 6,
            "lessons": [
              "认识平面图形",
              "图形的拼组",
              "解决问题",
              "整理和复习"
            ]
          },
          {
            "no": 2,
            "name": "20以内的退位减法",
            "type": "unit",
            "page": 13,
            "lessons": [
              "十几减9",
              "十几减8、7、6",
              "十几减5、4、3、2",
              "解决问题",
              "整理和复习"
            ]
          },
          {
            "no": 3,
            "name": "100以内数的认识",
            "type": "unit",
            "page": 28,
            "lessons": [
              "数数、数的组成·不超过100的数数、数的组成",
              "读法和写法",
              "100的认识和写法",
              "数的顺序",
              "比大小",
              "用“大得多” “大一些” 说一说",
              "100以内简单的加、减法（整十数加减整十数、整十数加一位数和相应的减法）",
              "数学活动（选学）·摆一摆 想一想",
              "整理和复习"
            ]
          },
          {
            "no": 4,
            "name": "100以内的口算加、减法",
            "type": "unit",
            "page": 48,
            "lessons": [
              "口算加法·两位数加一位数和整十数（不进位）",
              "口算加法·两位数加一位数（进位）",
              "口算减法·两位数减一位数和整十数（不退位）",
              "口算减法·两位数减一位数（退位）",
              "用连减解决问题",
              "整理和复习"
            ]
          },
          {
            "no": 5,
            "name": "100以内的笔算加、减法",
            "type": "unit",
            "page": 61,
            "lessons": [
              "笔算加法",
              "笔算减法",
              "整理和复习"
            ]
          },
          {
            "no": 6,
            "name": "数量间的加减关系",
            "type": "unit",
            "page": 74,
            "lessons": [
              "解决求两数相差几的实际问题",
              "求比一个数多（或少）几的数是多少",
              "含相差数量关系的连续两问的问题",
              "整理和复习"
            ]
          },
          {
            "name": "欢乐购物街",
            "type": "activity",
            "page": 82,
            "lessons": [
              "认识人民币·认一认、换一换",
              "买卖我做主",
              "小讲堂"
            ]
          },
          {
            "no": 7,
            "name": "复习与关联",
            "type": "unit",
            "page": 88,
            "lessons": [
              "数与运算",
              "数量关系",
              "图形的认识"
            ]
          }
        ]
      },
      {
        "slug": "2a",
        "grade": 2,
        "semester": "上",
        "edition": "2025秋",
        "title": "人教版二年级上册(2025秋版)数学",
        "source": "http://www.dzkbw.com/books/rjb/shuxue/xs2s_2025/",
        "units": [
          {
            "no": 1,
            "name": "分类与整理",
            "type": "unit",
            "page": 6,
            "lessons": [
              "按给定标准分类",
              "自选标准分类",
              "逐层分类"
            ]
          },
          {
            "no": 2,
            "name": "1~6的表内乘法",
            "type": "unit",
            "page": 15,
            "lessons": [
              "乘法的初步认识 例1",
              "乘法的初步认识 例2",
              "5的乘法口诀",
              "2、3、4的乘法口诀",
              "乘加、乘减",
              "6的乘法口诀",
              "选择一种运算解决问题",
              "用乘法解决购物问题",
              "整理和复习"
            ]
          },
          {
            "no": 3,
            "name": "1～6的表内除法",
            "type": "unit",
            "page": 35,
            "lessons": [
              "平均分——包含",
              "平均分——等分",
              "除法（包含）及算式读法",
              "除法（均分）及算式各部分名称",
              "用2～6的乘法口诀求商（1）",
              "用2～6的乘法口诀求商（2）",
              "除法的基本应用",
              "整理和复习"
            ]
          },
          {
            "name": "校园小导游",
            "type": "activity",
            "page": 54,
            "lessons": [
              "认识东、南、西、北",
              "设计导游路线"
            ]
          },
          {
            "no": 4,
            "name": "厘米和米",
            "type": "unit",
            "page": 60,
            "lessons": [
              "认识厘米及用厘米量",
              "认识米及用米量",
              "认识线段",
              "用估量解决问题",
              "整理和复习"
            ]
          },
          {
            "name": "身体上的尺子",
            "type": "activity",
            "page": 73,
            "lessons": [
              "测量一些身体上的长度",
              "寻找、测量、运用身体尺"
            ]
          },
          {
            "no": 5,
            "name": "7～9的表内乘、除法",
            "type": "unit",
            "page": 78,
            "lessons": [
              "7的乘法口诀",
              "8的乘法口诀",
              "9的乘法口诀",
              "用7、8的乘法口诀求商",
              "用9的乘法口诀求商",
              "解决连续两问的问题",
              "整理和复习（表内乘法）",
              "整理和复习（表内除法）"
            ]
          },
          {
            "no": 6,
            "name": "复习与关联",
            "type": "unit",
            "page": 96,
            "lessons": [
              "数与运算",
              "数量关系",
              "图形的位置与测量"
            ]
          }
        ]
      },
      {
        "slug": "2b",
        "grade": 2,
        "semester": "下",
        "edition": "2026春",
        "title": "人教版二年级下册(2026春版)数学",
        "source": "http://www.dzkbw.com/books/rjb/shuxue/xs2x_2026/",
        "units": [
          {
            "name": "时间在哪里",
            "type": "activity",
            "page": 6,
            "lessons": [
              "认识时间",
              "我与时间的故事",
              "我的时间小书",
              "小讲堂"
            ]
          },
          {
            "no": 1,
            "name": "有余数的除法",
            "type": "unit",
            "page": 6,
            "lessons": [
              "有余数的除法",
              "整理和复习"
            ]
          },
          {
            "no": 2,
            "name": "数量间的乘除关系",
            "type": "unit",
            "page": 29,
            "lessons": [
              "数量间的乘除关系",
              "整理和复习"
            ]
          },
          {
            "no": 3,
            "name": "万以内数的认识",
            "type": "unit",
            "page": 45,
            "lessons": [
              "1000以内数的认识",
              "10000以内数的认识",
              "简单的加、减法",
              "整理和复习"
            ]
          },
          {
            "no": 4,
            "name": "万以内的加法和减法",
            "type": "unit",
            "page": 68,
            "lessons": [
              "1.加法",
              "2.减法",
              "3.加减法各部分间的关系",
              "数独游戏",
              "整理和复习"
            ]
          },
          {
            "name": "数学连环画",
            "type": "activity",
            "page": 88,
            "lessons": [
              "连环画分享会",
              "我是小画家",
              "小小故事会"
            ]
          },
          {
            "no": 5,
            "name": "复习与关联",
            "type": "unit",
            "page": 92,
            "lessons": [
              "整理复习",
              "数与运算",
              "数量关系",
              "应用提升"
            ]
          }
        ]
      },
      {
        "slug": "3a",
        "grade": 3,
        "semester": "上",
        "edition": "2025秋",
        "title": "人教版三年级上册(2025秋版)数学",
        "source": "http://www.dzkbw.com/books/rjb/shuxue/xs3s_2025/",
        "units": [
          {
            "no": 1,
            "name": "观察物体",
            "type": "unit",
            "page": 6,
            "lessons": [
              "观察简单的立体积木",
              "根据直观图猜测积木形状",
              "长方体纸盒的展开"
            ]
          },
          {
            "no": 2,
            "name": "混合运算",
            "type": "unit",
            "page": 11,
            "lessons": [
              "同级运算",
              "两级运算",
              "含有小括号的两级运算",
              "解决问题(同级运算)",
              "解决问题(两级计算)",
              "解决问题(两种思路)",
              "整理和复习"
            ]
          },
          {
            "no": 3,
            "name": "毫米、分米和千米",
            "type": "unit",
            "page": 25,
            "lessons": [
              "毫米的认识",
              "分米的认识及单位换算",
              "千米的认识及单位换算",
              "问题解决（估测距离）",
              "整理和复习"
            ]
          },
          {
            "name": "曹冲称象的故事",
            "type": "activity",
            "page": 36,
            "lessons": [
              "曹冲称象的故事（等量代换）",
              "认识质量单位",
              "称重我很行",
              "称重大挑战",
              "小讲堂"
            ]
          },
          {
            "no": 4,
            "name": "多位数乘一位数",
            "type": "unit",
            "page": 44,
            "lessons": [
              "口算乘法",
              "笔算乘法(不进位)",
              "笔算乘法(进位)",
              "笔算乘法(连续进位)",
              "笔算乘法(0的乘法)",
              "笔算乘法（数位中间或末尾有0）",
              "乘法估算",
              "整理和复习"
            ]
          },
          {
            "name": "数字编码",
            "type": "activity",
            "page": 62,
            "lessons": [
              "认识数字编码",
              "编制学号"
            ]
          },
          {
            "no": 5,
            "name": "线和角",
            "type": "unit",
            "page": 66,
            "lessons": [
              "线段、射线、直线的概念",
              "用圆规比较线段的长短",
              "角的认识",
              "直角、锐角、钝角",
              "整理和复习"
            ]
          },
          {
            "no": 6,
            "name": "分数的初步认识",
            "type": "unit",
            "page": 78,
            "lessons": [
              "认识二分之一",
              "认识几分之一",
              "认识几分之几",
              "简单的分数大小比较",
              "同分母分数的加减法",
              "分数的简单计算",
              "进一步认识分数",
              "问题解决",
              "整理和复习"
            ]
          },
          {
            "no": 7,
            "name": "复习与关联",
            "type": "unit",
            "page": 97,
            "lessons": [
              "数与运算",
              "数量关系",
              "图形的认识与测量"
            ]
          },
          {
            "name": "数学广角：搭配问题",
            "type": "enrichment",
            "page": 106,
            "lessons": []
          }
        ]
      },
      {
        "slug": "3b",
        "grade": 3,
        "semester": "下",
        "edition": "2026春",
        "title": "人教版三年级下册(2026春版)数学",
        "source": "http://www.dzkbw.com/books/rjb/shuxue/xs3x_2026/",
        "units": [
          {
            "no": 1,
            "name": "生活中的运动现象",
            "type": "unit",
            "page": 6,
            "lessons": [
              "生活中的运动现象",
              "剪纸"
            ]
          },
          {
            "no": 2,
            "name": "除数是一位数的除法",
            "type": "unit",
            "page": 15,
            "lessons": [
              "1.口算除法",
              "2.笔算除法",
              "整理和复习"
            ]
          },
          {
            "no": 3,
            "name": "长方形和正方形",
            "type": "unit",
            "page": 44,
            "lessons": [
              "多边形",
              "周长",
              "拼图游戏",
              "整理和复习"
            ]
          },
          {
            "no": 4,
            "name": "图形的面积",
            "type": "unit",
            "page": 57,
            "lessons": [
              "面积和面积单位",
              "长方形和正方形的面积",
              "面积单位间的进率",
              "整理和复习"
            ]
          },
          {
            "no": 5,
            "name": "数据的收集与整理",
            "type": "unit",
            "page": 70,
            "lessons": [
              "数据的收集与整理",
              "整理和复习"
            ]
          },
          {
            "name": "年、月、日的秘密",
            "type": "activity",
            "page": 82,
            "lessons": [
              "年历中的秘密",
              "作息时间表中的秘密",
              "年历设计师",
              "小讲堂"
            ]
          },
          {
            "no": 6,
            "name": "小数的初步认识",
            "type": "unit",
            "page": 91,
            "lessons": [
              "认识小数",
              "小数的大小比较",
              "简单的小数加、减法",
              "整理和复习"
            ]
          },
          {
            "no": 7,
            "name": "复习与关联",
            "type": "unit",
            "page": 100,
            "lessons": [
              "整理复习",
              "数与运算",
              "数量关系",
              "图形的认识与测量",
              "数据的收集、整理与表达",
              "常见的量",
              "应用提升"
            ]
          }
        ]
      },
      {
        "slug": "4a",
        "grade": 4,
        "semester": "上",
        "edition": "2026秋",
        "title": "人教版四年级上册(2026秋版)数学",
        "source": "http://www.dzkbw.com/books/rjb/shuxue/xs4s_2026/",
        "units": [
          {
            "no": 1,
            "name": "万以上数的认识",
            "type": "unit",
            "page": 6,
            "lessons": []
          },
          {
            "name": "1亿有多大",
            "type": "activity",
            "page": 29,
            "lessons": []
          },
          {
            "no": 2,
            "name": "角的度量",
            "type": "unit",
            "page": 33,
            "lessons": []
          },
          {
            "no": 3,
            "name": "多位数乘两位数",
            "type": "unit",
            "page": 44,
            "lessons": []
          },
          {
            "no": 4,
            "name": "加法模型和乘法模型",
            "type": "unit",
            "page": 63,
            "lessons": []
          },
          {
            "no": 5,
            "name": "平行四边形和梯形",
            "type": "unit",
            "page": 75,
            "lessons": []
          },
          {
            "no": 6,
            "name": "条形统计图",
            "type": "unit",
            "page": 93,
            "lessons": []
          },
          {
            "name": "寻找宝藏",
            "type": "activity",
            "page": 107,
            "lessons": []
          },
          {
            "no": 7,
            "name": "复习与关联",
            "type": "unit",
            "page": 113,
            "lessons": []
          }
        ]
      }
    ]
  },
  {
    "slug": "tongbian-chinese-2024",
    "name": "统编版语文（2024年版）",
    "shortName": "统编版语文",
    "edition": "2024年版",
    "subject": "语文",
    "gradeStart": 1,
    "note": "依据《义务教育语文课程标准（2022年版）》修订的新版教材，2024 年秋季起分年级替换旧版；截至 2026 年秋季，小学一至四年级已使用新版。",
    "books": [
      {
        "slug": "1a",
        "grade": 1,
        "semester": "上",
        "edition": "2024秋",
        "title": "人教版一年级上册(2024秋版)语文(部编版)",
        "source": "http://www.dzkbw.com/books/rjb/yuwen/xs1s_2024/",
        "units": [
          {
            "name": "我上学了",
            "type": "intro",
            "page": 7,
            "lessons": [
              "我是中国人",
              "我爱我们的祖国",
              "我是小学生",
              "我爱学语文"
            ]
          },
          {
            "no": 1,
            "name": "识字",
            "type": "unit",
            "page": 13,
            "lessons": [
              "1 天地人",
              "2 金木水火土",
              "3 口耳目手足",
              "4 日月山川",
              "语文园地一",
              "快乐读书吧 读书真快乐"
            ]
          },
          {
            "no": 2,
            "name": "汉语拼音",
            "type": "unit",
            "page": 25,
            "lessons": [
              "1 ɑ o e",
              "2 i u ü",
              "3 b p m f",
              "4 d t n l",
              "语文园地二"
            ]
          },
          {
            "no": 3,
            "name": "汉语拼音",
            "type": "unit",
            "page": 37,
            "lessons": [
              "5 g k h",
              "6 j q x",
              "7 z c s",
              "8 zh ch sh r",
              "9 y w",
              "语文园地三"
            ]
          },
          {
            "no": 4,
            "name": "汉语拼音",
            "type": "unit",
            "page": 50,
            "lessons": [
              "10 ɑi ei ui",
              "11 ɑo ou iu",
              "12 ie üe er",
              "13 ɑn en in un ün",
              "14 ɑng eng ing ong",
              "语文园地四"
            ]
          },
          {
            "no": 5,
            "name": "阅读",
            "type": "unit",
            "page": 65,
            "lessons": [
              "1 秋天",
              "2 江南",
              "3 雪地里的小画家",
              "4 四季",
              "语文园地五"
            ]
          },
          {
            "no": 6,
            "name": "识字",
            "type": "unit",
            "page": 78,
            "lessons": [
              "5 对韵歌",
              "6 日月明",
              "7 小书包",
              "8 升国旗",
              "语文园地六"
            ]
          },
          {
            "no": 7,
            "name": "阅读",
            "type": "unit",
            "page": 89,
            "lessons": [
              "5 小小的船",
              "6 影子",
              "7 两件宝",
              "语文园地七"
            ]
          },
          {
            "no": 8,
            "name": "阅读",
            "type": "unit",
            "page": 100,
            "lessons": [
              "8 比尾巴",
              "9 乌鸦喝水",
              "10 雨点儿",
              "语文园地八"
            ]
          }
        ]
      },
      {
        "slug": "1b",
        "grade": 1,
        "semester": "下",
        "edition": "2025春",
        "title": "人教版一年级下册(2025春版)语文(部编版)",
        "source": "http://www.dzkbw.com/books/rjb/yuwen/xs1x_2025/",
        "units": [
          {
            "no": 1,
            "name": "识字",
            "type": "unit",
            "page": 7,
            "lessons": [
              "1 春夏秋冬",
              "2 姓氏歌",
              "3 小青蛙",
              "4 猜字谜",
              "语文园地一",
              "快乐读书吧 读读童谣和儿歌"
            ]
          },
          {
            "no": 2,
            "name": "阅读",
            "type": "unit",
            "page": 21,
            "lessons": [
              "1 热爱中国共产党",
              "2 吃水不忘挖井人",
              "3 我多想去看看",
              "语文园地二"
            ]
          },
          {
            "no": 3,
            "name": "阅读",
            "type": "unit",
            "page": 31,
            "lessons": [
              "4 小公鸡和小鸭子",
              "5 树和喜鹊",
              "6 怎么都快乐",
              "语文园地三"
            ]
          },
          {
            "no": 4,
            "name": "阅读",
            "type": "unit",
            "page": 44,
            "lessons": [
              "7 静夜思",
              "8 夜色",
              "9 端午粽",
              "语文园地四"
            ]
          },
          {
            "no": 5,
            "name": "识字",
            "type": "unit",
            "page": 53,
            "lessons": [
              "5 动物儿歌",
              "6 古对今",
              "7 操场上",
              "8 人之初",
              "语文园地五"
            ]
          },
          {
            "no": 6,
            "name": "阅读",
            "type": "unit",
            "page": 66,
            "lessons": [
              "10 古诗二首（池上、小池）",
              "11 浪花",
              "12 荷叶圆圆",
              "13 要下雨了",
              "语文园地六"
            ]
          },
          {
            "no": 7,
            "name": "阅读",
            "type": "unit",
            "page": 83,
            "lessons": [
              "14 文具的家",
              "15 一分钟",
              "16 动物王国开大会",
              "17 小猴子下山",
              "语文园地七"
            ]
          },
          {
            "no": 8,
            "name": "阅读",
            "type": "unit",
            "page": 103,
            "lessons": [
              "18 棉花姑娘",
              "19 咕咚",
              "20 小壁虎借尾巴",
              "语文园地八"
            ]
          }
        ],
        "appendix": [
          "识字表",
          "写字表",
          "常用偏旁名称表"
        ]
      },
      {
        "slug": "2a",
        "grade": 2,
        "semester": "上",
        "edition": "2025秋",
        "title": "人教版二年级上册(2025秋版)语文(部编版)",
        "source": "http://www.dzkbw.com/books/rjb/yuwen/xs2s_2025/",
        "units": [
          {
            "no": 1,
            "name": "阅读",
            "type": "unit",
            "page": 6,
            "lessons": [
              "1 小蝌蚪找妈妈",
              "2 我是什么",
              "3 植物妈妈有办法",
              "语文园地一",
              "快乐读书吧 读读童话故事"
            ]
          },
          {
            "no": 2,
            "name": "识字",
            "type": "unit",
            "page": 21,
            "lessons": [
              "1 场景歌",
              "2 树之歌",
              "3 拍手歌",
              "4 田家四季歌",
              "语文园地二"
            ]
          },
          {
            "no": 3,
            "name": "阅读",
            "type": "unit",
            "page": 33,
            "lessons": [
              "4 彩虹",
              "5 去外婆家",
              "6 数星星的孩子",
              "语文园地三"
            ]
          },
          {
            "no": 4,
            "name": "阅读",
            "type": "unit",
            "page": 44,
            "lessons": [
              "7 古诗二首（登鹳雀楼、望庐山瀑布）",
              "8 黄山奇石",
              "9 日月潭",
              "10 葡萄沟",
              "语文园地四"
            ]
          },
          {
            "no": 5,
            "name": "阅读",
            "type": "unit",
            "page": 59,
            "lessons": [
              "11 坐井观天",
              "12 寒号鸟",
              "13 我要的是葫芦",
              "语文园地五"
            ]
          },
          {
            "no": 6,
            "name": "阅读",
            "type": "unit",
            "page": 72,
            "lessons": [
              "14 八角楼上",
              "15 朱德的扁担",
              "16 难忘的泼水节",
              "17 刘胡兰",
              "语文园地六"
            ]
          },
          {
            "no": 7,
            "name": "阅读",
            "type": "unit",
            "page": 86,
            "lessons": [
              "18 古诗二首（江雪、敕勒歌）",
              "19 雾在哪里",
              "20 雪孩子",
              "语文园地七"
            ]
          },
          {
            "no": 8,
            "name": "阅读",
            "type": "unit",
            "page": 100,
            "lessons": [
              "21 称赞",
              "22 纸船和风筝",
              "23 快乐的小河",
              "语文园地八"
            ]
          }
        ],
        "appendix": [
          "识字表",
          "写字表",
          "词语表"
        ]
      },
      {
        "slug": "2b",
        "grade": 2,
        "semester": "下",
        "edition": "2026春",
        "title": "人教版二年级下册(2026春版)语文(部编版)",
        "source": "http://www.dzkbw.com/books/rjb/yuwen/xs2x_2026/",
        "units": [
          {
            "no": 1,
            "name": "",
            "type": "unit",
            "page": 6,
            "lessons": [
              "1 古诗二首（咏柳、村居）",
              "2 找春天",
              "3 开满鲜花的小路",
              "4 邓小平爷爷植树",
              "语文园地一"
            ]
          },
          {
            "no": 2,
            "name": "",
            "type": "unit",
            "page": 20,
            "lessons": [
              "5 雷锋叔叔，你在哪里",
              "6 千人糕",
              "7 我不是最弱小的",
              "语文园地二"
            ]
          },
          {
            "no": 3,
            "name": "",
            "type": "unit",
            "page": 34,
            "lessons": [
              "1 神州谣",
              "2 传统节日",
              "3 “贝”的故事",
              "4 中国美食",
              "语文园地三"
            ]
          },
          {
            "no": 4,
            "name": "",
            "type": "unit",
            "page": 47,
            "lessons": [
              "8 彩色的梦",
              "9 一匹出色的马",
              "10 枫树上的喜鹊",
              "语文园地四"
            ]
          },
          {
            "no": 5,
            "name": "",
            "type": "unit",
            "page": 60,
            "lessons": [
              "11 寓言二则（亡羊补牢、揠苗助长）",
              "12 画杨桃",
              "13 小马过河",
              "语文园地五"
            ]
          },
          {
            "no": 6,
            "name": "",
            "type": "unit",
            "page": 74,
            "lessons": [
              "14 古诗二首（绝句、晓出净慈寺送林子方）",
              "15 雷雨",
              "16 要是你在野外迷了路",
              "17 太空生活趣事多",
              "语文园地六"
            ]
          },
          {
            "no": 7,
            "name": "",
            "type": "unit",
            "page": 89,
            "lessons": [
              "18 大象的耳朵",
              "19 蜘蛛开店",
              "20 青蛙卖泥塘",
              "21 小毛虫",
              "语文园地七"
            ]
          },
          {
            "no": 8,
            "name": "",
            "type": "unit",
            "page": 105,
            "lessons": [
              "22 羿射九日",
              "23 黄帝的传说",
              "24 大禹治水",
              "语文园地八"
            ]
          }
        ],
        "appendix": [
          "识字表",
          "写字表",
          "词语表"
        ]
      },
      {
        "slug": "3a",
        "grade": 3,
        "semester": "上",
        "edition": "2025秋",
        "title": "人教版三年级上册(2025秋版)语文(部编版)",
        "source": "http://www.dzkbw.com/books/rjb/yuwen/xs3s_2025/",
        "units": [
          {
            "no": 1,
            "name": "",
            "type": "unit",
            "page": 6,
            "lessons": [
              "1 大青树下的小学",
              "2 花的学校",
              "3* 不懂就要问",
              "口语交际：我的暑假生活",
              "习作：猜猜他是谁",
              "语文园地"
            ]
          },
          {
            "no": 2,
            "name": "",
            "type": "unit",
            "page": 18,
            "lessons": [
              "4 古诗三首",
              "5 铺满金色巴掌的水泥道",
              "6 秋天的雨",
              "7* 听听，秋的声音",
              "习作：写日记",
              "语文园地"
            ]
          },
          {
            "no": 3,
            "name": "",
            "type": "unit",
            "page": 32,
            "lessons": [
              "8 总也倒不了的老屋",
              "9* 犟龟",
              "10* 小狗学叫",
              "口语交际：名字里的故事",
              "习作：续写故事",
              "语文园地"
            ]
          },
          {
            "no": 4,
            "name": "",
            "type": "unit",
            "page": 50,
            "lessons": [
              "11 宝葫芦的秘密（节选）",
              "12 在牛肚子里旅行",
              "13* 一块奶酪",
              "习作：我来编童话",
              "语文园地",
              "快乐读书吧",
              "在那奇妙的王国里"
            ]
          },
          {
            "no": 5,
            "name": "",
            "type": "unit",
            "page": 64,
            "lessons": [
              "14 搭船的鸟",
              "15 金色的草地",
              "习作：我们眼中的缤纷世界",
              "例文：我家的小狗",
              "例文：我爱故乡的杨梅",
              "梳理与交流、初试身手"
            ]
          },
          {
            "no": 6,
            "name": "",
            "type": "unit",
            "page": 74,
            "lessons": [
              "16 富饶的西沙群岛",
              "17 海滨小城",
              "18 美丽的小兴安岭",
              "19* 香港，璀璨的明珠",
              "习作：这儿真美",
              "语文园地"
            ]
          },
          {
            "no": 7,
            "name": "",
            "type": "unit",
            "page": 88,
            "lessons": [
              "20 古诗三首",
              "21 大自然的声音",
              "22 读不完的大书",
              "口语交际：身边的“小事”",
              "习作：我有一个想法",
              "语文园地"
            ]
          },
          {
            "no": 8,
            "name": "",
            "type": "unit",
            "page": 100,
            "lessons": [
              "23 司马光",
              "24 一定要争气",
              "25 手术台就是阵地",
              "26* 一个粗瓷大碗",
              "口语交际：请教",
              "习作：那次经历真难忘",
              "语文园地"
            ]
          }
        ]
      },
      {
        "slug": "3b",
        "grade": 3,
        "semester": "下",
        "edition": "2026春",
        "title": "人教版三年级下册(2026春版)语文(部编版)",
        "source": "http://www.dzkbw.com/books/rjb/yuwen/xs3x_2026/",
        "units": [
          {
            "no": 1,
            "name": "",
            "type": "unit",
            "page": 6,
            "lessons": [
              "1 古诗三首（绝句、惠崇春江晚景、三衢道中）",
              "2 燕子",
              "3 荷花",
              "4* 昆虫备忘录",
              "口语交际：春游去哪儿玩",
              "习作：我的植物朋友",
              "语文园地"
            ]
          },
          {
            "no": 2,
            "name": "",
            "type": "unit",
            "page": 20,
            "lessons": [
              "5 守株待兔",
              "6 会摇尾巴的狼",
              "7 鹿角和鹿腿",
              "8* 池子与河流",
              "口语交际：劝告",
              "习作：看图画，写一写",
              "语文园地",
              "快乐读书吧"
            ]
          },
          {
            "no": 3,
            "name": "",
            "type": "unit",
            "page": 38,
            "lessons": [
              "9 海底世界",
              "10 石蜂",
              "11 小虾",
              "习作：我做了一项小实验",
              "语文园地"
            ]
          },
          {
            "no": 4,
            "name": "",
            "type": "unit",
            "page": 48,
            "lessons": [
              "12 古诗三首（元日、清明、九月九日忆山东兄弟）",
              "13 纸的发明",
              "14 赵州桥",
              "15* 一幅名扬中外的画",
              "综合性学习：中华传统节日",
              "语文园地"
            ]
          },
          {
            "no": 5,
            "name": "",
            "type": "unit",
            "page": 62,
            "lessons": [
              "16 胡萝卜先生的长胡子",
              "17 我变成了一棵树",
              "习作：奇妙的想象"
            ]
          },
          {
            "no": 6,
            "name": "",
            "type": "unit",
            "page": 74,
            "lessons": [
              "18 童年的水墨画",
              "19 肥皂泡",
              "20 灰雀",
              "21* 我不能失信",
              "习作：身边那些有特点的人",
              "语文园地"
            ]
          },
          {
            "no": 7,
            "name": "",
            "type": "unit",
            "page": 88,
            "lessons": [
              "22 火烧云",
              "23 暴风雨来临之前",
              "24 我们奇妙的世界",
              "习作：国宝大熊猫",
              "语文园地"
            ]
          },
          {
            "no": 8,
            "name": "",
            "type": "unit",
            "page": 100,
            "lessons": [
              "25 慢性子裁缝和急性子顾客",
              "26 漏",
              "27 *枣核",
              "口语交际：趣味故事会",
              "习作：这样想象真有趣",
              "语文园地"
            ]
          }
        ],
        "appendix": [
          "识字表",
          "写字表",
          "词语表"
        ]
      },
      {
        "slug": "4a",
        "grade": 4,
        "semester": "上",
        "edition": "2026秋",
        "title": "人教版四年级上册(2026秋版)语文(部编版)",
        "source": "http://www.dzkbw.com/books/rjb/yuwen/xs4s_2026/",
        "units": [
          {
            "no": 1,
            "name": "",
            "type": "unit",
            "page": 6,
            "lessons": [
              "1 观潮",
              "2 繁星",
              "3* 现代诗二首（秋晚的江上、花牛歌）",
              "口语交际：我们与环境",
              "习作：推荐一个好地方",
              "语文园地"
            ]
          },
          {
            "no": 2,
            "name": "",
            "type": "unit",
            "page": 18,
            "lessons": [
              "4 一个豆荚里的五粒豆",
              "5 夜间飞行的秘密",
              "6 方帽子店",
              "7* 田忌赛马",
              "习作：我的家人",
              "语文园地"
            ]
          },
          {
            "no": 3,
            "name": "",
            "type": "unit",
            "page": 38,
            "lessons": [
              "8 古诗三首（暮江吟、题西林壁、雪梅）",
              "9 爬山虎的脚",
              "10 蟋蟀的住宅",
              "口语交际：爱护眼睛，保护视力",
              "习作：写观察日记",
              "语文园地"
            ]
          },
          {
            "no": 4,
            "name": "",
            "type": "unit",
            "page": 52,
            "lessons": [
              "11 盘古开天地",
              "12 精卫填海",
              "13 普罗米修斯",
              "14* 女娲补天",
              "习作：我和____过一天",
              "语文园地",
              "快乐读书吧：很久很久以前"
            ]
          },
          {
            "no": 5,
            "name": "",
            "type": "unit",
            "page": 66,
            "lessons": [
              "15 麻雀",
              "16 爬天都峰",
              "习作：生活万花筒",
              "例文：我家的杏熟了",
              "例文：小木船"
            ]
          },
          {
            "no": 6,
            "name": "",
            "type": "unit",
            "page": 78,
            "lessons": [
              "17 长城",
              "18 颐和园",
              "19* 秦兵马俑",
              "口语交际 我是小小讲解员",
              "习作：中国的世界文化遗产",
              "语文园地"
            ]
          },
          {
            "no": 7,
            "name": "",
            "type": "unit",
            "page": 92,
            "lessons": [
              "20 牛和鹅",
              "21 一只窝囊的大老虎",
              "22* 陀螺",
              "23 王戎不取道旁李",
              "口语交际：安慰",
              "习作：我的心儿怦怦跳",
              "语文园地"
            ]
          },
          {
            "no": 8,
            "name": "",
            "type": "unit",
            "page": 112,
            "lessons": [
              "24 我将无我，不负人民",
              "25 为中华之崛起而读书",
              "26* 延安，我把你追寻",
              "27 古诗三首（凉州词、出塞、夏日绝句）",
              "习作：写信",
              "语文园地"
            ]
          }
        ],
        "appendix": [
          "识字表",
          "写字表",
          "词语表"
        ]
      }
    ]
  },
  {
    "slug": "pep-english-2024",
    "name": "人教版英语（PEP·2024年版）",
    "shortName": "人教版英语（PEP）",
    "edition": "2024年版",
    "subject": "英语",
    "gradeStart": 3,
    "note": "依据《义务教育英语课程标准（2022年版）》修订的新版教材，2024 年秋季起自三年级替换旧版；截至 2026 年秋季，三至五年级已使用新版（单元主题与旧版差异很大）。",
    "books": [
      {
        "slug": "3a",
        "grade": 3,
        "semester": "上",
        "edition": "2024秋",
        "title": "人教版三年级上册(2024秋版)英语(PEP)",
        "source": "http://www.dzkbw.com/books/rjb/yingyu/pep3s_2024/",
        "units": [
          {
            "no": 1,
            "name": "Making friends",
            "type": "unit",
            "page": 7,
            "lessons": [
              "Part A How do we greet friends?",
              "Part B How can we be a good friend?",
              "Part C Project Make a mind map of making friends?"
            ]
          },
          {
            "no": 2,
            "name": "Different families",
            "type": "unit",
            "page": 19,
            "lessons": [
              "Part A Who lives with you?",
              "Part B How are families different?",
              "Part C Project Make a family tree"
            ]
          },
          {
            "no": 3,
            "name": "Amazing animals",
            "type": "unit",
            "page": 31,
            "lessons": [
              "Part A What pets do you know?",
              "Part B What wild animals do you know?",
              "Part C Project Make an animal picture book"
            ]
          },
          {
            "no": 4,
            "name": "Plants around us",
            "type": "unit",
            "page": 43,
            "lessons": [
              "Part A What do we get from plants?",
              "Part B How can we help plants?",
              "Part C Project Make a paper garden"
            ]
          },
          {
            "no": 5,
            "name": "The colourful world",
            "type": "unit",
            "page": 55,
            "lessons": [
              "Part A What colours do you see?",
              "Part B How do colours help us?",
              "Part C Project Make a colour flip book"
            ]
          },
          {
            "no": 6,
            "name": "Useful numbers",
            "type": "unit",
            "page": 67,
            "lessons": [
              "Part A When do we use numbers?",
              "Part B How useful are numbers?",
              "Part C Project Make a birthday card"
            ]
          },
          {
            "name": "Being a good guest",
            "type": "revision",
            "page": 79,
            "lessons": []
          }
        ]
      },
      {
        "slug": "3b",
        "grade": 3,
        "semester": "下",
        "edition": "2025春",
        "title": "人教版三年级下册(2025春版)英语(PEP)",
        "source": "http://www.dzkbw.com/books/rjb/yingyu/pep3x_2025/",
        "units": [
          {
            "no": 1,
            "name": "Meeting new people",
            "type": "unit",
            "page": 7,
            "lessons": [
              "Part A How do we greet new people?",
              "Part B How can we be polite?",
              "Part C (optional)",
              "Grammar"
            ]
          },
          {
            "no": 2,
            "name": "Expressing yourself",
            "type": "unit",
            "page": 19,
            "lessons": [
              "Part A How do we describe things?",
              "Part B How do we express our feelings?",
              "Part C (optional)",
              "Grammar"
            ]
          },
          {
            "no": 3,
            "name": "Learning better",
            "type": "unit",
            "page": 31,
            "lessons": [
              "Part A What tools help us learn?",
              "Part B How do our senses help us learn?",
              "Part C (optional)",
              "Grammar"
            ]
          },
          {
            "no": 4,
            "name": "Healthy food",
            "type": "unit",
            "page": 43,
            "lessons": [
              "Part A What do we eat?",
              "Part B What shall we eat?",
              "Part C (optional)",
              "Grammar"
            ]
          },
          {
            "no": 5,
            "name": "Old toys",
            "type": "unit",
            "page": 55,
            "lessons": [
              "Part A What kinds of old things do you have?",
              "Part B How can old things be reused?",
              "Part C (optional)",
              "Grammar"
            ]
          },
          {
            "no": 6,
            "name": "Numbers in life",
            "type": "unit",
            "page": 67,
            "lessons": [
              "Part A How do numbers help us count and sort?",
              "Part B How do numbers help us make decisions?",
              "Part C (optional)",
              "Grammar"
            ]
          },
          {
            "name": "Going to a school fair",
            "type": "revision",
            "page": 79,
            "lessons": []
          }
        ]
      },
      {
        "slug": "4a",
        "grade": 4,
        "semester": "上",
        "edition": "2025秋",
        "title": "人教版四年级上册(2025秋版)英语(PEP)",
        "source": "http://www.dzkbw.com/books/rjb/yingyu/pep4s_2025/",
        "units": [
          {
            "no": 1,
            "name": "Helping at home",
            "type": "unit",
            "page": 7,
            "lessons": [
              "Part A How are families different?",
              "Part B How can we help our family?",
              "Part C Project: Make a poster of a happy family",
              "Reading time"
            ]
          },
          {
            "no": 2,
            "name": "My friends",
            "type": "unit",
            "page": 19,
            "lessons": [
              "Part A Who are your friends?",
              "Part B How do we choose our friends?",
              "Part C Project: Make a book about your friend",
              "Reading time"
            ]
          },
          {
            "no": 3,
            "name": "Places we live in",
            "type": "unit",
            "page": 31,
            "lessons": [
              "Part A What can we see in a community?",
              "Part B What do people do in a community?",
              "Part C Project: Make a dream community mode",
              "Reading time"
            ]
          },
          {
            "no": 4,
            "name": "Helping in the community",
            "type": "unit",
            "page": 43,
            "lessons": [
              "Part A What jobs are important in a community?",
              "Part B How can young people help their community?",
              "Part C Project: Make a poster of your school helpers",
              "Reading time"
            ]
          },
          {
            "no": 5,
            "name": "The weather and us",
            "type": "unit",
            "page": 55,
            "lessons": [
              "Part A How can the weather be different?",
              "Part B What do we do in different weather?",
              "Part C Project: Make a bad weather reminder",
              "Reading time"
            ]
          },
          {
            "no": 6,
            "name": "Changing for the seasons",
            "type": "unit",
            "page": 67,
            "lessons": [
              "Part A What do we wear in different seasons?",
              "Part B What do we do in different seasons?",
              "Part C Project: Make a travel card",
              "Reading time"
            ]
          },
          {
            "name": "Let's help!",
            "type": "revision",
            "page": 79,
            "lessons": []
          }
        ]
      },
      {
        "slug": "5a",
        "grade": 5,
        "semester": "上",
        "edition": "2026秋",
        "title": "人教版五年级上册(2026秋版)英语(PEP)",
        "source": "http://www.dzkbw.com/books/rjb/yingyu/pep5s_2026/",
        "units": [
          {
            "no": 1,
            "name": "Different friends",
            "type": "unit",
            "page": 7,
            "lessons": []
          },
          {
            "no": 2,
            "name": "My feelings",
            "type": "unit",
            "page": 19,
            "lessons": []
          },
          {
            "no": 3,
            "name": "Work and play",
            "type": "unit",
            "page": 31,
            "lessons": []
          },
          {
            "no": 4,
            "name": "Healthy habits",
            "type": "unit",
            "page": 43,
            "lessons": []
          },
          {
            "no": 5,
            "name": "Food we eat",
            "type": "unit",
            "page": 55,
            "lessons": []
          },
          {
            "no": 6,
            "name": "Nature and us",
            "type": "unit",
            "page": 67,
            "lessons": []
          },
          {
            "name": "New Year's party",
            "type": "revision",
            "page": 79,
            "lessons": []
          }
        ]
      }
    ]
  }
]

)

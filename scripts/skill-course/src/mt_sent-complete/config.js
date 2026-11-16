var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "读进去", "看出来", "连一连", "中测1", "写下来", "改一处", "中测2", "评一评", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "完整句要有陈述对象和关于它的陈述：谁、做什么（或怎么样）。" },
      { answer: 0, explain: "小鸟（谁）＋飞（做什么），两块齐全，是完整句；长短不是标准。" },
      { answer: 2, explain: "「美丽的花」只说了什么，没说怎么样，是短语，不是完整句。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "「升起来了」说了太阳做什么（怎么样），补上就是完整句。" },
      { answer: 1, explain: "「跑步」说了做什么，但没说谁在跑，补上「同学们」就完整。" },
      { answer: 0, explain: "两块都能回答，就是完整句；靠字数、形容词判断都不准。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "春天（什么）＋来了（怎么样），两块齐全，是完整句。" },
      { answer: 2, explain: "要补上「做什么」（听讲），句子才完整；只加修饰语仍不完整。" },
      { answer: 1, explain: "句子有陈述对象和陈述内容，能独立表达完整意思；短语不成句。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "「他」是陈述对象，回答「谁」；「写字」回答「做什么」。" },
      { answer: 0, explain: "小鱼（谁）＋游来游去（做什么），是完整句；「蓝蓝的天空」只是短语。" },
      { answer: 2, explain: "写完回到「谁＋做什么」两块查一遍，缺哪块补哪块。" },
      { answer: 0, explain: "这句说清了地点和状况，也是完整句的一种（什么怎么样）。" },
      { answer: 1, explain: "完整句就是「谁＋做什么（怎么样）」两块齐全，写完养成检查的习惯。" }
    ]
  }
};

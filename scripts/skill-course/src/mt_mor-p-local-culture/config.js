var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "家乡美食是本地文化。" },
      { answer: 1, explain: "方言承载地方文化，值得尊重。" },
      { answer: 2, explain: "民居反映当地文化与智慧。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "尊重和传承家乡文化。" },
      { answer: 1, explain: "在传承基础上创新。" },
      { answer: 2, explain: "多种方式记录和宣传。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "手工艺是珍贵的文化遗产。" },
      { answer: 1, explain: "梦境不是文化内容。" },
      { answer: 2, explain: "尊重从了解开始。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "创新让文化延续发展。" },
      { answer: 1, explain: "实地走访和查资料可靠。" },
      { answer: 2, explain: "文化带来认同感与自豪。" },
      { answer: 0, explain: "记录宣传让文化传承。" },
      { answer: 1, explain: "动手记录，加深了解。" }
    ]
  }
};

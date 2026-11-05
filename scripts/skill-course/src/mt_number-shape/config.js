var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "逐层摆方块", "列表找规律", "连一连", "中测1", "更多数形", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 2, explain: "1 + 3 = 4 = 2²，摆成 2×2 的正方形，边长 2。" },
      { answer: 1, explain: "1 + 3 + 5 = 9 = 3²。" },
      { answer: 1, explain: "连续奇数，7 后面是 9；第 n 层添 2n − 1 块。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "共 5 项，和 = 5² = 25；16 是只加到 7 的结果。" },
      { answer: 1, explain: "第 n 个奇数是 2n − 1，2×8 − 1 = 15。" },
      { answer: 1, explain: "19 = 2×10 − 1，共 10 项，和 = 100。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 2, explain: "15 = 2×8 − 1，共 8 项，和 = 8² = 64。" },
      { answer: 0, explain: "(29 + 1) ÷ 2 = 15 项，和 = 225。" },
      { answer: 1, explain: "有限多项还差 1/16，无限加下去才无限逼近 1。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 2, explain: "11 = 2×6 − 1，共 6 项，和 = 36。" },
      { answer: 0, explain: "10² = 100；55 是 1 加到 10 的和，不是奇数和。" },
      { answer: 0, explain: "2×12 − 1 = 23。" },
      { answer: 1, explain: "(39 + 1) ÷ 2 = 20 项，和 = 400。" },
      { answer: 2, explain: "n² 才是正确结论；分数连加只是逼近 1。" }
    ]
  }
};

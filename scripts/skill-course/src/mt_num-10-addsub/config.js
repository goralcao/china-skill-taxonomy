var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 2, explain: "3 添上 2 是 5。" },
      { answer: 0, explain: "5 拿走 2 剩 3。" },
      { answer: 1, explain: "加 0 还是原数，一个也不添。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "2 和 5 合起来是 7。" },
      { answer: 0, explain: "6 往后数 3 个：7、8、9。" },
      { answer: 1, explain: "1 添 1 是 2。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 2, explain: "7 拿走 3 剩 4。" },
      { answer: 0, explain: "9 分成 4 和 5，拿走 4 剩 5。" },
      { answer: 1, explain: "拿走全部，一个不剩，是 0。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 2, explain: "4 和 4 合起来是 8。" },
      { answer: 0, explain: "8 拿走 5 剩 3。" },
      { answer: 1, explain: "减 0 一个也不拿走，还是 10。" },
      { answer: 2, explain: "想 3 和几合成 6：3 + 3 = 6。" },
      { answer: 0, explain: "吃了是变少，用减法：5 − 2 = 3。" }
    ]
  }
};

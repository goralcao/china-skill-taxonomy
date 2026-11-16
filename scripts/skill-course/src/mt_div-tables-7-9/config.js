var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 2, explain: "想「七几五十六」？七八五十六，商是 8。" },
      { answer: 0, explain: "八九七十二，商是 8。" },
      { answer: 1, explain: "七九六十三，商是 7。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "六七四十二，商是 6。" },
      { answer: 0, explain: "七七四十九，商是 7。" },
      { answer: 1, explain: "五七三十五，商是 5。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 2, explain: "八八六十四，商是 8。" },
      { answer: 0, explain: "九九八十一，商是 9。" },
      { answer: 1, explain: "六八四十八，商是 6。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 2, explain: "七八五十六，商是 7。" },
      { answer: 0, explain: "八九七十二，商是 9。" },
      { answer: 1, explain: "六九五十四，商是 6。" },
      { answer: 2, explain: "63÷9，想七九六十三，能装 7 盒。" },
      { answer: 0, explain: "五九四十五，商是 5。" }
    ]
  }
};

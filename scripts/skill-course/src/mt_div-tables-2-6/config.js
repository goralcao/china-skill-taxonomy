var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "想「三几十二」？三四十二，所以商是 4。" },
      { answer: 1, explain: "二五一十，所以 10÷2=5。" },
      { answer: 2, explain: "三六十八，所以 18÷6=3。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "四五二十，商是 5。" },
      { answer: 1, explain: "三五十五，商是 3。" },
      { answer: 2, explain: "四六二十四，商是 4。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "三四十二能算 3×4、4×3，也能算 12÷3=4、12÷4=3。" },
      { answer: 1, explain: "四四十六，商是 4。" },
      { answer: 2, explain: "五六三十，商是 5。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "三四十二，商是 3。" },
      { answer: 1, explain: "五五二十五，商是 5。" },
      { answer: 2, explain: "六六三十六，商是 6。" },
      { answer: 0, explain: "18÷3，想三六十八，每人 6 个。" },
      { answer: 1, explain: "三七二十一，商是 7。" }
    ]
  }
};

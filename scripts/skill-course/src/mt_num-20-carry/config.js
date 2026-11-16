var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "把 6 拆成 1 和 5：9+1=10，10+5=15。" },
      { answer: 1, explain: "8 差 2 凑十：5 拆成 2 和 3，8+2=10，10+3=13。" },
      { answer: 2, explain: "9 拆成 1 和 8：9+1=10，10+8=18。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "7 差 3凑十：6 拆 3 和 3，7+3=10，10+3=13。" },
      { answer: 1, explain: "6 差 4：5 拆 4 和 1，6+4=10，10+1=11。" },
      { answer: 2, explain: "8 差 2：8 拆 2 和 6，8+2=10，10+6=16。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "9+1=10，10+2=12。" },
      { answer: 1, explain: "5 差 5：7 拆 5 和 2，5+5=10，10+2=12。" },
      { answer: 2, explain: "9 差 1：4 拆 1 和 3，9+1=10，10+3=13。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "9+1=10，10+6=16。" },
      { answer: 1, explain: "8 差 2：6 拆 2 和 4，8+2=10，10+4=14。" },
      { answer: 2, explain: "9 差 1：7 拆 1 和 6，9+1=10，10+6=16。" },
      { answer: 0, explain: "8+7：8 差 2，7 拆 2 和 5，8+2=10，10+5=15。" },
      { answer: 1, explain: "6 差 4：6 拆 4 和 2，6+4=10，10+2=12。" }
    ]
  }
};

var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "8 里面有几个 2：8÷2=4，能分 4 份。" },
      { answer: 2, explain: "除法表示平均分：12÷3 是把 12 每 3 个分一份。" },
      { answer: 0, explain: "10÷5=2，每人 2 个。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 1, explain: "平均分要求每份一样多。" },
      { answer: 2, explain: "9 每 3 个一份，能分 3 份。" },
      { answer: 0, explain: "6÷2=3。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: "÷ 是除号，表示平均分。" },
      { answer: 2, explain: "15 每 5 个一份，能分 3 份。" },
      { answer: 0, explain: "20÷4=5。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "16 每 4 个一份，能分 4 份。" },
      { answer: 2, explain: "18÷3=6，能装 6 袋。" },
      { answer: 0, explain: "24 每 6 个一份，能分 4 份。" },
      { answer: 1, explain: "4 份每份 5 个：4×5=20，也等于 20÷4=5。" },
      { answer: 2, explain: "12÷2=6（每2个一份分6份），12÷6=2（每6个一份分2份）。" }
    ]
  }
};

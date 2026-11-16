var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "从左到右：2+3=5，5+1=6。" },
      { answer: 2, explain: "从左到右：6−2=4，4−1=3。" },
      { answer: 0, explain: "先 4+2=6，再 6−3=3。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 1, explain: "1+2=3，3+3=6。" },
      { answer: 2, explain: "8−3=5，5−2=3。" },
      { answer: 0, explain: "5+4=9，9−2=7。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: "7−2=5，5+3=8。" },
      { answer: 2, explain: "3+5=8，8−4=4。" },
      { answer: 0, explain: "9−4=5，5−4=1。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "2+2=4，4+2=6。" },
      { answer: 2, explain: "10−3=7，7−3=4。" },
      { answer: 0, explain: "6+2=8，8−5=3。" },
      { answer: 1, explain: "5+2=7，7−3=4。上来用加，下去用减。" },
      { answer: 2, explain: "8−0=8，8−4=4。减 0 不变。" }
    ]
  }
};

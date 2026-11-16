var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 2, explain: "把 13 拆成 10 和 3：10−8=2，2+3=5。" },
      { answer: 0, explain: "10−9=1，1+5=6。" },
      { answer: 1, explain: "10−7=3，3+2=5。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "10−6=4，4+4=8。" },
      { answer: 0, explain: "10−5=5，5+1=6。" },
      { answer: 1, explain: "10−8=2，2+6=8。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 2, explain: "10−9=1，1+7=8。" },
      { answer: 0, explain: "10−5=5，5+3=8。" },
      { answer: 1, explain: "10−9=1，1+2=3。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 2, explain: "10−7=3，3+5=8。" },
      { answer: 0, explain: "10−9=1，1+8=9。" },
      { answer: 1, explain: "10−3=7，7+1=8。" },
      { answer: 2, explain: "14−6：10−6=4，4+4=8。" },
      { answer: 0, explain: "13−4=9，9−3=6。" }
    ]
  }
};

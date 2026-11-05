var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "四个场景", "找单位1", "连一连", "中测1", "算一算", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "九折 = 90%，按原价的 90% 收。" },
      { answer: 1, explain: "几成就是十分之几，二成 = 20%。" },
      { answer: 2, explain: "100 ÷ 2000 = 5%。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "八成 = 8/10 = 80%。" },
      { answer: 0, explain: "200 × 90% = 180 元。" },
      { answer: 1, explain: "5000 × 5% = 250 元。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: "400 × (1 + 20%) = 480 吨。" },
      { answer: 2, explain: "2000 × 3% × 2 = 120 元。" },
      { answer: 0, explain: "6000 − 6000 × 5% = 5700 元。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "七五折 = 75%。" },
      { answer: 1, explain: "400 × 85% = 340 元。" },
      { answer: 2, explain: "5000 × 2% × 3 = 300 元。" },
      { answer: 0, explain: "三成五 = 35%。" },
      { answer: 1, explain: "60 ÷ (1 + 20%) = 50。" }
    ]
  }
};

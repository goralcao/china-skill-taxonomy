var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "百分数的意义", "三种写法互化", "连一连", "中测1", "两类问题", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "37% 就是 37/100，占 100 份里的 37 份。" },
      { answer: 1, explain: "0.8 = 80/100 = 80%；8% 对应 0.08。" },
      { answer: 2, explain: "百分数只表示比率，不能带「米、千克」这样的单位。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "0.06 = 6/100 = 6%；60% 对应 0.6。" },
      { answer: 1, explain: "3/4 = 0.75 = 75%。" },
      { answer: 0, explain: "120% = 120/100 = 6/5。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 2, explain: "45 ÷ 50 = 0.9 = 90%。" },
      { answer: 0, explain: "200 × 80% = 160 元；20 元是折扣掉的钱。" },
      { answer: 2, explain: "产量可以超过去年，写成 120%；比率类最多 100%。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "37% = 37/100，已是最简。" },
      { answer: 1, explain: "5% = 5/100 = 0.05；0.5 对应 50%。" },
      { answer: 2, explain: "76 ÷ 80 = 0.95 = 95%。" },
      { answer: 1, explain: "400 × 70% = 280 元；120 元是省下的。" },
      { answer: 2, explain: "120% = 120/100 = 6/5；百分数不带单位，0.03 = 3%。" }
    ]
  }
};

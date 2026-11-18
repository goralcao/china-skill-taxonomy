var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "误会多因沟通不畅。" },
      { answer: 1, explain: "平和表达更有效。" },
      { answer: 2, explain: "理解立场、好好沟通。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "积极适应、承担责任。" },
      { answer: 1, explain: "换位思考减少冲突。" },
      { answer: 2, explain: "倾听加表达才有效。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "冷静后沟通更理性。" },
      { answer: 1, explain: "责任共担家庭更和谐。" },
      { answer: 2, explain: "行动表达关爱。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "摔门不是有效沟通。" },
      { answer: 1, explain: "沟通为增进理解。" },
      { answer: 2, explain: "倾听是尊重。" },
      { answer: 0, explain: "清楚表达才能被理解。" },
      { answer: 1, explain: "沟通与责任共建和谐。" }
    ]
  }
};

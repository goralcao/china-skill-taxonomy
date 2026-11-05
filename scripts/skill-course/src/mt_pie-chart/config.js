var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "读懂饼图", "占比换角度", "连一连", "中测1", "由占比求数量", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "整个圆代表总数，也就是 100%。" },
      { answer: 2, explain: "25% × 360° = 90°。" },
      { answer: 1, explain: "扇形图擅长表达部分与整体的关系；增减变化看折线图。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 1, explain: "20% × 360° = 72°。" },
      { answer: 0, explain: "108 ÷ 360 = 0.3 = 30%。" },
      { answer: 2, explain: "所有扇形拼成整个圆，合计 360°。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "40 × 50% = 20 人；50 是占比不是人数。" },
      { answer: 2, explain: "占比相同但总数不同，人数分别是 10 和 15。" },
      { answer: 0, explain: "30% × 360° = 108°。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 2, explain: "40% × 360° = 144°。" },
      { answer: 0, explain: "72 ÷ 360 = 0.2 = 20%。" },
      { answer: 1, explain: "50 × 20% = 10 人。" },
      { answer: 1, explain: "占比合计 100%，对应角度合计 360°。" },
      { answer: 2, explain: "扇形图表达的是部分与整体的比例关系。" }
    ]
  }
};

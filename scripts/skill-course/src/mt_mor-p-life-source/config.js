var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "粮食来自农民的农业生产。" },
      { answer: 1, explain: "工业制造各种生活用品。" },
      { answer: 2, explain: "公交提供运输服务。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "物品背后有许多人的付出。" },
      { answer: 1, explain: "农业提供食物，是根本。" },
      { answer: 2, explain: "珍惜就是尊重劳动。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "艰苦奋斗可贵。" },
      { answer: 1, explain: "创新推动社会进步。" },
      { answer: 2, explain: "大米是农产品。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "生活靠大家共同劳动。" },
      { answer: 1, explain: "劳动无贵贱，都要尊重。" },
      { answer: 2, explain: "浪费无视劳动付出。" },
      { answer: 0, explain: "科技进步是创新成果。" },
      { answer: 1, explain: "美好生活靠劳动与创造。" }
    ]
  }
};

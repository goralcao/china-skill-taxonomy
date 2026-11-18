var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "未满18周岁的是未成年人。" },
      { answer: 1, explain: "未成年人保护法专门保护未成年人。" },
      { answer: 2, explain: "家庭、学校、社会、网络、政府、司法六大保护。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "未成年人需要特别关怀。" },
      { answer: 1, explain: "及时向大人或有关部门求助。" },
      { answer: 2, explain: "紧急情况拨打报警电话。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "远离并求助。" },
      { answer: 1, explain: "六大保护指家庭学校社会网络政府司法。" },
      { answer: 2, explain: "学校负有保护职责。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "司法机关对未成年人特殊保护。" },
      { answer: 1, explain: "警惕与求助结合。" },
      { answer: 2, explain: "珍惜保护、学会自护。" },
      { answer: 0, explain: "保留证据、依法求助。" },
      { answer: 1, explain: "保障未成年人健康成长。" }
    ]
  }
};

var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "班级是同学们共同学习生活的集体。" },
      { answer: 1, explain: "班级是大家的，人人有责。" },
      { answer: 2, explain: "认真值日，对集体环境负责。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "参与集体事务是服务集体。" },
      { answer: 1, explain: "争光不抹黑，是爱集体。" },
      { answer: 2, explain: "互帮互助让集体更温暖。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "规则让集体生活有序。" },
      { answer: 1, explain: "为集体做事就是爱集体。" },
      { answer: 2, explain: "友好沟通才能解决问题。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "积极参与集体活动。" },
      { answer: 1, explain: "集体荣誉属于每个人。" },
      { answer: 2, explain: "值日是责任，要认真完成。" },
      { answer: 0, explain: "团结友爱的集体更温暖。" },
      { answer: 1, explain: "集体生活培养合作和责任。" }
    ]
  }
};

var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "红领巾是红旗的一角，象征光荣。" },
      { answer: 1, explain: "要爱护、尊重红领巾。" },
      { answer: 2, explain: "少先队是少年儿童的组织。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "爱学习、爱劳动、爱祖国是好儿童标准。" },
      { answer: 1, explain: "认真学习是爱学习的表现。" },
      { answer: 2, explain: "热爱劳动、勤于动手。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "红领巾承载历史，爱护是尊敬。" },
      { answer: 1, explain: "认真学习、守纪律、爱集体都是爱祖国。" },
      { answer: 2, explain: "学习榜样的精神和品质。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "好品德要从小培养。" },
      { answer: 1, explain: "助人为乐是好儿童的表现。" },
      { answer: 2, explain: "劳动创造财富和价值，值得尊重。" },
      { answer: 0, explain: "少先队员应感到光荣。" },
      { answer: 1, explain: "全面发展才能成为好儿童。" }
    ]
  }
};

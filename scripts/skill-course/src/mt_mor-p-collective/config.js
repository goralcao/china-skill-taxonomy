var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "个人离不开集体，集体需要每个人。" },
      { answer: 1, explain: "分工合作效率高。" },
      { answer: 2, explain: "倾听与商量才能达成一致。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "沟通才能化解矛盾。" },
      { answer: 1, explain: "共同约定需要共同遵守。" },
      { answer: 2, explain: "每个人都是集体的一员。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "集体成绩靠大家努力。" },
      { answer: 1, explain: "妥协是为合作做合理让步。" },
      { answer: 2, explain: "虚心接受帮助进步。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "尊重是合作的基础。" },
      { answer: 1, explain: "每个人都参与，集体才更好。" },
      { answer: 2, explain: "换位思考有助理解彼此。" },
      { answer: 0, explain: "拉帮结派破坏团结。" },
      { answer: 1, explain: "集体生活培养良好品质。" }
    ]
  }
};

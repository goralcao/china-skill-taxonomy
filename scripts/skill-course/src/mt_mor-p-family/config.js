var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "家庭由父母、长辈等亲人组成。" },
      { answer: 1, explain: "长辈为家庭付出很多，要体谅。" },
      { answer: 2, explain: "自己的事情自己做。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "做力所能及的家务。" },
      { answer: 1, explain: "用语言和行动表达爱。" },
      { answer: 2, explain: "小行动能温暖家人。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "完成作业是自己的责任。" },
      { answer: 1, explain: "懂事体贴是好孩子的行为。" },
      { answer: 2, explain: "沟通能解决问题。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "家人互相关爱，家庭才幸福。" },
      { answer: 1, explain: "尊敬长辈是美德。" },
      { answer: 2, explain: "做家务培养责任感。" },
      { answer: 0, explain: "同学不是家庭成员，家人是父母长辈等亲人。" },
      { answer: 1, explain: "家庭幸福靠大家共同经营。" }
    ]
  }
};

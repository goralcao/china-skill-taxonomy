var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "家务是全家人的事。" },
      { answer: 1, explain: "做力所能及的家务。" },
      { answer: 2, explain: "商量能增进理解。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "感恩父母、体谅辛劳。" },
      { answer: 1, explain: "自理是家庭责任的一部分。" },
      { answer: 2, explain: "主动分担是负责任。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "帮忙减轻家人负担。" },
      { answer: 1, explain: "理性沟通，不任性。" },
      { answer: 2, explain: "责任共担，家庭更和谐。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "劳动培养责任感。" },
      { answer: 1, explain: "商量解决分歧。" },
      { answer: 2, explain: "破坏东西是不负责任。" },
      { answer: 0, explain: "用行动和语言表达感恩。" },
      { answer: 1, explain: "家庭成员既有权利也有责任。" }
    ]
  }
};

var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "主动问好利于交往。" },
      { answer: 1, explain: "倾听是尊重。" },
      { answer: 2, explain: "将心比心能理解他人。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "守信用才有真朋友。" },
      { answer: 1, explain: "勇敢说不，必要时求助。" },
      { answer: 2, explain: "孤立排挤伤害他人。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "真诚友善能交到朋友。" },
      { answer: 1, explain: "帮助能增进友谊。" },
      { answer: 2, explain: "沟通理解化解分歧。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "起外号不尊重，要避免。" },
      { answer: 1, explain: "守信赢得信任。" },
      { answer: 2, explain: "既不自欺也不欺人，及时求助。" },
      { answer: 0, explain: "尊重彼此不同。" },
      { answer: 1, explain: "尊重与诚信是基础。" }
    ]
  }
};

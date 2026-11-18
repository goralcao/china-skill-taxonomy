var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "扫地是基本劳动技能。" },
      { answer: 1, explain: "劳动实践让人成长。" },
      { answer: 2, explain: "劳动虽辛苦，收获时快乐。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "珍惜成果是尊重劳动。" },
      { answer: 1, explain: "技能是学出来的。" },
      { answer: 2, explain: "劳动创造财富和价值。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "睡懒觉不是劳动。" },
      { answer: 1, explain: "分担家务减轻家人负担。" },
      { answer: 2, explain: "劳动带来成就感。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "集体劳动要认真。" },
      { answer: 1, explain: "积极参与劳动值得表扬。" },
      { answer: 2, explain: "浪费是不珍惜劳动成果。" },
      { answer: 0, explain: "劳动技能助你独立。" },
      { answer: 1, explain: "爱劳动培养责任感。" }
    ]
  }
};

var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "要收集数据，得调查每一位同学。" },
      { answer: 1, explain: "每人一票，数据才准确。" },
      { answer: 2, explain: "画正字、填表能清楚记录数量。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "一个「正」字有 5 画，代表 5。" },
      { answer: 1, explain: "按顺序一个个数，才不遗漏。" },
      { answer: 2, explain: "先明确调查的问题和对象。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "条形越高，数量越多。" },
      { answer: 1, explain: "数量最大表示选的人最多。" },
      { answer: 2, explain: "统计是为了分析、回答问题。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "先明确调查什么。" },
      { answer: 1, explain: "3×5=15，加 2 是 17。" },
      { answer: 2, explain: "条形越高人越多。" },
      { answer: 0, explain: "每人一票避免重复。" },
      { answer: 1, explain: "统计是为了解情况、做决定。" }
    ]
  }
};

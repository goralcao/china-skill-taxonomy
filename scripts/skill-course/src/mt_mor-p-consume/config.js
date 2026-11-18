var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "消费者有合法权益。" },
      { answer: 1, explain: "食品安全要看日期。" },
      { answer: 2, explain: "货比三家更理性。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "发票是维权凭证。" },
      { answer: 1, explain: "权益受损要维权。" },
      { answer: 2, explain: "按需购买不盲目。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "理性消费值得提倡。" },
      { answer: 1, explain: "攀比不是理性消费。" },
      { answer: 2, explain: "通过正规渠道维权。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "保质期关系食品安全。" },
      { answer: 1, explain: "白拿不是权利。" },
      { answer: 2, explain: "按需购买，不被促销误导。" },
      { answer: 0, explain: "凭证是维权依据。" },
      { answer: 1, explain: "理性消费、依法维权。" }
    ]
  }
};

var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 2, explain: "七八五十六。" },
      { answer: 0, explain: "九九八十一。" },
      { answer: 1, explain: "六八四十八。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "七七四十九。" },
      { answer: 0, explain: "七九六十三。" },
      { answer: 1, explain: "四七二十八。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 2, explain: "八八六十四。" },
      { answer: 0, explain: "七九六十三。" },
      { answer: 1, explain: "八九七十二。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 2, explain: "六九五十四。" },
      { answer: 0, explain: "七八五十六。" },
      { answer: 1, explain: "一句口诀能算两题：忘了 8×7，就想七八五十六。" },
      { answer: 2, explain: "8 个 9：9×8=72，口诀八九七十二。" },
      { answer: 0, explain: "乘法交换，积都是 72。" }
    ]
  }
};

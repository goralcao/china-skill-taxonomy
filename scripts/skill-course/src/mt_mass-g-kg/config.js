var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 2, explain: "苹果约 200 克。" },
      { answer: 0, explain: "1 千克 = 1000 克。" },
      { answer: 1, explain: "一袋大米约 5 千克。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "铅笔很轻，用克。" },
      { answer: 0, explain: "人的体重用千克。" },
      { answer: 1, explain: "1千克=1000克，2千克=2000克。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 2, explain: "1千克=1000克，比500克重。" },
      { answer: 0, explain: "鸡蛋约 50 克。" },
      { answer: 1, explain: "3−1=2 千克。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 2, explain: "1 千克等于 1000 克。" },
      { answer: 0, explain: "牛很重，用千克。" },
      { answer: 1, explain: "5×1000=5000 克。" },
      { answer: 2, explain: "硬币很轻，用克。" },
      { answer: 0, explain: "都是 1 千克，一样重（别被体积骗）。" }
    ]
  }
};

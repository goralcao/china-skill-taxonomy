var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "this 指近处单数；that 指远处单数。" },
      { answer: 0, explain: "those 指远处复数；these 指近处复数。" },
      { answer: 2, explain: "复数主语配 are；these 指的不止一个。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "that（远、单）→ those（远、复）；this → these。" },
      { answer: 1, explain: "this 近、that 远，两者都是单数，差别在距离。" },
      { answer: 0, explain: "主语变复数 these，be 动词变 are，名词也加 -s。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "近处单数用 this；远处才用 that。" },
      { answer: 2, explain: "these 是复数，配 are；am 只跟 I 连用。" },
      { answer: 1, explain: "远处 + 复数 = those；birds 也提示不止一只。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "这一对都指一个，区别只在远近。" },
      { answer: 0, explain: "this / these 差别在单复数，先数一数。" },
      { answer: 2, explain: "this / that 差别在距离，先看远近。" },
      { answer: 0, explain: " four 个词正好是「远近 × 单复数」的两两组合。" },
      { answer: 1, explain: "指着东西说，远近和数量才对得上。" }
    ]
  }
};

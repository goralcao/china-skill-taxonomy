var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "把一端对齐，看另一端谁长。" },
      { answer: 2, explain: "天平能比出谁轻谁重。" },
      { answer: 0, explain: "用统一单位（厘米）量，结果才准。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 1, explain: "12＞8，长的那根是 12 厘米。" },
      { answer: 2, explain: "一端对齐才能比出长短。" },
      { answer: 0, explain: "手拃长短不一，用统一单位厘米才准。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: "天平低的一边更重。" },
      { answer: 2, explain: "1千克=1000克，比800克重。" },
      { answer: 0, explain: "称轻重用天平或秤。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "一端对齐才能比。" },
      { answer: 2, explain: "平衡＝一样重。" },
      { answer: 0, explain: "统一单位才能准确比较。" },
      { answer: 1, explain: "2米=200厘米，比150厘米长。" },
      { answer: 2, explain: "先估再量能检验估计，培养数感。" }
    ]
  }
};

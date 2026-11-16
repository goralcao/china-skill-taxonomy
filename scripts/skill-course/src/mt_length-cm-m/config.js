var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "铅笔较短，用厘米量。" },
      { answer: 1, explain: "1 米 = 100 厘米。" },
      { answer: 2, explain: "教室很长，用米量方便。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "书本是较短物体，用厘米。" },
      { answer: 1, explain: "跑道很长，用米。" },
      { answer: 2, explain: "1米=100厘米，100−30=70厘米。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "量长度要从 0 刻度开始对齐。" },
      { answer: 1, explain: "1米=100厘米，2米=200厘米。" },
      { answer: 2, explain: "身高用厘米（如 120 厘米）或米（1.2 米）。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "1 米等于 100 厘米。" },
      { answer: 1, explain: "橡皮短，用厘米。" },
      { answer: 2, explain: "3×100=300 厘米。" },
      { answer: 0, explain: "桌子高约 70 厘米，符合实际。" },
      { answer: 1, explain: "1米=100厘米，加 20 是 120 厘米。" }
    ]
  }
};

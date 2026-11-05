var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "什么是比例", "基本性质", "连一连", "中测1", "比例尺", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "比例要有等号，且两边比值相等。" },
      { answer: 1, explain: "中间两项是内项，两端两项是外项。" },
      { answer: 2, explain: "交叉相乘：2 × 6 = 3 × 4。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "6x = 24，x = 4。" },
      { answer: 0, explain: "4:10 = 2:5，比值都是 0.4。" },
      { answer: 1, explain: "外项积 ad 等于内项积 bc。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: "4 千米 = 400000 厘米，2:400000 = 1:200000。" },
      { answer: 2, explain: "5x = 30，x = 6。" },
      { answer: 0, explain: "比的基本性质：前后项同乘一个数，比值不变。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "两边比值都是 0.75，且有等号。" },
      { answer: 1, explain: "x = 3 × 5 = 15。" },
      { answer: 2, explain: "3 × 8 = 24，4 × 6 = 24，外项积等于内项积。" },
      { answer: 0, explain: "3 × 100000 厘米 = 3 千米。" },
      { answer: 1, explain: "7x = 84，x = 12。" }
    ]
  }
};

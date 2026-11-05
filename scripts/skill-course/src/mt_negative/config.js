var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "相反意义的量", "数轴比大小", "连一连", "中测1", "用正负数算", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "比 0 低 8 度，记作 −8℃。" },
      { answer: 2, explain: "数轴上 −5 最靠左，最小。" },
      { answer: 1, explain: "0 是分界，既不是正数也不是负数。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "支出方向与收入相反，记作 −350 元。" },
      { answer: 0, explain: "−3 在 −7 右边，所以 −3 更大。" },
      { answer: 2, explain: "0 是正负数的分界。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: "−4 更小，在 −1 左边。" },
      { answer: 2, explain: "−6 < −1 < 0 < 2，最小的是 −6。" },
      { answer: 0, explain: "−3 + 5 = 2。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 2, explain: "低于基准 0，记作 −20 米。" },
      { answer: 2, explain: "正数 > 0 > 负数，0 比任何负数都大。" },
      { answer: 1, explain: "−7 更靠左，所以 −7 < −4。" },
      { answer: 1, explain: "2 − 6 = −4。" },
      { answer: 0, explain: "从 −1 到 0 是 1 层，再到 5 是 5 层，共 6 层（没有 0 层）。" }
    ]
  }
};

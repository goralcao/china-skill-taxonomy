var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "分数×整数", "面积模型", "连一连", "中测1", "求几分之几", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 2, explain: "第一次喝 1/2，第二次喝的是 1/2 的 1/2 即 1/4，一共 1/2 + 1/4 = 3/4。" },
      { answer: 0, explain: "2/7 × 3 = (2×3)/7 = 6/7，分母不变。" },
      { answer: 0, explain: "打 8 折就是按原价的 8/10 卖：100 × 8/10 = 80 元。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 1, explain: "分母不变：2/9 × 3 = 6/9 = 2/3；把 9 也乘 3 得到 2/27 是典型错误。" },
      { answer: 2, explain: "5 × 2/11 = 10/11，分母 11 不变。" },
      { answer: 2, explain: "8 与分母 4 约成 2，得 3 × 2 = 6；24/32 没约分，它的值也是 3/4，是没乘 8 的错法。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "分子 2×3=6，分母 3×5=15，约分得 2/5；分子分母分别相加得 5/8 是错的。" },
      { answer: 1, explain: "3 与 9 约、4 与 8 约，得 1/2 × 1/3 = 1/6；不约分是 12/72，也等于 1/6。" },
      { answer: 2, explain: "真分数小于 1，乘它相当于取它的一部分，积比原数小。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "人数翻倍：3/4 × 2 = 3/2 杯。" },
      { answer: 0, explain: "4/5 × 1/2 = 4/10 = 2/5 米；4/10 没约成最简。" },
      { answer: 0, explain: "3/7 × 14 = 42/7 = 6；分母不变，14 与 7 可先约。" },
      { answer: 2, explain: "乘大于 1 的分数积最大：5/6 × 3/2 = 5/4。" },
      { answer: 1, explain: "18/30 约分得 3/5；11/13 是把分子分母分别相加的错法。" }
    ]
  }
};

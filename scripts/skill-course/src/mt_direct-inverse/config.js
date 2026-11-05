var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "正比例", "反比例", "连一连", "中测1", "怎么判断", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "总价 = 单价 × 数量，一起变大。" },
      { answer: 2, explain: "y ÷ x = k 一定。" },
      { answer: 0, explain: "速度 × 时间 = 路程，速度大时间短。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "总价 ÷ 数量 = 单价，商一定。" },
      { answer: 2, explain: "商一定就是正比例。" },
      { answer: 1, explain: "x × y = k 一定。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 2, explain: "120 ÷ 60 = 2 小时。" },
      { answer: 0, explain: "y = kx 是一条过原点的直线。" },
      { answer: 1, explain: "乘积不变，一个变大另一个必须变小。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "速度 × 时间 = 路程，积一定。" },
      { answer: 0, explain: "y ÷ x = 3，商一定。" },
      { answer: 2, explain: "30 ÷ 5 = 6。" },
      { answer: 1, explain: "商一定，写成 y = kx。" },
      { answer: 0, explain: "列表把商和积都算一遍。" }
    ]
  }
};

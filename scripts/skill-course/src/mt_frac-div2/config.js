var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "包含除", "乘倒数", "连一连", "中测1", "为什么能变乘", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "60 ÷ 15 = 4，求的是 60 里包含几个 15。" },
      { answer: 2, explain: "3/4 = 3 个 1/4，所以是 3 个。" },
      { answer: 1, explain: "除以 1/2 = 乘它的倒数 2，也就是乘 2。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "3/4 = 6/8，含 6 个 1/8，商是 6；也可用 3/4 × 8 = 6。" },
      { answer: 1, explain: "除以 2 等于乘 1/2：5/6 × 1/2 = 5/12。" },
      { answer: 0, explain: "4/5 × 5/4 = 1，所以倒数是 5/4。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: "2/3 × 5/4 = 10/12 = 5/6；8/15 是直接把两分数相乘的错法。" },
      { answer: 2, explain: "一个非零数除以它自己等于 1；7/8 × 8/7 = 1。" },
      { answer: 2, explain: "除数 3/2 大于 1，商 1/2 比被除数 3/4 小。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "4/5 ÷ 1/10 = 4/5 × 10 = 8 段。" },
      { answer: 0, explain: "5/8 × 6/5 = 30/40 = 3/4；25/48 是没取倒数直接相乘。" },
      { answer: 2, explain: "除数 1/2 小于 1，商 3/2 大于 3/4。" },
      { answer: 0, explain: "2/3 × 9/8 = 18/24 = 3/4。" },
      { answer: 1, explain: "除以 c/d 等于乘它的倒数 d/c。" }
    ]
  }
};

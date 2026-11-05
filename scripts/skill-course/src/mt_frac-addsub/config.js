var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "同分母", "异分母", "连一连", "中测1", "两步走", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "分母相同，分子直接相加：3＋2＝5，分母还是 8。选 B 把分母也加了。" },
      { answer: 2, explain: "分母不同，每份大小不一样，不能直接加。先把 1/4 化成 2/8。选 A、B 都把分子硬加了。" },
      { answer: 2, explain: "分子分母同时乘 2：1/4＝2/8，大小不变。选 B 是 1/2，不是 1/4。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "分母相同，分子 5＋2＝7，分母照抄 9。选 B 把分母也加了。" },
      { answer: 1, explain: "2 和 3 的公倍数是 6：1/2＝3/6，1/3＝2/6。" },
      { answer: 0, explain: "分母不变，分子 3−1＝2，得 2/4，约分后是 1/2。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 2, explain: "1/2＝2/4，2/4＋1/4＝3/4。选 B 忘了把 1/2 通分。" },
      { answer: 1, explain: "1/3＝2/6，5/6−2/6＝3/6＝1/2。选 C 没约到最简。" },
      { answer: 0, explain: "3/4＋1/2＝3/4＋2/4＝5/4，大于 1。另两个分别是 2/3 和 3/5。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "分母相同，分子 4＋2＝6，分母照抄 7。" },
      { answer: 2, explain: "1/3＝2/6，2/6＋1/6＝3/6＝1/2。选 B 没约到最简。" },
      { answer: 0, explain: "1/4＝2/8，7/8−2/8＝5/8。选 B 是分子分母各自相减。" },
      { answer: 0, explain: "把 1 看成 5/5，5/5−3/5＝2/5。" },
      { answer: 1, explain: "1/2＋1/4＝2/4＋1/4＝3/4 米。这里带单位，是具体长度相加。" }
    ]
  }
};

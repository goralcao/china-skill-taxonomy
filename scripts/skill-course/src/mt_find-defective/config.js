var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "三种结果", "为何三份", "连一连", "中测1", "次数规律", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "两边一样重，说明上秤的 6 瓶都是正品，次品在剩下的那组。" },
      { answer: 2, explain: "9 ÷ 3 = 3，三份一样多，最坏情况留下的瓶数才最少。" },
      { answer: 1, explain: "左轻、平衡、右轻三种结果对应三份，一次锁定其中一份，即 1/3。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "翘起的一边更轻，次品在左盘那组。" },
      { answer: 2, explain: "尽量平均，三份相差不超过 1：3、3、2 最坏只留 3 瓶。" },
      { answer: 1, explain: "三种结果对应三份，锁定一份，约 1/3。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 2, explain: "27 → 9 → 3 → 1，共 3 次。" },
      { answer: 1, explain: "10 超过 9（3²），要按 27（3³）那一档算，得 3 次。" },
      { answer: 0, explain: "次品位置事先不知道，方案必须对所有位置都成立，所以要按最坏那支设计。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 2, explain: "上秤的 6 瓶都是正品，次品在剩下的那组。" },
      { answer: 0, explain: "12 ÷ 3 = 4，三份各 4 瓶，相差不超过 1。" },
      { answer: 2, explain: "3⁴ = 81，81 → 27 → 9 → 3 → 1，共 4 次。" },
      { answer: 1, explain: "左轻、平衡、右轻三种结果对应三份，锁定一份。" },
      { answer: 0, explain: "3、3、3 最坏也只剩 3 瓶；另外两种最坏分别留 7 瓶和 5 瓶。" }
    ]
  }
};

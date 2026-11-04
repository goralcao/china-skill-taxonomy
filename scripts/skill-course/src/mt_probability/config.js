var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "转盘", "三种说法", "连一连", "中测1", "公平吗", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "骰子只有 1 到 6，没有 7 点，所以不可能。选 A 是被「掷骰子」这个动作带偏了。" },
      { answer: 0, explain: "红球多，占的份数大。选 C 以为「运气」两半；选 B 只看个数少反而觉得特别。" },
      { answer: 1, explain: "一半对一半只是「平均」，10 次太少，多一次少一次都正常。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "一共 8 格，红占 1 格 → 1/8。选 B 把「另外 7 格」当成了分母；选 C 把可能当成了一定。" },
      { answer: 1, explain: "2/8 = 1/4。选 A 只数了一格；选 C 把 2/4 算成了 1/2。" },
      { answer: 0, explain: "全红才每次都中。选 B 只差一格，仍是可能而不一定；选 C 一格不红，是不可能。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "蓝占 5 格 → 5/8。选 B 数的是红；选 C 是把 3:5 当成了平均。" },
      { answer: 1, explain: "80 × 1/8 = 10。选 A 只按一次算；选 C 把「可能」当成「一定」。" },
      { answer: 0, explain: "各 4 格才是各 1/2。选 B、C 都会让一方机会更大。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "一正一反各占一半 → 1/2。选 B 把可能当成一定；选 C 当成了不可能。" },
      { answer: 1, explain: "红 4 个，一共 10 个 → 4/10。选 A 把白球数当成了总数；选 C 数的是白球。" },
      { answer: 0, explain: "蓝占 3 格 → 3/8。选 B 数的是红；选 C 把「蓝比红」当成了可能性。" },
      { answer: 1, explain: "400 × 1/8 = 50。选 A 按 40 次算的；选 C 把每次都当成中奖。" },
      { answer: 1, explain: "8 个名额占 40 人的 8/40。选 A 把名额数当成了总人数；选 C 把分子分母写反了。" }
    ]
  }
};

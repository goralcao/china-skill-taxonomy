var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "13 的十位是 1（1 个十），个位是 3（3 个一）。" },
      { answer: 1, explain: "10 就是 1 个十，个位写 0。" },
      { answer: 2, explain: "1 个十＝10，加 5 个一是 15。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "十位是左边那位，18 的十位是 1。" },
      { answer: 1, explain: "个位是右边那位，18 的个位是 8。" },
      { answer: 2, explain: "2 个十是 20，个位是 0。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "14 是 1 个十加 4 个一，所以填 4。" },
      { answer: 1, explain: "19 再添 1 满十，是 20（2 个十）。" },
      { answer: 2, explain: "十位是 1 读十几，7 个一读七，是十七。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "右边是个位，12 的 2 在个位，表示 2 个一。" },
      { answer: 1, explain: "10+9=19。" },
      { answer: 2, explain: "20 是 2 个十。" },
      { answer: 0, explain: "个位是右边那位，是 6。" },
      { answer: 1, explain: "1 个十加 4 个一是 14。" }
    ]
  }
};

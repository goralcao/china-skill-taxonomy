var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "4 个十是 40，加 2 个一是 42。" },
      { answer: 2, explain: "10 个十是 100。" },
      { answer: 0, explain: "59 再添 1 满十，是 60。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 1, explain: "十位是左边那位，37 的十位是 3，表示 3 个十。" },
      { answer: 2, explain: "7 个十是 70，个位写 0。" },
      { answer: 0, explain: "8 个十加 5 个一是 85。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: "十位 6＞4，所以 64 大。" },
      { answer: 2, explain: "十位 7＞6，所以 70 大。" },
      { answer: 0, explain: "8 个十加 9 个一是 89。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "6 个十是 60，加 3 个一是 63。" },
      { answer: 2, explain: "10 个十是 100。" },
      { answer: 0, explain: "99 再添 1 就是 100，所以最大两位数是 99。" },
      { answer: 1, explain: "个位是右边那位，是 8。" },
      { answer: 2, explain: "5 个十加 3 个十是 8 个十，即 80。" }
    ]
  }
};

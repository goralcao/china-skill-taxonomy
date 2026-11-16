var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "3 个十加 4 个十是 7 个十，即 70。" },
      { answer: 1, explain: "7 个十减 3 个十是 4 个十，即 40。" },
      { answer: 2, explain: "个位 5+3=8，十位不变，是 48。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "2 十加 5 十是 7 十，即 70。" },
      { answer: 1, explain: "9 十减 6 十是 3 十，即 30。" },
      { answer: 2, explain: "1 十加 8 十是 9 十，即 90。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "个位 2+5=7，十位还是 3，是 37。" },
      { answer: 1, explain: "个位 6−4=2，十位还是 5，是 52。" },
      { answer: 2, explain: "4 个十加 8 个一是 48。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "5 十加 3 十是 8 十，即 80。" },
      { answer: 1, explain: "8 十减 2 十是 6 十，即 60。" },
      { answer: 2, explain: "个位 3+4=7，十位 6 不变，是 67。" },
      { answer: 0, explain: "30+30=60。" },
      { answer: 1, explain: "个位 5−5=0，十位 7 不变，是 70。" }
    ]
  }
};

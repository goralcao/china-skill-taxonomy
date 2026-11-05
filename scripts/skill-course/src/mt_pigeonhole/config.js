var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "怎么放都躲不掉", "最不利原则", "连一连", "中测1", "两道经典题", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 2, explain: "物体比抽屉多 1，至少 2 支。" },
      { answer: 0, explain: "12 个月就是 12 个抽屉。" },
      { answer: 1, explain: "「至少」指最坏情况下也保证成立。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "7 ÷ 3 = 2 余 1，商 + 1 = 3 只。" },
      { answer: 0, explain: "物体比盒子多 1，至少 2 个。" },
      { answer: 2, explain: "是所有放法里最坏的那个也能保证。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: "10 ÷ 3 = 3 余 1，商 + 1 = 4 个。" },
      { answer: 1, explain: "先各抽 1 张，第 5 张必然重复花色。" },
      { answer: 0, explain: "有余数，商要加 1。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "物体比笔筒多 1，至少 2 支。" },
      { answer: 1, explain: "月份是抽屉，人是物体。" },
      { answer: 2, explain: "25 ÷ 6 = 4 余 1，商 + 1 = 5 个。" },
      { answer: 0, explain: "先让每个抽屉尽量少。" },
      { answer: 1, explain: "它给的是最坏情况下的保证数。" }
    ]
  }
};

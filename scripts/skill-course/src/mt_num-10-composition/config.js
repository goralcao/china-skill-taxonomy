var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "5 = 1 + 4，所以分成 1 和 4。" },
      { answer: 1, explain: "2 + 3 = 5，合起来是 5。" },
      { answer: 2, explain: "4 = 2 + 2，两边一样多。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "6 的分法：1+5、2+4、3+3。3+3 是最后一种（两边一样）。" },
      { answer: 1, explain: "7 = 3 + 4。" },
      { answer: 2, explain: "3 + 5 = 8。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "9 = 4 + 5。" },
      { answer: 1, explain: "6 + 2 = 8。" },
      { answer: 2, explain: "10 = 5 + 5，两边各一半。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "3 = 1 + 2。" },
      { answer: 1, explain: "4 + 4 = 8。" },
      { answer: 2, explain: "8 = 2 + 6。" },
      { answer: 0, explain: "10 = 1 + 9。按从小到大地分，第一组是 1 和 9。" },
      { answer: 1, explain: "交换两部分位置，合起来还是 7。" }
    ]
  }
};

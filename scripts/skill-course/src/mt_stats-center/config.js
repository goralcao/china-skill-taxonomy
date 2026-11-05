var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "三个统计量", "极端值", "连一连", "中测1", "何时用哪个", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "20 ÷ 5 = 4。" },
      { answer: 1, explain: "排序后第 3 个是 3。" },
      { answer: 2, explain: "3 出现了 2 次，最多。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "110 ÷ 5 = 22。" },
      { answer: 0, explain: "排序后第 3 个是 3。" },
      { answer: 1, explain: "平均数用到每个数，最容易被拉偏。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 2, explain: "(4 + 6) ÷ 2 = 5。" },
      { answer: 2, explain: "看哪个尺码出现最多。" },
      { answer: 0, explain: "没有极端值时平均数合适。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "5 出现 3 次，最多。" },
      { answer: 1, explain: "24 ÷ 4 = 6。" },
      { answer: 2, explain: "极端高值拉高了平均数，中位数更能代表多数人。" },
      { answer: 0, explain: "不排序就没有「正中间」。" },
      { answer: 1, explain: "众数反映最普遍的情况。" }
    ]
  }
};

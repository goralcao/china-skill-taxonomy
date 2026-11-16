var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "3+4＞5，任意两边和大于第三边，能摆成。" },
      { answer: 2, explain: "1+2=3＜10，两边和小于第三边，摆不成。" },
      { answer: 0, explain: "三角形具有稳定性，不易变形。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 1, explain: "5+5＞5，能摆成等边三角形。" },
      { answer: 2, explain: "2+3=5＜6，摆不成。" },
      { answer: 0, explain: "这是三角形三边关系。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: "三个角都是锐角，是锐角三角形。" },
      { answer: 2, explain: "有直角的是直角三角形。" },
      { answer: 0, explain: "三边相等是等边三角形，也叫正三角形。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "4+5=9，等于第三边，摆不成。" },
      { answer: 2, explain: "三角形稳定，不易变形。" },
      { answer: 0, explain: "有钝角的是钝角三角形。" },
      { answer: 1, explain: "两边相等是等腰三角形。" },
      { answer: 2, explain: "只需检查较短两边之和是否大于最长边。" }
    ]
  }
};

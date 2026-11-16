var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 2, explain: "从不同方向看，看到的面可能不一样。" },
      { answer: 0, explain: "从上面看圆柱，看到它的圆形顶面。" },
      { answer: 1, explain: "正对着看就是正面。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "长方体侧面多是长方形。" },
      { answer: 0, explain: "正方体每个面都是正方形。" },
      { answer: 1, explain: "站在左边看到的就是左面。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 2, explain: "球从任何方向看都是圆。" },
      { answer: 0, explain: "相对两面看到的往往不同。" },
      { answer: 1, explain: "从上面往下看能看到顶部。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 2, explain: "位置不同，看到的面可能不同。" },
      { answer: 0, explain: "球从上面看也是圆。" },
      { answer: 1, explain: "正方体正面是正方形。" },
      { answer: 2, explain: "站右边看右侧面。" },
      { answer: 0, explain: "先看从哪个方向观察。" }
    ]
  }
};

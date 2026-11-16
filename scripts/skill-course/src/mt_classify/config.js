var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 2, explain: "它们都是水果，这是按种类分。" },
      { answer: 0, explain: "文具用来学习、玩具用来玩，按用途分。" },
      { answer: 1, explain: "一次分类标准要一致，不能中途换。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "按颜色分，红和绿不同色，要分开。" },
      { answer: 0, explain: "按大小分要按大小分开。" },
      { answer: 1, explain: "按颜色分和按形状分，结果可能不一样。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 2, explain: "3+2=5。" },
      { answer: 0, explain: "分类后数出每类数量，就是整理。" },
      { answer: 1, explain: "3−2=1，红球多 1 个。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 2, explain: "题目说了按颜色，标准就是颜色。" },
      { answer: 0, explain: "可以按颜色、形状、用途等自己定标准。" },
      { answer: 1, explain: "数一数每类数量，才算整理完。" },
      { answer: 2, explain: "按形状分，同形状放一起。" },
      { answer: 0, explain: "标准要一致，中途换标准就分乱了。" }
    ]
  }
};

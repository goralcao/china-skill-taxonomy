var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "全面认识自己才客观。" },
      { answer: 1, explain: "接纳自己才能更好成长。" },
      { answer: 2, explain: "挫折是成长的机会。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "科学调节压力。" },
      { answer: 1, explain: "宽容是良好品格。" },
      { answer: 2, explain: "诚实是可贵品质。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "勇敢是理智地面对。" },
      { answer: 1, explain: "积极期待促人向上。" },
      { answer: 2, explain: "悦纳与改进结合。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "正视挫折才能成长。" },
      { answer: 1, explain: "虚伪不是良好品格。" },
      { answer: 2, explain: "反思加行动才能进步。" },
      { answer: 0, explain: "见贤思齐。" },
      { answer: 1, explain: "健康包括身心两方面。" }
    ]
  }
};

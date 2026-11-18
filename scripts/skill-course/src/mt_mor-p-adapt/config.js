var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "上小学我们成为一名小学生。" },
      { answer: 1, explain: "自己的事情自己做，是成长的开始。" },
      { answer: 2, explain: "不懂就问，才能把知识学懂。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "按时上学、带齐学习用品是好习惯。" },
      { answer: 1, explain: "小学有更多课程和规则，与幼儿园不同。" },
      { answer: 2, explain: "主动问好能交到新朋友。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "用完放回原处，下次才好找。" },
      { answer: 1, explain: "积极面对新生活，才能适应得快。" },
      { answer: 2, explain: "礼貌问好是对老师的尊重。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "有礼貌地借，用后归还。" },
      { answer: 1, explain: "课间先准备好用品，再适当休息。" },
      { answer: 2, explain: "学会自理，是小学生的重要一课。" },
      { answer: 0, explain: "说出感受，大人会帮助你。" },
      { answer: 1, explain: "学会自理就是可喜的进步。" }
    ]
  }
};

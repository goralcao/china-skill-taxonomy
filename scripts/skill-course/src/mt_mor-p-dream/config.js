var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "要敢于梦想，并为之努力。" },
      { answer: 1, explain: "梦想需要目标指引和行动支撑。" },
      { answer: 2, explain: "袁隆平钻研杂交水稻，圆了禾下乘凉梦。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "航天员勇于探索宇宙。" },
      { answer: 1, explain: "今天的学习为未来梦想打基础。" },
      { answer: 2, explain: "具体可行的目标更容易实现。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "坚持才能一步步接近梦想。" },
      { answer: 1, explain: "行动是追梦的关键。" },
      { answer: 2, explain: "梦想值得尊重，不要因嘲笑放弃。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "梦想各不相同，没有标准答案。" },
      { answer: 1, explain: "坚持努力是追梦必备。" },
      { answer: 2, explain: "分阶段目标让梦想更可实现。" },
      { answer: 0, explain: "勤奋的追梦者才值得学习。" },
      { answer: 1, explain: "从小立下志向并努力。" }
    ]
  }
};

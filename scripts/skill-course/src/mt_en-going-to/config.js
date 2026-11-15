var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "be going to + 动词原形，如 is going to play。" },
      { answer: 0, explain: "be (is) + going to + 原形 play，三样齐全。" },
      { answer: 2, explain: "tomorrow、next week、this weekend 表将来。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "I am、he is、they are going to ...，别漏也别一律 is。" },
      { answer: 1, explain: "必须是 is going to play，to 不能省。" },
      { answer: 0, explain: "把 be 提到句首：Are you going to swim?" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "在 be 后加 not：be not going to + 原形。" },
      { answer: 2, explain: "be going to 问将来的计划安排。" },
      { answer: 1, explain: "be going to 表打算；every Sunday 是习惯，visited 是过去。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "主语 they 配 are + going to。" },
      { answer: 0, explain: "它表达「打算/计划做什么」，和常态、此刻都不同。" },
      { answer: 2, explain: "to 后动词用原形 read。" },
      { answer: 0, explain: "be going to 说打算，be + V-ing 说此刻；靠时间词和意思分。" },
      { answer: 1, explain: "对着真实计划说，才把 tomorrow 和 be going to 连起来。" }
    ]
  }
};

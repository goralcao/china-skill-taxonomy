var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "身体不断生长发育。" },
      { answer: 1, explain: "烦恼正常，学会面对和倾诉。" },
      { answer: 2, explain: "小目标容易实现，能带来成功体验。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "继续努力，不断进步。" },
      { answer: 1, explain: "很多人关心帮助我们成长。" },
      { answer: 2, explain: "感恩是美德，要表达感谢。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "和自己的过去比，看进步。" },
      { answer: 1, explain: "学会新本领是成长。" },
      { answer: 2, explain: "努力和交往带来快乐。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "尝试学习才能成长。" },
      { answer: 1, explain: "积极心态促进成长。" },
      { answer: 2, explain: "用语言和行动表达感恩。" },
      { answer: 0, explain: "成长包括身体、能力、心理多方面。" },
      { answer: 1, explain: "进步带来自信和快乐。" }
    ]
  }
};

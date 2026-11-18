var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "探究常从观察、提出问题开始。" },
      { answer: 1, explain: "根据已有知识作出的猜测叫假设。" },
      { answer: 2, explain: "用实验收集证据来检验假设。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "结论必须建立在证据基础上。" },
      { answer: 1, explain: "要尊重事实，修正假设继续探究。" },
      { answer: 2, explain: "实事求是是科学的基本态度。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "重复实验能减少偶然、提高可靠性。" },
      { answer: 1, explain: "科学结论基于证据，随新证据可修正。" },
      { answer: 2, explain: "袁隆平是我国杂交水稻专家。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "周密设计才能保证实验有效、公平。" },
      { answer: 1, explain: "这是观察到的客观事实。" },
      { answer: 2, explain: "交流能让更多人检验和启发。" },
      { answer: 0, explain: "科学鼓励基于证据的合理质疑。" },
      { answer: 1, explain: "提出问题、实验等是探究环节，算命不是。" }
    ]
  }
};

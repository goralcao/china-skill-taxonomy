var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "工程先明确任务与限制条件。" },
      { answer: 1, explain: "三角形具有稳定性，常用于加固。" },
      { answer: 2, explain: "上小下大、重心低更稳。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "测试为发现问题、优化设计。" },
      { answer: 1, explain: "限制条件是工程必须考虑的因素。" },
      { answer: 2, explain: "斜撑形成三角形结构，增强稳定。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "图纸便于沟通、比较和修改。" },
      { answer: 1, explain: "重心低、支撑面大，物体更稳。" },
      { answer: 2, explain: "找原因、改设计是工程的正常环节。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "彩虹是自然现象，不是工程产品。" },
      { answer: 1, explain: "工程设计常需团队分工合作。" },
      { answer: 2, explain: "看是否稳固、是否符合要求，而非只看外观。" },
      { answer: 0, explain: "结构设计影响稳定性。" },
      { answer: 1, explain: "工程一般经历设计、制作、测试、改进的循环。" }
    ]
  }
};

var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "位置是认识家乡的起点。" },
      { answer: 1, explain: "家乡的山水是本地风景。" },
      { answer: 2, explain: "特产是本地出产的特色物品。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "了解名人的贡献更有意义。" },
      { answer: 1, explain: "家乡在不断变化发展。" },
      { answer: 2, explain: "多种方式能更好地介绍家乡。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "了解和爱护是爱家乡的表现。" },
      { answer: 1, explain: "从小事爱护家乡环境。" },
      { answer: 2, explain: "家乡建设让生活更好。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "特产习俗体现家乡独特之处。" },
      { answer: 1, explain: "从小事做起也是贡献。" },
      { answer: 2, explain: "了解历史更懂家乡、更爱家乡。" },
      { answer: 0, explain: "梦境不是介绍家乡的真实内容。" },
      { answer: 1, explain: "家乡美在自然、人文各处。" }
    ]
  }
};

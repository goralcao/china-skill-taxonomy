var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "空心船体排开更多水，浮力更大。" },
      { answer: 1, explain: "水对浸入物体有向上的浮力。" },
      { answer: 2, explain: "空心能排开更多水，得到更大浮力。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "船身宽、重心低更稳定。" },
      { answer: 1, explain: "吸水纸遇水失去强度，不适合造船。" },
      { answer: 2, explain: "只比较船的设计，其他条件相同。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "船要靠桨、帆、发动机等提供动力。" },
      { answer: 1, explain: "帆船靠风吹动帆提供动力。" },
      { answer: 2, explain: "海水密度大、浮力大，船会浮得略高。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "进水增加重量、减小浮力，可能沉没。" },
      { answer: 1, explain: "救生衣空心增大排水量，提供额外浮力。" },
      { answer: 2, explain: "工程要先明确要求、画设计图再制作。" },
      { answer: 0, explain: "找出问题再改进，是工程设计的正常步骤。" },
      { answer: 1, explain: "苹果落地是重力作用，不是浮力。" }
    ]
  }
};

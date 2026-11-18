var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "显微镜能高倍放大微小物体。" },
      { answer: 1, explain: "细胞是生物体的基本单位。" },
      { answer: 2, explain: "乳酸菌能发酵做酸奶，对人有益。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "酵母发酵产生二氧化碳，使面团膨松。" },
      { answer: 1, explain: "多数微生物很小，需借助显微镜。" },
      { answer: 2, explain: "流感病毒会使人得病，是有害的。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "先低倍定位，再换高倍观察。" },
      { answer: 1, explain: "洋葱表皮细胞排列像砖块格子。" },
      { answer: 2, explain: "微生物分解食物导致腐败。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "低温干燥能抑制微生物繁殖。" },
      { answer: 1, explain: "病毒没有细胞结构，其他生物由细胞构成。" },
      { answer: 2, explain: "洗手能去除病原体，减少感染。" },
      { answer: 0, explain: "显微镜成倒像，上下左右都颠倒。" },
      { answer: 1, explain: "科学观察要借助工具、如实记录。" }
    ]
  }
};

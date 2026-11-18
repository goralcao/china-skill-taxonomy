var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "温室气体增加导致变暖。" },
      { answer: 1, explain: "水污染是环境问题。" },
      { answer: 2, explain: "节约与新能源是出路。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "低碳就是减少能耗和排放。" },
      { answer: 1, explain: "分类利于回收与环保。" },
      { answer: 2, explain: "环保是共同责任。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "植树护绿利于环境。" },
      { answer: 1, explain: "执行才有实效。" },
      { answer: 2, explain: "绿色出行减少排放。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "减少一次性用品利于环保。" },
      { answer: 1, explain: "和谐共生是正确理念。" },
      { answer: 2, explain: "焚烧垃圾污染空气。" },
      { answer: 0, explain: "环境问题是全球性的，需要合作。" },
      { answer: 1, explain: "从身边方案做起。" }
    ]
  }
};

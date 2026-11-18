var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "水是生命之源，人和动植物都离不开水。" },
      { answer: 1, explain: "人和动物呼吸空气，空气中的氧气供呼吸。" },
      { answer: 2, explain: "阳光给植物能量，是光合作用的条件。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "土壤让植物扎根并吸收养分。" },
      { answer: 1, explain: "空气、水、阳光、土壤是自然提供的资源。" },
      { answer: 2, explain: "地球为人类和动植物提供生存条件，是共同家园。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "鱼用鳃呼吸，离不开水。" },
      { answer: 1, explain: "节约资源是保护地球的实际行动。" },
      { answer: 2, explain: "森林是许多动植物的家，砍伐会破坏生态。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "水、矿产、森林等很多资源有限，要珍惜。" },
      { answer: 1, explain: "光合作用需要阳光、水和二氧化碳。" },
      { answer: 2, explain: "手机是人造物品，阳光是自然提供的。" },
      { answer: 0, explain: "从节约水电、垃圾分类、爱护花草做起。" },
      { answer: 1, explain: "人和动植物共享地球资源，相互影响、依存。" }
    ]
  }
};

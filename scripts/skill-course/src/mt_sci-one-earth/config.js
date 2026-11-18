var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "石油、煤形成要亿万年，用一点少一点。" },
      { answer: 1, explain: "可供使用的淡水有限，分布不均。" },
      { answer: 2, explain: "随手关水龙头能减少浪费。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "分类便于回收利用、减少环境污染。" },
      { answer: 1, explain: "砍伐森林破坏生态，造成水土流失和生物减少。" },
      { answer: 2, explain: "太阳能取之不尽，属可再生资源。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "地球是人类唯一的家园，要好好爱护。" },
      { answer: 1, explain: "少用一次性用品能节约资源、减少垃圾。" },
      { answer: 2, explain: "从身边小事做起，人人都能贡献。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "过度捕捞使鱼类来不及繁殖，资源枯竭。" },
      { answer: 1, explain: "长流水浪费水；一水多用是节约。" },
      { answer: 2, explain: "环保需要每个人参与，从小事做起。" },
      { answer: 0, explain: "回收废纸能减少造纸用木材，保护森林。" },
      { answer: 1, explain: "很多资源有限甚至不可再生，必须珍惜。" }
    ]
  }
};

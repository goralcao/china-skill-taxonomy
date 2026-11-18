var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "地震能在短时间内改变地表。" },
      { answer: 1, explain: "流水侵蚀带走泥沙，形成峡谷沟壑。" },
      { answer: 2, explain: "岩浆冷却凝固形成岩石、堆成地形。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "温度变化、风雨使岩石破碎，是风化。" },
      { answer: 1, explain: "地震火山快，侵蚀风化慢。" },
      { answer: 2, explain: "流水侵蚀经漫长时间才显现。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "就近躲避、护头，不乘电梯。" },
      { answer: 1, explain: "植被破坏使土壤失去保护，易被冲走。" },
      { answer: 2, explain: "根系能固定土壤，防止水土流失。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "地壳运动使海陆变迁，高山曾可能是海底。" },
      { answer: 1, explain: "只改变一个条件，其他保持相同。" },
      { answer: 2, explain: "风能吹起沙尘、侵蚀和堆积地表物质。" },
      { answer: 0, explain: "植被能保护地表，乱挖乱建会破坏。" },
      { answer: 1, explain: "地震、流水都能改变地表，月亮发光不能。" }
    ]
  }
};

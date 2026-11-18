var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "水在 0℃以下结冰。" },
      { answer: 1, explain: "标准大气压下水约 100℃沸腾。" },
      { answer: 2, explain: "冰是水的固态。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "糖溶解成看不见的微粒，还在水里。" },
      { answer: 1, explain: "盐已溶解，滤不住，蒸发水分可留下盐。" },
      { answer: 2, explain: "泥沙不溶于水，可用滤纸过滤。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "水蒸气无色，白气是水蒸气遇冷凝结的小水滴。" },
      { answer: 1, explain: "水蒸发变成水蒸气散到空气中。" },
      { answer: 2, explain: "食盐能溶解在水中，沙子、油不能。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "水蒸发上升、凝结降落，形成水循环。" },
      { answer: 1, explain: "搅拌、升温、研碎能加快溶解，降温不行。" },
      { answer: 2, explain: "水蒸气是水的气态，看不见。" },
      { answer: 0, explain: "水结冰（凝固）放热，熔化吸热。" },
      { answer: 1, explain: "只有被研究的条件不同，其他相同才公平。" }
    ]
  }
};

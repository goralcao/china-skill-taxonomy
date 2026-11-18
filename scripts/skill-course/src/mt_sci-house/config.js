var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "地基在最下面，打牢了房子才稳。" },
      { answer: 1, explain: "房顶挡雨遮阳，坡顶还便于雨水流下。" },
      { answer: 2, explain: "墙壁支撑房顶，还能挡风挡雨。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "塑料板不吸水、防水好；纸遇水就软。" },
      { answer: 1, explain: "先画图想清楚结构和材料，搭起来更顺利。" },
      { answer: 2, explain: "改变形状（折筒、瓦楞）能大大提高承重。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "工程就是要不断试、找问题、改进。" },
      { answer: 1, explain: "一般房子有地基、墙、房顶，不需轮子。" },
      { answer: 2, explain: "只改变材料，其他条件相同，比较才公平。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "坡顶让雨水快速流下，不易积水漏水。" },
      { answer: 1, explain: "工程活动要分工合作，发挥每个人的长处。" },
      { answer: 2, explain: "三角形具有稳定性，搭结构常用来加固。" },
      { answer: 0, explain: "要根据需要选结实、防水的材料。" },
      { answer: 1, explain: "搭好后要测试、评价，再想办法改进。" }
    ]
  }
};

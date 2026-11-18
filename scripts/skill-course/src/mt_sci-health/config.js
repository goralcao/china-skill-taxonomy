var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "均衡多样才健康。" },
      { answer: 1, explain: "充足睡眠有利于身体和大脑发育。" },
      { answer: 2, explain: "运动增强体质、提高免疫力。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "勤洗手、通风能减少病菌传播。" },
      { answer: 1, explain: "刷牙清除牙菌斑，预防蛀牙。" },
      { answer: 2, explain: "倾诉和沟通有助心理健康。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "久坐不动、过度用眼不健康。" },
      { answer: 1, explain: "生病要及时就医，不能拖。" },
      { answer: 2, explain: "均衡摄取各类营养，不是越贵越好。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "定时远眺、保持距离能护眼。" },
      { answer: 1, explain: "乐观友善有助心理健康。" },
      { answer: 2, explain: "适当活动放松，注意安全。" },
      { answer: 0, explain: "水是生命活动必需的。" },
      { answer: 1, explain: "健康是身体和心理都良好的状态。" }
    ]
  }
};

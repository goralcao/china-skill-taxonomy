var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "社会分工让大家各司其职。" },
      { answer: 1, explain: "环卫工人维护城市清洁。" },
      { answer: 2, explain: "医护人员守护健康。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "司机保障公共交通。" },
      { answer: 1, explain: "劳动者都值得尊敬。" },
      { answer: 2, explain: "每种职业都有价值。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "生活便利靠各行各业付出。" },
      { answer: 1, explain: "珍惜成果就是尊重劳动。" },
      { answer: 2, explain: "乱扔增加清洁工负担。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "学生是身份，医生是职业。" },
      { answer: 1, explain: "礼貌与配合是尊重。" },
      { answer: 2, explain: "职业不同但都有价值。" },
      { answer: 0, explain: "敬业负责值得学习。" },
      { answer: 1, explain: "大家共同努力，生活更美好。" }
    ]
  }
};

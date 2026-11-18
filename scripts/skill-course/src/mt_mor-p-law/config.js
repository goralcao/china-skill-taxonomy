var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "法律是行为规范体系。" },
      { answer: 1, explain: "刑法是基本法律部门。" },
      { answer: 2, explain: "义务教育法保障受教育权。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "未成年人保护法专门保护未成年人。" },
      { answer: 1, explain: "违法要承担相应责任。" },
      { answer: 2, explain: "做守法公民。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "法律面前人人平等。" },
      { answer: 1, explain: "用法律方式解决。" },
      { answer: 2, explain: "班级口号不是国家法律。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "宪法是根本法，具有最高权威。" },
      { answer: 1, explain: "未成年人需要特别关怀。" },
      { answer: 2, explain: "守法是基本义务。" },
      { answer: 0, explain: "多种方式学法普法。" },
      { answer: 1, explain: "法律与生活息息相关。" }
    ]
  }
};

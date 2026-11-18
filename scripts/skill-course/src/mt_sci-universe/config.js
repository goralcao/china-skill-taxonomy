var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "太阳是太阳系的恒星中心。" },
      { answer: 1, explain: "太阳自己发光发热，是恒星。" },
      { answer: 2, explain: "地球是行星，绕太阳公转。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "月球绕地球转，是地球的卫星。" },
      { answer: 1, explain: "太阳系有八大行星。" },
      { answer: 2, explain: "火星绕太阳公转，是行星。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "月亮不发光，反射太阳光。" },
      { answer: 1, explain: "水星是离太阳最近的行星。" },
      { answer: 2, explain: "太阳系是银河系的一部分。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "宇宙包含无数星系，非常巨大。" },
      { answer: 1, explain: "北极星是恒星，不是太阳系行星。" },
      { answer: 2, explain: "行星自己不发光，绕恒星运行。" },
      { answer: 0, explain: "望远镜和探测器帮助人类探索宇宙。" },
      { answer: 1, explain: "地球绕太阳公转，是太阳系行星。" }
    ]
  }
};

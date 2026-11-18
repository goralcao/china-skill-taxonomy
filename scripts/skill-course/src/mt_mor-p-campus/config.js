var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "上课专心、举手发言。" },
      { answer: 1, explain: "课间安全活动，不追逐打闹。" },
      { answer: 2, explain: "排队守秩序，人人有份。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "升国旗要庄重肃立。" },
      { answer: 1, explain: "规则保障大家安全和秩序。" },
      { answer: 2, explain: "粮食来之不易，要爱惜。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "礼貌请教，老师更喜欢。" },
      { answer: 1, explain: "教室是校园里的学习场所。" },
      { answer: 2, explain: "靠右有序通行，注意安全。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "学会宽容、友好相处。" },
      { answer: 1, explain: "认真做操，锻炼身体。" },
      { answer: 2, explain: "公共场所要安静、爱惜公物。" },
      { answer: 0, explain: "爱护校园环境，人人有责。" },
      { answer: 1, explain: "规则保护每个人，大家都受益。" }
    ]
  }
};

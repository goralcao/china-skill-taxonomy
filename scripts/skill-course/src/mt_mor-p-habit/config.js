var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "坚持重复才能形成习惯。" },
      { answer: 1, explain: "倾听是对别人的尊重。" },
      { answer: 2, explain: "规律作息让人有精神。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "洗手能防病菌、讲卫生。" },
      { answer: 1, explain: "举手发言，有序又礼貌。" },
      { answer: 2, explain: "打卡和提醒能帮助坚持。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "有条理是好习惯。" },
      { answer: 1, explain: "坚持约21天有助于形成习惯。" },
      { answer: 2, explain: "善意帮助同学共同进步。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "自理能培养责任感。" },
      { answer: 1, explain: "吃饭追跑不卫生也不安全。" },
      { answer: 2, explain: "阅读能开阔眼界、增长知识。" },
      { answer: 0, explain: "好习惯让人长期受益。" },
      { answer: 1, explain: "从小目标做起容易坚持。" }
    ]
  }
};

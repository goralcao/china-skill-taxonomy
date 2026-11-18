var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "阳光空气水是大自然的馈赠。" },
      { answer: 1, explain: "植物提供食物、氧气，美化环境。" },
      { answer: 2, explain: "爱护花草是文明行为。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "妥善处理垃圾，保护环境。" },
      { answer: 1, explain: "雨水滋润植物、净化空气。" },
      { answer: 2, explain: "爱护动物，不惊吓捕捉。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "待在原地、找警察或工作人员。" },
      { answer: 1, explain: "爱护环境是感恩的行动。" },
      { answer: 2, explain: "山川提供资源与美景。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "野外玩火危险，绝对不能做。" },
      { answer: 1, explain: "风雨有价值，注意安全即可。" },
      { answer: 2, explain: "从身边小事保护环境。" },
      { answer: 0, explain: "塑料玩具是人造物，不是自然资源。" },
      { answer: 1, explain: "和谐相处要爱护、不破坏。" }
    ]
  }
};

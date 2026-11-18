var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "世界文化多姿多彩。" },
      { answer: 1, explain: "多样文明是共同财富。" },
      { answer: 2, explain: "尊重与平等交流。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "崇外是不可取的。" },
      { answer: 1, explain: "妄自尊大不可取。" },
      { answer: 2, explain: "自信包容最健康。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "交流互鉴促进共同繁荣。" },
      { answer: 1, explain: "尊重习俗是尊重文化。" },
      { answer: 2, explain: "文明各有独特价值。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "文化没有高低贵贱。" },
      { answer: 1, explain: "了解文明开阔眼界。" },
      { answer: 2, explain: "平等学习是正道。" },
      { answer: 0, explain: "强迫改变不是交流。" },
      { answer: 1, explain: "开放包容让世界更精彩。" }
    ]
  }
};

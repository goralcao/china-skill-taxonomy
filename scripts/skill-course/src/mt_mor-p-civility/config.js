var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "「请」是礼貌用语。" },
      { answer: 1, explain: "得到帮助要感谢。" },
      { answer: 2, explain: "做错事要真诚道歉。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "「没关系」体现宽容。" },
      { answer: 1, explain: "倾听是尊重。" },
      { answer: 2, explain: "起外号是不尊重，要避免。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "公共场所要安静。" },
      { answer: 1, explain: "热情有礼待客。" },
      { answer: 2, explain: "尊重是相互的。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "要尊重每个人的不同。" },
      { answer: 1, explain: "插队破坏秩序、不文明。" },
      { answer: 2, explain: "表达感谢是礼貌。" },
      { answer: 0, explain: "「喂」地呼唤不礼貌。" },
      { answer: 1, explain: "有礼貌的人更受欢迎。" }
    ]
  }
};

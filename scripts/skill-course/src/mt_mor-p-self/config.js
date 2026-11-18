var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "每个人都有自己的独特之处。" },
      { answer: 1, explain: "学会欣赏自己，更自信。" },
      { answer: 2, explain: "发现长处、发挥优势。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "欣赏他人，也快乐自己。" },
      { answer: 1, explain: "各有长短，不必盲目攀比。" },
      { answer: 2, explain: "勇敢展示能增强自信。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "爱好多种多样，都可以。" },
      { answer: 1, explain: "既改进不足，也肯定优点。" },
      { answer: 2, explain: "要自信，必要时求助。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "差异让世界多彩，没有高低。" },
      { answer: 1, explain: "自信的人敢尝试、敢表达。" },
      { answer: 2, explain: "赞美能增进友谊。" },
      { answer: 0, explain: "看到自己的长处是健康心态。" },
      { answer: 1, explain: "新面貌更多是心理上的成长。" }
    ]
  }
};

var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "青春期变化是正常的生理现象。" },
      { answer: 1, explain: "接纳自己、坦然面对。" },
      { answer: 2, explain: "尊重他人变化。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "沟通能获得帮助。" },
      { answer: 1, explain: "有主见是成长的表现。" },
      { answer: 2, explain: "正确看待同伴影响。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "不取笑是尊重。" },
      { answer: 1, explain: "接纳烦恼、寻求帮助。" },
      { answer: 2, explain: "坦诚交流有助解决困惑。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "欣赏自己是健康心态。" },
      { answer: 1, explain: "冷静沟通化解分歧。" },
      { answer: 2, explain: "成长是身心全面的变化。" },
      { answer: 0, explain: "独立思考让人有主见。" },
      { answer: 1, explain: "成长有快慢，不必焦虑。" }
    ]
  }
};

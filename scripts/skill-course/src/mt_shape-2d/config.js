var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "红领巾有三条边、三个角，是三角形。" },
      { answer: 2, explain: "硬币的面是圆圆的，是圆形。" },
      { answer: 0, explain: "正方形有 4 条一样长的边。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 1, explain: "长方形有 4 条边，对边一样长。" },
      { answer: 2, explain: "三角形有 3 条边、3 个角。" },
      { answer: 0, explain: "圆是弯弯的，没有角。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: "课本封面是长方形。" },
      { answer: 2, explain: "方手帕四边一样长，是正方形。" },
      { answer: 0, explain: "钟面是圆形的。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "三角形有 3 条边。" },
      { answer: 2, explain: "都有 4 条边、4 个角；正方形四边相等，长方形对边相等。" },
      { answer: 0, explain: "圆没有角。" },
      { answer: 1, explain: "三角尺是三角形。" },
      { answer: 2, explain: "4 根一样长摆成正方形（4 条边相等）。" }
    ]
  }
};

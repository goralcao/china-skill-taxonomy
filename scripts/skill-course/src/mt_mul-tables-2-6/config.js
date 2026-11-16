var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "3×7=21，口诀「三七二十一」。" },
      { answer: 1, explain: "四五二十，所以 4×5=20。" },
      { answer: 2, explain: "二六十二，所以 2×6=12。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "三四十二。" },
      { answer: 1, explain: "二五一十。" },
      { answer: 2, explain: "四四十六。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "五六三十。" },
      { answer: 1, explain: "六六三十六。" },
      { answer: 2, explain: "三六十八，所以 6×3=18。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "四六二十四。" },
      { answer: 1, explain: "五五二十五。" },
      { answer: 2, explain: "一句乘法口诀通常能算两道乘法：3×6=18 和 6×3=18。" },
      { answer: 0, explain: "4 个 6：6×4=24，口诀四六二十四。" },
      { answer: 1, explain: "二二得四。" }
    ]
  }
};

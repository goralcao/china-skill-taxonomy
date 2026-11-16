var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "先乘后加：3×4=12，12+2=14。" },
      { answer: 1, explain: "先乘后减：2×3=6，10−6=4。" },
      { answer: 2, explain: "有括号先算括号：3+4=7，7×2=14。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "5×2=10，10+3=13。" },
      { answer: 1, explain: "3×4=12，20−12=8。" },
      { answer: 2, explain: "2×3=6，6+6=12。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "先算括号 8−3=5，5×2=10。" },
      { answer: 1, explain: "2+4=6，3×6=18。" },
      { answer: 2, explain: "2+1=3，12÷3=4。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "4×3=12，12+5=17。" },
      { answer: 1, explain: "2×5=10，15−10=5。" },
      { answer: 2, explain: "6+2=8，8×3=24。" },
      { answer: 0, explain: "先算 4×3=12，再加送的 2：12+2=14。" },
      { answer: 1, explain: "先算括号 6−2=4，24÷4=6。" }
    ]
  }
};

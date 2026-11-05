var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "侧面展开", "倒水实验", "连一连", "中测1", "算一算", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "上下两个大小相同的圆。" },
      { answer: 2, explain: "长是底面周长，宽是高。" },
      { answer: 0, explain: "倒 3 次正好装满，所以是 1/3。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "展开是长方形，长 × 宽 = 2πr × h。" },
      { answer: 2, explain: "3.14 × 2² × 5 = 62.8。" },
      { answer: 1, explain: "60 ÷ 3 = 20。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 2, explain: "3.14 × 9 × 10 = 282.6。" },
      { answer: 0, explain: "长正好绕底面一圈 = 2πr。" },
      { answer: 1, explain: "V柱 = 3 × V锥，圆柱是圆锥的 3 倍。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "上下两个底面，共 2πr²。" },
      { answer: 0, explain: "2 × 3.14 × 1 × 3 = 18.84。" },
      { answer: 2, explain: "90 ÷ 3 = 30。" },
      { answer: 1, explain: "等底等高时取圆柱的 1/3。" },
      { answer: 0, explain: "剩 1/3，削去 1 − 1/3 = 2/3。" }
    ]
  }
};

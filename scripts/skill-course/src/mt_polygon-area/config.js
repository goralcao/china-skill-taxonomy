var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "菜地", "底×高", "连一连", "中测1", "三角形梯形", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "6 × 4 = 24。选 A 把长宽相加了；选 C 算的是周长的一半。" },
      { answer: 0, explain: "底乘高。选 B 把斜边当高，结果偏大；选 C 算的是周长。" },
      { answer: 1, explain: "只是搬了家，纸没多也没少。面积不变，周长可能变。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "剪拼成长方形后长是底、宽是高。选 B 把斜边当高；选 C 算的是周长一类的东西。" },
      { answer: 1, explain: "8 × 5 = 40。选 A 把底和高相加；选 C 是周长（8 + 5）× 2。" },
      { answer: 0, explain: "高必须垂直。选 B 是斜边，比高长；选 C 没限定方向，可能斜着量。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: "6 × 4 ÷ 2 = 12。选 A 忘了除以 2；选 C 把底和高相加了。" },
      { answer: 0, explain: "（3 + 5）× 4 ÷ 2 = 16。选 B 忘了除以 2；选 C 只用了下底减上底。" },
      { answer: 1, explain: "一个三角形是拼出的平行四边形的一半。选 A 把公式当成死记；选 C 和边数无关。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "剪拼后长是底、宽是高。选 B 用错了边；选 C 是把两个数平均了。" },
      { answer: 1, explain: "9 × 4 = 36。选 A 是相加；选 C 是周长。" },
      { answer: 1, explain: "10 × 6 ÷ 2 = 30。选 A 忘了 ÷2；选 C 把底和高相加了。" },
      { answer: 0, explain: "（4 + 6）× 5 ÷ 2 = 25。选 B 忘了 ÷2；选 C 只用了下底乘高。" },
      { answer: 1, explain: "8 × 5 = 40。选 A 把底和高相加，那既不是面积也不是周长。" }
    ]
  }
};

var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "切开来分", "除号变法", "连一连", "中测1", "几个之几", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "3 ÷ 4 除不尽，写成分数就是 3/4 个。选 B 把被除数和除数放反了。" },
      { answer: 1, explain: "被除数 7 当分子，除数 8 当分母，得 7/8。" },
      { answer: 1, explain: "除数不能是 0，所以分母也不能是 0。0 不能做除数，也就不能做分母。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 1, explain: "被除数 8 当分子，除数 11 当分母。选 A 上下放反了。" },
      { answer: 1, explain: "分子是被除数、分母是除数，所以是 4 ÷ 5。" },
      { answer: 0, explain: "5 ÷ 6 = 5/6 米。选 B 把两个数放反了。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: "7 ÷ 9 = 7/9 个。选 A 把两个数放反了。" },
      { answer: 0, explain: "小明 ÷ 小红 = 4 ÷ 9 = 4/9。选 B 是把小红当成了被除数。" },
      { answer: 0, explain: "每段是全长的 1/8（把全长当单位「1」）；每段长 3 ÷ 8 = 3/8 米。两个问题问的不是一回事。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "被除数 9 当分子，除数 13 当分母。" },
      { answer: 0, explain: "6 ÷ 7 = 6/7 米。选 B 把两个数放反了。" },
      { answer: 1, explain: "5 ÷ 8 = 5/8 个，比一整个少。" },
      { answer: 0, explain: "把全长看作单位「1」，平均分成 9 段，每段是 1/9。" },
      { answer: 1, explain: "甲 ÷ 乙 = 12 ÷ 17 = 12/17。乙是单位「1」，写在分母。" }
    ]
  }
};

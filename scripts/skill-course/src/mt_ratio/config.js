var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "比的意义", "基本性质", "连一连", "中测1", "按比分配", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "米是前项 1，水是后项 2，写成 1 : 2。" },
      { answer: 1, explain: "比号前面的数 3 是前项，后面 5 是后项。" },
      { answer: 2, explain: "a : b = a ÷ b，比号相当于除号。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "6 ÷ 8 = 3/4；比值要约成最简的数。" },
      { answer: 0, explain: "前后项同除以最大公因数 6，得 2 : 3；6 : 9 还能再约。" },
      { answer: 1, explain: "后项相当于除数，除数为 0 没有意义。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "3×5=15、4×5=20，写成 8 : 9 是把前后项各加 5 的错法。" },
      { answer: 1, explain: "6 : 9 = 2 : 3；4 : 9 是前后项分别平方，3 : 2 是倒过来。" },
      { answer: 2, explain: "分子分母同乘同除分数值不变，与比的基本性质是同一件事。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "前后项同乘 3 得 3 : 6，比值仍是 1/2。" },
      { answer: 2, explain: "总份数 5，每份 8 个，得 16 和 24；8 和 12 只算了 20 个。" },
      { answer: 1, explain: "前项 5 → 15 是乘 3，后项 7 → 21，即加 14。" },
      { answer: 2, explain: "4 : 3 是倒过来的比，比值 4/3 而不是 3/4。" },
      { answer: 1, explain: "前后项同乘 2 得 1 : 4；0.5 : 2 还没化成整数比。" }
    ]
  }
};

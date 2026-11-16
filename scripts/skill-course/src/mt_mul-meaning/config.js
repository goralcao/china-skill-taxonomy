var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "3 个 4：4+4+4=12，也就是 4×3=12。选 7 是 3+4，把「每盘 4 个」当成多 4 个。" },
      { answer: 1, explain: "4 个 2 相加＝2×4。乘法就是「几个相同加数」的简便写法。" },
      { answer: 2, explain: "5×3 表示 3 个 5 相加（5+5+5）。选「5 加 3」是加法，不是乘法。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "4 个 3＝3+3+3+3＝3×4。相同加数 3 写在前面。" },
      { answer: 1, explain: "6×2 是 2 个 6，6 是每组的个数，2 是有几组。" },
      { answer: 2, explain: "3 个 3 相加＝9，也就是 3×3=9。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "3 个 5：5×3=15。选 8 是 5+3，把排数当成多加的人。" },
      { answer: 1, explain: "4×2=8，2×4=8，结果一样（乘法交换），但表示的「几个几」不同。" },
      { answer: 2, explain: "2 个 6：6×2=12。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "7 个 2＝2×7。相同加数 2 在前，个数 7 在后。" },
      { answer: 1, explain: "3×5 是 5 个 3 相加（3+3+3+3+3）。" },
      { answer: 2, explain: "5 个 4：4×5=20。选 9 是 4+5，错把乘法当加法。" },
      { answer: 0, explain: "先算 2×3=6，再加 1 得 7。乘法要先算。" },
      { answer: 1, explain: "4 个 6＝6+6+6+6＝6×4。" }
    ]
  }
};

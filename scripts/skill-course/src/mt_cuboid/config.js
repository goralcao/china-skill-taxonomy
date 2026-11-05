var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "数一数", "棱分三组", "连一连", "中测1", "正方体", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "上、下、前、后、左、右，6 个面。选 A 只数了侧面一圈；选 C 把顶点数当成了面数。" },
      { answer: 0, explain: "两个面相交的边叫棱，三条棱相交的点叫顶点。" },
      { answer: 1, explain: "（5+4+3）× 4 = 48 厘米。选 A 只算了一组长宽高；选 C 把 5×12 当成了答案。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "8 个顶点、12 条棱、6 个面，别混。选 B 是顶点数，选 C 是面数。" },
      { answer: 1, explain: "（6+5+4）× 4 = 60 厘米。选 A 只加了一组；选 C 忘了乘 2 或乘 4 算错。" },
      { answer: 2, explain: "从一个顶点出发的三条棱方向各不相同，正好是长、宽、高。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: "正方体 12 条棱一样长，5 × 12 = 60 厘米。选 A 只算了 4 条。" },
      { answer: 0, explain: "48 ÷ 4 = 12 是一条长宽高的和，12 − 6 − 4 = 2 厘米。选 B 忘了减去宽。" },
      { answer: 1, explain: "正方体满足长方体的所有条件，所以它一定是长方体；反过来不成立。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "面 6、棱 12、顶点 8。其余两项都把数字挪了位置。" },
      { answer: 1, explain: "（7+4+3）× 4 = 56 厘米。选 A 只算了一组；选 C 是 7×4×3 附近凑出来的数。" },
      { answer: 2, explain: "8 × 12 = 96 厘米。选 A 只算了 4 条，选 B 算的是 8×8。" },
      { answer: 0, explain: "60 ÷ 4 = 15，15 − 7 − 5 = 3 厘米。选 B 忘了减宽，选 C 把 15 除以 3 了。" },
      { answer: 1, explain: "正方体满足长方体的全部条件，是特殊的长方体。长方体只有相对的面相同，不一定都是正方形。" }
    ]
  }
};

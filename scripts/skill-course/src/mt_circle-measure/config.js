var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "滚出 π", "切拼得面积", "连一连", "中测1", "周长与面积", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "绕一圈是周长；铺满整个面才是面积。" },
      { answer: 0, explain: "C = πd ≈ 3.14 × 10 = 31.4 厘米。" },
      { answer: 2, explain: "π = C ÷ d ≈ 3.14，与圆的大小无关。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "C = 2πr = 2 × 3.14 × 3 = 18.84 厘米；9.42 是 πr 少乘了 2。" },
      { answer: 0, explain: "d = C ÷ π = 31.4 ÷ 3.14 = 10 厘米。" },
      { answer: 2, explain: "π 是无限不循环小数，3.14 是常用近似值。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: "S = πr² = 3.14 × 4 = 12.56 平方厘米；带「厘米」是周长单位。" },
      { answer: 1, explain: "长是半周长 πr，宽是 r。" },
      { answer: 2, explain: "面积与 r² 成正比，3² = 9 倍。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "C = πd = 3.14 × 8 = 25.12 厘米。" },
      { answer: 2, explain: "S = 3.14 × 4² = 3.14 × 16 = 50.24 平方厘米。" },
      { answer: 1, explain: "πr + 2r = 18.84 + 12 = 30.84 厘米；只算 πr 会漏掉直径。" },
      { answer: 1, explain: "C 与 r 成正比，S 与 r² 成正比。" },
      { answer: 1, explain: "面积用平方单位；厘米、米是长度单位。" }
    ]
  }
};

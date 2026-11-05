var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "数方块", "单位进率", "连一连", "中测1", "公式容积", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 2, explain: "体积用立方单位，棱长 1 cm 的正方体体积是 1 cm³。" },
      { answer: 1, explain: "一层 4×3=12 个，两层 12×2=24 个。" },
      { answer: 2, explain: "1 dm = 10 cm，10×10×10 = 1000，所以是 1000 cm³。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "粉笔盒大约 1 dm³ 量级；cm² 是面积单位，m³ 又太大。" },
      { answer: 2, explain: "1 m³ = 1000 dm³，2 m³ = 2000 dm³。" },
      { answer: 1, explain: "2 × 2 × 2 = 8 cm³。选 A 是把三条棱相加了。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: "5 × 4 × 3 = 60 cm³。选 A 只算了 4 × 3。" },
      { answer: 0, explain: "2 × 2 × 2 = 8 dm³ = 8 L。" },
      { answer: 2, explain: "1 L = 1000 mL，3000 ÷ 1000 = 3 L。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "3 × 3 × 3 = 27 dm³。" },
      { answer: 0, explain: "1 dm³ = 1000 cm³，5 dm³ = 5000 cm³。" },
      { answer: 2, explain: "6 × 2 × 5 = 60 cm³。" },
      { answer: 1, explain: "1 mL = 1 cm³，所以 550 mL = 550 cm³。" },
      { answer: 0, explain: "4 × 4 × 4 = 64，所以棱长 4 cm。" }
    ]
  }
};

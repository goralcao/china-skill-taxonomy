var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "两个1/4", "三个零件", "连一连", "中测1", "单位1", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "平均分成 4 份，取 1 份就是 1/4。选 C 把分子分母写反了。" },
      { answer: 1, explain: "平均分成 3 堆，每堆就是 1/3。选 A 把「12 颗」当成了分母。" },
      { answer: 1, explain: "分母 4 表示平均分成 4 份，分子 3 才表示取了 3 份。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "分母 6 才是分成的份数，分子 5 是取的份数。选 B 把分子当成了分母。" },
      { answer: 1, explain: "平均分成 3 份，每份就是 1/3。选 A 把个数当成了分母。" },
      { answer: 2, explain: "分母是 10，分数单位就是 1/10；7/10 里有 7 个 1/10。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: "20 ÷ 5 = 4，每份 4 颗；取 2 份就是 4 × 2 = 8 颗。选 A 只算了一份。" },
      { answer: 1, explain: "分子是 3，就有 3 个 1/8。选 A 看的是分母。" },
      { answer: 2, explain: "都取 1 份，分成 4 份时每份更大。选 A 想反了：分的人越多，每人越少。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "平均分成 5 段，每段就是全长的 1/5。选 B 把「3 米」当成了分母；选 C 把两个数混在了一起。" },
      { answer: 1, explain: "分母 9 → 分数单位 1/9；分子 4 → 有 4 个。选 A 把分母和分子看反了；选 C 把分子当成了分母。" },
      { answer: 2, explain: "18 ÷ 6 = 3，每份 3 个；5 份是 3 × 5 = 15 个。选 A 只算了一份；选 B 直接用总数。" },
      { answer: 0, explain: "同样一个整体，分成 3 份每份最大，所以 1/3 最大。分母越大每份越小。" },
      { answer: 1, explain: "24 ÷ 8 = 3，每份 3 块；3 份是 9 块。选 A 把分子当成了块数。" }
    ]
  }
};

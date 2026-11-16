var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "10 个一百是 1000，读作一千。" },
      { answer: 2, explain: "从右往左：个、十、百、千。3250 的 2 在百位。" },
      { answer: 0, explain: "3 个千是 3000，加 5 个一是 3005，中间的 0 不能丢。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 1, explain: "四位数从左到右是千、百、十、个。" },
      { answer: 2, explain: "5 在千位，表示 5 个千。" },
      { answer: 0, explain: "九千九百九十九是 9999。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: "千位都是 3，比百位：5＞2，所以 3520 大。" },
      { answer: 2, explain: "9999 添 1 是 10000，所以最大四位数是 9999。" },
      { answer: 0, explain: "1000 是四位数，999 是三位数，位数多的更大。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "6 个千=6000，2 个十=20，8 个一=8，合起来是 6028（百位没有要写 0）。" },
      { answer: 2, explain: "10 个一千是一万，写作 10000。" },
      { answer: 0, explain: "百位是 0 读「零」，十位是 1 读「一十」，是七千零一十。" },
      { answer: 1, explain: "从右往左个、十、百、千，4800 的百位是 8。" },
      { answer: 2, explain: "10 个一百是 1000。" }
    ]
  }
};

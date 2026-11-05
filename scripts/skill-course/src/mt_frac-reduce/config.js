var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "并一并", "约分", "连一连", "中测1", "通分", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "把 2/4 的分子分母同时除以 2，就是 1/2，两个一样大。" },
      { answer: 0, explain: "12 ÷ 6 = 2，18 ÷ 6 = 3，所以是 2/3。选 C 只除了一半就停了。" },
      { answer: 1, explain: "不能再约了，就叫最简分数。真分数、假分数说的是分子分母谁大。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "同时除以 8 得 2/3。选 B、C 都只除了一半，还没到最简。" },
      { answer: 2, explain: "18 的因数有 1、2、3、6、9、18，24 的有 1、2、3、4、6、8、12、24，公因数最大是 6。" },
      { answer: 1, explain: "7 和 9 只有公因数 1。6/9 还能除以 3，9/12 还能除以 3。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "4 和 3 的最小公倍数是 12。选 C 虽然也能通分，但不是最小。" },
      { answer: 1, explain: "分母 5 乘 3 得 15，分子 2 也要乘 3，得 6/15。选 A 只改了分母。" },
      { answer: 2, explain: "通分成 25/40 和 24/40，25 > 24，所以 5/8 大。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "同时除以 12 得 2/3。B、C 都还能继续约，不是最简。" },
      { answer: 1, explain: "分母 7 乘 3 得 21，分子 3 也乘 3，得 9/21。选 A 只改了分母。" },
      { answer: 2, explain: "通分成 21/30 和 20/30，21 > 20，所以 7/10 大。" },
      { answer: 0, explain: "分子分母同乘同一个数，相当于每份切得更细、取的份数也按比例增加，大小不变。" },
      { answer: 1, explain: "2/3 的分子分母同乘 3 得 6/9。A 只乘了分子，C 分子分母加的不是同一个数。" }
    ]
  }
};

var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "3 个再添 2 个：3、4、5，一共 5 个。选 4 是少算了一个，选 6 是多算了一个。" },
      { answer: 1, explain: "4 就是四个：数一数圆点，●●●● 正好四个。" },
      { answer: 2, explain: "按顺序 1、2、3、4、5，5 前面紧挨着的是 4。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "「第 3」说的是位置（序数），不是一共有 3 人。这是「几个」和「第几个」的区别。" },
      { answer: 1, explain: "5 个拿走 1 个：5−1=4。剩下 4 个。" },
      { answer: 2, explain: "比 6 少 1 就是 6−1=5。选 7 是比 6 多 1，方向反了。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "5 = 2 + 3，所以 5 可以分成 2 和 3。" },
      { answer: 1, explain: "3 + 4 = 7。合起来就是把两部分加在一起。" },
      { answer: 2, explain: "7 = 3 + 4，右边是 4 个。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "4 + 1 = 5，一共 5 块。" },
      { answer: 1, explain: "2、5、9 里最小的是 2。数越往右越大。" },
      { answer: 2, explain: "8 = 5 + 3，所以是 3。" },
      { answer: 0, explain: "2、3、4、5、6，一共 5 个数。别只做 6−2=4，要把 2 也算上。" },
      { answer: 1, explain: "第 5 个前面紧挨着的是第 4 个。" }
    ]
  }
};

var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "角有一个顶点和两条边。" },
      { answer: 1, explain: "角的大小只看两条边张开的程度，与边画多长无关。" },
      { answer: 2, explain: "书本四个角都是直角。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "角有一个顶点、两条边。" },
      { answer: 1, explain: "张得越开角越大，与边长无关。" },
      { answer: 2, explain: "小于直角的是锐角。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "大于直角、小于平角的是钝角。" },
      { answer: 1, explain: "3 点整两针垂直，是直角。" },
      { answer: 2, explain: "张开越大，角越大。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "角只看张开程度，与边长无关。" },
      { answer: 1, explain: "小于直角是锐角。" },
      { answer: 2, explain: "一块三角尺有 1 个直角、2 个锐角。" },
      { answer: 0, explain: "两边成一条直线是平角。" },
      { answer: 1, explain: "推开越多张得越开，角越大。" }
    ]
  }
};

var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "太阳从东方升起，从西方落下。" },
      { answer: 1, explain: "多数人用右手写字，但 left/right 要看自己。" },
      { answer: 2, explain: "头在身体的上面，脚在下面。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "桌面在椅面上方，要看具体摆放。" },
      { answer: 1, explain: "你在小明后面，反过来小明在你前面。" },
      { answer: 2, explain: "书装在书包里面。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "右手在身体右侧。" },
      { answer: 1, explain: "面对面时左右相反：他的左手在你右边。" },
      { answer: 2, explain: "按扶手方向靠右行。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "上下是相对的，反过来盘子在苹果下面。" },
      { answer: 1, explain: "左右相反，小刚在小丽右边。" },
      { answer: 2, explain: "面向北，右手指向东，左手指向西。" },
      { answer: 0, explain: "说上下前后左右，先要说清以谁为准（参照物）。" },
      { answer: 1, explain: "上是往高处（楼层数字变大）。" }
    ]
  }
};

var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "圆规画圆", "d = 2r", "连一连", "中测1", "对称与生活", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "针尖固定的点是圆心，通常用字母 O 表示。" },
      { answer: 2, explain: "圆心到圆上一点的线段是半径 r。" },
      { answer: 1, explain: "d = 2r = 2 × 5 = 10 厘米。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "r = d ÷ 2 = 12 ÷ 2 = 6 厘米。" },
      { answer: 1, explain: "直径要同时满足过圆心、两端在圆上；第三种是半径。" },
      { answer: 2, explain: "圆上有无数个点，每个点与圆心连成一条半径。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: "每条直径所在直线都是对称轴，直径有无数条。" },
      { answer: 2, explain: "不经过圆心的只是普通弦，只有过圆心的才是直径。" },
      { answer: 0, explain: "每条直径都是 2r，r 相同所以直径都相等。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "两脚距离就是半径，张开 4 厘米。" },
      { answer: 1, explain: "d = 2r = 2 × 7 = 14 厘米。" },
      { answer: 1, explain: "直径经过圆心，是圆内最长的弦。" },
      { answer: 0, explain: "d = 2r 成立；半径有无数条，弦不一定过圆心。" },
      { answer: 2, explain: "圆任意方向的宽度都等于直径，怎么转都不会掉进井口。" }
    ]
  }
};

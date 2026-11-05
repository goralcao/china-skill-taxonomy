var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "认识扇形", "占圆几分之几", "连一连", "中测1", "扇形统计图", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "360° ÷ 4 = 90°。" },
      { answer: 1, explain: "顶点在圆心，两条半径加一段弧围成扇形。" },
      { answer: 2, explain: "180° ÷ 360° = 1/2，正好是半圆。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "120 ÷ 360 = 1/3。" },
      { answer: 1, explain: "扇形要求顶点在圆心、两边为半径。" },
      { answer: 0, explain: "3.14 × 16 × 1/4 = 12.56 平方厘米；50.24 是没乘 1/4 的整圆面积。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: "25% × 360° = 90°。" },
      { answer: 2, explain: "270 ÷ 360 = 3/4；2/3 对应 240°。" },
      { answer: 1, explain: "占比从 1/6 变 1/3，面积扩大到 2 倍。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 2, explain: "360° ÷ 6 = 60°。" },
      { answer: 1, explain: "40% × 360° = 144°。" },
      { answer: 0, explain: "半圆：3.14 × 36 ÷ 2 = 56.52 平方厘米。" },
      { answer: 2, explain: "45 ÷ 360 = 1/8。" },
      { answer: 1, explain: "占比合计 100%，对应圆心角合计 360°。" }
    ]
  }
};

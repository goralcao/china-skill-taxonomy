var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "力能使静止物体运动，改变运动状态。" },
      { answer: 1, explain: "重力方向总是竖直向下。" },
      { answer: 2, explain: "刹车靠摩擦力使车减速停下。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "弓被拉弯后要恢复原状，产生弹力。" },
      { answer: 1, explain: "冰面光滑摩擦小，容易滑。" },
      { answer: 2, explain: "苹果落地是重力作用。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "增大粗糙程度能增大摩擦。" },
      { answer: 1, explain: "力能改变物体的运动状态，也能改变形状。" },
      { answer: 2, explain: "力使橡皮泥变形，改变了形状。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "滚动摩擦比滑动摩擦小，轴承用来减小摩擦。" },
      { answer: 1, explain: "这样的两个力平衡，物体保持静止或匀速。" },
      { answer: 2, explain: "测力计（弹簧秤）用来测力的大小。" },
      { answer: 0, explain: "花纹增大粗糙度，增大摩擦防滑。" },
      { answer: 1, explain: "重力、摩擦力是力，颜色不是力。" }
    ]
  }
};

var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "电梯直上直下，位置变、方向不变，是平移。" },
      { answer: 2, explain: "风扇绕中心转，是旋转。" },
      { answer: 0, explain: "抽屉直线拉出推入，是平移。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 1, explain: "平移只改变位置，方向不变。" },
      { answer: 2, explain: "国旗直线上升，是平移。" },
      { answer: 0, explain: "直线滑动是平移。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: "旋转绕一个中心点或轴转动。" },
      { answer: 2, explain: "指针绕中心转，是旋转。" },
      { answer: 0, explain: "秋千绕悬挂点摆动，接近旋转。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "平移只改变位置，方向和大小不变。" },
      { answer: 2, explain: "旋转改变方向，绕中心转动。" },
      { answer: 0, explain: "车身直走是平移（车轮是旋转）。" },
      { answer: 1, explain: "瓶盖绕瓶口转，是旋转。" },
      { answer: 2, explain: "方向不变、位置变，是平移。" }
    ]
  }
};

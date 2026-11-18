var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "地球自转使各地交替朝向太阳，产生昼夜。" },
      { answer: 1, explain: "地球自转一周约24小时（一天）。" },
      { answer: 2, explain: "地球绕太阳公转一周约一年。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "地轴倾斜使各地受光不同，加上公转形成四季。" },
      { answer: 1, explain: "地球自转和公转都是自西向东。" },
      { answer: 2, explain: "地球自转造成太阳看起来东升西落。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "地球绕通过南北极的地轴自转。" },
      { answer: 1, explain: "夏季太阳高度大、昼长，获得热量多。" },
      { answer: 2, explain: "四季更替与公转和地轴倾斜有关。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "地球是两极稍扁的球体。" },
      { answer: 1, explain: "南北半球季节相反。" },
      { answer: 2, explain: "地球绕太阳的轨道是椭圆。" },
      { answer: 0, explain: "手电筒光代表太阳光，地球仪代表地球。" },
      { answer: 1, explain: "不自转则各地长期朝向或背向太阳，无昼夜交替。" }
    ]
  }
};

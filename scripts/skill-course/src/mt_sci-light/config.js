var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "光沿直线传播。" },
      { answer: 1, explain: "蜡烛自己发光是光源；月亮、镜子反射光。" },
      { answer: 2, explain: "光被挡住，在背光侧形成影子。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "影子在物体挡光后的背光侧。" },
      { answer: 1, explain: "镜面反射光成像。" },
      { answer: 2, explain: "光从空气入水发生折射，使筷子看起来弯。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "小孔成像是光沿直线传播的证据。" },
      { answer: 1, explain: "潜望镜用平面镜反射改变光路。" },
      { answer: 2, explain: "阳光经水滴折射色散形成彩虹。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "反光镜反射光，自己不发光。" },
      { answer: 1, explain: "斜射入水会发生折射，方向改变。" },
      { answer: 2, explain: "物体反射光进入眼睛，我们才看见。" },
      { answer: 0, explain: "日食是月球运行到日地之间挡住阳光。" },
      { answer: 1, explain: "三个小孔对齐能看到光，说明光沿直线传播。" }
    ]
  }
};

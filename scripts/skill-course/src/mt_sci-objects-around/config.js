var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "掂一掂或称一称才知道轻重，大小不等于轻重。" },
      { answer: 1, explain: "用手按，海绵软、石头硬。" },
      { answer: 2, explain: "玻璃能透光是透明，木板不透光。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "「红彤彤」说颜色；「软绵绵」说软硬。" },
      { answer: 1, explain: "一次只用一个标准，分完再换标准。" },
      { answer: 2, explain: "皮球圆圆的，是球形。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "干净玻璃能透光，是透明的。" },
      { answer: 1, explain: "凉热是皮肤摸出来的，属于触觉。" },
      { answer: 2, explain: "天平称量最准确，眼睛猜容易错。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "「约18厘米」有数据、够具体；「不错」太笼统。" },
      { answer: 1, explain: "轻扇少量闻，保护鼻子，不乱尝。" },
      { answer: 2, explain: "篮球、足球都是球形，可归为一类。" },
      { answer: 0, explain: "不认识的物体不能尝，观察一般不用味觉。" },
      { answer: 1, explain: "沉浮是物体在水里的表现，与轻重、密度有关。" }
    ]
  }
};

var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "直路路线是直线，属于直线运动。" },
      { answer: 1, explain: "转弯路线是弯的，是曲线运动。" },
      { answer: 2, explain: "相同时间内跑得远的更快。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "距离相同，用时越少速度越快。" },
      { answer: 1, explain: "量距离用软尺或卷尺。" },
      { answer: 2, explain: "量时间用秒表。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "说位置相对于小红，小红就是参照物。" },
      { answer: 1, explain: "秋千来回摆动，路线是弧线，属曲线运动。" },
      { answer: 2, explain: "相对参照物位置改变就是运动。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "相对车厢位置没变，是静止的；相对地面是运动的。" },
      { answer: 1, explain: "速度不变沿直线运动，是匀速直线运动。" },
      { answer: 2, explain: "20 米是跑过的距离，4 秒是所用时间。" },
      { answer: 0, explain: "只比较一个变量，其他条件相同才公平。" },
      { answer: 1, explain: "电梯沿竖直方向上下，路线是直线。" }
    ]
  }
};

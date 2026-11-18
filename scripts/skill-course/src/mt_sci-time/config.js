var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "日晷利用日影计时。" },
      { answer: 1, explain: "日晷靠太阳光，夜晚阴天无法使用。" },
      { answer: 2, explain: "水钟靠水以稳定速度流出计时。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "摆每摆动一次时间基本相同，计时更准。" },
      { answer: 1, explain: "摆长影响摆动周期，摆长一定时周期稳定。" },
      { answer: 2, explain: "水流越均匀，计时越准。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "石英钟是现代常见计时工具。" },
      { answer: 1, explain: "计时工具不断进步、精度提高。" },
      { answer: 2, explain: "分钟是时间单位。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "沙漏靠沙粒稳定流下计时。" },
      { answer: 1, explain: "秒表用于测较短时间，读到秒。" },
      { answer: 2, explain: "调节摆长可以改变摆动快慢。" },
      { answer: 0, explain: "古人靠天色、鸡鸣等估时。" },
      { answer: 1, explain: "水流稳定是水钟准确的关键。" }
    ]
  }
};

var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "温度是物体冷热程度的量度。" },
      { answer: 1, explain: "热总是从温度高的地方传向低的地方。" },
      { answer: 2, explain: "热沿金属直接传递，是传导。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "金属铜容易传热，是良导体。" },
      { answer: 1, explain: "水受热流动形成对流。" },
      { answer: 2, explain: "太空近乎真空，太阳靠辐射传热。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "橡胶不易传热，是热的不良导体。" },
      { answer: 1, explain: "热从高温物体传向低温物体。" },
      { answer: 2, explain: "木头是热的不良导体，做手柄防烫。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "温度计测温度。" },
      { answer: 1, explain: "热交换后达到中间温度。" },
      { answer: 2, explain: "保温瓶减少传导、对流、辐射，减慢热传递。" },
      { answer: 0, explain: "温差越大，热传递越快。" },
      { answer: 1, explain: "℃是温度单位，25℃是温度。" }
    ]
  }
};

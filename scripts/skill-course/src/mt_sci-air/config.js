var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "空气无色透明，看不见。" },
      { answer: 1, explain: "杯内空气占据空间，水进不去。" },
      { answer: 2, explain: "倒扣杯实验能证明空气占空间。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "空气有质量，只是很小。" },
      { answer: 1, explain: "空气微粒间有空隙，可被压缩。" },
      { answer: 2, explain: "热空气上升、冷空气补充，空气流动形成风。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "空气受热膨胀变轻，热气球就上升。" },
      { answer: 1, explain: "风吹动风车，说明空气在流动。" },
      { answer: 2, explain: "空气中的氧气供人和动物呼吸。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "太阳照射使地面升温。" },
      { answer: 1, explain: "热空气密度小会上升，冷空气下沉。" },
      { answer: 2, explain: "充气前后称重不同，证明空气有质量。" },
      { answer: 0, explain: "减排、植树能保护空气；焚烧会污染。" },
      { answer: 1, explain: "空气和水都占据空间、都有质量。" }
    ]
  }
};

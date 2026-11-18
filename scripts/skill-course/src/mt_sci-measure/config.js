var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "量长度用软尺或直尺；温度计测温，天平测轻重。" },
      { answer: 1, explain: "测温度用温度计，读数看液柱顶端。" },
      { answer: 2, explain: "温度用摄氏度表示，写作 ℃。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "千克、克是质量单位；米是长度，升是体积。" },
      { answer: 1, explain: "视线与液面凹处齐平，读数才准确。" },
      { answer: 2, explain: "力的单位是牛顿，符号 N。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "数值必须带单位，否则别人不知道是什么量。" },
      { answer: 1, explain: "mL 是毫升，体积单位。" },
      { answer: 2, explain: "多测几次取平均能减小误差，结果更可靠。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "天平测质量；温度计测温度，不测长度。" },
      { answer: 1, explain: "看液柱顶端对准的刻度读数。" },
      { answer: 2, explain: "细小的量可用累积法，多量几次求平均更准。" },
      { answer: 0, explain: "先根据对象选对工具和单位，测量才有意义。" },
      { answer: 1, explain: "量体积用量筒；量高度用尺。" }
    ]
  }
};

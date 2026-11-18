var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "气温计专门测空气温度。" },
      { answer: 1, explain: "温度用摄氏度表示，写作 ℃。" },
      { answer: 2, explain: "雨量器收集雨水，量出降雨量。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "风向是风吹来的方向，如东风从东边吹来。" },
      { answer: 1, explain: "风力描述风的强弱，分不同等级。" },
      { answer: 2, explain: "气温、降水、风力、云量都是天气要素。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "视线齐平读数才准确。" },
      { answer: 1, explain: "连续记录才能看出天气变化趋势。" },
      { answer: 2, explain: "云少、阳光足是晴天。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "天气预报靠大量观测和计算机分析。" },
      { answer: 1, explain: "晴天有阳光、通风，适合晾晒。" },
      { answer: 2, explain: "天气日历记录日期、温度、阴晴雨雪等。" },
      { answer: 0, explain: "降温要添衣保暖。" },
      { answer: 1, explain: "气温计放百叶箱，避免日晒雨淋，测得更准。" }
    ]
  }
};

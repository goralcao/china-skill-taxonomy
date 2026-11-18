var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "多种途径都能获取信息。" },
      { answer: 1, explain: "不轻信、先核实。" },
      { answer: 2, explain: "网络也要文明守规则。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "个人信息要保护，不能泄露。" },
      { answer: 1, explain: "控制时间、健康上网。" },
      { answer: 2, explain: "传谣有害，不能做。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "多方核实才能判断。" },
      { answer: 1, explain: "文明守约是要求。" },
      { answer: 2, explain: "注意休息，保护视力。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "保护自己，不单独见网友。" },
      { answer: 1, explain: "远离不良信息，及时求助。" },
      { answer: 2, explain: "学会辨别、自律。" },
      { answer: 0, explain: "水杯不是获取信息的工具。" },
      { answer: 1, explain: "善用网络助学习。" }
    ]
  }
};

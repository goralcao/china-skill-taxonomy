var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "守法是基本素养。" },
      { answer: 1, explain: "协商、调解是合法途径。" },
      { answer: 2, explain: "证据和规则是关键。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "法律面前人人平等。" },
      { answer: 1, explain: "理性依法解决。" },
      { answer: 2, explain: "都是合法途径。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "要敢于依法维权。" },
      { answer: 1, explain: "暴力报复违法。" },
      { answer: 2, explain: "证据是维权依据。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "没有法外特权。" },
      { answer: 1, explain: "协商平和高效。" },
      { answer: 2, explain: "依法办事才对。" },
      { answer: 0, explain: "知法更要守法。" },
      { answer: 1, explain: "维权是保护正当权益。" }
    ]
  }
};

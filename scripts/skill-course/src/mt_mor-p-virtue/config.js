var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "诚实守信是重要传统美德。" },
      { answer: 1, explain: "守信用是诚信的表现。" },
      { answer: 2, explain: "节约粮食是勤俭美德。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "诚实就要勇于承认错误。" },
      { answer: 1, explain: "乐于助人是美德。" },
      { answer: 2, explain: "尊敬关心长辈是孝亲。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "美德要践行和传承。" },
      { answer: 1, explain: "占便宜不是美德。" },
      { answer: 2, explain: "水资源有限，要节约。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "这句话强调说到做到。" },
      { answer: 1, explain: "美德从小事、从现在做起。" },
      { answer: 2, explain: "礼貌是尊敬长辈的表现。" },
      { answer: 0, explain: "拾金不昧是诚实美德。" },
      { answer: 1, explain: "学中做、做中学。" }
    ]
  }
};

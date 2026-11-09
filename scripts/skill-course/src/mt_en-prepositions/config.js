var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "in 表示在里面；on 是在上面且接触。" },
      { answer: 0, explain: "on 是在表面之上并且接触，书放桌面就是 on。" },
      { answer: 2, explain: "under 是正下方；near 只是附近。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "near 表示离得不远，不一定接触。" },
      { answer: 1, explain: "behind 是后面；in front of 是前面。" },
      { answer: 0, explain: "盒子里用 in，桌面上用 on，看的是里外和接触。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "on 表示在表面之上且接触。" },
      { answer: 2, explain: "on the desk、in the box，介词后面跟着名词。" },
      { answer: 1, explain: "in the box 是进盒子里面。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "under 正下方；on 是上面；behind 是后面。" },
      { answer: 0, explain: "near 只说距离近，没说里外。" },
      { answer: 2, explain: "behind 后面，in front of 前面。" },
      { answer: 0, explain: "椅子下用 under；on 是椅面上。" },
      { answer: 1, explain: "手一动、嘴一说，里外上下才分得清。" }
    ]
  }
};

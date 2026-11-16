var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "读进去", "看出来", "连一连", "中测1", "写下来", "改一处", "中测2", "评一评", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "只知形不知音，没法用音序法，就用部首查字法。" },
      { answer: 0, explain: "先找准部首，才能查检字表；部首找错后面全错。" },
      { answer: 2, explain: "河是左右结构，部首查左边的三点水。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "检字表里按「除去部首外的笔画数」排列，所以数剩下的笔画。" },
      { answer: 1, explain: "左右结构通常查左边的偏旁，如河查氵、打查扌。" },
      { answer: 0, explain: "上下结构通常查上边，如花查草字头、早查日。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "花是上下结构，查上边的草字头。" },
      { answer: 2, explain: "检字表里字后面的数字是正文页码，按它翻到正文。" },
      { answer: 1, explain: "独体字等无明显部首的，可查起笔的第一笔（横竖撇捺折）。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "检字表里同笔画的字很多，要核对确认查到的正是要找的字。" },
      { answer: 0, explain: "问是半包围结构，查外框「门」，再查里面的口。" },
      { answer: 2, explain: "知形不知音用部首法，知音不知形用音序法，看你知道什么来选。" },
      { answer: 0, explain: "检字表按除部首外的笔画排，部首那几笔不能算。" },
      { answer: 1, explain: "部首查字四步走：定部首、数余画、查检字表、翻正文，查后核对才准。" }
    ]
  }
};

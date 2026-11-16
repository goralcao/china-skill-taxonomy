var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "起疑", "取证", "连一连", "中测1", "对齐", "说清", "中测2", "换文", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "「我认为……因为……」有观点有理由，别人才听得明白。" },
      { answer: 0, explain: "认真倾听、不打断是讨论的基本礼貌，也能听清别人的想法。" },
      { answer: 2, explain: "「我认为……因为……」把观点和理由都说清楚。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "有不同意见很正常，礼貌表达、讲出理由，才是好的讨论。" },
      { answer: 1, explain: "先想好自己怎么看、为什么，发言才有内容。" },
      { answer: 0, explain: "讨论是多人交流，尊重不同意见才能互相启发。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "回应时说「我同意……」或「我还有补充……」，交流才有来有往。" },
      { answer: 2, explain: "声音响亮清楚，大家才能听清你的观点。" },
      { answer: 1, explain: "先回应别人再补充自己的看法，是很好的讨论发言。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "讨论为弄清问题、互相尊重，吵架是情绪对立，两者不同。" },
      { answer: 0, explain: "眼神交流表示尊重，也让发言更有自信。" },
      { answer: 2, explain: "轮流发言、不抢话，讨论才能有序进行。" },
      { answer: 0, explain: "「因为」后面讲出了理由，观点才站得住。" },
      { answer: 1, explain: "讨论时想清楚再说、讲出理由，听别人、尊重不同意见，礼貌回应。" }
    ]
  }
};

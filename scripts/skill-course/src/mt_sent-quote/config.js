var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "读进去", "看出来", "连一连", "中测1", "写下来", "改一处", "中测2", "评一评", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "引号把说话人一字不改的原话括起来，不是书名，也不是并列。" },
      { answer: 1, explain: "转述是替小明传话，说话的人从「我」变成第三人称「他」。" },
      { answer: 2, explain: "冒号领原话，转述不再照搬原话，改成逗号把话接下去。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "逗号、第三人称、没有引号，是替人传话；后两句都留着直述的架子。" },
      { answer: 2, explain: "引号只括原话，转述是自己的说法，去掉才对。" },
      { answer: 1, explain: "人称换成「她」，冒号改逗号，引号去掉——三处都要到位。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: "很多人只改了标点，却把「我」照抄下来，传话就传错了人。" },
      { answer: 0, explain: "冒号改逗号、去引号、「我」换「他」，三处一起动。" },
      { answer: 2, explain: "引号一出现，里面就是说话人的原话，一个字都不能替他改。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "一个是原话、一个是传话，标点和人称跟着一起变。" },
      { answer: 1, explain: "转述不再直接发问，问句要换成陈述的口吻，不能把问号照搬。" },
      { answer: 2, explain: "直述句用冒号领出原话、用引号括住，句末句号落在引号里。" },
      { answer: 1, explain: "意思不能走样，人称和标点要换到位；学声音、凑字数都帮不上忙。" },
      { answer: 0, explain: "人称、标点、读起来顺不顺，三样核完就稳了；光数引号没用。" }
    ]
  }
};

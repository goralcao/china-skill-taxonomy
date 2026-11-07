var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "看一看", "连一连", "中测1", "摆一摆", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "注音读物把拼音标在生字头上，先看它就能读准字音。" },
      { answer: 1, explain: "它扶着你读出字音；等字认熟了，就可以慢慢丢开。" },
      { answer: 2, explain: "声母韵母都一样，只有帽子不同，字也从「妈」变成「骂」。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "拼音只管音；认字形、连起来读，才真的读懂。" },
      { answer: 1, explain: "同一个音可能对应好几个字，不看字形就定不下来。" },
      { answer: 2, explain: "青、晴、请都读 qīng，得看句子在讲什么才能定。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "读准音只是第一步，字义和句子还得接着看。" },
      { answer: 1, explain: "三步走：拼音 → 字音 → 字形 → 一小句。" },
      { answer: 2, explain: "「读书」的「书」。句子在说什么，就定下是哪个字。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "先看拼音读准音，再回来看字形，比跳过或瞎猜稳。" },
      { answer: 1, explain: "拐棍是临时的扶手；字认多了，就不用一直盯着拼音。" },
      { answer: 2, explain: "qīng 是「青」还是「晴」，得看前后在讲什么。" },
      { answer: 0, explain: "能讲出意思，才算读通；光读得响不算。" },
      { answer: 1, explain: "先看拼音读准音，再看字形认出字，最后连起来读一小句。" }
    ]
  }
};

var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "读进去", "看出来", "连一连", "中测1", "写下来", "改一处", "中测2", "评一评", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "顿号只管并列词语之间的小停顿，比逗号短。" },
      { answer: 1, explain: "书名、篇名、报刊名、影视名用《》。引号是引别人说的话，两样别混。" },
      { answer: 2, explain: "两边都是能单独站住的分句，并列时用分号；顿号只分词，不管句子。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "书名用书名号，并列的书名号之间不加顿号，句末用句号收住。" },
      { answer: 2, explain: "顿号最短，只分并列的词；逗号管一句话中间的停顿，比它长一拍。" },
      { answer: 1, explain: "分号分隔的是并列分句，不是词，也不是书名。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: "引号管引用和特殊含义，书名有专门的书名号，不能互换。" },
      { answer: 0, explain: "三个「……的」是并列的词语，用顿号停半拍就够。" },
      { answer: 2, explain: "「桃、李、杏」是并列的词，中间只能用顿号；用分号就把停顿撑大了。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "顿号→并列的词，分号→并列的分句，书名号→书名篇名，各管各的。" },
      { answer: 1, explain: "并列的书名号之间不加顿号，这是最容易翻车的一处。" },
      { answer: 2, explain: "三个都是能站住的分句，并列时用分号；用顿号太小，书名号更是用错了地方。" },
      { answer: 1, explain: "书名号专管作品名，不管引话，也不管并列词。" },
      { answer: 0, explain: "先分清楚关系再落笔，比死记符号的位置稳得多。" }
    ]
  }
};

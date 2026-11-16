var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "读进去", "看出来", "连一连", "中测1", "写下来", "改一处", "中测2", "评一评", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "陈述一件事情、话说完了，句末用句号。" },
      { answer: 0, explain: "「吗」表示提问，句末要用问号。" },
      { answer: 2, explain: "逗号用在句子中间，表示停顿；句号才表示话说完。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "「真……啊」带赞叹语气，用感叹号最能表达强烈感情。" },
      { answer: 1, explain: "问号用于疑问句、要人回答；感叹号用于感叹、加强语气。" },
      { answer: 0, explain: "这是一个完整的陈述句，意思说完，句末该用句号。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "「你叫什么名字」在提问，句末用问号；另两句是陈述句。" },
      { answer: 2, explain: "感叹号用来表达强烈感情，如高兴、惊讶、赞叹，不能滥用。" },
      { answer: 1, explain: "「下雨了」后停顿一下用逗号，「快回家吧」带催促语气用感叹号。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "加标点要先读出语气：是陈述、提问还是感叹，再选符号。" },
      { answer: 0, explain: "表示惊讶、赞叹时，「啊」后面常用感叹号，如「啊！下雪了」。" },
      { answer: 2, explain: "句中停顿、意思未完用逗号，等整句说完再用句号。" },
      { answer: 0, explain: "「你好吗」是问句用问号，「我很好」是陈述用句号。" },
      { answer: 1, explain: "标点跟着语气走：读完想想是陈述、提问还是感叹，选对再写。" }
    ]
  }
};

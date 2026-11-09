var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "I 固定配 am，这是唯一的一组。" },
      { answer: 0, explain: "you 无论指一个人还是几个人，都用 are。" },
      { answer: 2, explain: "第三人称单数 he、she、it 都用 is。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "they 是复数，配 are。" },
      { answer: 1, explain: "The books are new. 复数主语配 are。" },
      { answer: 0, explain: "主语是复数，be 动词和名词都得跟着变。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "单数第三人称用 is：He is my father." },
      { answer: 2, explain: "book → books，cat → cats，一般加 -s。" },
      { answer: 1, explain: "a 只配单数可数名词；two books 前不加 a。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "I'm 是 I am 的缩写，撇号别漏。" },
      { answer: 0, explain: "you 固定配 are：You are my friend." },
      { answer: 2, explain: "it 指一个，属第三人称单数，用 is。" },
      { answer: 0, explain: "a 只跟单数；two 已经说明数量，不加 a。" },
      { answer: 1, explain: "主语和 be 动词要对上，放进句子才看得出来。" }
    ]
  }
};

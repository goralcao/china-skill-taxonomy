var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "I 是说「我」这个人；my 是「我的」，后面要接东西。" },
      { answer: 0, explain: "he 指男性，she 指女性，it 常指物或动物。" },
      { answer: 2, explain: "不明确性别时，物和动物常用 it。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "my 表示所属；I 是「我」这个人。" },
      { answer: 1, explain: "she 指女性「她」，he 指男性「他」。" },
      { answer: 0, explain: "my 是物主代词，说明「谁的」。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "I 作主语说自己，my 后面必须接名词。" },
      { answer: 2, explain: "I am + 名字；my 后面不能直接跟 am。" },
      { answer: 1, explain: "they 是复数「他们 / 她们 / 它们」。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "we 包含说话人自己，意思是「我们」。" },
      { answer: 0, explain: "his 跟着男性走：his book 是他的书。" },
      { answer: 2, explain: "your 是「你的」，my 是「我的」，his 是「他的」。" },
      { answer: 0, explain: "妈妈是女性用 she；my 说明书「我的」。" },
      { answer: 1, explain: "代词放进句子、对着人和物说，才分得清谁是谁。" }
    ]
  }
};

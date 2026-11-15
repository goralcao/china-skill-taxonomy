var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "抄写要把字母放进正确的格子，不能乱占格。" },
      { answer: 0, explain: "英语词与词之间空格分开，不连写。" },
      { answer: 2, explain: "英语句子首字母必须大写。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "陈述句以句点结束，不能漏标点。" },
      { answer: 1, explain: "先看清楚再动笔，书空和描红帮助定型。" },
      { answer: 0, explain: "i 的点在上格，主体在中格。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "c 无辫无尾，只占中格。" },
      { answer: 2, explain: "先看懂「谁 + 是 + 什么」的句式，再替换内容。" },
      { answer: 1, explain: "书写规范直接影响以后作文和连写速度。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "词间距匀称才能一眼看清每个词。" },
      { answer: 0, explain: "首字母大写是硬规则，错了句子就不规范。" },
      { answer: 2, explain: "标点是句子的收尾，漏了句子就不完整。" },
      { answer: 0, explain: "抄写练规范，仿写练句式迁移。" },
      { answer: 1, explain: "逐字核对找出出格和错格的那一处，比机械抄有用。" }
    ]
  }
};

var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "Is he Tom? 就是把 is 提到最前面。" },
      { answer: 0, explain: "问 you 答 I；Yes 后面不能跟 not。" },
      { answer: 2, explain: "No 后面要有 not，前后必须一致。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "Yes 表肯定、No 表否定，两者不能混在一句里。" },
      { answer: 1, explain: "Do 开头的问句以后才学；这里把 be 提前就行。" },
      { answer: 0, explain: "问句末用问号，写下来别漏。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "一般疑问句问「是不是」，能用 Yes / No 回答。" },
      { answer: 2, explain: "主语 she 要照着回答，Yes 后不接 not。" },
      { answer: 1, explain: "把 is 提到主语 he 前面，其余照抄。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "能，这正是它叫「一般」疑问句的原因。" },
      { answer: 0, explain: "they 是复数，所以 be 动词用 are。" },
      { answer: 2, explain: "not 把句子变成否定，和 No 一起用。" },
      { answer: 0, explain: "这是带疑问词的特殊问句，要答内容，不能只说 Yes / No。" },
      { answer: 1, explain: "一问一答才看得出前后一致不一致。" }
    ]
  }
};

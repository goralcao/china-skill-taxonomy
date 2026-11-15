var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "先猜保持阅读连贯，再查工具验证，记得更牢。" },
      { answer: 0, explain: "词典是验证和补充，不是替我们猜、替我们读。" },
      { answer: 2, explain: "纠错本集中记易错点，定期回看最见效。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "recording 用来模仿发音、练listen and repeat。" },
      { answer: 1, explain: "词卡便于零散时间反复认、自我检测。" },
      { answer: 0, explain: "导图把相关词串起来，成组记更清楚。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "预习带问题进课堂，复习按遗忘规律巩固。" },
      { answer: 2, explain: "合作提供真实的听说来回，还能互相挑错。" },
      { answer: 1, explain: "小目标具体可坚持，比贪多突击更有效。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "没有复习，新词很快遗忘，要按节奏回看。" },
      { answer: 0, explain: "及时纠错才能把薄弱点补上，否则反复卡在同一处。" },
      { answer: 2, explain: "图提供情境线索，配合上下文帮猜词。" },
      { answer: 0, explain: "重听、对照、求助，都是主动调控的策略。" },
      { answer: 1, explain: "策略是按需选资源、定计划、回头看效果并调整。" }
    ]
  }
};

var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "What 问事物或内容，Who 问人，Where 问地点。" },
      { answer: 0, explain: "Who 问人的身份，回答常是 He is ...。" },
      { answer: 2, explain: "Where 问地点，回答常带 on / in / under。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "How old are you? 问几岁；How many 问数量。" },
      { answer: 1, explain: "How many books? 问有多少本。" },
      { answer: 0, explain: "What is your name? 疑问词在最前面。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "它问的是具体信息，得说出名字、地点或数量。" },
      { answer: 2, explain: "What is it? 问「它是什么」。" },
      { answer: 1, explain: "Who is he? 问「他是谁」。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "Where is my book? 问「书在哪儿」。" },
      { answer: 0, explain: "问名字要答出名字，不能用 Yes / No。" },
      { answer: 2, explain: "Where is my book? 里 is 不能省。" },
      { answer: 0, explain: "问「他是谁」要说出身份，别只回 Yes。" },
      { answer: 1, explain: "疑问词和答句要对得上，才算问到了想问的。" }
    ]
  }
};

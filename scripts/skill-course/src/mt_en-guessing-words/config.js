var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "先借图和上下文推断，实在猜不出再查，读得更顺。" },
      { answer: 0, explain: "but 是转折信号，前后常是反义或对比，可借它猜词。" },
      { answer: 2, explain: "because 引出原因，帮我们推断前面那件事为什么发生。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "such as、like 引出例子，从例子能反推生词属于哪一类。" },
      { answer: 1, explain: "放回原句验证讲得通，猜错能及时发现。" },
      { answer: 0, explain: "but 表转折，happy 的反面就是 sad「难过的」。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "插图给情境，配合句子就能推出生词大概意思。" },
      { answer: 2, explain: "such as 后面举了苹果香蕉，可反推 fruit 是水果。" },
      { answer: 1, explain: "unhappy = 不高兴，un- 常表「不/相反」，可借构词猜义。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "脱离上下文容易断章取义，转折、因果线索都用不上。" },
      { answer: 0, explain: "先借已知词和线索抓大意，个别词不影响理解可先放。" },
      { answer: 2, explain: "前后的同义、反义、举例能圈出词义范围。" },
      { answer: 0, explain: "目的是保持阅读连贯，逐步养成独立理解的能力。" },
      { answer: 1, explain: "在真实短文里练「找线索—猜—验证」，策略才用得上。" }
    ]
  }
};

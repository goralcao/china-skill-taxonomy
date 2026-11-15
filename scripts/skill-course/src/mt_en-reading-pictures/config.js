var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "先看懂画面内容和动作，再去找相符的句子。" },
      { answer: 0, explain: "猫 cat、在桌上 on the desk；狗和苹果都不在图里。" },
      { answer: 2, explain: "图给情境，先整体感知再读字。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "three=3、red=红、apples=苹果，和图一致。" },
      { answer: 1, explain: "配图题看图说话，句子必须和图对得上。" },
      { answer: 0, explain: "情境让生词有了着落，不靠硬翻。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "boy 男孩、running 跑；女孩唱歌、书都不在图里。" },
      { answer: 2, explain: "谁、做什么、对象，图和句都要抓这三样。" },
      { answer: 1, explain: "大意是图串起来的事件，不是单幅细节。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "yellow 黄、flower 花；苹果和猫不在图里。" },
      { answer: 0, explain: "只看一个词容易被干扰项带偏，要顾全图。" },
      { answer: 2, explain: "先看全场，再抠细节，最后回看确认。" },
      { answer: 0, explain: "句中所指的人、物、动作都能在图里找到。" },
      { answer: 1, explain: "课标一级要求能借助图画读懂简单材料，读图越多越会。" }
    ]
  }
};

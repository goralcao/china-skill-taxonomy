var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "起疑", "取证", "连一连", "中测1", "对齐", "说清", "中测2", "换文", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "默读是不出声地看，用眼睛和大脑，不出声、不指读。" },
      { answer: 0, explain: "朗读要出声，默读不出声，这是最明显的区别。" },
      { answer: 2, explain: "指读会限制速度，默读要一眼看词组、句子，不用手指。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "默读不出声，不打扰别人、速度快、便于思考；练发音是朗读的好处。" },
      { answer: 1, explain: "发现走神要及时拉回，边读边想，才读得进去。" },
      { answer: 0, explain: "默读要理解内容，想讲了什么、关键是什么，才是有效阅读。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "安静的环境有助于集中注意，读得更专注。" },
      { answer: 2, explain: "合上书复述，能检验是否真的读懂，比匆匆翻页有效。" },
      { answer: 1, explain: "只求快容易囫囵吞枣，要在读懂的基础上提高速度。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "先联系上下文猜，再不懂可做个记号，读后查问。" },
      { answer: 0, explain: "一眼看一个词组或短句，比逐字读更快也更顺。" },
      { answer: 2, explain: "默读要求专注、边读边想，能训练注意力和理解力。" },
      { answer: 0, explain: "默读不出声，但要边读边思考，不是随意翻看。" },
      { answer: 1, explain: "默读要做到不出声、不指读，边读边想，读完能说清内容。" }
    ]
  }
};

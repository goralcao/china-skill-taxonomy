var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "起意", "搭骨架", "连一连", "中测1", "起草", "改", "中测2", "出刊", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "先整体看图，弄清画的是什么事，再动笔，才不会写偏。" },
      { answer: 0, explain: "看图写话抓什么时候、在哪、谁、干什么这四样，句子才完整。" },
      { answer: 2, explain: "有地点（公园）、人物（小朋友）、事（放风筝），缺什么时候。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "低年级写话先把句子写通顺、意思说清，不必追求长短。" },
      { answer: 1, explain: "春天星期天（时间）、公园（地点）、小明（人物）、放风筝（事），四样齐全。" },
      { answer: 0, explain: "人物的动作、表情能告诉我们他在干什么、心情怎样。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "写完回来看图核对，缺的要素补上，句子更完整。" },
      { answer: 2, explain: "这句有时间、人物、地点、事，完整清楚；另两句太笼统。" },
      { answer: 1, explain: "写出图中下雨的情景和人物打伞的动作，才符合图意。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "按一定的观察顺序写，从头到尾有条理，读的人才明白。" },
      { answer: 0, explain: "用动作、表情把「开心」写出来，比空说更具体。" },
      { answer: 2, explain: "多幅图要看出事情的发展变化，写出先后。" },
      { answer: 0, explain: "「什么时候」回答时间，是四要素之一。" },
      { answer: 1, explain: "看图写话：先整体看懂图，抓时间地点人物事，写通顺，写完对照图检查。" }
    ]
  }
};

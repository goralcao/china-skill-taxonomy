var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "起疑", "取证", "连一连", "中测1", "对齐", "说清", "中测2", "换文", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "先看这个词前后的句子，联系上下文往往能猜出大意。" },
      { answer: 0, explain: "「颤巍巍」形容抖动摇晃，想想老人走路的样子就懂了。" },
      { answer: 2, explain: "「绿油油」形容绿色浓而有光泽，像绿油油的麦田。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "用熟悉的近义词替换，能帮助理解新词的大意。" },
      { answer: 1, explain: "上下文就是词前后的句子，能提供理解线索。" },
      { answer: 0, explain: "字典里的释义能帮我们准确理解词义。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "把理解的意思放回原句，读得通顺合理，才算真懂。" },
      { answer: 2, explain: "很多词和生活有关，想想见过的情景就明白了。" },
      { answer: 1, explain: "跳过不懂的词等于没读懂；要主动想办法弄懂。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "这是夸张说法，形容高兴极了，不是真量高度。" },
      { answer: 0, explain: "先猜、再查、最后验，几种方法配合，理解更准确。" },
      { answer: 2, explain: "弄懂词语是为了读懂整句话、整篇文章。" },
      { answer: 0, explain: "猜是初步理解，查字典能确认准确意思，避免理解错。" },
      { answer: 1, explain: "理解词语先联系上下文猜，再结合生活或查字典，最后放回句子验一验。" }
    ]
  }
};

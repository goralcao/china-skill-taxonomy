var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "读进去", "看出来", "连一连", "中测1", "写下来", "改一处", "中测2", "评一评", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "把月亮比作小船，用了「像」，是比喻。" },
      { answer: 0, explain: "月亮是本体，小船是喻体；比喻是用相似的事物打比方。" },
      { answer: 2, explain: "把花当人写，会点头微笑，是拟人。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "拟人是赋予物人的动作、情感、语言，让物活起来。" },
      { answer: 1, explain: "把脸比作红苹果，是比喻；另两句是普通陈述。" },
      { answer: 0, explain: "同类相比（人和人像）不是比喻；比喻是不同类事物打比方。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "把小溪当人写，会唱歌、会跑，是拟人。" },
      { answer: 2, explain: "比喻重在「像什么」，拟人重在「把物当人」。" },
      { answer: 1, explain: "喻体是绿伞，荷叶和绿伞形状相似，是比喻。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "修辞能把事物写得具体可感、活灵活现，增强表达效果。" },
      { answer: 0, explain: "「抚摸」是人的动作，把风当人写，是拟人。" },
      { answer: 2, explain: "比喻要抓住相似点，如月亮和小船都弯弯的。" },
      { answer: 0, explain: "「偷偷探出头」把草当人写，是拟人；「像毯子」是把草比作毯子，是比喻。" },
      { answer: 1, explain: "读句子先想用了什么招，再说清把什么比作什么或把什么当人写，最后讲好处。" }
    ]
  }
};

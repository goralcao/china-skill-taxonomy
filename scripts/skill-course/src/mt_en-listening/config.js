var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "two=2、books=书，拿出两本书；一支笔不是书。" },
      { answer: 0, explain: "touch 是摸，nose 是鼻子；摸眼睛该说 Touch your eye。" },
      { answer: 2, explain: "three 是数字、red 是颜色，抓这两类就能做对反应。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "How many 问几个，答数字；问颜色用 What colour。" },
      { answer: 1, explain: "open 是打开；合上是 close，收起是 put away。" },
      { answer: 0, explain: "听懂大意靠关键词，不必逐词翻译。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "close 是关，door 是门；开门是 open the door。" },
      { answer: 2, explain: "one=1、blue=蓝、bag=书包；数量和颜色都要对。" },
      { answer: 1, explain: "听力是声音输入，抓主信息就能反应，不靠翻译。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "stand up 是起立；坐下是 sit down。" },
      { answer: 0, explain: "eight 是 8，用数量反应；e 是字母、ear 是耳朵。" },
      { answer: 2, explain: "point to 是指向；擦是 clean / erase。" },
      { answer: 0, explain: "听靠耳朵接收，听完立刻做；读靠眼睛，可以慢慢看。" },
      { answer: 1, explain: "课标一级要求在听做、听说的情境里练，不是孤立背词。" }
    ]
  }
};

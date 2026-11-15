var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "起疑", "取证", "连一连", "中测1", "对齐", "说清", "中测2", "换文", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "提问可以从写了什么、怎么写、想到什么多个角度展开，角度越丰富读得越深。" },
      { answer: 0, explain: "它问的是文章讲了什么、两者怎么关联，属于内容角度。" },
      { answer: 2, explain: "它关心的是「怎么写、为什么这样写」，属于写法角度。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "「靠嘴和耳朵探路」文中写明；后两个要联系生活、发挥想象。" },
      { answer: 1, explain: "启发类问题没有现成答案，要联系自己的生活去想。" },
      { answer: 0, explain: "问题像路标，让阅读有目标，容易找到与问题相关的重点句。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "好问题建立在读懂的基础上；难和多的前提都是先理解文章。" },
      { answer: 2, explain: "这类问题要综合文中线索和生活经验去想，答案要有依据，不能瞎猜。" },
      { answer: 1, explain: "回答问题、再追问，能把理解往前推一步，提问才有价值。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "数多少字跟理解无关；写法和启发都能把阅读引向深入。" },
      { answer: 0, explain: "有依据的回答才可靠；回到原文找支撑，是提问策略的关键一步。" },
      { answer: 2, explain: "不同角度的问题都有意义，筛出有价值的深入讨论，才是会提问。" },
      { answer: 0, explain: "问「为什么这样拟题」关心的是写法，不是字词意思，也不是读后启发。" },
      { answer: 1, explain: "提问是为了把文章读深，不是为了把老师问倒。" }
    ]
  }
};

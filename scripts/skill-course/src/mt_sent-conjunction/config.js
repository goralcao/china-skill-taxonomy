var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "读进去", "看出来", "连一连", "中测1", "写下来", "改一处", "中测2", "评一评", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "「因为」领出原因，「所以」接住结果，合起来是因果。" },
      { answer: 1, explain: "「虽然…但是…」前后意思拐了个弯，是转折。" },
      { answer: 2, explain: "「如果」先假设一种情况，「就」说那时候怎么办。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "因果配因果、转折配转折，不能把两对词交叉混搭。" },
      { answer: 2, explain: "后半句比前半句更进一层，是递进。" },
      { answer: 1, explain: "先判断关系再挑成对的词；字数和逗号都不决定关联词。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: "换成「但是」就把递进说成了转折，关系判断错了。" },
      { answer: 0, explain: "两件事同时发生，是并列关系。" },
      { answer: 2, explain: "「因为…但是…」把因果和转折硬凑在一起，是最常见的混搭。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "一个领前半、一个接后半，配成对才把关系说完整。" },
      { answer: 1, explain: "先否定一种说法，再给出真正的情况，属于选择并纠正。" },
      { answer: 2, explain: "「努力练习」是原因，「进步很快」是结果，用因果那一对。" },
      { answer: 1, explain: "关系判断对、搭配对，比堆多少关联词重要得多。" },
      { answer: 0, explain: "关系对、读得顺，句子就站得住；光数个数没用。" }
    ]
  }
};

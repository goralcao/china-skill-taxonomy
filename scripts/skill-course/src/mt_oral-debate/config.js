var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "起疑", "取证", "连一连", "中测1", "对齐", "说清", "中测2", "换文", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "先把观点亮清楚，别人才能跟上你的论证。" },
      { answer: 0, explain: "支撑观点的理由要讲清作用和依据，不能凭感觉。" },
      { answer: 2, explain: "反驳要落到对方哪一句站不住，笼统否定没有说服力。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "先认再转、就事论事，既讲理又不伤人。" },
      { answer: 1, explain: "听懂对方的论证，才能有针对性地回应，而不是自说自话。" },
      { answer: 0, explain: "跑题会让讨论失去焦点，反驳要紧扣原话题。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "有理靠观点和依据，不靠辞藻和嗓门。" },
      { answer: 2, explain: "大方从容、条理清晰、与听众有交流，表达才有效。" },
      { answer: 1, explain: "针对证据的真实性提出质疑，并给出更可靠的依据，是有力的反驳。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "先想清楚，开口才有条理、不跑题。" },
      { answer: 0, explain: "就事论事是讨论，攻击对方人格则是失礼且无效的。" },
      { answer: 2, explain: "梳理和比较理由，能把讨论提升为真正的理解。" },
      { answer: 0, explain: "这个句式把观点与理由一起亮出，表达清晰有力。" },
      { answer: 1, explain: "辩论赢的是道理，不是嗓门。" }
    ]
  }
};

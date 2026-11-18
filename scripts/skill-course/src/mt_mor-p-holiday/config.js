var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "春节是农历新年，辞旧迎新。" },
      { answer: 1, explain: "端午吃粽子、赛龙舟，纪念屈原。" },
      { answer: 2, explain: "中秋赏月吃月饼，象征团圆。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "清明扫墓祭祖、踏青。" },
      { answer: 1, explain: "重阳节登高、敬老。" },
      { answer: 2, explain: "节日寄托情感、传承文化。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "安全最重要，远离危险。" },
      { answer: 1, explain: "文明节俭过节更值得提倡。" },
      { answer: 2, explain: "拜年表达祝愿，是亲情礼貌。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "赏月吃月饼是中秋习俗。" },
      { answer: 1, explain: "扫墓寄托对先人的思念。" },
      { answer: 2, explain: "有计划地休息和学习。" },
      { answer: 0, explain: "端午是传统节日，儿童节是现代节日。" },
      { answer: 1, explain: "传承节日文化是我们的责任。" }
    ]
  }
};

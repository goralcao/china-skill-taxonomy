var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "科技让生活更美好。" },
      { answer: 1, explain: "联合国是重要的国际组织。" },
      { answer: 2, explain: "国际组织促进和平合作。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "气候变化是全球性挑战。" },
      { answer: 1, explain: "全球问题需要国际合作。" },
      { answer: 2, explain: "中国展现大国担当。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "人类命运相连。" },
      { answer: 1, explain: "合作共赢利人利己。" },
      { answer: 2, explain: "减贫需全球努力。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "关键在于善用科技。" },
      { answer: 1, explain: "战争带来灾难，要珍爱和平。" },
      { answer: 2, explain: "要有全球视野。" },
      { answer: 0, explain: "和平是共同责任。" },
      { answer: 1, explain: "共同努力创造美好世界。" }
    ]
  }
};

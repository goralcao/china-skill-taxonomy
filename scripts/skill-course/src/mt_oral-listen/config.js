var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "起疑", "取证", "连一连", "中测1", "对齐", "说清", "中测2", "换文", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "听故事抓谁、做什么、先怎样后怎样，才能记住并讲出来。" },
      { answer: 0, explain: "按顺序的连接词帮听众跟上故事发展。" },
      { answer: 2, explain: "认真听是基本礼貌，也能听清内容，听完再提问。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "声音响亮清楚，听众才听得见、听得懂。" },
      { answer: 1, explain: "听故事先抓人物，龟兔赛跑讲的是乌龟和兔子。" },
      { answer: 0, explain: "听后可以讲讲记住了什么、问问没听懂的地方，是互动的好习惯。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "抓人物和事件顺序，比逐字背更实用，也更容易讲。" },
      { answer: 2, explain: "眼神交流表示尊重，也让自己更自信、讲得更清楚。" },
      { answer: 1, explain: "有顺序、有细节的讲述最清楚，跳着说或只说结果别人听不懂。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "等对方讲完再问，既不打断，也能把没听清的弄清楚。" },
      { answer: 0, explain: "复述是理解后用自己话讲，不必逐字背。" },
      { answer: 2, explain: "先在脑子里理出人物和顺序，讲起来才不乱。" },
      { answer: 0, explain: "「先、然后、最后」是表示顺序的词；水果名、颜色名都不能表顺序。" },
      { answer: 1, explain: "听故事抓人物事情顺序，讲故事按顺序、声音响亮、看着对方。" }
    ]
  }
};

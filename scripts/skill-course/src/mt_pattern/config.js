var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "按红黄交替，红后面是黄。" },
      { answer: 2, explain: "每次多 1，4 后面是 5。" },
      { answer: 0, explain: "按○△交替，○后面是△。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 1, explain: "每次多 2，8 后面是 10。" },
      { answer: 2, explain: "一组是「红红蓝」，新一组开头是红。" },
      { answer: 0, explain: "每次多 5，15 后面是 20。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: "每次多 2（单数），7 后面是 9。" },
      { answer: 2, explain: "一组是「△△□」，新一组开头是△。" },
      { answer: 0, explain: "每次少 1，7 后面是 6。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "一组是「红黄蓝」，新一组开头是红。" },
      { answer: 2, explain: "每次多 3，12 后面是 15。" },
      { answer: 0, explain: "一组是「○△△」，新一组开头是○。" },
      { answer: 1, explain: "每次少 2，14 后面是 12。" },
      { answer: 2, explain: "找出反复出现的那一组，就能接着排。" }
    ]
  }
};

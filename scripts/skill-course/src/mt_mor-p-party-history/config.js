var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "中国共产党于1921年成立。" },
      { answer: 1, explain: "长征是艰苦卓绝的伟大壮举。" },
      { answer: 2, explain: "1949年新中国成立。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "这是被历史证明的真理。" },
      { answer: 1, explain: "党领导人民坚持抗战，赢得胜利。" },
      { answer: 2, explain: "新中国人民成为国家主人。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "长征精神是宝贵财富。" },
      { answer: 1, explain: "以史实为依据，铭记历史。" },
      { answer: 2, explain: "复兴需要持续奋斗。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "长征是真实而伟大的历史事件。" },
      { answer: 1, explain: "把爱国情化为实际行动。" },
      { answer: 2, explain: "学史明理、励志前行。" },
      { answer: 0, explain: "历史必须尊重事实，不能编造。" },
      { answer: 1, explain: "实现民族复兴是共同梦想。" }
    ]
  }
};

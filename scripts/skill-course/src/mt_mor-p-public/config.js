var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "公园是大家共用的公共空间。" },
      { answer: 1, explain: "路灯为公众服务，是公共设施。" },
      { answer: 2, explain: "公共场所需文明有礼。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "守秩序人人有份。" },
      { answer: 1, explain: "公共利益需要每个人维护。" },
      { answer: 2, explain: "公共场所要安静。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "及时反映，爱护公物。" },
      { answer: 1, explain: "垃圾入桶，保持整洁。" },
      { answer: 2, explain: "让座是文明有礼。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "喧哗影响别人，应避免。" },
      { answer: 1, explain: "公共设施为公众提供便利。" },
      { answer: 2, explain: "自家沙发是私人物品。" },
      { answer: 0, explain: "爱护设施人人有责。" },
      { answer: 1, explain: "大家文明，公共生活更美好。" }
    ]
  }
};

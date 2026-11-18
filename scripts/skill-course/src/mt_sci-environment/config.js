var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "废气排入空气造成大气污染。" },
      { answer: 1, explain: "塑料难降解，造成白色污染。" },
      { answer: 2, explain: "污水污染水体，危害水生生物和人类。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "分类回收减少污染；焚烧产生有害气体。" },
      { answer: 1, explain: "绿色出行少排放、更环保。" },
      { answer: 2, explain: "过强噪声影响听力与健康，是污染。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "自带购物袋、少用一次性塑料能减少污染。" },
      { answer: 1, explain: "过量使用会污染土壤和水体。" },
      { answer: 2, explain: "减量优先，再分类回收、无害处理。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "每个人的行动汇聚起来影响很大。" },
      { answer: 1, explain: "垃圾分类是环保行为，不是污染。" },
      { answer: 2, explain: "环保为了人类与自然是可持续、和谐共处。" },
      { answer: 0, explain: "应及时反映，维护环境。" },
      { answer: 1, explain: "节电和绿色出行能减少碳排放。" }
    ]
  }
};

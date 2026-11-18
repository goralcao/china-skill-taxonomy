var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "有中国国籍就是中国公民。" },
      { answer: 1, explain: "我国首都是北京。" },
      { answer: 2, explain: "国旗是重要的国家标识。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "奏国歌要庄重。" },
      { answer: 1, explain: "公民依法享有基本权利。" },
      { answer: 2, explain: "服兵役是公民义务之一。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "权利义务相统一。" },
      { answer: 1, explain: "三地都是中国领土不可分割的一部分。" },
      { answer: 2, explain: "理性自豪源于认同。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "商标不是国家标识。" },
      { answer: 1, explain: "维护统一是公民责任。" },
      { answer: 2, explain: "爱国守法是公民本分。" },
      { answer: 0, explain: "国籍确定公民身份。" },
      { answer: 1, explain: "权利义务相统一。" }
    ]
  }
};

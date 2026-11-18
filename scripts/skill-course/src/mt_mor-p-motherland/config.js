var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "我国全称是中华人民共和国。" },
      { answer: 1, explain: "我国首都是北京。" },
      { answer: 2, explain: "五星红旗是我国国旗。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "我国国歌是《义勇军进行曲》。" },
      { answer: 1, explain: "十月一日是国庆节。" },
      { answer: 2, explain: "要庄重肃立，表达敬意。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "香港、澳门、台湾都是中国不可分割的一部分。" },
      { answer: 1, explain: "我国是统一的多民族国家，有56个民族。" },
      { answer: 2, explain: "尊重国旗、努力成长是爱国。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "热爱祖国山河，保护环境。" },
      { answer: 1, explain: "民族团结，亲如一家。" },
      { answer: 2, explain: "为祖国繁荣强大而自豪。" },
      { answer: 0, explain: "认真学习、守纪律、爱集体都是爱国。" },
      { answer: 1, explain: "祖国是全体中国人民共同的家。" }
    ]
  }
};

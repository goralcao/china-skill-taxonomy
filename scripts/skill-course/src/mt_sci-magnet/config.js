var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "磁铁能吸铁制品，铁钉是铁做的。" },
      { answer: 1, explain: "每块磁铁都有南极S和北极N两个磁极。" },
      { answer: 2, explain: "同名磁极相斥，两个北极靠近会推开。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "异名磁极相吸，北极和南极会吸在一起。" },
      { answer: 1, explain: "磁铁不吸铝；铁夹、钢针能被吸住。" },
      { answer: 2, explain: "磁铁两端磁性最强，叫磁极。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "指南针的磁针是磁铁，受地磁作用指南北。" },
      { answer: 1, explain: "能被磁铁吸，说明含铁、钴或镍。" },
      { answer: 2, explain: "磁铁断了，每半块仍有南北两极。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "冰箱贴、指南针用到磁铁；风扇叶片一般不靠磁铁吸。" },
      { answer: 1, explain: "磁铁会损坏磁卡、影响电器，也不能入口。" },
      { answer: 2, explain: "磁力可以隔着一段距离发生作用。" },
      { answer: 0, explain: "同名磁极相斥可让磁铁相互排斥而悬浮。" },
      { answer: 1, explain: "用磁铁吸一吸就能初步判断是不是铁制品。" }
    ]
  }
};

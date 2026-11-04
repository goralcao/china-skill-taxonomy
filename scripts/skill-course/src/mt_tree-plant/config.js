var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "20米小路", "三种栽法", "连一连", "中测1", "围一圈", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "10 ÷ 2 = 5 段。选 A 少算了一段；选 C 把段数当成了剪的次数加 1。" },
      { answer: 1, explain: "剪一刀多一段，3 + 1 = 4 段。选 A 以为一刀一段。" },
      { answer: 0, explain: "20 ÷ 5 = 4 段，两头都栽树比段数多一棵，是 5 棵。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "20 ÷ 5 = 4。选 B 把棵数当成了段数；选 C 少算了一段。" },
      { answer: 1, explain: "两端都栽要加 1，得 5 棵。选 A 漏了末端那一棵；选 C 是两端都不栽的情况。" },
      { answer: 2, explain: "两头都空着，4 − 1 = 3 棵。选 A 是两端都栽；选 B 是只栽一端。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "24 ÷ 4 = 6 段，围成圈棵数 = 间隔数 = 6。选 B 多加了 1；选 C 多减了 1。" },
      { answer: 0, explain: "段数 − 1 = 次数，4 − 1 = 3。选 B 以为一段一刀。" },
      { answer: 1, explain: "楼层数 − 1 = 层数，5 − 1 = 4。选 A 把楼层当成了楼梯层数。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "两头各多一棵。选 B 是只栽一端；选 C 是两端都不栽。" },
      { answer: 1, explain: "30 ÷ 6 = 5 段，5 + 1 = 6 棵。选 A 忘加 1；选 C 多加了一棵。" },
      { answer: 0, explain: "40 ÷ 8 = 5 段，只栽一端不加不减 = 5 棵。选 B 是两端都栽；选 C 是两端都不栽。" },
      { answer: 1, explain: "36 ÷ 6 = 6 段，围成圈 = 6 盆。选 C 多加了一盆。" },
      { answer: 2, explain: "一侧：20 ÷ 4 + 1 = 6 个；两边都挂：6 × 2 = 12 个。选 A 只算了一侧；选 B 忘了加两端的。" }
    ]
  }
};

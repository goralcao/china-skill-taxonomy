var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "4×3=12，13−12=1，装满 3 袋还剩 1 个。" },
      { answer: 2, explain: "2×4=8，9−8=1，余 1。" },
      { answer: 0, explain: "余数必须比除数小，否则还能再分一份。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 1, explain: "5×3=15，17−15=2，是 3 余 2。" },
      { answer: 2, explain: "6×3=18，23−18=5，是 3 余 5。" },
      { answer: 0, explain: "4×3=12，14−12=2，是 3 余 2。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: "余数必须小于除数。7＞6、6=6 都不对，只有 1＜6 对。" },
      { answer: 2, explain: "5×5=25，26−25=1，是 5 余 1。" },
      { answer: 0, explain: "除数是 6，余数最大是 5，比除数小 1。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "6×4=24，29−24=5，是 4 余 5。" },
      { answer: 2, explain: "3×6=18，20−18=2，是 6 余 2。" },
      { answer: 0, explain: "余数一定比除数小，最大是除数−1。" },
      { answer: 1, explain: "5×4=20，22−20=2，装满 4 袋剩 2 个。" },
      { answer: 2, explain: "7×4=28，31−28=3，是 4 余 3。" }
    ]
  }
};

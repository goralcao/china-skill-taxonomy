var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 2, explain: "个位对个位、十位对十位，相同数位对齐才能相加减。" },
      { answer: 0, explain: "个位 8+7=15，写 5 进 1。" },
      { answer: 1, explain: "个位 2 减 9 不够，借 1 当 10，12−9=3。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "个位 6+7=13 写 3 进 1；十位 3+2+1=6，是 63。" },
      { answer: 0, explain: "个位 5+8=13 进 1；十位 4+3+1=8，是 83。" },
      { answer: 1, explain: "个位 9+3=12 进 1；十位 5+2+1=8，是 82。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 2, explain: "个位 4 减 8 不够借 1，14−8=6；十位 6 借走 1 剩 5，5−2=3，是 36。" },
      { answer: 0, explain: "个位 11−5=6；十位 7 借 1 剩 6，6−3=3，是 36。" },
      { answer: 1, explain: "个位 10−7=3；十位 8 借 1 剩 7，7−4=3，是 33。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 2, explain: "个位 7+5=12 进 1；十位 3+4+1=8，是 82。" },
      { answer: 0, explain: "个位 12−6=6；十位 9 借 1 剩 8，8−5=3，是 36。" },
      { answer: 1, explain: "个位满十，向十位进 1，这个小 1 写在十位顶上。" },
      { answer: 2, explain: "48−29：个位 18−9=9，十位 4 借 1 剩 3，3−2=1，是 19。" },
      { answer: 0, explain: "个位 10−8=2；十位 5 借 1 剩 4，4−1=3，是 32。" }
    ]
  }
};

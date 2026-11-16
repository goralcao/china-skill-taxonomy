var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 2, explain: "25×4=100，凑整后再×7=700，最简便。" },
      { answer: 0, explain: "37+63=100（凑整），再加 56 得 156。" },
      { answer: 1, explain: "加法交换律：交换两个加数的位置，和不变。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "乘数交换位置，积不变。" },
      { answer: 0, explain: "改变结合顺序，和不变。" },
      { answer: 1, explain: "125×8=1000 凑整，再×5=5000。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 2, explain: "乘法分配律：(a+b)×c=a×c+b×c。" },
      { answer: 0, explain: "102=100+2，所以 102×5=100×5+2×5=510。" },
      { answer: 1, explain: "99=100−1，99×7=100×7−1×7=693。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 2, explain: "4×25=100，100×13=1300。" },
      { answer: 0, explain: "68+32=100，100+47=147。" },
      { answer: 1, explain: "20×25+4×25=500+100=600。" },
      { answer: 2, explain: "100×8+1×8=800+8=808。" },
      { answer: 0, explain: "运算律能凑整、简算，又快又准。" }
    ]
  }
};

var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "eye 眼、ear 耳、nose 鼻，三个部位都以 e 或 n 开头，别混。" },
      { answer: 0, explain: "ruler 尺子；rubber / eraser 才是橡皮，book 是书。" },
      { answer: 2, explain: "touch 是摸，nose 是鼻子；摸眼睛该说 Touch your eye。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "pencil 铅笔、pen 钢笔，只差一个词尾；bag 是书包。" },
      { answer: 1, explain: "mouth 嘴；eraser、ruler 都是文具。" },
      { answer: 0, explain: "show 是出示、给看；收起来是 Put away your book。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "ear 耳；eye 眼、arm 手臂。" },
      { answer: 2, explain: "nose 是身体部位，不会装进文具盒。" },
      { answer: 1, explain: "eraser（英式也说 rubber）是橡皮；ruler 是尺子。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "两个词都以 e 开头，靠词形和指认动作分开。" },
      { answer: 0, explain: "hand 手，复数 hands；clap 是拍。" },
      { answer: 2, explain: "按两个真实场景归类，比按字母或长短分好用。" },
      { answer: 0, explain: "课标一级要求能在指认、谈论用品时用这些词。" },
      { answer: 1, explain: "先做到看物能说，拼写慢慢跟，不必一次全默出来。" }
    ]
  }
};

var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "看一看", "连一连", "中测1", "摆一摆", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "声母 b 轻轻一带，韵母 a 响亮跟上来，一口气连成 ba。" },
      { answer: 1, explain: "前音轻短、后音重，这是拼读口诀的上半句。" },
      { answer: 2, explain: "中间不能停，两个音一碰才成了一个音节。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "m 是双唇音，配上 a 就是 ma；换成 n 或 b 开头就另是一个音。" },
      { answer: 1, explain: "声母 + 介母 + 韵母，三块拼在一起，叫三拼音节。" },
      { answer: 2, explain: "一停就散成两个音了，「猛一碰」说的就是别停。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 2, explain: "声母 h 配韵母 e，连起来是 he。" },
      { answer: 0, explain: "b 声母、a 韵母、ˋ 声调，一共三部分。" },
      { answer: 1, explain: "gua 是 g + u + a 三块；ba、ma 都只有声母和韵母两块。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "前音就是开头的声母，后音是跟着的韵母。" },
      { answer: 2, explain: "x + i + ā 三块连起来是 xiā；调号落在 a 上。" },
      { answer: 1, explain: "调号管的是韵母的高低，永远不落在声母上。" },
      { answer: 0, explain: "一停就散了；拼读要的是一口气连起来。" },
      { answer: 1, explain: "照着口诀把轻重摆对，比读响、比抄写都管用。" }
    ]
  }
};

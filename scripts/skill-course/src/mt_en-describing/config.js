var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "有顺序别人才跟得上，常从整体到细节。" },
      { answer: 0, explain: "also 补充、but 转折，连接词让句子成段。" },
      { answer: 2, explain: "成段描述要用完整句并连起来，别只蹦词。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "连接词让两句合成一段，听的人不用拼接。" },
      { answer: 1, explain: "also 表补充；but 是转折，这里没转折。" },
      { answer: 0, explain: "short 和 strong 有反差，用 but 连接。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "顺序 + 连接 + 完整信息，别人一次就懂。" },
      { answer: 2, explain: "先给整体框架，再补细节，别人才好跟上。" },
      { answer: 1, explain: "用 and 把相关两句连起来，描述更连贯。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "补充用 also，反差用 but，别混。" },
      { answer: 0, explain: "该换 also / but / 分句，别一 and 到底。" },
      { answer: 2, explain: "完整句 + 连接，把词放进成段的话里。" },
      { answer: 0, explain: "kind 友善、friendly 友好是性格；tall 是外貌。" },
      { answer: 1, explain: "在真实描述里练「顺序—连接—说完整」，才连得起来。" }
    ]
  }
};

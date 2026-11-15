var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "过去时讲已发生的事，常配 yesterday、last ...。" },
      { answer: 0, explain: "go 的过去式是不规则 went。" },
      { answer: 2, explain: "play→played、watch→watched，一般加 -ed。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "did 已表过去，后面动词回原形 watch。" },
      { answer: 1, explain: "疑问用 did + 动词原形：Did you go ...?" },
      { answer: 0, explain: "I / he / she / it 用 was；you / we / they 用 were。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "主语 they 复数，过去用 were。" },
      { answer: 2, explain: "see 不规则变化为 saw。" },
      { answer: 1, explain: "have 的过去式是 had。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "didnt 后动词回原形 play。" },
      { answer: 0, explain: "这些词提示用一般过去时。" },
      { answer: 2, explain: "yesterday 配过去式，every day 配一般现在。" },
      { answer: 0, explain: "辅音 + y 结尾，变 y 为 i 加 -ed → studied。" },
      { answer: 1, explain: "对着真实经历说，才把 yesterday 和过去式连起来。" }
    ]
  }
};

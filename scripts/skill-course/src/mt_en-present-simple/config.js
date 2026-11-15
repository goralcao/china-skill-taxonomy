var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "主语 he 是第三人称单数，动词加 -s → plays。" },
      { answer: 0, explain: "主语 I 不是三单，动词用原形 go。" },
      { answer: 2, explain: "一般现在时表习惯/常态，常配 every day、often。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "疑问句中 does 已经带三单，后面动词回原形：Does he play?" },
      { answer: 1, explain: "does 承担了三单标记，实义动词必须用原形。" },
      { answer: 0, explain: "doesnt 后动词回原形：He doesnt watch TV." }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "go 以 o 结尾，加 -es → goes。" },
      { answer: 2, explain: "watch 以 ch 结尾，加 -es → watches。" },
      { answer: 1, explain: "辅音 + y 结尾，变 y 为 i 加 -es → studies。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "have 的三单是不规则形式 has。" },
      { answer: 0, explain: "every evening 表习惯，用一般现在时 reads。" },
      { answer: 2, explain: "often、usually、always 是频率副词，常放实义动词前。" },
      { answer: 0, explain: "he 后动词要变 plays，He plays football." },
      { answer: 1, explain: "I go / He goes 对比着说，最容易记住什么时候加 -s。" }
    ]
  }
};

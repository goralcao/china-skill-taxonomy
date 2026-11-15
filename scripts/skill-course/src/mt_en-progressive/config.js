var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "be (am/is/are) + V-ing，两样都不能少。" },
      { answer: 0, explain: "要有 be（is）又要有 -ing：He is playing." },
      { answer: 2, explain: "now 和 Look! / Listen! 表示此刻正在发生。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "run 双写末尾辅音 n → running，和 swim→swimming 一样。" },
      { answer: 1, explain: "以不发音 e 结尾，去 e 加 -ing → making。" },
      { answer: 0, explain: "swim 双写 m 加 -ing → swimming。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "进行时必须有 be：He is playing football." },
      { answer: 2, explain: "now 配进行时，every day 配一般现在时。" },
      { answer: 1, explain: "问此刻在做什么，答 I am + V-ing。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "主语 they 复数配 are，动词加 -ing。" },
      { answer: 0, explain: "am / is / are 跟着主语走，别一律用 is。" },
      { answer: 2, explain: "Listen! 提醒「听，正在发生」，接现在进行时。" },
      { answer: 0, explain: "去 e 加 -ing → writing，不双写 t。" },
      { answer: 1, explain: "对着真实动作说，才把 now 和 be + -ing 连起来。" }
    ]
  }
};

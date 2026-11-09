var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "Good morning 只用于上午；Good night 是晚安。" },
      { answer: 0, explain: "见面时说 Hello / Hi，道别要说 Goodbye / Bye。" },
      { answer: 2, explain: "Goodbye 与 Bye 是告别语，别用在刚见面时。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "I'm = I am，撇号不能漏。" },
      { answer: 1, explain: "用 I am + 名字或 My name is + 名字，别把两句拼在一起。" },
      { answer: 0, explain: "初次见面说「很高兴认识你」，对方常回 Nice to meet you, too." }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "afternoon 是下午，问候语要跟时段对上。" },
      { answer: 2, explain: "I am 和 My name is 只能用一种，不能叠在一起。" },
      { answer: 1, explain: "问「你好吗」要答状态，不是报名字或道晚安。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "问候和道别各有各的场合，说反了对方会愣住。" },
      { answer: 0, explain: "Good night 是晚安，不是「早上好」。" },
      { answer: 2, explain: "too 表示「我也一样」，是常见的回礼。" },
      { answer: 0, explain: "年龄直接说 I am + 数字，不用 name。" },
      { answer: 1, explain: "时段、场合都对上，才算真的会说。" }
    ]
  }
};

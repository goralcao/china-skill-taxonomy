var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "鞋成双，用复数 shoes，一双要说 a pair of shoes。" },
      { answer: 0, explain: "裤子两条裤腿，pants / trousers 常用复数；coat、hat 是单数。" },
      { answer: 2, explain: "Whose 问「谁的」，后接名词：Whose coat is this?" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "put on 强调「穿上去」的动作，wear 强调「穿着」的状态。" },
      { answer: 1, explain: "dress 上下连在一起，skirt 只有下半身，别混。" },
      { answer: 0, explain: "clothes 恒为复数，不说 a clothe，也不说 a clothes。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "mine 单独用（It is mine.）；my 后面必须接名词（my coat）。" },
      { answer: 2, explain: "袜子两只一双，常用复数 socks，一双是 a pair of socks。" },
      { answer: 1, explain: "pants 复数，配 these / are；不说 this pant。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "It's cold 时穿 coat 外套；T-shirt 是热天穿的。" },
      { answer: 0, explain: "try on 是试穿，take off 是脱下，wash 是洗。" },
      { answer: 2, explain: "shoes 是复数，答用 They are ...，别用 It is。" },
      { answer: 0, explain: "What size? 问尺码；问颜色用 What colour? 问价用 How much?" },
      { answer: 1, explain: "对着真人衣物说 This is my coat / These are my shoes，才记得牢。" }
    ]
  }
};

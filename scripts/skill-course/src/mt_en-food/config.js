var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "milk、water、rice 这类不可数名词前不加 a，要说 some milk。" },
      { answer: 0, explain: "rice 米饭，bread 面包，noodles 面条。" },
      { answer: 2, explain: "面条常是一根根，英语习惯用复数 noodles。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "water 不可数，用 some 搭配，不说 a water。" },
      { answer: 1, explain: "bread 面包，rice 米饭，juice 果汁。" },
      { answer: 0, explain: "不可数名词用 some；I am milk 意思完全变了。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "egg 可数，两个就要加 -s：two eggs。" },
      { answer: 2, explain: "第一组都不可数；另两组混进了可数的 egg / apple。" },
      { answer: 1, explain: "juice 果汁，milk 牛奶，bread 面包。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "Have some ... 是招待、请对方吃点或喝点。" },
      { answer: 0, explain: "apple 以元音音素开头，用 an；复数才加 -s。" },
      { answer: 2, explain: "不可数名词前不加 a，要说 some rice。" },
      { answer: 0, explain: "breakfast 早餐，lunch 午餐，dinner 晚餐。" },
      { answer: 1, explain: "词放进点餐、分享的小句子，才算会用。" }
    ]
  }
};

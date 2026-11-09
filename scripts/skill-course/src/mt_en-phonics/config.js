var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "拼读建立字母和音的对应，看到词能试读、听到音能试写。" },
      { answer: 0, explain: "按 /k/ → /æ/ → /t/ 的顺序连起来，就是 cat，别把字母顺序调换。" },
      { answer: 2, explain: "C 的名称音是 /siː/，在 cat 里读 /k/；/s/ 是它在 city 里的读法。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "CVC = 辅音 + 元音 + 辅音，cat、pig、dog 都是这个形状。" },
      { answer: 1, explain: "/æ/ 是 a 的字母音；A 自己的名字读 /eɪ/。" },
      { answer: 0, explain: "三个音要一口气连起来，中间断开就碎成三个孤立的音。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "p-i-g 是辅元辅；she 有字母组合 sh，cake 结尾有不发音的 e。" },
      { answer: 2, explain: "一级只要求「感知」和「尝试」，不要求一次学完所有规则。" },
      { answer: 1, explain: "b 的名称音是 /biː/，在单词开头读短促的 /b/。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "辅音轻短、元音响亮、中间不停，才拼得成一个词。" },
      { answer: 0, explain: "尾音是 /t/ 就是 cat；换成 /p/ 才读 cap，换成 /ɒ/ 是 cot。" },
      { answer: 2, explain: "能把音拆开再合起来，是自主拼读的第一步。" },
      { answer: 0, explain: "按拼读规则试读，读出来再回到句子里核意思。" },
      { answer: 1, explain: "拼读课先解决「见词能读」，词义靠情境和课文补。" }
    ]
  }
};

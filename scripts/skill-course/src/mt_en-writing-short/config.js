var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "句首字母一律大写，这是最基础的书写规矩。" },
      { answer: 0, explain: "陈述句句末用句号，别一逗到底或漏标点。" },
      { answer: 2, explain: "词与词之间留一个空格，挤成一团就读不清了。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "I 永远大写，哪怕在句子中间。" },
      { answer: 1, explain: "写后通读，最容易发现大小写、标点、词距的小错。" },
      { answer: 0, explain: "and 连接并列的两件事；but 转折，because 表原因。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "句首要大写，且 I 本身永远大写：I like apples." },
      { answer: 2, explain: "几句要围绕一件事，前后连得上，别东一句西一句。" },
      { answer: 1, explain: "词全挤在一起，要写成 I get up at seven." }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "别按中文一个字一个字硬翻，要套用学过的句型。" },
      { answer: 0, explain: "name 和 is 之间要空格，句首 My 大写。" },
      { answer: 2, explain: "大写、词距、句末句号都到位才规范。" },
      { answer: 0, explain: "合成一句后 and 小写连接，句首只大写一次。" },
      { answer: 1, explain: "按三条固定清单自查，比盲目多写更能改掉小错。" }
    ]
  }
};

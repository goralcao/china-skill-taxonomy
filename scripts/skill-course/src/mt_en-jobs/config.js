var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "teach 加 -er → teacher，表示「做这个动作的人」。" },
      { answer: 0, explain: "drive 以 e 结尾，直接加 -r → driver，别写成 driveer。" },
      { answer: 2, explain: "doctor 以辅音音开头，用 a doctor。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "an 用在元音音前，如 an actor、an engineer、an English teacher。" },
      { answer: 1, explain: "第三人称单数疑问用 does，后面动词回原形 do。" },
      { answer: 0, explain: "单数可数职业名词前必须加 a 或 an。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "cook 可当动词「烹饪」，也可当名词「厨师」，看它在句子里的位置。" },
      { answer: 2, explain: "farm 加 -er → farmer，和 teach、work 一个规律。" },
      { answer: 1, explain: "work 加 -er → worker；working 是「正在工作」，不是职业。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "What's his job? 和 What does he do? 都问职业。" },
      { answer: 0, explain: "-man / -er / -or 都常表示「做这件事的人」。" },
      { answer: 2, explain: "nurse 护士，doctor 医生，都在医院工作，别混。" },
      { answer: 0, explain: "陈述句里 he 后动词要加 -s/-es：He teaches English." },
      { answer: 1, explain: "对着真人、放进句子说，职业词才真正会用。" }
    ]
  }
};

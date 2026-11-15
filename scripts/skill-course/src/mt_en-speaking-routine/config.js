var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "How are you 问近况，答 I am fine / OK；答名字是答非所问。" },
      { answer: 0, explain: "初次见面互致 Nice to meet you, too. 是固定回应。" },
      { answer: 2, explain: "What's your name? 问名字；How old 问年龄。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "How old 问几岁，答 I am nine / ten。" },
      { answer: 1, explain: "对方道谢，答 You are welcome / Not at all." },
      { answer: 0, explain: "Where ... from 问籍贯/来自哪儿，答 I am from ..." }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "请求许可，同意说 Sure / Of course, here you are." },
      { answer: 2, explain: "交流是来回，先听懂关键词再回应，比背整段更要紧。" },
      { answer: 1, explain: "What do you like 问喜好，答 I like + 爱好。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "What about you? / And you? 用来把问题递回去。" },
      { answer: 0, explain: "道别时互道 See you / Goodbye." },
      { answer: 2, explain: "课标一级鼓励敢开口，错了就换一种说法，不用怕。" },
      { answer: 0, explain: "hobby 是爱好，答 I like + 动名词短语。" },
      { answer: 1, explain: "在真实来回里练听和答，才把问候扩展成交流。" }
    ]
  }
};

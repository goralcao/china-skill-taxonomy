var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "看一看", "连一连", "中测1", "摆一摆", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "zhi 是整体认读音节，看到就整块读出来，拆开拼反而不准。" },
      { answer: 1, explain: "一共 16 个。23 是声母的个数，别记混。" },
      { answer: 2, explain: "yi 整体记，一看见就读「衣」，不用先拼 y 再拼 i。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "ba、ma 都是声母加韵母拼出来的；zhi 不用拼。" },
      { answer: 1, explain: "zi 里的 i 是跟着 z 的舌尖音，不读「衣」；整体记就不会错。" },
      { answer: 2, explain: "关键在「不用拼」：整块记住，一眼呼读。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "yu 也在 16 个里，整块读「鱼」，不拆开拼。" },
      { answer: 1, explain: "第一组是拼出来的音节，第三组是单韵母；中间这组的四个整体记。" },
      { answer: 2, explain: "整体记的调号一样落在韵母 a 上，不落在开头的 y 上。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "yue 在 16 个里，看到就整块读，拆开反而慢。" },
      { answer: 1, explain: "错在「拼」这个动作本身；yi 要整块记。" },
      { answer: 2, explain: "gua 是 g + u + a 三块拼出来的三拼音节，不在 16 个里。" },
      { answer: 0, explain: "像 zi、zhi 里的 i 并不读「衣」，拆开拼就会读错，所以整块记最稳。" },
      { answer: 1, explain: "zhi chi shi ri 一组、zi ci si 一组、yi wu yu 一组，成组记最省力。" }
    ]
  }
};

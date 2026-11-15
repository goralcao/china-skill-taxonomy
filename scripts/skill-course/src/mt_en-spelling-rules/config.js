var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "sh 是一个字母组合，合起来读 /ʃ/，不是 s 和 h 分开念。" },
      { answer: 0, explain: "ee 和 ea 很多词里都读长音 /iː/，sea 和 see 才同音。" },
      { answer: 2, explain: "ar 组合常读 /ɑː/，像 car、star、park，别把 a 单独念成 /æ/。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "oa 常读 /əʊ/，如 boat、coat、goat；o 单独在 hot 里才读 /ɒ/。" },
      { answer: 1, explain: "先圈出 sh、ee 这类组合，再拼剩下的音，试读又快又准。" },
      { answer: 0, explain: "th 是一个组合，读咬舌清音 /θ/，不是 t 和 h 各念各的。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "ch 常读 /tʃ/，像 chair、lunch；个别词才读 /k/。" },
      { answer: 2, explain: "oo 有长短两套：food、moon 读长 /uː/，book、look 读短 /ʊ/，要靠词记。" },
      { answer: 1, explain: "把 sh、ee 当成一个整体记，遇到生词不用一个字母一个字母试。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "ai 和 ay 都常读 /eɪ/，rain、play、day 押同一个韵。" },
      { answer: 0, explain: "sh 要当一个音处理，拆开就多出一个音，拼出来的词就不对了。" },
      { answer: 2, explain: "认识组合就能推读：gr + ee + n → green，规则能帮着读生词。" },
      { answer: 0, explain: "规则把「音」和「形」对上，记词不再靠死背字母顺序。" },
      { answer: 1, explain: "ship / shop、see / sea 比着读，再拼进词里，才记得住、用得上。" }
    ]
  }
};

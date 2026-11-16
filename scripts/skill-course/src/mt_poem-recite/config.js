var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "起疑", "取证", "连一连", "中测1", "对齐", "说清", "中测2", "换文", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "理解了诗意、脑中有画面，背诵就有线索，比死记快而牢。" },
      { answer: 0, explain: "《静夜思》是唐代诗人李白的作品。" },
      { answer: 2, explain: "《静夜思》顺序：床前明月光，疑是地上霜，举头望明月，低头思故乡。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "古诗有节奏，按意义停顿读，才有韵味也好记。" },
      { answer: 1, explain: "「低头思故乡」点明了思乡之情。" },
      { answer: 0, explain: "举头望的是明月，由月引发思乡；霜是比喻月光的白。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "背完复述诗意、回想画面，能记得更牢。" },
      { answer: 2, explain: "「疑是地上霜」把月光比作地上的霜，写月色的洁白。" },
      { answer: 1, explain: "理解后背诵，还要时常复习，才能真正积累下来。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "字音读准是诵读的基础，不认识的字要查清。" },
      { answer: 0, explain: "《咏鹅》：鹅鹅鹅，曲项向天歌。白毛浮绿水，红掌拨清波。" },
      { answer: 2, explain: "把诗句还原成画面，记忆就有了形象的依托。" },
      { answer: 0, explain: "「曲项向天歌」出自骆宾王《咏鹅》，写鹅弯着脖子朝天唱歌。" },
      { answer: 1, explain: "背古诗先读懂、想画面、有节奏地读，背完还要常常复习。" }
    ]
  }
};

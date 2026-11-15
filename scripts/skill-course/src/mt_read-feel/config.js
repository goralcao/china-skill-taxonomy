var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "起疑", "取证", "连一连", "中测1", "对齐", "说清", "中测2", "换文", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "有感情朗读、抓关键词句、联系自身经历三者结合，感受才立体。" },
      { answer: 0, explain: "攥拳、眼泪是动作和神态描写，透露内心强烈的情绪。" },
      { answer: 2, explain: "朗读时用语气、节奏把情绪读出来，能帮助我们体会情感。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "花溅泪、鸟惊心是移情于景，物体都染上了诗人的哀愁。" },
      { answer: 1, explain: "把感受落到具体句子和自身经历上，才不是空话。" },
      { answer: 0, explain: "相似的生活体验能帮我们理解作者的情感，但文章本身仍是根本。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "一步三回头、久久挥手是典型的不舍动作，比平铺直叙更有情味。" },
      { answer: 2, explain: "反复是一种强调，往往把最关键的情感或意思反复叩击。" },
      { answer: 1, explain: "概括回答「写了什么」，体会回答「字里是什么心情」，关注点不同。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "关键句要停下来咀嚼，通过朗读和想象把情绪读出来。" },
      { answer: 0, explain: "把情感寄托在景物上，让景物带上了人的情绪，就是借景抒情。" },
      { answer: 2, explain: "感受可以有差异，但要能说出依据，并尊重别人的体会。" },
      { answer: 0, explain: "把母亲的手比作老树皮，写出长年劳作的艰辛，也含着心疼。" },
      { answer: 1, explain: "把感受落在具体句子和自身经历上，才算真正读懂了文字背后的情。" }
    ]
  }
};

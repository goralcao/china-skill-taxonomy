var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "起疑", "取证", "连一连", "中测1", "对齐", "说清", "中测2", "换文", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "速度必须建立在理解之上；读得快却没读懂，等于没读。" },
      { answer: 0, explain: "把词连成短句成组认读，减少停顿，能明显提速。" },
      { answer: 2, explain: "有意识地一次看清更大的范围，能减少眼跳次数、提高速度。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "不影响理解的词可先跳过，保持阅读的连贯，读完再回头看。" },
      { answer: 1, explain: "关键和难懂处要放慢甚至细读，速度要为理解服务。" },
      { answer: 0, explain: "能复述主要内容、答出关键问题，才说明真的读懂了。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "计时帮助专注和跟踪进步，但只是手段，不能代替理解。" },
      { answer: 2, explain: "找时间、人名、结论这类具体信息时，扫读效率最高。" },
      { answer: 1, explain: "逐字出声读（唇读）会限制速度，连词成句默读更快。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "速度要建立在理解上，逐步提速才稳。" },
      { answer: 0, explain: "讲出大意才证明真读懂了，速度和页数说明不了。" },
      { answer: 2, explain: "说明文常在段首段尾点明要点，抓住它们能快速把握内容。" },
      { answer: 0, explain: "没记住说明没读懂，该放慢抓关键重读，而不是加速或放弃。" },
      { answer: 1, explain: "真正的快，是又快又懂。" }
    ]
  }
};

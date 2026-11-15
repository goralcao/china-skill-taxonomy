var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "起疑", "取证", "连一连", "中测1", "对齐", "说清", "中测2", "换文", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "先想清楚目的，才能选对读法、判断哪些信息重要。" },
      { answer: 0, explain: "找具体信息用浏览和定位，快速锁定目标即可。" },
      { answer: 2, explain: "品味语言需要细读慢品，精读才体会得到用词之妙。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "浏览追求速度和筛选，不追求字字落实。" },
      { answer: 1, explain: "无关内容略过，才能让阅读高效服务于目的。" },
      { answer: 0, explain: "相关性以目的是标尺：能回答问题的就是有用信息。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "标题和段首段尾常点明要点，是快速定位的抓手。" },
      { answer: 2, explain: "核对问题和依据，确认目的达成，阅读才完整。" },
      { answer: 1, explain: "目的决定读法：找信息和品语言用的方法不一样。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "体会情感、品味语言适合精读；查找信息适合浏览。" },
      { answer: 0, explain: "带着真实目的去读、去筛选信息，阅读才与实际生活连起来。" },
      { answer: 2, explain: "没解决就调整读法或换关键词再查，才是为目标负责。" },
      { answer: 0, explain: "把精力放在与目的相关的段落上，才谈得上有目的地读。" },
      { answer: 1, explain: "阅读为了解决问题，读法要为目的让路。" }
    ]
  }
};

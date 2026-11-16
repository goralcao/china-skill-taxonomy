var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "读进去", "看出来", "连一连", "中测1", "写下来", "改一处", "中测2", "评一评", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "「在」表示处于某个地方，「在家」是对的；「再」表示又一次。" },
      { answer: 0, explain: "「再」表示又一次、重复；「再来一次」是又一次来。" },
      { answer: 2, explain: "同音字读音一样，只能靠意思区分，这叫「以义定字」。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "己、已字形相近，开口程度不同；自己用「己」，已经用「已」。" },
      { answer: 1, explain: "「的」后接名词，「地」后接动词，「得」前是动词后接补充说明。" },
      { answer: 0, explain: "表示所属用「的」：「我的书」。地、得用在这里都不通。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "形近字长得像，要盯住差别（如多一点少一点、开口大小）来辨。" },
      { answer: 2, explain: "「目」比「日」中间多一横，眼睛的「目」里面有眼珠。" },
      { answer: 1, explain: "「得」用在动词或形容词后，接补充说明「跳起来」。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "选完读一遍，语感和意思都对得上，才算选对。" },
      { answer: 0, explain: "在和再都读 zài，是同音字；己/已、日/目是形近字，读音不同。" },
      { answer: 2, explain: "做事用「做」，作业用「作」，靠意思和固定搭配区分。" },
      { answer: 0, explain: "三点水清与水有关，日字旁晴与太阳有关，目字旁睛与眼睛有关。" },
      { answer: 1, explain: "易混字要靠意思和字形来辨，选完读一遍核对，才不会写错。" }
    ]
  }
};

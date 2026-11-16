var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "读进去", "看出来", "连一连", "中测1", "写下来", "改一处", "中测2", "评一评", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "把字句：主动者（我）＋把＋被动者（门）＋动作。" },
      { answer: 0, explain: "被字句：被动者（门）＋被＋主动者（我）＋动作。" },
      { answer: 2, explain: "如「我把门关上」：我是主动者，门是被作用的对象。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "被字句「门被我关上」，被后面是主动者「我」。" },
      { answer: 1, explain: "被字句把被动者（老鼠）提前：老鼠被小猫抓住。" },
      { answer: 0, explain: "改写只是换说法，谁做、做什么不能变，写完读一遍核对。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "「他」做「放」的动作，是主动者；书是被放的对象。" },
      { answer: 2, explain: "被字句有「被」字，被动者在前：「作业被我……」。" },
      { answer: 1, explain: "两种句式表达同一件事，可互相转换，但主被动位置要对调。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "主动者雨在前：雨把衣服淋湿了，意思不变。" },
      { answer: 0, explain: "改写只调主动者和被动者的位置，动作（做什么）要保留。" },
      { answer: 2, explain: "被字句把被动者放前面，强调它「被怎么样」了。" },
      { answer: 0, explain: "「杯子被我打破」与「我打破杯子」意思相同；「杯子把我打破」意思反了。" },
      { answer: 1, explain: "把字句主动者在前、被字句被动者在前，改写后读一遍，意思不变才算对。" }
    ]
  }
};

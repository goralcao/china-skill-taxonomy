var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "箭头指向捕食者，表示能量从被吃者流向吃者。" },
      { answer: 1, explain: "植物是生产者，能自己制造养分，是食物链起点。" },
      { answer: 2, explain: "水稻是绿色植物，能光合作用制造养分。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "蝗虫是动物，靠吃植物为生，是消费者。" },
      { answer: 1, explain: "生物需要阳光、水、空气等，不需要音乐。" },
      { answer: 2, explain: "骆驼耐旱、耐饥渴，适应沙漠。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "草是兔的食物，草减少兔会因缺食减少。" },
      { answer: 1, explain: "青蛙捕食害虫，是农田的益虫。" },
      { answer: 2, explain: "食物链从植物开始，箭头指向捕食者。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "栖息地被破坏，生物失去家园和食物，生存受威胁。" },
      { answer: 1, explain: "蚯蚓活动能松土，分解落叶，改良土壤。" },
      { answer: 2, explain: "生物通过食物链等关系相互联系、依存。" },
      { answer: 0, explain: "保护栖息地、不乱捕滥杀，才能保护生物多样性。" },
      { answer: 1, explain: "石头没有生命，不是生物；草和蚂蚁是生物。" }
    ]
  }
};

var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "cat 是猫，dog 是狗，bird 是鸟。" },
      { answer: 0, explain: "fish 通常单复数同形，two fish 就够用；fishes 多指不同种类的鱼。" },
      { answer: 2, explain: "英语用 a / an 表示「一个」，不在名词后加 -s。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "panda 是熊猫，tiger 是老虎，monkey 是猴子。" },
      { answer: 1, explain: "名词加 -s 表示复数，喜欢的是一类、多只兔子。" },
      { answer: 0, explain: "animal 是动物总称，cat 和 panda 是具体某一种。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "鸟会飞 fly；swim 是游泳，read 是读。" },
      { answer: 2, explain: "It is a ... 用来说明「它是什么」，回答的是身份。" },
      { answer: 1, explain: "rabbit 中间是双写 b，别漏一个。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "monkey 猴子，rabbit 兔子，fish 鱼。" },
      { answer: 0, explain: "fish 单复数常同形，two fish 最常用。" },
      { answer: 2, explain: "第二组混了饮料和颜色，第三组混了文具。" },
      { answer: 0, explain: "It is a ... 介绍动物或物品；I am 是说自己。" },
      { answer: 1, explain: "词放进小句子、对着图片说，才算会用。" }
    ]
  }
};

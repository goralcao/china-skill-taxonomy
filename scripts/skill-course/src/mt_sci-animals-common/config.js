var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "燕子有翅膀会飞；狗和鱼不会飞。" },
      { answer: 1, explain: "金鱼用鳃呼吸、住在水里；老虎、麻雀在陆地。" },
      { answer: 2, explain: "兔子是草食动物，爱吃草和蔬菜。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "鸟类身上有羽毛；猫是毛，蛇是鳞片。" },
      { answer: 1, explain: "鲸是哺乳动物，用肺呼吸，要浮出水面换气。" },
      { answer: 2, explain: "蛇靠身体爬行，没有脚；鸡和狗都有脚。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "老虎是肉食动物，捕食其他动物。" },
      { answer: 1, explain: "蝴蝶和蜜蜂都会飞，可分成一组。" },
      { answer: 2, explain: "蝴蝶是完全变态昆虫，要经过卵、幼虫、蛹、成虫四个阶段。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "蝙蝠有毛、胎生、哺乳，是哺乳动物，只是会飞。" },
      { answer: 1, explain: "分类标准不同，分出的组就不同，这很正常。" },
      { answer: 2, explain: "猫狗牛胎生哺乳，是哺乳动物；鸡鸭鹅是鸟。" },
      { answer: 0, explain: "要爱护动物、安全观察，不随意捕捉伤害。" },
      { answer: 1, explain: "昆虫有六条腿、身体分三部分；蜘蛛八条腿，不是昆虫。" }
    ]
  }
};

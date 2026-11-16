var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "读进去", "看出来", "连一连", "中测1", "写下来", "改一处", "中测2", "评一评", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "象形就是「画成其物」，照着事物的外形画，慢慢固定成字。" },
      { answer: 0, explain: "古人画太阳是一个圆圈中间加一点，后来方写成「日」。" },
      { answer: 2, explain: "月亮常是弯弯的，古人照月牙画，所以「月」字带弯。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "日、山都是照样子画的象形字；「河」是形声字，不是象形。" },
      { answer: 1, explain: "「山」的古字画像几座连着的山峰，尖峰就是山。" },
      { answer: 0, explain: "象形字形和义连着，看形状想事物，比死记更牢。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "古人把流动的水画成弯弯的曲线，就是「水」的象形。" },
      { answer: 2, explain: "象形字数量有限，却是会意、形声等造字的基础，很重要。" },
      { answer: 1, explain: "象形字靠「像」，字形和实物外形相似，看形就能猜义。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "古人照着火苗往上窜的样子画，就是「火」的象形。" },
      { answer: 0, explain: "「旦」是太阳（日）在地平线（一）上，表示天亮，是象形加表意。" },
      { answer: 2, explain: "明白字表示什么，再照着意思记形状，理解着记更牢。" },
      { answer: 0, explain: "日月山水都是照事物画的象形字；后两组多为形声字。" },
      { answer: 1, explain: "象形字形义相连，由形想义、由义记形，才能记得又快又牢。" }
    ]
  }
};

var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "起意", "搭骨架", "连一连", "中测1", "起草", "改", "中测2", "出刊", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "仿写学的是句式，内容要换成自己的，照抄不算仿写。" },
      { answer: 0, explain: "把月儿比作小船，用了「像」，是比喻句。" },
      { answer: 2, explain: "「弯弯的……像……」句式一样，又换了新内容，才是好的仿写。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "先读懂例句「什么结构」，才知道怎么照着仿。" },
      { answer: 1, explain: "「唱歌」是人的行为，把小鸟当人写，是拟人。" },
      { answer: 0, explain: "比喻仿写要抓住相似点，如弯弯的月儿和小船都弯。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "「又……又……」句式要两个「又」，「又大又红」符合。" },
      { answer: 2, explain: "仿写保留句式、更换内容；抄写是原样照搬。" },
      { answer: 1, explain: "换成新内容又保持「……像……」句式，才是仿写。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "对照看句式是否一致、内容是否换成自己的，才算仿写成功。" },
      { answer: 0, explain: "仿写是学习表达的阶梯，照着好句式练，慢慢自己也会写。" },
      { answer: 2, explain: "「点头」把花当人写，和例句一样用了拟人。" },
      { answer: 0, explain: "仿写要发挥自己的想象，换上新事物，不是小改例句。" },
      { answer: 1, explain: "仿写三步：读懂例句句式，换上自己的内容，写完对照检查。" }
    ]
  }
};

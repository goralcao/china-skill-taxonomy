var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "读进去", "看出来", "连一连", "中测1", "写下来", "改一处", "中测2", "评一评", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "先把要点抓出来，再按顺序连成话；字数和成语都不决定复述好不好。" },
      { answer: 1, explain: "通知靠这几点才能照着做；语气、桌子排数漏了也不耽误事。" },
      { answer: 2, explain: "一个是准确传话、一个是重说一段内容，要求和对象都不一样。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "四样要点齐、没有含糊、没有添评价，才算传到位。" },
      { answer: 2, explain: "顺序一乱，前后就接不上；复述可以换词，不能换事情的先后。" },
      { answer: 1, explain: "转述只传原话里有的，添评价、加想象都会让信息走样。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: "人物和关键对话撑着故事，风吹得舒服这类细节省了也不影响听懂。" },
      { answer: 0, explain: "传话的人不是原来说话的人，人称就得跟着换。" },
      { answer: 2, explain: "这四样是复述和转述共用的骨架，记全了就不会漏。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "抓要点 → 保顺序 → 换自己的话，比死背更不容易漏。" },
      { answer: 1, explain: "传话人不是原说话人，要用第三方说法，别把「我」照搬。" },
      { answer: 2, explain: "「9 点」和「带水杯」都丢了，听的人没法照着做。" },
      { answer: 1, explain: "复述看要点全不全、顺序对不对，不比形容词背得多不多。" },
      { answer: 0, explain: "四样核完再读一遍，漏没漏、走没走样一听就知道。" }
    ]
  }
};

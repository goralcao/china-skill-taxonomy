var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "by + 交通工具，中间不加任何冠词。" },
      { answer: 0, explain: "步行固定说 on foot，不用 by，也不用 feet 复数。" },
      { answer: 2, explain: "How 问方式，疑问句要加助动词 do。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "by bike 与 take a bike 都表骑车出行，是两种并列表达。" },
      { answer: 1, explain: "指路固定说 turn left / turn right，不加 to。" },
      { answer: 0, explain: "go straight 直走，别和 turn 混。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "traffic lights 是红绿灯，过路口要看它。" },
      { answer: 2, explain: "far from 是「离……远」，near 才是「近」。" },
      { answer: 1, explain: "get to + 地点，How can I get to ...? 是问路的常用句。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "by subway 裸用；换成 take 要加 the：take the subway。" },
      { answer: 0, explain: "crossing 是路口，bus stop 才是车站。" },
      { answer: 2, explain: "第三人称单数用 does，后接动词原形 go。" },
      { answer: 0, explain: "by bus / by train / by plane，中间不加 a/the。" },
      { answer: 1, explain: "放进 How do you go ...? / I go ... by ... 的真实问答里，才算会用。" }
    ]
  }
};

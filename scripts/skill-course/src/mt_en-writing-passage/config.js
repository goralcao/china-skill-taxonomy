var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "有头有尾才成篇，中间展开，结尾收一下。" },
      { answer: 0, explain: "开头先告诉读者「这段写什么」。" },
      { answer: 2, explain: "这些顺序词让短文有条理，别东一句西一句。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "结尾收束或说一句感受，别突然开新话题。" },
      { answer: 1, explain: "短文要集中，跑题的句子再好也要删。" },
      { answer: 0, explain: "按要点增删、改错，是写短文的关键一步。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "also 补充同类信息，让内容更完整。" },
      { answer: 2, explain: "所有句子扣住标题，跑题的删掉。" },
      { answer: 1, explain: "加 first / then / also 连起来，才像短文不像清单。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "围绕话题取舍，跑题句删掉更利落。" },
      { answer: 0, explain: "写同一件事时态要一致，通读时顺手改。" },
      { answer: 2, explain: "顺序词最适合串起「先做什么、再做什么、最后」。" },
      { answer: 0, explain: "先搭骨架（要点），再连句、再修改，比硬写更顺。" },
      { answer: 1, explain: "短文讲结构，不只是把句子变多。" }
    ]
  }
};

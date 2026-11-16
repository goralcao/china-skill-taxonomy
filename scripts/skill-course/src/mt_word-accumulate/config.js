var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "读进去", "看出来", "连一连", "中测1", "写下来", "改一处", "中测2", "评一评", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "苹果、香蕉是水果，白菜是蔬菜，所以白菜不同类。" },
      { answer: 0, explain: "归类要看词义、按一个标准分，中途换标准就乱了。" },
      { answer: 2, explain: "苹果香蕉梨都是水果；另两组是蔬菜和动物。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "猫狗老虎是动物，钢笔是文具，不同类。" },
      { answer: 1, explain: "分类把词连成网，成组记忆更牢，用时也能按类想起来。" },
      { answer: 0, explain: "红色黄色是颜色，跑步是动作，不同类。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "可以按类别、用途、性质等多种标准分，关键是标准统一。" },
      { answer: 2, explain: "铅笔橡皮尺子是文具；另两组是水果和家具。" },
      { answer: 1, explain: "要懂词义才知道谁和谁同类，靠字数笔画判断不准。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "春夏是季节，早晨是一天中的时段，不同类。" },
      { answer: 0, explain: "按颜色分和按大小分，结果可能不一样，标准要清楚。" },
      { answer: 2, explain: "飞机火车轮船都能载人载物，是交通工具。" },
      { answer: 0, explain: "白菜、萝卜、黄瓜都是蔬菜；混进苹果、梨（水果）就错了。" },
      { answer: 1, explain: "归类先定标准，按词义分，能说出理由，还能找出不同类的词。" }
    ]
  }
};

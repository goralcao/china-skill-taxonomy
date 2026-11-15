var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "起意", "搭骨架", "连一连", "中测1", "起草", "改", "中测2", "出刊", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "六要素是记事文的基本骨架，缺一样事情就交代不清。" },
      { answer: 0, explain: "起因回答「为什么」，经过回答「怎么样」，结果回答「最后如何」。" },
      { answer: 2, explain: "经过是文章的主体，要写具体，读者才看得明白。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "好的开头交代了时间、地点、人物和事情的开端。" },
      { answer: 1, explain: "结果让事情有头有尾，读者知道结局如何。" },
      { answer: 0, explain: "按事情发展顺序写，条理清楚，读者容易跟上。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "用动作、神态把情绪写出来，比直接贴标签更具体。" },
      { answer: 2, explain: "先看六要素齐不齐，再润色；要素缺了，写得再美也不完整。" },
      { answer: 1, explain: "第一次做饭有明确的时间、经过和结果，适合写事；另两个更适合写景状物。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "流水账是事事都记，抓关键步骤详写才能突出重点。" },
      { answer: 0, explain: "写人要结合他做了什么来写，单独介绍或略去都写不活。" },
      { answer: 2, explain: "结果要服务于中心，选最能表现的那一个写清即可。" },
      { answer: 0, explain: "经过部分要写具体，学车的困难和克服过程正是重点。" },
      { answer: 1, explain: "把一件事写清楚，先让六要素站好队。" }
    ]
  }
};

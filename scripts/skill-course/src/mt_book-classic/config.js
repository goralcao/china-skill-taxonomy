var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "起疑", "取证", "连一连", "中测1", "对齐", "说清", "中测2", "换文", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "目录帮我们把握全书脉络，读起来更有方向。" },
      { answer: 0, explain: "摘录加批注能把阅读留下痕迹，光看不记容易忘。" },
      { answer: 2, explain: "这句话强调动笔记录，让阅读更扎实、更有收获。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "把人物和其行为对应记下来，关系自然清楚。" },
      { answer: 1, explain: "读后感重在「感」，复述故事代替不了自己的体会。" },
      { answer: 0, explain: "感受要落到书里的具体情节，不是凭空发挥。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "标记疑问、读后再解决，既不打断阅读，也不放过问题。" },
      { answer: 2, explain: "持续阅读加交流，能读得深、记得住。" },
      { answer: 1, explain: "经典内涵丰富，随着阅历增长重读会有新发现。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "批注写的是自己的想法，不是抄书或记日期。" },
      { answer: 0, explain: "交流是分享依据、倾听不同，而不是各说各话或沉默。" },
      { answer: 2, explain: "喜欢一个人物要说出具体事例，才有说服力。" },
      { answer: 0, explain: "理解可以不同，关键是各自说清依据、彼此尊重。" },
      { answer: 1, explain: "把整本书读进去，再把感受读出来。" }
    ]
  }
};

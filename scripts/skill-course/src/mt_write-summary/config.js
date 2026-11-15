var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "起意", "搭骨架", "连一连", "中测1", "起草", "改", "中测2", "出刊", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "没读懂全书就提炼不出主干，梗概必须建立在对全书的理解上。" },
      { answer: 0, explain: "梗概回答「这本书讲了什么」，是内容的主干，不是感想或作者故事。" },
      { answer: 2, explain: "梗概要简洁，细节描写属于枝叶，提炼主干时要大胆删去。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "梗概只讲作品内容，不写自己的感受，那是读后感的事。" },
      { answer: 1, explain: "先弄清谁做了什么、事情怎么发展，才能挑出推动故事的主要情节。" },
      { answer: 0, explain: "梗概用连贯的话把大意说清即可，不必华丽铺陈，也不是越长越好。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "梗概和缩写都是减法，保留主干、删去细节；感受类内容都不写。" },
      { answer: 2, explain: "梗概里的人物结合他做的事介绍才清楚，不必单写一大段外貌。" },
      { answer: 1, explain: "梗概的目的是让人快速了解作品大意，没读过的人能看懂就是好梗概。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "梗概讲作品里发生了什么，自己的评价属于读后感，一般不写进来。" },
      { answer: 0, explain: "故事的结果要有头有尾，梗概里要交代清楚，不能省略或随意改写。" },
      { answer: 2, explain: "情节太多时抓最能推动故事发展的主要几条，不必面面俱到。" },
      { answer: 0, explain: "写完核对主要情节是否齐全、细节和感想是否删净，像不像梗概。" },
      { answer: 1, explain: "写梗概就是读懂全书、提主干、删细节、连成连贯短文。" }
    ]
  }
};

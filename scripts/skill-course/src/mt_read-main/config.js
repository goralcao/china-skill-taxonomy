var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "起疑", "取证", "连一连", "中测1", "对齐", "说清", "中测2", "换文", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "概括要用尽可能少的话说清主要内容，既不漏重点，也不堆细节。" },
      { answer: 0, explain: "先逐段提炼大意，再把各段意思连成通顺的几句话。" },
      { answer: 2, explain: "时间、地点、人物、起因、经过、结果这六要素，是记事文的主干。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "概括要落到具体的人和事，不能只给一个笼统的感受。" },
      { answer: 1, explain: "细节是为内容服务的，概括时保留主干，细节大胆删。" },
      { answer: 0, explain: "好的概括有人物、有事件、有结果，且简洁；另两项一个太空、一个太繁。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "起因回答「为什么」，经过回答「怎么样」，结果回答「最后如何」。" },
      { answer: 2, explain: "回文核对能发现漏掉的重点或误加的细节，是概括的收口一步。" },
      { answer: 1, explain: "段意连起来要通顺连贯，适当加连接词，读起来才像一段话。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "段意要读懂后提炼，不能机械照抄首句，因为中心句可能在段中或段末。" },
      { answer: 0, explain: "概括抓主干、求简洁；复述讲究把过程讲具体，二者详略不同。" },
      { answer: 2, explain: "说明文围绕一个对象展开，概括要抓对象及其主要特征。" },
      { answer: 0, explain: "主要内容以事件为骨架，情感是附着其上的，点到即可。" },
      { answer: 1, explain: "能把一篇长文讲成几句清楚的话，才是真读懂了。" }
    ]
  }
};

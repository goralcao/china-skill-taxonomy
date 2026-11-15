var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "起疑", "取证", "连一连", "中测1", "对齐", "说清", "中测2", "换文", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "用词、句式、修辞是赏析的三个常见角度，页数与语言妙处无关。" },
      { answer: 0, explain: "「绿」活用作动词，让春风的作用和春天的生机都动了起来。" },
      { answer: 2, explain: "赏析要把「好」落成「写出了什么、有什么效果」，否则就是空话。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "比喻用熟悉的事物打比方，让读者更容易想象、更有画面感。" },
      { answer: 1, explain: "用「像……一样」把跑的速度比作风，是比喻；拟人是把物当人写。" },
      { answer: 0, explain: "拟人赋予事物人的动作情感，让表达更生动、更有感染力。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "排比用结构相似的句式连说，节奏鲜明、气势增强。" },
      { answer: 2, explain: "两句结构对称、形成对比，是句式角度的妙处。" },
      { answer: 1, explain: "替换比较能让人感到原词的分寸感，是体会用词之妙的好办法。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "借鉴是学方法而非抄句子，生搬硬套反而失去自己的表达。" },
      { answer: 0, explain: "「唱歌」「跑」是人的动作，赋予小溪，是拟人。" },
      { answer: 2, explain: "赏析聚焦表达技巧的效果，体会聚焦文字里的情感，关注点不同。" },
      { answer: 0, explain: "具体的赏析指出词、说明效果；「很美」「真厉害」都是空评价。" },
      { answer: 1, explain: "赏析是把「好」说清楚，并把它变成自己的表达能力。" }
    ]
  }
};

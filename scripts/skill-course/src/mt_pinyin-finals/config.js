var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "看一看", "连一连", "中测1", "摆一摆", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "一横平平的，是一声；一声平，读得又高又平。" },
      { answer: 1, explain: "一声、二声、三声、四声，一共四个。轻声不算一个声调。" },
      { answer: 1, explain: "调号标在韵母上，因为管高低的是韵母；声母只管开头，又轻又短。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 1, explain: "往上扬的是二声，像在问「啊？」" },
      { answer: 0, explain: "三声先往下再往上，中间拐一个弯，读得最长。" },
      { answer: 1, explain: "一横就是一声，平平地拖住，不高不低。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 2, explain: "从高到低往下落的是四声，短促有力。" },
      { answer: 2, explain: "ǎ 上面是个小拐弯，先降后升。" },
      { answer: 2, explain: "标在 a 上。m 是声母，不戴调号。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "一平、二升、三拐弯、四降，顺序是 ˉ ˊ ˇ ˋ。" },
      { answer: 1, explain: "é 往上扬，是二声；「鹅」就读 é。" },
      { answer: 0, explain: "声母又轻又短，声音的高低全靠后面的韵母拖住。" },
      { answer: 2, explain: "都是 i，只是调号不同：ǐ 三声，ì 四声，意思也会跟着变。" },
      { answer: 0, explain: "手跟着调型走一遍，耳朵才分得清平、升、拐、降。" }
    ]
  }
};

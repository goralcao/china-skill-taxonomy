var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "起意", "搭骨架", "连一连", "中测1", "起草", "改", "中测2", "出刊", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "称呼顶格写表示尊敬，后面用冒号引出正文。" },
      { answer: 0, explain: "署名和日期写在信的末尾右下方，先署名、再写日期。" },
      { answer: 2, explain: "看对象定语气，给长辈要尊敬有礼。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "留言条用于告诉对方一件简短的事，讲清谁、何时、何事。" },
      { answer: 1, explain: "通知要让读者知道何时何地做什么，三样缺一不可。" },
      { answer: 0, explain: "「此致敬礼」是信末的祝语，表达礼貌。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "对象和目的决定内容与语气，先想清楚再动笔。" },
      { answer: 2, explain: "正文写清要沟通的事情，把意思说明白。" },
      { answer: 1, explain: "留言条要写清时间、地点、事情，含糊的话达不到目的。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "应用文为解决实际问题而写，有固定格式；记叙文重在叙事抒情，二者目的不同。" },
      { answer: 0, explain: "书信写完先核对格式是否齐全、事情是否说清，格式错或事不清就达不到目的。" },
      { answer: 2, explain: "冒号用在称呼后，提示下面就是正文，是书信格式的固定写法。" },
      { answer: 0, explain: "面对全校同学这样的正式对象，通知要正式、清楚、简明，不能像私下聊天。" },
      { answer: 1, explain: "应用文的核心是看对象、守格式、把事说清，写完再核对一遍。" }
    ]
  }
};

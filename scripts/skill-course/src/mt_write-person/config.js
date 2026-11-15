var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "起意", "搭骨架", "连一连", "中测1", "起草", "改", "中测2", "出刊", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "人物的性格品质要靠事例和动作语言来显，空贴标签没有说服力。" },
      { answer: 0, explain: "用动作和语言把礼貌写出来，读者自然相信。" },
      { answer: 2, explain: "外貌描写要抓特征、服务人物特点，不是流水账式罗列。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "人物的话要像本人说的，符合身份和场合，才真实。" },
      { answer: 1, explain: "「弯腰捡起」是动作，能让读者看见人物在做什么。" },
      { answer: 0, explain: "事例要贴切，最能显出特点的那一件才有说服力。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "神态描写写的是脸上的表情，不是衣着或住址。" },
      { answer: 2, explain: "「眼睛不大却亮亮的」抓住外貌里最有神的一处，显出人物精神，不是写成绩或爱好。" },
      { answer: 1, explain: "开头先给人一个鲜明印象，读者才有兴趣读下去，比写天气或抄名言更抓人。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "「勤劳」要靠具体事例证明，早起做饭、收拾家正是最贴切的材料。" },
      { answer: 0, explain: "用事例说话，读者能从人物做的事里自己看出特点，比贴标签更真实可信。" },
      { answer: 2, explain: "写人物心里想什么属于心理描写，与动作、外貌描写各管一方面。" },
      { answer: 0, explain: "各种描写常综合使用，共同为表现人物和主旨服务。" },
      { answer: 1, explain: "把人写活，靠的是事例和细节，不是标签。" }
    ]
  }
};

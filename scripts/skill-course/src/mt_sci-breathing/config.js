var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "空气通常从鼻进入呼吸道。" },
      { answer: 1, explain: "空气经鼻→咽→喉→气管→肺。" },
      { answer: 2, explain: "肺泡进行氧气和二氧化碳的交换。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "细胞呼吸产生二氧化碳，由肺排出。" },
      { answer: 1, explain: "消化从口腔开始，牙齿咀嚼、唾液初步消化。" },
      { answer: 2, explain: "小肠内壁有大量绒毛，是吸收营养的主要场所。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "胃储存食物、分泌胃液初步消化。" },
      { answer: 1, explain: "食物经食道进入胃，气管是空气通道。" },
      { answer: 2, explain: "充分咀嚼减轻胃肠负担，也防呛噎。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "不吸烟、避粉尘，保护肺和呼吸道。" },
      { answer: 1, explain: "吃饭打闹容易让食物进气管，发生呛噎。" },
      { answer: 2, explain: "饭后血液流向胃肠助消化，剧烈运动不利。" },
      { answer: 0, explain: "鼻腔能过滤灰尘、湿润温暖空气。" },
      { answer: 1, explain: "肺是呼吸器官；胃、小肠是消化器官。" }
    ]
  }
};

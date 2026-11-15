var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "图书馆是室内房间，用 in the library。" },
      { answer: 0, explain: "操场是开阔场地，习惯用 on the playground。" },
      { answer: 2, explain: "Where + is + 名词，问地点用 Where。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "楼层用 on the + 序数词 + floor，如 on the second floor。" },
      { answer: 1, explain: "library 图书馆，lab 实验室，canteen 食堂。" },
      { answer: 0, explain: "canteen 是吃饭的地方；computer room 是电脑室。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "next to 是「紧邻」；across from 才是在对面。" },
      { answer: 2, explain: "teachers' 是复数名词的所有格，表示「老师们的」。" },
      { answer: 1, explain: "问地点要答位置，如 on the first floor。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "美式 first floor 就是一楼；英式 ground floor 才是一楼。" },
      { answer: 0, explain: "hospital 是社区里的医院，library 是借书看书的场所。" },
      { answer: 2, explain: "电脑室里是 computers，图书馆里才是 books。" },
      { answer: 0, explain: "next to 表紧邻，正好说两个场所挨着。" },
      { answer: 1, explain: "放进 Where is ... / on the ... floor 的句子里、对着校园说，才算会用。" }
    ]
  }
};

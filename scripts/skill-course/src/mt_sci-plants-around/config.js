var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "绿萝会自己生长，是植物；小狗是动物，云不是生物。" },
      { answer: 1, explain: "绿色开花植物一般有根、茎、叶、花、果实、种子六部分。" },
      { answer: 2, explain: "根大多长在地下，扎进泥土吸水和养分。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "萝卜是肥大的根，储存着养分。" },
      { answer: 1, explain: "土豆是长在地下的茎，叫块茎，上面有芽眼。" },
      { answer: 2, explain: "叶长在茎的节上，接受阳光制造养分。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "光滑粗糙用手摸；鼻子闻气味，耳朵听声音。" },
      { answer: 1, explain: "用手轻扇、少量闻，不能猛吸，更不能用舌头尝。" },
      { answer: 2, explain: "按顺序观察、如实记录，还要爱护植物不采摘。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "根、茎、叶是植物器官；翅爪鳍鳞是动物的。" },
      { answer: 1, explain: "花传粉后结出果实、胚珠变种子，用来繁殖。" },
      { answer: 2, explain: "生长、发芽、开花是生命活动，颜色绿不一定活着。" },
      { answer: 0, explain: "记录要如实，区分「看到的」和「想到的」。" },
      { answer: 1, explain: "浇水、不踩踏是爱护，采摘会伤害植物。" }
    ]
  }
};

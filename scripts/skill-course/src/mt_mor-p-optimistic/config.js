var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "喜怒哀惧都是常见情绪。" },
      { answer: 1, explain: "情绪本身无好坏，表达方式才重要。" },
      { answer: 2, explain: "倾诉能缓解不良情绪。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "运动、转移注意等能调节情绪。" },
      { answer: 1, explain: "先冷静，不用伤害方式。" },
      { answer: 2, explain: "迁怒别人不对，要学会调节。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "适当哭泣是正常表达，不必羞耻。" },
      { answer: 1, explain: "乐观让人勇于面对。" },
      { answer: 2, explain: "用语言表达更健康。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "转移注意能缓解坏心情。" },
      { answer: 1, explain: "关心朋友，帮助他度过。" },
      { answer: 2, explain: "冷静能避免冲动犯错。" },
      { answer: 0, explain: "伤害自己不可取，要健康调节。" },
      { answer: 1, explain: "接纳情绪、积极面对才健康。" }
    ]
  }
};

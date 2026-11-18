var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "种子萌发需要水、空气、适宜温度，不一定需要土壤。" },
      { answer: 1, explain: "种子一般先突破种皮长出根。" },
      { answer: 2, explain: "光合作用需要阳光、水和二氧化碳。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "适量水和阳光有利生长，积水会烂根。" },
      { answer: 1, explain: "连续观察、画图加数据记录才可靠。" },
      { answer: 2, explain: "花经过传粉结出果实和种子。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "高度是长度，用厘米等长度单位。" },
      { answer: 1, explain: "种子萌发需要空气，泡水里缺氧会烂。" },
      { answer: 2, explain: "根吸收水分养分并固定植物。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "高度增加说明植物在不断生长。" },
      { answer: 1, explain: "植物生长需要阳光、水、空气、适宜温度，不必需音乐。" },
      { answer: 2, explain: "移栽伤根、缺水会萎蔫，要缓苗。" },
      { answer: 0, explain: "只改变水这一个条件，其他保持相同。" },
      { answer: 1, explain: "长出新叶是生长的明显表现。" }
    ]
  }
};

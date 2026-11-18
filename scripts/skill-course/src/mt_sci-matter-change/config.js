var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "有新物质生成是化学变化的本质特征。" },
      { answer: 1, explain: "冰融化只改变状态，没有新物质。" },
      { answer: 2, explain: "蜡烛燃烧生成二氧化碳等新物质。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "铁锈是新物质，属于化学变化。" },
      { answer: 1, explain: "只改变形状，没有新物质。" },
      { answer: 2, explain: "化学变化常伴随发光发热、变色、产生气体等。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "没有新物质生成，是物理变化。" },
      { answer: 1, explain: "冒泡说明产生了新气体，是化学变化。" },
      { answer: 2, explain: "水的状态变化可逆；燃烧、生锈不易复原。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "切碎只改形状，腐烂生成新物质。" },
      { answer: 1, explain: "食物变质生成新物质，是化学变化。" },
      { answer: 2, explain: "只有生成新物质才能确定是化学变化。" },
      { answer: 0, explain: "只是形状改变，是物理变化。" },
      { answer: 1, explain: "要分析本质，看是否有新物质生成。" }
    ]
  }
};

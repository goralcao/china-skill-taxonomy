var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "能互相划出痕迹可比较硬度。" },
      { answer: 1, explain: "花岗岩坚硬，常用来做建筑材料。" },
      { answer: 2, explain: "表层土含腐殖质，颜色较深、较肥沃。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "动植物残体腐烂分解形成腐殖质。" },
      { answer: 1, explain: "土壤固定植物并提供水和养分。" },
      { answer: 2, explain: "土壤由矿物质、腐殖质、水、空气组成。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "按颗粒、颜色、硬度等特征给岩石分类。" },
      { answer: 1, explain: "水土流失带走表层肥沃土壤，使土地贫瘠。" },
      { answer: 2, explain: "砂岩由砂粒胶结而成，颗粒明显。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "植被能固土，防止水土流失。" },
      { answer: 1, explain: "岩石经风化、生物作用，长期变成土壤。" },
      { answer: 2, explain: "土壤颗粒间有孔隙，含空气和水。" },
      { answer: 0, explain: "只改变颗粒大小，其他条件相同。" },
      { answer: 1, explain: "岩石可做建材、工艺品，不是直接肥料。" }
    ]
  }
};

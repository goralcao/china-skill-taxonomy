var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "工具能提高效率、省力方便。" },
      { answer: 1, explain: "杠杆能省力。" },
      { answer: 2, explain: "技术是为满足需求、解决问题而产生。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "锤子是钉钉子的合适工具。" },
      { answer: 1, explain: "新需求推动工具改进。" },
      { answer: 2, explain: "放大镜放大细小物体便于观察。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "滑轮（尤其动滑轮）能省力提升重物。" },
      { answer: 1, explain: "根据任务需要选合适工具。" },
      { answer: 2, explain: "微风是自然现象，不是人造工具。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "合适工具能提高效率。" },
      { answer: 1, explain: "许多发明来自对生活需求的观察和思考。" },
      { answer: 2, explain: "能解决问题、方便好用才是好工具。" },
      { answer: 0, explain: "提升功能、安全性的改进更有意义。" },
      { answer: 1, explain: "按规范使用工具，注意安全。" }
    ]
  }
};

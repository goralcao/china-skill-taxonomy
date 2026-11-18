var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "颜色用眼睛看；耳朵听声音，手掂轻重。" },
      { answer: 1, explain: "「红色」是看到的；「觉得香」是想法，要闻过才算。" },
      { answer: 2, explain: "先整体后细节、按顺序观察才不遗漏。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "画图加文字能把发现留住，方便比较。" },
      { answer: 1, explain: "轻扇少量闻，保护鼻子。" },
      { answer: 2, explain: "光滑粗糙是手摸出来的，属于触觉。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "「一定好吃」是猜想；「三个角」是看到的。" },
      { answer: 1, explain: "科学观察要把事实和想法分开，这才准确。" },
      { answer: 2, explain: "不认识的、尖锐的不能乱摸，安全第一。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "如实记录每次结果，再找原因，这才是科学态度。" },
      { answer: 1, explain: "眼耳鼻舌手（皮肤）能帮我们感知世界。" },
      { answer: 2, explain: "「边缘有锯齿」是看到的，属于事实描述。" },
      { answer: 0, explain: "带着问题有计划地观察，收获更大。" },
      { answer: 1, explain: "如实记录、按顺序观察，是科学观察的基本功。" }
    ]
  }
};

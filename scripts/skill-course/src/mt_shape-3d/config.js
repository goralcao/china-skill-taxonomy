var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 2, explain: "球没有平平的面，能到处滚；正方体、长方体有平面，滚不动。" },
      { answer: 0, explain: "骰子六个面都是正方形，是正方体。" },
      { answer: 1, explain: "易拉罐上下是圆面、侧面弯弯，像圆柱。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "正方体有 6 个面，每个面都是正方形。" },
      { answer: 0, explain: "圆柱上下是两个一样大的圆。" },
      { answer: 1, explain: "魔方各面都是正方形，是正方体。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 2, explain: "球能到处滚，圆柱能沿一个方向滚；正方体、长方体有平面不易滚。" },
      { answer: 0, explain: "正方体六个面都是一样的正方形。" },
      { answer: 1, explain: "牙膏盒六个面多是长方形，是长方体。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 2, explain: "篮球是球，能到处滚。" },
      { answer: 0, explain: "长方体有 6 个面，相对的面一样大。" },
      { answer: 1, explain: "圆柱侧面是弯的，球整个是曲面。" },
      { answer: 2, explain: "冰箱是长方体。" },
      { answer: 0, explain: "它们都有 6 个平平的面，都不易滚。" }
    ]
  }
};

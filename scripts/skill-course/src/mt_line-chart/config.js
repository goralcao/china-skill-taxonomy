var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "读图", "看走向", "连一连", "中测1", "画与选", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "点的高低直接表示当天的数量，最高点就是最大值。" },
      { answer: 2, explain: "线往上走表示后面的数值比前面大，也就是增加。" },
      { answer: 1, explain: "折线图用线的升降专门表示变化趋势；条形图更擅长比大小。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 1, explain: "26℃ 是最大值，出现在第 5 天，也就是周五。" },
      { answer: 2, explain: "26 − 23 = 3，线往上走，气温上升 3℃。" },
      { answer: 0, explain: "线水平说明纵轴数值没变，两天数量相等。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "周一到周五总体升到 26℃，之后回落到 21℃，是先升后降。" },
      { answer: 1, explain: "比大小用条形图；折线图的优势是表示随时间的增减变化。" },
      { answer: 2, explain: "陡缓看的是相邻两点的差，不是点的绝对高低。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "纵轴表示数量，点的纵坐标就是那天的数值。" },
      { answer: 2, explain: "18 − 12 = 6，后一点更高，线向上走。" },
      { answer: 1, explain: "随时间连续变化、要看升降趋势，用折线统计图。" },
      { answer: 2, explain: "周三 24 → 周四 35 升 11 杯，比 6 杯和 7 杯都多。" },
      { answer: 0, explain: "线水平就是两点一样高，数量没有变化，相差 0。" }
    ]
  }
};

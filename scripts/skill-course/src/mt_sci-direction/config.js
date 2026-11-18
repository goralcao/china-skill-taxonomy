var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "太阳东升西落，早晨从东方升起。" },
      { answer: 1, explain: "傍晚太阳在西方落下。" },
      { answer: 2, explain: "早晨面向太阳就是面向东。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "常见指南针红色端指北。" },
      { answer: 1, explain: "东西相对，东的对面是西。" },
      { answer: 2, explain: "南北相对，南的对面是北。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "我国大部分地区正午太阳在南方，影子朝北。" },
      { answer: 1, explain: "光沿直线传播，影子出现在背光一侧。" },
      { answer: 2, explain: "白天可利用太阳东升西落辨别大致方向。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "北极星几乎正对北方，可用来定向。" },
      { answer: 1, explain: "一般地图按上北下南、左西右东绘制。" },
      { answer: 2, explain: "面向北，右东左西，后面是南。" },
      { answer: 0, explain: "南侧光照充足，树木生长快，年轮较宽。" },
      { answer: 1, explain: "磁铁、铁器会干扰磁针，使用时要远离。" }
    ]
  }
};

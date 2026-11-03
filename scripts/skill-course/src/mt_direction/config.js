// ===== 配置块 =====
var PAGE_IDS = ['p0','p1','p2','p3','p3b','p4','p5','p6','p7','p8','p9','p10'];
var PAGE_LABELS = ['封面','前测','看太阳','四方向','连一连','中测1','说位置','仿真','中测2','辨析','后测','总结'];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: '太阳东升西落，升起的方向是东。选西正好反了；选北不是日出的方向。' },
      { answer: 1, explain: '地图约定「上北下南」，上面是北。选南把上下弄反了；选东是右边。' },
      { answer: 0, explain: '面向北，右手边是东。选西是左右弄反；选南在你背后。' }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 1, explain: '地图约定「上北下南」，下方是南。选北把上下弄反；选西是左边。' },
      { answer: 0, explain: '面向东，左手边是北（右手是南）。选南是右手；选西在背后。' },
      { answer: 1, explain: '太阳从西边落下。选东是升起；选南不是日落方向。' }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 1, explain: '小明家在学校东边，反过来学校就在小明家的西边。相对方向正好相反。' },
      { answer: 0, explain: '向北 3 格再向东 2 格，最后在起点的东北方向（上北、右东）。选西北把东西弄反。' },
      { answer: 0, explain: '左上角 = 左（西）+ 上（北）= 西北。选东北是右上角；选西南是左下角。' }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: '太阳东升西落，升起在东方。选西正好反了；选南不是日出方向。' },
      { answer: 1, explain: '地图「左西右东」，右方是东。选西是左边；选北是上方。' },
      { answer: 0, explain: '面向南，左手边是东（右手是西）。选西是右手；选北在背后。' },
      { answer: 1, explain: 'A 在 B 的北边，反过来 B 就在 A 的南边。相对方向相反。' },
      { answer: 0, explain: '从家向东 2 格再向北 1 格，目的地在家的东北；反过来家就在目的地的西南。' }
    ]
  }
};

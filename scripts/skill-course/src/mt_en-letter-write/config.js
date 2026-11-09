var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "四线三格：四条线夹出上、中、下三个格，别数成三条。" },
      { answer: 0, explain: "大写一律占上、中两格，顶第一线、落第三线。" },
      { answer: 2, explain: "a c e m n o r s u v w x z 无辫无尾，只占中格。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "g p q y 有尾，尾巴要垂到第三格，别缩回中格。" },
      { answer: 1, explain: "b d f h k l 有向上的辫，占上、中两格。" },
      { answer: 0, explain: "j 的点在上格、竖勾伸到下格，是唯一占满三格的小写字母。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "先看老师写，再用手在空中比划，然后描红，最后自己写。" },
      { answer: 2, explain: "启蒙期养成的错笔顺很难纠正，直接影响以后单词连写和速度。" },
      { answer: 1, explain: "i、t 的主体在中格，点或横略过第二线，算中上一格半。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "a c e m n 无辫无尾；b d h k 有辫，g p q y 有尾。" },
      { answer: 0, explain: "大写位置固定，小写分三类，占格最容易记混。" },
      { answer: 2, explain: "b 先竖、半圆在右；d 先半圆、竖在右。笔顺加方向都能帮你分清。" },
      { answer: 0, explain: "第三线是基线，a c e 这些字母稳稳落在它上面。" },
      { answer: 1, explain: "对照范字找出出格的那一笔，比机械抄十遍有用。" }
    ]
  }
};

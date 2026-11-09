var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "red 红、blue 蓝、green 绿，三个颜色别混。" },
      { answer: 0, explain: "one two three… 三是 three，不是 two。" },
      { answer: 2, explain: "colour 是颜色；问数量用 How many，问年龄用 How old。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "英语里颜色形容词放在名词前：a red apple。" },
      { answer: 1, explain: "eight 是 8，中间有不发音的 gh，别和 three 混。" },
      { answer: 0, explain: "yellow 黄；seven 是数字，pencil 是文具。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "How many 问「几个」，答 one / two / three…" },
      { answer: 2, explain: "形容词在名词前，而且 a 要放在最前面。" },
      { answer: 1, explain: "five 是 5；four 是 4，别看错词首。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "词不离句：a red apple 同时记住了词序和意思。" },
      { answer: 0, explain: "white 白、black 黑，顺序别反过来。" },
      { answer: 2, explain: "two / three / ten 都以 t 开头，正好放一组记。" },
      { answer: 0, explain: "课标一级要求在日常情境里听说认读，不是孤立背词表。" },
      { answer: 1, explain: "在数数、How old are you 这些真实问法里用，才记得住。" }
    ]
  }
};

var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "英语不分长幼，brother 统称兄弟；要区分得说 elder / younger brother。" },
      { answer: 0, explain: "英语不分父系母系，grandpa 同时指爷爷和外公。" },
      { answer: 2, explain: "mother 是妈妈，father 是爸爸，sister 是姐妹。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "This is 用来介绍近处的人，my father 是我爸爸。" },
      { answer: 1, explain: "英语不分姐妹长幼，用 my sister；「I sister」不合语法。" },
      { answer: 0, explain: "brother 本身不分长幼，靠 elder / younger 这类词补充。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "parents 是父亲和母亲的合称，正好两个人。" },
      { answer: 2, explain: "grandpa 不分父系母系；uncle 是叔舅姑父那一辈。" },
      { answer: 1, explain: "sister 指女性手足，brother 指男性手足，差别在性别。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "This is my ... 后面接「我的 + 家人称呼」才成句。" },
      { answer: 0, explain: "英语不分父系母系与叔舅，长辈男性统称 uncle。" },
      { answer: 2, explain: "family 指家庭、一家人，不是某个具体称呼。" },
      { answer: 0, explain: "brother 只说性别与关系，没说哥哥还是弟弟。" },
      { answer: 1, explain: "词放进小句子、对着真人说，才算会用；只抄只背容易忘。" }
    ]
  }
};

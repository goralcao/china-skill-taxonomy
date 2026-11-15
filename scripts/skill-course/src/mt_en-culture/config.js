var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "春节吃饺子；火鸡是感恩节，月饼是中秋节。" },
      { answer: 0, explain: "中秋节赏月吃月饼 mooncakes。" },
      { answer: 2, explain: "圣诞树是 Christmas 的标志；红包属春节。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "感恩节主菜常是火鸡 turkey。" },
      { answer: 1, explain: "节日是专有名词，首字母一律大写。" },
      { answer: 0, explain: "红包（压岁钱）是春节习俗。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "课标要求养成尊重不同文化的意识，先理解再比较。" },
      { answer: 2, explain: "Merry Christmas 是圣诞祝福；春节说 Happy Spring Festival。" },
      { answer: 1, explain: "Spring Festival 是春节，祝福语对应「春节快乐」。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "比较靠具体信息：什么时候、做什么、吃什么，不评高下。" },
      { answer: 0, explain: "月饼配中秋，别安到 Christmas 或 Thanksgiving。" },
      { answer: 2, explain: "文化知识要对应准确，习俗和节日不能串。" },
      { answer: 0, explain: "懂差异才能尊重、得体地和不同背景的人交流。" },
      { answer: 1, explain: "对照着摆，习俗就不容易张冠李戴。" }
    ]
  }
};

var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "读进去", "看出来", "连一连", "中测1", "写下来", "改一处", "中测2", "评一评", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "只知读音的字，得先把音读准，才能按音去查；读错了后面全错。" },
      { answer: 0, explain: "音序是声母的第一个字母的大写，「妈」声母 m，音序就是 M。" },
      { answer: 2, explain: "音序只看声母的第一个字母，而且要大写；不是整个音节。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "字典的音节索引不带声调，找时要把声调去掉，如 mā 找 ma。" },
      { answer: 1, explain: "音序是声母首字母大写 H；音节是整个拼音去声调 hao。" },
      { answer: 0, explain: "音序法靠读音查；知形不知音要用部首或数笔画查字法。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "同一音序（如 H）下，音节按字母顺序排列，找时要逐个比对。" },
      { answer: 2, explain: "零声母字直接取韵母第一个字母的大写，「安」是 A。" },
      { answer: 1, explain: "音节后面的括号里是页码，按它翻到正文才能看到字的写法和意思。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "同音字可能不止一个，查到后要核对，确认找到的正是自己要的那个字。" },
      { answer: 0, explain: "音序只取声母首字母大写 C（ch 是声母，首字母是 c）；音节去声调是 chi。" },
      { answer: 2, explain: "音序法完全依赖读音，音读错，音序和音节都跟着错，自然找不到。" },
      { answer: 0, explain: "音节是完整的拼音但去掉声调，这样才和字典里的音节索引对得上。" },
      { answer: 1, explain: "音序查字是一套步骤：读准、认序、找节、翻页、核对，步步到位才找得准。" }
    ]
  }
};

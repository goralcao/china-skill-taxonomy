var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "字母表顺序是 A B C D…，A 后面是 B，不是 C。" },
      { answer: 0, explain: "A /eɪ/、H /eɪtʃ/、J /dʒeɪ/、K /keɪ/ 都带 /eɪ/；B C D 带的是 /iː/。" },
      { answer: 2, explain: "一个字母有大写、小写两种写法，B 和 b 都是字母 B。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "/eɪ/ 是 A 自己的名字；/æ/ 是它在 cat 里的字母音，别混。" },
      { answer: 1, explain: "cat 里的 a 读短音 /æ/，不是名称音 /eɪ/。" },
      { answer: 0, explain: "b 竖在左、半圆在右，d 竖在右、半圆在左；看结构比数笔画管用。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "G 的名称音以 /dʒ/ 开头，不是 /g/；拆成两个音更好模仿。" },
      { answer: 2, explain: "B C D G P T V 都以 /iː/ 收尾；A H J K 是 /eɪ/ 组。" },
      { answer: 1, explain: "单独指一个字母，念的是名称音；放进单词才读字母音。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "I /aɪ/ 和 Y /waɪ/ 押韵；U Q W 是 /juː/ 那一组。" },
      { answer: 0, explain: "一个字母有两套读法：单独念名字，进单词按拼读规则读。" },
      { answer: 2, explain: "q 和 p 都是圆圈加竖，只是竖的方向和圆圈位置不同。" },
      { answer: 0, explain: "字母歌把顺序和名称音编成调子，好记；笔顺要靠四线三格练。" },
      { answer: 1, explain: "音、形、序三样对上才算真认得；只抄或只唱都容易漏。" }
    ]
  }
};

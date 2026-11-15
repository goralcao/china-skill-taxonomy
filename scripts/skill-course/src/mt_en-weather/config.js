var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "It is 后接形容词 rainy；rain 是名词「雨」，不能直接放后面。" },
      { answer: 0, explain: "名词 rain 加 -y 变 rainy（下雨的），这是最常见的变形。" },
      { answer: 2, explain: "sun 是重读闭音节，先双写末尾 n 再加 -y，所以是 sunny 不是 suny。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "问天气固定用 What's the weather like? 或 How's the weather?" },
      { answer: 1, explain: "wind（风）加 -y → windy（有风的）。" },
      { answer: 0, explain: "snow 直接加 -y → snowy（下雪的）。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "hot（热）对 cold（冷）；warm 对 cool 是另一组「温/凉」。" },
      { answer: 2, explain: "cloud 直接加 -y → cloudy，不用双写。" },
      { answer: 1, explain: "warm 是暖和，cool 是凉爽，cold 是冷，别弄混。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "spring 春、summer 夏、autumn/fall 秋、winter 冬。" },
      { answer: 0, explain: "问天气要答具体天气，如 It is sunny and warm." },
      { answer: 2, explain: "weather 是天气；whether 是「是否」，water 是水，长得像别混。" },
      { answer: 0, explain: "snow 是「雪/下雪」，snowy 是「下雪的」，词性不同、位置不同。" },
      { answer: 1, explain: "放进 It is ... 的句子里、对着真实天气说，才算会用。" }
    ]
  }
};

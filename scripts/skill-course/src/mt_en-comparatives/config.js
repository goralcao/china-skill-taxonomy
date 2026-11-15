var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "比较用 than；then 是「那时」，别写混。" },
      { answer: 0, explain: "单音节词一般加 -er → taller。" },
      { answer: 2, explain: "重读闭音节双写 g 再加 -er → bigger。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "辅音 + y 结尾，变 y 为 i 加 -er → happier。" },
      { answer: 1, explain: "good 不规则变化为 better。" },
      { answer: 0, explain: "长词前加 more，不再加 -er。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "比较级只取一种：要么加 -er，要么用 more，别重复。" },
      { answer: 2, explain: "比较结构固定用 than。" },
      { answer: 1, explain: "much taller 高得多；very 不能修饰比较级。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "两者比较，且比较对象要对等（身高对身高）。" },
      { answer: 0, explain: "单音节加 -er → longer。" },
      { answer: 2, explain: "bad 不规则变化为 worse。" },
      { answer: 0, explain: "that one 代指同类单数名词，避免重复，保证比较对象对等。" },
      { answer: 1, explain: "对着真实的两个对象说，才把 -er、than、比较对象连起来。" }
    ]
  }
};

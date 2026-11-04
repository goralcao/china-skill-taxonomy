var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "分钱", "余数换单位", "连一连", "中测1", "商不变", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "9 ÷ 4 = 2 余 1。选 B 商太小；选 C 分不出 3 元，4 × 3 = 12 超了。" },
      { answer: 1, explain: "1 元 = 10 角。选 A 是把 1 元当成 1 角；选 C 多乘了 100。" },
      { answer: 0, explain: "10 ÷ 4 = 2 余 2，还分不完就继续换更小的单位。选 B 直接给了小数，还没到那一步。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "3 × 13 = 39，余 1。选 B 商少了一位；选 C 以为正好分完，其实差 1 元。" },
      { answer: 1, explain: "1 元 = 10 角。选 A 把元当成了角；选 C 是换成分的结果。" },
      { answer: 0, explain: "商写在被除数正上方，小数点自然对齐。选 B 除数根本没有小数点；选 C 会让整个商差十倍。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "两边同时乘 10。选 B 只变了被除数；选 C 只把除数乘了 100。" },
      { answer: 1, explain: "45 ÷ 9 = 5。选 A 把商缩小了 10 倍；选 C 放大了 10 倍。" },
      { answer: 1, explain: "除数两位小数要乘 100，被除数必须同时乘 100。选 A 商就被放大了 100 倍。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "商写在被除数正上方，对齐是自然结果。选 B 会让位数错位；选 C 算完就不知道该点几位。" },
      { answer: 1, explain: "40 ÷ 3 = 13 余 1，15 角 ÷ 3 = 5 角 → 13.5。选 A 小数点错位；选 C 忘了点。" },
      { answer: 1, explain: "两边乘 10 得 72 ÷ 9 = 8。选 A 只变了除数；选 C 多乘了 10。" },
      { answer: 0, explain: "36 ÷ 8 = 4 余 4，添 0 得 40 ÷ 8 = 5 → 0.45。选 B 小数点错位；选 C 忘了点。" },
      { answer: 0, explain: "84.6 ÷ 3 = 28.2。选 B 小数点错位；选 C 忘了点小数点，三个人要付八百多，明显不对。" }
    ]
  }
};

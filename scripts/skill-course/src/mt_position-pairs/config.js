var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "电影票", "先列后行", "连一连", "中测1", "行列规律", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "两个数换个次序，听起来就是另一个座位。位置描述必须约定先后。" },
      { answer: 0, explain: "列和行是两个方向，先定一个再定另一个；教材统一规定先列后行。" },
      { answer: 1, explain: "列和层是两个方向，2 列 3 层与 3 列 2 层是两个不同的柜门。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 1, explain: "前一个是列，后一个是行。选 A 把两个数都说反了；选 C 只把列行调了个头。" },
      { answer: 0, explain: "先列后行写 (7, 3)。选 B 是先写行后写列；选 C 把逗号写成了小数点，那不是数对。" },
      { answer: 1, explain: "次序换了位置就换。选 A 只看到两个数相同；选 C 忽略了数对本身就是位置。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "列不变，变的是行 → 第一个数相同。选 B 说的是同一行的情况。" },
      { answer: 1, explain: "往右是列变大、行不变 → (8, 3)。选 A 把左右当成了上下；选 C 是往左移。" },
      { answer: 2, explain: "先列后层 → (2, 3)。选 A 顺序反了；选 B 写成了小数。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "a 是第一个数，管左右方向，就是列。选 A 把次序记反了。" },
      { answer: 0, explain: "先列后行 → (6, 2)。选 B 顺序反了；选 C 写成了小数。" },
      { answer: 1, explain: "同一行第二个数相同 → 必须是 (?, 5)。选 A 是同一列；选 C 两个数都变了。" },
      { answer: 0, explain: "同一列第一个数相同 → 必须是 (4, ?)。选 B 是同一行；选 C 是换到对角。" },
      { answer: 0, explain: "组是列、排是行，先组后排 → (3, 4)。选 B 把排当成了列；选 C 写成了小数。" }
    ]
  }
};

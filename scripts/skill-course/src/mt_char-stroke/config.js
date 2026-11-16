var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "读进去", "看出来", "连一连", "中测1", "写下来", "改一处", "中测2", "评一评", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "「十」先横后竖，符合「先横后竖」的规则，写出来才稳。" },
      { answer: 0, explain: "横和竖交叉时，一般先写横再写竖，如十、干、王。" },
      { answer: 2, explain: "「人」先撇后捺，第一笔是撇，第二笔是捺。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "㇏是捺，从左往右下方舒展地写；丿是撇，方向相反。" },
      { answer: 1, explain: "有撇有捺的字一般先撇后捺，如人、八、大、天。" },
      { answer: 0, explain: "「三」由上到下写三横，符合「从上到下」的规则。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "左右结构的字一般先左后右，「们」先写亻，再写门。" },
      { answer: 2, explain: "「一」是横，从左往右写；竖是丨，点是丶。" },
      { answer: 1, explain: "笔顺让运笔连贯、字形端正，也不容易漏掉笔画。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "「小」先写中间的竖钩，再写两边的点，属先中间后两边。" },
      { answer: 0, explain: "「十」先横后竖对；「人」应是先撇后捺，不能先捺后撇。" },
      { answer: 2, explain: "上下结构的字（如三、早、花）一般从上往下写。" },
      { answer: 0, explain: "「口」第一笔是竖（左竖），再写横折，最后封口横。" },
      { answer: 1, explain: "写字先认笔画，再守笔顺规则，一笔一画写端正，字才好看又好认。" }
    ]
  }
};

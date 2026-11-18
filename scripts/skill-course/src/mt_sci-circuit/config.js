var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "电流要流经灯泡形成闭合回路，灯才亮。" },
      { answer: 1, explain: "最简单电路由电源、导线、用电器、开关组成。" },
      { answer: 2, explain: "电池提供电能，是电源。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "不经过用电器直接连两极是短路，很危险。" },
      { answer: 1, explain: "开关断开，电流不通，是断路。" },
      { answer: 2, explain: "金属铜容易导电，是导体。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "干燥木棒不易导电，是绝缘体。" },
      { answer: 1, explain: "小灯泡是用电器，把电能变成光和热。" },
      { answer: 2, explain: "水导电，湿手操作容易触电。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "先断电再施救，不能直接用手拉触电者。" },
      { answer: 1, explain: "串联电路一处断开，整个电路都不通。" },
      { answer: 2, explain: "电池正极为＋、负极为－。" },
      { answer: 0, explain: "适当增加电压灯泡更亮，但不可超过额定值。" },
      { answer: 1, explain: "连接时开关断开，检查无误后再闭合，保证安全。" }
    ]
  }
};

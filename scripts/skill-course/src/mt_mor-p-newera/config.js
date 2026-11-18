var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "这一时期取得历史性成就。" },
      { answer: 1, explain: "航天是我国自主创新重大成就。" },
      { answer: 2, explain: "我国脱贫攻坚取得全面胜利。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "中国梦本质是实现民族复兴。" },
      { answer: 1, explain: "绿水青山就是金山银山。" },
      { answer: 2, explain: "成就增强民族自豪感。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "个人成长融入国家发展。" },
      { answer: 1, explain: "成就来自自主创新与奋斗。" },
      { answer: 2, explain: "中国梦靠大家共同奋斗。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "少年强则国强。" },
      { answer: 1, explain: "成就是真实的历史事实。" },
      { answer: 2, explain: "中国梦内涵丰富。" },
      { answer: 0, explain: "自信但不自满。" },
      { answer: 1, explain: "个人与国家同频共振。" }
    ]
  }
};

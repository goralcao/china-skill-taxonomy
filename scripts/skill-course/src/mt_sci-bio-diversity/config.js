var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "生物多样性包括物种、基因和生态系统三个层次。" },
      { answer: 1, explain: "同种生物不同品种体现基因多样性。" },
      { answer: 2, explain: "保护栖息地、保护生态是根本措施。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "自然保护区保护珍稀生物和生态环境。" },
      { answer: 1, explain: "不同的生态系统体现生态多样性。" },
      { answer: 2, explain: "生物多样性提供资源并维持生态平衡。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "滥捕滥杀使物种减少，破坏多样性。" },
      { answer: 1, explain: "每种生物都有其作用，共同维持平衡。" },
      { answer: 2, explain: "外来物种可能泛滥，破坏本地生态。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "不伤害、多宣传是力所能及的保护。" },
      { answer: 1, explain: "大熊猫是我国一级保护动物。" },
      { answer: 2, explain: "基因多样使物种更能适应变化、延续下去。" },
      { answer: 0, explain: "多样性减少破坏生态、减少资源。" },
      { answer: 1, explain: "保护生物多样性就是保护人类赖以生存的环境。" }
    ]
  }
};

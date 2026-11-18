var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "蚕从卵孵出，一生从卵开始。" },
      { answer: 1, explain: "蚕爱吃桑叶，吃桑叶长大。" },
      { answer: 2, explain: "蚕吐丝结茧，在茧里化蛹。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "完全变态昆虫要经过卵、幼虫、蛹、成虫四个阶段。" },
      { answer: 1, explain: "蚕蛾是蚕的成虫阶段，会产卵。" },
      { answer: 2, explain: "蝴蝶和蚕都是完全变态昆虫，都经卵、幼虫、蛹、成虫。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "蚕长大时旧皮限制生长，要蜕皮才能继续长大。" },
      { answer: 1, explain: "蜉蝣成虫寿命很短，常只有一天；龟能活很久。" },
      { answer: 2, explain: "蚕丝结茧保护蛹，人们还用它织丝绸。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "动物一生一般经历出生、生长发育、繁殖、衰老死亡。" },
      { answer: 1, explain: "蝉的幼虫在地下生活多年，爬上树才羽化。" },
      { answer: 2, explain: "蚕宝宝是幼虫，白白胖胖爱吃桑叶。" },
      { answer: 0, explain: "蚕要吃新鲜干净的桑叶，环境要清洁。" },
      { answer: 1, explain: "生命周期指生物从出生、生长、繁殖到死亡经历的全过程。" }
    ]
  }
};

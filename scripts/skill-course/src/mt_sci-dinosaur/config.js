var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "霸王龙有锋利的牙，是凶猛的肉食恐龙。" },
      { answer: 1, explain: "梁龙脖子、尾巴长，吃高处的树叶。" },
      { answer: 2, explain: "三角龙头上有三只角，像犀牛。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "恐龙已灭绝，化石是研究它的主要证据。" },
      { answer: 1, explain: "恐龙在六千多万年前灭绝了，今天看不到活的恐龙。" },
      { answer: 2, explain: "科学家认为鸟类是恐龙的后代，鸡、麻雀都与恐龙有亲缘关系。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "恐龙主要生活在中生代，包括三叠纪、侏罗纪、白垩纪。" },
      { answer: 1, explain: "严格说翼龙是会飞的爬行动物，不是恐龙。" },
      { answer: 2, explain: "恐龙遗体被泥沙掩埋，经过漫长岁月被矿物质替换成石头。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "有的恐龙只有火鸡大小，并不都巨大。" },
      { answer: 1, explain: "恐龙化石帮我们认识生命怎样演化、环境怎样变迁。" },
      { answer: 2, explain: "科学家根据骨骼化石、脚印等证据科学复原。" },
      { answer: 0, explain: "恐龙蛋化石证明恐龙像爬行动物一样产卵繁殖。" },
      { answer: 1, explain: "化石是珍贵科学资源，要保护并交给专业人士研究。" }
    ]
  }
};

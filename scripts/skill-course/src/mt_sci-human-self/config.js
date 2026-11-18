var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "眼睛是视觉器官用来看；耳朵听声音，鼻子闻气味。" },
      { answer: 1, explain: "眼、耳、鼻、舌、皮肤是五大感觉器官，膝盖不是。" },
      { answer: 2, explain: "耳朵听声音，还能帮我们保持身体平衡。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "舌头上有味蕾，能尝出甜、咸、酸、苦。" },
      { answer: 1, explain: "皮肤能感知冷热软硬疼痒，还能保护身体。" },
      { answer: 2, explain: "鼻子是呼吸通道的一部分，还能闻到气味。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "姿势端正、光线合适、定时远眺，能保护视力。" },
      { answer: 1, explain: "不乱塞、不掏耳朵、避开强噪声，才能保护耳朵。" },
      { answer: 2, explain: "器官不舒服要及时告诉老师或家长，正确处理。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "五大感觉器官是眼、耳、鼻、舌、皮肤。" },
      { answer: 1, explain: "手连着胳膊，是上肢；腿脚是下肢。" },
      { answer: 2, explain: "闻花香用鼻子，是嗅觉。" },
      { answer: 0, explain: "近视要科学矫正、注意用眼卫生，不能乱戴眼镜。" },
      { answer: 1, explain: "保持清洁、防晒防伤，才能保护皮肤。" }
    ]
  }
};

var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "引入", "概念一", "连一连", "中测1", "概念二", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "物体振动产生声音，振动停止发声停止。" },
      { answer: 1, explain: "发声的钢尺在快速振动。" },
      { answer: 2, explain: "声音传播需要介质，空气可以传声。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "太空接近真空，声音无法传播。" },
      { answer: 1, explain: "声音能在固、液、气中传播，真空不能。" },
      { answer: 2, explain: "振动频率高，音调高。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "用力大振幅大，声音更强更响。" },
      { answer: 1, explain: "轻声指音量小、声音弱。" },
      { answer: 2, explain: "强噪声会损伤听力、影响睡眠和健康。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "减少声源、阻断传播可以降噪。" },
      { answer: 1, explain: "桌面（固体）能传递声音。" },
      { answer: 2, explain: "振动的音叉接触水面会溅水，证明它在振动。" },
      { answer: 0, explain: "振幅越大声音越强。" },
      { answer: 1, explain: "音量适中、时间不过长，保护听力。" }
    ]
  }
};

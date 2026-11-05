var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "两个人一起打", "列表找规律", "连一连", "中测1", "最少几分钟", "仿真", "中测2", "辨析", "后测", "总结"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "每分钟只多 1 人，15 人就要 15 分钟。" },
      { answer: 2, explain: "第 1 分钟后 2 人知道，第 2 分钟这 2 人各通知 1 人，变成 4 人。" },
      { answer: 1, explain: "所有人每分钟都打一通，人数才能每分钟翻倍。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "2³ − 1 = 7 人；8 是含老师在内的总人数。" },
      { answer: 1, explain: "2³ = 8 人；15 是累计学生数，不是这一分钟新通知的。" },
      { answer: 0, explain: "2⁵ = 32 人，其中学生 31 人。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 2, explain: "31 + 1 = 32 = 2⁵，所以 5 分钟。" },
      { answer: 1, explain: "20 + 1 = 21 超过 16（2⁴），要按 32（2⁵）算，得 5 分钟。" },
      { answer: 0, explain: "有人闲着，那一分钟能通知的人数就少于 2ⁿ⁻¹，时间会被拉长。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 2, explain: "2⁶ − 1 = 63 人；64 是含老师的总人数。" },
      { answer: 1, explain: "63 + 1 = 64 = 2⁶，所以 6 分钟。" },
      { answer: 0, explain: "2⁴ = 16 人；31 是累计学生数。" },
      { answer: 1, explain: "2³ = 8 人，其中学生 7 人。" },
      { answer: 2, explain: "有人闲着，那一分钟能通知的人数就少了，达不到 2ⁿ。" }
    ]
  }
};

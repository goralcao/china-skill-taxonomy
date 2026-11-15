var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "起意", "搭骨架", "连一连", "中测1", "起草", "改", "中测2", "出刊", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "先定中心，选什么材料、哪里详哪里略就有了准绳，文章才不散。" },
      { answer: 0, explain: "中心句要明确表达一个意思，能统领全文。" },
      { answer: 2, explain: "与中心无关的材料再好也会冲淡主题，要坚决删去。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "详略得当就是最能表现中心的详写、次要的略写，不是平均用力。" },
      { answer: 1, explain: "判断跑题的标准是这段有没有服务中心，与长短、用词多少无关。" },
      { answer: 0, explain: "最能突出中心的材料要放在重点位置详写，才能让中心鲜明。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "中心是「勤劳」，早起操持家务正能证明，别的材料不贴这个中心。" },
      { answer: 2, explain: "全篇平均用力，重点淹没在次要内容里，中心自然不突出。" },
      { answer: 1, explain: "写完逐段回看，凡不服务中心的删或改，中心才立得住。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "题目点出范围，中心是对这个题目具体要说什么，二者紧密相连。" },
      { answer: 0, explain: "再美的段落若偏离中心也会破坏主题，要忍痛删去或改到服务中心。" },
      { answer: 2, explain: "材料堆砌、没有重点会让中心模糊，这是围绕中心写最忌讳的。" },
      { answer: 0, explain: "这一课练的就是围绕中心选材、安排详略，让重点突出。" },
      { answer: 1, explain: "围绕中心写，就是定中心、选材料、分详略、删去无关内容。" }
    ]
  }
};

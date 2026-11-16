var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "起疑", "取证", "连一连", "中测1", "对齐", "说清", "中测2", "换文", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "看封面了解书名作者，看目录知道书里有什么，便于定计划。" },
      { answer: 0, explain: "把厚书分成每天读一点，容易坚持，也能读完。" },
      { answer: 2, explain: "记人物、情节、疑问，帮助理解，读后也讲得出来。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "读后交流和复述，能加深理解，也是阅读的乐趣。" },
      { answer: 1, explain: "孙悟空、唐僧是《西游记》人物；鲁迅是作家，不是书中人物。" },
      { answer: 0, explain: "厚书难免有难读处，坚持或先跳读再补，别轻易放弃整本。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "目录列出章节标题，帮我们了解书的结构、选择先读哪部分。" },
      { answer: 2, explain: "有计划、每天读一点，厚书也能啃下来，还更有成就感。" },
      { answer: 1, explain: "整本书贵在坚持和积累，每天读、边读边记，收获最大。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "讲主要内容要抓住人物、事件和结果，别只说无关信息。" },
      { answer: 0, explain: "疑问是思考的开始，记下来，带着问题继续读，往往能找到答案。" },
      { answer: 2, explain: "整本书篇幅长、情节连贯，需要计划、坚持和读中记录。" },
      { answer: 0, explain: "读书记录记人物、情节、感受和疑问，天气与书无关。" },
      { answer: 1, explain: "读整本书：先看目录定计划，每天读一点、边读边记，读完与人交流。" }
    ]
  }
};

var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "读进去", "看出来", "连一连", "中测1", "写下来", "改一处", "中测2", "评一评", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "江、河、湖都带三点水，这个偏旁提示它们和水有关。" },
      { answer: 0, explain: "三点水「氵」是「水」作偏旁，带它的字多和水有关，如江、河、洗。" },
      { answer: 2, explain: "提手旁表示用手，打、拍、拉、提都是手的动作。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "这几个字都带木字旁，多和树木、木头有关。" },
      { answer: 1, explain: "偏旁（尤其形旁）常提示意思，帮我们把字归类、记得更牢。" },
      { answer: 0, explain: "「拍」是提手旁，表示用手拍；池是三点水，松是木字旁。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "女字旁的字多和女性、称谓有关，如妈、姐、妹、姑。" },
      { answer: 2, explain: "很多字是「形旁＋声旁」：偏旁提示意思，另一半常提示读音。" },
      { answer: 1, explain: "火字旁的字多和火、加热有关，烧、烤、炒都要用火。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "偏旁是重要线索，但字形字义演变后，有的字意思已不完全对应。" },
      { answer: 0, explain: "同偏旁的字意思常相近，成组学能发现规律、记得又快又牢。" },
      { answer: 2, explain: "言字旁和说话有关，说、话、语都带讠。" },
      { answer: 0, explain: "三点水是形旁，提示意思和水有关；读音要看另一半，不能凭偏旁猜死。" },
      { answer: 1, explain: "偏旁是识字的好帮手：看它猜意思，再把字拆成部件记，又快又牢。" }
    ]
  }
};

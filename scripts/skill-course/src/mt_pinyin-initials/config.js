var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "看一看", "连一连", "中测1", "摆一摆", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 0, explain: "声母只管开头，轻轻一带就过；拖长了会把后面的韵母盖住。" },
      { answer: 1, explain: "b 是竖在左、半圆在右下；d 是竖在右、半圆在左下。" },
      { answer: 2, explain: "声母一共 23 个。16 是整体认读音节的个数，别记混。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 0, explain: "一拖长就变成另一个音了，拼读时声母必须轻短。" },
      { answer: 1, explain: "双唇一闭再放开，就是「摸」的开头；「坡」是 p，「佛」是 f。" },
      { answer: 1, explain: "调号只戴在韵母头上，声母不戴帽子。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "b 在开头，是声母；a 是韵母，调号戴在 a 上。" },
      { answer: 2, explain: "a、o 都是韵母，只有 p 是声母。" },
      { answer: 1, explain: "两个都是竖在左，p 的半圆靠上，b 的半圆靠下。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 0, explain: "第二组是单韵母，第三组是戴了帽子的韵母，只有第一组全是声母。" },
      { answer: 1, explain: "d 的竖在右，半圆在左下；正好和 b 反过来。" },
      { answer: 2, explain: "声母一响一长，韵母就听不清了，整个音节会走样。" },
      { answer: 2, explain: "b d p q 四个就差方向和位置，先看这两样最稳。" },
      { answer: 0, explain: "看口形、轻轻读，比抄写更容易分清 b 和 p、m 和 n。" }
    ]
  }
};

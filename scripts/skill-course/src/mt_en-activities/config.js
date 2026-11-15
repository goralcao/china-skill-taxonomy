var PAGE_IDS = ["p0", "p1", "p2", "p3", "p3b", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
var PAGE_LABELS = ["封面", "前测", "听一听", "认一认", "连一连", "中测1", "描一描", "拼一拼", "中测2", "查一查", "后测", "存起来"];
var IMG_PREFIX = 'img/';
var curPage = 0;

// ===== 测验数据 =====
var QUIZZES = {
  quizPre: {
    questions: [
      { answer: 1, explain: "play + 球类运动，中间不加 the。" },
      { answer: 0, explain: "play + 乐器要加 the：play the piano / the guitar。" },
      { answer: 2, explain: "do homework 是固定搭配，不用 watch 或 make。" }
    ]
  },
  quizMid1: {
    questions: [
      { answer: 2, explain: "watch TV 是固定搭配；see 是「看见」，look 是「看」。" },
      { answer: 1, explain: "read books 用 read，别按中文「看书」用 look。" },
      { answer: 0, explain: "go + V-ing 表去做某事：go swimming / go fishing。" }
    ]
  },
  quizMid2: {
    questions: [
      { answer: 0, explain: "listen 是不及物动词，接宾语要加 to：listen to music。" },
      { answer: 2, explain: "like 后接动名词 -ing 或 to do，I like reading books. 最自然。" },
      { answer: 1, explain: "ride a bike 骑车；drive 用于开车，play 用于球类乐器。" }
    ]
  },
  quizPost: {
    questions: [
      { answer: 1, explain: "做作业 do、看电视 watch、读书 read，各有固定动词。" },
      { answer: 0, explain: "同样是 play，球类裸用、乐器加 the，这是固定规则。" },
      { answer: 2, explain: "问课余活动，答 I often play football. 这类短语。" },
      { answer: 0, explain: "I often play football. 频率副词通常放在实义动词前。" },
      { answer: 1, explain: "放进句子、对着自己真实作息说，活动短语才记得牢。" }
    ]
  }
};

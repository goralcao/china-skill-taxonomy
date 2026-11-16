  if (id === 'p2') {
    setupReveal('p2', [
      { sel: '#p2s1', anim: 'reveal-fade-up' },
      { sel: '#p2fig', anim: 'reveal-float-in-r' },
      { sel: '#p2s2', anim: 'reveal-fade-up' },
      { sel: '#p2s3', anim: 'reveal-fade-up' },
      { sel: '#p2cards', anim: 'reveal-card-grid', children: '.card', seqDelay: 110 },
      { sel: '#p2key', anim: 'reveal-fade-up' }
    ]);
  }
  if (id === 'p3') {
    setupReveal('p3', [
      { sel: '#p3s1', anim: 'reveal-fade-up' },
      { sel: '#p3fig', anim: 'reveal-float-in-r' },
      { sel: '#p3s2', anim: 'reveal-fade-up' },
      { sel: '#p3rules', anim: 'reveal-fade-up' },
      { sel: '#p3key', anim: 'reveal-fade-up' }
    ]);
  }
  if (id === 'p3b') {
    setupReveal('p3b', [{ sel: '#p3bs1', anim: 'reveal-fade-up' }]);
    initMatching('matchP3', [
      ["一般句", "谁＋做什么"],
      ["把字句", "主动＋把＋被动"],
      ["被字句", "被动＋被＋主动"],
      ["我关门", "一般句"],
      ["我把门关上", "把字句"],
      ["门被我关上", "被字句"],
      ["改写时", "动作不变"],
      ["写完读", "核对意思"]
    ], { leftTitle: "句式", rightTitle: "结构", onDone: function(){ var d=document.querySelector('#matchP3 .mq-done'); if(d) d.textContent="✓ 八处都归位了：主动被动分得清"; } });
  }
  if (id === 'p5') {
    setupReveal('p5', [
      { sel: '#p5s1', anim: 'reveal-fade-up' },
      { sel: '#p5fig', anim: 'reveal-float-in-r' },
      { sel: '#p5s2', anim: 'reveal-fade-up' },
      { sel: '#p5cards', anim: 'reveal-card-grid', children: '.card', seqDelay: 120 },
      { sel: '#p5key', anim: 'reveal-fade-up' }
    ]);
  }
  if (id === 'p6') { simBind(); simDraw(); }
  if (id === 'p8') {
    setupReveal('p8', [
      { sel: '#p8cards', anim: 'reveal-card-grid', children: '.card', seqDelay: 120 },
      { sel: '#p8key', anim: 'reveal-fade-up' },
      { sel: '#p8apply', anim: 'reveal-fade-up' }
    ]);
  }

  if (id === 'p2') { bindReadPair(); }
  if (id === 'p3') { bindAnnotate(); }
  if (id === 'p5') { bindDraft(); }
  if (id === 'p8') { bindRubric(); }
  if (id === 'p10') { updateMySentence(); }

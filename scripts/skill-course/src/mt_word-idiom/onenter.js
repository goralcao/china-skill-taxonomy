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
      ['亡羊补牢', '羊丢了赶紧修圈'],
      ['守株待兔', '放下农具死等兔子'],
      ['画蛇添足', '多此一举反而坏事'],
      ['井底之蛙', '见过的天地太小'],
      ['故事', '谁、做了什么'],
      ['意思', '想说明什么道理'],
      ['用法', '哪句话里能用'],
      ['用自己的话说', '不照抄原文']
    ], { leftTitle: '成语 / 做法', rightTitle: '它讲的事 / 它管的一格', onDone: function(){ var d=document.querySelector('#matchP3 .mq-done'); if(d) d.textContent='✓ 八处都归位了：四个成语、三格功能、一条红线'; } });
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

  if (id === 'p2') { bindIdea(); }
  if (id === 'p3') { bindBone(); }
  if (id === 'p5') { bindDraft(); }
  if (id === 'p8') { bindPublish(); }
  if (id === 'p10') { updateMyPage(); }

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
      ['可爱的', '什么样的（样子）'],
      ['毛茸茸的', '什么样的小猫（样子）'],
      ['浑身雪白', '描写颜色也是样子'],
      ['在树枝上', '在哪里（地方）'],
      ['在墙角', '在哪儿叫（地方）'],
      ['快活地', '怎样地飞（飞的样子）'],
      ['懒洋洋地', '怎样地叫（叫的样子）'],
      ['一声接一声地', '叫了多久（叫的样子）']
    ], { leftTitle: '词块', rightTitle: '它回答的问题', onDone: function(){ var d=document.querySelector('#matchP3 .mq-done'); if(d) d.textContent='✓ 八处都归位了：样子、地方、心情，各回各家'; } });
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

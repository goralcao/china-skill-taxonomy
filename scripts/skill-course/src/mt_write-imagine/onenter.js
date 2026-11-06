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
      ['起因', '故事从哪儿起'],
      ['经过', '最要紧的那一步'],
      ['结果', '后来怎么样了'],
      ['详', '经过多写几行'],
      ['略', '结果一句收住'],
      ['补一句为什么', '把前后矛盾接上'],
      ['符合角色特点', '兔子怕水就别让它游河'],
      ['读一遍', '别人能不能把三段连起来']
    ], { leftTitle: '做法 / 结构', rightTitle: '它管的事', onDone: function(){ var d=document.querySelector('#matchP3 .mq-done'); if(d) d.textContent='✓ 八处都归位了：三段结构、两条规矩、两条互评说法'; } });
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

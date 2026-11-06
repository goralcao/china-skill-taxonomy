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
      ['删', '划掉重复啰嗦的整句'],
      ['增', '补一句「我听见 / 我看见」'],
      ['调', '把段序理到读得通'],
      ['换', '把空词换成具体动作'],
      ['出声读一遍', '拗口处自己会冒出来'],
      ['点中一句才打勾', '改动落在句子上'],
      ['先说一个优点', '互评有礼貌'],
      ['再给一条建议', '指到具体那一句']
    ], { leftTitle: '做法 / 动作', rightTitle: '它管的事', onDone: function(){ var d=document.querySelector('#matchP3 .mq-done'); if(d) d.textContent='✓ 八处都归位了：四种改法、两条规矩、两条互评说法'; } });
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

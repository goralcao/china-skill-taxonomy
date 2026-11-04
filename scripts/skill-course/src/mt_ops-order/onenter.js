  if (id === 'p2') {
    setupReveal('p2', [
      { sel: '#p2s1', anim: 'reveal-fade-up' },
      { sel: '#p2fig', anim: 'reveal-float-in-r' },
      { sel: '#p2s2', anim: 'reveal-fade-up' },
      { sel: '#p2s3', anim: 'reveal-fade-up' },
      { sel: '#p2s4', anim: 'reveal-fade-up' },
      { sel: '#p2cards', anim: 'reveal-card-grid', children: '.card', seqDelay: 110 }
    ]);
  }
  if (id === 'p3') {
    setupReveal('p3', [
      { sel: '#p3s1', anim: 'reveal-fade-up' },
      { sel: '#p3fig', anim: 'reveal-fade-up' },
      { sel: '#p3rules', anim: 'reveal-fade-up' },
      { sel: '#p3key', anim: 'reveal-fade-up' }
    ]);
  }
  if (id === 'p3b') {
    setupReveal('p3b', [{ sel: '#p3bs1', anim: 'reveal-fade-up' }]);
    initMatching('matchP3', [
      ['算式里同时有乘和加', '先算乘法，再算加法'],
      ['只有加和减', '从左往右依次算'],
      ['只有乘和除', '从左往右依次算'],
      ['有小括号', '小括号里的先算'],
      ['小括号外面还有中括号', '小括号算完再算中括号'],
      ['括号里还套着括号', '由里往外一层层剥'],
      ['3 × 12 + 8', '先算 36，再加 8'],
      ['(3 + 12) × 8', '先算 15，再乘 8']
    ], { leftTitle: '遇到这种情况', rightTitle: '按什么规矩算' });
  }
  if (id === 'p5') {
    setupReveal('p5', [
      { sel: '#p5s1', anim: 'reveal-fade-up' },
      { sel: '#p5fig', anim: 'reveal-fade-up' },
      { sel: '#p5rules', anim: 'reveal-fade-up' },
      { sel: '#p5key', anim: 'reveal-fade-up' }
    ]);
  }
  if (id === 'p6') { simDraw(); }
  if (id === 'p8') {
    setupReveal('p8', [
      { sel: '#p8cards', anim: 'reveal-card-grid', children: '.card', seqDelay: 120 },
      { sel: '#p8key', anim: 'reveal-fade-up' },
      { sel: '#p8apply', anim: 'reveal-fade-up' }
    ]);
  }

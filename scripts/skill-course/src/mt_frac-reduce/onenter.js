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
      ['12/18', '2/3'],
      ['15/20', '3/4'],
      ['14/21', '2/3'],
      ['9/12', '3/4'],
      ['3/4 和 5/6 通分', '公分母取 12'],
      ['3/4 = 9/12', '分子分母同乘 3'],
      ['最简分数', '分子分母只有公因数 1'],
      ['最大公因数', '一次除到底用的那个数']
    ], { leftTitle: '分数 / 说法', rightTitle: '结果 / 解释' });
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

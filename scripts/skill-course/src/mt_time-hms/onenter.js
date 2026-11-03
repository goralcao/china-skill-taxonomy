
  if (id === 'p2') {
    setupReveal('p2', [
      { sel: '#p2s1', anim: 'reveal-fade-up' },
      { sel: '#p2fig', anim: 'reveal-float-in-r' },
      { sel: '#p2s2', anim: 'reveal-fade-up' },
      { sel: '#p2s3', anim: 'reveal-fade-up' },
      { sel: '#p2s4', anim: 'reveal-fade-up' },
      { sel: '#p2s5', anim: 'reveal-fade-up' }
    ]);
  }
  if (id === 'p3') {
    buildClockTicks();
    setupReveal('p3', [
      { sel: '#p3s1', anim: 'reveal-fade-up' },
      { sel: '#p3fig', anim: 'reveal-float-in-r' },
      { sel: '#p3s2', anim: 'reveal-fade-up' },
      { sel: '#p3table', anim: 'reveal-fade-up' },
      { sel: '#p3key', anim: 'reveal-fade-up' }
    ]);
  }
  if (id === 'p3b') {
    setupReveal('p3b', [{ sel: '#p3bs1', anim: 'reveal-fade-up' }]);
    initMatching('matchP3', [
      ['秒针', '走一圈 60 秒'],
      ['分针', '走一圈 60 分'],
      ['时针', '走一圈 12 时']
    ], { leftTitle: '哪根针', rightTitle: '走一圈用多久' });
  }
  if (id === 'p5') {
    setupReveal('p5', [
      { sel: '#p5s1', anim: 'reveal-fade-up' },
      { sel: '#p5s2', anim: 'reveal-fade-up' },
      { sel: '#p5fig', anim: 'reveal-fade-up' },
      { sel: '#p5key', anim: 'reveal-fade-up' },
      { sel: '#p5cards', anim: 'reveal-fade-up' },
      { sel: '#p5s3', anim: 'reveal-fade-up' }
    ]);
  }
  if (id === 'p6') { drawClock(); }
  if (id === 'p8') {
    setupReveal('p8', [
      { sel: '#p8cards', anim: 'reveal-card-grid', children: '.card', seqDelay: 120 },
      { sel: '#p8card3', anim: 'reveal-fade-up' },
      { sel: '#p8key', anim: 'reveal-fade-up' }
    ]);
  }

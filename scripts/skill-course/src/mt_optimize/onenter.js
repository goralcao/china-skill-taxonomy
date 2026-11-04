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
      { sel: '#p3fig', anim: 'reveal-float-in-r' },
      { sel: '#p3rules', anim: 'reveal-fade-up' },
      { sel: '#p3key', anim: 'reveal-fade-up' }
    ]);
  }
  if (id === 'p3b') {
    setupReveal('p3b', [{ sel: '#p3bs1', anim: 'reveal-fade-up' }]);
    initMatching('matchP3', [
      ['先洗水壶再接水', '前一步不做完，后一步没法开始'],
      ['烧水的 8 分钟', '正好用来洗茶杯、找茶叶'],
      ['两件事同时做', '总时间按长的那件算，不叠加'],
      ['烙饼的锅', '一次最多只能放 2 张'],
      ['3 张饼一共 6 个面', '锅里每次能烙 2 个面'],
      ['交替着烙', '9 分钟就能全部烙完'],
      ['一件一件做', '总时间是把每一段加起来'],
      ['排顺序之前', '先问哪件必须等、哪件能并']
    ], { leftTitle: '安排里的这一步', rightTitle: '它背后的道理' });
  }
  if (id === 'p5') {
    setupReveal('p5', [
      { sel: '#p5s1', anim: 'reveal-fade-up' },
      { sel: '#p5fig', anim: 'reveal-float-in-r' },
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

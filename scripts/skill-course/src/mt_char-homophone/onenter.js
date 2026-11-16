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
      ["在/再", "处于/又一次"],
      ["己/已", "自己/已经"],
      ["的/地/得", "名/动/补"],
      ["清/晴/睛", "水/日/目"],
      ["目/日", "多一横"],
      ["做/作", "做事/作业"],
      ["看意思", "以义定字"],
      ["写完读", "核对一遍"]
    ], { leftTitle: "易混字", rightTitle: "区分线索", onDone: function(){ var d=document.querySelector('#matchP3 .mq-done'); if(d) d.textContent="✓ 八处都归位了：按意思选对字"; } });
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

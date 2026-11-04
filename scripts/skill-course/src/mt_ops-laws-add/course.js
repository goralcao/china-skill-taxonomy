// ===== 仿真：三张数字卡换位置，和不变 =====
var SIM_W = 880, SIM_H = 360;
var SIM_CARD_W = 160, SIM_CARD_H = 110, SIM_CARD_Y = 96;
var SIM_CARD_X = [70, 285, 500];
var SIM_PANEL_X = 690, SIM_PANEL_W = 170;

var SIM_SETS = [
  { title: '三个班捐书', nums: [186, 97, 214], tags: ['一班', '三班', '二班'] },
  { title: '三场义卖收款', nums: [47, 386, 53], tags: ['周一', '周三', '周二'] }
];

var SIM = { set: 0, cards: [], pick: -1, swaps: 0 };

function simLoad(k) {
  SIM.set = k % SIM_SETS.length;
  var s = SIM_SETS[SIM.set];
  SIM.cards = [];
  for (var i = 0; i < 3; i++) SIM.cards.push({ v: s.nums[i], tag: s.tags[i] });
  SIM.pick = -1;
  SIM.swaps = 0;
}

function simTotal() {
  var s = SIM_SETS[SIM.set];
  return s.nums[0] + s.nums[1] + s.nums[2];
}

function simStep1() {
  return SIM.cards[0].v + SIM.cards[1].v;
}

function simRound(n) {
  return n % 100 === 0;
}

function simExpr() {
  return SIM.cards[0].v + ' + ' + SIM.cards[1].v + ' + ' + SIM.cards[2].v;
}

function simDraw() {
  var cv = document.getElementById('simCanvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, SIM_W, SIM_H);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIM_W, SIM_H);

  var FONT = '"Microsoft YaHei","Noto Sans SC",sans-serif';
  var s1 = simStep1();
  var good = simRound(s1);
  var total = simTotal();

  // 标题
  ctx.textAlign = 'left';
  ctx.font = 'bold 16px ' + FONT;
  ctx.fillStyle = '#1A237E';
  ctx.fillText(SIM_SETS[SIM.set].title + '：先把哪两张挪到一起？', 70, 44);
  ctx.font = '13px ' + FONT;
  ctx.fillStyle = '#90A4AE';
  ctx.fillText('点一张卡选中，再点另一张互换位置', 70, 68);

  // 三张卡
  for (var i = 0; i < 3; i++) {
    var c = SIM.cards[i];
    var x = SIM_CARD_X[i], y = SIM_CARD_Y;
    var sel = SIM.pick === i;

    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, SIM_CARD_W, SIM_CARD_H, 14);
    else ctx.rect(x, y, SIM_CARD_W, SIM_CARD_H);
    if (sel) {
      ctx.fillStyle = '#FFF3E0';
      ctx.strokeStyle = '#F57C00';
      ctx.lineWidth = 4;
    } else {
      ctx.fillStyle = '#EEF0FA';
      ctx.strokeStyle = '#9FA8DA';
      ctx.lineWidth = 2;
    }
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = 'bold 40px ' + FONT;
    ctx.fillStyle = sel ? '#E65100' : '#1A237E';
    ctx.fillText(String(c.v), x + SIM_CARD_W / 2, y + 62);

    ctx.font = '13px ' + FONT;
    ctx.fillStyle = sel ? '#EF6C00' : '#7986CB';
    ctx.fillText(c.tag, x + SIM_CARD_W / 2, y + 90);

    if (sel) {
      ctx.font = 'bold 12px ' + FONT;
      ctx.fillStyle = '#E65100';
      ctx.fillText('已选中，再点一张', x + SIM_CARD_W / 2, y - 12);
    } else {
      ctx.font = 'bold 13px ' + FONT;
      ctx.fillStyle = '#C5CAE9';
      ctx.fillText(String(i + 1), x + SIM_CARD_W / 2, y - 12);
    }
  }

  // 第一步的括号
  var c0 = SIM_CARD_X[0] + SIM_CARD_W / 2;
  var c1 = SIM_CARD_X[1] + SIM_CARD_W / 2;
  ctx.strokeStyle = good ? '#2E7D32' : '#B0BEC5';
  ctx.lineWidth = good ? 2.6 : 1.8;
  ctx.beginPath();
  ctx.moveTo(c0, SIM_CARD_Y + SIM_CARD_H + 8);
  ctx.lineTo(c0, SIM_CARD_Y + SIM_CARD_H + 18);
  ctx.lineTo(c1, SIM_CARD_Y + SIM_CARD_H + 18);
  ctx.lineTo(c1, SIM_CARD_Y + SIM_CARD_H + 8);
  ctx.stroke();

  // 第一步算式
  ctx.textAlign = 'left';
  ctx.font = 'bold 15px ' + FONT;
  ctx.fillStyle = good ? '#2E7D32' : '#78909C';
  ctx.fillText('① ' + SIM.cards[0].v + ' + ' + SIM.cards[1].v + ' = ' + s1, 70, 258);

  if (good) {
    ctx.fillStyle = '#2E7D32';
    ctx.font = 'bold 13px ' + FONT;
    ctx.fillText('凑成整百，不用进位', 300, 258);
  } else {
    ctx.fillStyle = '#C62828';
    ctx.font = '13px ' + FONT;
    ctx.fillText('个位 ' + (SIM.cards[0].v % 10) + ' + ' + (SIM.cards[1].v % 10) + '，要进位', 300, 258);
  }

  // 第二步算式
  ctx.font = 'bold 15px ' + FONT;
  ctx.fillStyle = '#546E7A';
  ctx.fillText('② ' + s1 + ' + ' + SIM.cards[2].v + ' = ' + total, 70, 290);

  // 右侧面板：和永远不变
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(SIM_PANEL_X, SIM_CARD_Y, SIM_PANEL_W, SIM_CARD_H + 52, 12);
  else ctx.rect(SIM_PANEL_X, SIM_CARD_Y, SIM_PANEL_W, SIM_CARD_H + 52);
  ctx.fillStyle = '#F4F6FC';
  ctx.strokeStyle = '#C5CAE9';
  ctx.lineWidth = 1.6;
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.font = '13px ' + FONT;
  ctx.fillStyle = '#7986CB';
  ctx.fillText('和', SIM_PANEL_X + SIM_PANEL_W / 2, SIM_CARD_Y + 26);
  ctx.font = 'bold 40px ' + FONT;
  ctx.fillStyle = '#1A237E';
  ctx.fillText(String(total), SIM_PANEL_X + SIM_PANEL_W / 2, SIM_CARD_Y + 76);
  ctx.font = '12px ' + FONT;
  ctx.fillStyle = '#90A4AE';
  ctx.fillText('怎么换都不变', SIM_PANEL_X + SIM_PANEL_W / 2, SIM_CARD_Y + 100);
  ctx.font = 'bold 12px ' + FONT;
  ctx.fillStyle = '#FFB74D';
  ctx.fillText('已换 ' + SIM.swaps + ' 次', SIM_PANEL_X + SIM_PANEL_W / 2, SIM_CARD_Y + 130);

  // 底部一句话
  ctx.textAlign = 'left';
  ctx.font = '14px ' + FONT;
  ctx.fillStyle = good ? '#2E7D32' : '#90A4AE';
  ctx.fillText(good ? '这个顺序最省劲：第一步就凑成整百，后面直接出答案。'
                    : '换个顺序试试，让前两个数的个位加起来正好是 10。', 70, 334);

  // 状态栏
  var rd = document.getElementById('simReadout');
  if (rd) rd.textContent = simExpr();
  var tp = document.getElementById('simTip');
  if (tp) {
    if (SIM.pick >= 0) tp.textContent = '第 ' + (SIM.pick + 1) + ' 张已选中，再点一张和它换';
    else if (good) tp.textContent = '和一直是 ' + total + '，位置白换，但算法变轻了';
    else tp.textContent = '换成哪一对，能凑出整百？';
  }
}

function simLog(msg, hl) {
  var box = document.getElementById('simLog');
  if (!box) return;
  var d = document.createElement('div');
  if (hl) d.className = 'hl';
  d.textContent = msg;
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
}

function simPick(i) {
  if (i < 0 || i > 2) return;
  if (SIM.pick === -1) {
    SIM.pick = i;
    simDraw();
    return;
  }
  if (SIM.pick === i) {
    SIM.pick = -1;
    simLog('取消选中第 ' + (i + 1) + ' 张');
    simDraw();
    return;
  }
  var a = SIM.pick, b = i;
  var tmp = SIM.cards[a];
  SIM.cards[a] = SIM.cards[b];
  SIM.cards[b] = tmp;
  SIM.pick = -1;
  SIM.swaps++;
  var s1 = simStep1();
  simLog('把第 ' + (a + 1) + ' 张和第 ' + (b + 1) + ' 张对调：' + simExpr()
         + '，第一步 ' + SIM.cards[0].v + ' + ' + SIM.cards[1].v + ' = ' + s1
         + (simRound(s1) ? '（凑成整百）' : ''), simRound(s1));
  simDraw();
}

function simHint() {
  if (simRound(simStep1())) {
    simLog('前两张已经能凑成整百了，不用再换', true);
    simDraw();
    return;
  }
  for (var i = 0; i < 3; i++) {
    for (var j = i + 1; j < 3; j++) {
      var t = [SIM.cards[0].v, SIM.cards[1].v, SIM.cards[2].v];
      var tmp = t[i]; t[i] = t[j]; t[j] = tmp;
      if (simRound(t[0] + t[1])) {
        simLog('把第 ' + (i + 1) + ' 张和第 ' + (j + 1) + ' 张对调，' + t[0] + ' + ' + t[1] + ' = ' + (t[0] + t[1]) + '，正好整百', true);
        simDraw();
        return;
      }
    }
  }
  simLog('这组数怎么换都凑不出整百，挑个位数小的先加', true);
}

function simCase(dir) {
  simLoad(SIM.set + 1);
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('换一道：' + SIM_SETS[SIM.set].title + ' ' + simExpr());
  simDraw();
}

function simReset() {
  simLoad(SIM.set);
  var box = document.getElementById('simLog');
  if (box) box.innerHTML = '';
  simLog('重来：' + simExpr());
  simDraw();
}

function simDemo() {
  simReset();
  var timer = setInterval(function () {
    if (simRound(simStep1())) { clearInterval(timer); return; }
    simHint();
  }, 700);
}

function simBind() {
  var cv = document.getElementById('simCanvas');
  if (!cv || cv.getAttribute('data-bound')) return;
  cv.setAttribute('data-bound', '1');
  cv.style.cursor = 'pointer';
  cv.addEventListener('click', function (e) {
    var r = cv.getBoundingClientRect();
    var x = (e.clientX - r.left) * (SIM_W / r.width);
    var y = (e.clientY - r.top) * (SIM_H / r.height);
    for (var i = 0; i < 3; i++) {
      if (x >= SIM_CARD_X[i] && x <= SIM_CARD_X[i] + SIM_CARD_W
          && y >= SIM_CARD_Y && y <= SIM_CARD_Y + SIM_CARD_H) {
        simPick(i);
        return;
      }
    }
  });
}

simLoad(0);

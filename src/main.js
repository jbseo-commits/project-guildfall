import { Application, Container, Graphics, Text } from 'pixi.js';
import './style.css';
import { CHARACTERS, PLANS, createPrototypeBattle, simulateUntil } from './game/prototype.js';

const mount = document.querySelector('#app');
const app = new Application();
await app.init({
  resizeTo: window,
  background: '#090b12',
  antialias: true,
  autoDensity: true,
  resolution: Math.min(2, window.devicePixelRatio || 1),
});
mount.appendChild(app.canvas);

const root = new Container();
app.stage.addChild(root);

const COLORS = {
  ink: 0x090b12,
  panel: 0x111522,
  panel2: 0x181e2d,
  line: 0x313b52,
  text: 0xf4eadf,
  muted: 0x98a1b7,
  faint: 0x626b80,
  gold: 0xe8c985,
  red: 0xd96c7a,
  green: 0x8bc6a2,
};

const ui = { screen: 'plan', selectedPlan: 'seris', battle: null, battleStart: 0, finalChoice: null };
let battleView = null;

function textNode(text, size = 16, color = COLORS.text, weight = '500', align = 'left') {
  return new Text({
    text,
    style: {
      fill: color,
      fontFamily: 'Inter, Pretendard, system-ui, sans-serif',
      fontSize: size,
      fontWeight: weight,
      align,
      lineHeight: Math.round(size * 1.38),
      wordWrap: true,
    },
  });
}

function clearRoot() {
  root.removeChildren().forEach((child) => child.destroy({ children: true }));
  battleView = null;
}

function addButton(parent, { x, y, width, height, title, subtitle, selected = false, danger = false, onPress }) {
  const button = new Container();
  button.position.set(x, y);
  button.eventMode = 'static';
  button.cursor = 'pointer';

  const bg = new Graphics()
    .roundRect(0, 0, width, height, 14)
    .fill({ color: selected ? 0x262743 : danger ? 0x2b1820 : COLORS.panel2 })
    .stroke({ color: selected ? COLORS.gold : danger ? COLORS.red : COLORS.line, width: selected ? 2 : 1 });
  button.addChild(bg);

  const t = textNode(title, 16, selected ? 0xffedbd : COLORS.text, '700');
  t.position.set(16, subtitle ? 11 : (height - 22) / 2);
  button.addChild(t);

  if (subtitle) {
    const s = textNode(subtitle, 11, selected ? 0xd9cda8 : COLORS.muted, '500');
    s.position.set(16, 38);
    s.style.wordWrapWidth = width - 30;
    button.addChild(s);
  }

  button.on('pointerover', () => { bg.alpha = 0.86; });
  button.on('pointerout', () => { bg.alpha = 1; });
  button.on('pointertap', onPress);
  parent.addChild(button);
  return button;
}

function drawPortrait(character, size, showHp = false, hp = 100, downed = false) {
  const c = new Container();
  const p = character.palette;
  const cx = size / 2;
  const top = size * 0.07;

  c.addChild(new Graphics()
    .circle(cx, size * 0.43, size * 0.38)
    .fill({ color: p.primary, alpha: downed ? 0.07 : 0.12 }));

  const ornaments = new Graphics();
  if (character.id === 'vael') {
    ornaments.moveTo(size * 0.39, size * 0.22).quadraticCurveTo(size * 0.28, top, size * 0.31, size * 0.28).stroke({ color: p.accent, width: Math.max(2, size * 0.025) });
    ornaments.moveTo(size * 0.61, size * 0.22).quadraticCurveTo(size * 0.72, top, size * 0.69, size * 0.28).stroke({ color: p.accent, width: Math.max(2, size * 0.025) });
  } else if (character.id === 'seris') {
    ornaments.ellipse(size * 0.23, size * 0.49, size * 0.18, size * 0.3).fill({ color: p.secondary, alpha: downed ? 0.1 : 0.28 }).stroke({ color: p.accent, width: 1.5, alpha: 0.7 });
    ornaments.ellipse(size * 0.77, size * 0.49, size * 0.18, size * 0.3).fill({ color: p.secondary, alpha: downed ? 0.1 : 0.28 }).stroke({ color: p.accent, width: 1.5, alpha: 0.7 });
    ornaments.moveTo(size * 0.47, size * 0.24).lineTo(size * 0.43, size * 0.12).stroke({ color: p.accent, width: 1.5 });
    ornaments.moveTo(size * 0.53, size * 0.24).lineTo(size * 0.57, size * 0.12).stroke({ color: p.accent, width: 1.5 });
  } else {
    for (let i = 0; i < 5; i += 1) {
      const angle = (-Math.PI * 0.85) + i * (Math.PI * 0.17);
      const px = cx + Math.cos(angle) * size * 0.18;
      const py = size * 0.27 + Math.sin(angle) * size * 0.13;
      ornaments.circle(px, py, size * 0.045).fill({ color: i % 2 ? p.accent : p.secondary, alpha: downed ? 0.2 : 0.9 });
    }
  }
  c.addChild(ornaments);

  c.addChild(new Graphics()
    .ellipse(cx, size * 0.34, size * 0.19, size * 0.22)
    .fill({ color: p.secondary, alpha: downed ? 0.28 : 0.95 }));

  const body = new Graphics();
  body.moveTo(size * 0.28, size * 0.93).lineTo(size * 0.36, size * 0.52).lineTo(size * 0.64, size * 0.52).lineTo(size * 0.74, size * 0.93).closePath().fill({ color: p.dark, alpha: downed ? 0.4 : 1 });
  body.moveTo(size * 0.36, size * 0.56).quadraticCurveTo(cx, size * 0.7, size * 0.65, size * 0.56).lineTo(size * 0.75, size * 0.94).lineTo(size * 0.25, size * 0.94).closePath().fill({ color: p.primary, alpha: downed ? 0.35 : 0.92 });
  c.addChild(body);

  c.addChild(new Graphics()
    .ellipse(cx, size * 0.38, size * 0.125, size * 0.16)
    .fill({ color: 0xf1d9cb, alpha: downed ? 0.32 : 1 }));

  const eyes = new Graphics();
  eyes.circle(size * 0.46, size * 0.39, Math.max(1.5, size * 0.014)).fill({ color: p.accent });
  eyes.circle(size * 0.54, size * 0.39, Math.max(1.5, size * 0.014)).fill({ color: p.accent });
  c.addChild(eyes);

  if (downed) c.addChild(new Graphics().roundRect(size * 0.12, size * 0.11, size * 0.76, size * 0.78, 18).fill({ color: 0x080910, alpha: 0.5 }));

  if (showHp) {
    const bar = new Graphics();
    bar.roundRect(size * 0.12, size * 0.96, size * 0.76, 6, 3).fill({ color: 0x252a36 });
    bar.roundRect(size * 0.12, size * 0.96, size * 0.76 * Math.max(0, hp) / 100, 6, 3).fill({ color: hp > 55 ? COLORS.green : hp > 25 ? COLORS.gold : COLORS.red });
    c.addChild(bar);
  }
  return c;
}

function drawHeader(parent, eyebrow = 'PROTOTYPE ASSUMPTION · D002 NOT LOCKED') {
  const w = app.screen.width;
  const title = textNode('LIVING CARAVAN', Math.min(25, Math.max(20, w * 0.06)), COLORS.text, '800');
  title.position.set(22, 20);
  parent.addChild(title);
  const sub = textNode('살아있는 카라반 · vertical slice v1', 11, COLORS.muted, '600');
  sub.position.set(24, 54);
  parent.addChild(sub);
  const tag = textNode(eyebrow, 9, COLORS.gold, '700');
  tag.anchor.set(1, 0);
  tag.position.set(w - 20, 25);
  parent.addChild(tag);
}

function renderPlan() {
  clearRoot();
  drawHeader(root);
  const w = app.screen.width;
  const h = app.screen.height;
  const margin = Math.max(16, Math.min(26, w * 0.055));
  const contentW = w - margin * 2;

  const intro = textNode('누구를 지킬 것인가?', 25, COLORS.text, '800');
  intro.position.set(margin, 88);
  root.addChild(intro);
  const intro2 = textNode('선택은 하나뿐입니다. 하지만 전투가 그 선택을 크게 기억합니다.', 12, COLORS.muted, '500');
  intro2.position.set(margin, 125);
  intro2.style.wordWrapWidth = contentW;
  root.addChild(intro2);

  const portraitY = 164;
  const gap = 10;
  const cardW = (contentW - gap * 2) / 3;
  const portraitSize = Math.min(110, cardW - 8);
  for (const [i, character] of Object.values(CHARACTERS).entries()) {
    const x = margin + i * (cardW + gap);
    root.addChild(new Graphics().roundRect(x, portraitY, cardW, 166, 16).fill({ color: COLORS.panel }).stroke({ color: COLORS.line, width: 1 }));
    const portrait = drawPortrait(character, portraitSize);
    portrait.position.set(x + (cardW - portraitSize) / 2, portraitY + 2);
    root.addChild(portrait);
    const name = textNode(character.name, 15, COLORS.text, '800', 'center');
    name.anchor.set(0.5, 0);
    name.position.set(x + cardW / 2, portraitY + 110);
    root.addChild(name);
    const role = textNode(character.epithet, 9.5, COLORS.muted, '600', 'center');
    role.anchor.set(0.5, 0);
    role.position.set(x + cardW / 2, portraitY + 136);
    root.addChild(role);
  }

  const bondY = 350;
  const bond = new Graphics();
  bond.moveTo(margin + cardW / 2, portraitY + 160).lineTo(margin + cardW + gap + cardW / 2, bondY - 9).stroke({ color: 0x8877a8, width: 2, alpha: 0.5 });
  bond.moveTo(margin + cardW * 2 + gap * 2 + cardW / 2, portraitY + 160).lineTo(margin + cardW + gap + cardW / 2, bondY - 9).stroke({ color: 0x8877a8, width: 2, alpha: 0.5 });
  root.addChild(bond);

  const label = textNode('베일의 보호 본능을 한 명에게 고정합니다.', 11, COLORS.gold, '700');
  label.position.set(margin, bondY);
  root.addChild(label);

  const compact = h < 760;
  const buttonH = compact ? 62 : 72;
  const firstY = bondY + 28;
  for (const [idx, plan] of Object.values(PLANS).entries()) {
    addButton(root, {
      x: margin,
      y: firstY + idx * (buttonH + 10),
      width: contentW,
      height: buttonH,
      title: `${plan.kicker}  ·  ${plan.title}`,
      subtitle: `${plan.reward}  /  위험: ${plan.risk}`,
      selected: ui.selectedPlan === plan.id,
      onPress: () => { ui.selectedPlan = plan.id; renderPlan(); },
    });
  }

  const commitY = Math.min(h - 88, firstY + 2 * (buttonH + 10) + 10);
  addButton(root, {
    x: margin,
    y: commitY,
    width: contentW,
    height: 62,
    title: 'COMMIT — 이 계획으로 간다',
    subtitle: '누르는 순간부터 당신은 개입하지 않습니다.',
    selected: true,
    onPress: startBattle,
  });
}

function startBattle() {
  ui.screen = 'battle';
  ui.battle = createPrototypeBattle(ui.selectedPlan);
  ui.battleStart = performance.now();
  buildBattleScene();
}

function buildBattleScene() {
  clearRoot();
  drawHeader(root, `SEED ${ui.battle.seed}`);
  const w = app.screen.width;
  const h = app.screen.height;
  const margin = Math.max(14, Math.min(24, w * 0.05));
  const arenaTop = 86;
  const arenaH = Math.min(h - 170, 590);

  const bg = new Graphics();
  bg.roundRect(margin, arenaTop, w - margin * 2, arenaH, 24).fill({ color: 0x0e1220 }).stroke({ color: COLORS.line, width: 1 });
  bg.circle(w * 0.5, arenaTop + arenaH * 0.48, Math.min(w, arenaH) * 0.42).fill({ color: 0x39305c, alpha: 0.08 });
  bg.moveTo(margin + 14, arenaTop + arenaH * 0.53).lineTo(w - margin - 14, arenaTop + arenaH * 0.53).stroke({ color: 0x252c3d, width: 1 });
  root.addChild(bg);

  const caption = textNode('COMMIT', 11, COLORS.gold, '800', 'center');
  caption.anchor.set(0.5, 0);
  caption.position.set(w / 2, arenaTop + 16);
  root.addChild(caption);
  const battleTitle = textNode('계획을 실행합니다', 19, COLORS.text, '800', 'center');
  battleTitle.anchor.set(0.5, 0);
  battleTitle.position.set(w / 2, arenaTop + 34);
  root.addChild(battleTitle);
  const message = textNode('카라반이 위협을 감지했습니다.', 12, COLORS.muted, '600', 'center');
  message.anchor.set(0.5, 0);
  message.position.set(w / 2, arenaTop + 65);
  message.style.wordWrapWidth = w - margin * 4;
  root.addChild(message);

  const actorContainers = {};
  const actorSize = Math.min(92, (w - margin * 2 - 28) / 3);
  const actorY = arenaTop + arenaH * 0.67;
  const actorXs = [w * 0.22, w * 0.5, w * 0.78];
  for (const [i, character] of Object.values(CHARACTERS).entries()) {
    const holder = new Container();
    holder.position.set(actorXs[i] - actorSize / 2, actorY - actorSize / 2);
    root.addChild(holder);
    actorContainers[character.id] = holder;
  }

  const enemies = {};
  const enemyY = arenaTop + arenaH * 0.31;
  for (const enemy of ui.battle.enemies) {
    const holder = new Container();
    holder.position.set(w * enemy.x, enemyY);
    const sigil = new Graphics();
    sigil.moveTo(-20, 17).lineTo(0, -23).lineTo(20, 17).closePath().fill({ color: 0x6f3f50, alpha: 0.8 }).stroke({ color: 0xc48b98, width: 1.5 });
    sigil.circle(0, 0, 5).fill({ color: 0xf1c5c8 });
    holder.addChild(sigil);
    const name = textNode(enemy.name, 9, 0xbfa8b0, '600', 'center');
    name.anchor.set(0.5, 0);
    name.position.set(0, 26);
    holder.addChild(name);
    root.addChild(holder);
    enemies[enemy.id] = { holder };
  }

  const fx = new Graphics();
  root.addChild(fx);

  const praisePanel = new Container();
  praisePanel.addChild(new Graphics().roundRect(0, 0, w - margin * 2 - 24, 72, 14).fill({ color: 0x171a2a, alpha: 0.94 }).stroke({ color: 0x4c4768, width: 1 }));
  praisePanel.position.set(margin + 12, arenaTop + arenaH - 90);
  praisePanel.alpha = 0;
  const praiseTitle = textNode('', 15, 0xffe4a9, '800');
  praiseTitle.position.set(14, 9);
  praisePanel.addChild(praiseTitle);
  const praiseDetail = textNode('', 10.5, COLORS.muted, '600');
  praiseDetail.position.set(14, 34);
  praiseDetail.style.wordWrapWidth = w - margin * 2 - 54;
  praisePanel.addChild(praiseDetail);
  root.addChild(praisePanel);

  root.addChild(new Graphics().roundRect(margin, arenaTop + arenaH + 16, w - margin * 2, 6, 3).fill({ color: 0x252a36 }));
  const progress = new Graphics();
  root.addChild(progress);

  battleView = { margin, arenaTop, arenaH, message, actorContainers, actorSize, enemies, fx, praisePanel, praiseTitle, praiseDetail, progress, lastPraiseId: null, actorState: {} };
}

function updateBattle(now) {
  if (ui.screen !== 'battle' || !ui.battle || !battleView) return;
  const t = Math.min(ui.battle.duration, (now - ui.battleStart) / 1000);
  const { actors, enemies, fired } = simulateUntil(ui.battle, t);
  const view = battleView;
  const w = app.screen.width;

  for (const [id, holder] of Object.entries(view.actorContainers)) {
    const actor = actors[id];
    const stateKey = `${Math.round(actor.hp)}:${actor.downed ? 1 : 0}`;
    if (view.actorState[id] === stateKey) continue;
    view.actorState[id] = stateKey;
    holder.removeChildren().forEach((child) => child.destroy({ children: true }));
    holder.addChild(drawPortrait(CHARACTERS[id], view.actorSize, true, actor.hp, actor.downed));
    const n = textNode(CHARACTERS[id].name, 10, actor.downed ? COLORS.faint : COLORS.text, '700', 'center');
    n.anchor.set(0.5, 0);
    n.position.set(view.actorSize / 2, view.actorSize + 9);
    holder.addChild(n);
  }

  for (const [id, enemyView] of Object.entries(view.enemies)) {
    const enemy = enemies[id];
    enemyView.holder.alpha = enemy.downed ? 0.18 : Math.max(0.35, enemy.hp / enemy.maxHp);
    enemyView.holder.scale.set(enemy.downed ? 0.72 : 1);
  }

  const last = fired[fired.length - 1];
  if (last) {
    if (last.text) view.message.text = last.text;
    else if (last.type === 'channel') view.message.text = '세리스가 월광을 모읍니다…';
    else if (last.type === 'heal' || last.type === 'healAll') view.message.text = '생명력이 카라반을 따라 흐릅니다.';
    else if (last.type === 'attack') view.message.text = '공격이 생태계의 연결을 흔듭니다.';
    else if (last.type === 'down') view.message.text = `${CHARACTERS[last.target].name}의 연결이 끊어졌습니다.`;
  }

  const praise = [...fired].reverse().find((event) => event.praise);
  if (praise) {
    if (view.lastPraiseId !== praise.id) {
      view.lastPraiseId = praise.id;
      view.praiseTitle.text = praise.praise;
      view.praiseDetail.text = praise.detail ?? '';
    }
    const age = t - praise.at;
    view.praisePanel.alpha = age < 1.75 ? Math.min(1, age * 5) : Math.max(0, 1 - (age - 1.75) * 2.5);
  } else {
    view.praisePanel.alpha = 0;
  }

  view.fx.clear();
  const hot = [...fired].reverse().find((event) => t - event.at < 0.42 && ['attack', 'intercept', 'burst', 'healAll', 'rage', 'down'].includes(event.type));
  if (hot) {
    const age = t - hot.at;
    const alpha = Math.max(0, 0.32 - age * 0.7);
    const color = hot.type === 'healAll' ? COLORS.green : hot.type === 'burst' ? 0xc8b3ff : hot.type === 'down' ? COLORS.red : 0xffffff;
    view.fx.rect(view.margin + 4, view.arenaTop + 4, w - view.margin * 2 - 8, view.arenaH - 8).fill({ color, alpha });
  }

  view.progress.clear().roundRect(view.margin, view.arenaTop + view.arenaH + 16, (w - view.margin * 2) * (t / ui.battle.duration), 6, 3).fill({ color: COLORS.gold });

  if (t >= ui.battle.duration) {
    ui.screen = 'result';
    renderResult();
  }
}

function renderResult() {
  clearRoot();
  drawHeader(root, 'DEBRIEF · THE COST OF ATTACHMENT');
  const w = app.screen.width;
  const h = app.screen.height;
  const margin = Math.max(18, Math.min(26, w * 0.055));
  const contentW = w - margin * 2;
  const downed = CHARACTERS[ui.battle.plan.downedId];

  const eyebrow = textNode('승리했습니다. 하지만 하나가 비었습니다.', 11, COLORS.red, '800');
  eyebrow.position.set(margin, 92);
  root.addChild(eyebrow);
  const title = textNode(`${downed.name}를 두고 갈 것인가?`, 26, COLORS.text, '800');
  title.position.set(margin, 118);
  root.addChild(title);

  const portraitSize = Math.min(150, contentW * 0.42);
  const portrait = drawPortrait(downed, portraitSize, true, 0, true);
  portrait.position.set(margin, 174);
  root.addChild(portrait);

  const quote = textNode('“유닛 하나를 잃은 게 아니다.\n우리의 일부가 사라졌다.”', 14, 0xe0d0bd, '700');
  quote.position.set(margin + portraitSize + 18, 186);
  quote.style.wordWrapWidth = contentW - portraitSize - 20;
  root.addChild(quote);
  const explain = textNode(`${downed.name}는 ${downed.role}의 축입니다. 대체하는 편이 훨씬 효율적입니다. 그래도 데려오겠습니까?`, 11, COLORS.muted, '500');
  explain.position.set(margin + portraitSize + 18, 245);
  explain.style.wordWrapWidth = contentW - portraitSize - 20;
  root.addChild(explain);

  const choiceY = 350;
  addButton(root, {
    x: margin,
    y: choiceY,
    width: contentW,
    height: 82,
    title: `${downed.name}를 회수한다`,
    subtitle: '대가: 이번 전투 보상 전부 포기 · 카라반 생명력 25% 소모 · 다음 구역 위험 +1',
    selected: true,
    onPress: () => renderEpilogue('rescue'),
  });
  addButton(root, {
    x: margin,
    y: choiceY + 94,
    width: contentW,
    height: 82,
    title: '떠난다',
    subtitle: '보상을 보존합니다. 다음 구역에서 새로운 존재를 받아들일 수 있습니다.',
    danger: true,
    onPress: () => renderEpilogue('leave'),
  });

  const note = textNode('Prototype rule: 복구 비용의 정확한 수치는 아직 확정되지 않았습니다.', 9.5, COLORS.faint, '600', 'center');
  note.anchor.set(0.5, 1);
  note.position.set(w / 2, h - 18);
  root.addChild(note);
}

function renderEpilogue(choice) {
  clearRoot();
  ui.screen = 'epilogue';
  ui.finalChoice = choice;
  drawHeader(root, choice === 'rescue' ? 'ATTACHMENT > EFFICIENCY' : 'EFFICIENCY > ATTACHMENT');
  const w = app.screen.width;
  const h = app.screen.height;
  const margin = Math.max(20, Math.min(30, w * 0.06));
  const downed = CHARACTERS[ui.battle.plan.downedId];

  root.addChild(new Graphics().roundRect(margin, 106, w - margin * 2, Math.min(390, h - 250), 24).fill({ color: COLORS.panel }).stroke({ color: choice === 'rescue' ? COLORS.gold : COLORS.line, width: 1.5 }));

  if (choice === 'rescue') {
    const size = Math.min(160, w * 0.42);
    const p = drawPortrait(downed, size);
    p.position.set(w / 2 - size / 2, 126);
    root.addChild(p);
    const title = textNode(`${downed.name}가 돌아왔습니다.`, 25, 0xffe7b5, '800', 'center');
    title.anchor.set(0.5, 0);
    title.position.set(w / 2, 295);
    root.addChild(title);
    const body = textNode('효율은 나빠졌습니다.\n하지만 카라반은 다시 온전해졌습니다.\n\n이 비효율을 선택하게 만드는 것이 이 프로토타입의 핵심 감정입니다.', 13, COLORS.muted, '600', 'center');
    body.anchor.set(0.5, 0);
    body.position.set(w / 2, 336);
    body.style.wordWrapWidth = w - margin * 4;
    root.addChild(body);
  } else {
    const empty = new Graphics().circle(w / 2, 198, 62).fill({ color: 0x080a10 }).stroke({ color: 0x3a4050, width: 2, alpha: 0.8 });
    empty.moveTo(w / 2 - 30, 198).lineTo(w / 2 + 30, 198).stroke({ color: 0x3a4050, width: 1, alpha: 0.5 });
    root.addChild(empty);
    const title = textNode('카라반은 더 가벼워졌습니다.', 24, COLORS.text, '800', 'center');
    title.anchor.set(0.5, 0);
    title.position.set(w / 2, 295);
    root.addChild(title);
    const body = textNode(`하지만 ${downed.name}가 있던 자리는 그대로 비어 있습니다.\n\n효율적인 선택도 정답입니다. 다만 아무 일도 없었던 것처럼 지워지지는 않습니다.`, 13, COLORS.muted, '600', 'center');
    body.anchor.set(0.5, 0);
    body.position.set(w / 2, 336);
    body.style.wordWrapWidth = w - margin * 4;
    root.addChild(body);
  }

  addButton(root, {
    x: margin,
    y: h - 102,
    width: w - margin * 2,
    height: 64,
    title: '다른 선택으로 다시 시연',
    subtitle: '보호 대상을 바꾸면 누가 위험해지는지 달라집니다.',
    onPress: () => { ui.screen = 'plan'; ui.battle = null; ui.finalChoice = null; renderPlan(); },
  });
}

app.ticker.add(() => updateBattle(performance.now()));
window.addEventListener('resize', () => {
  if (ui.screen === 'plan') renderPlan();
  else if (ui.screen === 'battle') buildBattleScene();
  else if (ui.screen === 'result') renderResult();
  else if (ui.screen === 'epilogue' && ui.finalChoice) renderEpilogue(ui.finalChoice);
});

renderPlan();

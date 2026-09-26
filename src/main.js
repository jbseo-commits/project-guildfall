import './style.css';
import { CHARACTERS, PLANS, createPrototypeBattle } from './game/prototype.js';

const app = document.querySelector('#app');

const state = {
  screen: 'cold-open',
  selectedPlan: 'seris',
  battle: null,
  timers: [],
  dialogueIndex: 0,
};

const characterOrder = ['vael', 'seris', 'mirel'];

const campDialogue = [
  { speaker: 'narrator', name: '47번째 밤', text: '새벽까지 31분. 카라반의 늑골 사이로 차가운 빛이 스민다.' },
  { speaker: 'mirel', name: '미렐', text: '또 꽃이 졌네. 오늘은 세 송이. …괜찮아. 다시 피우면 되니까.' },
  { speaker: 'seris', name: '세리스', text: '거짓말. 네가 아끼던 애들이잖아.' },
  { speaker: 'mirel', name: '미렐', text: '세리스는 별을 아끼잖아. 나는 꽃을 아끼는 거고.' },
  { speaker: 'vael', name: '베일', text: '조용. 북쪽.' },
  { speaker: 'narrator', name: '카라반', text: '살아있는 성소의 피부가 먼저 떨었다. 유리 사냥꾼들이 우리의 피냄새를 따라왔다.' },
  { speaker: 'vael', name: '베일', text: '셋. 이쪽으로 온다. 나는 한 명 곁에 붙을 수 있어.' },
  { speaker: 'seris', name: '세리스', text: '나를 지키면 한 번에 끝낼 수 있어. 대신 미렐이 혼자 남아.' },
  { speaker: 'mirel', name: '미렐', text: '나를 지키면 모두를 오래 버틸 수 있어. 대신 세리스의 의식은 끊길 거야.' },
];

const planReactions = {
  seris: [
    { speaker: 'seris', name: '세리스', text: '알겠어. 끝내줄게.' },
    { speaker: 'mirel', name: '미렐', text: '그럼 나는 조금 멀리 있을게. 걱정하지 마.' },
    { speaker: 'vael', name: '베일', text: '…걱정하지 말라는 말이 제일 싫어.' },
  ],
  mirel: [
    { speaker: 'mirel', name: '미렐', text: '내 뿌리를 지켜줘. 그러면 카라반 전체가 버틸 수 있어.' },
    { speaker: 'seris', name: '세리스', text: '내가 먼저 끊겨도 괜찮아. 두 번째 기회는 만들 수 있어.' },
    { speaker: 'vael', name: '베일', text: '두 번째가 온다는 보장은 없지.' },
  ],
};

const fallScenes = {
  mirel: [
    ['seris', '세리스', '미렐. 눈 떠.'],
    ['vael', '베일', '추격대가 다시 붙기까지 스물두 분.'],
    ['mirel', '미렐', '가. …내 뿌리는 원래 잘 남아.'],
  ],
  seris: [
    ['mirel', '미렐', '세리스, 내 목소리 들려?'],
    ['vael', '베일', '추격대가 다시 붙기까지 스물두 분.'],
    ['seris', '세리스', '별이… 하나 모자라네. 가. 나는 길을 기억해.'],
  ],
};

function clearTimers() {
  state.timers.forEach(clearTimeout);
  state.timers = [];
}

function later(fn, ms) {
  const id = setTimeout(fn, ms);
  state.timers.push(id);
  return id;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function portrait(character, extra = '') {
  return `
    <div class="portrait portrait-${character.id} ${extra}" aria-hidden="true">
      <div class="portrait-aura"></div>
      <div class="portrait-wings"></div>
      <div class="portrait-horns"></div>
      <div class="portrait-hair"></div>
      <div class="portrait-face"><i></i><i></i></div>
      <div class="portrait-body"></div>
      <div class="portrait-ornament"></div>
    </div>`;
}

function characterCard(character, extra = '') {
  return `
    <article class="character-card ${extra}" data-character="${character.id}" data-hp="100">
      ${portrait(character)}
      <div class="character-copy">
        <strong>${character.name}</strong>
        <span>${character.epithet}</span>
      </div>
      <div class="hp"><i style="width:100%"></i></div>
    </article>`;
}

function sceneShell(content, opts = {}) {
  const { scene = 'story', eyebrow = 'LIVING CARAVAN', compact = false } = opts;
  app.innerHTML = `
    <main class="shell ${compact ? 'compact' : ''}" data-scene="${scene}">
      <header class="topbar">
        <div>
          <div class="brand">LIVING CARAVAN</div>
          <div class="brand-sub">살아있는 성소 · vertical slice II</div>
        </div>
        <div class="eyebrow">${eyebrow}</div>
      </header>
      ${content}
    </main>`;
  requestAnimationFrame(() => app.querySelector('.shell')?.classList.add('scene-in'));
}

function activeSpeakerClass(speaker) {
  return speaker === 'narrator' ? 'narrator' : `speaker-${speaker}`;
}

function renderColdOpen() {
  clearTimers();
  state.screen = 'cold-open';
  sceneShell(`
    <section class="cold-open">
      <div class="world-vista">
        <div class="moon"></div>
        <div class="distant-city"></div>
        <div class="caravan-ribs"></div>
        <div class="living-core"></div>
        <div class="dust dust-a"></div>
        <div class="dust dust-b"></div>
      </div>
      <div class="cold-copy">
        <p class="chapter">PROLOGUE · 유리 평원</p>
        <h1>세상이 죽기 시작한 뒤,<br>사람들은 성벽을 세웠다.</h1>
        <p class="cold-line">우리는 걸었다.</p>
        <p class="cold-body">이름을 버린 것들이 서로의 체온을 이어 붙여 만든 이동하는 성소. 살아있는 카라반 <b>《아르카》</b>.</p>
        <button class="story-cta" id="wake">47번째 밤을 시작한다<span>세 사람의 숨결이 카라반의 벽을 움직인다.</span></button>
      </div>
    </section>
  `, { scene: 'cold-open', eyebrow: 'NIGHT 47 · GLASS PLAIN' });

  app.querySelector('#wake').addEventListener('click', () => {
    state.dialogueIndex = 0;
    renderCamp();
  });
}

function renderCamp() {
  clearTimers();
  state.screen = 'camp';
  const entry = campDialogue[state.dialogueIndex];
  const finalLine = state.dialogueIndex === campDialogue.length - 1;

  sceneShell(`
    <section class="camp-scene ${activeSpeakerClass(entry.speaker)}">
      <div class="camp-vista">
        <div class="camp-sky"></div>
        <div class="rib-arch rib-one"></div>
        <div class="rib-arch rib-two"></div>
        <div class="heart-lantern"></div>
        <div class="camp-cast">
          ${characterOrder.map(id => {
            const c = CHARACTERS[id];
            const active = entry.speaker === id ? 'active' : '';
            return `
              <button class="camp-character ${active}" tabindex="-1" aria-label="${c.name}">
                ${portrait(c, 'camp-portrait')}
                <strong>${c.name}</strong>
                <small>${c.epithet}</small>
              </button>`;
          }).join('')}
        </div>
      </div>

      <div class="dialogue-box">
        <div class="dialogue-meta">
          <span class="speaker-name">${escapeHtml(entry.name)}</span>
          <span class="dialogue-count">${String(state.dialogueIndex + 1).padStart(2, '0')} / ${String(campDialogue.length).padStart(2, '0')}</span>
        </div>
        <p class="dialogue-text">“${escapeHtml(entry.text)}”</p>
        <button class="dialogue-next" id="dialogue-next">
          ${finalLine ? '결정해야 한다' : '계속 듣는다'}
          <span>${finalLine ? '모두를 지킬 수는 없다.' : '화면을 눌러 대화를 이어갑니다.'}</span>
        </button>
      </div>
    </section>
  `, { scene: 'camp', eyebrow: '31 MINUTES BEFORE DAWN' });

  app.querySelector('#dialogue-next').addEventListener('click', () => {
    if (finalLine) renderPlan();
    else {
      state.dialogueIndex += 1;
      renderCamp();
    }
  });
}

function renderPlan() {
  clearTimers();
  state.screen = 'plan';
  const plan = PLANS[state.selectedPlan];

  sceneShell(`
    <section class="plan-scene">
      <div class="scene-heading">
        <p class="kicker">READ → PLAN</p>
        <h1>누구 곁에 베일을 세울 것인가?</h1>
        <p>누구도 버리는 선택은 아니다. 하지만 모든 이를 동시에 지킬 수는 없다.</p>
      </div>

      <section class="ecosystem">
        <div class="bond bond-left"></div>
        <div class="bond bond-right"></div>
        ${characterOrder.map(id => characterCard(CHARACTERS[id], id === plan.protectedId ? 'protected' : '')).join('')}
      </section>

      <div class="relationship-note">
        <span>현재 생태 연결</span>
        <strong>베일 ↔ 세리스 ↔ 미렐</strong>
        <em>한 사람의 결손은 두 사람의 행동을 바꿉니다.</em>
      </div>

      <section class="decision-panel">
        ${Object.values(PLANS).map(p => `
          <button class="plan-option ${p.id === state.selectedPlan ? 'selected' : ''}" data-plan="${p.id}">
            <span class="plan-title">${p.kicker} · ${p.title}</span>
            <span class="plan-detail">${p.description}</span>
            <span class="plan-outcome">기대: ${p.reward}</span>
            <span class="plan-risk">대가: ${p.risk}</span>
          </button>
        `).join('')}
        <button id="plan-lock" class="story-cta decision-cta">
          이 명령을 전한다
          <span>선택을 들은 세 사람의 반응을 확인합니다.</span>
        </button>
      </section>
    </section>
  `, { scene: 'plan', eyebrow: 'THE KEEPER MUST CHOOSE' });

  app.querySelectorAll('[data-plan]').forEach(button => {
    button.addEventListener('click', () => {
      state.selectedPlan = button.dataset.plan;
      renderPlan();
    });
  });
  app.querySelector('#plan-lock').addEventListener('click', renderPlanReaction);
}

function renderPlanReaction() {
  clearTimers();
  state.screen = 'reaction';
  const plan = PLANS[state.selectedPlan];
  const lines = planReactions[state.selectedPlan];

  sceneShell(`
    <section class="reaction-scene">
      <p class="kicker">THE ORDER IS HEARD</p>
      <h1>${plan.title}</h1>
      <p class="order-copy">당신의 명령은 숫자가 아니라 세 사람 사이에 남는다.</p>

      <div class="reaction-stack">
        ${lines.map((line, index) => `
          <article class="reaction-line" style="--delay:${index * 90}ms">
            <div class="reaction-avatar">${portrait(CHARACTERS[line.speaker])}</div>
            <div>
              <strong>${line.name}</strong>
              <p>“${line.text}”</p>
            </div>
          </article>
        `).join('')}
      </div>

      <div class="commit-warning">
        <span>COMMIT</span>
        <p>이제부터 카라반은 스스로 반응합니다.<br>당신은 결과를 지켜볼 수밖에 없습니다.</p>
      </div>

      <button id="commit" class="commit cinematic">
        행진을 멈춘다 — COMMIT
        <span>전투가 시작됩니다.</span>
      </button>
    </section>
  `, { scene: 'reaction', eyebrow: 'NO MORE ORDERS AFTER THIS' });

  app.querySelector('#commit').addEventListener('click', startBattle);
}

function setHp(id, hp) {
  const card = app.querySelector(`[data-character="${id}"]`);
  if (!card) return;
  card.dataset.hp = String(hp);
  const bar = card.querySelector('.hp i');
  if (bar) bar.style.width = `${Math.max(0, hp)}%`;
  card.classList.toggle('critical', hp > 0 && hp < 35);
  card.classList.toggle('downed', hp <= 0);
}

function flash(type = 'impact') {
  const arena = app.querySelector('.battle-arena');
  if (!arena) return;
  arena.classList.remove('impact', 'heal', 'burst');
  void arena.offsetWidth;
  arena.classList.add(type);
}

function praise(title, detail, tone = '') {
  const panel = app.querySelector('.praise');
  if (!panel) return;
  panel.className = `praise show ${tone}`;
  panel.innerHTML = `<strong>${title}</strong><span>${detail}</span>`;
  later(() => panel?.classList.remove('show'), 1650);
}

function battleDialogue(speaker, text) {
  const bubble = app.querySelector('.battle-dialogue');
  if (!bubble) return;
  const c = CHARACTERS[speaker];
  bubble.className = `battle-dialogue show speaker-${speaker}`;
  bubble.innerHTML = `<strong>${c.name}</strong><span>“${escapeHtml(text)}”</span>`;
  later(() => bubble?.classList.remove('show'), 1250);
}

function moveGuard(targetId) {
  const guard = app.querySelector('[data-character="vael"]');
  const target = app.querySelector(`[data-character="${targetId}"]`);
  if (!guard || !target) return;
  guard.classList.add('guarding');
  target.classList.add('shielded');
}

function hit(id, damage) {
  const card = app.querySelector(`[data-character="${id}"]`);
  if (!card) return;
  const current = Number(card.dataset.hp || 100);
  const next = Math.max(0, current - damage);
  card.classList.remove('hit');
  void card.offsetWidth;
  card.classList.add('hit');
  setHp(id, next);
  flash('impact');
}

function healAll(amount) {
  characterOrder.forEach(id => {
    const card = app.querySelector(`[data-character="${id}"]`);
    if (!card || card.classList.contains('downed')) return;
    const current = Number(card.dataset.hp || 100);
    setHp(id, Math.min(100, current + amount));
  });
  flash('heal');
}

function defeatEnemies() {
  app.querySelectorAll('.enemy').forEach((enemy, index) => {
    enemy.classList.add('defeated');
    later(() => { enemy.style.opacity = String(0.12 + index * 0.03); }, 220);
  });
  flash('burst');
}

function startBattle() {
  clearTimers();
  state.screen = 'battle';
  state.battle = createPrototypeBattle(state.selectedPlan);
  const plan = state.battle.plan;
  const downedId = plan.downedId;

  sceneShell(`
    <section class="battle-wrap">
      <div class="battle-heading">
        <p class="kicker">COMMIT → WATCH</p>
        <h1>카라반이 몸을 웅크린다.</h1>
        <p id="battle-message">성소의 벽이 닫히고, 세 사람의 숨이 같은 박자로 맞춰진다.</p>
      </div>

      <section class="battle-arena">
        <div class="enemy-line">
          <div class="enemy"><i></i><span>유리 사냥꾼</span></div>
          <div class="enemy"><i></i><span>백철 창기병</span></div>
          <div class="enemy"><i></i><span>성흔 사냥개</span></div>
        </div>
        <div class="battle-veins"></div>
        <div class="party-line">
          ${characterOrder.map(id => characterCard(CHARACTERS[id])).join('')}
        </div>
        <div class="battle-dialogue"></div>
        <div class="praise"></div>
      </section>
      <div class="timeline"><i></i></div>
      <p class="watch-note">당신의 명령은 끝났습니다. 이제 결과가 당신에게 돌아옵니다.</p>
    </section>
  `, { scene: 'battle', eyebrow: `SEED ${state.battle.seed}`, compact: true });

  moveGuard(plan.protectedId);
  const progress = app.querySelector('.timeline i');
  const message = app.querySelector('#battle-message');
  requestAnimationFrame(() => { if (progress) progress.style.width = '100%'; });

  later(() => { message.textContent = '유리 사냥꾼들이 성소의 외피를 찢고 들어온다.'; }, 450);

  if (state.selectedPlan === 'seris') {
    later(() => { battleDialogue('vael', '세리스, 고개 숙여!'); hit('seris', 46); }, 1000);
    later(() => {
      hit('vael', 18);
      setHp('seris', 100);
      praise('당신의 명령이 작동했다', '베일이 세리스의 치명상을 대신 받았습니다.', 'gold');
    }, 1380);
    later(() => {
      message.textContent = '세리스가 월광 의식을 시작한다.';
      app.querySelector('[data-character="seris"]')?.classList.add('channeling');
      battleDialogue('seris', '셋만 세. 그 안에 끝낼게.');
    }, 2250);
    later(() => { battleDialogue('mirel', '베일, 숨 쉬어. 내가 붙일게.'); healAll(14); }, 3100);
    later(() => { hit('mirel', 38); }, 4050);
    later(() => {
      hit('mirel', 34);
      battleDialogue('mirel', '나는 괜찮아. 세리스 쪽 봐.');
      praise('보호의 반대편', '세리스를 지킨 만큼 미렐이 홀로 버티고 있습니다.', 'danger');
    }, 4750);
    later(() => {
      defeatEnemies();
      praise('월광 군무', '끝까지 지켜낸 의식이 전장을 쓸어버립니다.', 'gold');
    }, 5650);
    later(() => { hit('mirel', 42); }, 7350);
  } else {
    later(() => { battleDialogue('seris', '괜찮아. 아직 보여.'); hit('seris', 34); }, 1000);
    later(() => {
      battleDialogue('vael', '미렐 뒤로.');
      praise('당신의 명령이 작동했다', '베일이 생태계의 회복축을 붙잡습니다.', 'gold');
    }, 1700);
    later(() => { battleDialogue('mirel', '다들 숨 쉬어. 아직 연결돼 있어.'); healAll(13); }, 2450);
    later(() => { hit('seris', 31); }, 3250);
    later(() => {
      app.querySelector('[data-character="seris"]')?.classList.add('interrupted');
      battleDialogue('seris', '…빛이 끊겼어.');
      praise('보호의 반대편', '미렐을 지킨 만큼 세리스의 의식이 깨집니다.', 'danger');
    }, 3600);
    later(() => { hit('seris', 42); }, 5350);
    later(() => {
      battleDialogue('vael', '그럼 내가 끝낸다.');
      defeatEnemies();
      praise('상실 반응', '빈자리에 반응한 베일이 전열을 무너뜨립니다.', 'gold');
    }, 6650);
  }

  later(() => {
    setHp(downedId, 0);
    message.textContent = `${CHARACTERS[downedId].name}의 호흡이 카라반의 맥박에서 사라진다.`;
    const lastLine = downedId === 'mirel' ? '…꽃이 안 움직여.' : '별이… 하나 모자라네.';
    battleDialogue(downedId, lastLine);
    praise(`${CHARACTERS[downedId].name}가 쓰러졌다`, '승리는 남았지만, 생태계에는 빈자리가 생겼습니다.', 'danger');
  }, 7800);

  later(renderAftermath, 9400);
}

function renderAftermath() {
  clearTimers();
  state.screen = 'aftermath';
  const downed = CHARACTERS[state.battle.plan.downedId];
  const lines = fallScenes[downed.id];

  sceneShell(`
    <section class="aftermath">
      <div class="aftermath-vista">
        <div class="broken-moon"></div>
        <div class="fallen-frame">
          ${portrait(downed, 'fallen-portrait')}
          <div class="pulse-line"></div>
        </div>
      </div>

      <p class="kicker danger-text">THE BATTLE IS OVER</p>
      <h1>승리했다.<br>그런데 ${downed.name}가 없다.</h1>

      <div class="aftermath-dialogue">
        ${lines.map(([speaker, name, text]) => `
          <article class="aftermath-line">
            <span class="mini-name">${name}</span>
            <p>“${text}”</p>
          </article>
        `).join('')}
      </div>

      <div class="clock-warning">
        <strong>추격대 재접촉까지 22분</strong>
        <span>돌아가면 이번 전투에서 얻은 모든 이득을 잃습니다.</span>
      </div>

      <button id="to-choice" class="story-cta danger-cta">
        선택해야 한다
        <span>효율과 애정이 처음으로 서로 다른 방향을 가리킵니다.</span>
      </button>
    </section>
  `, { scene: 'aftermath', eyebrow: 'SOMEONE IS MISSING' });

  app.querySelector('#to-choice').addEventListener('click', renderResult);
}

function renderResult() {
  clearTimers();
  state.screen = 'result';
  const downed = CHARACTERS[state.battle.plan.downedId];

  sceneShell(`
    <section class="result-wrap">
      <p class="kicker danger-text">THE COST OF ATTACHMENT</p>
      <h1>${downed.name}를 위해<br>얼마나 망가질 수 있는가?</h1>
      <p class="result-lead">대체자를 찾는 편이 싸고 빠르다. 게임은 그 사실을 숨기지 않는다.</p>

      <div class="choice-ledger">
        <div class="ledger-person">${portrait(downed, 'ledger-portrait')}<strong>${downed.name}</strong><span>${downed.epithet}</span></div>
        <div class="ledger-lines">
          <div><span>회수 작전</span><b>가능</b></div>
          <div><span>이번 전투 보상</span><b class="bad">전부 소실</b></div>
          <div><span>카라반 생명력</span><b class="bad">-25%</b></div>
          <div><span>다음 구역 위험</span><b class="bad">+1</b></div>
          <div><span>효율 평가</span><b class="terrible">최악</b></div>
        </div>
      </div>

      <div class="result-actions">
        <button class="recover" data-choice="rescue">
          <small>ATTACHMENT</small>
          <strong>되돌아간다</strong>
          <span>“우리 셋이 떠났으니, 셋이 돌아간다.”</span>
        </button>
        <button class="leave" data-choice="leave">
          <small>EFFICIENCY</small>
          <strong>동쪽으로 간다</strong>
          <span>보상을 지키고 카라반을 살린다.</span>
        </button>
      </div>
    </section>
  `, { scene: 'result', eyebrow: 'LOVE MAKES YOU INEFFICIENT' });

  app.querySelectorAll('[data-choice]').forEach(button => {
    button.addEventListener('click', () => renderEpilogue(button.dataset.choice));
  });
}

function renderEpilogue(choice) {
  clearTimers();
  state.screen = 'epilogue';
  const downed = CHARACTERS[state.battle.plan.downedId];
  const rescued = choice === 'rescue';

  const rescueCopy = downed.id === 'mirel'
    ? ['미렐', '왜 왔어?', '세리스', '계산은 끝났어. 최악의 선택이래.', '베일', '그래서 왔지.']
    : ['세리스', '왜 돌아왔어?', '미렐', '네가 없으면 별을 누가 세어.', '베일', '설명은 걸으면서 해.'];

  sceneShell(`
    <section class="epilogue ${rescued ? 'rescued' : 'left'}">
      <p class="chapter">MEMORY CREATED</p>
      ${rescued ? `
        <div class="return-vista">
          ${portrait(downed, 'hero-return')}
          <div class="return-halo"></div>
        </div>
        <h1>${downed.name}를 데리고 돌아왔다.</h1>
        <div class="epilogue-dialogue">
          <p><b>${rescueCopy[0]}</b> “${rescueCopy[1]}”</p>
          <p><b>${rescueCopy[2]}</b> “${rescueCopy[3]}”</p>
          <p><b>${rescueCopy[4]}</b> “${rescueCopy[5]}”</p>
        </div>
        <blockquote>당신은 대답하지 않았다.<br>카라반의 심장이 이미 대답하고 있었다.</blockquote>
        <div class="memory-card">
          <span>기억 · 되돌아온 밤</span>
          <strong>${downed.name}에게 이 밤의 흔적이 남았습니다.</strong>
          <em>효율은 나빠졌지만, 이 관계는 다음 전투의 행동을 바꿀 수 있습니다.</em>
        </div>
      ` : `
        <div class="empty-place"><i></i></div>
        <h1>카라반은 더 가벼워졌다.</h1>
        <div class="epilogue-dialogue">
          <p><b>베일</b> “이름을 말해.”</p>
          <p><b>${downed.id === 'mirel' ? '세리스' : '미렐'}</b> “…”</p>
        </div>
        <blockquote>그날 이후 카라반은 매 밤<br>빈 자리 하나를 피해 돌아누웠다.</blockquote>
        <div class="memory-card loss-memory">
          <span>기억 · 비워 둔 자리</span>
          <strong>${downed.name}의 자리는 사라지지 않았습니다.</strong>
          <em>효율적인 선택도 세계에 흔적을 남깁니다.</em>
        </div>
      `}

      <button id="replay" class="story-cta epilogue-cta">
        다른 운명을 본다
        <span>보호 대상을 바꾸면 누가 쓰러지는지 달라집니다.</span>
      </button>
    </section>
  `, { scene: 'epilogue', eyebrow: rescued ? 'ATTACHMENT > EFFICIENCY' : 'EFFICIENCY > ATTACHMENT' });

  app.querySelector('#replay').addEventListener('click', () => {
    state.selectedPlan = state.selectedPlan === 'seris' ? 'mirel' : 'seris';
    state.dialogueIndex = campDialogue.length - 3;
    renderCamp();
  });
}

window.addEventListener('error', event => {
  console.error(event.error || event.message);
  document.body.dataset.runtimeError = 'true';
});

renderColdOpen();

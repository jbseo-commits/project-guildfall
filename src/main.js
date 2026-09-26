import './style.css';
import { CHARACTERS, PLANS, createPrototypeBattle } from './game/prototype.js';

const app = document.querySelector('#app');
const state = {
  screen: 'plan',
  selectedPlan: 'seris',
  battle: null,
  timers: [],
};

const characterOrder = ['vael', 'seris', 'mirel'];

function clearTimers() {
  state.timers.forEach(clearTimeout);
  state.timers = [];
}

function later(fn, ms) {
  const id = setTimeout(fn, ms);
  state.timers.push(id);
  return id;
}

function characterMarkup(character, extraClass = '') {
  return `
    <article class="character-card ${extraClass}" data-character="${character.id}">
      <div class="portrait portrait-${character.id}" aria-hidden="true">
        <div class="portrait-aura"></div>
        <div class="portrait-wings"></div>
        <div class="portrait-horns"></div>
        <div class="portrait-face"><i></i><i></i></div>
        <div class="portrait-body"></div>
      </div>
      <div class="character-copy">
        <strong>${character.name}</strong>
        <span>${character.epithet}</span>
      </div>
      <div class="hp"><i style="width:100%"></i></div>
    </article>`;
}

function shell(content, eyebrow = 'VERTICAL SLICE V1 · MOBILE FALLBACK') {
  app.innerHTML = `
    <main class="shell">
      <header class="topbar">
        <div>
          <div class="brand">LIVING CARAVAN</div>
          <div class="brand-sub">살아있는 카라반 · playable prototype</div>
        </div>
        <div class="eyebrow">${eyebrow}</div>
      </header>
      ${content}
    </main>`;
}

function renderPlan() {
  clearTimers();
  state.screen = 'plan';
  const plan = PLANS[state.selectedPlan];
  shell(`
    <section class="intro">
      <p class="kicker">READ → PLAN</p>
      <h1>누구를 지킬 것인가?</h1>
      <p>선택은 하나뿐입니다. 전투는 그 선택을 크게 기억합니다.</p>
    </section>

    <section class="ecosystem">
      <div class="bond bond-left"></div>
      <div class="bond bond-right"></div>
      ${characterOrder.map((id) => characterMarkup(CHARACTERS[id], id === plan.protectedId ? 'protected' : '')).join('')}
    </section>

    <section class="decision-panel">
      <div class="decision-caption">베일의 보호 본능을 한 명에게 고정합니다.</div>
      ${Object.values(PLANS).map((p) => `
        <button class="plan-option ${p.id === state.selectedPlan ? 'selected' : ''}" data-plan="${p.id}">
          <span class="plan-title">${p.kicker} · ${p.title}</span>
          <span class="plan-detail">${p.reward}</span>
          <span class="plan-risk">위험: ${p.risk}</span>
        </button>
      `).join('')}
      <button id="commit" class="commit">COMMIT — 이 계획으로 간다<span>누르는 순간부터 당신은 개입하지 않습니다.</span></button>
    </section>
  `);

  app.querySelectorAll('[data-plan]').forEach((button) => {
    button.addEventListener('click', () => {
      state.selectedPlan = button.dataset.plan;
      renderPlan();
    });
  });
  app.querySelector('#commit').addEventListener('click', startBattle);
}

function setHp(id, hp) {
  const card = app.querySelector(`[data-character="${id}"]`);
  if (!card) return;
  const bar = card.querySelector('.hp i');
  bar.style.width = `${Math.max(0, hp)}%`;
  if (hp <= 0) card.classList.add('downed');
  else if (hp < 35) card.classList.add('critical');
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
  later(() => panel?.classList.remove('show'), 1500);
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
  card.dataset.hp = String(next);
  card.classList.remove('hit');
  void card.offsetWidth;
  card.classList.add('hit');
  setHp(id, next);
  flash('impact');
}

function healAll(amount) {
  characterOrder.forEach((id) => {
    const card = app.querySelector(`[data-character="${id}"]`);
    if (!card || card.classList.contains('downed')) return;
    const current = Number(card.dataset.hp || 100);
    const next = Math.min(100, current + amount);
    card.dataset.hp = String(next);
    setHp(id, next);
  });
  flash('heal');
}

function enemyDamageAll() {
  app.querySelectorAll('.enemy').forEach((enemy, index) => {
    enemy.classList.add('defeated');
    later(() => { enemy.style.opacity = String(0.15 + index * 0.03); }, 250);
  });
  flash('burst');
}

function startBattle() {
  clearTimers();
  state.screen = 'battle';
  state.battle = createPrototypeBattle(state.selectedPlan);
  const plan = state.battle.plan;
  shell(`
    <section class="battle-wrap">
      <div class="battle-heading">
        <p class="kicker">COMMIT → WATCH</p>
        <h1>계획을 실행합니다</h1>
        <p id="battle-message">카라반이 위협을 감지했습니다.</p>
      </div>

      <section class="battle-arena">
        <div class="enemy-line">
          <div class="enemy"><i></i><span>유리 사냥꾼</span></div>
          <div class="enemy"><i></i><span>백철 창기병</span></div>
          <div class="enemy"><i></i><span>성흔 사냥개</span></div>
        </div>
        <div class="battle-links"></div>
        <div class="party-line">
          ${characterOrder.map((id) => characterMarkup(CHARACTERS[id])).join('')}
        </div>
        <div class="praise"></div>
      </section>
      <div class="timeline"><i></i></div>
    </section>
  `, `SEED ${state.battle.seed}`);

  app.querySelectorAll('.character-card').forEach((card) => { card.dataset.hp = '100'; });
  moveGuard(plan.protectedId);
  const progress = app.querySelector('.timeline i');
  requestAnimationFrame(() => { progress.style.width = '100%'; });

  const message = app.querySelector('#battle-message');
  const downedId = plan.downedId;

  later(() => { message.textContent = '첫 번째 공격이 들어옵니다.'; }, 450);

  if (state.selectedPlan === 'seris') {
    later(() => { hit('seris', 46); }, 1050);
    later(() => {
      hit('vael', 18);
      setHp('seris', 100);
      praise('완벽한 엄호', '베일이 세리스에게 향한 치명타를 가로막았습니다.');
    }, 1380);
    later(() => {
      message.textContent = '세리스가 월광을 모읍니다…';
      app.querySelector('[data-character="seris"]')?.classList.add('channeling');
      praise('집중 유지', '당신의 선택 덕분에 월광 의식이 계속됩니다.');
    }, 2300);
    later(() => { healAll(14); }, 3150);
    later(() => { hit('mirel', 38); }, 4050);
    later(() => {
      hit('mirel', 34);
      praise('위험 노출', '보호가 세리스에게 묶인 동안 미렐이 고립됩니다.', 'danger');
    }, 4750);
    later(() => {
      enemyDamageAll();
      praise('월광 군무', '보호받은 집중이 전장을 뒤집었습니다.', 'gold');
    }, 5650);
    later(() => { hit('mirel', 42); }, 7350);
  } else {
    later(() => { hit('seris', 34); }, 1050);
    later(() => {
      praise('생태계 고정', '베일이 미렐의 곁을 지켜 회복축을 고정합니다.');
    }, 1750);
    later(() => {
      healAll(13);
      praise('꽃맥박', '미렐의 생명력이 카라반 전체로 퍼집니다.');
    }, 2500);
    later(() => { hit('seris', 31); }, 3300);
    later(() => {
      app.querySelector('[data-character="seris"]')?.classList.add('interrupted');
      praise('집중 붕괴', '세리스의 첫 번째 월광 의식이 끊겼습니다.', 'danger');
    }, 3600);
    later(() => { hit('seris', 42); }, 5400);
    later(() => {
      enemyDamageAll();
      praise('상실 반응', '베일이 세리스의 빈자리에 반응합니다.', 'gold');
    }, 6700);
  }

  later(() => {
    const card = app.querySelector(`[data-character="${downedId}"]`);
    if (card) {
      card.dataset.hp = '0';
      setHp(downedId, 0);
    }
    message.textContent = `${CHARACTERS[downedId].name}의 연결이 끊어졌습니다.`;
    praise(`${CHARACTERS[downedId].name}가 쓰러졌습니다`, '생태계의 일부가 비었습니다.', 'danger');
  }, 7850);

  later(renderResult, 9400);
}

function renderResult() {
  clearTimers();
  state.screen = 'result';
  const downed = CHARACTERS[state.battle.plan.downedId];
  shell(`
    <section class="result-wrap">
      <p class="kicker danger-text">승리했습니다. 하지만 하나가 비었습니다.</p>
      <h1>${downed.name}를 두고 갈 것인가?</h1>
      <div class="loss-card">
        ${characterMarkup(downed, 'downed permanent')}
        <div class="loss-copy">
          <blockquote>“유님 하나를 잃은 게 아니다.<br>우리의 일부가 사라졌다.”</blockquote>
          <p>${downed.name}는 ${downed.role}의 축입니다. 대체하는 편이 훨씬 효율젍랅니다.</p>
        </div>
      </div>
      <div class="result-actions">
        <button class="recover" data-choice="rescue"><strong>${downed.name}를 회수한다</strong><span>이번 보상 전부 포기 · 카라반 생명력 -25% · 다음 구역 위험 +1</span></button>
        <button class="leave" data-choice="leave"><strong>떠난다</strong><span>보상을 유지하고 다음 구역에서 새 존재를 받아들입니다.</span></button>
      </div>
      <p class="prototype-note">복구 비용 수치는 아직 프로토타입 가정입니다.</p>
    </section>
  `, 'DEBRIEF · THE COST OF ATTACHMENT');

  app.querySelectorAll('[data-choice]').forEach((button) => {
    button.addEventListener('click', () => renderEpilogue(button.dataset.choice));
  });
}

function renderEpilogue(choice) {
  clearTimers();
  state.screen = 'epilogue';
  const downed = CHARACTERS[state.battle.plan.downedId];
  const rescued = choice === 'rescue';
  shell(`
    <section class="epilogue ${rescued ? 'rescued' : 'left'}">
      ${rescued ? characterMarkup(downed, 'hero-return') : '<div class="empty-place"><i></i></div>'}
      <h1>${rescued ? `${downed.name}가 돌아왔습니다.` : '카라반은 더 가벼워졌습니다.'}</h1>
      <p>${rescued
        ? 'mڨ율은 나빠졌습니다. 하지만 카라반은 다시 온전해졌습니다. 이 비효율을 선택하게 만드는 것이 이 프로토타입의 핵심 감정입니다.'
        : `${downed.name}가 있던 자리는 그대로 비어 있습니다. 효율적인 선택도 정답이지만, 아무 일도 없었던 것처럼 지워지지는 않습니다.`}</p>
      <button id="replay" class="commit">다른 선택으로 다시 시연<span>보호 대상을 바꾸면 누가 위험해지는지 달라집니다.</span></button>
    </section>
  `, rescued ? 'ATTACHMENT > EFFICIENCY' : 'EFFICIENCY > ATTACHMENT');
  app.querySelector('#replay').addEventListener('click', renderPlan);
}

window.addEventListener('error', (event) => {
  console.error(event.error || event.message);
  document.body.dataset.runtimeError = 'true';
});

renderPlan();

import './style.css';
import { CHARACTERS } from './game/prototype.js';
import {
  TUTORIAL_STEPS,
  POSITIONS,
  BONDS,
  EDICTS,
  ENCOUNTERS,
  initialTutorialBuild,
  scoreBuild,
  buildCauseChain,
} from './game/tutorial.js';

const app = document.querySelector('#app');

const state = {
  screen: 'prologue',
  stageIndex: 0,
  build: initialTutorialBuild(),
  selectedCharacter: null,
  coachStep: 0,
  timers: [],
  battleHp: {},
  lastResult: null,
};

const characterOrder = ['vael', 'seris', 'mirel'];
const stageOrder = ['formation', 'bond', 'edict', 'exam'];

const coach = {
  formation: [
    { focus: 'enemy', title: '① 먼저 적을 읽는다', body: '유리 사냥개는 전투가 시작되면 FRONT를 물어뜯습니다. 숨겨진 주사위가 아니라, 읽을 수 있는 위협입니다.' },
    { focus: 'formation', title: '② 누가 그 공격을 받을지 정한다', body: '캐릭터를 누른 뒤 외피·심장·장막 슬롯을 눌러 배치하세요. 위치가 행동과 위험을 바꿉니다.' },
    { focus: 'commit', title: '③ COMMIT하면 손을 뗀다', body: '전투가 시작된 뒤에는 미세조작하지 않습니다. 내가 만든 구조가 스스로 싸우는 장면을 봅니다.' },
  ],
  bond: [
    { focus: 'enemy', title: '① 이번엔 후열도 공격받는다', body: '창기병은 FRONT를 묶고, 사냥꾼은 REAR의 의식자를 노립니다. 배치만으로 모든 문제를 풀 수 없습니다.' },
    { focus: 'bond', title: '② 공명은 자동 반응을 예약한다', body: '두 캐릭터를 연결하면 “이 일이 벌어졌을 때 저 캐릭터가 반응한다”는 사슬이 생깁니다.' },
    { focus: 'chain', title: '③ 발동 사슬을 미리 읽는다', body: '공명 카드의 TRIGGER → REACTION → PAYOFF를 보고 전투가 어떻게 흘러갈지 예상하세요.' },
  ],
  edict: [
    { focus: 'edict', title: '① 모든 행동을 지시하지 않는다', body: '대신 전투 전체가 따를 명령 하나만 각인합니다. 방어·의식·회복 중 무엇을 우선할지 선택합니다.' },
    { focus: 'edict', title: '② 강점에는 반드시 대가가 있다', body: '강한 명령일수록 trade-off가 있습니다. 상황을 읽지 않고 항상 같은 명령을 누를 수 없게 설계합니다.' },
    { focus: 'commit', title: '③ 이제 세 층이 함께 작동한다', body: '배치 + 공명 + 명령이 동시에 자동전투를 바꿉니다.' },
  ],
  exam: [],
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

function shell(content, options = {}) {
  const { scene = 'tutorial', eyebrow = 'LIVING CARAVAN · TUTORIAL', compact = false } = options;
  app.innerHTML = `
    <main class="shell ${compact ? 'compact' : ''}" data-scene="${scene}">
      <header class="topbar">
        <div>
          <div class="brand">LIVING CARAVAN</div>
          <div class="brand-sub">살아있는 성소 · tutorial vertical slice</div>
        </div>
        <div class="eyebrow">${eyebrow}</div>
      </header>
      ${content}
    </main>`;
  requestAnimationFrame(() => app.querySelector('.shell')?.classList.add('scene-in'));
}

function progressMarkup(activeIndex = state.stageIndex) {
  return `
    <nav class="tutorial-progress" aria-label="tutorial progress">
      ${TUTORIAL_STEPS.map((step, index) => `
        <div class="tutorial-step ${index < activeIndex ? 'done' : ''} ${index === activeIndex ? 'active' : ''}">
          <span>${index < activeIndex ? '✓' : step.icon}</span>
          <b>${step.label}</b>
        </div>
      `).join('')}
    </nav>`;
}

function renderPrologue() {
  clearTimers();
  state.screen = 'prologue';
  shell(`
    <section class="tutorial-prologue">
      <div class="prologue-vista">
        <div class="prologue-moon"></div>
        <div class="prologue-ark">
          <div class="ark-heart"></div>
          <div class="ark-rib r1"></div>
          <div class="ark-rib r2"></div>
          <div class="ark-rib r3"></div>
        </div>
      </div>

      <p class="chapter">PROLOGUE · NIGHT 47</p>
      <h1>세상이 성벽 안으로 숨어들 때,<br>우리는 살아있는 성소를 데리고 걸었다.</h1>
      <p class="prologue-copy">《아르카》는 배도, 성도 아니다. 세 존재의 본능과 관계가 서로를 살리는 하나의 생태계다.</p>

      <div class="prologue-cast">
        ${characterOrder.map(id => {
          const c = CHARACTERS[id];
          const quote = id === 'vael'
            ? '“누가 맞을지는 내가 정하지. 네가 위치만 정해.”'
            : id === 'seris'
              ? '“시간만 벌어줘. 그러면 끝낼 수 있어.”'
              : '“쓰러지기 전에 알려줘. 뿌리는 생각보다 빨라.”';
          return `
            <article>
              ${portrait(c)}
              <div><strong>${c.name}</strong><span>${c.epithet}</span><p>${quote}</p></div>
            </article>`;
        }).join('')}
      </div>

      <button id="begin-tutorial" class="story-cta">
        카라반이 싸우는 법을 배운다
        <span>약 5분 · 네 번의 짧은 전투</span>
      </button>
    </section>
  `, { scene: 'tutorial-prologue', eyebrow: 'PLAYABLE TUTORIAL · CHAPTER 0' });

  app.querySelector('#begin-tutorial').addEventListener('click', renderTutorialMap);
}

function renderTutorialMap() {
  clearTimers();
  state.screen = 'tutorial-map';
  shell(`
    <section class="tutorial-map">
      ${progressMarkup(-1)}
      <p class="chapter">CHAPTER 0 · 아르카의 세 가지 문법</p>
      <h1>오토배틀은 자동이지만,<br>결과는 자동으로 정해지지 않는다.</h1>
      <p class="map-copy">당신이 만드는 것은 공격 명령이 아니라 <b>행동 구조</b>다. 네 번의 전투로 하나씩 배운다.</p>

      <div class="lesson-cards">
        ${TUTORIAL_STEPS.map((step, index) => `
          <article class="lesson-card ${index === 3 ? 'final' : ''}">
            <span class="lesson-index">${step.icon}</span>
            <div>
              <strong>${step.label}</strong>
              <p>${step.description}</p>
            </div>
            <em>${index === 0 ? 'UNLOCKED' : index === 3 ? 'FINAL' : 'LOCKED'}</em>
          </article>
        `).join('')}
      </div>

      <div class="game-grammar">
        <span>게임의 기본 문장</span>
        <strong>READ → BUILD → COMMIT → WATCH → UNDERSTAND</strong>
      </div>

      <button id="start-stage" class="story-cta">LESSON I 시작<span>먼저 “배치” 하나만 배웁니다.</span></button>
    </section>
  `, { scene: 'tutorial-map', eyebrow: 'HOW THIS GAME WORKS' });

  app.querySelector('#start-stage').addEventListener('click', () => {
    state.stageIndex = 0;
    state.coachStep = 0;
    renderBuilder();
  });
}

function currentStageId() {
  return stageOrder[state.stageIndex];
}

function currentEncounter() {
  return ENCOUNTERS[currentStageId()];
}

function mechanicUnlocked(id) {
  return currentEncounter().available.includes(id);
}

function enemyMarkup(enemy) {
  const targetLabel = enemy.target === 'front' ? 'FRONT'
    : enemy.target === 'rear' ? 'REAR'
      : enemy.target === 'weakest' ? 'LOW HP' : enemy.target.toUpperCase();

  return `
    <article class="intent-card">
      <div class="enemy-sigil enemy-${enemy.id}"><i></i></div>
      <div class="intent-copy">
        <div><strong>${enemy.name}</strong><span>${enemy.trait}</span></div>
        <p>${enemy.intent}</p>
        <em>TARGET · ${targetLabel}</em>
      </div>
    </article>`;
}

function formationMarkup() {
  return `
    <section class="builder-section formation-builder" data-focus-zone="formation">
      <div class="builder-heading">
        <div><span>01</span><strong>배치</strong></div>
        <small>캐릭터 → 슬롯 순서로 누르세요.</small>
      </div>

      <div class="roster-select">
        ${characterOrder.map(id => {
          const c = CHARACTERS[id];
          return `
            <button class="roster-chip ${state.selectedCharacter === id ? 'selected' : ''}" data-character-select="${id}">
              ${portrait(c, 'mini')}
              <span>${c.name}</span>
            </button>`;
        }).join('')}
      </div>

      <div class="formation-slots">
        ${POSITIONS.map((position, index) => {
          const id = state.build.formation[index];
          const c = CHARACTERS[id];
          return `
            <button class="formation-slot slot-${position.id}" data-position="${index}">
              <div class="slot-meta"><span>${position.en}</span><strong>${position.label}</strong></div>
              ${portrait(c, 'slot-portrait')}
              <b>${c.name}</b>
              <small>${position.rule}</small>
            </button>`;
        }).join('')}
      </div>
    </section>`;
}

function bondMarkup() {
  const locked = !mechanicUnlocked('bond');
  return `
    <section class="builder-section bond-builder ${locked ? 'locked' : ''}" data-focus-zone="bond">
      <div class="builder-heading">
        <div><span>02</span><strong>공명</strong></div>
        <small>${locked ? 'Lesson II에서 해금' : '둘의 자동 반응을 연결합니다.'}</small>
      </div>
      ${locked ? `
        <div class="locked-mechanic"><i>II</i><p>배치를 이해하면 해금됩니다.<br><b>“누가 누구에게 반응하는가”</b></p></div>
      ` : `
        <div class="bond-options">
          ${Object.values(BONDS).map(bond => `
            <button class="bond-card ${state.build.bond === bond.id ? 'selected' : ''}" data-bond="${bond.id}">
              <span class="bond-title">${bond.title}</span>
              <strong>${bond.short}</strong>
              <p>${bond.description}</p>
              <div class="chain-mini" data-focus-zone="chain">
                <span>${bond.trigger}</span><i>→</i><span>${bond.reaction}</span><i>→</i><span>${bond.payoff}</span>
              </div>
            </button>
          `).join('')}
        </div>
      `}
    </section>`;
}

function edictMarkup() {
  const locked = !mechanicUnlocked('edict');
  return `
    <section class="builder-section edict-builder ${locked ? 'locked' : ''}" data-focus-zone="edict">
      <div class="builder-heading">
        <div><span>03</span><strong>명령 각인</strong></div>
        <small>${locked ? 'Lesson III에서 해금' : '전투 전체가 따를 원칙 하나'}</small>
      </div>
      ${locked ? `
        <div class="locked-mechanic"><i>III</i><p>공명을 이해하면 해금됩니다.<br><b>미세조작 대신 우선순위 하나.</b></p></div>
      ` : `
        <div class="edict-options">
          ${Object.values(EDICTS).map(edict => `
            <button class="edict-card ${state.build.edict === edict.id ? 'selected' : ''}" data-edict="${edict.id}">
              <span class="edict-sigil">${edict.sigil}</span>
              <strong>${edict.title}</strong>
              <p>${edict.description}</p>
              <em>+ ${edict.effect}</em>
              <small>− ${edict.tradeoff}</small>
            </button>
          `).join('')}
        </div>
      `}
    </section>`;
}

function coachMarkup(stageId) {
  const notes = coach[stageId];
  if (!notes?.length) return '';
  const note = notes[Math.min(state.coachStep, notes.length - 1)];
  return `
    <aside class="tutorial-coach" data-coach-focus="${note.focus}">
      <div class="coach-head"><span>GUIDE ${state.coachStep + 1}/${notes.length}</span><button id="skip-coach">건너뛰기</button></div>
      <strong>${note.title}</strong>
      <p>${note.body}</p>
      <button id="coach-next">${state.coachStep === notes.length - 1 ? '이제 직접 해보기' : '다음'}</button>
    </aside>`;
}

function applyFocus() {
  const note = coach[currentStageId()]?.[state.coachStep];
  app.querySelectorAll('[data-focus-zone]').forEach(el => el.classList.remove('tutorial-focus'));
  if (!note) return;
  app.querySelectorAll(`[data-focus-zone="${note.focus}"]`).forEach(el => el.classList.add('tutorial-focus'));
}

function renderBuilder() {
  clearTimers();
  state.screen = 'builder';
  const stageId = currentStageId();
  const encounter = currentEncounter();
  const isExam = stageId === 'exam';

  shell(`
    <section class="tutorial-builder">
      ${progressMarkup()}
      <div class="lesson-title">
        <p class="chapter">${encounter.lesson}</p>
        <h1>${encounter.title}</h1>
        <p>${encounter.narrative}</p>
      </div>

      <section class="enemy-read" data-focus-zone="enemy">
        <div class="builder-heading">
          <div><span>READ</span><strong>적 의도</strong></div>
          <small>전투 전 공개 정보</small>
        </div>
        <div class="intent-list">${encounter.enemies.map(enemyMarkup).join('')}</div>
        <div class="briefing"><i>!</i><p>${encounter.briefing}</p></div>
      </section>

      <div class="build-stack">
        ${formationMarkup()}
        ${bondMarkup()}
        ${edictMarkup()}
      </div>

      <section class="build-summary" data-focus-zone="commit">
        <span>현재 설계</span>
        <div class="summary-row">
          <b>${state.build.formation.map(id => CHARACTERS[id].name).join(' → ')}</b>
          <em>${mechanicUnlocked('bond') ? BONDS[state.build.bond].title : '공명 잠김'}</em>
          <em>${mechanicUnlocked('edict') ? EDICTS[state.build.edict].title : '명령 잠김'}</em>
        </div>
        ${isExam ? '<p>이번에는 추천 표시가 없습니다. 적 의도만 보고 스스로 설계하세요.</p>' : `<p>힌트 · ${encounter.successHint}</p>`}
      </section>

      <button id="commit-build" class="commit tutorial-commit">
        COMMIT — 이 생태계로 싸운다
        <span>전투가 시작되면 직접 조작할 수 없습니다.</span>
      </button>

      ${coachMarkup(stageId)}
    </section>
  `, { scene: 'tutorial-builder', eyebrow: `LESSON ${state.stageIndex + 1} / 4` });

  app.querySelectorAll('[data-character-select]').forEach(button => {
    button.addEventListener('click', () => {
      state.selectedCharacter = button.dataset.characterSelect;
      renderBuilder();
    });
  });

  app.querySelectorAll('[data-position]').forEach(button => {
    button.addEventListener('click', () => {
      if (!state.selectedCharacter) {
        state.selectedCharacter = state.build.formation[Number(button.dataset.position)];
        renderBuilder();
        return;
      }
      const targetIndex = Number(button.dataset.position);
      const currentIndex = state.build.formation.indexOf(state.selectedCharacter);
      const other = state.build.formation[targetIndex];
      state.build.formation[targetIndex] = state.selectedCharacter;
      state.build.formation[currentIndex] = other;
      state.selectedCharacter = null;
      renderBuilder();
    });
  });

  app.querySelectorAll('[data-bond]').forEach(button => {
    button.addEventListener('click', () => {
      state.build.bond = button.dataset.bond;
      renderBuilder();
    });
  });

  app.querySelectorAll('[data-edict]').forEach(button => {
    button.addEventListener('click', () => {
      state.build.edict = button.dataset.edict;
      renderBuilder();
    });
  });

  app.querySelector('#commit-build').addEventListener('click', startTutorialBattle);

  const next = app.querySelector('#coach-next');
  if (next) {
    next.addEventListener('click', () => {
      const notes = coach[stageId];
      if (state.coachStep < notes.length - 1) {
        state.coachStep += 1;
        renderBuilder();
      } else {
        state.coachStep = notes.length;
        app.querySelector('.tutorial-coach')?.remove();
        app.querySelectorAll('.tutorial-focus').forEach(el => el.classList.remove('tutorial-focus'));
      }
    });
  }

  const skip = app.querySelector('#skip-coach');
  if (skip) {
    skip.addEventListener('click', () => {
      state.coachStep = coach[stageId].length;
      app.querySelector('.tutorial-coach')?.remove();
      app.querySelectorAll('.tutorial-focus').forEach(el => el.classList.remove('tutorial-focus'));
    });
  }

  requestAnimationFrame(applyFocus);
}

function hpBar(characterId) {
  return `
    <div class="battle-unit" data-battle-unit="${characterId}">
      ${portrait(CHARACTERS[characterId], 'battle-portrait')}
      <strong>${CHARACTERS[characterId].name}</strong>
      <div class="battle-hp"><i style="width:100%"></i></div>
      <small class="unit-action">대기</small>
    </div>`;
}

function updateUnit(id, hp, action = '') {
  state.battleHp[id] = Math.max(0, hp);
  const unit = app.querySelector(`[data-battle-unit="${id}"]`);
  if (!unit) return;
  const bar = unit.querySelector('.battle-hp i');
  if (bar) bar.style.width = `${state.battleHp[id]}%`;
  unit.classList.toggle('critical', state.battleHp[id] > 0 && state.battleHp[id] <= 35);
  unit.classList.toggle('downed', state.battleHp[id] <= 0);
  const actionEl = unit.querySelector('.unit-action');
  if (action && actionEl) actionEl.textContent = action;
}

function impact(id, className = 'hit') {
  const unit = app.querySelector(`[data-battle-unit="${id}"]`);
  if (!unit) return;
  unit.classList.remove('hit', 'guard-flash', 'heal-flash', 'cast-flash');
  void unit.offsetWidth;
  unit.classList.add(className);
}

function combatLog(title, text, tone = '') {
  const log = app.querySelector('.combat-log');
  if (!log) return;
  log.className = `combat-log show ${tone}`;
  log.innerHTML = `<strong>${title}</strong><span>${text}</span>`;
}

function startTutorialBattle() {
  clearTimers();
  state.screen = 'battle';
  const stageId = currentStageId();
  const encounter = currentEncounter();
  const result = scoreBuild(stageId, state.build);
  state.lastResult = result;
  state.battleHp = Object.fromEntries(characterOrder.map(id => [id, 100]));

  const enemyCards = encounter.enemies.map(enemy => `
    <div class="battle-enemy" data-enemy="${enemy.id}">
      <div class="enemy-sigil enemy-${enemy.id}"><i></i></div>
      <strong>${enemy.name}</strong>
      <span>${enemy.trait}</span>
    </div>`).join('');

  shell(`
    <section class="tutorial-battle">
      ${progressMarkup()}
      <div class="battle-top">
        <p class="chapter">COMMIT → WATCH</p>
        <h1>내 설계가 실제 행동이 된다.</h1>
        <p id="battle-caption">당신의 입력은 끝났습니다. 이제 생태계가 스스로 반응합니다.</p>
      </div>

      <div class="autobattle-arena">
        <div class="battle-enemies">${enemyCards}</div>
        <div class="reaction-lanes">
          <span class="lane front">FRONT</span>
          <span class="lane core">CORE</span>
          <span class="lane rear">VEIL</span>
        </div>
        <div class="battle-party">
          ${state.build.formation.map(id => hpBar(id)).join('')}
        </div>
        <div class="combat-log"></div>
      </div>

      <div class="battle-build-strip">
        <div><span>FORMATION</span><b>${state.build.formation.map(id => CHARACTERS[id].name).join(' → ')}</b></div>
        <div><span>RESONANCE</span><b>${mechanicUnlocked('bond') ? BONDS[state.build.bond].title : '—'}</b></div>
        <div><span>EDICT</span><b>${mechanicUnlocked('edict') ? EDICTS[state.build.edict].title : '—'}</b></div>
      </div>

      <div class="battle-progress"><i></i></div>
    </section>
  `, { scene: 'tutorial-battle', eyebrow: 'NO MICRO AFTER COMMIT', compact: true });

  const progress = app.querySelector('.battle-progress i');
  requestAnimationFrame(() => { if (progress) progress.style.width = '100%'; });

  runBattleTimeline(stageId, result);
}

function attackUnit(id, damage, label) {
  const next = Math.max(0, state.battleHp[id] - damage);
  updateUnit(id, next, label);
  impact(id, 'hit');
}

function healUnit(id, amount, label) {
  const next = Math.min(100, state.battleHp[id] + amount);
  updateUnit(id, next, label);
  impact(id, 'heal-flash');
}

function enemyFall(index = 0) {
  const enemies = [...app.querySelectorAll('.battle-enemy')];
  const enemy = enemies[index];
  if (enemy) enemy.classList.add('defeated');
}

function runBattleTimeline(stageId, result) {
  const formation = state.build.formation;
  const front = formation[0];
  const core = formation[1];
  const rear = formation[2];
  const caption = app.querySelector('#battle-caption');

  later(() => {
    combatLog('ENEMY INTENT', `${CHARACTERS[front].name}가 FRONT의 첫 충돌을 받습니다.`);
    attackUnit(front, front === 'vael' ? 24 : 43, '첫 충돌');
  }, 800);

  if (stageId !== 'formation' && state.build.bond === 'vael_seris' && rear === 'seris') {
    later(() => {
      combatLog('RESONANCE TRIGGER', '후열 저격 감지 → 수호의 월식이 발동합니다.', 'gold');
      impact('vael', 'guard-flash');
      updateUnit('vael', Math.max(0, state.battleHp.vael - 14), 'INTERCEPT');
      updateUnit('seris', state.battleHp.seris, '보호됨');
    }, 1850);
  } else if (stageId !== 'formation') {
    later(() => {
      combatLog('RESONANCE', BONDS[state.build.bond].description, 'gold');
      const [a, b] = BONDS[state.build.bond].members;
      impact(a, 'guard-flash');
      impact(b, 'cast-flash');
    }, 1850);
  }

  if (stageId === 'edict' || stageId === 'exam') {
    later(() => {
      const edict = EDICTS[state.build.edict];
      combatLog(`EDICT · ${edict.sigil}`, edict.effect, 'violet');
      if (state.build.edict === 'roots') {
        const weakest = characterOrder.reduce((a, b) => state.battleHp[a] <= state.battleHp[b] ? a : b);
        healUnit(weakest, 24, '선제 치유');
      }
      if (state.build.edict === 'shell') {
        impact(front, 'guard-flash');
      }
      if (state.build.edict === 'moon') {
        impact('seris', 'cast-flash');
        updateUnit('seris', state.battleHp.seris, '월광 의식');
      }
    }, 2850);
  }

  later(() => {
    const rearDamage = stageId === 'formation' ? 0 : (state.build.bond === 'vael_seris' ? 12 : 31);
    if (rearDamage) attackUnit(rear, rearDamage, '후열 공격');
    combatLog('AUTONOMOUS RESPONSE', '배치와 공명에 따라 각자가 스스로 다음 행동을 고릅니다.');
  }, 3650);

  later(() => {
    if (core === 'mirel') {
      healUnit(front, 18, '꽃맥박');
      combatLog('CORE BONUS', '미렐이 CORE에서 회복/공명 +20%를 받습니다.', 'green');
    } else {
      impact(core, 'cast-flash');
      combatLog('CORE', `${CHARACTERS[core].name}가 생태계 중심에서 공명을 증폭합니다.`);
    }
  }, 4550);

  later(() => {
    if (state.build.edict === 'moon' || rear === 'seris') {
      impact('seris', 'cast-flash');
      enemyFall(0);
      enemyFall(1);
      combatLog('PAYOFF', '세리스의 의식이 완성되어 적 전열을 쓸어냅니다.', 'violet');
    } else {
      impact('vael', 'guard-flash');
      enemyFall(0);
      combatLog('PAYOFF', '베일이 무너진 전열을 밀어내며 공간을 만듭니다.', 'gold');
    }
  }, 5450);

  later(() => {
    [...app.querySelectorAll('.battle-enemy')].forEach((_, index) => enemyFall(index));
    caption.textContent = result.grade === 'rough'
      ? '승리했지만 생태계 한 축이 무너졌습니다.'
      : '전투가 끝났습니다. 이제 왜 이렇게 싸웠는지 확인합니다.';

    if (result.grade === 'rough') {
      const victim = front === 'vael' ? rear : front;
      updateUnit(victim, 0, 'DOWN');
      combatLog('COLLAPSE', `${CHARACTERS[victim].name}의 연결이 끊겼습니다. 원인은 전투 후 분석에서 확인합니다.`, 'danger');
    } else if (result.grade === 'stable') {
      const victim = characterOrder.reduce((a, b) => state.battleHp[a] <= state.battleHp[b] ? a : b);
      updateUnit(victim, Math.min(state.battleHp[victim], 26), '위험');
    }
  }, 6500);

  later(renderDebrief, 7600);
}

function renderDebrief() {
  clearTimers();
  state.screen = 'debrief';
  const stageId = currentStageId();
  const cause = buildCauseChain(stageId, state.build);
  const gradeLabel = {
    mastery: 'SYNCHRONIZED',
    clean: 'CLEAN',
    stable: 'STABLE',
    rough: 'FRACTURED',
  }[cause.grade];

  shell(`
    <section class="tutorial-debrief">
      ${progressMarkup()}
      <p class="chapter">UNDERSTAND</p>
      <div class="debrief-grade grade-${cause.grade}">
        <span>${gradeLabel}</span>
        <strong>${cause.summary}</strong>
      </div>

      <h1>결과보다 먼저,<br>원인을 읽는다.</h1>
      <p class="debrief-copy">오토배틀은 블랙박스가 아니다. 당신이 만든 구조가 어떤 순서로 결과를 만들었는지 보여준다.</p>

      <div class="cause-chain">
        ${cause.chain.map(item => `
          <article class="cause-node ${item.good ? 'good' : 'bad'}">
            <span>${String(item.index).padStart(2, '0')}</span>
            <div><b>${item.label}</b><p>${item.text}</p></div>
          </article>
        `).join('')}
      </div>

      <div class="lesson-learned">
        <span>이번 전투에서 배운 것</span>
        <strong>${TUTORIAL_STEPS[state.stageIndex].description}</strong>
      </div>

      <button id="continue-tutorial" class="story-cta">
        ${state.stageIndex === 3 ? '튜토리얼을 끝낸다' : `LESSON ${state.stageIndex + 2}로 이동`}
        <span>${state.stageIndex === 3 ? '이제 세 시스템을 함께 사용할 수 있습니다.' : '다음 시스템을 하나 추가합니다.'}</span>
      </button>
    </section>
  `, { scene: 'tutorial-debrief', eyebrow: `DEBRIEF · ${gradeLabel}` });

  app.querySelector('#continue-tutorial').addEventListener('click', () => {
    if (state.stageIndex === 3) {
      renderTutorialComplete();
      return;
    }
    state.stageIndex += 1;
    state.coachStep = 0;
    renderUnlock();
  });
}

function renderUnlock() {
  clearTimers();
  state.screen = 'unlock';
  const step = TUTORIAL_STEPS[state.stageIndex];
  const copy = step.id === 'bond'
    ? ['배치만으로 해결되지 않는 위협이 나타났다.', '공명 해금', '이제 두 캐릭터 사이에 자동 반응 사슬을 만들 수 있습니다.']
    : step.id === 'edict'
      ? ['연결이 많아질수록 모든 행동을 직접 지시할 수 없다.', '명령 각인 해금', '전투 전체가 따를 우선순위 하나를 남깁니다.']
      : ['세 가지 문법을 모두 배웠다.', '독립 시험', '이번에는 가이드 없이 적을 읽고 직접 설계합니다.'];

  shell(`
    <section class="unlock-scene">
      ${progressMarkup()}
      <span class="unlock-roman">${step.icon}</span>
      <p>${copy[0]}</p>
      <h1>${copy[1]}</h1>
      <strong>${copy[2]}</strong>
      <div class="unlock-rule">${step.description}</div>
      <button id="enter-next" class="story-cta">계속<span>${step.id === 'exam' ? '추천 표시가 사라집니다.' : '새 시스템을 실제 전투에서 사용합니다.'}</span></button>
    </section>
  `, { scene: 'unlock', eyebrow: 'SYSTEM UNLOCKED' });

  app.querySelector('#enter-next').addEventListener('click', renderBuilder);
}

function renderTutorialComplete() {
  clearTimers();
  state.screen = 'complete';
  shell(`
    <section class="tutorial-complete">
      ${progressMarkup(4)}
      <div class="completion-ring"><span>✓</span></div>
      <p class="chapter">CHAPTER 0 COMPLETE</p>
      <h1>이제 아르카는<br>당신의 설계대로 싸운다.</h1>
      <p>전투 중 버튼을 빠르게 누르는 게임이 아니다. <b>읽고 → 구조를 만들고 → 손을 떼고 → 결과를 이해하는 게임</b>이다.</p>

      <div class="mastery-preview">
        <span>숙련자가 되면</span>
        <div>공명 2중 연결</div>
        <div>조건부 본능 우선순위</div>
        <div>“HP &lt; 40%일 때” 같은 세부 반응 규칙</div>
        <div>카라반 기관과 캐릭터 행동의 결합</div>
        <small>※ 이 고급 시스템은 아직 D002로 확정되지 않은 방향성 예고입니다.</small>
      </div>

      <div class="complete-cast">
        ${characterOrder.map(id => `<div>${portrait(CHARACTERS[id])}<strong>${CHARACTERS[id].name}</strong></div>`).join('')}
      </div>

      <button id="replay-tutorial" class="story-cta">처음부터 다시 플레이<span>다른 배치·공명·명령 조합을 시험합니다.</span></button>
    </section>
  `, { scene: 'tutorial-complete', eyebrow: 'READ · BUILD · COMMIT · WATCH' });

  app.querySelector('#replay-tutorial').addEventListener('click', () => {
    state.stageIndex = 0;
    state.build = initialTutorialBuild();
    state.selectedCharacter = null;
    state.coachStep = 0;
    renderTutorialMap();
  });
}

window.addEventListener('error', event => {
  console.error(event.error || event.message);
  document.body.dataset.runtimeError = 'true';
});

renderPrologue();

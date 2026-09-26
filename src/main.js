import './style.css';
import { APPROVED_CONCEPT_ART } from './approvedConceptArt.js';

const app = document.querySelector('#app');

const steps = [
  {
    id: 'read',
    label: '읽기',
    title: '적의 의도를 먼저 읽습니다',
    body: '후열 저격수가 세리스를 노립니다. 자동전투라도 위협은 숨겨져 있지 않습니다.',
    focus: 'intent',
    tip: '빨간 화살표와 표식은 “누가 공격받을지”를 미리 알려줍니다.',
  },
  {
    id: 'formation',
    label: '배치',
    title: '누가 공격을 받을지 배치합니다',
    body: '베일을 전열에 두고 세리스를 후열에 둡니다. 전투는 배치 완료 후 자동으로 진행됩니다.',
    focus: 'formation',
    tip: '전열은 가까운 적의 공격을 먼저 받고, 후열은 집중과 원거리 행동에 유리합니다.',
  },
  {
    id: 'battle',
    label: '전투',
    title: '이제 손을 뗍니다',
    body: '베일이 공격을 가로막고, 미렐이 치유하고, 세리스가 의식을 완성합니다.',
    focus: 'battle',
    tip: '내 선택이 실제 캐릭터 행동으로 읽혀야 오토배틀러가 됩니다.',
  },
  {
    id: 'result',
    label: '결과',
    title: '왜 이겼는지 복기합니다',
    body: '배치 → 베일 가로막기 → 세리스 의식 유지 → 월광 폭발. 결과가 아니라 원인을 보여줍니다.',
    focus: 'hud',
    tip: '하단 HUD가 각 캐릭터의 HP·상태·행동을 계속 기록합니다.',
  },
  {
    id: 'next',
    label: '다음',
    title: '다음 전투부터는 공명을 추가합니다',
    body: '두 캐릭터를 연결해 TRIGGER → REACTION → PAYOFF 사슬을 직접 설계합니다.',
    focus: 'full',
    tip: '튜토리얼은 실제 게임 화면을 떠나지 않고, 한 시스템씩 겹쳐서 가르칩니다.',
  },
];

let stepIndex = 0;
let playing = false;

function render() {
  const step = steps[stepIndex];
  app.innerHTML = `
    <main class="arena-prototype">
      <img class="concept-art" src="${APPROVED_CONCEPT_ART}" alt="Living Caravan arena tutorial visual target" />
      <div class="grade-glass"></div>

      <header class="live-topbar">
        <div class="day-badge"><span>☾</span><b>1일차</b><small>떠나는 밤</small></div>
        <div class="resource-strip"><span>◉ 320</span><span>◆ 3</span><span>▤ 2</span><button>⚙</button></div>
      </header>

      <nav class="side-menu">
        <button class="active">♜<span>카라반</span></button>
        <button>♙<span>동료</span></button>
        <button>⚔<span>장비</span></button>
        <button>▣<span>기록</span></button>
      </nav>

      <section class="focus-zone zone-intent ${step.focus === 'intent' ? 'active' : ''}"></section>
      <section class="focus-zone zone-formation ${step.focus === 'formation' ? 'active' : ''}"></section>
      <section class="focus-zone zone-battle ${step.focus === 'battle' ? 'active' : ''}"></section>
      <section class="focus-zone zone-hud ${step.focus === 'hud' ? 'active' : ''}"></section>

      <aside class="coach-card ${step.focus}">
        <div class="coach-progress">튜토리얼 ${stepIndex + 1}/5</div>
        <h2>${step.title}</h2>
        <p>${step.body}</p>
        <div class="coach-tip"><b>TIP</b><span>${step.tip}</span></div>
        <button id="next-step">${stepIndex === steps.length - 1 ? '처음부터 보기' : '확인 →'}</button>
      </aside>

      <div class="battle-controls">
        <b>${playing ? '전투 중…' : stepIndex < 2 ? '배치 단계' : '자동전투 준비'}</b>
        <button id="pause">${playing ? 'Ⅱ' : '▶'}</button>
        <button id="speed">×2</button>
      </div>

      <div class="battle-pulse ${playing ? 'playing' : ''}"></div>

      <footer class="tutorial-track">
        ${steps.map((s, i) => `
          <button data-step="${i}" class="${i < stepIndex ? 'done' : ''} ${i === stepIndex ? 'active' : ''}">
            <i>${i < stepIndex ? '✓' : i + 1}</i>
            <strong>${s.label}</strong>
            <span>${i === 0 ? '적 의도' : i === 1 ? '동료 위치' : i === 2 ? '자동 진행' : i === 3 ? '전투 복기' : '선택지'}</span>
          </button>`).join('')}
      </footer>

      <div class="rotate-hint">
        <div>↻</div>
        <strong>가로 화면으로 돌려주세요</strong>
        <span>이 게임은 전장을 넓게 보는 16:9 화면을 기준으로 설계합니다.</span>
      </div>
    </main>
  `;

  app.querySelector('#next-step').addEventListener('click', () => {
    if (stepIndex === steps.length - 1) stepIndex = 0;
    else stepIndex += 1;
    if (stepIndex === 2) runBattleMoment();
    else render();
  });

  app.querySelectorAll('[data-step]').forEach(btn => {
    btn.addEventListener('click', () => {
      stepIndex = Number(btn.dataset.step);
      if (stepIndex === 2) runBattleMoment();
      else render();
    });
  });

  app.querySelector('#pause').addEventListener('click', () => {
    playing = !playing;
    render();
  });
}

function runBattleMoment() {
  playing = true;
  render();
  setTimeout(() => {
    const root = document.querySelector('.arena-prototype');
    if (!root) return;
    root.classList.add('impact');
  }, 700);
  setTimeout(() => {
    const root = document.querySelector('.arena-prototype');
    if (!root) return;
    root.classList.remove('impact');
    root.classList.add('heal');
  }, 1450);
  setTimeout(() => {
    const root = document.querySelector('.arena-prototype');
    if (!root) return;
    root.classList.remove('heal');
    root.classList.add('burst');
  }, 2200);
  setTimeout(() => {
    playing = false;
    stepIndex = 3;
    render();
  }, 3300);
}

render();

import { CHARACTERS } from './prototype.js';

export const TUTORIAL_STEPS = [
  { id: 'formation', index: 1, label: '배치', icon: 'I', description: '누가 위험을 먼저 받는지 정합니다.' },
  { id: 'bond', index: 2, label: '공명', icon: 'II', description: '두 존재의 자동 반응을 연결합니다.' },
  { id: 'edict', index: 3, label: '명령', icon: 'III', description: '전투 전체가 따를 원칙을 각인합니다.' },
  { id: 'exam', index: 4, label: '독립 시험', icon: 'IV', description: '적을 읽고 세 시스템을 함께 사용합니다.' },
];

export const POSITIONS = [
  {
    id: 'front',
    label: '외피',
    en: 'FRONT',
    description: '가장 먼저 충돌합니다.',
    rule: '첫 공격과 돌진의 우선 표적',
  },
  {
    id: 'core',
    label: '심장',
    en: 'CORE',
    description: '생태계의 중심입니다.',
    rule: '회복과 공명 효과 +20%',
  },
  {
    id: 'rear',
    label: '장막',
    en: 'VEIL',
    description: '직접 공격에서 비교적 안전합니다.',
    rule: '집중/의식 속도 +25%',
  },
];

export const BONDS = {
  vael_seris: {
    id: 'vael_seris',
    members: ['vael', 'seris'],
    title: '수호의 월식',
    short: '베일 ↔ 세리스',
    description: '세리스가 큰 피해를 받으면 베일이 대신 끼어듭니다.',
    trigger: '세리스 피격 ≥ 30',
    reaction: '베일 INTERCEPT',
    payoff: '세리스의 의식 유지',
  },
  vael_mirel: {
    id: 'vael_mirel',
    members: ['vael', 'mirel'],
    title: '뿌리의 갑주',
    short: '베일 ↔ 미렐',
    description: '미렐이 치유하면 베일이 잠시 강화되어 다음 공격을 받아냅니다.',
    trigger: '미렐 치유',
    reaction: '베일 GUARD +',
    payoff: '전열 유지력 증가',
  },
  seris_mirel: {
    id: 'seris_mirel',
    members: ['seris', 'mirel'],
    title: '월화 공생',
    short: '세리스 ↔ 미렐',
    description: '미렐의 치유가 세리스에게 닿으면 의식 시간이 단축됩니다.',
    trigger: '세리스가 치유됨',
    reaction: '의식 시간 -35%',
    payoff: '빠른 광역 폭발',
  },
};

export const EDICTS = {
  shell: {
    id: 'shell',
    title: '껍질을 닫아',
    sigil: 'DEFEND',
    description: '첫 3초 동안 받는 피해를 줄이고 베일의 가로막기 우선도를 높입니다.',
    effect: '초반 피해 -25% · INTERCEPT 강화',
    tradeoff: '공격 개시가 느려짐',
  },
  moon: {
    id: 'moon',
    title: '달을 끝까지 띄워',
    sigil: 'RITUAL',
    description: '세리스가 가장 먼저 의식을 시작하고, 끊기지 않으면 폭발력이 크게 증가합니다.',
    effect: '세리스 의식 +45% · 완성 시 광역 피해',
    tradeoff: '세리스가 노출됨',
  },
  roots: {
    id: 'roots',
    title: '뿌리를 깊게',
    sigil: 'SUSTAIN',
    description: '미렐이 위급한 아군을 더 빨리 감지하고 회복합니다.',
    effect: '치유 발동 기준 65% · 회복량 +30%',
    tradeoff: '순간 화력이 낮음',
  },
};

export const ENCOUNTERS = {
  formation: {
    id: 'formation',
    title: 'Lesson I · 외피는 누가 될 것인가',
    narrative: '유리 사냥개 한 마리가 카라반의 냄새를 맡았습니다.',
    lesson: 'FORMATION',
    available: ['formation'],
    enemies: [
      { id: 'hound', name: '유리 사냥개', trait: '돌진', intent: '전투 시작 시 FRONT를 강하게 공격', target: 'front' },
    ],
    suggested: {
      formation: ['vael', 'mirel', 'seris'],
      bond: 'vael_seris',
      edict: 'shell',
    },
    briefing: '적의 행동은 숨겨져 있지 않습니다. 읽고, 누가 그 행동을 받아낼지 배치합니다.',
    successHint: '베일은 큰 피해를 받아도 버티고, 세리스는 후열에서 의식을 준비할 수 있습니다.',
  },
  bond: {
    id: 'bond',
    title: 'Lesson II · 둘을 하나처럼 움직여라',
    narrative: '창기병은 전열을 묶고, 사냥꾼은 후열의 의식자를 노립니다.',
    lesson: 'RESONANCE',
    available: ['formation', 'bond'],
    enemies: [
      { id: 'lancer', name: '백철 창기병', trait: '고정', intent: 'FRONT를 묶어 이동/가로막기를 늦춤', target: 'front' },
      { id: 'hunter', name: '유리 사냥꾼', trait: '저격', intent: '가장 멀리 있는 의식자를 노림', target: 'rear' },
    ],
    suggested: {
      formation: ['vael', 'mirel', 'seris'],
      bond: 'vael_seris',
      edict: 'shell',
    },
    briefing: '배치만으로는 부족합니다. 공명은 “누가 누구에게 반응할지”를 미리 약속합니다.',
    successHint: '베일과 세리스를 연결하면 후열 저격이 자동으로 수호 반응을 불러냅니다.',
  },
  edict: {
    id: 'edict',
    title: 'Lesson III · 전투의 원칙을 하나만 남겨라',
    narrative: '세 마리가 동시에 달려옵니다. 모든 행동을 지시할 시간은 없습니다.',
    lesson: 'EDICT',
    available: ['formation', 'bond', 'edict'],
    enemies: [
      { id: 'hound', name: '성흔 사냥개', trait: '돌진', intent: 'FRONT를 압박', target: 'front' },
      { id: 'hunter', name: '유리 사냥꾼', trait: '저격', intent: 'REAR를 공격', target: 'rear' },
      { id: 'leech', name: '회백 흡혈충', trait: '쇠약', intent: '가장 낮은 HP를 추적', target: 'weakest' },
    ],
    suggested: {
      formation: ['vael', 'mirel', 'seris'],
      bond: 'seris_mirel',
      edict: 'roots',
    },
    briefing: '명령 각인은 미세조작이 아닙니다. 전투 전체가 따를 우선순위 하나를 고릅니다.',
    successHint: '지속전이라면 뿌리, 빠른 결착이라면 달, 불안정한 초반이라면 껍질이 강합니다.',
  },
  exam: {
    id: 'exam',
    title: 'Final · 이제 내가 설명하지 않는다',
    narrative: '카라반의 피냄새를 따라온 유리 추적대. 이번에는 세 행동을 모두 읽어야 합니다.',
    lesson: 'READ → BUILD → COMMIT',
    available: ['formation', 'bond', 'edict'],
    enemies: [
      { id: 'breaker', name: '수정 파쇄자', trait: '파쇄', intent: 'FRONT를 두 번 공격. 두 번째는 방어를 무시', target: 'front' },
      { id: 'seer', name: '맹안의 추적자', trait: '표식', intent: 'REAR에게 표식을 남긴 뒤 다음 공격 집중', target: 'rear' },
      { id: 'leech', name: '회백 흡혈충', trait: '포식', intent: 'HP 50% 이하 대상에게 돌진', target: 'weakest' },
    ],
    suggested: {
      formation: ['vael', 'mirel', 'seris'],
      bond: 'vael_mirel',
      edict: 'roots',
    },
    briefing: '정답 표시는 없습니다. 적의 의도를 읽고, 당신의 생태계를 설계하세요.',
    successHint: '최종전은 완벽한 정답보다 “내 설계가 왜 그렇게 싸웠는지 이해할 수 있는가”를 시험합니다.',
  },
};

export function initialTutorialBuild() {
  return {
    formation: ['mirel', 'vael', 'seris'],
    bond: 'vael_seris',
    edict: 'shell',
  };
}

export function getPositionOf(build, characterId) {
  const index = build.formation.indexOf(characterId);
  return POSITIONS[index] ?? POSITIONS[0];
}

export function scoreBuild(encounterId, build) {
  const encounter = ENCOUNTERS[encounterId];
  let score = 0;
  const reasons = [];

  const front = build.formation[0];
  const core = build.formation[1];
  const rear = build.formation[2];

  if (front === 'vael') {
    score += 2;
    reasons.push({ good: true, label: '배치', text: '베일이 FRONT에서 첫 충돌을 받아냄' });
  } else {
    score -= 1;
    reasons.push({ good: false, label: '배치', text: `${CHARACTERS[front].name}가 FRONT에서 큰 위험에 노출됨` });
  }

  if (rear === 'seris') {
    score += 1;
    reasons.push({ good: true, label: '배치', text: '세리스가 VEIL의 집중 보너스를 받음' });
  }

  if (encounterId === 'formation') {
    return { score, reasons, grade: score >= 2 ? 'clean' : 'rough' };
  }

  if (build.bond === 'vael_seris' && rear === 'seris') {
    score += 2;
    reasons.push({ good: true, label: '공명', text: '후열 저격 → 베일 INTERCEPT 자동 발동' });
  } else if (build.bond === 'seris_mirel') {
    score += 1;
    reasons.push({ good: true, label: '공명', text: '치유 → 세리스 의식 가속 사슬 생성' });
  } else {
    score += 1;
    reasons.push({ good: true, label: '공명', text: `${BONDS[build.bond].title} 반응 사슬 활성화` });
  }

  if (encounterId === 'bond') {
    return { score, reasons, grade: score >= 4 ? 'clean' : score >= 2 ? 'stable' : 'rough' };
  }

  if (build.edict === 'roots' && encounterId === 'exam') {
    score += 2;
    reasons.push({ good: true, label: '명령', text: '포식 임계치 전에 미렐이 선제 치유' });
  } else if (build.edict === 'shell') {
    score += 1;
    reasons.push({ good: true, label: '명령', text: '첫 3초 피해를 낮춰 초기 붕괴 방지' });
  } else if (build.edict === 'moon') {
    score += 2;
    reasons.push({ good: true, label: '명령', text: '세리스 의식 우선 → 빠른 광역 결착' });
  } else if (build.edict === 'roots') {
    score += 2;
    reasons.push({ good: true, label: '명령', text: '위급 대상 감지 범위 확장 → 회복 연쇄' });
  }

  if (core === 'mirel') {
    score += 1;
    reasons.push({ good: true, label: '생태', text: '미렐이 CORE에서 회복/공명 +20%' });
  }

  return {
    score,
    reasons,
    grade: score >= 7 ? 'mastery' : score >= 5 ? 'clean' : score >= 3 ? 'stable' : 'rough',
  };
}

export function buildCauseChain(encounterId, build) {
  const encounter = ENCOUNTERS[encounterId];
  const { reasons, grade } = scoreBuild(encounterId, build);
  const chain = reasons.map((reason, index) => ({
    index: index + 1,
    ...reason,
  }));

  return {
    encounter,
    chain,
    grade,
    summary:
      grade === 'mastery'
        ? '세 시스템이 하나의 생태계처럼 연결되었습니다.'
        : grade === 'clean'
          ? '당신의 설계가 전투에서 선명하게 작동했습니다.'
          : grade === 'stable'
            ? '살아남았지만, 연결 하나가 불필요하게 끊겼습니다.'
            : '승패보다 중요한 건 왜 무너졌는지 읽을 수 있다는 것입니다.',
  };
}

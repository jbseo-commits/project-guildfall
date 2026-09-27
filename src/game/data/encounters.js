export const ENCOUNTERS_DATA = {
  formation_test: {
    id: 'formation_test',
    chapter: 1,
    title: '제1절 · 외피는 누가 될 것인가',
    narrative: '사막의 유리 결정 사이에서 굶주린 사냥개가 카라반의 냄새를 맡고 달려듭니다.',
    briefing: '적의 첫 공격은 숨겨져 있지 않습니다. 전열(FRONT)에 튼튼한 동료를 세워 충돌을 받아내세요.',
    enemies: [
      { id: 'hound', count: 1, slot: 'front' },
    ],
    recommended: {
      front: 'vael',
    },
  },
  bond_test: {
    id: 'bond_test',
    chapter: 2,
    title: '제2절 · 둘을 하나처럼 묶어라',
    narrative: '백철 창기병이 전열을 압박하고, 원거리 사냥꾼이 후열의 의식자를 조준합니다.',
    briefing: '배치만으로는 전후방 동시 압박을 막을 수 없습니다. 두 동료를 공명으로 연결해 자동 대응하게 만드세요.',
    enemies: [
      { id: 'lancer', count: 1, slot: 'front' },
      { id: 'hunter', count: 1, slot: 'rear' },
    ],
    recommended: {
      bond: 'vael_seris',
    },
  },
  edict_test: {
    id: 'edict_test',
    chapter: 3,
    title: '제3절 · 단 하나의 원칙을 각인하라',
    narrative: '성흔 사냥개와 흡혈충이 뒤섞여 몰려옵니다. 순간적인 판단을 넘어 전투의 큰 방향을 정할 때입니다.',
    briefing: '명령(Edict)을 선택하여 이번 교전의 성격을 규정하세요. 껍질, 달, 뿌리 중 하나를 택해야 합니다.',
    enemies: [
      { id: 'hound', count: 1, slot: 'front' },
      { id: 'hunter', count: 1, slot: 'rear' },
      { id: 'leech', count: 1, slot: 'core' },
    ],
    recommended: {
      edict: 'roots',
    },
  },
  exam: {
    id: 'exam',
    chapter: 4,
    title: '독립 시험 · 카라반의 생태계',
    narrative: '수정 파쇄자가 선두에 서고, 맹안의 추적자와 흡혈충이 호위하는 정예 무리가 길을 가로막습니다.',
    briefing: '더 이상의 안내는 없습니다. 적의 의도를 읽고 배치, 공명, 명령을 조합해 생태계의 힘을 증명하세요.',
    enemies: [
      { id: 'breaker', count: 1, slot: 'front' },
      { id: 'hunter', count: 1, slot: 'rear' },
      { id: 'hound', count: 1, slot: 'core' },
    ],
  },
};

export function createJourneyEncounter(day, nodeIndex, seed = 1234) {
  const enemyPool = ['breaker', 'hunter', 'hound', 'lancer', 'leech'];
  // Deterministic pseudo-random based on seed, day, and nodeIndex
  const hash = Math.sin(seed * 997 + day * 131 + nodeIndex * 17) * 10000;
  const rand = hash - Math.floor(hash);

  const titles = [
    '황혼의 능선 순찰대',
    '수정 협곡의 기습군',
    '성흔을 품은 야수 무리',
    '고대 유적의 파수병',
    '재의 길목 침입자',
  ];

  const title = titles[Math.floor(rand * titles.length)];
  const e1 = enemyPool[(day + nodeIndex) % enemyPool.length];
  const e2 = enemyPool[(day * 2 + nodeIndex + 1) % enemyPool.length];
  const e3 = enemyPool[(day * 3 + nodeIndex + 2) % enemyPool.length];

  return {
    id: `journey_day${day}_node${nodeIndex}`,
    chapter: day,
    nodeIndex,
    title: `${day}일차 · ${title}`,
    narrative: `카라반이 전진하는 동안 어둠 속에서 ${title}이(가) 나타났습니다.`,
    briefing: '적의 조합과 의도를 파악하고 최적의 진형과 반응 사슬을 준비하십시오.',
    enemies: [
      { id: e1, count: 1, slot: 'front' },
      { id: e2, count: 1, slot: 'core' },
      { id: e3, count: 1, slot: 'rear' },
    ],
  };
}

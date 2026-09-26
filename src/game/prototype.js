export const CHARACTERS = {
  vael: {
    id: 'vael',
    name: '베일',
    epithet: '뿔의 수호자',
    role: '보호 / 가로막기',
    palette: { primary: 0x7c78a8, secondary: 0xd8c8ff, accent: 0xf0d39d, dark: 0x252338 },
    motif: '검은 뿔 · 자색 망토 · 금빛 눈',
  },
  seris: {
    id: 'seris',
    name: '세리스',
    epithet: '월광나방 예언자',
    role: '집중 / 폭발',
    palette: { primary: 0x9eb8d9, secondary: 0xeaf5ff, accent: 0xd8c2ff, dark: 0x202a3d },
    motif: '나방 날개 · 은발 · 청백빛',
  },
  mirel: {
    id: 'mirel',
    name: '미렐',
    epithet: '꽃뿌리 치유사',
    role: '회복 / 생태 연결',
    palette: { primary: 0xd59bb5, secondary: 0xffe2ee, accent: 0xaed9b7, dark: 0x35232d },
    motif: '꽃뿔 · 장밋빛 머리 · 덩굴',
  },
};

export const PLANS = {
  seris: {
    id: 'seris',
    title: '세리스를 지킨다',
    kicker: '보호 본능 → 세리스',
    description: '베일은 세리스의 집중을 끊는 공격을 최우선으로 가로막습니다.',
    reward: '세리스의 월광 의식이 완성되기 쉬워집니다.',
    risk: '미렐이 노출됩니다.',
    protectedId: 'seris',
    downedId: 'mirel',
  },
  mirel: {
    id: 'mirel',
    title: '미렐을 지킨다',
    kicker: '보호 본능 → 미렐',
    description: '베일은 생태계의 회복축인 미렐 곁을 우선적으로 지킵니다.',
    reward: '카라반의 회복과 유지력이 안정됩니다.',
    risk: '세리스의 주문이 방해받을 수 있습니다.',
    protectedId: 'mirel',
    downedId: 'seris',
  },
};

const baseEnemies = [
  { id: 'hunter', name: '유리 사냥꾼', x: 0.22, hp: 100 },
  { id: 'lancer', name: '백철 창기병', x: 0.5, hp: 120 },
  { id: 'hound', name: '성흔 사냥개', x: 0.78, hp: 90 },
];

const scripts = {
  seris: [
    { at: 0.45, type: 'caption', text: '위협이 카라반을 덮칩니다.' },
    { at: 1.2, type: 'attack', source: 'hunter', target: 'seris', damage: 46, intent: true },
    { at: 1.48, type: 'intercept', source: 'vael', target: 'seris', damage: 18, praise: '완벽한 엄호', detail: '베일이 세리스에게 향한 치명타를 가로막았습니다.' },
    { at: 2.25, type: 'channel', source: 'seris', praise: '집중 유지', detail: '당신의 선택 덕분에 월광 의식이 계속됩니다.' },
    { at: 3.15, type: 'heal', source: 'mirel', target: 'vael', amount: 16 },
    { at: 4.05, type: 'attack', source: 'hound', target: 'mirel', damage: 38 },
    { at: 4.72, type: 'attack', source: 'lancer', target: 'mirel', damage: 34, praise: '위험 노출', detail: '보호가 세리스에게 묶인 동안 미렐이 고립됩니다.' },
    { at: 5.55, type: 'burst', source: 'seris', targets: ['hunter', 'lancer', 'hound'], damage: 72, praise: '월광 군무', detail: '보호받은 집중이 전장을 뒤집었습니다.' },
    { at: 6.7, type: 'finish', source: 'vael', target: 'lancer', damage: 52 },
    { at: 7.55, type: 'attack', source: 'hound', target: 'mirel', damage: 42 },
    { at: 7.72, type: 'down', target: 'mirel', praise: '미렐이 쓰러졌습니다', detail: '생태계의 회복축 하나가 끊어졌습니다.' },
    { at: 8.9, type: 'victory', text: '전투는 끝났지만, 카라반은 온전하지 않습니다.' },
  ],
  mirel: [
    { at: 0.45, type: 'caption', text: '위협이 카라반을 덮칩니다.' },
    { at: 1.1, type: 'attack', source: 'hunter', target: 'seris', damage: 34, intent: true },
    { at: 1.72, type: 'guard', source: 'vael', target: 'mirel', praise: '생태계 고정', detail: '베일이 미렐의 곁을 지켜 회복축을 고정합니다.' },
    { at: 2.42, type: 'healAll', source: 'mirel', amount: 13, praise: '꽃맥박', detail: '미렐의 생명력이 카라반 전체로 퍼집니다.' },
    { at: 3.25, type: 'attack', source: 'lancer', target: 'seris', damage: 31 },
    { at: 3.42, type: 'interrupt', target: 'seris', praise: '집중 붕괴', detail: '세리스의 첫 번째 월광 의식이 끊겼습니다.' },
    { at: 4.7, type: 'root', source: 'mirel', target: 'hound', damage: 34 },
    { at: 5.6, type: 'attack', source: 'hunter', target: 'seris', damage: 42 },
    { at: 5.82, type: 'down', target: 'seris', praise: '세리스가 쓰러졌습니다', detail: '폭발적인 공격축 하나가 생태계에서 사라집니다.' },
    { at: 6.55, type: 'rage', source: 'vael', praise: '상실 반응', detail: '베일이 세리스의 빈자리에 반응합니다.' },
    { at: 7.3, type: 'burst', source: 'vael', targets: ['hunter', 'lancer', 'hound'], damage: 78 },
    { at: 8.65, type: 'victory', text: '전투는 끝났지만, 카라반은 온전하지 않습니다.' },
  ],
};

export function createPrototypeBattle(planId) {
  const plan = PLANS[planId] ?? PLANS.seris;
  return {
    seed: 'GUILDFALL-SLICE-001',
    duration: 9.6,
    plan,
    characters: Object.values(CHARACTERS).map((character) => ({ ...character, hp: 100, maxHp: 100, downed: false })),
    enemies: baseEnemies.map((enemy) => ({ ...enemy, maxHp: enemy.hp, downed: false })),
    events: scripts[plan.id].map((event, index) => ({ ...event, id: `${plan.id}-${index}` })),
  };
}

export function simulateUntil(battle, time) {
  const actors = Object.fromEntries(battle.characters.map((c) => [c.id, { ...c }]));
  const enemies = Object.fromEntries(battle.enemies.map((e) => [e.id, { ...e }]));
  const fired = [];

  for (const event of battle.events) {
    if (event.at > time) break;
    fired.push(event);
    const target = actors[event.target] ?? enemies[event.target];
    if (event.type === 'attack' && target) target.hp = Math.max(0, target.hp - event.damage);
    if (event.type === 'intercept') {
      const guard = actors[event.source];
      if (guard) guard.hp = Math.max(0, guard.hp - event.damage);
    }
    if (event.type === 'heal' && target) target.hp = Math.min(target.maxHp, target.hp + event.amount);
    if (event.type === 'healAll') {
      for (const actor of Object.values(actors)) actor.hp = Math.min(actor.maxHp, actor.hp + event.amount);
    }
    if ((event.type === 'burst' || event.type === 'root' || event.type === 'finish') && event.targets) {
      for (const id of event.targets) {
        if (enemies[id]) enemies[id].hp = Math.max(0, enemies[id].hp - event.damage);
      }
    }
    if ((event.type === 'root' || event.type === 'finish') && target) target.hp = Math.max(0, target.hp - event.damage);
    if (event.type === 'down' && target) {
      target.hp = 0;
      target.downed = true;
    }
  }

  for (const enemy of Object.values(enemies)) enemy.downed = enemy.hp <= 0;
  return { actors, enemies, fired };
}

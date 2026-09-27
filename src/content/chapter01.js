// PROJECT GUILDFALL — Chapter 01 content data
// Status: PROVISIONAL narrative content.
// This file is intentionally UI-agnostic so Antigravity / future agents can integrate it
// without rewriting authored dialogue or locking the permanent run structure.

export const CHAPTER_01 = {
  id: 'chapter-01-leaving-night',
  title: '1일차 · 떠나는 밤',
  status: 'PROVISIONAL',

  premise: '카라반이 너무 오래 머문 숲에서 이상 징후를 발견하고, 추적자들의 습격을 버틴 뒤 밤이 끝나기 전에 떠난다.',

  beats: [
    {
      id: 'camp-warmth',
      type: 'camp',
      purpose: '카라반을 전투 전부터 “집”처럼 느끼게 한다.',
      lines: [
        { speaker: 'vael', text: '오늘은 조용하네.' },
        { speaker: 'mirel', text: '그 말 하면 꼭 무슨 일 생기던데.' },
        { speaker: 'seris', text: '이번엔 네가 맞을 수도 있어. 아직까지는.' },
        { speaker: 'vael', text: '그럼 다행이고.' }
      ],
      visual_notes: [
        '전투 UI보다 먼저 모닥불과 작은 생활 동작이 보인다.',
        '베일은 출입구 / 주변을 확인한다.',
        '세리스는 기록이나 작은 의식을 준비한다.',
        '미렐은 꽃 또는 작은 생체 조직을 돌본다.'
      ]
    },

    {
      id: 'hush-sign',
      type: 'story',
      purpose: '세계의 위협을 설명하지 않고 보여준다.',
      lines: [
        { speaker: 'mirel', text: '이상해.' },
        { speaker: 'vael', text: '뭐가?' },
        { speaker: 'mirel', text: '불꽃이 아까부터 같은 모양이야.' },
        { speaker: 'seris', text: '바람은 부는데.' },
        { speaker: 'seris', text: '…너무 오래 머물렀어.' }
      ],
      visual_notes: [
        '랜턴 불꽃 하나가 완전히 멈춘 것처럼 보인다.',
        '나뭇가지 끝에 얇은 결정 흔적이 생긴다.',
        '큰 세계관 설명문은 띄우지 않는다.'
      ]
    },

    {
      id: 'threat-arrives',
      type: 'story',
      purpose: '튜토리얼 전투를 서사적 사건으로 연결한다.',
      lines: [
        { speaker: 'seris', text: '늦었어. 누가 우리 흔적을 읽고 있어.' },
        { speaker: 'vael', text: '몇?' },
        { speaker: 'seris', text: '셋. 앞을 부수는 것 하나, 냄새를 쫓는 것 하나.' },
        { speaker: 'seris', text: '그리고… 나를 보고 있는 것 하나.' },
        { speaker: 'vael', text: '이번에는 내가 앞을 막을게. 너희는 뒤에서 준비해.' }
      ],
      handoff_to: 'tutorial-read'
    },

    {
      id: 'tutorial-read',
      type: 'tutorial',
      system: 'enemy-intent',
      title: '적의 의도 읽기',
      body: '자동 전투라도 적의 행동은 숨겨져 있지 않습니다. 먼저 누가 누구를 노리는지 확인하세요.',
      intent_examples: [
        { enemy: 'breaker', intent: '전열 강공격' },
        { enemy: 'hunter', intent: '후열 저격' }
      ],
      next: 'tutorial-placement'
    },

    {
      id: 'tutorial-placement',
      type: 'tutorial',
      system: 'formation',
      title: '배치하기',
      body: '적의 공격을 확인하고 동료를 적절한 위치에 배치하세요. COMMIT 이후 전투는 자동으로 진행됩니다.',
      character_prompts: [
        { speaker: 'vael', text: '내가 먼저 받아낼게.' },
        { speaker: 'seris', text: '그럼 끝까지 집중할 수 있어.' },
        { speaker: 'mirel', text: '무리하면 바로 말해. …안 말할 거 알아.' }
      ],
      next: 'battle-01'
    },

    {
      id: 'battle-01',
      type: 'battle',
      encounter: 'lanternwood-hunters-01',
      required_readable_chain: [
        '수정 파쇄자 강공격 예고',
        '전열 충돌',
        '맹안 추적자 후열 조준',
        '베일 INTERCEPT',
        '미렐 위험 감지 및 치유',
        '세리스 월광 의식',
        '월광 폭발',
        '전투 종료'
      ],
      battle_barks: {
        vael: {
          guard: '뒤로.',
          intercept: '내가 받는다.',
          heavy_hit: '…계속해.',
          finish: '끝났어.'
        },
        seris: {
          targeted: '나를 노리고 있어.',
          protected: '알고 있어. 이번엔 네 신호를 믿을게.',
          channel: '조금만 더.',
          burst: '이제 됐어.'
        },
        mirel: {
          sense: '베일, 그대로 있어.',
          heal: '상처부터.',
          relief: '좋아. 아직 이어져 있어.'
        }
      },
      next: 'postbattle'
    },

    {
      id: 'postbattle',
      type: 'camp',
      purpose: '승리보다 관계를 기억하게 한다.',
      lines: [
        { speaker: 'mirel', text: '베일, 앉아.' },
        { speaker: 'vael', text: '멀쩡해.' },
        { speaker: 'mirel', text: '피가 멀쩡한 사람처럼 흐르진 않거든.' },
        { speaker: 'seris', text: '내 의식이 끝난 건 네가 대신 맞아서야.' },
        { speaker: 'vael', text: '그게 내 일이니까.' },
        { speaker: 'seris', text: '다음엔 내가 먼저 신호할게.' },
        { speaker: 'vael', text: '…그럼 난 그 신호를 믿지.' }
      ],
      debrief_focus: [
        '베일이 세리스를 지켜 집중이 유지됨',
        '미렐이 가장 위험한 동료를 스스로 선택해 회복함',
        '그 결과 세리스가 큰 의식을 완성함'
      ],
      next: 'departure'
    },

    {
      id: 'departure',
      type: 'story',
      purpose: '왜 여행이 필요한지 감정적으로 이해시킨다.',
      lines: [
        { speaker: 'seris', text: '이곳은 오늘 밤을 넘기면 안 돼.' },
        { speaker: 'vael', text: '짐 챙길게.' },
        { speaker: 'mirel', text: '잠깐.' },
        { speaker: 'mirel', text: '이 꽃… 옮기면 다시 필까?' },
        { speaker: 'seris', text: '같은 꽃은 아니겠지.' },
        { speaker: 'mirel', text: '그럼 됐어. 다시 피면.' }
      ],
      visual_notes: [
        '모닥불이 꺼지고 카라반의 이동 준비가 시작된다.',
        '뒤에 남는 숲에는 결정화가 아주 조금 더 진행되어 있다.',
        '미렐이 꽃 또는 뿌리를 챙기는 작은 동작을 넣을 수 있다.'
      ],
      next: 'first-journey'
    },

    {
      id: 'first-journey',
      type: 'chapter-end',
      title: '첫 번째 여정',
      unlocks: [
        '공명 튜토리얼 후보',
        '카라반 이동 화면',
        '첫 지속 부상 / 관계 이벤트 후보'
      ]
    }
  ],

  optional_attachment_choice: {
    status: 'PROVISIONAL — DO NOT SHIP WITHOUT PLAYTEST',
    id: 'save-mirel-bloom',
    setup: '즉시 출발하는 것이 안전하지만, 미렐의 꽃뿌리를 회수하려면 잠시 더 머물러야 한다.',
    choices: [
      {
        id: 'leave-now',
        label: '지금 떠난다',
        thematic_effect: '효율 / 안전'
      },
      {
        id: 'recover-bloom',
        label: '꽃뿌리를 챙긴다',
        thematic_effect: '애정 / 비효율',
        note: 'D001-C의 감정을 아주 작은 비용으로 미리 보여주는 실험 후보.'
      }
    ]
  }
};

export const CHARACTER_DISPLAY = {
  vael: { name: '베일', role: '경계 / 수호' },
  seris: { name: '세리스', role: '관측 / 의식' },
  mirel: { name: '미렐', role: '회복 / 생장' }
};

export default CHAPTER_01;

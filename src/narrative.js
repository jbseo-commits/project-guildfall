export const OPENING_STORY = [
  {
    kicker:'떠나는 밤 · 아직은 평온함',
    title:'카라반이 잠들기 전',
    speaker:'베일',
    tone:'warm',
    text:'문은 아직 잠그지 마. 바깥 벽이 먼저 긴장했어.',
    note:'베일은 매일 잠들기 전 문, 끈, 등불, 출구를 확인합니다.',
    cta:'세리스를 본다 →'
  },
  {
    kicker:'달빛 기록',
    title:'존재하지 않는 길',
    speaker:'세리스',
    tone:'moon',
    text:'또 보여. 언덕 뒤의 길. 지도에는 없는데, 달빛 아래에서는 분명히 있어.',
    note:'세리스는 사라진 길과 반복되는 패턴을 기억합니다.',
    cta:'미렐을 본다 →'
  },
  {
    kicker:'화롯가',
    title:'빈자리를 향한 꽃',
    speaker:'미렐',
    tone:'bloom',
    text:'이 아이가 자꾸 빈 의자 쪽으로 피네. 불길하다는 뜻은 아니야. …아마.',
    note:'미렐은 버려진 것과 망가진 것을 쉽게 포기하지 못합니다.',
    cta:'이상한 정적을 느낀다 →'
  },
  {
    kicker:'정적의 흔적',
    title:'불꽃이 멈췄다',
    speaker:'세리스',
    tone:'hush',
    text:'저 불꽃 봐. 흔들리지 않아. 바람은 있는데.',
    note:'죽은 것이 아닙니다. 변화를 멈춘 것—허시가 가까워질 때 나타나는 징후입니다.',
    cta:'카라반의 맥박을 듣는다 →'
  },
  {
    kicker:'HEARTHHEART WARNING',
    title:'바닥이 한 번 울렸다',
    speaker:'베일',
    tone:'danger',
    text:'누군가 온다. 큰 놈은 날 보고 있고… 후드 쓴 놈은 세리스를 보고 있어.',
    note:'그들은 무작정 공격하는 것이 아닙니다. 특정 대상을 노리고 들어오고 있습니다.',
    cta:'적의 의도를 읽는다 →'
  }
];

export const AFTERMATH_STORY = [
  {
    kicker:'전투 직후',
    speaker:'미렐',
    tone:'bloom',
    text:'다음에도 그렇게 끼어들 거야?',
    replySpeaker:'베일',
    reply:'응.',
    note:'미렐은 이미 베일의 상처를 확인하고 있습니다.'
  },
  {
    kicker:'화롯가',
    speaker:'미렐',
    tone:'warm',
    text:'그럴 줄 알았어.',
    replySpeaker:'세리스',
    reply:'…미안.',
    note:'전투에서 끝난 행동이 캠프에서는 관계가 됩니다.'
  },
  {
    kicker:'사냥꾼의 소지품',
    speaker:'세리스',
    tone:'danger',
    text:'이건 단순한 추적 의뢰가 아니야. 내 이름이 적혀 있어.',
    replySpeaker:'회수 명령서',
    reply:'미등록 공명자 · 세리스 / 생포 우선 / 성역 표식 확인',
    note:'문서 가장자리에는 바스티온 협약권에서 쓰는 검인과 닮은 표식이 찍혀 있습니다.'
  },
  {
    kicker:'HEARTHHEART',
    speaker:'베일',
    tone:'hush',
    text:'…방금 안쪽 문에서 소리 났어.',
    replySpeaker:'세리스',
    reply:'문이 아니라 맥박이었어. 우리 셋 말고 하나 더.',
    note:'카라반 내부의 봉인된 구역이 처음으로 반응합니다.'
  }
];

export const ROUTE_CHOICES = [
  {
    id:'erased-road',
    owner:'세리스',
    title:'기억에서 지워진 길',
    tag:'미지 / 단축',
    text:'달빛 아래에서만 보이는 오래된 이동로를 따라갑니다.',
    risk:'길의 끝을 아무도 기억하지 못합니다.'
  },
  {
    id:'lantern-station',
    owner:'미렐',
    title:'버려진 등불역',
    tag:'회복 / 흔적',
    text:'낡은 이동 거점에서 약재와 생체 재료를 찾습니다.',
    risk:'최근 누군가 급히 떠난 흔적이 있습니다.'
  },
  {
    id:'quarry-ridge',
    owner:'베일',
    title:'옛 채석장 능선',
    tag:'방어 / 추적',
    text:'시야가 트이고 방어하기 쉬운 높은 길을 택합니다.',
    risk:'추적자에게도 우리 흔적이 잘 보입니다.'
  }
];

export function routeChoiceById(id){
  return ROUTE_CHOICES.find(function(choice){return choice.id===id;})||null;
}

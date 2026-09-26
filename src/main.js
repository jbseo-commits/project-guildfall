import './style.css';
import { APPROVED_CONCEPT_ART } from './approvedConceptArt.js';
import vaelArt from './assets/heroes/vael.webp';
import serisArt from './assets/heroes/seris.webp';
import mirelArt from './assets/heroes/mirel.webp';

const HERO_ART={vael:vaelArt,seris:serisArt,mirel:mirelArt};

const app = document.querySelector('#app');

const HEROES = {
  vael:{id:'vael',name:'베일',role:'수호',lane:0,hp:100,camp:'이번에는 내가 앞을 맡을게. 너희는 뒤에서 준비해.'},
  seris:{id:'seris',name:'세리스',role:'월광',lane:2,hp:100,camp:'좋아. 이번엔 월광을 끝까지 완성해 볼게.'},
  mirel:{id:'mirel',name:'미렐',role:'치유',lane:1,hp:100,camp:'…이 꽃, 다시 피울 수 있을까?'}
};
const ENEMIES = {
  breaker:{id:'breaker',name:'수정 파쇄자',hp:100,intent:'전열 강공격'},
  hunter:{id:'hunter',name:'맹안 추적자',hp:100,intent:'후열 저격'},
  hound:{id:'hound',name:'성흔 사냥개',hp:100,intent:'약자 추적'}
};
const LANES=[
  {id:'front',ko:'전열',label:'FRONT'},
  {id:'mid',ko:'중열',label:'MID'},
  {id:'rear',ko:'후열',label:'REAR'}
];
const PROGRESS=[
  {id:'read',label:'읽기',sub:'적의 의도 파악'},
  {id:'place',label:'배치',sub:'동료 위치 설정'},
  {id:'battle',label:'전투',sub:'자동 진행'},
  {id:'result',label:'결과',sub:'전투 복기'},
  {id:'next',label:'다음',sub:'선택지'}
];

const state={phase:'read',selected:null,heroes:null,enemies:null,speed:1,timers:[],logs:[],routeIndex:0,result:null};

function clone(v){return JSON.parse(JSON.stringify(v));}
function clearTimers(){state.timers.forEach(clearTimeout);state.timers=[];}
function later(fn,ms){const id=setTimeout(fn,ms/state.speed);state.timers.push(id);return id;}
function heroAtLane(lane){const h=Object.values(state.heroes).find(function(x){return x.lane===lane;});return h?h.id:'vael';}

function reset(){
  clearTimers();
  state.phase='read';state.selected=null;state.heroes=clone(HEROES);state.enemies=clone(ENEMIES);
  state.speed=1;state.logs=[];state.routeIndex=0;state.result=null;
}

function heroSprite(id,small){
  const art=HERO_ART[id];
  let fx='';
  if(id==='seris'&&!small) fx='<span class="seris-orbit"><i></i><i></i><i></i></span><span class="seris-sigil"></span>';
  if(id==='mirel'&&!small) fx='<span class="mirel-bloom"><i></i><i></i><i></i><i></i></span><span class="mirel-ring"></span>';
  return '<div class="hero-art-wrap '+id+(small?' small':'')+'">'
    +'<span class="hero-art-shadow"></span>'+fx
    +'<img class="hero-art-sprite" src="'+art+'" alt="" draggable="false">'
    +'</div>';
}
function enemySprite(id,small){
  return '<div class="enemy-sprite '+id+(small?' mini':'')+'"><i class="ground-shadow"></i><i class="ear a"></i><i class="ear b"></i>'
    +'<i class="body"></i><i class="head"><b></b><b></b></i><i class="weapon"></i></div>';
}
function progressIndex(){return {read:0,place:1,battle:2,result:3,next:4}[state.phase]||0;}

function renderProgress(){
  const cur=progressIndex();
  return '<div class="progress-track">'+PROGRESS.map(function(item,i){
    return '<button class="progress-node '+(i<cur?'done ':'')+(i===cur?'active':'')+'">'
      +'<i>'+(i<cur?'✓':i+1)+'</i><b>'+item.label+'</b><span>'+item.sub+'</span></button>';
  }).join('')+'</div>';
}

function tutorialPanel(){
  if(state.phase==='read'){
    return '<aside class="tutorial-paper">'
      +'<div class="paper-ribbon">튜토리얼 1/4</div><h2>적의 의도 읽기</h2>'
      +'<p>자동 전투라도 적의 행동은 숨겨져 있지 않습니다. 먼저 누가 누구를 노리는지 확인하세요.</p>'
      +'<div class="intent-list">'
      +'<div><span class="arrow red">➜</span><b>수정 파쇄자</b><em>전열 강공격</em></div>'
      +'<div><span class="arrow blue">➜</span><b>맹안 추적자</b><em>후열 저격</em></div>'
      +'<div><span class="arrow amber">➜</span><b>성흔 사냥개</b><em>가장 약한 동료 추적</em></div>'
      +'</div><button class="paper-cta" id="readNext">의도 확인 완료 →</button></aside>';
  }
  if(state.phase==='place'){
    const cards=LANES.map(function(lane,i){
      const heroId=heroAtLane(i),h=state.heroes[heroId];
      const rule=i===0?'가까운 적의 공격을 먼저 받음':i===1?'균형 / 지원 행동 강화':'원거리·의식 행동에 유리';
      return '<button class="formation-card '+(state.selected===heroId?'selected':'')+'" data-heroselect="'+heroId+'">'
        +'<div class="formation-portrait">'+heroSprite(heroId,true)+'</div><strong>'+lane.ko+'</strong><b>'+h.name+'</b><small>'+rule+'</small></button>';
    }).join('');
    const slots=LANES.map(function(lane,i){return '<button data-lane="'+i+'"><span>'+lane.label+'</span><b>'+lane.ko+'</b></button>';}).join('');
    return '<aside class="tutorial-paper placement-paper"><div class="paper-ribbon">튜토리얼 2/4</div><h2>배치하기</h2>'
      +'<p>동료를 선택한 뒤 원하는 위치를 눌러 배치하세요. 위치는 자동 행동의 우선순위를 바꿉니다.</p>'
      +'<div class="intent-legend"><span>🔴 전열 강공격</span><span>🔵 후열 저격</span></div>'
      +'<div class="formation-preview">'+cards+'</div><div class="slot-buttons">'+slots+'</div>'
      +'<button class="paper-cta primary" id="commit">배치 완료 →</button></aside>';
  }
  if(state.phase==='battle'){
    return '<aside class="tutorial-paper battle-paper"><div class="paper-ribbon">튜토리얼 3/4</div><h2>이제 손을 떼세요</h2>'
      +'<p>COMMIT 이후에는 직접 조작하지 않습니다. 배치와 동료의 본능이 실제 행동으로 이어지는지 관찰하세요.</p>'
      +'<div class="watch-list"><span><b>베일</b> 위협을 가로막음</span><span><b>미렐</b> 가장 위험한 동료를 치유</span><span><b>세리스</b> 보호받는 동안 월광 의식 완성</span></div>'
      +'<div class="battle-paper-note">전투가 끝나면 선택 → 행동 → 결과를 바로 복기합니다.</div></aside>';
  }
  if(state.phase==='result'){
    const items=causeChain().map(function(x){
      return '<div class="'+(x.good?'good':'bad')+'"><i>'+(x.good?'✓':'!')+'</i><span><b>'+x.title+'</b><em>'+x.text+'</em></span></div>';
    }).join('');
    return '<aside class="tutorial-paper result-paper"><div class="paper-ribbon">튜토리얼 4/4</div><h2>전투 복기</h2>'
      +'<p>승패보다 중요한 것은 <b>왜</b> 그렇게 싸웠는지 이해하는 것입니다.</p><div class="cause-list">'+items+'</div>'
      +'<button class="paper-cta primary" id="nextRoute">첫 번째 여정으로 →</button></aside>';
  }
  if(state.phase==='next'){
    return '<aside class="tutorial-paper next-paper"><div class="paper-ribbon">튜토리얼 완료</div><h2>이제 카라반을 움직입니다</h2>'
      +'<p>다음 전투부터는 <b>공명</b>이 추가됩니다. 두 동료를 연결하면 특정 상황에서 서로 자동 반응합니다.</p>'
      +'<div class="unlock-card"><span>NEW</span><strong>공명 · 수호의 월식</strong><em>세리스가 큰 피해를 받으면 베일이 자동으로 가로막습니다.</em></div>'
      +'<button class="paper-cta" id="replay">튜토리얼 다시 보기</button></aside>';
  }
  return '';
}

function routeMap(){
  const nodes=[0,1,2,3,4].map(function(n){
    const icon=n===0?'⚔':n===1?'✦':n===2?'⚔':n===3?'☠':'⚔';
    return '<div class="route-node n'+n+' '+(n<state.routeIndex?'cleared ':'')+(n===state.routeIndex?'current':'')+'"><i>'+icon+'</i></div>';
  }).join('');
  return '<aside class="route-map"><div class="route-title">첫 번째 여정</div><div class="route-paper">'
    +'<svg viewBox="0 0 180 360" aria-hidden="true"><path d="M70 40 C120 70 55 110 102 145 C146 177 74 214 108 248 C140 278 90 310 112 336" class="route-line"/></svg>'
    +nodes+'</div></aside>';
}

function campScene(){
  const party=['vael','seris','mirel'].map(function(id,idx){
    return '<div class="camp-hero camp-'+id+'" style="--ci:'+idx+'"><div class="speech"><b>'+state.heroes[id].name+'</b><span>'+state.heroes[id].camp+'</span></div>'
      +heroSprite(id,false)+'</div>';
  }).join('');
  return '<section class="camp-zone"><div class="camp-bg" style="--art:url('+APPROVED_CONCEPT_ART+')"></div><div class="camp-overlay"></div>'
    +'<div class="camp-fire"><i></i><i></i><i></i></div><div class="camp-party">'+party+'</div><div class="camp-pet">◕ᴥ◕</div></section>';
}

function battleScene(){
  const battle=state.phase==='battle';
  const front=heroAtLane(0),mid=heroAtLane(1),rear=heroAtLane(2);
  const pos=[{x:35,y:61},{x:45,y:67},{x:54,y:61}];
  const enemies=[{id:'breaker',x:74,y:59},{id:'hound',x:81,y:66},{id:'hunter',x:88,y:55}].map(function(e){
    const en=state.enemies[e.id];
    return '<div class="battle-unit enemy '+e.id+' '+(en.hp<=0?'dead':'')+'" data-enemy="'+e.id+'" style="--x:'+e.x+'%;--y:'+e.y+'%">'
      +'<div class="world-hp enemy-hp"><i style="width:'+en.hp+'%"></i></div>'+enemySprite(e.id,false)+'<strong>'+en.name+'</strong></div>';
  }).join('');
  const allies=[{id:front,lane:0},{id:mid,lane:1},{id:rear,lane:2}].map(function(p){
    const h=state.heroes[p.id];
    return '<button class="battle-unit ally world-unit hero '+p.id+' '+(state.selected===p.id?'selected':'')+'" data-hero="'+p.id+'" data-battlehero="'+p.id+'" style="--x:'+pos[p.lane].x+'%;--y:'+pos[p.lane].y+'%">'
      +'<div class="world-hp"><i style="width:'+h.hp+'%"></i></div>'+heroSprite(p.id,false)+'<strong>'+h.name+'</strong>'
      +'<small>'+(battle?'자동 행동 중':LANES[p.lane].ko)+'</small></button>';
  }).join('');
  const logs=(state.logs.length?state.logs:[
    {text:'베일이 전열 공격을 막아냅니다.'},{text:'세리스가 월광 의식을 준비합니다.'},{text:'미렐이 베일을 치유합니다.'}
  ]).slice(-5).map(function(l){
    return '<div class="log-line '+(l.danger?'danger':'')+'"><i>'+(l.danger?'!':'●')+'</i><span>'+l.text+'</span></div>';
  }).join('');

  return '<section class="battle-zone"><div class="battle-bg" style="--art:url('+APPROVED_CONCEPT_ART+')"></div><div class="battle-grade"></div>'
    +'<div class="battle-controls"><b>'+(battle?'전투 중…':state.phase==='result'?'전투 종료':'배치 준비')+'</b><button>Ⅱ</button><button id="speedBtn">×'+state.speed+'</button></div>'
    +'<svg class="battle-arrows" viewBox="0 0 1000 420" preserveAspectRatio="none"><defs><marker id="redEnd" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0 0 L0 6 L8 3z" fill="#ee6a5f"/></marker><marker id="blueEnd" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0 0 L0 6 L8 3z" fill="#6db5ff"/></marker></defs><path class="arr red" d="M795 185 Q690 190 380 245" marker-end="url(#redEnd)"/><path class="arr blue" d="M840 255 Q700 245 560 235" marker-end="url(#blueEnd)"/></svg>'
    +enemies+allies+'<div class="shield-fx"></div><div class="heal-fx">✦ ✦ ✦</div><div class="moon-fx"></div><div class="hit-fx"></div>'
    +'<div class="battle-dialogue"><div class="dialogue-portrait">'+heroSprite('seris',true)+'</div><div><b>세리스</b><span>'
    +(battle?'적의 후열에 저격수가 있어. 내가 집중하고 있는 동안 부탁할게…!':'후열에 저격수가 있어. 누가 내 앞을 막을지 정해줘.')+'</span></div></div>'
    +'<div class="combat-log"><div class="log-title">전투 기록</div>'+logs+'</div>'
    +'<div class="tip-card"><b>TIP</b><span>전열에 튼튼한 동료를 배치해 후열의 약한 동료를 지키세요.</span><div class="tip-pet">◕ᴥ◕</div></div>'
    +renderProgress()+'</section>';
}

function render(){
  app.innerHTML='<main class="tutorial-game phase-'+state.phase+'"><header class="global-top"><div class="day-mark"><span>☾</span><div><b>1일차</b><small>떠나는 밤</small></div></div>'
    +'<div class="resources"><span>◉ 320</span><span>◆ 3</span><span>▤ 2</span><button>⚙</button></div></header>'
    +'<nav class="side-nav"><button class="active">♜<span>카라반</span></button><button>♙<span>동료</span></button><button>⚔<span>장비</span></button><button>▣<span>기록</span></button></nav>'
    +'<section class="top-half">'+campScene()+tutorialPanel()+routeMap()+'</section>'+battleScene()
    +'<div class="rotate-hint"><div>↻</div><strong>가로 화면으로 돌려주세요</strong><span>튜토리얼은 캠프와 전투장을 동시에 보는 16:9 화면으로 진행됩니다.</span></div></main>';
  bind();
}

function bind(){
  const read=app.querySelector('#readNext');if(read)read.addEventListener('click',function(){state.phase='place';render();});
  app.querySelectorAll('[data-heroselect],[data-battlehero]').forEach(function(el){
    el.addEventListener('click',function(){if(state.phase!=='place')return;state.selected=el.dataset.heroselect||el.dataset.battlehero;render();});
  });
  app.querySelectorAll('[data-lane]').forEach(function(el){
    el.addEventListener('click',function(){if(state.phase!=='place'||!state.selected)return;moveSelected(Number(el.dataset.lane));});
  });
  app.querySelector('#commit')?.addEventListener('click',startBattle);
  app.querySelector('#nextRoute')?.addEventListener('click',function(){state.phase='next';state.routeIndex=1;render();});
  app.querySelector('#replay')?.addEventListener('click',function(){reset();render();});
  app.querySelector('#speedBtn')?.addEventListener('click',function(){
    if(state.phase==='battle') return;
    state.speed=state.speed===1?2:1;
    this.textContent='×'+state.speed;
  });
}

function pulseMotion(id,motion,ms){
  const unit=app.querySelector('[data-hero="'+id+'"]');
  if(!unit) return;
  Array.from(unit.classList).forEach(function(name){
    if(name.indexOf('motion-')===0) unit.classList.remove(name);
  });
  unit.classList.add('motion-'+motion);
  later(function(){unit.classList.remove('motion-'+motion);},ms||520);
}

function moveSelected(target){
  const id=state.selected,old=state.heroes[id].lane;
  const other=Object.values(state.heroes).find(function(h){return h.id!==id&&h.lane===target;});
  if(other)other.lane=old;
  state.heroes[id].lane=target;
  state.selected=null;
  render();
  requestAnimationFrame(function(){
    pulseMotion(id,'move',460);
    if(other)pulseMotion(other.id,'move',460);
  });
}
function setHeroHp(id,hp,label){
  state.heroes[id].hp=Math.max(0,Math.min(100,hp));
  app.querySelectorAll('.ally.'+id+' .world-hp i').forEach(function(el){el.style.width=state.heroes[id].hp+'%';});
  const unit=app.querySelector('.ally.'+id);
  if(unit&&label){
    const stateLabel=unit.querySelector('small');
    if(stateLabel) stateLabel.textContent=label;
  }
}
function setEnemyHp(id,hp){
  state.enemies[id].hp=Math.max(0,Math.min(100,hp));
  const el=app.querySelector('[data-enemy="'+id+'"]');
  if(el){el.querySelector('.world-hp i').style.width=state.enemies[id].hp+'%';if(state.enemies[id].hp<=0)el.classList.add('dead');}
}
function pushLog(text,danger){
  state.logs.push({text:text,danger:!!danger});
  const box=app.querySelector('.combat-log');
  if(box)box.innerHTML='<div class="log-title">전투 기록</div>'+state.logs.slice(-5).map(function(l){return '<div class="log-line '+(l.danger?'danger':'')+'"><i>'+(l.danger?'!':'●')+'</i><span>'+l.text+'</span></div>';}).join('');
}

function startBattle(){
  clearTimers();state.phase='battle';state.selected=null;state.logs=[];render();
  const front=heroAtLane(0),rear=heroAtLane(2);

  later(function(){
    pushLog(state.heroes[front].name+'이(가) 첫 강공격의 표적이 됩니다.');
    app.querySelector('.enemy.breaker')?.classList.add('charge');
    app.querySelector('.ally.'+front)?.classList.add('targeted');
    if(front==='vael')pulseMotion('vael','ready',620);
  },500);

  later(function(){
    const dmg=front==='vael'?22:46;
    setHeroHp(front,state.heroes[front].hp-dmg,'첫 충돌');
    if(front==='vael')pulseMotion('vael','hit',520);
    else app.querySelector('.ally.'+front)?.classList.add('hit');
    app.querySelector('.hit-fx')?.classList.add('play');
    pushLog(state.heroes[front].name+'이(가) 전열 공격을 받았습니다.',front!=='vael');
  },1200);

  later(function(){
    app.querySelector('.enemy.hunter')?.classList.add('aim');
    app.querySelector('.ally.'+rear)?.classList.add('targeted');
    if(rear==='seris')pulseMotion('seris','danger',680);
    pushLog('맹안 추적자가 '+state.heroes[rear].name+'을(를) 노립니다.',true);
  },1800);

  later(function(){
    if(front==='vael'&&rear==='seris'){
      setHeroHp('vael',state.heroes.vael.hp-14,'INTERCEPT');
      pulseMotion('vael','intercept',980);
      pulseMotion('seris','steady',720);
      app.querySelector('.shield-fx')?.classList.add('play');
      pushLog('베일이 세리스 대신 공격을 받아냅니다. (수호 본능)');
    }else{
      setHeroHp(rear,state.heroes[rear].hp-34,'후열 저격');
      if(rear==='seris')pulseMotion('seris','hit',620);
      else app.querySelector('.ally.'+rear)?.classList.add('hit');
      pushLog(state.heroes[rear].name+'이(가) 후열 저격을 맞았습니다.',true);
    }
  },2500);

  later(function(){
    pulseMotion('mirel','sense',540);
    const unit=app.querySelector('.ally.mirel small');
    if(unit)unit.textContent='위험 감지';
  },2920);

  later(function(){
    const weak=Object.keys(state.heroes).sort(function(a,b){return state.heroes[a].hp-state.heroes[b].hp;})[0];
    pulseMotion('mirel','heal',1120);
    const target=app.querySelector('.ally.'+weak);
    if(target){
      target.classList.add('healing-target');
      later(function(){target.classList.remove('healing-target');},900);
    }
    setHeroHp(weak,state.heroes[weak].hp+24,'꽃맥박');
    app.querySelector('.heal-fx')?.classList.add('play');
    pushLog('미렐이 '+state.heroes[weak].name+'을(를) 치유합니다.');
  },3400);

  later(function(){
    pulseMotion('mirel','recover',620);
  },3970);

  later(function(){
    pulseMotion('seris','channel',1650);
    const unit=app.querySelector('.ally.seris small');
    if(unit)unit.textContent='월광 의식 · 집중';
    pushLog('세리스가 월광 의식을 준비합니다.');
  },4200);

  later(function(){
    pulseMotion('seris','burst',1080);
    app.querySelector('.moon-fx')?.classList.add('play');
    setEnemyHp('breaker',0);setEnemyHp('hound',18);setEnemyHp('hunter',32);
    pushLog('월광 폭발이 적 전열을 휩쓸었습니다.');
  },5300);

  later(function(){
    setEnemyHp('hound',0);setEnemyHp('hunter',0);
    pulseMotion('vael','finish',900);
    pulseMotion('seris','recover',820);
    pushLog('전투 종료. 원인을 복기합니다.');
  },6400);

  later(function(){state.phase='result';state.result={front:front,rear:rear};render();},7400);
}

function causeChain(){
  const front=heroAtLane(0),mid=heroAtLane(1),rear=heroAtLane(2);
  return [
    front==='vael'?{good:true,title:'전열',text:'베일이 첫 강공격을 안정적으로 받아냄'}:{good:false,title:'전열',text:state.heroes[front].name+'이(가) 첫 타격에서 큰 피해를 받음'},
    rear==='seris'&&front==='vael'?{good:true,title:'수호',text:'후열 저격 → 베일 INTERCEPT → 세리스 의식 유지'}:{good:false,title:'후열',text:state.heroes[rear].name+'이(가) 저격에 직접 노출됨'},
    mid==='mirel'?{good:true,title:'치유',text:'미렐이 중열에서 가장 위험한 동료를 즉시 회복'}:{good:true,title:'치유',text:'미렐이 자동으로 최저 HP 동료를 탐색해 회복'}
  ];
}

reset();
render();

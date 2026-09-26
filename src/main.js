import './style.css';
import { APPROVED_CONCEPT_ART } from './approvedConceptArt.js';

const app = document.querySelector('#app');

const heroesBase = {
  vael: { id:'vael', name:'베일', role:'수호', hp:100, lane:0 },
  mirel:{ id:'mirel',name:'미렐',role:'회복', hp:100, lane:1 },
  seris:{ id:'seris',name:'세리스',role:'의식', hp:100, lane:2 }
};

const enemiesBase = {
  breaker:{ id:'breaker',name:'수정 파쇄자',intent:'FRONT 강공격',hp:100 },
  hound:{ id:'hound',name:'성흔 사냥개',intent:'LOW HP 추적',hp:100 },
  hunter:{ id:'hunter',name:'맹안의 추적자',intent:'VEIL 저격',hp:100 }
};

const lanes = [
  { id:'front', label:'FRONT', ko:'외피', x:29, y:64 },
  { id:'core',  label:'CORE',  ko:'심장', x:43, y:69 },
  { id:'veil',  label:'VEIL',  ko:'장막', x:57, y:64 }
];

const enemyPos = {
  breaker:{x:76,y:62},
  hound:{x:69,y:72},
  hunter:{x:83,y:71}
};

const state = {
  phase:'plan',
  selected:null,
  heroes:null,
  enemies:null,
  timers:[]
};

function clone(obj){ return JSON.parse(JSON.stringify(obj)); }

function reset(){
  state.timers.forEach(clearTimeout);
  state.timers=[];
  state.phase='plan';
  state.selected=null;
  state.heroes=clone(heroesBase);
  state.enemies=clone(enemiesBase);
}

function later(fn,ms){
  const id=setTimeout(fn,ms);
  state.timers.push(id);
}

function heroAtLane(index){
  const found=Object.values(state.heroes).find(function(h){return h.lane===index;});
  return found ? found.id : 'vael';
}

function spriteMarkup(id,small){
  return '<div class="actor-sprite '+id+(small?' small':'')+'">'
    +'<i class="shadow"></i><i class="wing wing-a"></i><i class="wing wing-b"></i>'
    +'<i class="horn horn-a"></i><i class="horn horn-b"></i><i class="hair"></i>'
    +'<i class="head"><b></b><b></b></i><i class="body"></i><i class="weapon"></i><i class="ornament"></i>'
    +'</div>';
}

function enemyMarkup(id){
  return '<div class="enemy-sprite '+id+'"><i class="shadow"></i><i class="ear a"></i><i class="ear b"></i>'
    +'<i class="body"></i><i class="face"><b></b><b></b></i><i class="weapon"></i></div>';
}

function render(){
  const plan=state.phase==='plan';
  const battle=state.phase==='battle';
  const result=state.phase==='result';

  const heroWorld=Object.values(state.heroes).map(function(hero){
    const lane=lanes[hero.lane];
    return '<button class="world-unit hero '+(state.selected===hero.id?'selected ':'')+hero.id+'" data-hero="'+hero.id+'" style="--x:'+lane.x+'%;--y:'+lane.y+'%">'
      +'<span class="world-bar"><i style="width:'+hero.hp+'%"></i></span>'
      +spriteMarkup(hero.id,false)
      +'<strong>'+hero.name+'</strong><small class="unit-state">'+(battle?'자동 행동':'배치 대기')+'</small></button>';
  }).join('');

  const enemyWorld=Object.values(state.enemies).map(function(enemy){
    const pos=enemyPos[enemy.id];
    return '<div class="world-unit foe '+enemy.id+'" data-enemy="'+enemy.id+'" style="--x:'+pos.x+'%;--y:'+pos.y+'%">'
      +'<span class="intent-badge">'+enemy.intent+'</span><span class="world-bar enemybar"><i style="width:'+enemy.hp+'%"></i></span>'
      +enemyMarkup(enemy.id)+'<strong>'+enemy.name+'</strong></div>';
  }).join('');

  const partyHud=Object.values(state.heroes).map(function(hero){
    return '<button class="hud-card '+(state.selected===hero.id?'selected':'')+'" data-hud="'+hero.id+'">'
      +'<div class="hud-face">'+spriteMarkup(hero.id,true)+'</div><div class="hud-info"><strong>'+hero.name+'</strong>'
      +'<span>'+hero.role+' · '+lanes[hero.lane].ko+'</span><div class="hud-hp"><i style="width:'+hero.hp+'%"></i></div>'
      +'<div class="skills"><i>Ⅰ</i><i>Ⅱ</i><i>Ⅲ</i><i>◆</i></div></div></button>';
  }).join('');

  const enemyHud=Object.values(state.enemies).map(function(enemy){
    return '<div class="enemy-card"><div class="enemy-face">'+enemyMarkup(enemy.id)+'</div><div><strong>'+enemy.name+'</strong>'
      +'<span>'+enemy.intent+'</span><div class="enemy-hp"><i style="width:'+enemy.hp+'%"></i></div></div></div>';
  }).join('');

  let debrief='';
  if(result){
    debrief='<aside class="debrief"><span>CAUSE CHAIN</span><h3>당신의 배치가 만든 결과</h3><ol>'
      +debriefItems().map(function(item){return '<li class="'+(item.good?'good':'bad')+'"><b>'+item.title+'</b><em>'+item.text+'</em></li>';}).join('')
      +'</ol><button id="retry">다른 배치로 다시</button></aside>';
  }

  app.innerHTML='<main class="layered-game '+state.phase+'">'
    +'<div class="painted-bg" style="--art:url('+APPROVED_CONCEPT_ART+')"></div><div class="arena-grade"></div>'
    +'<header class="game-topbar"><div class="night"><span>☾</span><div><b>1일차</b><small>떠나는 밤 · 유리 평원</small></div></div>'
    +'<div class="resources"><span>◉ 320</span><span>◆ 3</span><span>▤ 2</span><button>⚙</button></div></header>'
    +'<nav class="left-rail"><button class="active">♜<span>카라반</span></button><button>♙<span>동료</span></button>'
    +'<button>⚔<span>장비</span></button><button>▣<span>기록</span></button></nav>'
    +'<section class="arena-shell"><div class="lane-field">'
    +lanes.map(function(lane,i){return '<button class="floor-slot '+lane.id+'" data-lane="'+i+'" style="--x:'+lane.x+'%;--y:'+lane.y+'%"><span>'+lane.label+'</span><b>'+lane.ko+'</b></button>';}).join('')
    +'</div><svg class="intent-layer" viewBox="0 0 1000 500" preserveAspectRatio="none"><defs><marker id="redArrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#e8665c"/></marker></defs>'
    +'<path d="M770 180 Q610 210 305 305" marker-end="url(#redArrow)"/><path d="M835 315 Q710 285 570 305" marker-end="url(#redArrow)"/></svg>'
    +'<svg class="resonance-layer" viewBox="0 0 1000 500"><path d="M290 325 Q425 410 570 325"/></svg>'
    +enemyWorld+heroWorld+'<div class="shield-vfx"></div><div class="heal-vfx">✦ ✦ ✦</div><div class="moon-vfx"></div><div class="impact-vfx"></div>'
    +'<aside class="coach"><span>TUTORIAL · '+(plan?'FORMATION':battle?'WATCH':'DEBRIEF')+'</span><h2>'
    +(plan?'전장을 직접 만져보세요':battle?'이제 손을 뗍니다':'원인을 읽습니다')+'</h2><p>'
    +(plan?'동료를 선택한 뒤 FRONT / CORE / VEIL 바닥을 눌러 위치를 바꾸세요.':battle?'COMMIT 이후에는 직접 조작할 수 없습니다. 생태계가 스스로 반응합니다.':'전투 결과가 아니라 선택 → 행동 → 결과를 복기합니다.')
    +'</p>'+(plan?'<div class="coach-tip">TIP · 베일을 FRONT에, 세리스를 VEIL에 놓으면 수호 반응이 가장 잘 보입니다.</div>':'')+'</aside>'
    +debrief+'</section>'
    +'<section class="bottom-hud"><div class="party-hud">'+partyHud+'</div><div class="center-command"><span>'
    +(plan?'배치 단계':battle?'전투 중…':'전투 결과')+'</span>'
    +(plan?'<button id="commit">COMMIT <b>배치 완료 →</b></button>':battle?'<div class="clock"><b id="clock">00:08</b><small>AUTO</small></div>':'<button id="next">다음 시스템 <b>공명 →</b></button>')
    +'</div><div class="enemy-hud">'+enemyHud+'</div></section>'
    +'<div class="rotate-hint"><div>↻</div><strong>가로 화면으로 돌려주세요</strong><span>이 게임은 16:9 전장 화면을 기준으로 설계합니다.</span></div></main>';

  bind();
}

function bind(){
  if(state.phase==='plan'){
    app.querySelectorAll('[data-hero],[data-hud]').forEach(function(el){
      el.addEventListener('click',function(){
        state.selected=el.dataset.hero||el.dataset.hud;
        render();
      });
    });
    app.querySelectorAll('[data-lane]').forEach(function(el){
      el.addEventListener('click',function(){
        if(state.selected!==null) moveSelected(Number(el.dataset.lane));
      });
    });
    app.querySelector('#commit').addEventListener('click',startBattle);
  }
  const retry=app.querySelector('#retry');
  if(retry) retry.addEventListener('click',function(){reset();render();});
  const next=app.querySelector('#next');
  if(next) next.addEventListener('click',function(){reset();render();setTimeout(function(){app.querySelector('.resonance-layer')?.classList.add('teach');},100);});
}

function moveSelected(target){
  const id=state.selected;
  const old=state.heroes[id].lane;
  const other=Object.values(state.heroes).find(function(h){return h.id!==id&&h.lane===target;});
  if(other) other.lane=old;
  state.heroes[id].lane=target;
  render();
}

function setHeroHp(id,hp,label){
  state.heroes[id].hp=Math.max(0,Math.min(100,hp));
  app.querySelectorAll('[data-hero="'+id+'"] .world-bar i,[data-hud="'+id+'"] .hud-hp i').forEach(function(bar){bar.style.width=state.heroes[id].hp+'%';});
  const unit=app.querySelector('[data-hero="'+id+'"]');
  if(unit&&label) unit.querySelector('.unit-state').textContent=label;
}

function setEnemyHp(id,hp){
  state.enemies[id].hp=Math.max(0,Math.min(100,hp));
  const unit=app.querySelector('[data-enemy="'+id+'"]');
  if(unit){
    unit.querySelector('.world-bar i').style.width=state.enemies[id].hp+'%';
    if(state.enemies[id].hp<=0) unit.classList.add('defeated');
  }
}

function startBattle(){
  state.timers.forEach(clearTimeout);
  state.timers=[];
  state.phase='battle';
  state.selected=null;
  render();

  const front=heroAtLane(0);
  const rear=heroAtLane(2);
  let sec=8;
  const ticker=setInterval(function(){
    sec--;
    const clock=app.querySelector('#clock');
    if(clock) clock.textContent='00:0'+Math.max(0,sec);
    if(sec<=0) clearInterval(ticker);
  },1000);

  later(function(){
    app.querySelector('[data-enemy="breaker"]')?.classList.add('charge');
    app.querySelector('[data-hero="'+front+'"]')?.classList.add('targeted');
  },500);

  later(function(){
    setHeroHp(front,state.heroes[front].hp-(front==='vael'?22:46),'첫 충돌');
    app.querySelector('[data-hero="'+front+'"]')?.classList.add('hit');
    app.querySelector('.impact-vfx')?.classList.add('play');
  },1250);

  later(function(){
    app.querySelector('[data-enemy="hunter"]')?.classList.add('aim');
    app.querySelector('[data-hero="'+rear+'"]')?.classList.add('targeted');
  },1800);

  later(function(){
    if(front==='vael'&&rear==='seris'){
      setHeroHp('vael',state.heroes.vael.hp-14,'INTERCEPT');
      app.querySelector('[data-hero="vael"]')?.classList.add('intercept');
      app.querySelector('.shield-vfx')?.classList.add('play');
      const seris=app.querySelector('[data-hero="seris"] .unit-state');
      if(seris) seris.textContent='보호됨';
    }else{
      setHeroHp(rear,state.heroes[rear].hp-34,'후열 저격');
      app.querySelector('[data-hero="'+rear+'"]')?.classList.add('hit');
    }
  },2450);

  later(function(){
    const weakest=Object.keys(state.heroes).sort(function(a,b){return state.heroes[a].hp-state.heroes[b].hp;})[0];
    setHeroHp(weakest,state.heroes[weakest].hp+24,'꽃맥박');
    app.querySelector('[data-hero="mirel"]')?.classList.add('heal-cast');
    app.querySelector('.heal-vfx')?.classList.add('play');
  },3350);

  later(function(){
    app.querySelector('[data-hero="seris"]')?.classList.add('channel');
    const action=app.querySelector('[data-hero="seris"] .unit-state');
    if(action) action.textContent='월광 의식';
    app.querySelector('.resonance-layer')?.classList.add('active');
  },4200);

  later(function(){
    app.querySelector('.moon-vfx')?.classList.add('play');
    setEnemyHp('breaker',0); setEnemyHp('hound',18); setEnemyHp('hunter',32);
  },5350);

  later(function(){
    setEnemyHp('hound',0); setEnemyHp('hunter',0);
    app.querySelector('[data-hero="vael"]')?.classList.add('finish');
  },6250);

  later(function(){
    clearInterval(ticker);
    state.phase='result';
    render();
  },7600);
}

function debriefItems(){
  const front=heroAtLane(0);
  const core=heroAtLane(1);
  const rear=heroAtLane(2);
  return [
    front==='vael'?{good:true,title:'FRONT',text:'베일이 첫 강공격을 받아내 전열이 유지됨'}:{good:false,title:'FRONT',text:state.heroes[front].name+'가 첫 강공격에 크게 흔들림'},
    rear==='seris'&&front==='vael'?{good:true,title:'VEIL',text:'세리스가 수호를 받아 의식을 끝까지 유지함'}:{good:false,title:'VEIL',text:state.heroes[rear].name+'가 후열 저격에 노출됨'},
    core==='mirel'?{good:true,title:'CORE',text:'미렐이 중앙에서 가장 위험한 동료를 즉시 치유함'}:{good:true,title:'CORE',text:state.heroes[core].name+'가 중앙 공명을 유지함'}
  ];
}

reset();
render();

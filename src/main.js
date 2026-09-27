import './style.css';
import campCleanArt from './assets/scenes/camp-clean.svg';
import arenaArt from './assets/scenes/arena-clearing.svg';
import journeyMapArt from './assets/scenes/journey-map.svg';
import vaelArt from './assets/heroes/vael.webp';
import serisArt from './assets/heroes/seris.webp';
import mirelArt from './assets/heroes/mirel.webp';
import breakerArt from './assets/enemies/breaker.svg';
import houndArt from './assets/enemies/hound.svg';
import hunterArt from './assets/enemies/hunter.svg';

import { HEROES_DATA } from './game/data/heroes.js';
import { ENEMIES_DATA } from './game/data/enemies.js';
import { POSITIONS_DATA, BONDS_DATA, EDICTS_DATA } from './game/data/rules.js';
import { RunManager } from './game/loop/RunManager.js';
import { BattleDirector } from './game/director/BattleDirector.js';
import { SpriteAtlas } from './game/render/SpriteAtlas.js';
import { runEngineTests } from './game/engine/__tests__/CombatEngine.test.js';
import { CHAPTER_01 } from './content/chapter01.js';

const CHAPTER_BEATS = Object.fromEntries(CHAPTER_01.beats.map((b) => [b.id, b]));
const BATTLE_BARKS = CHAPTER_BEATS['battle-01']?.battle_barks || {
  vael: { guard: '내가 먼저 막는다.', intercept: '방패는 부서지지 않는다!' },
  seris: { protected: '고마워, 베일…!', channel: '달빛이 모인다…', burst: '모두 물러서!' },
  mirel: { sense: '상처를 읽을게요.', heal: '아직 피어날 수 있어요!' }
};


// SpriteAtlas integration (aldegad/sprite-gen & Hero Inc. 2.5D animation standards)
const heroAtlases = {
  vael: new SpriteAtlas({
    sheetSrc: './assets/vael_sprites.jpg',
    facing: 'right',
    breathSpeed: 1.8,
    breathPhase: 0,
  }),
  seris: new SpriteAtlas({
    sheetSrc: './assets/seris_sprites.jpg',
    facing: 'right',
    breathSpeed: 2.2,
    breathPhase: 2.1,
  }),
  mirel: new SpriteAtlas({
    sheetSrc: './assets/mirel_sprites.jpg',
    facing: 'right',
    breathSpeed: 2.8,
    breathPhase: 4.2,
  }),
};

const enemyAtlases = {
  breaker: new SpriteAtlas({
    sheetSrc: './assets/boss_warden_sprites.jpg',
    facing: 'left',
    isEnemy: true,
    scaleMultiplier: 1.0,
    breathSpeed: 2.0,
  }),
  hound: new SpriteAtlas({
    sheetSrc: './assets/boss_warden_sprites.jpg',
    facing: 'left',
    isEnemy: true,
    scaleMultiplier: 0.68,
    paletteFilter: 'hue-rotate(325deg) saturate(1.4) brightness(0.9)',
    breathSpeed: 3.5,
  }),
  hunter: new SpriteAtlas({
    sheetSrc: './assets/boss_warden_sprites.jpg',
    facing: 'left',
    isEnemy: true,
    scaleMultiplier: 0.82,
    paletteFilter: 'hue-rotate(225deg) saturate(1.2) brightness(1.1)',
    breathSpeed: 2.3,
  }),
  lancer: new SpriteAtlas({
    sheetSrc: './assets/boss_warden_sprites.jpg',
    facing: 'left',
    isEnemy: true,
    scaleMultiplier: 0.9,
    paletteFilter: 'hue-rotate(155deg) saturate(1.1) brightness(1.2)',
    breathSpeed: 2.5,
  }),
  leech: new SpriteAtlas({
    sheetSrc: './assets/boss_warden_sprites.jpg',
    facing: 'left',
    isEnemy: true,
    scaleMultiplier: 0.62,
    paletteFilter: 'hue-rotate(280deg) saturate(1.5) brightness(0.85)',
    breathSpeed: 3.8,
  }),
};

let activeEnemyAtlases = {};

// Run automated tests for determinism & build divergence
runEngineTests();

// High-Resolution Master Assets (AI Generated) with graceful fallback
const campMasterArt = './assets/camp_master.jpg';
const arenaMasterArt = './assets/arena_master.jpg';

const HERO_ART = { vael: vaelArt, seris: serisArt, mirel: mirelArt };
const HERO_MASTER_ART = {
  vael: './assets/vael_master.jpg',
  seris: './assets/seris_master.jpg',
  mirel: './assets/mirel_master.jpg',
};

const ENEMY_ART = { breaker: breakerArt, hound: houndArt, hunter: hunterArt, lancer: breakerArt, leech: houndArt };
const ENEMY_MASTER_ART = {
  breaker: './assets/boss_warden_master.jpg',
  hound: './assets/boss_warden_master.jpg',
  hunter: './assets/boss_warden_master.jpg',
  lancer: './assets/boss_warden_master.jpg',
  leech: './assets/boss_warden_master.jpg',
};

const app = document.querySelector('#app');

// State
const run = new RunManager(2026);
let viewMode = 'camp'; // 'camp' | 'battle'
let activeDrawer = null; // null | 'formation' | 'tactics' | 'map'
let selectedHeroId = null;
let battleDirector = null;
let playbackSpeed = 1;
let combatLogs = [];

function heroSprite(id, small) {
  if (small) {
    const masterArt = HERO_MASTER_ART[id] || HERO_ART[id];
    const fallback = HERO_ART[id] || vaelArt;
    return (
      '<div class="hero-art-wrap ' + id + ' small">' +
      '<img class="hero-art-sprite" src="' + masterArt + '" onerror="if(this.src!=\'' + fallback + '\')this.src=\'' + fallback + '\'" alt="" draggable="false">' +
      '</div>'
    );
  }

  let fx = '';
  if (id === 'seris') fx = '<span class="seris-orbit"><i></i><i></i><i></i></span><span class="seris-sigil"></span>';
  if (id === 'mirel') fx = '<span class="mirel-bloom"><i></i><i></i><i></i><i></i></span><span class="mirel-ring"></span>';

  return (
    '<div class="hero-art-wrap ' + id + '">' +
    '<span class="hero-art-shadow"></span>' + fx +
    '<canvas class="hero-sprite-canvas" data-atlas-hero="' + id + '" width="240" height="300" aria-label="' + id + ' sprite"></canvas>' +
    '</div>'
  );
}

function enemySprite(id, small, uid = null) {
  if (small) {
    const masterArt = ENEMY_MASTER_ART[id] || breakerArt;
    const fallback = ENEMY_ART[id] || breakerArt;
    return (
      '<div class="enemy-art-wrap ' + id + ' mini"><span class="enemy-art-shadow"></span>' +
      '<img class="enemy-art-sprite" src="' + masterArt + '" onerror="if(this.src!=\'' + fallback + '\')this.src=\'' + fallback + '\'" alt="" draggable="false"></div>'
    );
  }

  const uidAttr = uid ? ' data-atlas-enemy-uid="' + uid + '"' : '';
  return (
    '<div class="enemy-art-wrap ' + id + '">' +
    '<span class="enemy-art-shadow"></span>' +
    '<canvas class="enemy-sprite-canvas" data-atlas-enemy="' + id + '"' + uidAttr + ' data-enemy-type="' + id + '" width="260" height="320" aria-label="' + id + ' enemy sprite"></canvas>' +
    '</div>'
  );
}

/* =========================================================
   1. FULL-SCREEN CAMP MOCKUP SCREEN (Faithfully matching Image 2)
   ========================================================= */
function renderCampScreen() {
  // Dynamic Dialogues based on organ state and battle events (D001-B)
  const dialogues = run.getCampDialogues();
  const vaelQuote = dialogues.vael;
  const serisQuote = dialogues.seris;
  const mirelQuote = dialogues.mirel;
  const enc = run.currentEncounter;

  // Left nav tabs
  const isCamp = activeDrawer === null;
  const isFormation = activeDrawer === 'formation';
  const isTactics = activeDrawer === 'tactics';
  const isMap = activeDrawer === 'map';

  return (
    '<div class="screen-camp">' +
    '<div class="camp-full-bg" style="background-image:url(\'' + campMasterArt + '\'), url(\'' + campCleanArt + '\')"></div>' +

    // Top-Left Day Mark (Matching Image 2)
    '<div class="camp-day-mark">' +
    '<div class="moon-icon">☾</div>' +
    '<div class="day-text">' +
    '<b>' + run.day + '일차</b>' +
    '<small>떠나는 밤 · 노드 ' + (run.nodeIndex + 1) + '/4</small>' +
    '</div>' +
    '</div>' +

    // Top Center-Left Threat Intel Recon Banner (Threat read)
    '<div class="camp-threat-intel" id="btnThreatIntel" data-nav="map">' +
    '<div class="threat-icon">⚔</div>' +
    '<div class="threat-info">' +
    '<b>전방 위협: ' + (enc.title || '미지의 적') + '</b>' +
    '<small>' + (enc.briefing || enc.narrative) + '</small>' +
    '</div>' +
    '<div class="threat-arrow">정찰 ❯</div>' +
    '</div>' +

    // Left Vertical Navigation Bar (Matching Image 2)
    '<div class="camp-left-nav">' +
    '<button class="' + (isCamp ? 'active' : '') + '" data-nav="camp"><i>⌛</i><span>카라반</span></button>' +
    '<button class="' + (isFormation ? 'active' : '') + '" data-nav="formation"><i>♟</i><span>동료</span></button>' +
    '<button class="' + (isTactics ? 'active' : '') + '" data-nav="tactics"><i>⚔</i><span>장비</span></button>' +
    '<button class="' + (isMap ? 'active' : '') + '" data-nav="map"><i>🗎</i><span>기록</span></button>' +
    '</div>' +

    // Authentic Notched Speech Bubbles (Matching Image 2)
    '<div class="mockup-speech-bubble bubble-vael">' +
    '<b>베일</b>' +
    '<span>' + vaelQuote + '</span>' +
    '<div class="bubble-tail"></div>' +
    '</div>' +

    '<div class="mockup-speech-bubble bubble-seris">' +
    '<b>세리스</b>' +
    '<span>' + serisQuote + '</span>' +
    '<div class="bubble-tail"></div>' +
    '</div>' +

    '<div class="mockup-speech-bubble bubble-mirel">' +
    '<b>미렐</b>' +
    '<span>' + mirelQuote + '</span>' +
    '<div class="bubble-tail"></div>' +
    '</div>' +

    // Bottom Action Bar
    '<div class="camp-bottom-bar">' +
    '<button class="camp-launch-btn" id="btnLaunchBattle">' +
    '<span>⚔</span> 출정 준비 · 전장으로 (COMMIT) →' +
    '</button>' +
    '</div>' +

    // Drawer Overlays (When clicking 동료, 장비, 기록)
    renderCampDrawer() +

    '</div>'
  );
}

function renderCampDrawer() {
  if (!activeDrawer) return '';

  let title = '';
  let content = '';

  if (activeDrawer === 'formation') {
    title = '동료 배치 (Formation)';
    const cards = [0, 1, 2].map((slotIdx) => {
      const heroId = run.build.formation[slotIdx];
      const h = run.heroes[heroId];
      const slotDef = [POSITIONS_DATA.front, POSITIONS_DATA.core, POSITIONS_DATA.rear][slotIdx];
      const isSel = selectedHeroId === heroId ? 'selected' : '';

      return (
        '<button class="formation-card ' + isSel + '" data-heroselect="' + heroId + '">' +
        '<div class="formation-portrait">' + heroSprite(heroId, true) + '</div>' +
        '<strong>' + slotDef.label + ' (' + slotDef.en + ')</strong>' +
        '<b>' + h.name + '</b>' +
        '<small>' + slotDef.rule + '</small>' +
        '</button>'
      );
    }).join('');

    const targetSlots = [0, 1, 2].map((slotIdx) => {
      const slotDef = [POSITIONS_DATA.front, POSITIONS_DATA.core, POSITIONS_DATA.rear][slotIdx];
      return '<button data-lane="' + slotIdx + '"><span>' + slotDef.en + '</span><b>' + slotDef.label + '</b></button>';
    }).join('');

    content = (
      '<p style="color:#d4cae8;font-size:0.75rem;line-height:1.45;margin-bottom:12px;">' +
      '동료를 선택한 뒤 원하는 위치를 눌러 자리를 바꿉니다. 위치에 따라 전열 충돌 흡수, 회복 증폭, 의식 가속이 결정됩니다.' +
      '</p>' +
      '<div class="formation-preview">' + cards + '</div>' +
      '<div class="slot-buttons" style="margin-top:14px;">' + targetSlots + '</div>'
    );
  } else if (activeDrawer === 'tactics') {
    title = '전술 명령 & 공명 (Tactics)';
    const bondCards = run.unlockedBonds.map((bondKey) => {
      const b = BONDS_DATA[bondKey];
      const active = run.build.bond === bondKey ? 'selected' : '';
      return (
        '<button class="bond-pill ' + active + '" data-bond="' + bondKey + '">' +
        '<b>' + b.title + '</b><span>' + b.short + '</span>' +
        '</button>'
      );
    }).join('');

    const edictCards = run.unlockedEdicts.map((edictKey) => {
      const e = EDICTS_DATA[edictKey];
      const active = run.build.edict === edictKey ? 'selected' : '';
      return (
        '<button class="edict-pill ' + active + '" data-edict="' + edictKey + '">' +
        '<b>' + e.title + '</b><small>' + e.effect + '</small>' +
        '</button>'
      );
    }).join('');

    const activeBond = run.build.bond ? BONDS_DATA[run.build.bond] : null;
    const activeEdict = run.build.edict ? EDICTS_DATA[run.build.edict] : null;

    content = (
      '<div class="tactics-selector">' +
      '<div class="tactics-row"><span>공명 (Bond)</span><div class="pill-group">' + bondCards + '</div></div>' +
      (activeBond ? '<div class="tactics-info">✦ <b>' + activeBond.title + '</b>: ' + activeBond.description + '</div>' : '') +
      '<div class="tactics-row" style="margin-top:10px;"><span>명령 (Edict)</span><div class="pill-group">' + edictCards + '</div></div>' +
      (activeEdict ? '<div class="tactics-info">✦ <b>' + activeEdict.title + '</b>: ' + activeEdict.description + ' (' + activeEdict.tradeoff + ')</div>' : '') +
      '</div>'
    );
  } else if (activeDrawer === 'map') {
    title = '카라반 여정 & 위협 정찰 (Journey Route)';
    const enc = run.currentEncounter;
    const nodeNames = [
      { name: '사막의 유리 결정', sub: '전열 사냥개 급습' },
      { name: '백철의 협곡', sub: '창기병 & 저격수 협공' },
      { name: '성흔의 갈림길', sub: '혼전 침투 & 흡혈충' },
      { name: '고대 유적 결계', sub: '정예 보스: 공허의 파수꾼' },
    ];

    const trailHtml = [0, 1, 2, 3].map((idx) => {
      const isCleared = idx < run.nodeIndex;
      const isCurrent = idx === run.nodeIndex;
      const isLocked = idx > run.nodeIndex;
      const cls = isCleared ? 'cleared' : isCurrent ? 'current' : 'locked';
      const statusText = isCleared ? '✓ 격파' : isCurrent ? '● 조우 중' : '🔒 미도달';
      const nodeInfo = nodeNames[idx] || { name: `${idx + 1}구역`, sub: '미개척 경로' };

      return (
        '<div class="journey-node-row ' + cls + '">' +
        '<div class="journey-node-badge">' + (idx + 1) + '</div>' +
        '<div class="journey-node-details">' +
        '<strong>' + nodeInfo.name + '</strong>' +
        '<span>' + nodeInfo.sub + '</span>' +
        '</div>' +
        '<span class="journey-node-status">' + statusText + '</span>' +
        '</div>'
      );
    }).join('');

    content = (
      '<div style="color:#d4cae8;font-size:0.75rem;line-height:1.5;">' +
      '<div class="journey-trail">' + trailHtml + '</div>' +
      '<h4 style="color:#ffe29d;margin:12px 0 6px;">' + (enc.title || '교전') + '</h4>' +
      '<p style="margin:0 0 10px;color:#c0b4a8;">' + enc.narrative + '</p>' +
      '<div style="background:rgba(255,255,255,0.06);padding:10px;border-radius:10px;border:1px solid rgba(255,255,255,0.08);">' +
      '<b style="color:#f5b252;">적의 행동 의도 (Threat Intent):</b><br>' +
      enc.enemies.map((e) => {
        const d = ENEMIES_DATA[e.id] || ENEMIES_DATA.breaker;
        return '• <span style="color:#fff;">' + d.name + '</span> (' + d.intent + ' · ' + (e.slot === 'front' ? '전열' : e.slot === 'core' ? '중열' : '후열') + ')';
      }).join('<br>') +
      '</div></div>'
    );
  }

  return (
    '<div class="camp-drawer open">' +
    '<div class="camp-drawer-header">' +
    '<h3>' + title + '</h3>' +
    '<button class="camp-drawer-close" id="btnCloseDrawer">✕</button>' +
    '</div>' +
    content +
    '</div>'
  );
}

/* =========================================================
   2. FULL-SCREEN ARENA BATTLE SCREEN (Arena-Dominant Screen)
   ========================================================= */
function renderBattleScreen() {
  const enc = run.currentEncounter;
  const inCombat = run.phase === 'watch';
  const pos = [
    { x: 37, y: 64 }, // Front
    { x: 27, y: 70 }, // Core
    { x: 17, y: 62 }, // Rear
  ];

  // Enemies
  const enemyList = enc.enemies;
  const enemyCoords = [
    { x: 74, y: 64 }, // Front
    { x: 83, y: 70 }, // Core
    { x: 90, y: 58 }, // Rear
  ];

  const enemiesHtml = enemyList.map((e, idx) => {
    const def = ENEMIES_DATA[e.id] || ENEMIES_DATA.breaker;
    const pt = enemyCoords[idx % enemyCoords.length];
    const uid = `${e.id}_${idx}`;
    return (
      '<div class="battle-unit enemy ' + e.id + '" data-enemy="' + uid + '" style="--x:' + pt.x + '%;--y:' + pt.y + '%;--y-int:' + Math.round(pt.y) + ';">' +
      '<div class="world-hp enemy-hp"><i style="width:100%"></i></div>' +
      enemySprite(e.id, false, uid) +
      '<strong>' + def.name + '</strong>' +
      '</div>'
    );
  }).join('');

  // Allies
  const alliesHtml = [0, 1, 2].map((slotIdx) => {
    const heroId = run.build.formation[slotIdx];
    const h = run.heroes[heroId];
    const pt = pos[slotIdx];
    const slotDef = [POSITIONS_DATA.front, POSITIONS_DATA.core, POSITIONS_DATA.rear][slotIdx];
    const hpPct = Math.round((h.hp / h.maxHp) * 100);

    return (
      '<button class="battle-unit ally world-unit hero ' + heroId + '" data-hero="' + heroId + '" style="--x:' + pt.x + '%;--y:' + pt.y + '%;--y-int:' + Math.round(pt.y) + ';">' +
      '<div class="world-hp"><i style="width:' + hpPct + '%"></i></div>' +
      heroSprite(heroId, false) +
      '<strong>' + h.name + '</strong>' +
      '<small>' + (inCombat ? '자동 반응 중' : slotDef.label) + '</small>' +
      '</button>'
    );
  }).join('');

  // Resonance Line
  let resonanceLine = '';
  if (run.build.bond) {
    const bondDef = BONDS_DATA[run.build.bond];
    const slot1 = run.build.formation.indexOf(bondDef.members[0]);
    const slot2 = run.build.formation.indexOf(bondDef.members[1]);
    if (slot1 !== -1 && slot2 !== -1) {
      const coords = [{ x: 340, y: 260 }, { x: 440, y: 285 }, { x: 540, y: 260 }];
      const p1 = coords[slot1];
      const p2 = coords[slot2];
      resonanceLine = (
        '<svg class="resonance-pair-line ' + (inCombat ? 'active' : '') + '" viewBox="0 0 1000 420" preserveAspectRatio="none">' +
        '<path d="M' + p1.x + ' ' + p1.y + ' Q' + ((p1.x + p2.x) / 2) + ' ' + (Math.min(p1.y, p2.y) - 55) + ' ' + p2.x + ' ' + p2.y + '"/>' +
        '<circle cx="' + p1.x + '" cy="' + p1.y + '" r="6"/>' +
        '<circle cx="' + p2.x + '" cy="' + p2.y + '" r="6"/>' +
        '</svg>'
      );
    }
  }

  // Motion paths
  const frontPoint = pos[0];
  const rearPoint = pos[2];
  const motionSvg = (
    '<svg class="combat-motion-svg" viewBox="0 0 1000 420" preserveAspectRatio="none" aria-hidden="true">' +
    '<path class="breaker-motion-path" d="M630 248 Q520 220 ' + (frontPoint.x * 10) + ' ' + (frontPoint.y * 4.2) + '"/>' +
    '<path class="hunter-shot-path" d="M740 231 Q650 200 ' + (rearPoint.x * 10) + ' ' + (rearPoint.y * 4.2) + '"/>' +
    '</svg>'
  );

  const logsHtml = combatLogs.slice(-4).map((l) => {
    return '<div class="log-line ' + (l.danger ? 'danger' : '') + '"><i>' + (l.danger ? '!' : '●') + '</i><span>' + l.text + '</span></div>';
  }).join('');

  // Bottom HUD: 3 Allied Cards with real high-res portraits (No low-res cropped screenshots!)
  const hudCards = run.build.formation.map((heroId, slotIdx) => {
    const h = run.heroes[heroId];
    const isDown = h.hp <= 0;
    const hpPct = Math.round((h.hp / h.maxHp) * 100);
    const slotDef = [POSITIONS_DATA.front, POSITIONS_DATA.core, POSITIONS_DATA.rear][slotIdx];

    return (
      '<div class="hud-hero-card ' + (isDown ? 'downed' : '') + '">' +
      '<div class="hero-thumb"><img src="' + (HERO_MASTER_ART[heroId] || HERO_ART[heroId]) + '" onerror="if(this.src!=\'' + HERO_ART[heroId] + '\')this.src=\'' + HERO_ART[heroId] + '\'" alt=""></div>' +
      '<div class="hud-hero-info">' +
      '<div class="name-row"><b>' + h.name + '</b><span>' + slotDef.label + '</span></div>' +
      '<div class="hud-hp-bar ' + (hpPct < 30 ? 'low' : '') + '"><i style="width:' + hpPct + '%"></i></div>' +
      '<span style="font-size:0.6rem;color:#c0b5d0;">HP ' + h.hp + '/' + h.maxHp + '</span>' +
      '</div>' +
      '</div>'
    );
  }).join('');

  return (
    '<div class="screen-battle">' +
    '<div class="battle-arena-stage">' +
    '<div class="battle-bg" style="background-image:url(\'' + arenaMasterArt + '\'), url(\'' + arenaArt + '\')"></div>' +
    '<div class="battle-grade"></div>' +
    resonanceLine +
    motionSvg +
    enemiesHtml +
    alliesHtml +
    '<div class="shield-fx"></div><div class="heal-fx">✦ ✦ ✦</div><div class="moon-fx"></div><div class="hit-fx"></div>' +
    '<div class="combat-impact-flash"></div><div class="combat-callout"></div>' +
    '<div class="battle-dialogue"><div class="dialogue-portrait independent-seris-portrait"><img src="' + serisArt + '" alt="" draggable="false"></div><div><b>세리스</b><span>저 추적자는 나를 데려가려 해. 내가 집중하는 동안… 부탁할게.</span></div></div>' +
    '<div class="combat-log"><div class="log-title">전투 기록</div>' + logsHtml + '</div>' +
    (run.phase === 'debrief' ? renderDebriefOverlay() : '') +
    (run.phase === 'adapt' ? renderAdaptationOverlay() : '') +
    '</div>' +

    // Full-Width Bottom HUD
    '<div class="battle-bottom-hud">' +
    '<div class="hud-allies-group">' + hudCards + '</div>' +
    '<div class="hud-controls-group">' +
    '<button class="hud-btn" id="btnSpeed">배속 ×' + playbackSpeed + '</button>' +
    '<button class="hud-btn" id="btnReturnCamp">⛺ 캠프로 복귀</button>' +
    '</div>' +
    '</div>' +
    '</div>'
  );
}

function renderDebriefOverlay() {
  const debrief = run.lastDebrief;
  if (!debrief) return '';

  const causeList = debrief.chains.map((c) => {
    return (
      '<div class="' + (c.good ? 'good' : 'bad') + '">' +
      '<i>' + (c.good ? '✓' : '!') + '</i>' +
      '<span><b>' + c.title + '</b><em>' + c.text + '</em></span>' +
      '</div>'
    );
  }).join('');

  return (
    '<div class="tutorial-paper result-paper" style="position:absolute;z-index:60;right:5%;top:8%;width:380px;">' +
    '<div class="paper-ribbon">' + (debrief.grade === 'mastery' ? '★ 완벽한 호흡' : debrief.grade === 'clean' ? '✓ 승리' : '✕ 교전 종료') + '</div>' +
    '<h2>' + debrief.headline + '</h2>' +
    '<p>전투 복기: 당신의 설계가 어떻게 실행되었는지 확인하세요.</p>' +
    '<div class="cause-list" style="margin-top:10px;">' + causeList + '</div>' +
    '<div class="tactics-info" style="margin-top:10px;">💡 ' + debrief.advice + '</div>' +
    '<button class="paper-cta primary" id="btnGoAdaptFromBattle" style="margin-top:14px;">적응 및 다음 행선지 (ADAPT) →</button>' +
    '</div>'
  );
}

function renderAdaptationOverlay() {
  return (
    '<div class="tutorial-paper next-paper" style="position:absolute;z-index:60;right:5%;top:8%;width:380px;">' +
    '<div class="paper-ribbon">적응 단계 (ADAPT)</div>' +
    '<h2>카라반의 다음 선택</h2>' +
    '<p>동료는 소모품이 아닌 장기입니다. 상처를 돌보거나 공명을 강화하여 다음 여정을 준비하세요.</p>' +
    '<div class="adapt-choices" style="grid-template-columns:1fr;gap:8px;margin-top:12px;">' +
    '<button class="adapt-card primary" data-adapt="heal">' +
    '<span>생태계 보전</span><strong>카라반 치유 (+40% HP)</strong><em>모든 동료의 체력을 회복하고 쓰러진 자를 깨웁니다.</em>' +
    '</button>' +
    '<button class="adapt-card" data-adapt="bond_reinforce">' +
    '<span>공명 심화</span><strong>유대 반응 강화 (+25%)</strong><em>다음 교전에서도 공명 연계 효과를 영구 증폭합니다.</em>' +
    '</button>' +
    '<button class="adapt-card" data-adapt="edict_attune">' +
    '<span>전술 조율</span><strong>전장 명령 재각인</strong><em>모든 명령을 해금하고 카라반 초기 방벽을 보강합니다.</em>' +
    '</button>' +
    '</div>' +
    '</div>'
  );
}

/* =========================================================
   CORE RENDER & CONTROLLER
   ========================================================= */
function render() {
  app.innerHTML =
    '<div class="game-viewport">' +
    (viewMode === 'camp' ? renderCampScreen() : renderBattleScreen()) +
    '</div>';

  bindEvents();
}

function spawnFloatingText(targetSelector, text, type) {
  const target = app.querySelector(targetSelector);
  if (!target) return;
  const floatEl = document.createElement('div');
  floatEl.className = 'floating-combat-text ' + (type || '');
  floatEl.textContent = text;
  target.appendChild(floatEl);
  setTimeout(() => floatEl.remove(), 900 / playbackSpeed);
}

function pushLog(text, danger) {
  combatLogs.push({ text, danger: !!danger });
  const box = app.querySelector('.combat-log');
  if (box) {
    box.innerHTML =
      '<div class="log-title">전투 기록</div>' +
      combatLogs.slice(-4).map((l) => {
        return '<div class="log-line ' + (l.danger ? 'danger' : '') + '"><i>' + (l.danger ? '!' : '●') + '</i><span>' + l.text + '</span></div>';
      }).join('');
  }
}

function pulseMotion(id, motion, ms) {
  // SpriteAtlas frame animation trigger
  if (heroAtlases[id]) heroAtlases[id].play(motion);
  if (activeEnemyAtlases[id]) {
    activeEnemyAtlases[id].play(motion);
  } else if (enemyAtlases[id]) {
    enemyAtlases[id].play(motion);
  }

  const unit = app.querySelector('[data-hero="' + id + '"]') || app.querySelector('[data-enemy="' + id + '"]') || app.querySelector('[data-enemy^="' + id + '"]');
  if (!unit) return;
  Array.from(unit.classList).forEach((name) => {
    if (name.indexOf('motion-') === 0) unit.classList.remove(name);
  });
  unit.classList.add('motion-' + motion);
  setTimeout(() => unit.classList.remove('motion-' + motion), (ms || 520) / playbackSpeed);
}

function pulseSelector(selector, className, ms) {
  const el = app.querySelector(selector);
  if (!el) return;
  el.classList.add(className);

  if (className.startsWith('motion-')) {
    const motion = className.replace('motion-', '');
    const enemyUid = el.dataset.enemy;
    const heroId = el.dataset.hero;
    if (enemyUid && activeEnemyAtlases[enemyUid]) {
      activeEnemyAtlases[enemyUid].play(motion);
    } else if (enemyUid) {
      const enemyType = enemyUid.split('_')[0];
      if (enemyAtlases[enemyType]) enemyAtlases[enemyType].play(motion);
    }
    if (heroId && heroAtlases[heroId]) heroAtlases[heroId].play(motion);
  }

  setTimeout(() => el.classList.remove(className), (ms || 520) / playbackSpeed);
}

function battleBeat(className, ms) {
  const zone = app.querySelector('.battle-arena-stage');
  if (!zone) return;
  zone.classList.add(className);
  setTimeout(() => zone.classList.remove(className), (ms || 320) / playbackSpeed);
}

function combatCallout(text, tone, ms) {
  const el = app.querySelector('.combat-callout');
  if (!el) return;
  el.className = 'combat-callout show ' + (tone || '');
  el.textContent = text;
  setTimeout(() => {
    el.className = 'combat-callout';
    el.textContent = '';
  }, (ms || 650) / playbackSpeed);
}

function hitStop(ms) {
  const zone = app.querySelector('.battle-arena-stage');
  if (!zone) return;
  zone.classList.add('hitstop');
  setTimeout(() => zone.classList.remove('hitstop'), (ms || 110) / playbackSpeed);
}

function heroBark(id, text, ms) {
  const unit = app.querySelector('.ally.' + id);
  if (!unit || !text) return;
  let bark = unit.querySelector('.battle-bark');
  if (!bark) {
    bark = document.createElement('span');
    bark.className = 'battle-bark';
    unit.appendChild(bark);
  }
  bark.textContent = text;
  bark.classList.remove('show');
  requestAnimationFrame(() => bark.classList.add('show'));
  setTimeout(() => bark.classList.remove('show'), (ms || 720) / playbackSpeed);
}

function setHeroHp(id, hp, label) {
  const maxHp = HEROES_DATA[id]?.maxHp || 100;
  const pct = Math.max(0, Math.min(100, Math.round((hp / maxHp) * 100)));
  app.querySelectorAll('.ally.' + id + ' .world-hp i').forEach((el) => {
    el.style.width = pct + '%';
  });
  const unit = app.querySelector('.ally.' + id);
  if (unit && label) {
    const stateLabel = unit.querySelector('small');
    if (stateLabel) stateLabel.textContent = label;
  }
}

function setEnemyHp(uid, hp, maxHp) {
  const pct = Math.max(0, Math.min(100, Math.round((hp / maxHp) * 100)));
  const el = app.querySelector('[data-enemy="' + uid + '"]');
  if (el) {
    el.querySelector('.world-hp i').style.width = pct + '%';
    if (hp <= 0) el.classList.add('dead');
  }
}

/* =========================================================
   SPATIAL BATTLEFIELD LOCOMOTION ENGINE (Hero Inc. Dynamic Movement)
   ========================================================= */
let unitPositions = {}; // id -> { x, y, homeX, homeY }

function initBattlefieldPositions() {
  unitPositions = {};

  const allySlots = [
    { x: 37, y: 64 }, // Front
    { x: 27, y: 70 }, // Core
    { x: 17, y: 62 }, // Rear
  ];

  run.build.formation.forEach((heroId, idx) => {
    const pt = allySlots[idx] || { x: 25, y: 65 };
    unitPositions[heroId] = { x: pt.x, y: pt.y, homeX: pt.x, homeY: pt.y };
  });

  const enemySlots = [
    { x: 74, y: 64 },
    { x: 83, y: 70 },
    { x: 90, y: 58 },
    { x: 93, y: 67 },
  ];

  run.currentEncounter.enemies.forEach((e, idx) => {
    const uid = `${e.id}_${idx}`;
    const pt = enemySlots[idx % enemySlots.length];
    unitPositions[uid] = { x: pt.x, y: pt.y, homeX: pt.x, homeY: pt.y };
  });
}

function getUnitElement(id) {
  return (
    app.querySelector(`[data-hero="${id}"]`) ||
    app.querySelector(`[data-enemy="${id}"]`) ||
    app.querySelector(`[data-enemy^="${id}"]`)
  );
}

function setUnitCoord(id, x, y, durationMs = 400) {
  const el = getUnitElement(id);
  if (!el) return;

  if (unitPositions[id]) {
    unitPositions[id].x = x;
    unitPositions[id].y = y;
  }

  el.style.setProperty('--move-duration', `${durationMs / 1000 / playbackSpeed}s`);
  el.style.setProperty('--x', `${x}%`);
  el.style.setProperty('--y', `${y}%`);
  el.style.setProperty('--y-int', `${Math.round(y)}`);
}

function dashUnitTo(id, targetX, targetY, durationMs = 200, onArrive = null) {
  const el = getUnitElement(id);
  if (!el) {
    onArrive?.();
    return;
  }

  el.classList.add('is-dashing');
  setUnitCoord(id, targetX, targetY, durationMs);

  setTimeout(() => {
    el.classList.remove('is-dashing');
    onArrive?.();
  }, durationMs / playbackSpeed);
}

function advanceToClash() {
  const frontHeroId = run.build.formation[0];
  if (frontHeroId && unitPositions[frontHeroId]) {
    unitPositions[frontHeroId].homeX = 43;
    setUnitCoord(frontHeroId, 43, 64, 600);
    pulseMotion(frontHeroId, 'lunge', 600);
  }

  run.currentEncounter.enemies.forEach((e, idx) => {
    const uid = `${e.id}_${idx}`;
    if (idx === 0) {
      if (unitPositions[uid]) unitPositions[uid].homeX = 56;
      setUnitCoord(uid, 56, 64, 600);
      pulseMotion(uid, 'lunge', 600);
    } else if (idx === 1) {
      if (unitPositions[uid]) unitPositions[uid].homeX = 67;
      setUnitCoord(uid, 67, 70, 700);
    } else {
      if (unitPositions[uid]) unitPositions[uid].homeX = 77;
      setUnitCoord(uid, 77, 58, 750);
    }
  });
}

function leapStrike(attackerId, targetId, durationMs = 520, onImpact = null) {
  const attackerPos = unitPositions[attackerId] || { x: 50, y: 60, homeX: 50, homeY: 60 };
  const targetPos = unitPositions[targetId] || { x: 50, y: 60 };

  const isAttackerAlly = !attackerId.includes('_');
  const strikeX = isAttackerAlly ? targetPos.x - 7.5 : targetPos.x + 7.5;
  const strikeY = targetPos.y;

  pulseMotion(attackerId, 'lunge', durationMs);
  dashUnitTo(attackerId, strikeX, strikeY, Math.round(durationMs * 0.38), () => {
    onImpact?.();

    const kbX = isAttackerAlly ? targetPos.x + 3.5 : targetPos.x - 3.5;
    setUnitCoord(targetId, kbX, targetPos.y, 140);
    setTimeout(() => {
      setUnitCoord(targetId, targetPos.x, targetPos.y, 220);
    }, 180 / playbackSpeed);

    setTimeout(() => {
      dashUnitTo(attackerId, attackerPos.homeX, attackerPos.homeY, Math.round(durationMs * 0.45));
    }, 120 / playbackSpeed);
  });
}

function interceptSprint(guardianId, protectedId, attackerId, durationMs = 1100, onImpact = null) {
  const protectedPos = unitPositions[protectedId] || { x: 17, y: 62 };
  const guardianPos = unitPositions[guardianId] || { x: 43, y: 64, homeX: 43, homeY: 64 };

  const interceptX = protectedPos.x + 6.5;
  const interceptY = protectedPos.y + 1;

  pulseMotion(guardianId, 'intercept', durationMs);
  dashUnitTo(guardianId, interceptX, interceptY, Math.round(durationMs * 0.26), () => {
    onImpact?.();

    setTimeout(() => {
      dashUnitTo(guardianId, guardianPos.homeX, guardianPos.homeY, Math.round(durationMs * 0.4));
    }, 550 / playbackSpeed);
  });
}

function supportDash(healerId, targetId, durationMs = 900, onCast = null) {
  const healerPos = unitPositions[healerId] || { x: 27, y: 70, homeX: 27, homeY: 70 };
  const targetPos = unitPositions[targetId] || { x: 40, y: 64 };

  const castX = targetPos.x - 5.5;
  const castY = targetPos.y + 3;

  pulseMotion(healerId, 'heal', durationMs);
  dashUnitTo(healerId, castX, castY, Math.round(durationMs * 0.3), () => {
    onCast?.();
    setTimeout(() => {
      dashUnitTo(healerId, healerPos.homeX, healerPos.homeY, Math.round(durationMs * 0.42));
    }, 350 / playbackSpeed);
  });
}

function blastKnockbackAllEnemies(distanceX = 14, durationMs = 600) {
  run.currentEncounter.enemies.forEach((e, idx) => {
    const uid = `${e.id}_${idx}`;
    const pos = unitPositions[uid];
    if (pos) {
      const kbX = Math.min(94, pos.x + distanceX);
      setUnitCoord(uid, kbX, pos.y, durationMs);
      pos.homeX = Math.min(90, pos.homeX + distanceX * 0.6);
    }
  });
}

function victoryAdvance() {
  run.build.formation.forEach((heroId) => {
    const pos = unitPositions[heroId];
    if (pos && run.heroes[heroId]?.hp > 0) {
      pulseMotion(heroId, 'lunge', 1600);
      setUnitCoord(heroId, pos.x + 35, pos.y, 1600);
    }
  });
}

function startAutonomousBattle() {
  viewMode = 'battle';
  combatLogs = [];
  activeEnemyAtlases = {};
  initBattlefieldPositions();
  const { simulation } = run.commit();

  render();

  battleDirector = new BattleDirector({
    events: simulation.events,
    speed: playbackSpeed,
    callbacks: {
      onBattleStart: () => {
        pushLog('전투 개시 · 생태계 자동 반응 활성화');
        heroBark('vael', BATTLE_BARKS.vael.guard, 800);
        advanceToClash();
        battleBeat('beat-warning', 600);
      },
      onEdictTrigger: (e) => {
        pushLog(`명령 발동: ${e.title}`);
        combatCallout(e.title, 'guard', 800);
      },
      onEnemyIntentLock: (e) => {
        pushLog(`${e.name}이(가) ${e.targetHeroName}을(를) 조준합니다 (${e.intent})`, true);
        const pos = unitPositions[e.enemyId];
        if (pos) {
          setUnitCoord(e.enemyId, pos.x + 2, pos.y - 1, 300);
        }
        pulseSelector(`[data-enemy="${e.enemyId}"]`, 'motion-windup', 800);
        pulseSelector(`.ally.${e.targetHeroId}`, 'danger-lock', 800);
        battleBeat('beat-warning', 700);
        combatCallout(e.intent, 'danger', 600);
      },
      onDamage: (e) => {
        leapStrike(e.attackerId, e.targetHeroId, 520, () => {
          hitStop(110);
          battleBeat('impact-beat', 400);
          pulseMotion(e.targetHeroId, 'hit', 500);
          app.querySelector('.hit-fx')?.classList.add('play');
          pulseSelector('.combat-impact-flash', 'play', 300);
          setHeroHp(e.targetHeroId, e.currentHp, '피격');
          spawnFloatingText(`.ally.${e.targetHeroId}`, `-${e.damage}`, 'damage');
          pushLog(`${e.targetHeroName}이(가) ${e.attackerName}의 공격을 받았습니다 (-${e.damage})`, true);
        });
      },
      onIntercept: (e) => {
        interceptSprint('vael', 'seris', e.attackerId, 1100, () => {
          hitStop(130);
          pulseMotion('seris', 'steady', 800);
          app.querySelector('.shield-fx')?.classList.add('play');
          battleBeat('guard-impact-beat', 800);
          combatCallout('INTERCEPT', 'guard', 750);
          setHeroHp('vael', e.vaelHp, '가로막기');
          spawnFloatingText('.ally.vael', `가로막기 -${e.damageTaken}`, 'intercept');
          pushLog(`베일이 끼어들어 세리스를 지켜냈습니다! (피해 -${e.damageTaken})`);
          heroBark('vael', BATTLE_BARKS.vael.intercept, 850);
          heroBark('seris', BATTLE_BARKS.seris.protected, 900);
        });
      },
      onHeal: (e) => {
        supportDash('mirel', e.target, 950, () => {
          const targetEl = app.querySelector('.ally.' + e.target);
          if (targetEl) {
            targetEl.classList.add('healing-target');
            setTimeout(() => targetEl.classList.remove('healing-target'), 1000 / playbackSpeed);
          }
          app.querySelector('.heal-fx')?.classList.add('play');
          battleBeat('heal-wave-beat', 900);
          combatCallout(`꽃맥박 → ${e.targetName}`, 'heal', 750);
          setHeroHp(e.target, e.currentHp, '치유됨');
          spawnFloatingText(`.ally.${e.target}`, `+${e.amount} HP`, 'heal');
          pushLog(`미렐이 가장 위급한 ${e.targetName}을(를) 치유했습니다 (+${e.amount})`);
          heroBark('mirel', BATTLE_BARKS.mirel.heal, 800);
        });
      },
      onBarrier: () => {
        combatCallout('철화 방벽', 'guard', 600);
        spawnFloatingText('.ally.vael', '방벽 +25', 'barrier');
        pushLog('철화 방벽 생성 (+25)');
      },
      onResonanceEmergency: () => {
        combatCallout('철화의 맹세!', 'heal', 900);
        app.querySelector('.resonance-pair-line')?.classList.add('triggered');
        spawnFloatingText('.ally.vael', '긴급 공명!', 'intercept');
        pushLog('공명 발동: 철화의 맹세 (긴급 회복 & 방벽)');
      },
      onChannelStart: () => {
        const pos = unitPositions['seris'];
        if (pos) {
          setUnitCoord('seris', pos.x, pos.y - 8, 1200);
        }
        pulseMotion('seris', 'channel', 1800);
        battleBeat('ritual-charge-beat', 1800);
        setHeroHp('seris', run.heroes.seris.hp, '월광 집중');
        combatCallout('월광 의식', 'moon', 800);
        pushLog('세리스가 월광 의식을 집중합니다.');
        heroBark('seris', BATTLE_BARKS.seris.channel, 900);
      },
      onChannelInterrupt: () => {
        const pos = unitPositions['seris'];
        if (pos) {
          setUnitCoord('seris', pos.homeX, pos.homeY, 300);
        }
        pulseMotion('seris', 'danger', 800);
        combatCallout('의식 붕괴!', 'danger', 700);
        spawnFloatingText('.ally.seris', '의식 붕괴!', 'damage');
        pushLog('세리스의 월광 의식이 직접 타격으로 끊겼습니다!', true);
      },
      onMoonlightBurst: (e) => {
        hitStop(160);
        pulseMotion('seris', 'burst', 1200);
        app.querySelector('.moon-fx')?.classList.add('play');
        battleBeat('moon-burst-beat', 1100);
        combatCallout('월광 폭발!', 'moon', 900);
        spawnFloatingText('.ally.seris', '월광 폭발!', 'burst');
        pushLog('세리스의 월광 폭발이 적 진형 전체를 강타했습니다!');
        heroBark('seris', BATTLE_BARKS.seris.burst, 850);

        blastKnockbackAllEnemies(14, 600);

        const pos = unitPositions['seris'];
        if (pos) {
          setTimeout(() => setUnitCoord('seris', pos.homeX, pos.homeY, 800), 400 / playbackSpeed);
        }

        e.hits.forEach((h) => {
          const maxHp = ENEMIES_DATA[h.enemyId.split('_')[0]]?.maxHp || 100;
          setEnemyHp(h.enemyId, h.remainingHp, maxHp);
          if (activeEnemyAtlases[h.enemyId]) {
            activeEnemyAtlases[h.enemyId].play('hit');
          } else {
            const enemyType = h.enemyId.split('_')[0];
            if (enemyAtlases[enemyType]) enemyAtlases[enemyType].play('hit');
          }
          pulseSelector(`[data-enemy="${h.enemyId}"]`, 'motion-stagger', 800);
          spawnFloatingText(`[data-enemy="${h.enemyId}"]`, `-${h.damage}`, 'burst');
        });
      },
      onEnemyDown: (e) => {
        const el = app.querySelector(`[data-enemy="${e.enemyId}"]`);
        if (el) el.classList.add('dead');
        if (activeEnemyAtlases[e.enemyId]) {
          activeEnemyAtlases[e.enemyId].play('down');
        } else {
          const enemyType = e.enemyId.split('_')[0];
          if (enemyAtlases[enemyType]) enemyAtlases[enemyType].play('down');
        }
        pushLog(`${e.name}이(가) 쓰러졌습니다.`);
      },
      onHeroDown: (e) => {
        pulseMotion(e.heroId, 'hit', 1000);
        if (heroAtlases[e.heroId]) heroAtlases[e.heroId].play('down');
        setHeroHp(e.heroId, 0, '쓰러짐');
        combatCallout(`${e.name} 쓰러짐!`, 'danger', 900);
        pushLog(`${e.name}이(가) 쓰러졌습니다!`, true);
      },
      onBattleEnd: (e) => {
        battleBeat('victory-beat', 1000);
        combatCallout(e.winner === 'ally' ? '전투 승리' : '방어선 붕괴', e.winner === 'ally' ? 'victory' : 'danger', 1000);
        pushLog(`전투 종료: ${e.reason}`);
        if (e.winner === 'ally') {
          setTimeout(() => victoryAdvance(), 600 / playbackSpeed);
        }
      },
    },
  });

  battleDirector.play(() => {
    run.completeBattle();
    render();
  });
}

function bindEvents() {
  // Bind live SpriteAtlas canvases in Arena
  app.querySelectorAll('[data-atlas-hero]').forEach((canvas) => {
    const id = canvas.dataset.atlasHero;
    if (heroAtlases[id]) heroAtlases[id].bindCanvas(canvas);
  });

  // Bind live SpriteAtlas canvases for Enemies with independent instancing
  app.querySelectorAll('[data-atlas-enemy-uid]').forEach((canvas) => {
    const uid = canvas.dataset.atlasEnemyUid;
    const type = canvas.dataset.enemyType;
    if (!activeEnemyAtlases[uid] && enemyAtlases[type]) {
      activeEnemyAtlases[uid] = enemyAtlases[type].createInstance({
        breathPhase: Math.random() * Math.PI * 2,
      });
    }
    if (activeEnemyAtlases[uid]) {
      activeEnemyAtlases[uid].bindCanvas(canvas);
    }
  });

  app.querySelectorAll('[data-atlas-enemy]:not([data-atlas-enemy-uid])').forEach((canvas) => {
    const id = canvas.dataset.atlasEnemy;
    if (enemyAtlases[id]) enemyAtlases[id].bindCanvas(canvas);
  });

  // Navigation in Camp (Matching Image 2)
  app.querySelectorAll('[data-nav]').forEach((el) => {
    el.addEventListener('click', () => {
      const nav = el.dataset.nav;
      if (nav === 'camp') {
        activeDrawer = null;
      } else {
        activeDrawer = activeDrawer === nav ? null : nav;
      }
      render();
    });
  });

  app.querySelector('#btnCloseDrawer')?.addEventListener('click', () => {
    activeDrawer = null;
    render();
  });

  // Launch Battle from Camp
  app.querySelector('#btnLaunchBattle')?.addEventListener('click', () => {
    startAutonomousBattle();
  });

  // Formation selection in drawer
  app.querySelectorAll('[data-heroselect]').forEach((el) => {
    el.addEventListener('click', () => {
      const id = el.dataset.heroselect;
      selectedHeroId = selectedHeroId === id ? null : id;
      render();
    });
  });

  app.querySelectorAll('[data-lane]').forEach((el) => {
    el.addEventListener('click', () => {
      if (!selectedHeroId) return;
      const targetSlot = Number(el.dataset.lane);
      const currentSlot = run.build.formation.indexOf(selectedHeroId);
      if (currentSlot !== -1 && currentSlot !== targetSlot) {
        run.swapPositions(currentSlot, targetSlot);
      }
      selectedHeroId = null;
      render();
    });
  });

  // Tactics selection
  app.querySelectorAll('[data-bond]').forEach((el) => {
    el.addEventListener('click', () => {
      run.setBond(el.dataset.bond);
      render();
    });
  });

  app.querySelectorAll('[data-edict]').forEach((el) => {
    el.addEventListener('click', () => {
      run.setEdict(el.dataset.edict);
      render();
    });
  });

  // Debrief & Adapt
  app.querySelector('#btnGoAdaptFromBattle')?.addEventListener('click', () => {
    run.goToAdaptation();
    render();
  });

  app.querySelectorAll('[data-adapt]').forEach((el) => {
    el.addEventListener('click', () => {
      run.applyAdaptation(el.dataset.adapt);
      viewMode = 'camp';
      activeDrawer = null;
      render();
    });
  });

  // Return to Camp
  app.querySelector('#btnReturnCamp')?.addEventListener('click', () => {
    if (battleDirector) battleDirector.stop();
    viewMode = 'camp';
    activeDrawer = null;
    render();
  });

  // Battle Speed
  app.querySelector('#btnSpeed')?.addEventListener('click', () => {
    playbackSpeed = playbackSpeed === 1 ? 2 : 1;
    if (battleDirector) battleDirector.setSpeed(playbackSpeed);
    const speedBtn = app.querySelector('#btnSpeed');
    if (speedBtn) speedBtn.textContent = '배속 ×' + playbackSpeed;
  });
}

// Initial render
render();

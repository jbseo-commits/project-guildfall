import { ENCOUNTERS_DATA, createJourneyEncounter } from '../data/encounters.js';
import { HEROES_DATA } from '../data/heroes.js';
import { CombatEngine } from '../engine/CombatEngine.js';
import { CausalDebrief } from '../engine/CausalDebrief.js';

export class RunManager {
  constructor(seed = 1007) {
    this.seed = seed;
    this.day = 1;
    this.nodeIndex = 0;
    this.phase = 'read'; // read -> plan -> commit -> watch -> debrief -> adapt -> read

    // Inhabitants' state (Persistent organs across the journey)
    this.heroes = {
      vael: { ...HEROES_DATA.vael, hp: HEROES_DATA.vael.maxHp },
      seris: { ...HEROES_DATA.seris, hp: HEROES_DATA.seris.maxHp },
      mirel: { ...HEROES_DATA.mirel, hp: HEROES_DATA.mirel.maxHp },
    };

    // Current Player Build
    this.build = {
      formation: ['vael', 'mirel', 'seris'], // front, core, rear
      bond: 'vael_seris',
      edict: 'shell',
    };

    // Unlocks / Inventory of tactics
    this.unlockedBonds = ['vael_seris', 'vael_mirel', 'seris_mirel'];
    this.unlockedEdicts = ['shell', 'moon', 'roots'];

    // Route chapters
    this.tutorialEncounters = ['formation_test', 'bond_test', 'edict_test', 'exam'];

    this.currentEncounter = this.loadEncounter();
    this.lastSimulation = null;
    this.lastDebrief = null;
    this.subscribers = new Set();
  }

  subscribe(listener) {
    this.subscribers.add(listener);
    return () => this.subscribers.delete(listener);
  }

  notify() {
    this.subscribers.forEach((fn) => fn(this));
  }

  loadEncounter() {
    if (this.day === 1 && this.nodeIndex < this.tutorialEncounters.length) {
      const key = this.tutorialEncounters[this.nodeIndex];
      return ENCOUNTERS_DATA[key] ?? ENCOUNTERS_DATA.exam;
    }
    return createJourneyEncounter(this.day, this.nodeIndex, this.seed);
  }

  setPhase(newPhase) {
    this.phase = newPhase;
    this.notify();
  }

  setFormation(newFormation) {
    this.build.formation = [...newFormation];
    this.notify();
  }

  swapPositions(indexA, indexB) {
    const temp = this.build.formation[indexA];
    this.build.formation[indexA] = this.build.formation[indexB];
    this.build.formation[indexB] = temp;
    this.notify();
  }

  setBond(bondId) {
    this.build.bond = this.build.bond === bondId ? null : bondId;
    this.notify();
  }

  setEdict(edictId) {
    this.build.edict = this.build.edict === edictId ? null : edictId;
    this.notify();
  }

  /**
   * Run the deterministic simulation on COMMIT
   */
  commit() {
    this.phase = 'watch';

    const setup = {
      seed: this.seed + this.day * 100 + this.nodeIndex,
      formation: this.build.formation,
      bond: this.build.bond,
      edict: this.build.edict,
      encounterId: this.currentEncounter.id,
      enemies: this.currentEncounter.enemies,
      heroState: this.heroes,
    };

    const engine = new CombatEngine(setup);
    this.lastSimulation = engine.run();
    this.lastDebrief = CausalDebrief.analyze(this.lastSimulation, setup);

    // Update persistent hero HPs from simulation result
    Object.entries(this.lastSimulation.finalAllies).forEach(([id, finalHero]) => {
      if (this.heroes[id]) {
        this.heroes[id].hp = Math.max(0, finalHero.hp);
        this.heroes[id].downed = finalHero.downed;
      }
    });

    this.notify();
    return {
      simulation: this.lastSimulation,
      debrief: this.lastDebrief,
    };
  }

  completeBattle() {
    this.phase = 'debrief';
    this.notify();
  }

  goToAdaptation() {
    this.phase = 'adapt';
    this.notify();
  }

  /**
   * Apply post-battle adaptation choice
   */
  applyAdaptation(type) {
    if (type === 'heal') {
      // Living Sanctuary restores its wounded organs
      Object.values(this.heroes).forEach((h) => {
        h.hp = Math.min(h.maxHp, h.hp + Math.round(h.maxHp * 0.40));
        h.downed = false;
      });
    } else if (type === 'bond_reinforce') {
      // Reinforce active bond with persistent resonance surge
      this.bondBonus = (this.bondBonus || 0) + 0.25;
    } else if (type === 'edict_attune') {
      // Unlock all edicts if not unlocked or grants barrier surge
      this.unlockedEdicts = ['shell', 'moon', 'roots'];
      this.edictBonus = (this.edictBonus || 0) + 0.15;
    }

    this.advanceNode();
  }

  /**
   * Dynamic dialogue generator for Camp Screen based on organ state,
   * previous battle causal events, and upcoming threat.
   */
  getCampDialogues() {
    const enc = this.currentEncounter;
    const hVael = this.heroes.vael;
    const hSeris = this.heroes.seris;
    const hMirel = this.heroes.mirel;

    // Default canonical opening (matching user mockup Image 2)
    if (this.day === 1 && this.nodeIndex === 0 && !this.lastDebrief) {
      return {
        vael: '이번에는 내가 앞을 맡을게.\n너희는 뒤에서 준비해.',
        seris: '좋아. 이번엔 월광을 끝까지\n완성해 볼게.',
        mirel: '..이 꽃, 다시 피울 수 있을까?',
      };
    }

    let vaelQuote = '';
    let serisQuote = '';
    let mirelQuote = '';

    // Vael dialogue (Frontliner organ)
    if (hVael.hp <= 0) {
      vaelQuote = '…방패를 들 힘조차 남지 않았어.\n잠시 숨을 돌리게 해줘.';
    } else if (hVael.hp < hVael.maxHp * 0.45) {
      vaelQuote = '외피에 금이 가기 시작했어.\n다음엔 미렐의 치유를 가까이 둬줘.';
    } else if (enc.id === 'bond_test') {
      vaelQuote = '적의 창기병과 저격수가 보여.\n세리스, 내 뒤에서 한 발짝도 떨어지지 마.';
    } else if (enc.id === 'exam' || enc.title?.includes('보스') || enc.title?.includes('시험')) {
      vaelQuote = '거대한 적이다. 선두에서 내가\n충격을 흡수할 테니 호흡을 맞춰줘.';
    } else {
      vaelQuote = '외피는 견고해. 어떤 위협이든\n내가 선두에서 길을 열겠다.';
    }

    // Seris dialogue (Ritual organ)
    if (hSeris.hp <= 0) {
      serisQuote = '…달빛이 흩어졌어.\n의식을 이어갈 수 없어…';
    } else if (this.lastDebrief?.metrics?.serisInterrupted) {
      serisQuote = '의식이 도중에 끊겼을 때 정말 아찔했어.\n다음엔 전열에서 조금만 더 버텨줘.';
    } else if (this.lastDebrief?.metrics?.serisRitualCompleted) {
      serisQuote = '월광이 차올랐어. 너희가 시간을 벌어준\n덕분이야. 다음에도 호흡을 맞추자.';
    } else if (enc.id === 'edict_test') {
      serisQuote = '사방에서 몰려오는 기운이야.\n단 하나의 명확한 원칙(명령)이 필요해.';
    } else {
      serisQuote = '달의 궤적이 선명해.\n이번 교전에서도 집중해 볼게.';
    }

    // Mirel dialogue (Healer organ)
    if (hMirel.hp <= 0) {
      mirelQuote = '…꽃잎이 다 시들어버렸어…\n더는 감싸주지 못해서 죄송해요…';
    } else if (hMirel.hp < hMirel.maxHp * 0.5) {
      mirelQuote = '뿌리가 깊은 상처를 입었어요…\n모두를 지키려면 제게도 쉼이 필요해요.';
    } else if (this.lastDebrief?.metrics?.emergencyHealFired) {
      mirelQuote = '위급한 순간에 꽃맥박이 닿아 다행이에요.\n카라반의 생명줄은 놓지 않을게요.';
    } else {
      mirelQuote = '숲의 호흡이 느껴져요.\n상처 입은 동료가 생기면 곧장 피워낼게요.';
    }

    return { vael: vaelQuote, seris: serisQuote, mirel: mirelQuote };
  }

  advanceNode() {
    this.nodeIndex++;
    if (this.nodeIndex >= 4) {
      this.nodeIndex = 0;
      this.day++;
    }

    this.currentEncounter = this.loadEncounter();
    this.phase = 'read';
    this.notify();
  }

  resetRun() {
    this.day = 1;
    this.nodeIndex = 0;
    this.phase = 'read';
    Object.values(this.heroes).forEach((h) => {
      h.hp = h.maxHp;
      h.downed = false;
    });
    this.currentEncounter = this.loadEncounter();
    this.notify();
  }
}

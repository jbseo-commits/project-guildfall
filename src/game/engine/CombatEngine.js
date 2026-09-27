import { HEROES_DATA } from '../data/heroes.js';
import { ENEMIES_DATA } from '../data/enemies.js';
import { POSITIONS_DATA, BONDS_DATA, EDICTS_DATA } from '../data/rules.js';

/**
 * Deterministic pseudo-random number generator (Mulberry32)
 */
function createRng(seed = 12345) {
  let s = typeof seed === 'number' ? seed : hashString(String(seed));
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return hash;
}

export class CombatEngine {
  constructor(setup) {
    this.seed = setup.seed ?? 42;
    this.rng = createRng(this.seed);
    this.dt = 0.05; // 20 simulation ticks per second
    this.time = 0;
    this.maxDuration = 15.0;

    this.formation = setup.formation ?? ['vael', 'mirel', 'seris']; // [front, core, rear]
    this.bondId = setup.bond ?? null;
    this.edictId = setup.edict ?? null;
    this.encounterId = setup.encounterId ?? 'standard';

    this.bond = this.bondId ? BONDS_DATA[this.bondId] : null;
    this.edict = this.edictId ? EDICTS_DATA[this.edictId] : null;

    // Initialize allies
    this.allies = {};
    const slots = ['front', 'core', 'rear'];
    this.formation.forEach((heroId, index) => {
      const base = HEROES_DATA[heroId] ?? HEROES_DATA.vael;
      const initialHp = setup.heroState && setup.heroState[heroId] ? setup.heroState[heroId].hp : base.maxHp;
      const slotId = slots[index];
      const slotDef = POSITIONS_DATA[slotId];

      this.allies[heroId] = {
        ...base,
        slot: slotId,
        slotIndex: index,
        slotDef,
        hp: Math.max(1, Math.min(base.maxHp, initialHp)),
        shield: 0,
        downed: false,
        state: 'idle', // idle, windup, acting, channeling, recovering, downed
        stateTimer: 0,
        cooldown: (heroId === 'mirel' ? 0.8 : 0.4),
        channelProgress: 0,
        channelMax: heroId === 'seris' ? base.channelDuration : 0,
        modifiers: [],
      };
    });

    // Initialize enemies
    this.enemies = {};
    const enemyList = setup.enemies ?? [{ id: 'breaker', slot: 'front' }];
    enemyList.forEach((eConf, idx) => {
      const eBase = ENEMIES_DATA[eConf.id] ?? ENEMIES_DATA.breaker;
      const uid = `${eConf.id}_${idx}`;
      this.enemies[uid] = {
        ...eBase,
        uid,
        slot: eConf.slot ?? 'front',
        hp: eBase.maxHp,
        shield: 0,
        downed: false,
        state: 'idle',
        stateTimer: 0,
        cooldown: (0.4 + idx * 0.3),
        target: null,
      };
    });

    // Event stream
    this.events = [];
    this.eventCounter = 0;

    // Metrics for causal analysis
    this.metrics = {
      interceptCount: 0,
      interceptDamageAbsorbed: 0,
      totalDamageDealt: 0,
      totalDamageTaken: 0,
      totalHealingDone: 0,
      serisRitualCompleted: false,
      serisInterrupted: false,
      firstFrontCollapseTime: null,
      emergencyHealFired: false,
      moonlightBloomFired: false,
    };

    // Apply Edict initial rules
    this.applyInitialEdicts();
  }

  emit(type, data) {
    this.eventCounter++;
    const event = {
      id: this.eventCounter,
      time: Math.round(this.time * 100) / 100,
      type,
      ...data,
    };
    this.events.push(event);
    return event;
  }

  applyInitialEdicts() {
    if (this.edictId === 'moon') {
      const seris = this.allies.seris;
      if (seris) {
        seris.state = 'channeling';
        seris.stateTimer = 0;
        this.emit('edict_trigger', {
          edict: 'moon',
          title: '달을 끝까지 띄워',
          desc: '세리스가 전투 개시 즉시 월광 의식을 시작합니다.',
        });
      }
    } else if (this.edictId === 'shell') {
      this.emit('edict_trigger', {
        edict: 'shell',
        title: '껍질을 닫아',
        desc: '카라반 외피가 굳어 초반 3.5초 동안 받는 피해가 25% 경감됩니다.',
      });
    } else if (this.edictId === 'roots') {
      this.emit('edict_trigger', {
        edict: 'roots',
        title: '뿌리를 깊게',
        desc: '미렐의 감지망이 넓어져 동료의 상처를 조기에 선제 치유합니다.',
      });
    }
  }

  getAliveAllies() {
    return Object.values(this.allies).filter((a) => !a.downed);
  }

  getAliveEnemies() {
    return Object.values(this.enemies).filter((e) => !e.downed);
  }

  getAllyAtSlot(slot) {
    return Object.values(this.allies).find((a) => a.slot === slot && !a.downed) ?? null;
  }

  /**
   * Run the complete simulation to completion and return result
   */
  run() {
    this.emit('battle_start', {
      formation: this.formation,
      bond: this.bondId,
      edict: this.edictId,
      allyCount: Object.keys(this.allies).length,
      enemyCount: Object.keys(this.enemies).length,
    });

    while (this.time < this.maxDuration) {
      this.step();

      // Check termination conditions
      const aliveAllies = this.getAliveAllies();
      const aliveEnemies = this.getAliveEnemies();

      if (aliveEnemies.length === 0) {
        this.emit('battle_end', {
          winner: 'ally',
          reason: '모든 적을 무력화했습니다.',
          duration: this.time,
        });
        break;
      }

      if (aliveAllies.length === 0) {
        this.emit('battle_end', {
          winner: 'enemy',
          reason: '카라반의 동료들이 모두 쓰러졌습니다.',
          duration: this.time,
        });
        break;
      }

      this.time += this.dt;
    }

    if (this.time >= this.maxDuration) {
      const allyHpSum = this.getAliveAllies().reduce((sum, a) => sum + a.hp, 0);
      const enemyHpSum = this.getAliveEnemies().reduce((sum, e) => sum + e.hp, 0);
      const winner = allyHpSum >= enemyHpSum ? 'ally' : 'enemy';
      this.emit('battle_end', {
        winner,
        reason: '시간 경과에 따라 우세 판정으로 종료되었습니다.',
        duration: this.time,
      });
    }

    return {
      winner: this.events.find((e) => e.type === 'battle_end')?.winner ?? 'ally',
      duration: Math.round(this.time * 10) / 10,
      events: this.events,
      metrics: this.metrics,
      finalAllies: Object.fromEntries(Object.entries(this.allies).map(([k, v]) => [k, { ...v }])),
      finalEnemies: Object.fromEntries(Object.entries(this.enemies).map(([k, v]) => [k, { ...v }])),
    };
  }

  /**
   * Single simulation tick
   */
  step() {
    this.updateAllies();
    this.updateEnemies();
  }

  updateAllies() {
    const aliveAllies = this.getAliveAllies();

    aliveAllies.forEach((hero) => {
      // 1. Seris - Moonlight Ritual Channeling
      if (hero.id === 'seris') {
        this.updateSeris(hero);
      }
      // 2. Mirel - Flower Pulse Healing
      else if (hero.id === 'mirel') {
        this.updateMirel(hero);
      }
      // 3. Vael - Guardian Stance & Intercept Readiness
      else if (hero.id === 'vael') {
        this.updateVael(hero);
      }
    });
  }

  updateSeris(seris) {
    if (seris.downed) return;

    if (seris.state === 'idle') {
      seris.cooldown -= this.dt;
      if (seris.cooldown <= 0) {
        seris.state = 'channeling';
        seris.stateTimer = 0;
        let totalDuration = seris.channelDuration;

        // Position bonus: VEIL grants 30% cast speed bonus
        if (seris.slot === 'rear') {
          totalDuration *= 0.70;
        }
        // Bond: seris_mirel reduces channel time by 35%
        if (this.bondId === 'seris_mirel') {
          totalDuration *= (1 - BONDS_DATA.seris_mirel.channelReduction);
          this.metrics.moonlightBloomFired = true;
        }

        seris.channelMax = totalDuration;
        seris.channelProgress = 0;

        this.emit('channel_start', {
          heroId: 'seris',
          name: seris.name,
          duration: totalDuration,
          desc: '세리스가 월광 의식을 집중합니다.',
        });
      }
    } else if (seris.state === 'channeling') {
      seris.channelProgress += this.dt;

      if (seris.channelProgress >= seris.channelMax) {
        // Complete Moonlight Ritual!
        seris.state = 'burst';
        seris.stateTimer = 0;
        this.executeMoonlightBurst(seris);
      }
    } else if (seris.state === 'burst' || seris.state === 'recovering') {
      seris.stateTimer += this.dt;
      if (seris.stateTimer >= 1.2) {
        seris.state = 'idle';
        seris.cooldown = 2.0;
      }
    }
  }

  executeMoonlightBurst(seris) {
    let damage = seris.burstDamage;

    if (this.edictId === 'moon') {
      damage *= (1 + EDICTS_DATA.moon.burstBonus);
    }
    if (this.bondId === 'seris_mirel') {
      damage *= BONDS_DATA.seris_mirel.damageMultiplier;
    }

    const aliveEnemies = this.getAliveEnemies();
    const hits = [];

    aliveEnemies.forEach((enemy) => {
      const finalDmg = Math.round(damage * (1 - enemy.armor / (enemy.armor + 100)));
      enemy.hp = Math.max(0, enemy.hp - finalDmg);
      hits.push({ enemyId: enemy.uid, name: enemy.name, damage: finalDmg, remainingHp: enemy.hp });

      if (enemy.hp <= 0) {
        enemy.downed = true;
        this.emit('enemy_down', {
          enemyId: enemy.uid,
          name: enemy.name,
          killedBy: 'seris',
          reason: '월광 폭발',
        });
      }
    });

    this.metrics.serisRitualCompleted = true;
    this.metrics.totalDamageDealt += hits.reduce((s, h) => s + h.damage, 0);

    this.emit('moonlight_burst', {
      heroId: 'seris',
      name: seris.name,
      baseDamage: damage,
      hits,
      desc: '세리스의 월광 의식이 완성되어 적 진형 전체를 강타했습니다!',
    });

    seris.state = 'recovering';
    seris.stateTimer = 0;
  }

  updateMirel(mirel) {
    if (mirel.downed) return;

    mirel.cooldown -= this.dt;

    if (mirel.cooldown <= 0 && mirel.state === 'idle') {
      // Find the most injured ally
      const aliveAllies = this.getAliveAllies();
      const threshold = this.edictId === 'roots' ? EDICTS_DATA.roots.healThreshold : 0.85;

      const injured = aliveAllies
        .filter((a) => a.hp < a.maxHp * threshold)
        .sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp))[0];

      if (injured) {
        mirel.state = 'acting';
        mirel.stateTimer = 0;

        let amount = mirel.healPower;
        // Position bonus: CORE grants 25% healing bonus
        if (mirel.slot === 'core') {
          amount = Math.round(amount * 1.25);
        }

        const healedAmount = Math.min(injured.maxHp - injured.hp, amount);
        injured.hp += healedAmount;
        this.metrics.totalHealingDone += healedAmount;

        this.emit('heal', {
          source: 'mirel',
          target: injured.id,
          targetName: injured.name,
          amount: healedAmount,
          currentHp: injured.hp,
          maxHp: injured.maxHp,
          desc: `미렐이 가장 위급한 ${injured.name}에게 꽃맥박을 주입했습니다. (+${healedAmount})`,
        });

        // If healing Vael and bond is vael_mirel
        if (injured.id === 'vael' && this.bondId === 'vael_mirel') {
          injured.shield = (injured.shield || 0) + BONDS_DATA.vael_mirel.barrier;
          this.emit('barrier', {
            target: 'vael',
            value: BONDS_DATA.vael_mirel.barrier,
            desc: '철화의 맹세 공명으로 베일에게 철화 방벽이 생성되었습니다.',
          });
        }

        // Recovery time
        const interval = this.edictId === 'roots'
          ? mirel.healInterval * (1 - EDICTS_DATA.roots.healHaste)
          : mirel.healInterval;
        mirel.cooldown = interval;
      } else {
        mirel.cooldown = 0.5; // check again shortly
      }
    }
  }

  updateVael(vael) {
    if (vael.downed) return;

    // Check emergency heal trigger for vael_mirel
    if (this.bondId === 'vael_mirel' && !this.metrics.emergencyHealFired) {
      if (vael.hp <= vael.maxHp * BONDS_DATA.vael_mirel.emergencyThreshold) {
        const mirel = this.allies.mirel;
        if (mirel && !mirel.downed) {
          this.metrics.emergencyHealFired = true;
          const healVal = BONDS_DATA.vael_mirel.emergencyHeal;
          vael.hp = Math.min(vael.maxHp, vael.hp + healVal);
          vael.shield += BONDS_DATA.vael_mirel.barrier;

          this.emit('resonance_emergency', {
            bond: 'vael_mirel',
            source: 'mirel',
            target: 'vael',
            heal: healVal,
            shield: BONDS_DATA.vael_mirel.barrier,
            desc: '철화의 맹세! 베일의 위기를 감지한 미렐이 긴급 꽃맥박과 철화 방벽을 부여했습니다.',
          });
        }
      }
    }
  }

  updateEnemies() {
    const aliveEnemies = this.getAliveEnemies();

    aliveEnemies.forEach((enemy) => {
      if (enemy.state === 'idle') {
        enemy.cooldown -= this.dt;
        if (enemy.cooldown <= 0) {
          // Choose target based on targeting rules
          const target = this.selectEnemyTarget(enemy);
          if (target) {
            enemy.target = target.id;
            enemy.state = 'windup';
            enemy.stateTimer = enemy.windupTime;

            this.emit('enemy_intent_lock', {
              enemyId: enemy.uid,
              name: enemy.name,
              targetHeroId: target.id,
              targetHeroName: target.name,
              targetSlot: target.slot,
              intent: enemy.intent,
              windupDuration: enemy.windupTime,
              desc: `${enemy.name}이(가) ${target.name}(${POSITIONS_DATA[target.slot].en})을(를) 향해 ${enemy.intent}을 준비합니다.`,
            });
          }
        }
      } else if (enemy.state === 'windup') {
        enemy.stateTimer -= this.dt;
        if (enemy.stateTimer <= 0) {
          this.resolveEnemyAttack(enemy);
        }
      } else if (enemy.state === 'recovering') {
        enemy.stateTimer -= this.dt;
        if (enemy.stateTimer <= 0) {
          enemy.state = 'idle';
          enemy.cooldown = enemy.attackInterval;
        }
      }
    });
  }

  selectEnemyTarget(enemy) {
    const aliveAllies = this.getAliveAllies();
    if (aliveAllies.length === 0) return null;

    if (enemy.targetRule === 'front') {
      const front = this.getAllyAtSlot('front');
      if (front) return front;
      const core = this.getAllyAtSlot('core');
      if (core) return core;
      return aliveAllies[0];
    }

    if (enemy.targetRule === 'rear') {
      const rear = this.getAllyAtSlot('rear');
      if (rear) return rear;
      // If rear empty or downed, check channeling seris
      const seris = this.allies.seris;
      if (seris && !seris.downed && seris.state === 'channeling') return seris;
      return aliveAllies[aliveAllies.length - 1];
    }

    if (enemy.targetRule === 'weakest' || enemy.targetRule === 'weakest_threshold') {
      return aliveAllies.slice().sort((a, b) => a.hp - b.hp)[0];
    }

    return aliveAllies[0];
  }

  resolveEnemyAttack(enemy) {
    let target = this.allies[enemy.target];
    if (!target || target.downed) {
      target = this.selectEnemyTarget(enemy);
      if (!target) return;
    }

    enemy.state = 'recovering';
    enemy.stateTimer = 0.6;

    let baseDamage = enemy.power;

    // Check Intercept: Bond vael_seris
    let intercepted = false;
    let interceptor = null;

    if (target.id === 'seris' && this.bondId === 'vael_seris') {
      const vael = this.allies.vael;
      if (vael && !vael.downed) {
        intercepted = true;
        interceptor = vael;
      }
    }

    // Calculate damage mitigation
    let actualRecipient = intercepted ? interceptor : target;
    let mitigation = actualRecipient.slotDef?.damageReduction ?? 0;

    // Shell Edict: 25% damage reduction in first 3.5s
    if (this.edictId === 'shell' && this.time <= EDICTS_DATA.shell.initialDuration) {
      mitigation += EDICTS_DATA.shell.damageReductionInitial;
    }

    // Intercept mitigation
    if (intercepted) {
      mitigation += BONDS_DATA.vael_seris.interceptMitigation;
    }

    // Armor formula
    const effectiveArmor = actualRecipient.armor * (1 - (enemy.id === 'breaker' ? 0.3 : 0));
    const armorMitigation = effectiveArmor / (effectiveArmor + 80);
    const totalMitigation = Math.min(0.85, mitigation + armorMitigation);

    let finalDamage = Math.max(8, Math.round(baseDamage * (1 - totalMitigation)));

    // Apply to shield first
    let shieldAbsorbed = 0;
    if (actualRecipient.shield > 0) {
      shieldAbsorbed = Math.min(actualRecipient.shield, finalDamage);
      actualRecipient.shield -= shieldAbsorbed;
      finalDamage -= shieldAbsorbed;
    }

    actualRecipient.hp = Math.max(0, actualRecipient.hp - finalDamage);
    this.metrics.totalDamageTaken += (finalDamage + shieldAbsorbed);

    if (intercepted) {
      this.metrics.interceptCount++;
      this.metrics.interceptDamageAbsorbed += (baseDamage - finalDamage);

      this.emit('intercept', {
        source: 'vael',
        attackerId: enemy.uid,
        attackerName: enemy.name,
        originalTarget: 'seris',
        originalTargetName: '세리스',
        damageTaken: finalDamage,
        shieldAbsorbed,
        vaelHp: actualRecipient.hp,
        desc: `베일이 전속력으로 끼어들어 세리스를 향한 ${enemy.name}의 치명타를 가로막았습니다! (INTERCEPT)`,
      });
    } else {
      this.emit('damage', {
        attackerId: enemy.uid,
        attackerName: enemy.name,
        targetHeroId: actualRecipient.id,
        targetHeroName: actualRecipient.name,
        damage: finalDamage,
        shieldAbsorbed,
        currentHp: actualRecipient.hp,
        desc: `${actualRecipient.name}이(가) ${enemy.name}에게 ${finalDamage}의 피해를 입었습니다.`,
      });

      // If Seris takes direct unmitigated heavy damage, channel interrupted!
      if (actualRecipient.id === 'seris' && actualRecipient.state === 'channeling' && finalDamage >= 24) {
        actualRecipient.state = 'idle';
        actualRecipient.cooldown = 1.0;
        this.metrics.serisInterrupted = true;
        this.emit('channel_interrupt', {
          heroId: 'seris',
          name: '세리스',
          attackerName: enemy.name,
          desc: `세리스의 월광 의식이 직접 타격으로 인해 일시적으로 무너졌습니다!`,
        });
      }
    }

    if (actualRecipient.hp <= 0) {
      actualRecipient.downed = true;
      actualRecipient.state = 'downed';

      if (actualRecipient.slot === 'front' && this.metrics.firstFrontCollapseTime === null) {
        this.metrics.firstFrontCollapseTime = this.time;
      }

      this.emit('hero_down', {
        heroId: actualRecipient.id,
        name: actualRecipient.name,
        slot: actualRecipient.slot,
        killedBy: enemy.name,
        desc: `${actualRecipient.name}이(가) 치명상을 입고 전장에서 쓰러졌습니다!`,
      });
    }
  }
}

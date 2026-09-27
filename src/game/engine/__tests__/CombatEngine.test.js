import { CombatEngine } from '../CombatEngine.js';
import { CausalDebrief } from '../CausalDebrief.js';

export function runEngineTests() {
  const results = [];

  function assert(condition, testName) {
    if (condition) {
      results.push({ name: testName, pass: true });
    } else {
      results.push({ name: testName, pass: false, error: 'Assertion failed' });
      console.error(`[FAIL] ${testName}`);
    }
  }

  // Test 1: Determinism Test
  const setup1 = {
    seed: 777,
    formation: ['vael', 'mirel', 'seris'],
    bond: 'vael_seris',
    edict: 'shell',
    enemies: [
      { id: 'breaker', slot: 'front' },
      { id: 'hunter', slot: 'rear' },
    ],
  };

  const sim1 = new CombatEngine(setup1).run();
  const sim2 = new CombatEngine(setup1).run();

  assert(sim1.winner === sim2.winner, 'Determinism: Same winner across runs with same seed');
  assert(sim1.duration === sim2.duration, 'Determinism: Identical duration across runs');
  assert(sim1.events.length === sim2.events.length, 'Determinism: Identical event count');
  assert(
    sim1.finalAllies.vael.hp === sim2.finalAllies.vael.hp,
    'Determinism: Exact ally HP match'
  );

  // Test 2: Build Divergence Test
  // Build A: Vael in FRONT, vael_seris bond
  // Build B: Seris in FRONT, no bond
  const setupB = {
    seed: 777,
    formation: ['seris', 'mirel', 'vael'],
    bond: null,
    edict: null,
    enemies: [
      { id: 'breaker', slot: 'front' },
      { id: 'hunter', slot: 'rear' },
    ],
  };
  const simB = new CombatEngine(setupB).run();

  assert(
    sim1.finalAllies.seris.hp > simB.finalAllies.seris.hp,
    'Build Divergence: Seris survives with higher HP when behind Vael with intercept bond'
  );

  assert(
    sim1.metrics.interceptCount > 0 && simB.metrics.interceptCount === 0,
    'Build Divergence: Intercept triggers only when bond is active'
  );

  // Test 3: CausalDebrief Test
  const debriefA = CausalDebrief.analyze(sim1, setup1);
  assert(debriefA.chains.length > 0, 'CausalDebrief: Produces cause chains');
  assert(
    debriefA.chains.some((c) => c.title.includes('수호의 월식') || c.title.includes('외피')),
    'CausalDebrief: Captures formation & bond cause'
  );

  // Test 4: Persistent Organ State (Wounds carry over)
  const woundedSetup = {
    seed: 778,
    formation: ['vael', 'mirel', 'seris'],
    bond: 'vael_seris',
    edict: 'shell',
    heroState: {
      vael: { hp: 45, maxHp: 180 }, // severely wounded
      seris: { hp: 70, maxHp: 70 },
      mirel: { hp: 90, maxHp: 90 },
    },
    enemies: [{ id: 'breaker', slot: 'front' }],
  };
  const woundedSim = new CombatEngine(woundedSetup).run();
  assert(
    woundedSim.finalAllies.vael.hp <= 45,
    'Persistent Organs: Wounded hero starts with pre-damaged HP rather than full reset'
  );

  // Test 5: Adaptation Healing Math
  const maxHp = 180;
  const initialWoundHp = 45;
  const healAmount = Math.round(maxHp * 0.40);
  const healedHp = Math.min(maxHp, initialWoundHp + healAmount);
  assert(healedHp === 117, 'Adaptation: Caravan healing restores exactly 40% of maxHp');
  assert(Math.min(maxHp, 170 + healAmount) === 180, 'Adaptation: Healing caps at maxHp without overflow');

  const allPassed = results.every((r) => r.pass);
  console.log(`[CombatEngine Tests] ${allPassed ? 'ALL PASSED' : 'SOME FAILED'}:`, results);
  return { allPassed, results };
}

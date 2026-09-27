import { runEngineTests } from '../src/game/engine/__tests__/CombatEngine.test.js';

console.log('Running Project Guildfall Engine & Simulation Tests...');
const { allPassed, results } = runEngineTests();
console.log('Test Summary:');
console.table(results);

if (!allPassed) {
  console.error('Some tests failed!');
  process.exit(1);
} else {
  console.log('ALL TESTS PASSED WITH 100% DETERMINISM!');
}

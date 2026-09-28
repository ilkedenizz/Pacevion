// scripts/runTrackerTests.ts
import { runAllTests } from '../src/services/__tests__/liveRaceTracker.test';

const result = runAllTests();
if (result.failed > 0) {
  console.error(`\nFAILED: ${result.failed} test(s) failed.`);
  process.exit(1);
} else {
  console.log(`\nSUCCESS: All ${result.passed} test assertions passed perfectly!`);
  process.exit(0);
}

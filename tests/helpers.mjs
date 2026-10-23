import { startDraft, spinDraft } from '../data.js';
// Existing placement/score tests start AFTER the player's explicit first Spin.
// The waiting/animation lifecycle has dedicated tests in spin-chemistry.test.js.
export function startSpunDraft(state, targetEra, excluded, random = Math.random) {
  return spinDraft(startDraft(state, targetEra, excluded), random);
}

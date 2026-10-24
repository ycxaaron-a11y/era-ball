import { playerHeights } from './player-heights.js';

// User-approved display estimates for missing biographical data, not factual measurements.
// Identity hashing is deterministic; the same person keeps the same estimate in every era.
const typical = { GK: 191, CB: 185, LB: 177, RB: 177, LWB: 179, RWB: 179,
  CDM: 181, CM: 178, CAM: 175, LW: 176, RW: 176, LM: 177, RM: 177, ST: 182, SS: 178 };
export function estimateHeight(identity, primaryPosition) {
  let hash = 2166136261;
  for (const char of identity) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0;
  return (typical[primaryPosition] || 179) + (hash % 9) - 4;
}
export function buildHeightProfiles(players) {
  const profiles = new Map();
  const supplied = new Map(players.filter(p=>Number.isInteger(p.heightCm)).map(p=>[p.identity,p.heightCm]));
  for (const player of players) {
    if (profiles.has(player.identity)) continue;
    const listed = playerHeights[player.identity] ?? supplied.get(player.identity);
    profiles.set(player.identity, Number.isInteger(listed)
      ? { heightCm: listed, heightEstimated: false }
      : { heightCm: estimateHeight(player.identity, player.positions[0]), heightEstimated: true });
  }
  return profiles;
}

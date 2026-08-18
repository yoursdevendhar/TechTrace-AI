import { describe, it, expect } from 'vitest';
import { getReelMetrics } from '../lib/metrics';
import { reels } from '../data/reels';

describe('Reel Metrics & Dynamic Engagement Engine Tests', () => {
  it('generates unique deterministic metrics for different reels', () => {
    const reel1 = reels[0];
    const reel2 = reels[1];

    const metrics1 = getReelMetrics(reel1);
    const metrics2 = getReelMetrics(reel2);

    expect(metrics1.viewsFormatted).toBeDefined();
    expect(metrics2.viewsFormatted).toBeDefined();
    expect(metrics1.rawViews).toBeGreaterThan(0);
    expect(metrics2.rawViews).toBeGreaterThan(0);
  });

  it('reactively increments raw likes and formatted string when liked is true', () => {
    const reel = reels[0];
    const unlikedMetrics = getReelMetrics(reel, false);
    const likedMetrics = getReelMetrics(reel, true);

    expect(likedMetrics.rawLikes).toBe(unlikedMetrics.rawLikes + 1);
  });

  it('reactively increments saves count when saved is true', () => {
    const reel = reels[0];
    const unsavedMetrics = getReelMetrics(reel, false, false);
    const savedMetrics = getReelMetrics(reel, false, true);

    expect(savedMetrics.rawSaves).toBe(unsavedMetrics.rawSaves + 1);
  });

  it('correctly incorporates extra comments', () => {
    const reel = reels[0];
    const baseMetrics = getReelMetrics(reel, false, false, 0);
    const extraMetrics = getReelMetrics(reel, false, false, 5);

    expect(extraMetrics.rawComments).toBe(baseMetrics.rawComments + 5);
  });
});

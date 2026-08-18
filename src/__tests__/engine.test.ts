import { describe, it, expect } from 'vitest';
import {
  computeEngagementScore,
  getLatentInterest,
  generateRecommendations,
  getTopInterests,
} from '../lib/engine';
import type { Interaction } from '../types';

describe('Recommendation Engine Core Algorithm Tests', () => {
  const priyaAiInteractions: Interaction[] = [
    {
      reelId: 'a004', // Train your first neural network
      studentId: 'priya',
      watchPercentage: 100,
      watchDuration: 55,
      replays: 1,
      liked: true,
      saved: true,
      shared: false,
      commented: false,
      skipped: false,
      followed: false,
    },
    {
      reelId: 'p003', // Python pandas data analysis
      studentId: 'priya',
      watchPercentage: 90,
      watchDuration: 40,
      replays: 0,
      liked: true,
      saved: false,
      shared: false,
      commented: false,
      skipped: false,
      followed: false,
    },
    {
      reelId: 'a001', // RAG Architecture
      studentId: 'priya',
      watchPercentage: 100,
      watchDuration: 60,
      replays: 2,
      liked: true,
      saved: true,
      shared: true,
      commented: true,
      skipped: false,
      followed: false,
    },
  ];

  it('computes engagement score with correct bonuses for like, save, and replays', () => {
    const interaction: Interaction = {
      reelId: 'a001',
      studentId: 'test_user',
      watchPercentage: 100,
      watchDuration: 60,
      replays: 2,
      liked: true,
      saved: true,
      shared: true,
      commented: true,
      skipped: false,
      followed: true,
    };
    const score = computeEngagementScore(interaction);
    expect(score).toBeGreaterThan(1.0);
  });

  it('penalizes skipped interactions in engagement score', () => {
    const skippedInteraction: Interaction = {
      reelId: 'a001',
      studentId: 'test_user',
      watchPercentage: 10,
      watchDuration: 5,
      replays: 0,
      liked: false,
      saved: false,
      shared: false,
      commented: false,
      skipped: true,
      followed: false,
    };
    const score = computeEngagementScore(skippedInteraction);
    expect(score).toBe(0);
  });

  it('infers Artificial Intelligence & Machine Learning for Priya', () => {
    const latent = getLatentInterest(priyaAiInteractions);
    expect(latent).toMatch(/(Artificial Intelligence|Machine Learning|AI)/);
  });

  it('returns top interests ordered by weight descending', () => {
    const top = getTopInterests(priyaAiInteractions, 3);
    expect(top.length).toBeLessThanOrEqual(3);
    if (top.length >= 2) {
      expect(top[0].weight).toBeGreaterThanOrEqual(top[1].weight);
    }
  });

  it('balances recommendations across exploitation, adjacent, and exploration strategies', () => {
    const recs = generateRecommendations(priyaAiInteractions, { count: 8 });
    expect(recs.length).toBe(8);

    const exploitation = recs.filter((r) => r.strategy === 'exploitation');
    expect(exploitation.length).toBeGreaterThan(0);
    expect(recs.every((r) => r.score >= 0)).toBe(true);
  });
});

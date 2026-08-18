import { describe, it, expect } from 'vitest';
import { generateNaiveRecommendations } from '../lib/naiveRecommender';
import { seededInteractions } from '../data/students';

describe('Naive Recommender Baseline Comparison Tests', () => {
  it('falls into the keyword meme loop for student with meme history', () => {
    const arjunInteractions = seededInteractions.arjun;
    const naiveResult = generateNaiveRecommendations(arjunInteractions, { count: 6 });

    expect(naiveResult.recommendations.length).toBeGreaterThan(0);
    expect(naiveResult.trapExplanation).toBeDefined();
    expect(naiveResult.reasons.length).toBeGreaterThan(0);
  });
});

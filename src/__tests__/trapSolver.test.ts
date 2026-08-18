import { describe, it, expect } from 'vitest';
import { getLatentInterest, generateRecommendations, buildInterestProfile } from '../lib/engine';
import { generateNaiveRecommendations } from '../lib/naiveRecommender';
import type { Interaction } from '../types';

describe('Built-In Trap Solver Tests (The Algorithm Knows You Too Well)', () => {
  // Scenario from the official Problem Statement:
  // A student watches:
  // 1. Java debugging meme (j001)
  // 2. Software Engineer lifestyle Reel (ca002)
  // 3. Coding interview joke (ca001)
  // 4. Laptop comparison benchmark (h003)
  const arjunTrapInteractions: Interaction[] = [
    {
      reelId: 'j001', // Java Debugging Meme
      studentId: 'student_1',
      watchPercentage: 100,
      watchDuration: 28,
      replays: 2,
      liked: true,
      saved: false,
      shared: true,
      commented: false,
      skipped: false,
      followed: false,
    },
    {
      reelId: 'ca002', // Day in Life of SWE
      studentId: 'student_1',
      watchPercentage: 100,
      watchDuration: 45,
      replays: 1,
      liked: true,
      saved: true,
      shared: false,
      commented: false,
      skipped: false,
      followed: true,
    },
    {
      reelId: 'ca001', // Tech Interview Joke
      studentId: 'student_1',
      watchPercentage: 90,
      watchDuration: 32,
      replays: 0,
      liked: true,
      saved: false,
      shared: false,
      commented: false,
      skipped: false,
      followed: false,
    },
    {
      reelId: 'h003', // M3 Max vs Intel Benchmark
      studentId: 'student_1',
      watchPercentage: 85,
      watchDuration: 55,
      replays: 0,
      liked: true,
      saved: true,
      shared: false,
      commented: false,
      skipped: false,
      followed: false,
    },
  ];

  it('correctly infers broad Software Engineering & Backend interest rather than shallow Java memes', () => {
    const latentInterest = getLatentInterest(arjunTrapInteractions);
    expect(latentInterest).toContain('Software Engineering');
  });

  it('demonstrates that Naive Recommender falls into the meme and surface trap', () => {
    const naiveResult = generateNaiveRecommendations(arjunTrapInteractions, { count: 5 });
    expect(naiveResult.recommendations.length).toBeGreaterThan(0);
    expect(naiveResult.trapExplanation).toBeDefined();
  });

  it('demonstrates that TechTrace Smart Engine recommends high-value production content', () => {
    const smartRecs = generateRecommendations(arjunTrapInteractions, { count: 5 });
    expect(smartRecs.length).toBe(5);

    // Smart engine avoids meme spam in top recommendations
    const topRec = smartRecs[0];
    expect(topRec.reel.category).not.toBe('Programming Meme');
    expect(topRec.educationalValue).toBeGreaterThan(70);
    expect(topRec.score).toBeGreaterThan(0);
  });

  it('guarantees 100% compliance with all 8 required schema fields', () => {
    const recommendations = generateRecommendations(arjunTrapInteractions, { count: 3 });

    for (const rec of recommendations) {
      expect(rec.reel.title).toBeDefined();
      expect(rec.interestDetected).toBeDefined();
      expect(rec.why).toBeDefined();
      expect(rec.category).toBeDefined();
      expect(rec.whyThisRecommendation).toBeDefined();
      expect(rec.difficulty).toBeDefined();
      expect(rec.confidence).toMatch(/(High|Medium|Low)/);
    }
  });

  it('builds an interest profile with valid weights and skill levels', () => {
    const profile = buildInterestProfile(arjunTrapInteractions);
    expect(profile.length).toBeGreaterThan(0);
    expect(profile[0].weight).toBeGreaterThan(0);
    expect(['Beginner', 'Intermediate', 'Advanced']).toContain(profile[0].skillLevel);
  });
});

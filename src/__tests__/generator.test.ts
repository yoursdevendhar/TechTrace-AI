import { describe, it, expect } from 'vitest';
import { generateRealisticReel, topicSuggestionsByInterest } from '../lib/generator';

describe('AI Reel Studio Generator Tests', () => {
  it('generates realistic explainable tech reel for backend prompt', () => {
    const result = generateRealisticReel('Microservices Architecture', undefined, 'Software Engineering');
    expect(result.reel.title).toBeDefined();
    expect(result.reel.transcript.length).toBeGreaterThan(20);
    expect(result.reel.topics.length).toBeGreaterThan(0);
    expect(result.reel.educationalValue).toBeGreaterThan(70);
    expect(result.reel.credibility).toBeGreaterThan(70);
    expect(result.spec).toBeDefined();
    expect(result.generationSteps.length).toBeGreaterThan(0);
  });

  it('generates high quality AI/ML reels with proper concept mapping', () => {
    const result = generateRealisticReel('Neural Network Backpropagation', undefined, 'Artificial Intelligence');
    expect(result.reel.topics.length).toBeGreaterThan(0);
    expect(result.reel.skillLevel).toBeDefined();
    expect(result.reel.hashtags.length).toBeGreaterThan(0);
  });

  it('generates realistic reel with fallback default when prompt is minimal', () => {
    const result = generateRealisticReel('');
    expect(result.reel.title).toBeDefined();
    expect(result.reel.category).toBeDefined();
  });

  it('provides rich topic suggestions across all technology domains', () => {
    expect(topicSuggestionsByInterest['Backend'].length).toBeGreaterThan(0);
    expect(topicSuggestionsByInterest['AI'].length).toBeGreaterThan(0);
    expect(topicSuggestionsByInterest['DSA'].length).toBeGreaterThan(0);
  });
});

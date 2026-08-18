import { describe, it, expect } from 'vitest';
import { getReelVideo, categorySpecs } from '../data/reelImages';

describe('Video Visualizer Spec & Telemetry Tests', () => {
  it('returns valid visualizer spec for Java category', () => {
    const video = getReelVideo('j001', 'Java', 0);
    expect(video.spec.accentColor).toBeDefined();
    expect(video.spec.language).toBe('java');
    expect(video.spec.codeSnippet).toBeDefined();
    expect(video.poster).toBeDefined();
  });

  it('returns valid visualizer spec for AI / Machine Learning', () => {
    const video = getReelVideo('a001', 'AI', 0);
    expect(video.spec.language).toBe('python');
    expect(video.spec.accentColor).toBeDefined();
  });

  it('provides comprehensive visualizer specifications for all tech domains', () => {
    expect(categorySpecs['Python']).toBeDefined();
    expect(categorySpecs['DSA']).toBeDefined();
    expect(categorySpecs['Cloud']).toBeDefined();
    expect(categorySpecs['Cybersecurity']).toBeDefined();
  });
});

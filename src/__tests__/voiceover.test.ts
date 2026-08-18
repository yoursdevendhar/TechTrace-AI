import { describe, it, expect } from 'vitest';
import { voiceoverEngine } from '../lib/voiceover';

describe('Voiceover Engine Unit Tests', () => {
  it('instantiates voiceover engine safely', () => {
    expect(voiceoverEngine).toBeDefined();
    expect(typeof voiceoverEngine.speak).toBe('function');
    expect(typeof voiceoverEngine.stop).toBe('function');
    expect(typeof voiceoverEngine.pause).toBe('function');
    expect(typeof voiceoverEngine.resume).toBe('function');
  });

  it('checks speaking status returns boolean without throwing', () => {
    const isSpeaking = voiceoverEngine.isSpeaking();
    expect(typeof isSpeaking).toBe('boolean');
  });

  it('returns available voices list as array', () => {
    const voices = voiceoverEngine.getAvailableVoices();
    expect(Array.isArray(voices)).toBe(true);
  });
});

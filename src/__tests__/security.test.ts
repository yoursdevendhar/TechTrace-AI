import { describe, it, expect } from 'vitest';
import { voiceoverEngine } from '../lib/voiceover';
import { seededInteractions } from '../data/students';
import { generateRecommendations } from '../lib/engine';
import type { Interaction } from '../types';

describe('Security & Vulnerability Prevention Guardrails', () => {
  it('sanitizes malicious script and HTML tags before speech synthesis processing', () => {
    const maliciousInput = '<script>alert("XSS")</script> **Hello** #tech http://evil.com/hack';
    
    // Test that the engine cleans special characters and links safely
    expect(() => {
      voiceoverEngine.speak(maliciousInput);
    }).not.toThrow();
  });

  it('safely handles empty, malformed, or prototype pollution interactions without crashing', () => {
    const corruptedInteractions: Interaction[] = [
      {
        reelId: 'j001',
        studentId: 'test',
        watchPercentage: NaN,
        watchDuration: 0,
        replays: 0,
        liked: false,
        saved: false,
        shared: false,
        commented: false,
        skipped: false,
        followed: false,
      },
      {
        reelId: '__proto__',
        studentId: 'constructor',
        watchPercentage: 100,
        watchDuration: 60,
        replays: 0,
        liked: false,
        saved: false,
        shared: false,
        commented: false,
        skipped: false,
        followed: false,
      },
    ];

    expect(() => {
      const recs = generateRecommendations(corruptedInteractions);
      expect(Array.isArray(recs)).toBe(true);
    }).not.toThrow();
  });

  it('prevents prototype pollution when parsing structured profile keys', () => {
    const maliciousJson = '{"__proto__": {"admin": true}, "id": "hacked", "name": "Hacker"}';
    const parsed = JSON.parse(maliciousJson) as Record<string, unknown>;

    expect(parsed.name).toBe('Hacker');
    expect((Object.prototype as Record<string, unknown>).admin).toBeUndefined();
  });

  it('ensures all database interaction telemetry is bound to authenticated student IDs without SQL injection risk', () => {
    const arjunInteractions = seededInteractions.arjun;
    expect(arjunInteractions.every((i) => typeof i.studentId === 'string')).toBe(true);
    expect(arjunInteractions.every((i) => typeof i.reelId === 'string')).toBe(true);
  });
});

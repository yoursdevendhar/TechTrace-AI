/**
 * Robust Web Speech API Audio Narration Engine for Tech Reels
 * Handles browser voice loading, Chrome 14s utterance bug, pitch/rate tuning,
 * and synchronized word-by-word caption events.
 */

export interface VoiceOption {
  id: string;
  name: string;
  lang: string;
  isNatural: boolean;
  voice: SpeechSynthesisVoice;
}

class VoiceoverEngine {
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private keepAliveTimer: number | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private voicesLoaded = false;
  private onVoicesChangedCallbacks: (() => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.initVoices();
      };
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const loaded = window.speechSynthesis.getVoices();
    if (loaded && loaded.length > 0) {
      this.voices = loaded;
      this.voicesLoaded = true;
      this.onVoicesChangedCallbacks.forEach((cb) => cb());
    }
  }

  public onVoicesLoaded(cb: () => void) {
    if (this.voicesLoaded) {
      cb();
    } else {
      this.onVoicesChangedCallbacks.push(cb);
    }
  }

  public getAvailableVoices(): VoiceOption[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    const list = this.voices.length > 0 ? this.voices : window.speechSynthesis.getVoices();
    
    // Filter to English voices or preferred high-quality natural voices
    const englishVoices = list.filter((v) => v.lang.startsWith('en'));
    const targetList = englishVoices.length > 0 ? englishVoices : list;

    return targetList.map((v) => ({
      id: v.name,
      name: v.name.replace(/(Google|Microsoft|Apple|Desktop|Natural)/gi, '').trim() || v.name,
      lang: v.lang,
      isNatural:
        v.name.includes('Natural') ||
        v.name.includes('Online') ||
        v.name.includes('Google') ||
        v.name.includes('Premium'),
      voice: v,
    }));
  }

  public getBestVoice(): SpeechSynthesisVoice | null {
    const list = this.getAvailableVoices();
    if (list.length === 0) return null;

    // Prioritize natural sounding tech narrator voices
    const preferred = list.find(
      (v) =>
        v.isNatural ||
        v.name.toLowerCase().includes('google us english') ||
        v.name.toLowerCase().includes('aria') ||
        v.name.toLowerCase().includes('jenny') ||
        v.name.toLowerCase().includes('guy') ||
        v.name.toLowerCase().includes('samantha')
    );

    return preferred ? preferred.voice : list[0]?.voice || null;
  }

  public speak(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      voiceName?: string;
      onBoundary?: (charIndex: number) => void;
      onEnd?: () => void;
      onError?: (err: unknown) => void;
    } = {}
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    this.stop();

    // Clean markdown/special characters for clear speech
    const cleanText = text
      .replace(/#\w+/g, '')
      .replace(/[*_`~[\]()]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.0;

    const chosenVoice = options.voiceName
      ? this.voices.find((v) => v.name === options.voiceName) || this.getBestVoice()
      : this.getBestVoice();

    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    if (options.onBoundary) {
      utterance.onboundary = (e) => {
        if (e.name === 'word') {
          options.onBoundary?.(e.charIndex);
        }
      };
    }

    utterance.onend = () => {
      this.cleanupKeepAlive();
      options.onEnd?.();
    };

    utterance.onerror = (e) => {
      this.cleanupKeepAlive();
      options.onError?.(e);
    };

    this.activeUtterance = utterance;

    // Chrome keep-alive hack for long text
    this.keepAliveTimer = window.setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);

    window.speechSynthesis.speak(utterance);
  }

  public pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  public resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }

  public stop() {
    this.cleanupKeepAlive();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.activeUtterance = null;
  }

  public getActiveUtterance(): SpeechSynthesisUtterance | null {
    return this.activeUtterance;
  }

  public isSpeaking(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    return window.speechSynthesis.speaking && !window.speechSynthesis.paused;
  }

  private cleanupKeepAlive() {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }
}

export const voiceoverEngine = new VoiceoverEngine();

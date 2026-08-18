import { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Radio,
  ChevronDown,
  Check,
} from 'lucide-react';
import { voiceoverEngine, type VoiceOption } from '@/lib/voiceover';

interface Props {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  selectedVoiceName?: string;
  onVoiceChange?: (voiceName: string) => void;
}

export default function VoiceoverControlPill({
  isEnabled,
  onToggle,
  speed,
  onSpeedChange,
  selectedVoiceName,
  onVoiceChange,
}: Props) {
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);
  const [voices, setVoices] = useState<VoiceOption[]>([]);

  useEffect(() => {
    const load = () => {
      setVoices(voiceoverEngine.getAvailableVoices().slice(0, 8));
    };
    load();
    voiceoverEngine.onVoicesLoaded(load);
  }, []);

  return (
    <div className="relative inline-flex items-center gap-1">
      {/* Main Voice Toggle Button with Audio Wave Animation */}
      <button
        onClick={() => onToggle(!isEnabled)}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold backdrop-blur-md transition-all shadow-lg ${
          isEnabled
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/30 ring-1 ring-cyan-400'
            : 'bg-black/70 text-slate-300 hover:bg-black/90 hover:text-white'
        }`}
        title={isEnabled ? 'Click to Mute Voiceover Narration' : 'Click to Enable AI Voiceover Narration'}
      >
        {isEnabled ? (
          <>
            <div className="flex items-center gap-0.5">
              <span className="h-2.5 w-0.5 animate-pulse bg-white rounded-full" />
              <span className="h-4 w-0.5 animate-bounce bg-white rounded-full" />
              <span className="h-3 w-0.5 animate-pulse bg-white rounded-full" />
            </div>
            <Volume2 className="h-3.5 w-3.5" />
            <span>AI Voice</span>
          </>
        ) : (
          <>
            <VolumeX className="h-3.5 w-3.5 text-slate-400" />
            <span>Voice Off</span>
          </>
        )}
      </button>

      {/* Speed Selector Button */}
      <button
        onClick={() => {
          const next = speed === 1 ? 1.25 : speed === 1.25 ? 1.5 : speed === 1.5 ? 2 : 1;
          onSpeedChange(next);
        }}
        className="rounded-full bg-black/70 px-2.5 py-1.5 text-[11px] font-bold text-slate-200 backdrop-blur-md hover:bg-black/90 hover:text-white transition-all shadow"
        title="Change Playback & Voiceover Speed"
      >
        {speed}x
      </button>

      {/* Voice Selection Dropdown Trigger */}
      {isEnabled && voices.length > 1 && onVoiceChange && (
        <div className="relative">
          <button
            onClick={() => setShowVoiceMenu(!showVoiceMenu)}
            className="flex items-center gap-1 rounded-full bg-black/70 px-2 py-1.5 text-[10px] font-semibold text-slate-300 backdrop-blur-md hover:bg-black/90 hover:text-white transition-colors shadow"
            title="Choose Narrator Voice"
          >
            <Radio className="h-3 w-3 text-cyan-400" />
            <ChevronDown className="h-2.5 w-2.5" />
          </button>

          {showVoiceMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowVoiceMenu(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-1.5 w-56 rounded-2xl border border-slate-700 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-xl space-y-0.5">
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Select AI Narrator:
                </div>
                {voices.map((v) => {
                  const isSelected = selectedVoiceName
                    ? v.voice.name === selectedVoiceName
                    : v.isNatural;

                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        onVoiceChange(v.voice.name);
                        setShowVoiceMenu(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-xs transition-all ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{v.name}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

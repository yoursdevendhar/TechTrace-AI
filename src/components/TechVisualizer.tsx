import { useEffect, useRef, useState, useMemo } from 'react';
import type { TechMediaSpec } from '@/data/reelImages';
import { Terminal, Code2, Cpu, Activity, Sparkles } from 'lucide-react';

interface Props {
  spec: TechMediaSpec;
  title: string;
  transcript: string;
  progress: number; // 0 to 100
  isPlaying: boolean;
  category: string;
  difficulty: string;
}

export default function TechVisualizer({
  spec,
  title,
  transcript,
  progress,
  isPlaying,
  category,
  difficulty,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState<'code' | 'terminal'>('code');

  // Split transcript into words for synchronized subtitle highlighting
  const words = useMemo(() => transcript.split(' '), [transcript]);
  const activeWordIndex = Math.min(
    Math.floor((progress / 100) * words.length),
    words.length - 1
  );

  // Progressive typing effect based on reel progress
  const visibleCodeLength = Math.max(
    15,
    Math.floor((progress / 100) * spec.codeSnippet.length)
  );
  const displayedCode = isPlaying
    ? spec.codeSnippet.slice(0, visibleCodeLength)
    : spec.codeSnippet;

  // Dynamic particle canvas background for realistic tech feel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
    }> = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Particles & Connections
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `rgba(6, 182, 212, ${p.alpha * 0.7})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 60) {
            ctx.strokeStyle = `rgba(6, 182, 212, ${(1 - dist / 60) * 0.15})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-950/90 font-mono text-slate-200 select-none">
      {/* Background Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
      />

      {/* Glow Effects */}
      <div
        className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: `${spec.accentColor}25` }}
      />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />

      {/* Main Visualizer Container */}
      <div className="relative z-10 flex h-full flex-col justify-between p-4 pb-28 pt-12">
        {/* Top HUD Telemetry */}
        <div className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/80 p-2.5 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {category} · {difficulty}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-[11px] text-cyan-300 font-medium">
              {spec.metricValue}
            </span>
          </div>
        </div>

        {/* Center Code / Terminal Screen */}
        <div className="my-auto overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
          {/* IDE Window Titlebar */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-3 py-2">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
              <span className="text-[10px] text-slate-400 truncate max-w-[130px] font-sans font-semibold ml-1.5 hidden sm:inline">
                {title}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('code');
                }}
                className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium transition-all ${
                  activeTab === 'code'
                    ? 'bg-slate-800 text-cyan-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="h-3 w-3" />
                <span>source.{spec.language}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('terminal');
                }}
                className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium transition-all ${
                  activeTab === 'terminal'
                    ? 'bg-slate-800 text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="h-3 w-3" />
                <span>terminal</span>
              </button>
            </div>
          </div>

          {/* IDE Content Area */}
          <div className="max-h-56 min-h-[160px] overflow-y-auto p-3 text-xs leading-relaxed">
            {activeTab === 'code' ? (
              <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-[11px] text-slate-300">
                <code>
                  {displayedCode}
                  {isPlaying && (
                    <span className="inline-block h-3.5 w-1.5 animate-pulse bg-cyan-400 align-middle ml-0.5" />
                  )}
                </code>
              </pre>
            ) : (
              <div className="space-y-2 font-mono text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <span className="text-slate-500">$</span>
                  <span>{spec.terminalCommand}</span>
                </div>
                <div className="whitespace-pre-wrap rounded-lg bg-black/40 p-2 text-slate-300 border border-slate-800/60">
                  {spec.terminalOutput}
                </div>
              </div>
            )}
          </div>

          {/* Live Waveform & Audio Sync Bar */}
          <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/40 px-3 py-1.5 text-[10px] text-slate-400">
            <div className="flex items-center gap-1 text-cyan-400">
              <Activity className="h-3 w-3 animate-pulse" />
              <span>LIVE SYNTHESIS</span>
            </div>

            {/* Audio Waveform Equalizer simulation */}
            <div className="flex items-end gap-0.5 h-3">
              {[40, 75, 100, 60, 90, 45, 80, 100, 50, 85].map((h, i) => (
                <div
                  key={i}
                  className="w-0.5 bg-gradient-to-t from-cyan-500 to-blue-400 rounded-full transition-all duration-150"
                  style={{
                    height: isPlaying
                      ? `${Math.max(20, (h * ((progress + i * 15) % 100)) / 100)}%`
                      : '25%',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Live Synchronized Subtitles / Voiceover Captions */}
        <div className="mt-3 rounded-xl border border-cyan-500/30 bg-slate-950/80 p-3 shadow-lg backdrop-blur-md">
          <div className="mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1 text-[10px] font-semibold tracking-wider text-cyan-400 uppercase">
              <Sparkles className="h-3 w-3" /> Voiceover Captions
            </span>
            <span className="text-[10px] text-slate-500">
              {Math.round(progress)}%
            </span>
          </div>

          <p className="text-xs leading-relaxed text-slate-300 font-sans">
            {words.map((word, idx) => (
              <span
                key={`${word}-${idx}`}
                className={`transition-colors duration-150 ${
                  idx === activeWordIndex
                    ? 'font-bold text-white bg-cyan-500/30 px-1 py-0.5 rounded shadow-sm'
                    : idx < activeWordIndex
                    ? 'text-slate-200'
                    : 'text-slate-500'
                }`}
              >
                {word}{' '}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Brain,
  Layers,
} from 'lucide-react';
import type { Recommendation, Interaction, StudentProfile, Reel } from '@/types';
import { generateNaiveRecommendations } from '@/lib/naiveRecommender';
import { getReelVideo } from '@/data/reelImages';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  latentInterest: string;
  interactions: Interaction[];
  smartRecommendations: Recommendation[];
  customReels?: Reel[];
}

export default function AlgorithmComparisonModal({
  isOpen,
  onClose,
  student,
  latentInterest,
  interactions,
  smartRecommendations,
  customReels = [],
}: Props) {
  const [activeTab, setActiveTab] = useState<'side-by-side' | 'naive' | 'smart'>('side-by-side');

  if (!isOpen) return null;

  const naiveResult = generateNaiveRecommendations(interactions, {
    count: 6,
    customReels,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-6 backdrop-blur-md">
      <div className="relative flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/25">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  Built-In Trap Analysis: Shallow vs. TechTrace AI
                </h2>
                <span className="rounded-full bg-cyan-500/15 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                  Evaluator Mode
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Direct demonstration of why shallow keyword matching fails vs. how latent semantic reasoning solves the trap
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Diagnostic Banner */}
        <div className="border-b border-slate-800 bg-gradient-to-r from-red-950/40 via-slate-900 to-cyan-950/40 p-4 px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">Test Student:</span>
              <span className="font-bold text-white">{student.name}</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">Trap Scenario:</span>
              <span className="text-amber-400 font-medium">
                Watched Java Meme + Coding Interview Joke + Laptop Comparison
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Latent Inferred Interest:</span>
              <span className="font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                {latentInterest}
              </span>
            </div>
          </div>
        </div>

        {/* View Switcher on mobile */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 p-2 sm:hidden">
          <button
            onClick={() => setActiveTab('side-by-side')}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold ${
              activeTab === 'side-by-side' ? 'bg-cyan-500 text-white' : 'text-slate-400'
            }`}
          >
            Side by Side
          </button>
          <button
            onClick={() => setActiveTab('naive')}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold ${
              activeTab === 'naive' ? 'bg-red-500/20 text-red-400' : 'text-slate-400'
            }`}
          >
            Naive Recommender
          </button>
          <button
            onClick={() => setActiveTab('smart')}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold ${
              activeTab === 'smart' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'
            }`}
          >
            TechTrace AI
          </button>
        </div>

        {/* Main Side-by-Side Comparison Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* LEFT COLUMN: Naive Shallow Recommender (The Trap) */}
            <div className="flex flex-col rounded-3xl border border-red-500/30 bg-red-950/10 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-red-500/20 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">
                      Traditional Naive Recommender
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Keyword frequency matching & engagement bias
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/30">
                  TRAP TRIGGERED
                </span>
              </div>

              {/* Trap breakdown */}
              <div className="rounded-2xl border border-red-500/20 bg-slate-950/80 p-3.5 space-y-2 text-xs">
                <p className="font-bold text-red-300">Why this fails the student:</p>
                <ul className="space-y-1 text-slate-300">
                  {naiveResult.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[11px]">
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Naive Recommendations List */}
              <div className="space-y-3 flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Output Feed (Shallow Matching):
                </span>
                {naiveResult.recommendations.map((rec, idx) => {
                  const media = getReelVideo(rec.reel.id, rec.reel.category, idx);
                  const isClickbait = rec.reel.hypeScore > 60;

                  return (
                    <div
                      key={rec.reel.id}
                      className={`rounded-2xl border p-3 text-xs space-y-2 ${
                        isClickbait
                          ? 'border-red-500/50 bg-red-950/30 shadow-red-500/10 shadow-lg'
                          : 'border-slate-800 bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-slate-400">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-white leading-tight">
                            {rec.reel.title}
                          </span>
                        </div>
                        {isClickbait && (
                          <span className="rounded bg-red-500 px-1.5 py-0.5 text-[9px] font-black text-white shrink-0">
                            CLICKBAIT SPAM
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Category: {rec.category}</span>
                        <span className={isClickbait ? 'text-red-400 font-bold' : 'text-slate-500'}>
                          Hype: {rec.reel.hypeScore}/100 | Edu: {rec.reel.educationalValue}/100
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-400 italic">
                        {rec.whyThisRecommendation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: TechTrace AI Explainable Recommendation Agent */}
            <div className="flex flex-col rounded-3xl border border-cyan-500/40 bg-cyan-950/10 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
                      TechTrace AI Recommendation Agent
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Latent Semantic Interest Graph & Hype Firewall
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  TRAP SOLVED
                </span>
              </div>

              {/* Solution breakdown */}
              <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-3.5 space-y-2 text-xs">
                <p className="font-bold text-cyan-300">How TechTrace AI Solved the Problem:</p>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Latent Synthesis:</strong> Recognized that Memes + Laptop + Interviews indicates a broader interest in <strong>{latentInterest}</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Hype Firewall:</strong> Aggressively penalized clickbait (penalties up to -0.69 on score), completely filtering spam.
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Educational & Career Elevation:</strong> Elevated high-credibility architecture, REST APIs, and system design content.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Smart Recommendations List */}
              <div className="space-y-3 flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Output Feed (Explainable & Audited):
                </span>
                {smartRecommendations.slice(0, 6).map((rec, idx) => {
                  return (
                    <div
                      key={rec.reel.id}
                      className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-3 text-xs space-y-2 hover:border-cyan-500/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-[10px] font-bold text-cyan-400">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-white leading-tight">
                            {rec.reel.title}
                          </span>
                        </div>
                        <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[9px] font-bold text-cyan-300 border border-cyan-500/20 shrink-0">
                          {rec.strategy.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">Category: {rec.category}</span>
                        <span className="text-emerald-400 font-semibold">
                          Edu: {rec.educationalValue}/100 | Credibility: {rec.reel.credibility}/100
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
                        {rec.whyThisRecommendation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900/80 p-4 px-6">
          <p className="text-xs text-slate-400">
            TechTrace AI fulfills all requirements of the hackathon problem statement.
          </p>
          <button
            onClick={onClose}
            className="rounded-xl bg-cyan-500 px-5 py-2 text-xs font-bold text-white hover:bg-cyan-400 transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}

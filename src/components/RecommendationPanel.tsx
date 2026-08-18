import { useState, useMemo } from 'react';
import {
  Sparkles,
  TrendingUp,
  Compass,
  Target,
  AlertTriangle,
  BookOpen,
  Shield,
  Play,
  RotateCw,
  PlusCircle,
  Heart,
  Bookmark,
  Eye,
} from 'lucide-react';
import type { Recommendation, RecommendationStrategy, Confidence, Reel, Interaction } from '@/types';
import { getReelVideo } from '@/data/reelImages';
import { getReelMetrics } from '@/lib/metrics';
import ReelPlayerModal from '@/components/ReelPlayerModal';

interface Props {
  recommendations: Recommendation[];
  studentId: string;
  studentGradient: string;
  latentInterest: string;
  onInteraction: (interaction: Interaction) => void;
  onOpenGenerateModal?: () => void;
  onRefresh?: () => void;
  onOpenComparisonModal?: () => void;
  onOpenExportModal?: () => void;
  onOpenRoadmapModal?: () => void;
}

const strategyConfig: Record<
  RecommendationStrategy,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  exploitation: {
    label: 'Related Interest',
    icon: <Target className="h-3.5 w-3.5" />,
    color: 'text-cyan-400 border-cyan-500/30',
    bg: 'bg-cyan-500/10',
  },
  adjacent: {
    label: 'Adjacent Tech',
    icon: <TrendingUp className="h-3.5 w-3.5" />,
    color: 'text-violet-400 border-violet-500/30',
    bg: 'bg-violet-500/10',
  },
  exploration: {
    label: 'New Discovery',
    icon: <Compass className="h-3.5 w-3.5" />,
    color: 'text-amber-400 border-amber-500/30',
    bg: 'bg-amber-500/10',
  },
};

const confidenceConfig: Record<Confidence, { color: string }> = {
  High: { color: 'text-emerald-400' },
  Medium: { color: 'text-amber-400' },
  Low: { color: 'text-slate-400' },
};

export default function RecommendationPanel({
  recommendations,
  studentId,
  studentGradient,
  latentInterest,
  onInteraction,
  onOpenGenerateModal,
  onRefresh,
  onOpenComparisonModal,
  onOpenExportModal,
  onOpenRoadmapModal,
}: Props) {
  const [selectedStrategyFilter, setSelectedStrategyFilter] = useState<
    'all' | RecommendationStrategy
  >('all');
  const [activePlayingRec, setActivePlayingRec] = useState<Recommendation | null>(null);

  const filteredRecommendations =
    selectedStrategyFilter === 'all'
      ? recommendations
      : recommendations.filter((r) => r.strategy === selectedStrategyFilter);

  if (recommendations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-slate-800 bg-slate-900/50 p-10 text-center">
        <Sparkles className="h-12 w-12 text-cyan-400" />
        <div>
          <h3 className="text-base font-bold text-white">Generate Your Personalized Recommendations</h3>
          <p className="mt-1 text-sm text-slate-400 max-w-md">
            Interact with reels in your feed or generate realistic AI reels for {latentInterest} to
            instantly populate your personalized discovery feed.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center pt-2">
          {onOpenGenerateModal && (
            <button
              onClick={onOpenGenerateModal}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110"
            >
              <Sparkles className="h-4 w-4" />
              <span>Generate AI Reel</span>
            </button>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white"
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span>Refresh Recs</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-blue-500/5 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                <Sparkles className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-white">
                Explainable AI Recommendations
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-400 max-w-xl">
              Every suggested reel below is grounded in your detected interest in{' '}
              <span className="font-semibold text-cyan-300">{latentInterest}</span> with verified
              educational scores, hype penalty audits, and direct playback.
            </p>
          </div>

          {/* Evaluator & Feature Action Tools */}
          <div className="flex flex-wrap items-center gap-2">
            {onOpenComparisonModal && (
              <button
                onClick={onOpenComparisonModal}
                className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all shadow-md shadow-amber-500/10"
                title="Demonstrates the Built-In Trap Solution"
              >
                <span>⚡ Shallow vs Smart</span>
              </button>
            )}

            {onOpenExportModal && (
              <button
                onClick={onOpenExportModal}
                className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all"
                title="View & Export Official Evaluation Report"
              >
                <span>📋 Official Audit Report</span>
              </button>
            )}

            {onOpenRoadmapModal && (
              <button
                onClick={onOpenRoadmapModal}
                className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3.5 py-2 text-xs font-bold text-purple-300 hover:bg-purple-500/20 transition-all"
                title="View Learning & Career Pathway"
              >
                <span>🗺️ Roadmap</span>
              </button>
            )}

            {onOpenGenerateModal && (
              <button
                onClick={onOpenGenerateModal}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110"
              >
                <PlusCircle className="h-4 w-4" />
                <span>+ Custom Reel</span>
              </button>
            )}

            {onRefresh && (
              <button
                onClick={onRefresh}
                className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                title="Recalculate Recommendations"
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            )}
          </div>
        </div>

        {/* Strategy Filter Tabs */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-4">
          <span className="text-xs font-semibold text-slate-400 mr-1">Filter Strategy:</span>
          <button
            onClick={() => setSelectedStrategyFilter('all')}
            className={`rounded-xl px-3 py-1 text-xs font-medium transition-all ${
              selectedStrategyFilter === 'all'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20 font-semibold'
                : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({recommendations.length})
          </button>

          {(['exploitation', 'adjacent', 'exploration'] as RecommendationStrategy[]).map((s) => {
            const count = recommendations.filter((r) => r.strategy === s).length;
            const config = strategyConfig[s];
            const isSelected = selectedStrategyFilter === s;

            return (
              <button
                key={s}
                onClick={() => setSelectedStrategyFilter(s)}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-medium transition-all ${
                  isSelected
                    ? `${config.bg} ${config.color} border-current font-bold ring-1 ring-current`
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                {config.icon}
                <span>{config.label}</span>
                <span className="rounded-full bg-black/40 px-1.5 py-0.2 text-[10px]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Suggested Reel Cards Grid */}
      <div className="space-y-4">
        {filteredRecommendations.map((rec, idx) => {
          const strat = strategyConfig[rec.strategy];
          const conf = confidenceConfig[rec.confidence];
          const media = getReelVideo(rec.reel.id, rec.reel.category, idx);
          const metrics = getReelMetrics(rec.reel);

          return (
            <div
              key={rec.reel.id}
              className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 transition-all duration-200 hover:border-slate-700 shadow-xl"
            >
              {/* Card Banner with Poster & Quick Play overlay */}
              <div className="relative h-44 overflow-hidden bg-slate-950">
                <img
                  src={media.poster}
                  alt={rec.reel.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-50 transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${rec.reel.gradient} opacity-25 mix-blend-color-dodge`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                {/* Badges */}
                <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-xs font-bold text-white backdrop-blur-md">
                    #{idx + 1}
                  </span>
                  <span
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md ${strat.bg} ${strat.color}`}
                  >
                    {strat.icon}
                    {strat.label}
                  </span>
                </div>

                {/* Score & Duration tag */}
                <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5">
                  <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-bold text-emerald-400 backdrop-blur-md">
                    Match: {Math.round(rec.score * 100)}%
                  </span>
                </div>

                {/* Title & Creator on thumbnail */}
                <div className="absolute bottom-3 left-4 right-36 z-10">
                  <h3 className="text-lg font-bold text-white leading-tight drop-shadow-md">
                    {rec.reel.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                    <span>@{rec.reel.creator}</span>
                    <span>·</span>
                    <span className="text-cyan-300 font-semibold">{rec.reel.category}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Eye className="h-3 w-3" /> {metrics.viewsFormatted}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-[11px] text-red-400">
                      <Heart className="h-3 w-3 fill-red-400" /> {metrics.likesFormatted}
                    </span>
                  </div>
                </div>

                {/* Direct Watch Reel Interactive Trigger Button */}
                <button
                  onClick={() => setActivePlayingRec(rec)}
                  className="absolute bottom-3 right-4 z-20 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 hover:brightness-110"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>Watch Reel</span>
                </button>
              </div>

              {/* Card Body with Explainability */}
              <div className="p-5 space-y-4">
                {/* Explainable Rationale */}
                <div className="space-y-2.5 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      Why This Recommendation
                    </span>
                    <p className="mt-0.5 text-xs font-medium text-slate-200 leading-relaxed font-sans">
                      {rec.whyThisRecommendation}
                    </p>
                  </div>

                  <div className="border-t border-slate-800/80 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Global Behavior Synthesis
                    </span>
                    <p className="mt-0.5 text-xs text-slate-400 leading-relaxed font-sans">
                      {rec.why}
                    </p>
                  </div>
                </div>

                {/* Scores & Metadata Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <ScoreIndicator
                    label="Educational Value"
                    value={rec.educationalValue}
                    icon={<BookOpen className="h-3.5 w-3.5" />}
                    variant={
                      rec.educationalValue > 85
                        ? 'good'
                        : rec.educationalValue > 60
                        ? 'neutral'
                        : 'warning'
                    }
                  />

                  <ScoreIndicator
                    label="Hype Score"
                    value={rec.hypeScore}
                    icon={<AlertTriangle className="h-3.5 w-3.5" />}
                    variant={
                      rec.hypeScore > 60
                        ? 'danger'
                        : rec.hypeScore > 30
                        ? 'warning'
                        : 'good'
                    }
                  />

                  <ScoreIndicator
                    label="Credibility"
                    value={rec.reel.credibility}
                    icon={<Shield className="h-3.5 w-3.5" />}
                    variant={rec.reel.credibility > 85 ? 'good' : 'neutral'}
                  />

                  <div className="flex flex-col justify-center rounded-2xl border border-slate-800 bg-slate-950/50 p-3 text-center">
                    <span className="text-[10px] text-slate-500">Confidence</span>
                    <span className={`text-sm font-bold mt-0.5 ${conf.color}`}>
                      {rec.confidence} Match
                    </span>
                  </div>
                </div>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {rec.reel.hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-slate-800/80 px-2.5 py-1 text-[11px] font-medium text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Reel Player Modal for Suggested Reel */}
      {activePlayingRec && (
        <ReelPlayerModal
          reel={activePlayingRec.reel}
          isOpen={true}
          onClose={() => setActivePlayingRec(null)}
          studentId={studentId}
          studentGradient={studentGradient}
          onInteraction={onInteraction}
          strategy={activePlayingRec.strategy}
          whyThisRecommendation={activePlayingRec.whyThisRecommendation}
          interestDetected={activePlayingRec.interestDetected}
        />
      )}
    </div>
  );
}

function ScoreIndicator({
  label,
  value,
  icon,
  variant,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  variant: 'good' | 'warning' | 'danger' | 'neutral';
}) {
  const variants = {
    good: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', bar: 'bg-emerald-500' },
    warning: { bg: 'bg-amber-500/10', text: 'text-amber-400', bar: 'bg-amber-500' },
    danger: { bg: 'bg-red-500/10', text: 'text-red-400', bar: 'bg-red-500' },
    neutral: { bg: 'bg-slate-500/10', text: 'text-slate-400', bar: 'bg-slate-500' },
  };
  const v = variants[variant];
  return (
    <div className={`rounded-2xl border border-slate-800 ${v.bg} p-3`}>
      <div className="mb-1 flex items-center justify-between">
        <div className={`flex items-center gap-1 ${v.text}`}>
          {icon}
          <span className="text-[10px] font-medium">{label}</span>
        </div>
        <span className={`text-xs font-bold ${v.text}`}>{value}/100</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full rounded-full ${v.bar}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

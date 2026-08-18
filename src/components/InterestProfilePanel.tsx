import { Brain, TrendingUp, GraduationCap, Activity } from 'lucide-react';
import type { StudentProfile, Interaction, InterestNode, SkillLevel } from '@/types';
import { reelMap } from '@/data/reels';
import { getReelVideo } from '@/data/reelImages';

interface Props {
  student: StudentProfile;
  interactions: Interaction[];
  interestProfile: InterestNode[];
  latentInterest: string;
  skillProfile: { topic: string; skillLevel: SkillLevel }[];
}

export default function InterestProfilePanel({
  student,
  interactions,
  interestProfile,
  latentInterest,
  skillProfile,
}: Props) {
  const maxWeight = Math.max(...interestProfile.map((n) => n.weight), 1);

  const totalLiked = interactions.filter((i) => i.liked).length;
  const totalSaved = interactions.filter((i) => i.saved).length;
  const totalShared = interactions.filter((i) => i.shared).length;
  const totalSkipped = interactions.filter((i) => i.skipped).length;
  const avgWatch =
    interactions.length > 0
      ? Math.round(
          interactions.reduce((sum, i) => sum + i.watchPercentage, 0) /
            interactions.length
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Student header */}
      <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${student.gradient} text-lg font-bold text-white shadow-lg`}>
          {student.avatar}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{student.name}</h2>
          <p className="text-sm text-slate-400">{student.bio}</p>
        </div>
      </div>

      {/* Latent Interest */}
      <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-5">
        <div className="mb-2 flex items-center gap-2">
          <Brain className="h-5 w-5 text-cyan-400" />
          <h3 className="text-sm font-semibold text-cyan-400">Inferred Latent Interest</h3>
        </div>
        <p className="text-lg font-bold text-white">{latentInterest}</p>
        <p className="mt-2 text-sm text-slate-400">
          TechTrace AI does not just look at what you watched. It analyzes the semantic meaning,
          context, and engagement patterns across all your interactions to infer your deeper
          underlying technology interests.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Interactions" value={interactions.length} icon={<Activity className="h-4 w-4" />} />
        <StatCard label="Avg Watch" value={`${avgWatch}%`} icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Liked" value={totalLiked} icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Saved" value={totalSaved} icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Shared" value={totalShared} icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Skipped" value={totalSkipped} icon={<TrendingUp className="h-4 w-4" />} />
      </div>

      {/* Interest Profile */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <h3 className="mb-4 text-sm font-semibold text-slate-200">Student Technology Interest Profile</h3>
        <div className="space-y-3">
          {interestProfile.slice(0, 12).map((node, idx) => (
            <div key={node.topic} className="flex items-center gap-3">
              <span className="w-6 text-xs font-bold text-slate-500">#{idx + 1}</span>
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-200">{node.topic}</span>
                  <span className="text-xs text-slate-500">
                    {node.weight.toFixed(1)} · {node.skillLevel} · {node.interactionCount} hits
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${(node.weight / maxWeight) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Levels */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <div className="mb-4 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-200">Estimated Skill Levels</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {skillProfile.map((skill) => (
            <div
              key={skill.topic}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-800/30 px-4 py-3"
            >
              <span className="text-sm font-medium text-slate-300">{skill.topic}</span>
              <SkillBadge level={skill.skillLevel} />
            </div>
          ))}
        </div>
      </div>

      {/* Watch History */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <h3 className="mb-4 text-sm font-semibold text-slate-200">Interaction History</h3>
        <div className="space-y-2">
          {interactions.slice(-10).reverse().map((interaction, idx) => {
            const reel = reelMap[interaction.reelId];
            if (!reel) return null;
            return (
              <div
                key={`${interaction.reelId}-${idx}`}
                className="flex items-center gap-3 rounded-xl border border-slate-800/50 bg-slate-800/20 px-3 py-2"
              >
                <img
                  src={getReelVideo(reel.id, reel.category, idx).poster}
                  alt={reel.title}
                  className="h-10 w-10 shrink-0 rounded-lg object-cover"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-200">{reel.title}</p>
                  <p className="text-xs text-slate-500">
                    {reel.category} · {Math.round(interaction.watchPercentage)}% watched
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {interaction.liked && (
                    <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-400 border border-red-500/20">
                      ❤️ Liked
                    </span>
                  )}
                  {interaction.saved && (
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
                      🔖 Saved
                    </span>
                  )}
                  {interaction.shared && (
                    <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-semibold text-green-400 border border-green-500/20">
                      🔗 Shared
                    </span>
                  )}
                  {interaction.commented && (
                    <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
                      💬 Comment
                    </span>
                  )}
                  {interaction.skipped && (
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                      Skipped
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
      <div className="mb-1 flex items-center gap-1.5 text-slate-500">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  );
}

function SkillBadge({ level }: { level: SkillLevel }) {
  const colors = {
    Beginner: 'bg-green-500/10 text-green-400 border-green-500/20',
    Intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Advanced: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors[level]}`}>
      {level}
    </span>
  );
}

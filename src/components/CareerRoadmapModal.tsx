import {
  X,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Lock,
  Layers,
} from 'lucide-react';
import type { StudentProfile, InterestNode, SkillLevel } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  latentInterest: string;
  interestProfile: InterestNode[];
  skillProfile?: { topic: string; skillLevel: SkillLevel }[];
}

export default function CareerRoadmapModal({
  isOpen,
  onClose,
  student,
  latentInterest,
  interestProfile,
}: Props) {
  if (!isOpen) return null;

  const topTopics = interestProfile.slice(0, 4).map((t) => t.topic);

  // Dynamic roadmap milestones tailored to student's latent interest
  const roadmapSteps = [
    {
      level: 'Stage 1: Core Foundations & Language Mastery',
      status: 'Mastered' as const,
      color: 'border-emerald-500/40 bg-emerald-500/5',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
      topics: [topTopics[0] || 'Core Programming', 'Syntax & Idiomatic Design', 'Data Structures & Algorithmic Complexity'],
      description: 'Solidified programming syntax, basic object-oriented principles, and memory model through curated reels.',
    },
    {
      level: 'Stage 2: Production Services & API Engineering',
      status: 'In Progress' as const,
      color: 'border-cyan-500/50 bg-cyan-500/10 ring-1 ring-cyan-500/30',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      icon: <Sparkles className="h-4 w-4 text-cyan-400 animate-spin" />,
      topics: [topTopics[1] || 'REST APIs', 'Spring Boot / FastAPI Services', 'Database Normalization & Query Tuning'],
      description: 'Currently advancing from passive syntax jokes to hands-on production REST controllers, indexing, and asynchronous APIs.',
    },
    {
      level: 'Stage 3: Distributed Systems & Cloud Architecture',
      status: 'Next Milestone' as const,
      color: 'border-slate-800 bg-slate-900/40',
      badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      icon: <Layers className="h-4 w-4 text-purple-400" />,
      topics: ['Docker & Kubernetes Deployment', 'Message Queues (Kafka/RabbitMQ)', 'Distributed Caching (Redis) & Sharding'],
      description: 'Upcoming recommendation tracks will introduce system design challenges, containerization, and horizontal scalability.',
    },
    {
      level: 'Stage 4: L5+ Senior Engineering & High-Throughput Design',
      status: 'Target Goal' as const,
      color: 'border-slate-800 bg-slate-900/20 opacity-75',
      badge: 'bg-slate-800 text-slate-400 border-slate-700',
      icon: <Lock className="h-4 w-4 text-slate-500" />,
      topics: ['High-Availability Active-Active Clusters', 'Consensus Protocols (Raft/Paxos)', 'Zero-Downtime Microservice Migration'],
      description: 'Long-term career outcome: Preparing for high-scale backend engineering and technical leadership.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md">
      <div className="relative flex h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-950 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/25">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  Personalized Technology Learning Roadmap
                </h2>
                <span className="rounded-full bg-cyan-500/15 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                  Career Trajectory
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transforming casual short-form scrolling into structured engineering milestones
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

        {/* Student Target Banner */}
        <div className="border-b border-slate-800 bg-slate-900/40 p-4 px-6">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Student:</span>
              <span className="font-bold text-white">{student.name}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">Career Goal:</span>
              <span className="font-bold text-cyan-400">{latentInterest}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Estimated Skill Track:</span>
              <span className="font-bold text-emerald-400">Intermediate L4</span>
            </div>
          </div>
        </div>

        {/* Roadmap Milestones */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {roadmapSteps.map((step) => (
            <div
              key={step.level}
              className={`relative rounded-2xl border p-4 space-y-2 transition-all ${step.color}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {step.icon}
                  <h3 className="text-sm font-bold text-white">{step.level}</h3>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${step.badge}`}
                >
                  {step.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {step.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {step.topics.map((t) => (
                  <span
                    key={t}
                    className="rounded-lg bg-black/40 px-2.5 py-1 text-[10px] font-medium text-slate-300 border border-slate-800"
                  >
                    • {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900/80 p-4 px-6">
          <p className="text-xs text-slate-400">
            Recommendations automatically adjust difficulty as you progress through stages.
          </p>
          <button
            onClick={onClose}
            className="rounded-xl bg-cyan-500 px-5 py-2 text-xs font-bold text-white hover:bg-cyan-400 transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}

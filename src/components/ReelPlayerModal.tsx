import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Heart,
  Bookmark,
  Share2,
  MessageCircle,
  Sparkles,
  Shield,
  BookOpen,
  Info,
  Check,
  Send,
  Eye,
} from 'lucide-react';
import type { Reel, Interaction, RecommendationStrategy } from '@/types';
import { getReelVideo } from '@/data/reelImages';
import { getReelMetrics } from '@/lib/metrics';
import { voiceoverEngine } from '@/lib/voiceover';
import TechVisualizer from '@/components/TechVisualizer';
import VoiceoverControlPill from '@/components/VoiceoverControlPill';

interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  gradient?: string;
  text: string;
  timeAgo: string;
  isCurrentUser?: boolean;
}

interface Props {
  reel: Reel | null;
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName?: string;
  studentAvatar?: string;
  studentGradient: string;
  onInteraction: (interaction: Interaction) => void;
  strategy?: RecommendationStrategy;
  whyThisRecommendation?: string;
  interestDetected?: string;
}

export default function ReelPlayerModal({
  reel,
  isOpen,
  onClose,
  studentId,
  studentName = 'Student',
  studentAvatar,
  studentGradient,
  onInteraction,
  strategy,
  whyThisRecommendation,
  interestDetected,
}: Props) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string | undefined>(undefined);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsList, setCommentsList] = useState<CommentItem[]>([
    {
      id: 'c1',
      author: 'Sarah Lin',
      avatar: 'SL',
      gradient: 'from-purple-500 to-indigo-600',
      text: '🔥 This is exactly what I was looking for in production architecture!',
      timeAgo: '3h ago',
    },
    {
      id: 'c2',
      author: 'Vikram Singh',
      avatar: 'VS',
      gradient: 'from-emerald-500 to-teal-600',
      text: 'Great breakdown of the core tradeoffs. Saved for interview review.',
      timeAgo: '1h ago',
    },
    {
      id: 'c3',
      author: 'Elena Rostova',
      avatar: 'ER',
      gradient: 'from-cyan-500 to-blue-600',
      text: 'Clear, concise, and zero fluff. Excellent high-signal engineering Reel!',
      timeAgo: '20m ago',
    },
  ]);
  const [newComment, setNewComment] = useState('');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [replays, setReplays] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Initialize and reset states when a new reel opens
  useEffect(() => {
    if (isOpen && reel) {
      setIsPlaying(true);
      setProgress(0);
      setLiked(false);
      setSaved(false);
      setShared(false);
      setReplays(0);
      setRecorded(false);
      setShowComments(false);
    }
  }, [isOpen, reel]);

  // Robust AI voiceover narration
  useEffect(() => {
    if (!isOpen || !reel || !ttsEnabled) {
      voiceoverEngine.stop();
      return;
    }

    if (isPlaying) {
      voiceoverEngine.speak(reel.transcript, {
        rate: playbackSpeed,
        voiceName: selectedVoiceName,
      });
    } else {
      voiceoverEngine.pause();
    }

    return () => {
      voiceoverEngine.stop();
    };
  }, [isOpen, reel, isPlaying, ttsEnabled, playbackSpeed, selectedVoiceName]);

  const emitInteraction = useCallback(
    (overrides: Partial<Interaction> = {}) => {
      if (!reel) return;
      const currentPct = Math.max(progress, 10);
      const interaction: Interaction = {
        reelId: reel.id,
        studentId,
        watchPercentage: Math.round(currentPct),
        watchDuration: Math.round((currentPct / 100) * reel.duration),
        replays,
        liked,
        saved,
        shared,
        commented: commentsList.length > 3,
        skipped: false,
        followed: false,
        ...overrides,
      };
      onInteraction(interaction);
    },
    [reel, studentId, progress, replays, liked, saved, shared, commentsList, onInteraction]
  );

  const recordInteraction = useCallback(
    (watchPct: number) => {
      if (recorded || !reel) return;
      setRecorded(true);
      emitInteraction({
        watchPercentage: Math.round(watchPct),
        watchDuration: Math.round((watchPct / 100) * reel.duration),
      });
    },
    [recorded, reel, emitInteraction]
  );

  // Progress ticker for smooth realistic 60s/reel timeline
  useEffect(() => {
    if (!isOpen || !isPlaying || !reel) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = 100;
    const stepPct = (intervalMs / (reel.duration * 1000)) * 100 * playbackSpeed;

    timerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        const next = prev + stepPct;
        if (next >= 100) {
          recordInteraction(100);
          return 100;
        }
        return next;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isPlaying, reel, playbackSpeed, recordInteraction]);

  const metrics = useMemo(
    () => (reel ? getReelMetrics(reel, liked, saved, commentsList.length - 3) : null),
    [reel, liked, saved, commentsList.length]
  );

  if (!isOpen || !reel) return null;

  const videoData = getReelVideo(reel.id, reel.category, 0);

  const handleShare = () => {
    setShared(true);
    setShowShareToast(true);
    emitInteraction({ shared: true });
    setTimeout(() => setShowShareToast(false), 2500);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const userComment: CommentItem = {
      id: 'comment-' + Date.now(),
      author: studentName,
      avatar: studentAvatar || studentName.slice(0, 2).toUpperCase(),
      gradient: studentGradient,
      text: newComment.trim(),
      timeAgo: 'Just now',
      isCurrentUser: true,
    };
    setCommentsList((prev) => [...prev, userComment]);
    setNewComment('');
    emitInteraction({ commented: true });
  };

  const handleReplay = () => {
    const nextReplays = replays + 1;
    setReplays(nextReplays);
    setProgress(0);
    setRecorded(false);
    setIsPlaying(true);
    emitInteraction({ replays: nextReplays });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2 sm:p-4 backdrop-blur-md">
      <div className="relative flex h-[92vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
        {/* Left Side: Realistic Reel Player Viewport */}
        <div className="relative aspect-[9/16] h-full max-w-[420px] shrink-0 bg-slate-900 border-r border-slate-800/80">
          {/* Visualizer & High-Tech Animation */}
          <TechVisualizer
            spec={videoData.spec}
            title={reel.title}
            transcript={reel.transcript}
            progress={progress}
            isPlaying={isPlaying}
            category={reel.category}
            difficulty={reel.skillLevel}
          />

          {/* Top Bar Controls */}
          <div className="absolute left-0 right-0 top-3 z-30 flex items-center justify-between px-3">
            <button
              onClick={onClose}
              className="rounded-full bg-black/70 p-2 text-white/90 backdrop-blur-md hover:bg-black/90 transition-colors shadow"
            >
              <X className="h-4 w-4" />
            </button>

            <VoiceoverControlPill
              isEnabled={ttsEnabled}
              onToggle={setTtsEnabled}
              speed={playbackSpeed}
              onSpeedChange={setPlaybackSpeed}
              selectedVoiceName={selectedVoiceName}
              onVoiceChange={setSelectedVoiceName}
            />
          </div>

          {/* Progress Bar (Clickable) */}
          <div
            className="absolute left-0 right-0 top-0 z-40 h-1.5 cursor-pointer bg-white/20"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newPct = (clickX / rect.width) * 100;
              setProgress(newPct);
              emitInteraction({ watchPercentage: Math.round(newPct) });
            }}
          >
            <div
              className="h-full bg-cyan-400 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Educational Score Pill */}
          {reel.educationalValue && (
            <div className="absolute right-3 top-12 z-20 flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-lg backdrop-blur-sm">
              Edu Value: {reel.educationalValue}/100
            </div>
          )}

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/95 via-black/50 to-transparent">
            <div className="mb-2 flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${studentGradient} text-xs font-bold text-white shadow-md`}
              >
                {reel.creator.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-white">@{reel.creator}</p>
                <p className="text-[10px] text-cyan-400 font-medium">{reel.category}</p>
              </div>
            </div>

            <h3 className="text-sm font-bold text-white leading-tight">{reel.title}</h3>
            <p className="mt-1 text-xs text-slate-300 line-clamp-2">{reel.caption}</p>

            <div className="mt-2 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {reel.hashtags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[10px] font-semibold text-cyan-400">
                    {tag}
                  </span>
                ))}
              </div>
              {metrics && (
                <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                  <Eye className="h-3 w-3 text-slate-400" />
                  {metrics.viewsFormatted}
                </span>
              )}
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="absolute bottom-16 right-3 z-30 flex flex-col items-center gap-3">
            <button
              onClick={() => {
                const next = !liked;
                setLiked(next);
                emitInteraction({ liked: next });
              }}
              className="flex flex-col items-center gap-0.5 transition-transform active:scale-90"
              title={liked ? 'Unlike Reel' : 'Like Reel'}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 ${
                  liked
                    ? 'bg-red-500/25 border-2 border-red-500 text-red-500 shadow-lg shadow-red-500/50 scale-110'
                    : 'bg-black/60 text-white hover:bg-black/80'
                }`}
              >
                <Heart
                  className={`h-5 w-5 transition-all ${
                    liked ? 'fill-red-500 text-red-500' : 'text-white'
                  }`}
                />
              </div>
              <span className={`text-[10px] font-bold ${liked ? 'text-red-400 font-extrabold' : 'text-white'}`}>
                {metrics ? metrics.likesFormatted : liked ? '1.4k' : '1.3k'}
              </span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex flex-col items-center gap-0.5 transition-transform active:scale-90"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80">
                <MessageCircle className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-semibold text-white">
                {metrics ? metrics.commentsFormatted : commentsList.length}
              </span>
            </button>

            <button
              onClick={() => {
                const next = !saved;
                setSaved(next);
                emitInteraction({ saved: next });
              }}
              className="flex flex-col items-center gap-0.5 transition-transform active:scale-90"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 ${
                  saved
                    ? 'bg-amber-500/25 border-2 border-amber-500 text-amber-400 shadow-lg shadow-amber-500/50 scale-110'
                    : 'bg-black/60 text-white hover:bg-black/80'
                }`}
              >
                <Bookmark className={`h-5 w-5 ${saved ? 'fill-amber-400 text-amber-400' : ''}`} />
              </div>
              <span className={`text-[10px] font-bold ${saved ? 'text-amber-400 font-extrabold' : 'text-white'}`}>
                {metrics ? metrics.savesFormatted : 'Save'}
              </span>
            </button>

            <button
              onClick={handleShare}
              className="flex flex-col items-center gap-0.5 transition-transform active:scale-90"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80">
                <Share2 className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-semibold text-white">
                {metrics ? metrics.sharesFormatted : 'Share'}
              </span>
            </button>
          </div>

          {/* Central Play/Pause Tap Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 z-20 flex items-center justify-center"
          >
            {!isPlaying && (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md">
                <Play className="h-7 w-7 fill-white translate-x-0.5" />
              </div>
            )}
          </button>

          {/* Comments Drawer Overlay on Left Viewport (Mobile & Direct Tap) */}
          {showComments && (
            <div className="absolute inset-x-0 bottom-0 top-1/4 z-40 flex flex-col rounded-t-3xl border-t border-slate-700 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Discussions ({commentsList.length})
                  </span>
                </div>
                <button
                  onClick={() => setShowComments(false)}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                {commentsList.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/80 p-2.5 text-xs text-slate-300 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-1.5 mb-1">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br ${
                            c.gradient || 'from-cyan-500 to-blue-600'
                          } text-[9px] font-bold text-white shadow-sm`}
                        >
                          {c.avatar}
                        </div>
                        <span className="text-xs font-bold text-white">@{c.author}</span>
                        {c.isCurrentUser && (
                          <span className="rounded-md bg-cyan-500/20 px-1.5 py-0.2 text-[9px] font-extrabold text-cyan-300 border border-cyan-500/30">
                            You
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500">{c.timeAgo}</span>
                    </div>
                    <p className="leading-relaxed font-sans text-slate-200 pl-6">{c.text}</p>
                  </div>
                ))}
              </div>

              {/* Comment Input */}
              <div className="mt-3 flex items-center gap-2 border-t border-slate-800 pt-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${studentGradient} text-[10px] font-bold text-white shrink-0`}
                >
                  {studentAvatar || studentName.slice(0, 2).toUpperCase()}
                </div>
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddComment();
                  }}
                  placeholder={`Comment as @${studentName}...`}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500 text-white shadow-md shadow-cyan-500/20 transition-all hover:bg-cyan-400 disabled:opacity-40"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Explainability, Community Comments & AI Diagnostics */}
        <div className="hidden flex-1 flex-col overflow-y-auto bg-slate-900/60 p-6 md:flex justify-between">
          <div className="space-y-5">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
                  {strategy ? strategy.toUpperCase() : 'AI RECOMMENDATION'}
                </span>
                <span className="text-xs text-slate-400">
                  Duration: {reel.duration}s
                </span>
              </div>

              <h2 className="mt-2 text-xl font-bold text-white">{reel.title}</h2>
              <p className="text-xs text-slate-400 mt-1">{reel.caption}</p>
            </div>

            {/* Why This Was Recommended */}
            <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-4 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Explainable Recommendation Rationale
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-300 font-sans">
                {whyThisRecommendation ||
                  `Selected based on demonstrated interest in ${
                    interestDetected || reel.category
                  }. Bridges foundational principles with production-ready implementations.`}
              </p>
            </div>

            {/* AI Score Breakdown */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-[11px] text-emerald-400">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Edu Value</span>
                </div>
                <p className="mt-1 text-base font-bold text-white">
                  {reel.educationalValue}/100
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-[11px] text-cyan-400">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Credibility</span>
                </div>
                <p className="mt-1 text-base font-bold text-white">
                  {reel.credibility}/100
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-[11px] text-amber-400">
                  <Info className="h-3.5 w-3.5" />
                  <span>Skill Level</span>
                </div>
                <p className="mt-1 text-base font-bold text-white">{reel.skillLevel}</p>
              </div>
            </div>

            {/* Interactive Comments Section */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Community Discussions ({commentsList.length})
              </h4>

              <div className="max-h-44 overflow-y-auto space-y-2 pr-1">
                {commentsList.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-xl bg-slate-900/80 p-2.5 text-xs text-slate-300 border border-slate-800/60"
                  >
                    <div className="flex items-center justify-between gap-1.5 mb-1">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br ${
                            c.gradient || 'from-cyan-500 to-blue-600'
                          } text-[9px] font-bold text-white shadow-sm`}
                        >
                          {c.avatar}
                        </div>
                        <span className="font-semibold text-white">@{c.author}</span>
                        {c.isCurrentUser && (
                          <span className="rounded-md bg-cyan-500/20 px-1.5 py-0.2 text-[9px] font-extrabold text-cyan-300 border border-cyan-500/30">
                            You
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500">{c.timeAgo}</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed pl-6">{c.text}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${studentGradient} text-[10px] font-bold text-white shrink-0`}
                >
                  {studentAvatar || studentName.slice(0, 2).toUpperCase()}
                </div>
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={`Share thoughts as @${studentName}...`}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddComment();
                  }}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="rounded-xl bg-cyan-500 p-2 text-white hover:bg-cyan-400 transition-colors disabled:opacity-40 shadow"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Player Controls */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">
            <button
              onClick={handleReplay}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Replay</span>
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Resume'}</span>
            </button>
          </div>
        </div>

        {/* Share Toast Notification */}
        {showShareToast && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-2xl">
            <Check className="h-4 w-4" />
            <span>Link copied to clipboard! Shared successfully.</span>
          </div>
        )}
      </div>
    </div>
  );
}

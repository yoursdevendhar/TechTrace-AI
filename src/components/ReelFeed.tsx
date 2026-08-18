import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Heart,
  Bookmark,
  Share2,
  MessageCircle,
  SkipForward,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Check,
  Send,
  Eye,
} from 'lucide-react';
import type { Interaction, Reel } from '@/types';
import { reels } from '@/data/reels';
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
  studentId: string;
  studentName?: string;
  studentAvatar?: string;
  studentGradient: string;
  watchedReelIds: Set<string>;
  interactions?: Interaction[];
  onInteraction: (interaction: Interaction) => void;
  onOpenGenerateModal?: () => void;
  customReels?: Reel[];
}

export default function ReelFeed({
  studentId,
  studentName = 'Student',
  studentAvatar,
  studentGradient,
  watchedReelIds,
  interactions = [],
  onInteraction,
  onOpenGenerateModal,
  customReels = [],
}: Props) {
  // Full catalog of reels (custom generated reels prioritized first)
  const allReels = [...customReels, ...reels];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string | undefined>(undefined);
  const [showActions, setShowActions] = useState(false);
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
      text: 'Super clear explanation of the architecture tradeoffs! 🔥',
      timeAgo: '2h ago',
    },
    {
      id: 'c2',
      author: 'David Kim',
      avatar: 'DK',
      gradient: 'from-emerald-500 to-teal-600',
      text: 'Saved for my next production system design review.',
      timeAgo: '45m ago',
    },
  ]);
  const [newComment, setNewComment] = useState('');
  const [followed, setFollowed] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [replays, setReplays] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const timerRef = useRef<number | null>(null);

  const currentReel = allReels[currentIndex] || allReels[0];
  const videoData = currentReel
    ? getReelVideo(currentReel.id, currentReel.category, currentIndex)
    : null;

  const metrics = useMemo(
    () => getReelMetrics(currentReel, liked, saved, commentsList.length - 2),
    [currentReel, liked, saved, commentsList.length]
  );

  // Initialize interaction flags from user's history when reel changes
  useEffect(() => {
    if (!currentReel) return;
    const existing = interactions.find(
      (i) => i.reelId === currentReel.id && i.studentId === studentId
    );
    setProgress(0);
    setLiked(existing ? !!existing.liked : false);
    setSaved(existing ? !!existing.saved : false);
    setShared(existing ? !!existing.shared : false);
    setFollowed(existing ? !!existing.followed : false);
    setReplays(existing ? existing.replays : 0);
    setRecorded(false);
    setShowActions(false);
    setShowComments(false);
    setIsPlaying(true);
  }, [currentIndex, currentReel?.id, studentId]);

  // Robust AI voiceover narration engine
  useEffect(() => {
    if (!currentReel || !ttsEnabled) {
      voiceoverEngine.stop();
      return;
    }

    if (isPlaying) {
      voiceoverEngine.speak(currentReel.transcript, {
        rate: playbackSpeed,
        voiceName: selectedVoiceName,
      });
    } else {
      voiceoverEngine.pause();
    }

    return () => {
      voiceoverEngine.stop();
    };
  }, [currentReel, isPlaying, ttsEnabled, playbackSpeed, selectedVoiceName]);

  const emitInteraction = useCallback(
    (overrides: Partial<Interaction> = {}) => {
      if (!currentReel) return;
      const currentPct = Math.max(progress, 5);
      const interaction: Interaction = {
        reelId: currentReel.id,
        studentId,
        watchPercentage: Math.round(currentPct),
        watchDuration: Math.round((currentPct / 100) * currentReel.duration),
        replays,
        liked,
        saved,
        shared,
        commented: commentsList.length > 2,
        skipped: false,
        followed,
        ...overrides,
      };
      onInteraction(interaction);
    },
    [currentReel, studentId, progress, replays, liked, saved, shared, commentsList, followed, onInteraction]
  );

  const recordInteraction = useCallback(
    (watchPct: number) => {
      if (recorded || !currentReel) return;
      setRecorded(true);
      emitInteraction({
        watchPercentage: Math.round(watchPct),
        watchDuration: Math.round((watchPct / 100) * currentReel.duration),
      });
    },
    [recorded, currentReel, emitInteraction]
  );

  // Progress ticker for reel timeline
  useEffect(() => {
    if (!isPlaying || !currentReel) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = 100;
    const stepPct = (intervalMs / (currentReel.duration * 1000)) * 100 * playbackSpeed;

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
  }, [isPlaying, currentReel, playbackSpeed, recordInteraction]);

  if (!currentReel || !videoData) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center">
        <Sparkles className="h-12 w-12 text-cyan-400" />
        <div>
          <p className="text-lg font-semibold text-white">All reels completed!</p>
          <p className="mt-1 text-sm text-slate-400">
            Generate new AI reels on demand or inspect your personalized recommendations.
          </p>
        </div>
        {onOpenGenerateModal && (
          <button
            onClick={onOpenGenerateModal}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate New AI Reel</span>
          </button>
        )}
      </div>
    );
  }

  function handleToggleLike() {
    const next = !liked;
    setLiked(next);
    setShowActions(true);
    emitInteraction({ liked: next });
  }

  function handleToggleSave() {
    const next = !saved;
    setSaved(next);
    setShowActions(true);
    emitInteraction({ saved: next });
  }

  function handleSkip() {
    if (!recorded) {
      emitInteraction({ skipped: true, watchPercentage: Math.round(progress) });
    }
    setCurrentIndex((i) => (i + 1 < allReels.length ? i + 1 : 0));
  }

  function handleReplay() {
    const nextReplays = replays + 1;
    setReplays(nextReplays);
    setProgress(0);
    setRecorded(false);
    setIsPlaying(true);
    emitInteraction({ replays: nextReplays });
  }

  function handleShare() {
    setShared(true);
    setShowShareToast(true);
    emitInteraction({ shared: true });
    setTimeout(() => setShowShareToast(false), 2500);
  }

  function handleFollow() {
    setFollowed(true);
    emitInteraction({ followed: true });
  }

  function handleAddComment() {
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
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      {/* Quick AI Reel Generation Trigger Bar */}
      {onOpenGenerateModal && (
        <div className="flex items-center justify-between rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-slate-900 p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Looking for something specific?</p>
              <p className="text-[10px] text-slate-400">Generate a realistic AI reel on any topic</p>
            </div>
          </div>

          <button
            onClick={onOpenGenerateModal}
            className="rounded-xl bg-cyan-500 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-cyan-500/20 hover:bg-cyan-400 transition-all"
          >
            + Generate Reel
          </button>
        </div>
      )}

      {/* Main Reel Viewport */}
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
        {/* Animated Tech Code & Visualizer Component */}
        <TechVisualizer
          spec={videoData.spec}
          title={currentReel.title}
          transcript={currentReel.transcript}
          progress={progress}
          isPlaying={isPlaying}
          category={currentReel.category}
          difficulty={currentReel.skillLevel}
        />

        {/* Top Floating Controls */}
        <div className="absolute left-0 right-0 top-3 z-30 flex items-center justify-between px-3">
          <span className="rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-md shadow">
            Reel {currentIndex + 1} / {allReels.length}
          </span>

          <VoiceoverControlPill
            isEnabled={ttsEnabled}
            onToggle={setTtsEnabled}
            speed={playbackSpeed}
            onSpeedChange={setPlaybackSpeed}
            selectedVoiceName={selectedVoiceName}
            onVoiceChange={setSelectedVoiceName}
          />
        </div>

        {/* Seekable Top Progress Bar */}
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

        {/* Educational Value Badge */}
        {currentReel.educationalValue && (
          <div className="absolute right-3 top-12 z-20 flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-lg backdrop-blur-sm">
            Edu Value: {currentReel.educationalValue}/100
          </div>
        )}

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/95 via-black/50 to-transparent">
          <div className="mb-2 flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${studentGradient} text-xs font-bold text-white shadow-md`}
            >
              {currentReel.creator.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold text-white">@{currentReel.creator}</p>
              <p className="text-[10px] text-cyan-400 font-medium">{currentReel.category}</p>
            </div>
          </div>

          <h3 className="text-sm font-bold text-white leading-tight">{currentReel.title}</h3>
          <p className="mt-1 text-xs text-slate-300 line-clamp-2">{currentReel.caption}</p>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {currentReel.hashtags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] font-semibold text-cyan-400">
                  {tag}
                </span>
              ))}
            </div>
            <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
              <Eye className="h-3 w-3 text-slate-400" />
              {metrics.viewsFormatted}
            </span>
          </div>
        </div>

        {/* Right Action Icons Bar */}
        <div className="absolute bottom-16 right-3 z-30 flex flex-col items-center gap-3">
          <button
            onClick={handleToggleLike}
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
              {metrics.likesFormatted}
            </span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex flex-col items-center gap-0.5 transition-transform active:scale-90"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-colors ${
                showComments ? 'bg-cyan-500 text-white' : 'bg-black/60 text-white hover:bg-black/80'
              }`}
            >
              <MessageCircle className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-semibold text-white">
              {metrics.commentsFormatted}
            </span>
          </button>

          <button
            onClick={handleToggleSave}
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
              {metrics.savesFormatted}
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
              {metrics.sharesFormatted}
            </span>
          </button>
        </div>

        {/* Central Play/Pause Tap Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          {!isPlaying && (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md">
              <Play className="h-7 w-7 fill-white translate-x-0.5" />
            </div>
          )}
        </button>

        {/* Comments Drawer Overlay */}
        {showComments && (
          <div className="absolute inset-x-0 bottom-0 top-1/4 z-40 flex flex-col rounded-t-3xl border-t border-slate-700 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl">
            <div className="mb-2 flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Discussions ({commentsList.length})
                </span>
              </div>
              <button
                onClick={() => setShowComments(false)}
                className="text-xs font-bold text-slate-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1">
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

            <div className="mt-2 flex items-center gap-2 border-t border-slate-800 pt-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${studentGradient} text-[10px] font-bold text-white shrink-0`}
              >
                {studentAvatar || studentName.slice(0, 2).toUpperCase()}
              </div>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={`Comment as @${studentName}...`}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddComment();
                }}
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

        {/* Share Toast */}
        {showShareToast && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-2xl">
            <Check className="h-4 w-4" />
            <span>Link copied to clipboard!</span>
          </div>
        )}
      </div>

      {/* Main Feed Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleReplay}
          className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Replay</span>
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        <button
          onClick={handleSkip}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110"
        >
          <SkipForward className="h-3.5 w-3.5" />
          <span>Next Reel</span>
        </button>
      </div>

      {/* Content Analysis & Real-Time Feedback */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          AI Content Analysis
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-500">Topics:</span>
            <p className="text-slate-300 font-medium">{currentReel.topics.join(', ')}</p>
          </div>
          <div>
            <span className="text-slate-500">Skill Level:</span>
            <p className="text-slate-300 font-medium">{currentReel.skillLevel}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <ScoreBar label="Hype" value={currentReel.hypeScore} color="red" />
          <ScoreBar label="Edu Value" value={currentReel.educationalValue} color="emerald" />
          <ScoreBar label="Credibility" value={currentReel.credibility} color="cyan" />
        </div>
      </div>

      <p className="text-center text-[11px] text-slate-500">
        Reel {currentIndex + 1} of {allReels.length} available
      </p>
    </div>
  );
}

function ScoreBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: 'red' | 'emerald' | 'cyan';
}) {
  const colorMap = {
    red: 'bg-red-500',
    emerald: 'bg-emerald-500',
    cyan: 'bg-cyan-500',
  };
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[10px]">
        <span className="text-slate-500">{label}</span>
        <span className="font-semibold text-slate-300">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full rounded-full ${colorMap[color]}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

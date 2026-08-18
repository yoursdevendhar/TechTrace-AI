import { useState, useEffect, useCallback, useMemo } from 'react';
import { Sparkles, RotateCw, Wand2 } from 'lucide-react';
import { students, seededInteractions } from '@/data/students';
import { reelMap, reels } from '@/data/reels';
import type { Interaction, Recommendation, Reel, StudentProfile } from '@/types';
import { supabase } from '@/lib/supabase';
import {
  generateRecommendations,
  buildInterestProfile,
  getLatentInterest,
  getSkillProfile,
  getInterestGraphData,
} from '@/lib/engine';
import StudentSelector from '@/components/StudentSelector';
import ReelFeed from '@/components/ReelFeed';
import InterestProfilePanel from '@/components/InterestProfilePanel';
import RecommendationPanel from '@/components/RecommendationPanel';
import InterestGraph from '@/components/InterestGraph';
import GenerateReelModal from '@/components/GenerateReelModal';
import AlgorithmComparisonModal from '@/components/AlgorithmComparisonModal';
import ExportReportModal from '@/components/ExportReportModal';
import CareerRoadmapModal from '@/components/CareerRoadmapModal';
import ProfileModal from '@/components/ProfileModal';
import type { GeneratedReelResult } from '@/lib/generator';

type Tab = 'feed' | 'profile' | 'recommendations' | 'graph';

const CUSTOM_STUDENTS_KEY = 'techtrace_custom_students';

export default function App() {
  const [customStudents, setCustomStudents] = useState<StudentProfile[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_STUDENTS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const allStudents = useMemo(
    () => [...students, ...customStudents],
    [customStudents]
  );

  const [selectedStudentId, setSelectedStudentId] = useState(() => allStudents[0]?.id || 'arjun');
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [customReels, setCustomReels] = useState<Reel[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('feed');
  const [loading, setLoading] = useState(true);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const selectedStudent: StudentProfile = useMemo(
    () => allStudents.find((s) => s.id === selectedStudentId) || allStudents[0],
    [allStudents, selectedStudentId]
  );

  const loadInteractions = useCallback(async (studentId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('interactions')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      const seeded = seededInteractions[studentId] || [];
      setInteractions(seeded);
      if (seeded.length > 0 && !error) {
        await supabase.from('interactions').insert(
          seeded.map((i) => ({
            student_id: i.studentId,
            reel_id: i.reelId,
            watch_percentage: i.watchPercentage,
            watch_duration: i.watchDuration,
            replays: i.replays,
            liked: i.liked,
            saved: i.saved,
            shared: i.shared,
            commented: i.commented,
            skipped: i.skipped,
            followed: i.followed,
          }))
        );
      }
    } else {
      const mapped: Interaction[] = data.map((row) => ({
        id: row.id,
        reelId: row.reel_id,
        studentId: row.student_id,
        watchPercentage: Number(row.watch_percentage),
        watchDuration: Number(row.watch_duration),
        replays: row.replays,
        liked: row.liked,
        saved: row.saved,
        shared: row.shared,
        commented: row.commented,
        skipped: row.skipped,
        followed: row.followed,
        createdAt: row.created_at,
      }));
      setInteractions(mapped);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadInteractions(selectedStudentId);
  }, [selectedStudentId, loadInteractions]);

  // Update recommendations whenever interactions or customReels change
  useEffect(() => {
    if (interactions.length > 0) {
      const recs = generateRecommendations(interactions, {
        count: 8,
        customReels,
      });
      setRecommendations(recs);
    } else {
      // Fallback baseline recommendations if no interaction
      const recs = generateRecommendations(
        seededInteractions[selectedStudentId] || [],
        { count: 8, customReels }
      );
      setRecommendations(recs);
    }
  }, [interactions, customReels, selectedStudentId]);

  const handleInteraction = useCallback(
    async (interaction: Interaction) => {
      // Register custom reel in reelMap if it's new
      const foundCustom = customReels.find((r) => r.id === interaction.reelId);
      if (foundCustom && !reelMap[foundCustom.id]) {
        reelMap[foundCustom.id] = foundCustom;
      }

      setInteractions((prev) => {
        const existingIdx = prev.findIndex(
          (i) => i.reelId === interaction.reelId && i.studentId === interaction.studentId
        );
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            ...interaction,
            watchPercentage: Math.max(
              updated[existingIdx].watchPercentage,
              interaction.watchPercentage
            ),
            watchDuration: Math.max(
              updated[existingIdx].watchDuration,
              interaction.watchDuration
            ),
            replays: Math.max(updated[existingIdx].replays, interaction.replays),
          };
          return updated;
        } else {
          return [...prev, interaction];
        }
      });

      try {
        await supabase.from('interactions').upsert(
          {
            student_id: interaction.studentId,
            reel_id: interaction.reelId,
            watch_percentage: interaction.watchPercentage,
            watch_duration: interaction.watchDuration,
            replays: interaction.replays,
            liked: interaction.liked,
            saved: interaction.saved,
            shared: interaction.shared,
            commented: interaction.commented,
            skipped: interaction.skipped,
            followed: interaction.followed,
          },
          { onConflict: 'student_id,reel_id' }
        );
      } catch (e) {
        // Safe fallback - local state is already updated seamlessly
      }
    },
    [customReels]
  );

  const handleResetStudent = useCallback(async () => {
    await supabase.from('interactions').delete().eq('student_id', selectedStudentId);
    const seeded = seededInteractions[selectedStudentId] || [];
    setInteractions(seeded);
    await supabase.from('interactions').insert(
      seeded.map((i) => ({
        student_id: i.studentId,
        reel_id: i.reelId,
        watch_percentage: i.watchPercentage,
        watch_duration: i.watchDuration,
        replays: i.replays,
        liked: i.liked,
        saved: i.saved,
        shared: i.shared,
        commented: i.commented,
        skipped: i.skipped,
        followed: i.followed,
      }))
    );
  }, [selectedStudentId]);

  const handleCreateStudent = useCallback((newStudent: StudentProfile, initialInteractions?: Interaction[]) => {
    setCustomStudents((prev) => {
      const updated = [...prev, newStudent];
      try {
        localStorage.setItem(CUSTOM_STUDENTS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    if (initialInteractions && initialInteractions.length > 0) {
      seededInteractions[newStudent.id] = initialInteractions;
      setInteractions(initialInteractions);
    } else {
      seededInteractions[newStudent.id] = [];
      setInteractions([]);
    }
    setSelectedStudentId(newStudent.id);
  }, []);

  const handleDeleteStudent = useCallback((studentId: string) => {
    setCustomStudents((prev) => {
      const updated = prev.filter((s) => s.id !== studentId);
      try {
        localStorage.setItem(CUSTOM_STUDENTS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    if (selectedStudentId === studentId) {
      setSelectedStudentId(students[0].id);
    }
  }, [selectedStudentId]);

  const handleReelGenerated = useCallback((result: GeneratedReelResult) => {
    reelMap[result.reel.id] = result.reel;
    setCustomReels((prev) => [result.reel, ...prev]);
    setActiveTab('feed');
  }, []);

  const handleRefreshRecommendations = useCallback(() => {
    const recs = generateRecommendations(interactions, {
      count: 8,
      customReels,
    });
    setRecommendations(recs);
  }, [interactions, customReels]);

  const interestProfile = useMemo(
    () => (interactions.length > 0 ? buildInterestProfile(interactions) : []),
    [interactions]
  );
  const latentInterest = useMemo(
    () => (interactions.length > 0 ? getLatentInterest(interactions) : 'General Technology'),
    [interactions]
  );
  const skillProfile = useMemo(
    () => (interactions.length > 0 ? getSkillProfile(interactions) : []),
    [interactions]
  );
  const graphData = useMemo(
    () => (interactions.length > 0 ? getInterestGraphData(interactions) : { nodes: [], edges: [] }),
    [interactions]
  );

  const watchedReelIds = useMemo(() => new Set(interactions.map((i) => i.reelId)), [interactions]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
                <span className="text-lg font-black text-white">T</span>
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white">
                  TechTrace<span className="text-cyan-400"> AI</span>
                </h1>
                <p className="hidden text-xs text-slate-400 sm:block">
                  Explainable AI Content Recommendations & Studio
                </p>
              </div>
            </div>

            <nav className="hidden items-center gap-1 md:flex">
              {([
                { id: 'feed', label: 'Reel Feed' },
                { id: 'profile', label: 'Interest Profile' },
                { id: 'recommendations', label: 'Recommendations' },
                { id: 'graph', label: 'Interest Graph' },
              ] as { id: Tab; label: string }[]).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-cyan-500/15 text-cyan-400 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                  {tab.id === 'recommendations' && recommendations.length > 0 && (
                    <span className="ml-1.5 rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] text-cyan-300 font-bold">
                      {recommendations.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {/* Active User Account Switcher Button */}
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-800/70 px-2.5 py-1.5 transition-all hover:border-cyan-500/50 hover:bg-slate-800"
                title="Switch or Create Account"
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br ${selectedStudent.gradient} text-[10px] font-black text-white`}
                >
                  {selectedStudent.avatar}
                </div>
                <span className="hidden sm:inline text-xs font-bold text-slate-200">
                  {selectedStudent.name.split(' ')[0]}
                </span>
              </button>

              {/* Trap Analysis Evaluator Button */}
              <button
                onClick={() => setIsComparisonModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300 shadow-md shadow-amber-500/10 transition-all hover:bg-amber-500/20 active:scale-95"
                title="Built-In Trap: Shallow vs. TechTrace AI Comparison"
              >
                <span>⚡ Trap Analysis</span>
              </button>

              {/* AI Reel Studio Generator Button */}
              <button
                onClick={() => setIsGenerateModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 transition-all hover:brightness-110 hover:shadow-cyan-500/30 active:scale-95"
              >
                <Sparkles className="h-4 w-4" />
                <span>AI Reel Studio</span>
              </button>

              <button
                onClick={handleResetStudent}
                className="hidden rounded-xl border border-slate-700/80 bg-slate-800/50 px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:border-slate-600 hover:text-slate-200 sm:block"
                title="Reset student profile interactions to default"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Mobile tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto pb-2 md:hidden">
            {([
              { id: 'feed', label: 'Feed' },
              { id: 'profile', label: 'Profile' },
              { id: 'recommendations', label: 'Recs' },
              { id: 'graph', label: 'Graph' },
            ] as { id: Tab; label: string }[]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/15 text-cyan-400'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Student Selector Bar */}
      <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <StudentSelector
            students={allStudents}
            selectedId={selectedStudentId}
            onSelect={setSelectedStudentId}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
          />
          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500">Detected Latent Interest:</span>
            <span className="font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
              {latentInterest}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">{interactions.length} interactions logged</span>
            {customReels.length > 0 && (
              <>
                <span className="text-slate-600">·</span>
                <span className="text-emerald-400 font-medium">
                  +{customReels.length} AI Synthesized Reels
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-500" />
          </div>
        ) : (
          <>
            {activeTab === 'feed' && (
              <ReelFeed
                studentId={selectedStudentId}
                studentName={selectedStudent.name}
                studentAvatar={selectedStudent.avatar}
                studentGradient={selectedStudent.gradient}
                watchedReelIds={watchedReelIds}
                interactions={interactions}
                onInteraction={handleInteraction}
                onOpenGenerateModal={() => setIsGenerateModalOpen(true)}
                customReels={customReels}
              />
            )}
            {activeTab === 'profile' && (
              <InterestProfilePanel
                student={selectedStudent}
                interactions={interactions}
                interestProfile={interestProfile}
                latentInterest={latentInterest}
                skillProfile={skillProfile}
              />
            )}
            {activeTab === 'recommendations' && (
              <RecommendationPanel
                recommendations={recommendations}
                studentId={selectedStudentId}
                studentName={selectedStudent.name}
                studentAvatar={selectedStudent.avatar}
                studentGradient={selectedStudent.gradient}
                latentInterest={latentInterest}
                onInteraction={handleInteraction}
                onOpenGenerateModal={() => setIsGenerateModalOpen(true)}
                onRefresh={handleRefreshRecommendations}
                onOpenComparisonModal={() => setIsComparisonModalOpen(true)}
                onOpenExportModal={() => setIsExportModalOpen(true)}
                onOpenRoadmapModal={() => setIsRoadmapModalOpen(true)}
              />
            )}
            {activeTab === 'graph' && <InterestGraph graphData={graphData} />}
          </>
        )}
      </main>

      {/* AI Reel Studio Generation Modal */}
      <GenerateReelModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        student={selectedStudent}
        latentInterest={latentInterest}
        onReelGenerated={handleReelGenerated}
      />

      {/* Built-in Trap Comparison Modal */}
      <AlgorithmComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        student={selectedStudent}
        latentInterest={latentInterest}
        interactions={interactions}
        smartRecommendations={recommendations}
        customReels={customReels}
      />

      {/* Official Audit Report Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        student={selectedStudent}
        latentInterest={latentInterest}
        interactions={interactions}
        recommendations={recommendations}
      />

      {/* Learning & Career Roadmap Modal */}
      <CareerRoadmapModal
        isOpen={isRoadmapModalOpen}
        onClose={() => setIsRoadmapModalOpen(false)}
        student={selectedStudent}
        latentInterest={latentInterest}
        interestProfile={interestProfile}
        skillProfile={skillProfile}
      />

      {/* Dynamic Profile Manager & Account Switcher Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentStudent={selectedStudent}
        allStudents={allStudents}
        onSelectStudent={setSelectedStudentId}
        onCreateStudent={handleCreateStudent}
        onDeleteStudent={handleDeleteStudent}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 mt-12">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
          TechTrace AI — Transforming passive scrolling into personalized, realistic technology discovery
        </div>
      </footer>
    </div>
  );
}

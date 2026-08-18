import { useState } from 'react';
import {
  Sparkles,
  X,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Code2,
  Shield,
  BookOpen,
} from 'lucide-react';
import type { StudentProfile, Reel } from '@/types';
import {
  generateRealisticReel,
  topicSuggestionsByInterest,
  type GeneratedReelResult,
} from '@/lib/generator';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  latentInterest: string;
  onReelGenerated: (generated: GeneratedReelResult) => void;
}

export default function GenerateReelModal({
  isOpen,
  onClose,
  student,
  latentInterest,
  onReelGenerated,
}: Props) {
  const [topicPrompt, setTopicPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [generatedResult, setGeneratedResult] = useState<GeneratedReelResult | null>(null);

  if (!isOpen) return null;

  // Determine suggestions matching student's interest
  const relevantCategory = Object.keys(topicSuggestionsByInterest).find((k) =>
    latentInterest.toLowerCase().includes(k.toLowerCase())
  ) || 'Backend';
  const suggestions = topicSuggestionsByInterest[relevantCategory] || topicSuggestionsByInterest['Backend'];

  const handleGenerate = async (promptToUse?: string) => {
    const query = promptToUse || topicPrompt;
    if (!query.trim() || isGenerating) return;

    setIsGenerating(true);
    setGeneratedResult(null);
    setCurrentStepIndex(0);

    const result = generateRealisticReel(query, student, latentInterest);

    // Realistic step-by-step pipeline animation
    for (let i = 0; i < result.generationSteps.length; i++) {
      setCurrentStepIndex(i);
      await new Promise((r) => setTimeout(r, 600));
    }

    setGeneratedResult(result);
    setIsGenerating(false);
  };

  const handleApply = () => {
    if (generatedResult) {
      onReelGenerated(generatedResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Realistic Reel Studio</h2>
              <p className="text-xs text-slate-400">
                Generate explainable, high-fidelity technology reels tailored to {student.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Prompt input */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Topic or Technology Concept
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={topicPrompt}
                onChange={(e) => setTopicPrompt(e.target.value)}
                placeholder="e.g. Distributed Tracing in Microservices, Rust Memory Safety, RAG Vector Search"
                disabled={isGenerating}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleGenerate();
                }}
              />
              <button
                onClick={() => handleGenerate()}
                disabled={!topicPrompt.trim() || isGenerating}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:brightness-110 disabled:opacity-50"
              >
                {isGenerating ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Suggestions */}
          {!isGenerating && !generatedResult && (
            <div>
              <p className="mb-2 text-xs font-medium text-slate-500">
                Recommended for <span className="text-cyan-400 font-semibold">{latentInterest}</span>:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setTopicPrompt(suggestion);
                      handleGenerate(suggestion);
                    }}
                    className="rounded-lg border border-slate-800 bg-slate-800/40 px-3 py-1.5 text-xs text-slate-300 transition-all hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Generation Progress Pipeline */}
          {isGenerating && (
            <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/60 p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                <Cpu className="h-4 w-4 animate-spin text-cyan-400" />
                <span>AI SYNTHESIS PIPELINE IN PROGRESS...</span>
              </div>

              <div className="space-y-2">
                {[
                  'Profile & Latent Interest Ingestion',
                  'High-Fidelity Code & Architecture Synthesis',
                  'Compiling Terminal Execution Logs & Telemetry',
                  'Explainable AI Audit & Hype-Filter Verification',
                  'Publishing to Suggested Feed',
                ].map((step, idx) => {
                  const isDone = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div
                      key={step}
                      className={`flex items-center gap-2.5 text-xs transition-all duration-300 ${
                        isCurrent
                          ? 'font-semibold text-cyan-300'
                          : isDone
                          ? 'text-slate-400'
                          : 'text-slate-600'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-slate-700 bg-slate-800" />
                      )}
                      <span>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Generated Result Preview */}
          {generatedResult && (
            <div className="rounded-2xl border border-emerald-500/30 bg-slate-950/80 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Reel Successfully Synthesized!
                  </span>
                </div>
                <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-400 border border-cyan-500/20">
                  {generatedResult.reel.category}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">
                  {generatedResult.reel.title}
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  {generatedResult.reel.caption}
                </p>
              </div>

              {/* Code snippet preview */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3">
                <div className="mb-2 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1 text-cyan-400">
                    <Code2 className="h-3.5 w-3.5" />
                    <span>Synthesized Source Code</span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {generatedResult.spec.language}
                  </span>
                </div>
                <pre className="max-h-28 overflow-x-auto overflow-y-auto font-mono text-[11px] text-slate-300">
                  <code>{generatedResult.spec.codeSnippet}</code>
                </pre>
              </div>

              {/* AI Scores */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
                  <div className="flex items-center justify-center gap-1 text-[11px] text-emerald-400">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Edu Value</span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-white">
                    {generatedResult.reel.educationalValue}/100
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
                  <div className="flex items-center justify-center gap-1 text-[11px] text-cyan-400">
                    <Shield className="h-3.5 w-3.5" />
                    <span>Credibility</span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-white">
                    {generatedResult.reel.credibility}/100
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
                  <div className="flex items-center justify-center gap-1 text-[11px] text-amber-400">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Difficulty</span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-white">
                    {generatedResult.reel.skillLevel}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleGenerate()}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Regenerate
                </button>
                <button
                  onClick={handleApply}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:brightness-110"
                >
                  <span>Add & Watch Now</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

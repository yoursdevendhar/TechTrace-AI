import { useState } from 'react';
import {
  X,
  UserPlus,
  Users,
  Check,
  Trash2,
  UserCheck,
  LogIn,
} from 'lucide-react';
import type { StudentProfile, Interaction } from '@/types';
import { seededInteractions } from '@/data/students';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentStudent: StudentProfile;
  allStudents: StudentProfile[];
  onSelectStudent: (id: string) => void;
  onCreateStudent: (newProfile: StudentProfile, initialInteractions?: Interaction[]) => void;
  onDeleteStudent?: (id: string) => void;
}

const GRADIENT_PRESETS = [
  { label: 'Cyan / Blue', value: 'from-cyan-500 to-blue-600' },
  { label: 'Sunset Orange', value: 'from-orange-500 to-red-500' },
  { label: 'Emerald Matrix', value: 'from-emerald-500 to-teal-600' },
  { label: 'Violet Cyber', value: 'from-violet-500 to-purple-600' },
  { label: 'Rose Gold', value: 'from-pink-500 to-rose-500' },
  { label: 'Amber Flame', value: 'from-amber-500 to-yellow-600' },
];

const STARTER_TRACKS = [
  { id: 'blank', label: 'Blank Slate (Discover from scratch)', desc: 'Zero previous watch history — builds profile dynamically from your very first reel.' },
  { id: 'backend', label: 'Backend & Cloud Track', desc: 'Pre-seeded with Java, Spring Boot, and REST API interactions.' },
  { id: 'ai', label: 'AI & Data Science Track', desc: 'Pre-seeded with Python, Neural Networks, and RAG interactions.' },
  { id: 'dsa', label: 'DSA & Interview Track', desc: 'Pre-seeded with Binary Search, Dynamic Programming, and Two Sum.' },
  { id: 'security', label: 'Cybersecurity Track', desc: 'Pre-seeded with SQL Injection, XSS, and Network Security.' },
];

export default function ProfileModal({
  isOpen,
  onClose,
  currentStudent,
  allStudents,
  onSelectStudent,
  onCreateStudent,
  onDeleteStudent,
}: Props) {
  const [tab, setTab] = useState<'switch' | 'create'>('switch');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [gradient, setGradient] = useState(GRADIENT_PRESETS[0].value);
  const [starterTrack, setStarterTrack] = useState('blank');
  const [avatarText, setAvatarText] = useState('');

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!avatarText || avatarText.length <= 2) {
      const parts = val.trim().split(' ');
      if (parts.length >= 2) {
        setAvatarText(`${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase());
      } else if (val.trim().length > 0) {
        setAvatarText(val.trim().slice(0, 2).toUpperCase());
      }
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const avatar = avatarText.trim() || name.trim().slice(0, 2).toUpperCase();

    const newStudent: StudentProfile = {
      id,
      name: name.trim(),
      bio: bio.trim() || 'Software & technology enthusiast',
      avatar,
      gradient,
    };

    let initialInteractions: Interaction[] | undefined;
    if (starterTrack === 'backend') {
      initialInteractions = (seededInteractions['arjun'] || []).map((i) => ({
        ...i,
        studentId: id,
      }));
    } else if (starterTrack === 'ai') {
      initialInteractions = (seededInteractions['priya'] || []).map((i) => ({
        ...i,
        studentId: id,
      }));
    } else if (starterTrack === 'dsa') {
      initialInteractions = (seededInteractions['sneha'] || []).map((i) => ({
        ...i,
        studentId: id,
      }));
    } else if (starterTrack === 'security') {
      initialInteractions = (seededInteractions['karan'] || []).map((i) => ({
        ...i,
        studentId: id,
      }));
    } else {
      initialInteractions = [];
    }

    onCreateStudent(newStudent, initialInteractions);
    onSelectStudent(id);
    setName('');
    setBio('');
    setAvatarText('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md"
    >
      <div className="relative flex h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-950 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25">
              <Users className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="profile-modal-title" className="text-base font-bold text-white">
                Dynamic Profile Manager & Single-User Session
              </h2>
              <p className="text-xs text-slate-400">
                Log in as an individual student. Only one person watches and builds a profile at a time.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close profile manager modal"
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 p-2">
          <button
            onClick={() => setTab('switch')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all ${
              tab === 'switch'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="h-4 w-4" />
            <span>Switch / Select Profile ({allStudents.length})</span>
          </button>

          <button
            onClick={() => setTab('create')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all ${
              tab === 'create'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            <span>+ Create New Student Account</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {tab === 'switch' ? (
            <div className="space-y-4">
              {/* Currently Active User Banner */}
              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${currentStudent.gradient} text-sm font-black text-white shadow-lg`}
                    >
                      {currentStudent.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{currentStudent.name}</h3>
                        <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                          <UserCheck className="h-3 w-3" /> Active Session
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{currentStudent.bio}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Available Accounts (Click to Log In As):
                </p>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {allStudents.map((s) => {
                    const isSelected = s.id === currentStudent.id;
                    const isCustom = s.id.startsWith('user_');

                    return (
                      <div
                        key={s.id}
                        className={`group relative flex items-center justify-between rounded-2xl border p-3 transition-all ${
                          isSelected
                            ? 'border-cyan-500/60 bg-cyan-500/15 shadow-lg shadow-cyan-500/10'
                            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <button
                          onClick={() => {
                            onSelectStudent(s.id);
                            onClose();
                          }}
                          className="flex flex-1 items-center gap-3 text-left"
                        >
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} text-xs font-bold text-white shadow-md`}
                          >
                            {s.avatar}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <p className="truncate text-xs font-bold text-white">{s.name}</p>
                              {isSelected && (
                                <Check className="h-3.5 w-3.5 text-cyan-400" />
                              )}
                            </div>
                            <p className="truncate text-[11px] text-slate-400">{s.bio}</p>
                          </div>
                        </button>

                        {isCustom && onDeleteStudent && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteStudent(s.id);
                            }}
                            className="ml-2 rounded-lg p-1.5 text-slate-500 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                            title="Delete custom profile"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreate} className="space-y-4">
              {/* Profile Name & Avatar */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Avatar Initials
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={avatarText}
                    onChange={(e) => setAvatarText(e.target.value.toUpperCase())}
                    placeholder="AJ"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-center text-xs font-bold text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Bio / Learning Focus
                </label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. 2nd year student exploring fullstack and systems engineering"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Gradient Preset */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Profile Avatar Color Theme
                </label>
                <div className="flex flex-wrap gap-2">
                  {GRADIENT_PRESETS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setGradient(p.value)}
                      className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs transition-all ${
                        gradient === p.value
                          ? 'border-cyan-400 bg-slate-800 text-white ring-1 ring-cyan-400'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400'
                      }`}
                    >
                      <div className={`h-3 w-3 rounded-full bg-gradient-to-br ${p.value}`} />
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Initial Track Seed */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Initial Watch History Starter Baseline
                </label>
                <div className="space-y-1.5">
                  {STARTER_TRACKS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setStarterTrack(t.id)}
                      className={`w-full rounded-xl border p-2.5 text-left transition-all ${
                        starterTrack === t.id
                          ? 'border-cyan-500 bg-cyan-500/10 text-white'
                          : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">{t.label}</span>
                        {starterTrack === t.id && (
                          <Check className="h-3.5 w-3.5 text-cyan-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:brightness-110 disabled:opacity-50"
              >
                Create Account & Start Session
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

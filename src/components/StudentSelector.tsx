import { UserPlus, ChevronRight } from 'lucide-react';
import type { StudentProfile } from '@/types';

interface Props {
  students: StudentProfile[];
  selectedId: string;
  onSelect: (id: string) => void;
  onOpenProfileModal?: () => void;
}

export default function StudentSelector({
  students,
  selectedId,
  onSelect,
  onOpenProfileModal,
}: Props) {
  const currentStudent = students.find((s) => s.id === selectedId) || students[0];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* Active User Session Pill */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenProfileModal}
          className="flex items-center gap-2.5 rounded-2xl border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-2 transition-all hover:bg-cyan-500/20 shadow-md shadow-cyan-500/10 group"
          title="Click to manage accounts and switch profile"
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${currentStudent.gradient} text-xs font-black text-white shadow`}
          >
            {currentStudent.avatar}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white group-hover:text-cyan-300">
                {currentStudent.name}
              </span>
              <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                Logged In
              </span>
            </div>
            <p className="text-[10px] text-slate-400 max-w-[220px] truncate">
              {currentStudent.bio}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform ml-1" />
        </button>

        {onOpenProfileModal && (
          <button
            onClick={onOpenProfileModal}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">+ Create Profile</span>
          </button>
        )}
      </div>

      {/* Quick Profile Carousel / Switcher */}
      <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
        <span className="text-[11px] font-semibold text-slate-500 mr-1 shrink-0">
          Quick Switch:
        </span>
        {students.map((student) => {
          const isSelected = selectedId === student.id;

          return (
            <button
              key={student.id}
              onClick={() => onSelect(student.id)}
              aria-pressed={isSelected}
              aria-label={`Switch to student profile ${student.name}`}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                isSelected
                  ? 'border-cyan-500 bg-cyan-500/20 text-white font-bold ring-1 ring-cyan-500/40'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br ${student.gradient} text-[10px] font-bold text-white`}
              >
                {student.avatar}
              </div>
              <span className="truncate max-w-[90px]">{student.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

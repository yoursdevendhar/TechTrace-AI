import type { StudentProfile, Interaction } from '@/types';

export const students: StudentProfile[] = [
  {
    id: 'arjun',
    name: 'Arjun Sharma',
    avatar: 'AS',
    bio: 'CS student exploring backend engineering',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 'priya',
    name: 'Priya Patel',
    avatar: 'PP',
    bio: 'Curious about AI and machine learning',
    gradient: 'from-cyan-500 to-teal-500',
  },
  {
    id: 'rahul',
    name: 'Rahul Verma',
    avatar: 'RV',
    bio: 'Gamer getting into hardware and tech',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    id: 'sneha',
    name: 'Sneha Reddy',
    avatar: 'SR',
    bio: 'Beginner programmer preparing for interviews',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    id: 'karan',
    name: 'Karan Singh',
    avatar: 'KS',
    bio: 'Security enthusiast and ethical hacker',
    gradient: 'from-red-500 to-orange-500',
  },
];

export const seededInteractions: Record<string, Interaction[]> = {
  arjun: [
    { reelId: 'j001', studentId: 'arjun', watchPercentage: 100, watchDuration: 15, replays: 2, liked: true, saved: false, shared: false, commented: false, skipped: false, followed: false },
    { reelId: 'ca001', studentId: 'arjun', watchPercentage: 100, watchDuration: 10, replays: 1, liked: true, saved: false, shared: true, commented: false, skipped: false, followed: false },
    { reelId: 'ca002', studentId: 'arjun', watchPercentage: 90, watchDuration: 27, replays: 0, liked: true, saved: true, shared: false, commented: false, skipped: false, followed: true },
    { reelId: 'h003', studentId: 'arjun', watchPercentage: 85, watchDuration: 38, replays: 0, liked: false, saved: false, shared: false, commented: false, skipped: false, followed: false },
    { reelId: 'b001', studentId: 'arjun', watchPercentage: 95, watchDuration: 71, replays: 1, liked: true, saved: true, shared: false, commented: true, skipped: false, followed: false },
    { reelId: 'j002', studentId: 'arjun', watchPercentage: 80, watchDuration: 48, replays: 0, liked: false, saved: true, shared: false, commented: false, skipped: false, followed: false },
    { reelId: 'm001', studentId: 'arjun', watchPercentage: 100, watchDuration: 10, replays: 3, liked: true, saved: false, shared: true, commented: false, skipped: false, followed: false },
  ],
  priya: [
    { reelId: 'a004', studentId: 'priya', watchPercentage: 100, watchDuration: 90, replays: 1, liked: true, saved: true, shared: false, commented: true, skipped: false, followed: true },
    { reelId: 'p003', studentId: 'priya', watchPercentage: 85, watchDuration: 76, replays: 0, liked: true, saved: false, shared: false, commented: false, skipped: false, followed: false },
    { reelId: 'a001', studentId: 'priya', watchPercentage: 95, watchDuration: 85, replays: 2, liked: true, saved: true, shared: true, commented: false, skipped: false, followed: true },
    { reelId: 'p001', studentId: 'priya', watchPercentage: 60, watchDuration: 36, replays: 0, liked: false, saved: false, shared: false, commented: false, skipped: false, followed: false },
    { reelId: 'n001', studentId: 'priya', watchPercentage: 90, watchDuration: 54, replays: 0, liked: true, saved: false, shared: false, commented: false, skipped: false, followed: false },
    { reelId: 'a006', studentId: 'priya', watchPercentage: 100, watchDuration: 30, replays: 0, liked: true, saved: false, shared: true, commented: false, skipped: false, followed: false },
    { reelId: 'p006', studentId: 'priya', watchPercentage: 75, watchDuration: 56, replays: 0, liked: false, saved: true, shared: false, commented: false, skipped: false, followed: false },
  ],
  rahul: [
    { reelId: 'g001', studentId: 'rahul', watchPercentage: 100, watchDuration: 30, replays: 2, liked: true, saved: false, shared: true, commented: false, skipped: false, followed: true },
    { reelId: 'h002', studentId: 'rahul', watchPercentage: 90, watchDuration: 40, replays: 1, liked: true, saved: true, shared: false, commented: true, skipped: false, followed: false },
    { reelId: 'h001', studentId: 'rahul', watchPercentage: 85, watchDuration: 51, replays: 0, liked: true, saved: true, shared: false, commented: false, skipped: false, followed: false },
    { reelId: 'g002', studentId: 'rahul', watchPercentage: 95, watchDuration: 28, replays: 0, liked: true, saved: false, shared: false, commented: false, skipped: false, followed: true },
    { reelId: 'n001', studentId: 'rahul', watchPercentage: 70, watchDuration: 42, replays: 0, liked: false, saved: false, shared: false, commented: false, skipped: false, followed: false },
    { reelId: 'a002', studentId: 'rahul', watchPercentage: 80, watchDuration: 60, replays: 0, liked: true, saved: true, shared: false, commented: false, skipped: false, followed: false },
    { reelId: 'g003', studentId: 'rahul', watchPercentage: 45, watchDuration: 20, replays: 0, liked: false, saved: false, shared: false, commented: false, skipped: true, followed: false },
  ],
  sneha: [
    { reelId: 'p001', studentId: 'sneha', watchPercentage: 100, watchDuration: 60, replays: 1, liked: true, saved: true, shared: false, commented: false, skipped: false, followed: true },
    { reelId: 'd005', studentId: 'sneha', watchPercentage: 90, watchDuration: 40, replays: 0, liked: true, saved: true, shared: false, commented: false, skipped: false, followed: false },
    { reelId: 'd001', studentId: 'sneha', watchPercentage: 85, watchDuration: 51, replays: 1, liked: true, saved: false, shared: false, commented: true, skipped: false, followed: false },
    { reelId: 'ca001', studentId: 'sneha', watchPercentage: 100, watchDuration: 10, replays: 2, liked: true, saved: false, shared: true, commented: false, skipped: false, followed: false },
    { reelId: 'd006', studentId: 'sneha', watchPercentage: 95, watchDuration: 57, replays: 0, liked: true, saved: true, shared: false, commented: false, skipped: false, followed: false },
    { reelId: 'j004', studentId: 'sneha', watchPercentage: 75, watchDuration: 33, replays: 0, liked: false, saved: false, shared: false, commented: false, skipped: false, followed: false },
    { reelId: 'ca003', studentId: 'sneha', watchPercentage: 80, watchDuration: 48, replays: 0, liked: true, saved: true, shared: false, commented: false, skipped: false, followed: false },
  ],
  karan: [
    { reelId: 's001', studentId: 'karan', watchPercentage: 100, watchDuration: 60, replays: 2, liked: true, saved: true, shared: true, commented: true, skipped: false, followed: true },
    { reelId: 's002', studentId: 'karan', watchPercentage: 95, watchDuration: 57, replays: 1, liked: true, saved: true, shared: false, commented: false, skipped: false, followed: false },
    { reelId: 's005', studentId: 'karan', watchPercentage: 90, watchDuration: 54, replays: 0, liked: true, saved: false, shared: false, commented: false, skipped: false, followed: false },
    { reelId: 's003', studentId: 'karan', watchPercentage: 80, watchDuration: 60, replays: 0, liked: false, saved: true, shared: false, commented: false, skipped: false, followed: false },
    { reelId: 's004', studentId: 'karan', watchPercentage: 85, watchDuration: 76, replays: 0, liked: true, saved: true, shared: false, commented: false, skipped: false, followed: true },
    { reelId: 'm002', studentId: 'karan', watchPercentage: 100, watchDuration: 10, replays: 1, liked: true, saved: false, shared: true, commented: false, skipped: false, followed: false },
    { reelId: 's006', studentId: 'karan', watchPercentage: 70, watchDuration: 52, replays: 0, liked: false, saved: false, shared: false, commented: false, skipped: false, followed: false },
  ],
};

export const initialInteractions = seededInteractions;


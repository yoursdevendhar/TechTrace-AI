export type TechCategory =
  | 'Java'
  | 'Python'
  | 'DSA'
  | 'AI'
  | 'Machine Learning'
  | 'Cloud'
  | 'Cybersecurity'
  | 'Hardware'
  | 'Career'
  | 'System Design'
  | 'Backend'
  | 'Frontend'
  | 'DevOps'
  | 'Database'
  | 'Programming Meme'
  | 'Tech News'
  | 'Entertainment'
  | 'Gaming';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type Confidence = 'High' | 'Medium' | 'Low';
export type RecommendationStrategy = 'exploitation' | 'adjacent' | 'exploration';

export interface Reel {
  id: string;
  title: string;
  caption: string;
  hashtags: string[];
  category: TechCategory;
  topics: string[];
  concepts: string[];
  transcript: string;
  visualElements: string[];
  skillLevel: SkillLevel;
  hypeScore: number;
  educationalValue: number;
  credibility: number;
  engagementPotential: number;
  difficulty: number;
  duration: number;
  creator: string;
  gradient: string;
}

export interface Interaction {
  id?: string;
  reelId: string;
  studentId: string;
  watchPercentage: number;
  watchDuration: number;
  replays: number;
  liked: boolean;
  saved: boolean;
  shared: boolean;
  commented: boolean;
  skipped: boolean;
  followed: boolean;
  createdAt?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  gradient: string;
}

export interface InterestNode {
  topic: string;
  weight: number;
  skillLevel: SkillLevel;
  interactionCount: number;
}

export interface Recommendation {
  reel: Reel;
  score: number;
  interestDetected: string;
  why: string;
  whyThisRecommendation: string;
  difficulty: SkillLevel;
  confidence: Confidence;
  hypeScore: number;
  educationalValue: number;
  category: string;
  strategy: RecommendationStrategy;
}

export interface GraphNode {
  id: string;
  label: string;
  parent: string | null;
  level: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight: number;
}

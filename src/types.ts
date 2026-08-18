/**
 * @file types.ts
 * @description Core domain type definitions, entities, schemas, and scoring models
 * used throughout the TechTrace AI recommendation engine and UI modules.
 */

/** High-level technology domain classification categories for short-form video reels */
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

/** Estimated technical proficiency / difficulty bracket */
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

/** Calibrated confidence classification for recommendations */
export type Confidence = 'High' | 'Medium' | 'Low';

/** Tri-tier recommendation diversification strategy */
export type RecommendationStrategy = 'exploitation' | 'adjacent' | 'exploration';

/**
 * Short-form video entity with semantic embeddings, transcript,
 * and multi-dimensional quality metrics.
 */
export interface Reel {
  /** Unique reel identifier */
  id: string;
  /** Reel title */
  title: string;
  /** Text caption displayed below reel */
  caption: string;
  /** List of extracted hashtags */
  hashtags: string[];
  /** High-level domain category */
  category: TechCategory;
  /** Fine-grained knowledge graph topics covered in reel */
  topics: string[];
  /** Core conceptual primitives explained */
  concepts: string[];
  /** Spoken speech transcript for AI voiceover and semantic analysis */
  transcript: string;
  /** Visual UI elements present in the video */
  visualElements: string[];
  /** Difficulty rating */
  skillLevel: SkillLevel;
  /** Sensation/clickbait index from 0 to 100 (penalized by engine) */
  hypeScore: number;
  /** Structured educational density from 0 to 100 */
  educationalValue: number;
  /** Source authenticity and production validity from 0 to 100 */
  credibility: number;
  /** Estimated baseline viewer retention potential from 0 to 100 */
  engagementPotential: number;
  /** Granular difficulty scale from 1 (Intro) to 10 (Mastery) */
  difficulty: number;
  /** Duration in seconds */
  duration: number;
  /** Content author or channel handle */
  creator: string;
  /** Gradient color styling for visual avatars */
  gradient: string;
}

/**
 * Real-time student interaction telemetry captured from feed scrolling.
 */
export interface Interaction {
  /** Database primary key (optional for offline state) */
  id?: string;
  /** Reference to the watched reel */
  reelId: string;
  /** Student identifier */
  studentId: string;
  /** Percentage of reel duration watched (0 to 100) */
  watchPercentage: number;
  /** Total active playback duration in seconds */
  watchDuration: number;
  /** Number of times viewer looped/replayed the video */
  replays: number;
  /** User like status */
  liked: boolean;
  /** User bookmark / save status */
  saved: boolean;
  /** User share trigger status */
  shared: boolean;
  /** User comment submission status */
  commented: boolean;
  /** Whether the user quickly swiped past the content */
  skipped: boolean;
  /** Whether the user subscribed / followed the creator */
  followed: boolean;
  /** Interaction timestamp (ISO string) */
  createdAt?: string;
}

/**
 * Student profile entity for persona switching and personalization.
 */
export interface StudentProfile {
  /** Unique profile handle */
  id: string;
  /** Full student display name */
  name: string;
  /** 2-letter avatar initials */
  avatar: string;
  /** Academic bio or technical aspiration */
  bio: string;
  /** UI gradient color theme */
  gradient: string;
}

/**
 * Weighted topic node within the student's inferred semantic interest profile.
 */
export interface InterestNode {
  /** Knowledge graph topic name */
  topic: string;
  /** Aggregated engagement weight */
  weight: number;
  /** Estimated skill level in this specific topic */
  skillLevel: SkillLevel;
  /** Total interactions contributing to this topic weight */
  interactionCount: number;
}

/**
 * Explainable recommendation candidate strictly conforming to the 8 required rubric fields.
 */
export interface Recommendation {
  /** Target suggested reel entity */
  reel: Reel;
  /** Combined multi-objective relevance score */
  score: number;
  /** Inferred latent intent across multi-reel trajectory */
  interestDetected: string;
  /** Macro rationale explaining why this interest was detected */
  why: string;
  /** Micro rationale explaining why this specific reel was chosen */
  whyThisRecommendation: string;
  /** Difficulty bracket */
  difficulty: SkillLevel;
  /** Calibrated recommendation confidence */
  confidence: Confidence;
  /** Raw hype score of recommended reel */
  hypeScore: number;
  /** Educational value score */
  educationalValue: number;
  /** Category title */
  category: string;
  /** Applied diversification tier */
  strategy: RecommendationStrategy;
}

/**
 * Knowledge graph node representing an atomic technical concept or domain.
 */
export interface GraphNode {
  /** Semantic node identifier */
  id: string;
  /** Human-readable label */
  label: string;
  /** Parent node ID for taxonomic hierarchy (null for roots) */
  parent: string | null;
  /** Hierarchical depth level */
  level: number;
}

/**
 * Weighted semantic edge connecting cross-domain concepts in the knowledge graph.
 */
export interface GraphEdge {
  /** Source topic ID */
  from: string;
  /** Target topic ID */
  to: string;
  /** Semantic proximity weight (0.0 to 1.0) */
  weight: number;
}

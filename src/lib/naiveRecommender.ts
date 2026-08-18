import type { Reel, Recommendation, Interaction } from '@/types';
import { reels, reelMap } from '@/data/reels';

export interface NaiveRecommendationResult {
  recommendations: Recommendation[];
  trapExplanation: string;
  reasons: string[];
}

/**
 * Simulates a standard naive keyword-matching recommender without latent semantic reasoning or hype filters.
 * Demonstrates the "Built-In Trap" described in the problem statement.
 */
export function generateNaiveRecommendations(
  interactions: Interaction[],
  options: { count?: number; customReels?: Reel[] } = {}
): NaiveRecommendationResult {
  const count = options.count ?? 6;
  const pool = [...(options.customReels || []), ...reels];

  // 1. Shallow frequency of literal keywords watched
  const keywordFreq = new Map<string, number>();
  for (const interaction of interactions) {
    const reel = reelMap[interaction.reelId];
    if (!reel) continue;
    for (const tag of reel.hashtags) {
      const clean = tag.replace('#', '').toLowerCase();
      keywordFreq.set(clean, (keywordFreq.get(clean) || 0) + 1);
    }
  }

  // 2. Score purely by literal hashtag overlap + raw engagement/hype (No hype penalty!)
  const scored = pool.map((reel) => {
    let tagMatches = 0;
    for (const tag of reel.hashtags) {
      const clean = tag.replace('#', '').toLowerCase();
      if (keywordFreq.has(clean)) {
        tagMatches += keywordFreq.get(clean)!;
      }
    }

    // Naive algorithm rewards high hype and engagement potential blindly
    const naiveScore =
      tagMatches * 0.4 +
      (reel.engagementPotential / 100) * 0.35 +
      (reel.hypeScore / 100) * 0.25;

    return {
      reel,
      score: naiveScore,
      interestDetected: reel.category, // Surface-level single category
      why: `Literal keyword overlap with watched tags (${reel.hashtags.slice(0, 2).join(', ')}). High engagement & hype weighting.`,
      whyThisRecommendation: `Recommended because it contains matching keywords '${reel.hashtags[0]}' and high viral engagement potential (${reel.engagementPotential}%).`,
      difficulty: reel.skillLevel,
      confidence: 'Medium' as const,
      hypeScore: reel.hypeScore,
      educationalValue: reel.educationalValue,
      category: reel.category,
      strategy: 'exploitation' as const,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  const recommendations = scored.slice(0, count);

  const trapExplanation =
    'Traditional recommender relies on shallow hashtag matching and engagement hype. Notice how it falls into the trap of recommending repetitive memes and viral clickbait without understanding the deeper engineering career context.';

  const reasons = [
    '⚠️ Shallow Keyword Overlap: Blindly matched "#java" and "#meme" tags.',
    '⚠️ No Hype Firewall: Promoted clickbait with inflated claims due to high viral engagement score.',
    '⚠️ Missing Latent Context: Failed to identify that the user was interested in Backend Architecture & System Design.',
  ];

  return {
    recommendations,
    trapExplanation,
    reasons,
  };
}

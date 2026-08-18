import type { Reel } from '@/types';

export interface ReelMetrics {
  rawLikes: number;
  rawComments: number;
  rawSaves: number;
  rawShares: number;
  rawViews: number;
  likesFormatted: string;
  commentsFormatted: string;
  savesFormatted: string;
  sharesFormatted: string;
  viewsFormatted: string;
}

/**
 * Computes deterministic, distinct, and realistic engagement metrics for each individual reel
 * based on its unique ID, engagement potential, educational value, and hype score.
 */
export function getReelMetrics(
  reel: Reel,
  isLiked = false,
  isSaved = false,
  extraComments = 0
): ReelMetrics {
  // Deterministic seed based on reel ID string hash
  let hash = 0;
  for (let i = 0; i < reel.id.length; i++) {
    hash = (hash << 5) - hash + reel.id.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  // Compute unique base counts per reel
  const baseLikes = Math.floor(
    1400 + (positiveHash % 12500) + (reel.engagementPotential || 70) * 35
  );
  const baseComments = Math.floor(
    28 + (positiveHash % 320) + (reel.hypeScore > 50 ? 110 : 0)
  );
  const baseSaves = Math.floor(
    190 + (positiveHash % 1400) + (reel.educationalValue || 75) * 14
  );
  const baseShares = Math.floor(
    65 + (positiveHash % 850) + (reel.engagementPotential || 70) * 6
  );
  const baseViews = Math.floor(baseLikes * 6.8 + (positiveHash % 42000) + 5000);

  const totalLikes = baseLikes + (isLiked ? 1 : 0);
  const totalSaves = baseSaves + (isSaved ? 1 : 0);
  const totalComments = baseComments + extraComments;
  const totalShares = baseShares;

  const formatCount = (num: number): string => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toLocaleString();
  };

  return {
    rawLikes: totalLikes,
    rawComments: totalComments,
    rawSaves: totalSaves,
    rawShares: totalShares,
    rawViews: baseViews,
    likesFormatted: formatCount(totalLikes),
    commentsFormatted: formatCount(totalComments),
    savesFormatted: formatCount(totalSaves),
    sharesFormatted: formatCount(totalShares),
    viewsFormatted: formatCount(baseViews),
  };
}

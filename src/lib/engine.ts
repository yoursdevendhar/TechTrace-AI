import type {
  Reel,
  Interaction,
  InterestNode,
  Recommendation,
  RecommendationStrategy,
  SkillLevel,
  Confidence,
} from '@/types';
import { reels, reelMap } from '@/data/reels';
import {
  graphNodes,
  getNodeIdForLabel,
  getRelatedTopics,
  getAncestors,
  getDescendants,
  getLabelForNodeId,
  getNeighbors,
} from '@/data/interestGraph';

const skillLevelOrder: Record<SkillLevel, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

function skillLevelFromNumber(level: number): SkillLevel {
  if (level <= 3) return 'Beginner';
  if (level <= 6) return 'Intermediate';
  return 'Advanced';
}

export function computeEngagementScore(interaction: Interaction): number {
  const watch = interaction.watchPercentage / 100;
  const replayBonus = Math.min(interaction.replays * 0.15, 0.45);
  const likeBonus = interaction.liked ? 0.2 : 0;
  const saveBonus = interaction.saved ? 0.25 : 0;
  const shareBonus = interaction.shared ? 0.15 : 0;
  const commentBonus = interaction.commented ? 0.15 : 0;
  const followBonus = interaction.followed ? 0.2 : 0;
  const skipPenalty = interaction.skipped ? -0.4 : 0;

  const score =
    watch * 0.3 +
    replayBonus +
    likeBonus +
    saveBonus +
    shareBonus +
    commentBonus +
    followBonus +
    skipPenalty;

  return Math.max(0, Math.min(1.5, score));
}

function mapReelToGraphTopics(reel: Reel): string[] {
  if (!reel || !Array.isArray(reel.topics)) return [];
  const topicIds: string[] = [];
  for (const topic of reel.topics) {
    const nodeId = getNodeIdForLabel(topic);
    if (nodeId) topicIds.push(nodeId);
  }
  if (Array.isArray(reel.concepts)) {
    for (const concept of reel.concepts) {
      const nodeId = getNodeIdForLabel(concept);
      if (nodeId && !topicIds.includes(nodeId)) topicIds.push(nodeId);
    }
  }
  return topicIds;
}

export function buildInterestProfile(interactions: Interaction[]): InterestNode[] {
  const interestMap = new Map<string, { weight: number; count: number; skillSum: number; skillCount: number }>();

  for (const interaction of interactions) {
    const reel = reelMap[interaction.reelId];
    if (!reel) continue;

    const engagement = computeEngagementScore(interaction);
    if (engagement <= 0.05) continue;

    const topicIds = mapReelToGraphTopics(reel);

    for (const topicId of topicIds) {
      const ancestors = getAncestors(topicId);
      const allRelated = [topicId, ...ancestors];

      for (const id of allRelated) {
        if (!interestMap.has(id)) {
          interestMap.set(id, { weight: 0, count: 0, skillSum: 0, skillCount: 0 });
        }
        const entry = interestMap.get(id)!;
        const isDirect = id === topicId;
        const contribution = isDirect ? engagement : engagement * 0.5;
        entry.weight += contribution;
        entry.count += 1;
        entry.skillSum += reel.difficulty;
        entry.skillCount += 1;
      }

      const related = getRelatedTopics(topicId, 1);
      for (const [relatedId, relatedWeight] of related) {
        if (allRelated.includes(relatedId)) continue;
        if (!interestMap.has(relatedId)) {
          interestMap.set(relatedId, { weight: 0, count: 0, skillSum: 0, skillCount: 0 });
        }
        const entry = interestMap.get(relatedId)!;
        entry.weight += engagement * relatedWeight * 0.3;
      }
    }
  }

  const nodes: InterestNode[] = [];
  for (const [topic, data] of interestMap) {
    if (data.weight < 0.1) continue;
    const avgSkill = data.skillCount > 0 ? data.skillSum / data.skillCount : 3;
    nodes.push({
      topic: getLabelForNodeId(topic),
      weight: data.weight,
      skillLevel: skillLevelFromNumber(avgSkill),
      interactionCount: data.count,
    });
  }

  return nodes.sort((a, b) => b.weight - a.weight);
}

export function getTopInterests(interactions: Interaction[], topN = 5): InterestNode[] {
  return buildInterestProfile(interactions).slice(0, topN);
}

export function getLatentInterest(interactions: Interaction[]): string {
  const profile = buildInterestProfile(interactions);
  if (profile.length === 0) return 'General Technology';

  const topTopics = profile.slice(0, 5).map((n) => n.topic);

  const hasBackend = topTopics.some((t) =>
    ['Backend Development', 'REST APIs', 'Databases', 'Spring Boot', 'FastAPI', 'Node.js'].includes(t)
  );
  const hasProgramming = topTopics.some((t) =>
    ['Programming', 'Java', 'Python', 'JavaScript', 'OOP'].includes(t)
  );
  const hasSE = topTopics.some((t) => t === 'Software Engineering');
  const hasAI = topTopics.some((t) => ['AI', 'Machine Learning', 'LLMs', 'NLP', 'Deep Learning'].includes(t));
  const hasSecurity = topTopics.some((t) => t === 'Cybersecurity');
  const hasHardware = topTopics.some((t) => t === 'Hardware');
  const hasDSA = topTopics.some((t) => t === 'DSA');
  const hasCareer = topTopics.some((t) => t === 'Career');
  const hasCloud = topTopics.some((t) => ['Cloud', 'Docker', 'Kubernetes', 'DevOps'].includes(t));
  const hasSystemDesign = topTopics.some((t) => t === 'System Design');
  const hasFrontend = topTopics.some((t) => ['Frontend', 'React', 'TypeScript'].includes(t));

  if (hasAI && hasHardware) return 'AI + Hardware (ML Infrastructure)';
  if (hasProgramming && hasBackend && (hasCloud || hasSystemDesign)) return 'Software Engineering + Backend + Cloud Architecture';
  if (hasProgramming && hasBackend) return 'Software Engineering + Backend Development';
  if (hasProgramming && hasDSA && hasCareer) return 'Software Engineering Career + DSA';
  if (hasProgramming && hasCareer) return 'Software Engineering Career';
  if (hasAI) return 'Artificial Intelligence + Machine Learning';
  if (hasSecurity) return 'Cybersecurity + Web Security';
  if (hasHardware && hasCloud) return 'Hardware + Cloud Infrastructure';
  if (hasHardware) return 'Hardware + Computing Technology';
  if (hasDSA && hasCareer) return 'DSA + Interview Preparation';
  if (hasFrontend) return 'Frontend Development + Web Technologies';
  if (hasSE) return 'Software Engineering';
  if (hasBackend) return 'Backend Development';
  if (hasCloud) return 'Cloud + DevOps';
  if (hasSystemDesign) return 'System Design + Architecture';
  if (hasCareer) return 'Tech Career Development';
  if (hasDSA) return 'Data Structures + Algorithms';

  return topTopics.slice(0, 2).join(' + ');
}

function estimateSkillLevel(interactions: Interaction[], topicId: string): SkillLevel {
  let skillSum = 0;
  let count = 0;

  for (const interaction of interactions) {
    const reel = reelMap[interaction.reelId];
    if (!reel) continue;
    const reelTopics = mapReelToGraphTopics(reel);
    const allRelated = new Set<string>();
    for (const t of reelTopics) {
      allRelated.add(t);
      getAncestors(t).forEach((a) => allRelated.add(a));
      getDescendants(t).forEach((d) => allRelated.add(d));
    }
    if (allRelated.has(topicId)) {
      skillSum += reel.difficulty;
      count += 1;
    }
  }

  if (count === 0) return 'Beginner';
  const avg = skillSum / count;
  return skillLevelFromNumber(avg);
}

function calculateRelevanceScore(
  reel: Reel,
  interestProfile: InterestNode[]
): { score: number; matchedTopics: string[]; strategy: RecommendationStrategy } {
  const reelTopicIds = new Set<string>();
  if (reel && Array.isArray(reel.topics)) {
    for (const topic of reel.topics) {
      const id = getNodeIdForLabel(topic);
      if (id) {
        reelTopicIds.add(id);
        getAncestors(id).forEach((a) => reelTopicIds.add(a));
      }
    }
  }
  if (reel && Array.isArray(reel.concepts)) {
    for (const concept of reel.concepts) {
      const id = getNodeIdForLabel(concept);
      if (id) {
        reelTopicIds.add(id);
        getAncestors(id).forEach((a) => reelTopicIds.add(a));
      }
    }
  }

  const interestMap = new Map<string, number>();
  for (const node of interestProfile) {
    const id = getNodeIdForLabel(node.topic);
    if (id) interestMap.set(id, node.weight);
  }

  let directScore = 0;
  let adjacentScore = 0;
  const matchedTopics: string[] = [];
  let strategy: RecommendationStrategy = 'exploration';

  for (const topicId of reelTopicIds) {
    if (interestMap.has(topicId)) {
      directScore += interestMap.get(topicId)!;
      matchedTopics.push(getLabelForNodeId(topicId));
      strategy = 'exploitation';
    }

    for (const [interestId, interestWeight] of interestMap) {
      if (interestId === topicId) continue;
      const neighbors = getNeighbors(interestId);
      const directNeighbor = neighbors.find((e) => e.to === topicId);
      if (directNeighbor) {
        adjacentScore += interestWeight * directNeighbor.weight * 0.6;
        if (strategy !== 'exploitation') strategy = 'adjacent';
      }

      const relatedToInterest = getRelatedTopics(interestId, 1);
      if (relatedToInterest.has(topicId)) {
        const w = relatedToInterest.get(topicId)!;
        adjacentScore += interestWeight * w * 0.3;
        if (strategy !== 'exploitation') strategy = 'adjacent';
      }
    }
  }

  if (directScore === 0 && adjacentScore === 0) {
    strategy = 'exploration';
  }

  const score = directScore + adjacentScore * 0.5;
  return { score, matchedTopics, strategy };
}

function calculateHypePenalty(reel: Reel): number {
  if (reel.hypeScore > 60) return reel.hypeScore * 0.8;
  if (reel.hypeScore > 40) return reel.hypeScore * 0.4;
  if (reel.hypeScore > 25) return reel.hypeScore * 0.15;
  return reel.hypeScore * 0.05;
}

function calculateSkillMatch(reel: Reel, interactions: Interaction[]): number {
  const reelTopicIds = mapReelToGraphTopics(reel);
  let matchScore = 0;
  let count = 0;

  for (const topicId of reelTopicIds) {
    const studentSkill = estimateSkillLevel(interactions, topicId);
    const studentSkillNum = skillLevelOrder[studentSkill];
    const reelSkillNum = reel.difficulty <= 3 ? 1 : reel.difficulty <= 6 ? 2 : 3;

    const diff = Math.abs(studentSkillNum - reelSkillNum);
    if (diff === 0) matchScore += 1.0;
    else if (diff === 1) matchScore += 0.6;
    else matchScore += 0.2;
    count += 1;
  }

  return count > 0 ? matchScore / count : 0.5;
}

function calculateConfidence(
  relevanceScore: number,
  interactionCount: number,
  strategy: RecommendationStrategy
): Confidence {
  let confidence = 0;
  confidence += Math.min(relevanceScore * 0.4, 0.4);
  confidence += Math.min(interactionCount / 10, 0.3);
  if (strategy === 'exploitation') confidence += 0.3;
  else if (strategy === 'adjacent') confidence += 0.15;

  if (confidence > 0.7) return 'High';
  if (confidence > 0.4) return 'Medium';
  return 'Low';
}

function generateWhy(interactions: Interaction[]): string {
  const profile = buildInterestProfile(interactions);
  const topInterests = profile.slice(0, 5).map((n) => n.topic);

  const watchedReels = interactions
    .filter((i) => i.watchPercentage > 50)
    .map((i) => reelMap[i.reelId]?.title)
    .filter(Boolean)
    .slice(0, 5);

  if (watchedReels.length === 0) {
    return 'The student has limited interaction history. Recommendations are based on broad technology discovery.';
  }

  return `The student has repeatedly interacted with content related to ${topInterests.slice(0, 3).join(', ')}. Watched reels include "${watchedReels.slice(0, 3).join('", "')}". The combined behavior indicates a broader interest in ${getLatentInterest(interactions)} rather than any single topic.`;
}

function generateWhyThisRecommendation(
  reel: Reel,
  matchedTopics: string[],
  strategy: RecommendationStrategy,
  latentInterest: string
): string {
  const reelTopics = reel.topics.slice(0, 3);

  if (strategy === 'exploitation') {
    return `"${reel.title}" directly matches the student's demonstrated interest in ${matchedTopics.slice(0, 2).join(' and ')}. It reinforces their existing ${latentInterest} profile with relevant ${reel.category} content.`;
  }

  if (strategy === 'adjacent') {
    return `${reelTopics.join(', ')} is closely related to the student's interest in ${matchedTopics[0] || latentInterest}. This represents a natural progression from their current interests into ${reel.category}, expanding their knowledge without being repetitive.`;
  }

  return `This introduces ${reelTopics.join(', ')} as a new technology area. While different from the student's current ${latentInterest} focus, it offers valuable discovery potential and could unlock new learning paths in ${reel.category}.`;
}

export function generateRecommendations(
  interactions: Interaction[],
  options: { count?: number; excludeReelIds?: string[]; customReels?: Reel[] } = {}
): Recommendation[] {
  const count = options.count ?? 10;
  const excludeReelIds = new Set(options.excludeReelIds || []);
  const customReels = options.customReels || [];

  const watchedReelIds = new Set(interactions.map((i) => i.reelId));
  const allExcluded = new Set([...excludeReelIds, ...watchedReelIds]);

  const interestProfile = buildInterestProfile(interactions);
  const latentInterest = getLatentInterest(interactions);
  const why = generateWhy(interactions);

  const pool = [...customReels, ...reels];
  let candidates = pool.filter((r) => !allExcluded.has(r.id));
  if (candidates.length === 0) {
    candidates = pool.slice(0, count);
  }

  const scored: Recommendation[] = candidates.map((reel) => {
    const { score: relevanceScore, matchedTopics, strategy } = calculateRelevanceScore(
      reel,
      interestProfile
    );

    const hypePenalty = calculateHypePenalty(reel);
    const skillMatch = calculateSkillMatch(reel, interactions);

    const novelty = matchedTopics.length === 0 ? 0.3 : Math.max(0, 1 - matchedTopics.length / 5);

    const finalScore =
      relevanceScore * 0.3 +
      reel.educationalValue / 100 * 0.2 +
      reel.credibility / 100 * 0.1 +
      reel.engagementPotential / 100 * 0.1 +
      novelty * 0.1 +
      skillMatch * 0.15 -
      hypePenalty / 100 * 0.25;

    const confidence = calculateConfidence(
      relevanceScore,
      interactions.length,
      strategy
    );

    return {
      reel,
      score: finalScore,
      interestDetected: latentInterest,
      why,
      whyThisRecommendation: generateWhyThisRecommendation(
        reel,
        matchedTopics,
        strategy,
        latentInterest
      ),
      difficulty: reel.skillLevel,
      confidence,
      hypeScore: reel.hypeScore,
      educationalValue: reel.educationalValue,
      category: reel.category,
      strategy,
    };
  });

  const exploitation = scored.filter((r) => r.strategy === 'exploitation').sort((a, b) => b.score - a.score);
  const adjacent = scored.filter((r) => r.strategy === 'adjacent').sort((a, b) => b.score - a.score);
  const exploration = scored.filter((r) => r.strategy === 'exploration').sort((a, b) => b.score - a.score);

  const exploitationCount = Math.round(count * 0.7);
  const adjacentCount = Math.round(count * 0.2);
  const explorationCount = count - exploitationCount - adjacentCount;

  const selected: Recommendation[] = [
    ...exploitation.slice(0, exploitationCount),
    ...adjacent.slice(0, adjacentCount),
    ...exploration.slice(0, explorationCount),
  ];

  selected.sort((a, b) => b.score - a.score);

  return selected.slice(0, count);
}

export function getInterestGraphData(interactions: Interaction[]) {
  const profile = buildInterestProfile(interactions);
  const interestMap = new Map<string, number>();
  for (const node of profile) {
    const id = getNodeIdForLabel(node.topic);
    if (id) interestMap.set(id, node.weight);
  }

  const activeNodeIds = new Set<string>();
  for (const [id] of interestMap) {
    activeNodeIds.add(id);
    getAncestors(id).forEach((a) => activeNodeIds.add(a));
  }

  const activeNodes = graphNodes.filter((n) => activeNodeIds.has(n.id));

  const activeEdges = [];
  for (const node of activeNodes) {
    const neighbors = getNeighbors(node.id);
    for (const edge of neighbors) {
      if (activeNodeIds.has(edge.to) && edge.from < edge.to) {
        activeEdges.push(edge);
      }
    }
    if (node.parent && activeNodeIds.has(node.parent)) {
      const edgeKey = `${node.parent}-${node.id}`;
      if (!activeEdges.find((e) => `${e.from}-${e.to}` === edgeKey)) {
        activeEdges.push({ from: node.parent, to: node.id, weight: 0.5 });
      }
    }
  }

  return {
    nodes: activeNodes.map((n) => ({
      ...n,
      weight: interestMap.get(n.id) || 0,
    })),
    edges: activeEdges,
  };
}

export function getSkillProfile(interactions: Interaction[]): { topic: string; skillLevel: SkillLevel }[] {
  const profile = buildInterestProfile(interactions);
  return profile.slice(0, 8).map((node) => ({
    topic: node.topic,
    skillLevel: node.skillLevel,
  }));
}

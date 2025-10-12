import type { Completion } from "@/models/completion";
import type { TrophyCounts, TrophyType } from "@/models/trophy";

const weights: Record<TrophyType, number> = {
  platinum: 300,
  gold: 90,
  silver: 30,
  bronze: 15,
};

export const getPoints = (counts: TrophyCounts): number => {
  let points: number = 0;
  const entries = Object.entries(counts);
  for (const [key, value] of entries) {
    if (key === "platinum") continue;
    points += value * weights[key as TrophyType];
  }
  return points;
};

export const calculateProgress = (completion: Completion[]): Completion[] => {
  return completion.map((item) => {
    const points = getPoints(item.counts);
    const earned = getPoints(item.earned_counts);
    const progress = Math.floor((earned / points) * 100);
    return { ...item, progress };
  });
};

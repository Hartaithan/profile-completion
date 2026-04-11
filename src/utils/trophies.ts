import type { TrophyCounts, TrophyProgress } from "@/models/trophy";

interface TrophiesProgressParams {
  counts?: TrophyCounts;
  earned?: TrophyCounts;
}

export const getTrophiesProgress = (params: TrophiesProgressParams): TrophyProgress => {
  const { counts, earned } = params;
  const progress: TrophyProgress = { total: 0, earned: 0, type: null };
  if (!counts) return progress;
  const entries = Object.entries(counts) as [keyof TrophyCounts, number][];
  for (const [key, value] of entries) {
    if (key === "platinum" || key === "total") continue;
    progress.total += value;
    if (!earned) continue;
    progress.earned += earned?.[key] || 0;
  }
  if (earned?.platinum === 1) progress.type = "platinum";
  if (progress.earned === progress.total) progress.type = "completed";
  return progress;
};

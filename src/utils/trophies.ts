import type { TrophyCounts } from "@/models/trophy";

interface TrophiesProgressParams {
  counts?: TrophyCounts;
  earned?: TrophyCounts;
}

export const getTrophiesProgress = (params: TrophiesProgressParams) => {
  const { counts, earned } = params;
  if (!counts) return null;
  const entries = Object.entries(counts) as [keyof TrophyCounts, number][];

  const progress = { total: 0, earned: 0, completed: false };
  for (const [key, value] of entries) {
    if (key === "platinum" || key === "total") continue;
    progress.total += value;
    if (!earned) continue;
    progress.earned += earned?.[key] || 0;
  }
  if (progress.earned > 0) {
    progress.completed = progress.earned === progress.total;
  }

  return progress;
};

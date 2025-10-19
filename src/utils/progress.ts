import type { Completion } from "@/models/completion";
import type { Sorter } from "@/models/filters";
import type { CalculatedProgress, Progress } from "@/models/progress";
import type { TrophyCounts, TrophyType } from "@/models/trophy";
import type { CompletionStore } from "@/store/completion";

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

export const getDefaultProgress = (): Progress => {
  return { points: 0, earned: 0, progress: 0 };
};

export const getProgress = (value: Pick<Progress, "earned" | "points">) => {
  const { earned, points } = value;
  return (earned / points) * 100;
};

export const sortCompletion = (completion: Completion[], sorter: Sorter | null) => {
  if (!sorter || !sorter.field) return completion;
  const { field, direction = "asc" } = sorter;
  return completion.sort((a, b) => {
    const va = a[field];
    const vb = b[field];
    if (typeof va === "number" && typeof vb === "number")
      return direction === "asc" ? va - vb : vb - va;
    if (typeof va === "string" && typeof vb === "string")
      return direction === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    return 0;
  });
};

export const calculateProgress = (store: CompletionStore): CalculatedProgress => {
  const total: Progress = getDefaultProgress();
  let completion: Completion[] = [];
  for (const item of store.completion) {
    const points = getPoints(item.counts);
    total.points += points;
    const earned = getPoints(item.earned_counts);
    total.earned += earned;
    const progress = getProgress({ earned, points });
    completion.push({ ...item, progress });
  }
  total.progress = getProgress(total);
  completion = sortCompletion(completion, store.sorter);
  return { completion, progress: total };
};

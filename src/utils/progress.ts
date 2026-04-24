import type { Completion } from "@/models/completion";
import type { Filters, Sorter } from "@/models/filters";
import type { CompletionGoal } from "@/models/goal";
import type { CalculatedProgress, Progress } from "@/models/progress";
import type { TrophyCounts, TrophyType } from "@/models/trophy";
import type { CompletionStore } from "@/store/completion";

const weights: Record<TrophyType, number> = {
  platinum: 300,
  gold: 90,
  silver: 30,
  bronze: 15,
  total: 0,
};

export const getPoints = (counts: TrophyCounts | undefined): number => {
  let points: number = 0;
  if (counts === undefined) return points;
  const entries = Object.entries(counts);
  for (const [key, value] of entries) {
    if (key === "total") continue;
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
  if (!earned || !points) return 0;
  return (earned / points) * 100;
};

export const sortCompletion = (items: Completion[], sorter: Sorter | null) => {
  if (!sorter || !sorter.field) return items;
  const { field, direction = "asc" } = sorter;
  return items.sort((a, b) => {
    const va = a[field];
    const vb = b[field];
    if (typeof va === "number" && typeof vb === "number")
      return direction === "asc" ? va - vb : vb - va;
    if (typeof va === "string" && typeof vb === "string")
      return direction === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    return 0;
  });
};

export const filterCompletion = (items: Completion[], filters: Filters | undefined) => {
  if (!items.length) return [];
  if (!filters) return items;
  const { platforms, completion } = filters;

  const platformSet = platforms?.length ? new Set(platforms) : null;
  const hasPlatformFilter = !!(platformSet && platformSet.size > 0);
  const hasCompletionFilter = !!(completion && completion !== "all");
  if (!hasPlatformFilter && !hasCompletionFilter) return items;

  return items.filter((item) => {
    if (hasPlatformFilter) {
      if (!item.platforms.some((p) => platformSet.has(p))) return false;
    }
    if (hasCompletionFilter) {
      const is100 = item.progress === 100;
      const hasPlatinum = (item.earned_counts?.platinum ?? 0) > 0;
      switch (completion) {
        case "100":
          if (!is100) return false;
          break;
        case "not-100":
          if (is100) return false;
          break;
        case "not-100-or-platinum":
          if (is100 || hasPlatinum) return false;
          break;
        case "platinum":
          if (!hasPlatinum) return false;
          break;
        case "platinum-not-100":
          if (!hasPlatinum || is100) return false;
          break;
      }
    }
    return true;
  });
};

export const calculateProgress = (store: CompletionStore): CalculatedProgress => {
  const total: Progress = getDefaultProgress();
  let completion: Completion[] = [];
  for (const item of store.completion) {
    if (!item) continue;
    const points = getPoints(item.counts);
    total.points += points;
    const earned = getPoints(item.earned_counts);
    total.earned += earned;
    const progress = getProgress({ earned, points });
    completion.push({ ...item, progress });
  }
  total.progress = getProgress(total);
  completion = filterCompletion(completion, store.filters);
  completion = sortCompletion(completion, store.sorter);
  return { completion, progress: total };
};

export const formatProgress = (value: number | undefined, suffix?: string | null) => {
  if (value === undefined) return "Not Found";
  return `${Number(value.toFixed(2))}${suffix}`;
};

interface GoalParams {
  progress: Progress;
  counts: TrophyCounts;
  target: number;
}

export const getCompletionGoal = (params: GoalParams): CompletionGoal => {
  const { progress, counts, target } = params;
  if (progress.progress >= target) return "already-reached";
  const gamePoints = getPoints(counts);
  const targetValue = target / 100;
  const numerator = targetValue * progress.points - progress.earned;
  const denominator = (1 - targetValue) * gamePoints;
  if (denominator <= 0) return "unreachable";
  return Math.ceil(numerator / denominator);
};

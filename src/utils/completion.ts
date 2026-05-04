import type { Completion, CompletionPoints, CompletionProgress } from "@/models/completion";
import type { Filters, Sorter } from "@/models/filters";
import type { CompletionGoal } from "@/models/goal";
import type { TrophyCounts } from "@/models/trophy";
import { getPoints } from "@/utils/progress";

interface StatusParams {
  points: CompletionPoints | null | undefined;
  counts: TrophyCounts | undefined;
  earned: TrophyCounts | undefined;
}

interface StatusResponse {
  type: "platinum" | "completed" | null;
  hasPlatinum: boolean;
  hasDLC: boolean;
}

export const getCompletionStatus = (params: StatusParams): StatusResponse => {
  const { points, counts, earned } = params;
  let type: StatusResponse["type"] = null;
  if (earned?.platinum === 1) type = "platinum";
  if (earned?.total === counts?.total) type = "completed";
  const hasPlatinum = counts?.platinum === 1;
  const hasDLC = points?.base !== points?.total;
  return { type, hasPlatinum, hasDLC };
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
      const is100 = item.progress?.value === 100;
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

interface GoalParams {
  progress: CompletionProgress | null;
  counts: TrophyCounts;
  target: number;
}

export const getCompletionGoal = (params: GoalParams): CompletionGoal => {
  const { progress, counts, target } = params;
  if (!progress) return "unreachable";
  if (progress.value >= target) return "already-reached";
  const gamePoints = getPoints(counts);
  const targetValue = target / 100;
  const numerator = targetValue * progress.total - progress.earned;
  const denominator = (1 - targetValue) * gamePoints;
  if (denominator <= 0) return "unreachable";
  return Math.ceil(numerator / denominator);
};

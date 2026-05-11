import type {
  CompletionPoints,
  CompletionProgress,
  CompletionTarget,
  NullableCompletion,
} from "@/models/completion";
import type { CompletionGoal } from "@/models/goal";
import type { TrophyCounts } from "@/models/trophy";
import { getPoints, getProgress } from "@/utils/progress";

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

interface GoalParams {
  progress: CompletionProgress | null;
  counts: TrophyCounts;
  target: number;
}

export const getCompletionGoal = (params: GoalParams): CompletionGoal => {
  const { progress, counts, target } = params;
  if (!progress) return "error";
  if (progress.value >= target) return "already-reached";
  const gamePoints = getPoints(counts);
  const targetValue = target / 100;
  const numerator = targetValue * progress.total - progress.earned;
  const denominator = (1 - targetValue) * gamePoints;
  if (denominator <= 0) return "unreachable";
  return Math.ceil(numerator / denominator);
};

export const completeItemTrophies = (
  item: NullableCompletion | undefined,
  target: CompletionTarget,
) => {
  if (!item) return;
  const now = new Date().toISOString();
  for (const trophy of item.trophies) {
    if (trophy.kind !== "trophy") continue;
    const earned = target === "platinum" ? trophy.group === "default" : true;
    trophy.earned = earned;
    trophy.earned_at = earned ? now : undefined;
  }
};

export const uncompleteAllTrophies = (item: NullableCompletion | undefined) => {
  if (!item) return;
  for (const trophy of item.trophies) {
    if (trophy.kind !== "trophy") continue;
    trophy.earned = false;
    trophy.earned_at = undefined;
  }
};

export const applyItemProgress = (
  item: NullableCompletion,
  earned: number,
  earnedCounts: NonNullable<NullableCompletion>["earned_counts"],
): number => {
  if (!item || !item?.progress) return 0;
  const delta = earned - item.progress.earned;
  item.earned_counts = earnedCounts;
  item.progress.earned = earned;
  item.progress.value = getProgress(earned, item.progress.total);
  return delta;
};

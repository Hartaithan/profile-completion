import type { CompletionPoints, CompletionProgress } from "@/models/completion";
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

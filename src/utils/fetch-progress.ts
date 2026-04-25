import { toFixed } from "@/utils/number";

export const getProgress = (current: number, total: number) => {
  const progress = (current / total) * 100;
  if (progress < 0 || isNaN(progress) || !isFinite(progress)) return 0;
  return Math.max(0, Math.min(100, progress));
};

export const getProgressLabel = (value: number) => {
  return `${toFixed(value)}%`;
};

export const getProgressResult = (current: number, total: number) => {
  const value = getProgress(current, total);
  const label = getProgressLabel(value);
  return { value, label };
};

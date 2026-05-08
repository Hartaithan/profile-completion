import type { TrophyCounts, TrophyType } from "@/models/trophy";

const weights: Record<TrophyType, number> = {
  platinum: 300,
  gold: 90,
  silver: 30,
  bronze: 15,
  total: 0,
};

export const getPoint = (type: TrophyType): number => {
  if (type === "total") return 0;
  if (type === "platinum") return 0;
  return weights[type] ?? 0;
};

export const getPoints = (counts: TrophyCounts | undefined): number => {
  let points: number = 0;
  if (counts === undefined) return points;
  const entries = Object.entries(counts);
  for (const [key, value] of entries) {
    const point = getPoint(key as TrophyType);
    if (point > 0) points += value * point;
  }
  return points;
};

export const getProgress = (value: number, total: number): number => {
  if (!value || !total) return 0;
  return (value / total) * 100;
};

export const formatProgress = (value: number | undefined, suffix?: string | null) => {
  if (value === undefined) return "Not Found";
  return `${Number(value.toFixed(2))}${suffix}`;
};

import type { Completion, CompletionMaps, NullableCompletion } from "@/models/completion";
import type { Trophy, TrophyItem } from "@/models/trophy";

export const buildTrophyMap = (trophies: TrophyItem[]): Record<number, Trophy> => {
  const map: Record<number, Trophy> = {};
  for (const trophy of trophies) if (trophy.kind === "trophy") map[trophy.id] = trophy;
  return map;
};

export const syncMapsForItem = (
  completionMap: Record<string, Completion>,
  trophyMap: Record<string, Record<number, Trophy>>,
  item: Completion,
) => {
  completionMap[item.id] = item;
  trophyMap[item.id] = buildTrophyMap(item.trophies);
};

export const buildCompletionMap = (completion: NullableCompletion[]): CompletionMaps => {
  const completionMap: Record<string, Completion> = {};
  const trophyMap: Record<string, Record<number, Trophy>> = {};
  for (const item of completion) {
    if (!item) continue;
    syncMapsForItem(completionMap, trophyMap, item);
  }
  return { completionMap, trophyMap };
};

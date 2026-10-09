import type { CompletionMaps } from "@/models/completion";
import type {
  Completion,
  CompletionTrophy,
  CompletionTrophyItem,
  NullableCompletion,
} from "@hartaithan/trophy-scout/types";

export const buildTrophyMap = (
  trophies: CompletionTrophyItem[],
): Record<number, CompletionTrophy> => {
  const map: Record<number, CompletionTrophy> = {};
  for (const trophy of trophies) if (trophy.kind === "trophy") map[trophy.id] = trophy;
  return map;
};

export const syncMapsForItem = (
  completionMap: Record<string, Completion>,
  trophyMap: Record<string, Record<number, CompletionTrophy>>,
  item: Completion,
) => {
  completionMap[item.id] = item;
  trophyMap[item.id] = buildTrophyMap(item.trophies);
};

export const buildCompletionMap = (completion: NullableCompletion[]): CompletionMaps => {
  const completionMap: Record<string, Completion> = {};
  const trophyMap: Record<string, Record<number, CompletionTrophy>> = {};
  for (const item of completion) {
    if (!item) continue;
    syncMapsForItem(completionMap, trophyMap, item);
  }
  return { completionMap, trophyMap };
};

import type { Completion, CompletionTrophy } from "@hartaithan/trophy-scout/types";

export type CompletionMaps = {
  completionMap: Record<string, Completion>;
  trophyMap: Record<string, Record<number, CompletionTrophy>>;
};

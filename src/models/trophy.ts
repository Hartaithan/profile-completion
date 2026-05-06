export type TrophyType = "platinum" | "gold" | "silver" | "bronze" | "total";

export type TrophyRarity = "ultra-rare" | "very-rare" | "rare" | "common";

export interface TrophyCounts {
  platinum: number;
  gold: number;
  silver: number;
  bronze: number;
  total?: number;
}

export const TROPHY_KIND = {
  GROUP: "group",
  TROPHY: "trophy",
} as const;

export type TrophyKind = (typeof TROPHY_KIND)[keyof typeof TROPHY_KIND];

export interface TrophyGroup {
  id: string;
  kind: typeof TROPHY_KIND.GROUP;
}

export type TrophyItem = Trophy | TrophyGroup;

export interface Trophy {
  id: number;
  kind: typeof TROPHY_KIND.TROPHY;
  group?: string;
  type: TrophyType;
  title?: string;
  description?: string;
  image_url?: string;
  earned: boolean;
  earned_at?: string;
  earned_rate?: number;
  rarity?: TrophyRarity;
  rarity_label?: string;
}

export type TrophyProgressType = "platinum" | "completed" | null;

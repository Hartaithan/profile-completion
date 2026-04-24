import type { Platform } from "@/models/completion";

export const platformLabels: Record<Platform, string> = {
  PS5: "Playstation 5",
  PS4: "Playstation 4",
  PS3: "Playstation 3",
  PSVITA: "Playstation Vita",
  PSPC: "PC",
};

export const platformShortLabels: Record<Platform, string> = {
  PS5: "PS5",
  PS4: "PS4",
  PS3: "PS3",
  PSVITA: "PS Vita",
  PSPC: "PC",
};

export const platformOptions = [
  { label: platformShortLabels.PS5, value: "PS5" },
  { label: platformShortLabels.PS4, value: "PS4" },
  { label: platformShortLabels.PS3, value: "PS3" },
  { label: platformShortLabels.PSVITA, value: "PSVITA" },
  { label: platformShortLabels.PSPC, value: "PSPC" },
];

import type { CachedResponse } from "@/models/app";
import type { TrophyCounts, TrophyItem } from "@/models/trophy";

export type Platform = "PS5" | "PS4" | "PS3" | "PSVITA" | "PSPC";

export interface CompletionPoints {
  base: number;
  total: number;
}

export interface CompletionProgress {
  earned: number;
  total: number;
  value: number;
}

export interface Completion {
  id: string;
  title: string;
  description?: string;
  platforms: Platform[];
  image_url: string;
  counts: TrophyCounts;
  base_counts?: TrophyCounts;
  earned_counts: TrophyCounts;
  progress: CompletionProgress | null;
  points: CompletionPoints | null;
  trophies: TrophyItem[];
}

export type NullableCompletion = Completion | null;

export type CompletionEventType = "progress" | "complete" | "error";

export type CompletionData<T extends CompletionEventType> = {
  type: T;
  message: string;
};

export interface CompletionProgressData extends CompletionData<"progress"> {
  completion: NullableCompletion[];
  current?: number;
  total?: number;
}

export interface CompletionCompleteData extends CompletionData<"complete">, CachedResponse {
  progress: CompletionProgress;
}

export type CompletionErrorData = CompletionData<"error">;

export type CompletionEventData =
  | CompletionProgressData
  | CompletionCompleteData
  | CompletionErrorData;

export type CompletionResponseData = CompletionCompleteData;

export interface CompletionResponse extends CachedResponse {
  progress: CompletionProgress;
  list: NullableCompletion[];
}

export interface FetchCompletionParams {
  id: string;
  onProgress: (data: CompletionProgressData) => void;
  signal?: AbortSignal;
}

export type CompletionTarget = "platinum" | "complete";

import type { CachedResponse } from "./app";
import type { TrophyCounts } from "./trophy";

export type Platform = "PS5" | "PS4" | "PS3" | "PSVITA" | "PSPC";

export interface Completion {
  id: string;
  title: string;
  description?: string;
  platforms: Platform[];
  image_url: string;
  counts: TrophyCounts;
  base_counts?: TrophyCounts;
  earned_counts: TrophyCounts;
  progress: number;
}

export type NullableCompletion = Completion | null;

export type CompletionEventType = "progress" | "complete" | "error";

export type CompletionData<T extends CompletionEventType> = {
  type: T;
  message: string;
};

export interface CompletionProgressData extends CompletionData<"progress"> {
  current?: number;
  total?: number;
}

export interface CompletionCompleteData extends CompletionData<"complete">, CachedResponse {
  completion?: NullableCompletion[];
}

export type CompletionErrorData = CompletionData<"error">;

export type CompletionEventData =
  | CompletionProgressData
  | CompletionCompleteData
  | CompletionErrorData;

export type CompletionResponseData = CompletionCompleteData;

export interface CompletionResponse extends CachedResponse {
  list: NullableCompletion[];
}

export interface FetchCompletionParams {
  id: string;
  onProgress: (data: CompletionProgressData) => void;
  signal?: AbortSignal;
}

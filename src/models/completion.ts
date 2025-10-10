import type { CachedResponse, Response } from "./app";
import type { TrophyCounts } from "./trophy";

export type Platform = "PS5" | "PS4" | "PS3" | "PSVITA" | "PSPC";

export interface Completion {
  title: string;
  description?: string;
  platforms: Platform[];
  image_url: string;
  counts: TrophyCounts;
  earned_counts: TrophyCounts;
  progress: number;
}

export interface CompletionResponseData extends CachedResponse {
  completion: Completion[];
}

export type CompletionResponse = Response<CompletionResponseData>;

export interface FetchCompletionParams {
  id: string;
  signal?: AbortSignal;
}

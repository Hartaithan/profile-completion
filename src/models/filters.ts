import type { Completion, Platform } from "@/models/completion";

export type SortDirection = "asc" | "desc";

export interface Sorter {
  field?: keyof Completion;
  direction?: SortDirection;
}

export type PlatformFilter = Platform;

export type CompletionFilter =
  | "100"
  | "not-100"
  | "not-100-or-platinum"
  | "platinum"
  | "platinum-not-100"
  | "all";

export interface Filters {
  platforms?: PlatformFilter[];
  completion?: CompletionFilter;
}

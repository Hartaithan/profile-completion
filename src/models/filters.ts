import type { Completion } from "./completion";

export type SortDirection = "asc" | "desc";

export interface Sorter {
  field?: keyof Completion;
  direction?: SortDirection;
}

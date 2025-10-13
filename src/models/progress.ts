import type { Completion } from "./completion";

export interface Progress {
  points: number;
  earned: number;
  progress: number;
}

export interface CalculatedProgress {
  completion: Completion[];
  progress: Progress;
}

import type { TrophyCounts } from "@/models/trophy";
import { defineStore } from "pinia";

export interface GoalStore {
  percent: number;
  counts: TrophyCounts;
}

type Store = GoalStore;

const getDefaultState = (): Store => {
  return {
    percent: 80,
    counts: { platinum: 1, gold: 9, silver: 15, bronze: 25 },
  };
};

export const useGoalStore = defineStore("goal", {
  state: getDefaultState,
  getters: {},
  actions: {},
});

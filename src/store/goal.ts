import { goalKey } from "@/constants/storage";
import { readStorage, removeStorage, setStorage } from "@/utils/local-storage";
import type { TrophyCounts } from "@hartaithan/trophy-scout/types";
import { defineStore } from "pinia";

export interface GoalStore {
  percent: number;
  counts: Omit<TrophyCounts, "total">;
}

type Store = GoalStore;

const defaultState: Store = {
  percent: 80,
  counts: { platinum: 1, gold: 9, silver: 15, bronze: 25 },
};

export const useGoalStore = defineStore("goal", {
  state: () => readStorage(goalKey, defaultState),
  actions: {
    persist() {
      setStorage(goalKey, this.$state);
    },
    reset() {
      this.percent = defaultState.percent;
      this.counts = defaultState.counts;
      removeStorage(goalKey);
    },
  },
});

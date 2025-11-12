import { goalKey } from "@/constants/storage";
import type { TrophyCounts } from "@/models/trophy";
import { readStorage, setStorage } from "@/utils/local-storage";
import { defineStore } from "pinia";

export interface GoalStore {
  percent: number;
  counts: TrophyCounts;
}

type Store = GoalStore;

const defaultState: Store = {
  percent: 80,
  counts: { platinum: 1, gold: 9, silver: 15, bronze: 25 },
};

export const useGoalStore = defineStore("goal", {
  state: () => defaultState,
  actions: {
    async init() {
      try {
        const value = await readStorage(goalKey, defaultState);
        this.percent = value.percent;
        this.counts = value.counts;
      } catch (error) {
        console.error("unable to initialize goal store", error);
      }
    },
    persist() {
      setStorage(goalKey, this.$state);
    },
  },
});

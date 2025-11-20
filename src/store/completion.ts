import { completionKeys } from "@/constants/storage";
import type { NullableCompletion } from "@/models/completion";
import type { Sorter } from "@/models/filters";
import type { Profile } from "@/models/profile";
import {
  readForage,
  readStorage,
  removeForage,
  removeStorage,
  setForage,
  setStorage,
} from "@/utils/local-storage";
import { calculateProgress } from "@/utils/progress";
import { defineStore } from "pinia";
import { toRaw } from "vue";

const keys = completionKeys;

type Status = "idle" | "profile-loading" | "completion-loading" | "completed";

export interface CompletionStore {
  status: Status;
  sorter: Sorter | null;
  profile: Profile | null;
  initial: NullableCompletion[];
  completion: NullableCompletion[];
}

type Store = CompletionStore;

const defaultState: Store = {
  status: "idle",
  sorter: null,
  profile: null,
  initial: [],
  completion: [],
};

const getDefaultState = (): Store => ({
  ...defaultState,
  profile: readStorage<Store["profile"]>(keys.profile, null),
});

const isLoading: Partial<Record<Status, boolean>> = {
  "profile-loading": true,
  "completion-loading": true,
};

export const useCompletionStore = defineStore("completion", {
  state: getDefaultState,
  getters: {
    loading: ({ status }): boolean => isLoading[status] || false,
    calculated: calculateProgress,
  },
  actions: {
    async init() {
      this.status = "profile-loading";
      try {
        const [initial, completion] = await Promise.all([
          readForage<Store["initial"]>(keys.initial, []),
          readForage<Store["completion"]>(keys.completion, []),
        ]);
        this.initial = initial;
        this.completion = completion;
        this.status = "completed";
      } catch (error) {
        console.error("unable to initialize completion store", error);
        this.status = "idle";
      }
    },
    setStatus(value: Store["status"]) {
      this.status = value;
    },
    setSorter(value: Sorter | null) {
      this.sorter = value;
    },
    setProfile(value: Store["profile"]) {
      this.profile = value;
      setStorage(keys.profile, value);
    },
    setCompletion(value: Store["completion"], status?: Store["status"]) {
      this.completion = value;
      if (status) this.status = status;
      setForage(keys.completion, value);
      this.initial = JSON.parse(JSON.stringify(value));
      setForage(keys.initial, value);
    },
    restore() {
      const value = toRaw(this.initial);
      this.completion = JSON.parse(JSON.stringify(value));
      setForage(keys.completion, value);
    },
    completeItem(index: number, target: "platinum" | "complete") {
      const picked = this.completion[index];
      if (!picked) return;
      switch (target) {
        case "platinum":
          if (!picked?.base_counts) break;
          picked.earned_counts = picked.base_counts;
          break;
        case "complete":
          picked.earned_counts = picked.counts;
          break;
        default:
          break;
      }
      setForage(keys.completion, this.completion);
    },
    reset() {
      this.status = defaultState.status;
      this.sorter = defaultState.sorter;
      this.profile = defaultState.profile;
      removeStorage(keys.profile);
      this.initial = defaultState.initial;
      removeForage(keys.initial);
      this.completion = defaultState.completion;
      removeForage(keys.completion);
    },
  },
});

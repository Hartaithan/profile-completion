import { completionKeys } from "@/constants/storage";
import type { NullableCompletion } from "@/models/completion";
import type { Sorter } from "@/models/filters";
import type { Profile } from "@/models/profile";
import { readStorage, setStorage } from "@/utils/local-storage";
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

const getDefaultState = (): Store => {
  return {
    status: "idle",
    sorter: null,
    profile: readStorage<Store["profile"]>(keys.profile, null),
    initial: readStorage<Store["initial"]>(keys.initial, []),
    completion: readStorage<Store["completion"]>(keys.completion, []),
  };
};

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
      setStorage(keys.completion, value);
      this.initial = JSON.parse(JSON.stringify(value));
      setStorage(keys.initial, value);
    },
    restore() {
      const value = toRaw(this.initial);
      this.completion = JSON.parse(JSON.stringify(value));
      setStorage(keys.completion, value);
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
      setStorage(keys.completion, this.completion);
    },
  },
});

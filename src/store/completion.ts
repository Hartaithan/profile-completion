import type { Completion } from "@/models/completion";
import type { Sorter } from "@/models/filters";
import type { Profile } from "@/models/profile";
import { readStorage, setStorage } from "@/utils/local-storage";
import { calculateProgress } from "@/utils/progress";
import { defineStore } from "pinia";

const keys = {
  profile: "pr-co-profile",
  initial: "pr-co-initial",
  completion: "pr-co-completion",
};

type Status = "idle" | "profile-loading" | "completion-loading" | "completed";

export interface CompletionStore {
  status: Status;
  sorter: Sorter | null;
  profile: Profile | null;
  initial: Completion[];
  completion: Completion[];
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
    setProfile(value: Store["profile"]) {
      this.profile = value;
      setStorage(keys.profile, value);
    },
    setCompletion(value: Store["completion"], status?: Store["status"]) {
      this.completion = value;
      if (status) this.status = status;
      setStorage(keys.completion, value);
      this.initial = value;
      setStorage(keys.initial, value);
    },
    restoreCompletion() {
      this.completion = this.initial;
      setStorage(keys.completion, this.initial);
    },
    completeItem(index: number) {
      const picked = this.completion[index];
      if (!picked) return;
      picked.earned_counts = picked.counts;
      setStorage(keys.completion, this.completion);
    },
  },
});

import type { Completion } from "@/models/completion";
import type { Profile } from "@/models/profile";
import type { Progress } from "@/models/progress";
import { readStorage, setStorage } from "@/utils/local-storage";
import { calculateProgress, getDefaultProgress } from "@/utils/progress";
import { defineStore } from "pinia";

const keys = {
  profile: "pr-co-profile",
  completion: "pr-co-completion",
};

type Status = "idle" | "profile-loading" | "completion-loading" | "completed";

interface Store {
  status: Status;
  progress: Progress;
  profile: Profile | null;
  completion: Completion[];
}

const getDefaultState = (): Store => {
  return {
    status: "idle",
    progress: getDefaultProgress(),
    profile: readStorage<Store["profile"]>(keys.profile, null),
    completion: readStorage<Store["completion"]>(keys.completion, []),
  };
};

export const useCompletionStore = defineStore("completion", {
  state: getDefaultState,
  getters: {
    loading: ({ status }): boolean =>
      status === "profile-loading" || status === "completion-loading",
    calculated: ({ completion }) => calculateProgress(completion),
  },
  actions: {
    setStatus(value: Store["status"]) {
      this.status = value;
    },
    setProgress(value: Store["progress"]) {
      this.progress = value;
    },
    setProfile(value: Store["profile"]) {
      this.profile = value;
      setStorage(keys.profile, value);
    },
    setCompletion(value: Store["completion"], status?: Store["status"]) {
      this.completion = value;
      if (status) this.status = status;
      setStorage(keys.completion, value);
    },
  },
});

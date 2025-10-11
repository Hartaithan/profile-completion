import type { Completion } from "@/models/completion";
import type { Profile } from "@/models/profile";
import { readStorage, setStorage } from "@/utils/local-storage";
import { defineStore } from "pinia";

const keys = {
  profile: "pr-co-profile",
  completion: "pr-co-completion",
};

type Status = "idle" | "profile-loading" | "completion-loading" | "completed";

interface Store {
  status: Status;
  profile: Profile | null;
  completion: Completion[];
}

const getDefaultState = (): Store => {
  return {
    status: "idle",
    profile: readStorage<Store["profile"]>(keys.profile, null),
    completion: readStorage<Store["completion"]>(keys.completion, []),
  };
};

export const useCompletionStore = defineStore("completion", {
  state: getDefaultState,
  getters: {
    loading: ({ status }): boolean =>
      status === "profile-loading" || status === "completion-loading",
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
    },
  },
});

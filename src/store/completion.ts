import type { Completion } from "@/models/completion";
import type { Profile } from "@/models/profile";
import { readStorage, setStorage } from "@/utils/local-storage";
import { defineStore } from "pinia";

const keys = {
  profile: "pr-co-profile",
  completion: "pr-co-completion",
};

type Status = "idle" | "profile-loading" | "completion-loading" | "completed";

interface CompletionStore {
  status: Status;
  profile: Profile | null;
  completion: Completion[];
}

const getDefaultState = (): CompletionStore => {
  return {
    status: "idle",
    profile: readStorage(keys.profile, null),
    completion: readStorage(keys.completion, []),
  };
};

export const useCompletionStore = defineStore("completion", {
  state: getDefaultState,
  getters: {
    loading: ({ status }): boolean =>
      status === "profile-loading" || status === "completion-loading",
  },
  actions: {
    setStatus(value: CompletionStore["status"]) {
      this.status = value;
    },
    setProfile(value: CompletionStore["profile"]) {
      this.profile = value;
      setStorage(keys.profile, value);
    },
    setCompletion(value: CompletionStore["completion"]) {
      this.completion = value;
      setStorage(keys.completion, value);
    },
  },
});

import type { Completion } from "@/models/completion";
import type { Profile } from "@/models/profile";
import { defineStore } from "pinia";

type Status = "idle" | "profile-loading" | "completion-loading" | "completed";

interface CompletionStore {
  status: Status;
  profile: Profile | null;
  completion: Completion[];
}

export const useCompletionStore = defineStore("completion", {
  state: (): CompletionStore => ({ status: "idle", profile: null, completion: [] }),
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
    },
    setCompletion(value: CompletionStore["completion"]) {
      this.completion = value;
    },
  },
});

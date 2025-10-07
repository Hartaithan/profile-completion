import type { Completion } from "@/models/completion";
import { defineStore } from "pinia";

interface CompletionStore {
  list: Completion[];
}

export const useCompletionStore = defineStore("completion", {
  state: (): CompletionStore => ({ list: [] }),
  actions: {
    set(value: CompletionStore["list"]) {
      this.list = value;
    },
  },
});

import { calculatedKey, completionKey, initialKey, profileKey } from "@/constants/storage";
import type { FetchStatus } from "@/models/app";
import type { CompletionProgress, NullableCompletion } from "@/models/completion";
import type { Filters, Sorter } from "@/models/filters";
import type { Profile } from "@/models/profile";
import {
  readForage,
  readStorage,
  removeForage,
  removeStorage,
  setForage,
  setStorage,
} from "@/utils/local-storage";
import { getProgress } from "@/utils/progress";
import { defineStore } from "pinia";
import { toRaw } from "vue";

const keys = {
  profile: profileKey,
  initial: initialKey,
  completion: completionKey,
  calculated: calculatedKey,
};

interface Progress {
  current: number;
  total: number;
}

export interface CompletionStore {
  status: FetchStatus;
  progress: Progress;
  sorter: Sorter | null;
  filters: Filters;
  profile: Profile | null;
  calculated: CompletionProgress | null;
  initial: NullableCompletion[];
  completion: NullableCompletion[];
}

type Store = CompletionStore;

const defaultState: Store = {
  status: "initializing",
  progress: { current: 0, total: 0 },
  sorter: null,
  filters: {},
  profile: null,
  calculated: null,
  initial: [],
  completion: [],
};

const getDefaultState = (): Store => ({
  ...defaultState,
  profile: readStorage<Store["profile"]>(keys.profile, null),
  calculated: readStorage<Store["calculated"]>(keys.calculated, null),
});

const isLoading: Partial<Record<FetchStatus, boolean>> = {
  initializing: true,
  "profile-loading": true,
  "completion-loading": true,
};

export const useCompletionStore = defineStore("completion", {
  state: getDefaultState,
  getters: {
    loading: ({ status }): boolean => isLoading[status] || false,
  },
  actions: {
    async init() {
      this.status = "initializing";
      try {
        const [initial, completion] = await Promise.all([
          readForage<Store["initial"]>(keys.initial, []),
          readForage<Store["completion"]>(keys.completion, []),
        ]);
        this.initial = initial;
        this.completion = completion;
      } catch (error) {
        console.error("unable to initialize completion store", error);
      } finally {
        this.status = "idle";
      }
    },
    setStatus(value: Store["status"]) {
      this.status = value;
    },
    setProgress(value: Store["progress"]) {
      this.progress = value;
    },
    setSorter(value: Store["sorter"]) {
      this.sorter = value;
    },
    setFilter<K extends keyof Filters>(key: K, value: Filters[K] | null) {
      if (value === null) delete this.filters[key];
      else this.filters[key] = value;
    },
    setFilters(value: Store["filters"]) {
      this.filters = value;
    },
    setProfile(value: Store["profile"]) {
      this.profile = value;
      setStorage(keys.profile, value);
    },
    setCalculated(value: Store["calculated"]) {
      this.calculated = value;
      setStorage(keys.calculated, value);
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
    completeItem(id: string | undefined, target: "platinum" | "complete") {
      if (!id) return;
      if (!this.calculated) return;
      const picked = this.completion?.find((i) => i?.id === id);
      if (!picked?.points || !picked?.progress) return;
      let delta = 0;
      switch (target) {
        case "platinum":
          if (picked?.base_counts) picked.earned_counts = picked.base_counts;
          delta = picked.points.base - picked.progress.earned;
          picked.progress.earned = picked.points.base;
          break;
        case "complete":
          picked.earned_counts = picked.counts;
          delta = picked.points.total - picked.progress.earned;
          picked.progress.earned = picked.points.total;
          break;
        default:
          break;
      }
      picked.progress.value = getProgress(picked.progress.earned, picked.progress.total);
      this.calculated.earned += delta;
      this.calculated.value = getProgress(this.calculated.earned, this.calculated.total);
      setForage(keys.completion, this.completion);
    },
    reset() {
      this.status = "idle";
      this.progress = defaultState.progress;
      this.sorter = defaultState.sorter;
      this.filters = defaultState.filters;
      this.profile = defaultState.profile;
      removeStorage(keys.profile);
      this.calculated = defaultState.calculated;
      removeStorage(keys.calculated);
      this.initial = defaultState.initial;
      removeForage(keys.initial);
      this.completion = defaultState.completion;
      removeForage(keys.completion);
    },
  },
});

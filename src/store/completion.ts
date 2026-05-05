import {
  calculatedKey,
  completionKey,
  initialCalculatedKey,
  initialCompletionKey,
  profileKey,
} from "@/constants/storage";
import type { FetchStatus } from "@/models/app";
import type { CompletionProgress, NullableCompletion } from "@/models/completion";
import type { Filters, Sorter } from "@/models/filters";
import type { Profile } from "@/models/profile";
import { filterCompletion, sortCompletion } from "@/utils/data-transform";
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
  initialCompletion: initialCompletionKey,
  completion: completionKey,
  initialCalculated: initialCalculatedKey,
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
  initialCalculated: CompletionProgress | null;
  calculated: CompletionProgress | null;
  initialCompletion: NullableCompletion[];
  completion: NullableCompletion[];
  view: NullableCompletion[];
}

type Store = CompletionStore;

const defaultState: Store = {
  status: "initializing",
  progress: { current: 0, total: 0 },
  sorter: null,
  filters: {},
  profile: null,
  initialCalculated: null,
  calculated: null,
  initialCompletion: [],
  completion: [],
  view: [],
};

const getDefaultState = (): Store => ({
  ...defaultState,
  profile: readStorage<Store["profile"]>(keys.profile, null),
  calculated: readStorage<Store["calculated"]>(keys.calculated, null),
  initialCalculated: readStorage<Store["initialCalculated"]>(keys.initialCalculated, null),
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
          readForage<Store["initialCompletion"]>(keys.initialCompletion, []),
          readForage<Store["completion"]>(keys.completion, []),
        ]);
        this.initialCompletion = initial;
        this.completion = completion;
        this.view = structuredClone(completion);
      } catch (error) {
        console.error("unable to initialize completion store", error);
      } finally {
        this.status = "idle";
      }
    },
    updateView() {
      let items = toRaw<NullableCompletion[]>(this.completion);
      if (this.filters && Object.keys(this.filters).length > 0)
        items = filterCompletion(items, this.filters);
      if (this.sorter) items = sortCompletion(items, this.sorter);
      this.view = items;
    },
    setStatus(value: Store["status"]) {
      this.status = value;
    },
    setProgress(value: Store["progress"]) {
      this.progress = value;
    },
    setSorter(value: Store["sorter"]) {
      this.sorter = value;
      this.updateView();
    },
    setFilter<K extends keyof Filters>(key: K, value: Filters[K] | null) {
      if (value === null) delete this.filters[key];
      else if (Array.isArray(value) && value.length === 0) delete this.filters[key];
      else this.filters[key] = value;
      this.updateView();
    },
    setFilters(value: Store["filters"]) {
      this.filters = value;
      this.updateView();
    },
    setProfile(value: Store["profile"]) {
      this.profile = value;
      setStorage(keys.profile, value);
    },
    setCalculated(value: Store["calculated"]) {
      this.calculated = value;
      setStorage(keys.calculated, value);
      this.initialCalculated = structuredClone(value);
      setStorage(keys.initialCalculated, value);
    },
    setCompletion(value: Store["completion"], status?: Store["status"]) {
      if (status) this.status = status;
      this.completion = value;
      setForage(keys.completion, value);
      this.initialCompletion = structuredClone(value);
      setForage(keys.initialCompletion, value);
      this.updateView();
    },
    completeItem(id: string | undefined, target: "platinum" | "complete") {
      if (!id) return;
      if (!this.calculated) return;
      const picked = this.completion?.find((i) => i?.id === id);
      if (!picked?.points || !picked?.progress || !picked?.base_counts) return;
      let delta = 0;
      switch (target) {
        case "platinum":
          picked.earned_counts = structuredClone(toRaw(picked.base_counts));
          delta = picked.points.base - picked.progress.earned;
          picked.progress.earned = picked.points.base;
          break;
        case "complete":
          picked.earned_counts = structuredClone(toRaw(picked.counts));
          delta = picked.points.total - picked.progress.earned;
          picked.progress.earned = picked.points.total;
          break;
        default:
          break;
      }
      picked.progress.value = getProgress(picked.progress.earned, picked.progress.total);
      this.calculated.earned += delta;
      this.calculated.value = getProgress(this.calculated.earned, this.calculated.total);
      setStorage(keys.calculated, this.calculated);
      setForage(keys.completion, this.completion);
      this.updateView();
    },
    restore() {
      const calculated = toRaw(this.initialCalculated);
      this.calculated = structuredClone(calculated);
      setStorage(keys.calculated, calculated);
      const completion = toRaw(this.initialCompletion);
      this.completion = structuredClone(completion);
      setForage(keys.completion, completion);
      this.updateView();
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
      this.initialCalculated = defaultState.initialCalculated;
      removeStorage(keys.initialCalculated);
      this.initialCompletion = defaultState.initialCompletion;
      removeForage(keys.initialCompletion);
      this.completion = defaultState.completion;
      removeForage(keys.completion);
      this.view = defaultState.view;
    },
  },
});

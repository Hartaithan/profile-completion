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
import { clone, cloneAndPersist, persist } from "@/utils/store";
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
        this.view = clone(completion);
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
      this.calculated = persist(keys.calculated, value);
      this.initialCalculated = cloneAndPersist(keys.initialCalculated, value);
    },
    setCompletion(value: Store["completion"], status?: Store["status"]) {
      if (status) this.status = status;
      this.completion = persist(keys.completion, value, "forage");
      this.initialCompletion = cloneAndPersist(keys.initialCompletion, value, "forage");
      this.updateView();
    },
    completeItem(id: string | undefined, target: "platinum" | "complete") {
      if (!id || !this.calculated) return;
      const item = this.completion?.find((i) => i?.id === id);
      if (!item?.points || !item?.progress || !item?.base_counts) return;
      const isPlatinum = target === "platinum";
      const earned = isPlatinum ? item.points.base : item.points.total;
      const delta = earned - item.progress.earned;
      item.earned_counts = clone(isPlatinum ? item.base_counts : item.counts);
      item.progress.earned = earned;
      item.progress.value = getProgress(earned, item.progress.total);
      this.calculated.earned += delta;
      this.calculated.value = getProgress(this.calculated.earned, this.calculated.total);
      setStorage(keys.calculated, this.calculated);
      setForage(keys.completion, this.completion);
      this.updateView();
    },
    restore() {
      this.calculated = cloneAndPersist(keys.calculated, this.initialCalculated);
      this.completion = cloneAndPersist(keys.completion, this.initialCompletion, "forage");
      this.updateView();
    },
    reset() {
      Object.assign(this, { ...defaultState, status: "idle" });
      removeStorage(keys.profile);
      removeStorage(keys.calculated);
      removeStorage(keys.initialCalculated);
      removeForage(keys.initialCompletion);
      removeForage(keys.completion);
    },
  },
});

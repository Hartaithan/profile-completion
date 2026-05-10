import {
  calculatedKey,
  completionKey,
  initialCalculatedKey,
  initialCompletionKey,
  profileKey,
} from "@/constants/storage";
import type { FetchStatus } from "@/models/app";
import type { CompletionProgress, CompletionTarget, NullableCompletion } from "@/models/completion";
import type { Filters, Sorter } from "@/models/filters";
import type { Profile } from "@/models/profile";
import { completeItemTrophies } from "@/utils/completion";
import { filterCompletion, sortCompletion } from "@/utils/data-transform";
import { InitialCompletion } from "@/utils/initial-completion";
import {
  readForage,
  readStorage,
  removeForage,
  removeStorage,
  setForage,
  setStorage,
} from "@/utils/local-storage";
import { getPoint, getProgress } from "@/utils/progress";
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
  calculated: CompletionProgress | null;
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
  calculated: null,
  completion: [],
  view: [],
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
        const completion = await readForage<Store["completion"]>(keys.completion, []);
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
      persist(keys.initialCalculated, value);
    },
    recalculatePoints(delta: number) {
      if (!this.calculated) return;
      this.calculated.earned += delta;
      this.calculated.value = getProgress(this.calculated.earned, this.calculated.total);
      setStorage(keys.calculated, this.calculated);
    },
    setCompletion(value: Store["completion"], status?: Store["status"]) {
      if (status) this.status = status;
      this.completion = persist(keys.completion, value, "forage");
      persist(keys.initialCompletion, value, "forage");
      InitialCompletion.invalidate();
      this.updateView();
    },
    completeItem(id: string | undefined, target: CompletionTarget) {
      if (!id || !this.calculated) return;
      const item = this.completion?.find((i) => i?.id === id);
      if (!item?.points || !item?.progress || !item?.base_counts) return;
      const isPlatinum = target === "platinum";
      const earned = isPlatinum ? item.points.base : item.points.total;
      const delta = earned - item.progress.earned;
      item.earned_counts = clone(isPlatinum ? item.base_counts : item.counts);
      item.progress.earned = earned;
      item.progress.value = getProgress(earned, item.progress.total);
      this.recalculatePoints(delta);
      const trophies = completeItemTrophies(item.trophies, target);
      item.trophies = trophies;
      setForage(keys.completion, this.completion);
      this.updateView();
    },
    completeTrophy(id: string | undefined, trophyId: number | undefined) {
      if (!id || trophyId === undefined || !this.calculated) return;
      const item = this.completion?.find((i) => i?.id === id);
      if (!item?.trophies || !item?.progress || !item?.earned_counts) return;
      const trophy = item.trophies.find((t) => t.kind === "trophy" && t.id === trophyId);
      if (!trophy || trophy.kind !== "trophy") return;
      const earned = trophy.earned;
      const modifier = earned ? -1 : 1;
      const points = getPoint(trophy.type);
      const delta = points * modifier;
      trophy.earned = !trophy.earned;
      trophy.earned_at = trophy.earned ? new Date().toISOString() : undefined;
      item.earned_counts[trophy.type] += modifier;
      if (item.earned_counts.total !== undefined) item.earned_counts.total += modifier;
      item.progress.earned += delta;
      item.progress.value = getProgress(item.progress.earned, item.progress.total);
      this.recalculatePoints(delta);
      setForage(keys.completion, this.completion);
      this.updateView();
    },
    async restore() {
      const completion = await InitialCompletion.get();
      this.completion = cloneAndPersist(keys.completion, completion, "forage");
      const calculated = readStorage(keys.initialCalculated, defaultState.calculated);
      this.calculated = cloneAndPersist(keys.calculated, calculated);
      this.updateView();
    },
    async restoreItem(id: string | undefined) {
      if (!id || !this.calculated) return;
      const index = this.completion.findIndex((i) => i?.id === id);
      const item = this.completion?.[index];
      if (!item?.progress) return;
      const completion = await InitialCompletion.get();
      if (!completion) return;
      const initial = completion[index];
      if (!initial?.progress) return;
      const delta = initial.progress.earned - item.progress.earned;
      this.completion[index] = clone(initial);
      this.recalculatePoints(delta);
      setForage(keys.completion, this.completion);
      this.updateView();
    },
    reset() {
      Object.assign(this, { ...defaultState, status: "idle" });
      removeStorage(keys.profile);
      removeStorage(keys.calculated);
      removeStorage(keys.initialCalculated);
      removeForage(keys.initialCompletion);
      removeForage(keys.completion);
      InitialCompletion.invalidate();
    },
  },
});

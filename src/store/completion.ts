import {
  calculatedKey,
  completionKey,
  initialCalculatedKey,
  initialCompletionKey,
  profileKey,
} from "@/constants/storage";
import type { FetchStatus } from "@/models/app";
import type {
  Completion,
  CompletionProgress,
  CompletionTarget,
  NullableCompletion,
} from "@/models/completion";
import type { Filters, Sorter } from "@/models/filters";
import type { Profile } from "@/models/profile";
import type { Trophy } from "@/models/trophy";
import { applyItemProgress, completeItemTrophies, uncompleteAllTrophies } from "@/utils/completion";
import { buildCompletionMap, syncMapsForItem } from "@/utils/completion-maps";
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
  completionMap: Record<string, Completion>;
  trophyMap: Record<string, Record<number, Trophy>>;
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
  completionMap: {},
  trophyMap: {},
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
        this.assignMaps(this.completion);
        this.updateView();
      } catch (error) {
        console.error("unable to initialize completion store", error);
      } finally {
        this.status = "idle";
      }
    },
    assignMaps(completion: NullableCompletion[]) {
      const maps = buildCompletionMap(completion);
      this.completionMap = maps.completionMap;
      this.trophyMap = maps.trophyMap;
    },
    updateView() {
      let items: NullableCompletion[] = this.completion;
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
      this.assignMaps(this.completion);
      this.updateView();
    },
    completeItem(id: string | undefined, target: CompletionTarget) {
      if (!id || !this.calculated) return;
      const item = this.completionMap[id];
      if (!item?.points || !item?.progress || !item?.base_counts) return;
      const isPlatinum = target === "platinum";
      const earned = isPlatinum ? item.points.base : item.points.total;
      const counts = clone(isPlatinum ? item.base_counts : item.counts);
      const delta = applyItemProgress(item, earned, counts);
      this.recalculatePoints(delta);
      completeItemTrophies(this.completionMap[id], target);
      setForage(keys.completion, this.completion);
      this.updateView();
    },
    completeTrophy(id: string | undefined, trophyId: number | undefined) {
      if (!id || trophyId === undefined || !this.calculated) return;
      const item = this.completionMap[id];
      if (!item?.trophies || !item?.progress || !item?.earned_counts) return;
      const trophy = this.trophyMap[id]?.[trophyId];
      if (!trophy || trophy.kind !== "trophy") return;
      const modifier = trophy.earned ? -1 : 1;
      const delta = getPoint(trophy.type) * modifier;
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
    completeAllTrophies(id: string | undefined) {
      if (!id || !this.calculated) return;
      const item = this.completionMap[id];
      if (!item?.points || !item?.progress || !item?.base_counts) return;
      const delta = applyItemProgress(item, item.points.total, clone(item.counts));
      this.recalculatePoints(delta);
      completeItemTrophies(this.completionMap[id], "complete");
      setForage(keys.completion, this.completion);
      this.updateView();
    },
    uncompleteAllTrophies(id: string | undefined) {
      if (!id || !this.calculated) return;
      const item = this.completionMap[id];
      if (!item?.points || !item?.progress || !item?.base_counts) return;
      const counts = { ...item.counts, platinum: 0, gold: 0, silver: 0, bronze: 0, total: 0 };
      const delta = applyItemProgress(item, 0, counts);
      this.recalculatePoints(delta);
      uncompleteAllTrophies(this.completionMap[id]);
      setForage(keys.completion, this.completion);
      this.updateView();
    },
    async restore() {
      const completion = await InitialCompletion.get();
      this.completion = cloneAndPersist(keys.completion, completion, "forage");
      this.assignMaps(this.completion);
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
      const restored = clone(initial);
      this.completion[index] = restored;
      if (restored) syncMapsForItem(this.completionMap, this.trophyMap, restored);
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

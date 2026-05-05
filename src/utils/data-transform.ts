import type { Completion, NullableCompletion } from "@/models/completion";
import type { Filters, SortDirection, Sorter } from "@/models/filters";
import type { AcceptableValue } from "reka-ui";
import { computed } from "vue";

const getValueByPath = (obj: object | null | undefined, path: string): unknown => {
  if (!obj) return undefined;
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
};

export const sortCompletion = (items: NullableCompletion[], sorter: Sorter | null) => {
  if (!items.length) return [];
  if (!sorter || !sorter.field) return items;
  const { field, direction = "asc" } = sorter;
  return [...items].sort((a, b) => {
    if (!a || !b) return 0;
    const va = getValueByPath(a, field);
    const vb = getValueByPath(b, field);
    if (typeof va === "number" && typeof vb === "number")
      return direction === "asc" ? va - vb : vb - va;
    if (typeof va === "string" && typeof vb === "string")
      return direction === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    return 0;
  });
};

export const filterCompletion = (items: NullableCompletion[], filters: Filters | undefined) => {
  if (!items.length) return [];
  if (!filters) return items;
  const { platforms, completion } = filters;

  const platformSet = platforms?.length ? new Set(platforms) : null;
  const hasPlatformFilter = !!(platformSet && platformSet.size > 0);
  const hasCompletionFilter = !!(completion && completion !== "all");
  if (!hasPlatformFilter && !hasCompletionFilter) return items;

  return items.filter((item) => {
    if (!item) return false;
    if (hasPlatformFilter) {
      if (!item.platforms.some((p) => platformSet.has(p))) return false;
    }
    if (hasCompletionFilter) {
      const is100 = item.progress?.value === 100;
      const hasPlatinum = (item.earned_counts?.platinum ?? 0) > 0;
      switch (completion) {
        case "100":
          if (!is100) return false;
          break;
        case "not-100":
          if (is100) return false;
          break;
        case "not-100-or-platinum":
          if (is100 || hasPlatinum) return false;
          break;
        case "platinum":
          if (!hasPlatinum) return false;
          break;
        case "platinum-not-100":
          if (!hasPlatinum || is100) return false;
          break;
      }
    }
    return true;
  });
};

export const stringToSorter = (value: AcceptableValue) => {
  if (typeof value !== "string") return null;
  const [field, direction] = value.split(":") as [keyof Completion, SortDirection];
  if (!field || !direction) return null;
  return { field, direction };
};

export const sorterToString = (value: Sorter | null) => {
  if (!value) return "";
  return `${value.field}:${value.direction}`;
};

export const makeSorter = <T extends object, K extends keyof T>(
  source: T,
  key: K,
  onChange: (sorter: Sorter | null) => void,
) => {
  return computed({
    get: () => sorterToString(source[key] as Sorter | null),
    set: (value: AcceptableValue) => onChange(stringToSorter(value)),
  });
};

export const makeFilter = <T extends object, K extends keyof T>(
  source: T,
  key: K,
  onChange: <K extends keyof T>(key: K, value: T[K] | null) => void,
) => {
  return computed({
    get: () => source[key],
    set: (value: T[K] | null) => onChange(key, value),
  });
};

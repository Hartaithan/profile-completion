import { defaultRangeExtractor, type Range } from "@tanstack/virtual-core";
import { computed, ref, type ComputedRef, type Ref } from "vue";

export interface UseStickyIndexesOptions<T> {
  items: Ref<T[]> | ComputedRef<T[]>;
  isStickyItem: (item: T, index: number) => boolean;
  initialActiveIndex?: number;
  extractor?: (params: {
    range: Range;
    activeStickyIndex: number;
    stickyIndexes: readonly number[];
    defaultIndexes: number[];
  }) => number[];
}

export const useStickyIndexes = <T>({
  items,
  isStickyItem,
  initialActiveIndex = 0,
  extractor,
}: UseStickyIndexesOptions<T>) => {
  const activeStickyIndex = ref(initialActiveIndex);

  const stickyIndexes = computed<number[]>(() => {
    const result: number[] = [];
    const list = items.value;
    const length = list.length;
    for (let i = 0; i < length; i++) {
      const item = list[i];
      if (item === undefined) continue;
      if (isStickyItem(item, i)) result.push(i);
    }
    return result;
  });

  const findActiveStickyIndex = (startIndex: number): number => {
    const indexes = stickyIndexes.value;
    let left = 0;
    let right = indexes.length - 1;
    let result = initialActiveIndex;
    while (left <= right) {
      const mid = (left + right) >> 1;
      const value = indexes[mid];
      if (value === undefined) break;
      if (value <= startIndex) {
        result = value;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return result;
  };

  const isSticky = (index: number): boolean => {
    return stickyIndexes.value.includes(index);
  };

  const isActiveSticky = (index: number): boolean => {
    return activeStickyIndex.value === index;
  };

  const rangeExtractor = (range: Range): number[] => {
    const active = findActiveStickyIndex(range.startIndex);
    activeStickyIndex.value = active;
    const indexes = defaultRangeExtractor(range);
    if (extractor) {
      return extractor({
        range,
        activeStickyIndex: active,
        stickyIndexes: stickyIndexes.value,
        defaultIndexes: indexes,
      });
    }
    if (indexes[0] === active) return indexes;
    return [active, ...indexes];
  };

  return {
    stickyIndexes,
    activeStickyIndex,
    isSticky,
    isActiveSticky,
    rangeExtractor,
  };
};

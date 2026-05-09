<script setup lang="ts">
import TrophyContent from "@/components/trophy-content.vue";
import { useStickyIndexes } from "@/hooks/use-sticky-headers";
import type { Trophy, TrophyItem } from "@/models/trophy";
import { useVirtualizer } from "@tanstack/vue-virtual";
import { computed, onMounted, onUpdated, ref, shallowRef } from "vue";

interface Props {
  id: string | undefined;
  trophies: TrophyItem[] | undefined;
}

const props = defineProps<Props>();
const parent = ref<HTMLElement | null>(null);

const getTrophy = (item: TrophyItem | undefined): Trophy | undefined => {
  if (item?.kind === "group") return;
  return item;
};

const { isSticky, isActiveSticky, rangeExtractor } = useStickyIndexes({
  items: computed(() => props.trophies ?? []),
  isStickyItem: (item) => item.kind === "group",
});

const options = computed(() => ({
  count: props.trophies?.length ?? 0,
  getScrollElement: () => parent.value,
  estimateSize: () => 78,
  rangeExtractor,
}));

const virtualizer = useVirtualizer(options);
const rows = computed(() => virtualizer.value.getVirtualItems());
const total = computed(() => virtualizer.value.getTotalSize());
const elements = shallowRef<HTMLElement[]>([]);

const measureAll = () => {
  virtualizer.value.measureElement(null);
  elements.value.forEach((el) => {
    if (el) virtualizer.value.measureElement(el);
  });
};

onMounted(measureAll);
onUpdated(measureAll);
</script>

<template>
  <div
    ref="parent"
    class="scrollbar-thin w-full overflow-y-auto"
    style="height: 500px; contain: strict">
    <div class="relative w-full" :style="{ height: `${total}px` }">
      <div
        v-for="row in rows"
        :key="row.index"
        :data-index="row.index"
        ref="elements"
        :class="[
          'absolute top-0 left-0 w-full',
          {
            'sticky -top-px! z-1': isSticky(row.index) && isActiveSticky(row.index),
            'z-1': isSticky(row.index) && !isActiveSticky(row.index),
          },
        ]"
        :style="
          isActiveSticky(row.index) ? undefined : { transform: `translateY(${row.start}px)` }
        ">
        <template v-if="trophies?.[row.index]?.kind === 'group'">
          <div
            class="text-muted-foreground bg-popover border-b py-2 text-xs font-bold tracking-wider uppercase sm:text-sm">
            <h3 v-if="trophies?.[row.index]?.id === 'default'">Base game</h3>
            <h3 v-else>DLC {{ Number(trophies?.[row.index]?.id ?? 0) }}</h3>
          </div>
        </template>
        <TrophyContent v-else :item="id" :trophy="getTrophy(trophies?.[row.index])" />
      </div>
    </div>
  </div>
</template>

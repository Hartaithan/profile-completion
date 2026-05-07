<script setup lang="ts">
import TrophyContent from "@/components/trophy-content.vue";
import type { Trophy, TrophyItem } from "@/models/trophy";
import { useVirtualizer } from "@tanstack/vue-virtual";
import { computed, onMounted, onUpdated, ref, shallowRef } from "vue";

interface Props {
  id: string | undefined;
  trophies: TrophyItem[] | undefined;
}

const props = defineProps<Props>();

const parent = ref<HTMLElement | null>(null);

const options = computed(() => ({
  count: props.trophies?.length ?? 0,
  getScrollElement: () => parent.value,
  estimateSize: () => 78,
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
        class="absolute top-0 left-0 w-full"
        :style="{ transform: `translateY(${rows[0]?.start ?? 0}px)` }">
        <div v-for="row in rows" :key="row.index" :data-index="row.index" ref="elements">
          <template v-if="trophies?.[row.index] && trophies?.[row.index]?.kind === 'group'">
            <div class="text-muted-foreground py-2 text-xs font-bold tracking-wider uppercase">
              <h3 v-if="trophies?.[row.index]?.id === 'default'">Base game</h3>
              <h3 v-else>DLC {{ Number(trophies?.[row.index]?.id ?? 0) }}</h3>
            </div>
          </template>
          <TrophyContent
            v-if="trophies?.[row.index] && trophies?.[row.index]?.kind === 'trophy'"
            :trophy="trophies?.[row.index] as Trophy" />
        </div>
      </div>
    </div>
  </div>
</template>

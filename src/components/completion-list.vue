<script setup lang="ts">
import CompletionEmptyState from "@/components/completion-empty-state.vue";
import CompletionItem from "@/components/completion-item.vue";
import { useCompletionStore } from "@/store/completion";
import { Skeleton } from "@/ui/skeleton";
import { useWindowVirtualizer } from "@tanstack/vue-virtual";
import { computed, onMounted, ref, type VNodeRef } from "vue";

const sizes = {
  item: 56,
  spacing: () => {
    const sm = window.innerWidth < 640;
    return sm ? 20 : 12;
  },
};

const store = useCompletionStore();

const parent = ref<HTMLElement | null>(null);
const parentOffset = ref(0);

const options = computed(() => ({
  count: store.calculated.completion.length,
  getScrollElement: () => window,
  estimateSize: () => sizes.item + sizes.spacing(),
  scrollMargin: parentOffset.value,
  overscan: 5,
}));

const virtualizer = useWindowVirtualizer(options);
const rows = computed(() => virtualizer.value.getVirtualItems());
const total = computed(() => virtualizer.value.getTotalSize());

const measureElement: VNodeRef = (element) => {
  if (!element || "el" in element == false) return;
  virtualizer.value.measureElement(element.el as Element);
};

onMounted(() => {
  parentOffset.value = parent.value?.offsetTop ?? 0;
});
</script>

<template>
  <div class="container mt-6 w-full" ref="parent">
    <div v-if="store.loading" class="flex w-full flex-col gap-y-3">
      <Skeleton class="h-20" />
      <Skeleton class="h-20" />
      <Skeleton class="h-20" />
      <Skeleton class="h-20" />
      <Skeleton class="h-20" />
    </div>
    <CompletionEmptyState v-if="!store.loading && !store.profile" />
    <div
      v-if="!store.loading && store.calculated.completion.length > 0"
      class="relative w-full"
      :style="{ height: `${total}px` }">
      <CompletionItem
        v-for="row in rows"
        :key="row.index"
        :completion="store.calculated.completion?.[row.index] ?? null"
        :index="row.index"
        :data-index="row.index"
        :ref="measureElement"
        :style="{
          transform: `translateY(${row.start - virtualizer.options.scrollMargin}px)`,
          'padding-bottom': `${sizes.spacing()}px`,
        }" />
    </div>
    <p
      v-if="!store.loading && store.profile && store.calculated.completion.length === 0"
      class="text-center">
      nothing found :(
    </p>
  </div>
</template>

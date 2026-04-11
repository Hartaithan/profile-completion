<script setup lang="ts">
import { useWindowVirtualizer } from "@tanstack/vue-virtual";
import { computed, onMounted, ref, type VNodeRef } from "vue";
import { useCompletionStore } from "../store/completion";
import CompletionItem from "./completion-item.vue";
import CompletionSkeleton from "./completion-skeleton.vue";

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
      <CompletionSkeleton />
      <CompletionSkeleton />
      <CompletionSkeleton />
      <CompletionSkeleton />
      <CompletionSkeleton />
    </div>
    <div v-else-if="!store.profile" class="text-center">
      <p>Enter your PSN ID to start tracking your profile completion!</p>
      <p class="font-bold">
        Just make sure your PSN profile is set to public so your trophy data can be accessed!
      </p>
    </div>
    <div
      v-else-if="store.calculated.completion.length > 0"
      class="relative w-full"
      :style="{ height: `${total}px` }">
      <CompletionItem
        v-for="row in rows"
        :key="row.index"
        :completion="store.calculated.completion?.[row.index] ?? null"
        :index="row.index"
        :data-index="row.index"
        :ref="measureElement"
        class="absolute top-0 left-0 w-full"
        :style="{
          transform: `translateY(${row.start - virtualizer.options.scrollMargin}px)`,
          'padding-bottom': `${sizes.spacing()}px`,
        }" />
    </div>
    <p v-else class="text-center">nothing found :(</p>
  </div>
</template>

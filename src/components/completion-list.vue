<script setup lang="ts">
import { useWindowVirtualizer } from "@tanstack/vue-virtual";
import { computed } from "vue";
import { useCompletionStore } from "../store/completion";
import CompletionItem from "./completion-item.vue";
import CompletionSkeleton from "./completion-skeleton.vue";

const sizes = {
  item: 56,
  spacing: 12,
};

const store = useCompletionStore();

const options = computed(() => ({
  count: store.calculated.completion.length,
  getScrollElement: () => window,
  estimateSize: () => sizes.item + sizes.spacing,
  overscan: 5,
}));

const rowVirtualizer = useWindowVirtualizer(options);

const virtualRows = computed(() => rowVirtualizer.value.getVirtualItems());

const totalSize = computed(() => rowVirtualizer.value.getTotalSize());
</script>

<template>
  <div class="container mt-6 w-full">
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
      class="relative flex w-full flex-col items-center justify-center gap-y-3"
      :style="{ height: `${totalSize}px` }">
      <CompletionItem
        v-for="virtualRow in virtualRows"
        :key="virtualRow.index"
        :completion="store.calculated.completion?.[virtualRow.index] || null"
        :index="virtualRow.index"
        :style="{
          top: `${virtualRow.start}px`,
          height: `${virtualRow.size}px`,
          'padding-bottom': `${sizes.spacing}px`,
        }" />
    </div>
    <p v-else class="text-center">nothing found :(</p>
  </div>
</template>

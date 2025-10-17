<script setup lang="ts">
import { formatProgress } from "@/utils/number";
import { watch } from "vue";
import { useCompletionStore } from "../store/completion";

const store = useCompletionStore();

watch(
  () => store.calculated,
  ({ progress }) => store.setProgress(progress),
  { immediate: true },
);
</script>

<template>
  <div class="container mt-6 p-6 pt-0">
    <div v-if="store.loading" class="text-center">...loading</div>
    <div
      v-else-if="store.calculated.completion.length > 0"
      class="flex flex-col items-center justify-center gap-2">
      <button
        class="mt-1 min-w-2xl cursor-pointer rounded bg-neutral-700 px-2 py-0.5"
        @click="store.restoreCompletion">
        restore
      </button>
      <div v-for="(item, index) in store.calculated.completion" :key="item.title" class="min-w-2xl">
        <p class="font-bold">{{ item.title }} | Progress: {{ formatProgress(item.progress) }}%</p>
        <pre class="text-sm">earned: {{ JSON.stringify(item.earned_counts) }}</pre>
        <pre class="text-sm">counts: {{ JSON.stringify(item.counts) }}</pre>
        <button
          class="mt-1 w-full cursor-pointer rounded bg-neutral-700 px-2 py-0.5"
          @click="store.completeItem(index)">
          toggle
        </button>
      </div>
    </div>
    <p v-else class="text-center">nothing found :(</p>
  </div>
</template>

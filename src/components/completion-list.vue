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
      <div v-for="item in store.calculated.completion" :key="item.title" class="min-w-2xl">
        <p class="font-bold">{{ item.title }} | Progress: {{ formatProgress(item.progress) }}%</p>
        <pre class="text-sm">{{ JSON.stringify(item.counts) }}</pre>
      </div>
    </div>
    <p v-else class="text-center">nothing found :(</p>
  </div>
</template>

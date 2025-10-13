<script setup lang="ts">
import { useCompletionStore } from "../store/completion";

const store = useCompletionStore();
const { completion, progress } = store.calculated;
store.setProgress(progress);
</script>

<template>
  <div class="container mt-6 p-6 pt-0">
    <div v-if="store.loading" class="text-center">...loading</div>
    <div v-else-if="completion.length > 0" class="flex flex-col items-center justify-center gap-2">
      <div v-for="item in completion" :key="item.title" class="min-w-2xl">
        <p class="font-bold">{{ item.title }} | Progress: {{ item.progress }}%</p>
        <pre class="text-sm">{{ JSON.stringify(item.counts) }}</pre>
      </div>
    </div>
    <p v-else class="text-center">nothing found :(</p>
  </div>
</template>

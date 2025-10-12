<script setup lang="ts">
import { useCompletionStore } from "../store/completion";

const store = useCompletionStore();
</script>

<template>
  <div class="container mt-6 p-6">
    <div v-if="store.loading" class="text-center">...loading</div>
    <div
      v-else-if="store.calculated.length > 0"
      class="flex flex-col items-center justify-center gap-2">
      <div v-for="item in store.calculated" :key="item.title" class="min-w-2xl">
        <p class="font-bold">{{ item.title }} | Progress: {{ item.progress }}%</p>
        <pre class="text-sm">{{ JSON.stringify(item.counts) }}</pre>
      </div>
    </div>
    <p v-else class="text-center">nothing found :(</p>
  </div>
</template>

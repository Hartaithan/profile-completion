<script setup lang="ts">
import { formatProgress } from "@/utils/number";
import { useCompletionStore } from "../store/completion";

const store = useCompletionStore();
</script>

<template>
  <div v-if="store.loading" class="container mt-6 text-center">...loading</div>
  <div v-else class="container mt-6 flex flex-col items-center p-6 pb-0">
    <p class="min-w-2xl font-bold">
      Total Progress: {{ formatProgress(store.calculated.progress.progress) }}%
    </p>
    <pre class="min-w-2xl">{{ JSON.stringify(store.calculated.progress) }}</pre>
  </div>
</template>

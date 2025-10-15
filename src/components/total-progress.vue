<script setup lang="ts">
import { formatProgress } from "@/utils/number";
import { useCompletionStore } from "../store/completion";

const store = useCompletionStore();
</script>

<template>
  <div class="container mt-6 flex flex-col items-center p-6 pb-0">
    <p class="min-w-2xl font-bold">
      Total Progress: {{ formatProgress(store.progress.progress) }}%
    </p>
    <pre class="min-w-2xl">{{ JSON.stringify(store.progress) }}</pre>
  </div>
</template>

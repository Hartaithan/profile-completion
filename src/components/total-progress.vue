<script setup lang="ts">
import { Progress } from "@/ui/progress";
import { formatProgress, getProgress } from "@/utils/progress";
import { useCompletionStore } from "../store/completion";

const store = useCompletionStore();
const progress = formatProgress(store.calculated.progress.progress, "%");
</script>

<template>
  <div v-if="store.loading" class="container mt-6 text-center">...loading</div>
  <div v-else class="container mt-6 flex flex-col">
    <span class="text-xl font-bold"> Total Completion: {{ progress }} </span>
    <div class="mt-2">
      <div class="flex justify-between">
        <p>Points</p>
        <p class="font-bold">
          {{ `${store.calculated.progress.earned} / ${store.calculated.progress.points}` }}
        </p>
      </div>
      <Progress class="mt-1" :model-value="getProgress(store.calculated.progress)" />
    </div>
  </div>
</template>

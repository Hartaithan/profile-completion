<script setup lang="ts">
import { Progress } from "@/ui/progress";
import { Skeleton } from "@/ui/skeleton";
import { formatProgress, getProgress } from "@/utils/progress";
import { useCompletionStore } from "../store/completion";

const store = useCompletionStore();
</script>

<template>
  <div v-if="store.loading" class="container py-6 text-center">
    <Skeleton class="h-5 w-full sm:h-7" />
    <Skeleton class="mt-2 h-7 w-full sm:h-9" />
  </div>
  <div
    v-else-if="store.profile"
    class="from-background via-background sticky top-0 z-50 container flex flex-col bg-gradient-to-b from-0% via-90% to-transparent to-100% py-6">
    <span class="text-sm font-bold sm:text-xl">
      Total Completion: {{ formatProgress(store.calculated.progress.progress, "%") }}
    </span>
    <div class="mt-2">
      <div class="flex justify-between">
        <p class="text-xs sm:text-base">Points</p>
        <p class="text-xs font-bold sm:text-base">
          {{ `${store.calculated.progress.earned} / ${store.calculated.progress.points}` }}
        </p>
      </div>
      <Progress class="mt-1" :model-value="getProgress(store.calculated.progress)" />
    </div>
  </div>
</template>

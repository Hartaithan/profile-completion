<script setup lang="ts">
import { useCompletionStore } from "@/store/completion";
import { Progress } from "@/ui/progress";
import { Skeleton } from "@/ui/skeleton";
import { formatNumber } from "@/utils/number";
import { formatProgress } from "@/utils/progress";

const store = useCompletionStore();
</script>

<template>
  <div v-if="store.loading" class="container mt-4 sm:mt-6">
    <Skeleton class="h-24 w-full sm:h-28" />
  </div>
  <div v-if="!store.loading && store.calculated" class="sticky top-6 z-50 container mt-4 sm:mt-6">
    <div
      class="bg-card border-border/50 flex h-auto flex-col justify-center rounded-lg border p-4 sm:h-28 sm:p-5">
      <div
        class="flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-0">
        <div class="flex flex-col">
          <span class="text-xxs text-muted-foreground font-bold tracking-widest uppercase">
            Completion Status
          </span>
          <h2 class="text-foreground text-lg font-black tracking-tight uppercase sm:text-2xl">
            Total Completion: {{ formatProgress(store.calculated.value, "%") }}
          </h2>
        </div>
        <span class="text-primary self-end font-mono text-xs uppercase sm:self-auto sm:text-sm">
          {{ formatNumber(store.calculated.earned) }} points
        </span>
      </div>
      <Progress class="mt-2 sm:mt-3" :model-value="store.calculated.value" />
    </div>
  </div>
</template>

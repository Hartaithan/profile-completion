<script setup lang="ts">
import { useCompletionStore } from "@/store/completion";
import { Progress } from "@/ui/progress";
import { Skeleton } from "@/ui/skeleton";
import { formatNumber } from "@/utils/number";
import { formatProgress } from "@/utils/progress";

const store = useCompletionStore();
</script>

<template>
  <div v-if="store.loading" class="container mt-6">
    <Skeleton class="h-28 w-full" />
  </div>
  <div v-if="!store.loading && store.calculated" class="sticky top-6 z-50 container mt-6">
    <div class="bg-card border-border/50 flex h-28 flex-col justify-center rounded-lg border p-5">
      <div class="flex items-end justify-between">
        <div class="flex flex-col">
          <span class="text-xxs text-muted-foreground font-bold tracking-widest uppercase">
            Completion Status
          </span>
          <h2 class="text-foreground text-2xl font-black tracking-tight uppercase">
            Total Completion: {{ formatProgress(store.calculated.value, "%") }}
          </h2>
        </div>
        <span class="text-primary font-mono text-sm uppercase">
          {{ formatNumber(store.calculated.earned) }} points
        </span>
      </div>
      <Progress class="mt-3" :model-value="store.calculated.value" />
    </div>
  </div>
</template>

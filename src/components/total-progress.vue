<script setup lang="ts">
import { Progress } from "@/ui/progress";
import { Skeleton } from "@/ui/skeleton";
import { formatProgress, getProgress } from "@/utils/progress";
import { useCompletionStore } from "../store/completion";

const store = useCompletionStore();
</script>

<template>
  <div v-if="store.loading" class="container py-6">
    <Skeleton class="h-40 w-full" />
  </div>
  <div v-else-if="store.profile" class="sticky top-0 z-50 container py-6">
    <div class="bg-card border-border/50 flex h-40 flex-col justify-center rounded-lg border p-6">
      <div class="flex items-end justify-between">
        <div class="flex flex-col">
          <span class="text-xxs text-muted-foreground font-bold tracking-widest uppercase">
            Completion Status
          </span>
          <h2 class="text-foreground text-2xl font-black tracking-tight uppercase">
            Total Completion: {{ formatProgress(store.calculated.progress.progress, "%") }}
          </h2>
        </div>
        <span class="text-primary font-mono text-sm uppercase">
          {{ store.calculated.progress.points }} points
        </span>
      </div>
      <Progress class="mt-4" :model-value="getProgress(store.calculated.progress)" />
      <div class="mt-4 flex items-center gap-2">
        <span class="bg-primary/50 h-4 w-1" />
        <span class="text-xxs text-muted-foreground font-bold tracking-widest uppercase">
          Games Tracked: {{ store.calculated.completion.length }}
        </span>
      </div>
    </div>
  </div>
</template>

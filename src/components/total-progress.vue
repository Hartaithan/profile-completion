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
    <div
      class="bg-card/50 border-border/50 flex h-40 flex-col justify-center rounded-lg border p-6">
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Completion Status
          </span>
          <h2 className="text-2xl font-black tracking-tight text-foreground uppercase">
            Total Completion: {{ formatProgress(store.calculated.progress.progress, "%") }}
          </h2>
        </div>
        <span className="text-sm font-mono text-primary uppercase"
          >{{ store.calculated.progress.points }} points</span
        >
      </div>
      <Progress class="mt-4" :model-value="getProgress(store.calculated.progress)" />
      <div className="mt-4 flex items-center gap-2">
        <span className="w-1 h-4 bg-primary/50" />
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Games Tracked: {{ store.calculated.completion.length }}
        </span>
      </div>
    </div>
  </div>
</template>

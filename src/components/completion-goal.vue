<script setup lang="ts">
import { useCompletionStore } from "@/store/completion";
import { useGoalStore } from "@/store/goal";
import { Skeleton } from "@/ui/skeleton";
import { getCompletionGoal } from "@/utils/progress";
import { TargetIcon } from "lucide-vue-next";
import { computed, ref } from "vue";
import CompletionGoalForm from "./completion-goal-form.vue";

const store = useGoalStore();
const completion = useCompletionStore();
const form = ref<InstanceType<typeof CompletionGoalForm> | null>(null);

const goal = computed(() =>
  getCompletionGoal({
    progress: completion.calculated.progress,
    counts: store.counts,
    target: store.percent,
  }),
);
</script>

<template>
  <div v-if="completion.loading" class="container">
    <Skeleton class="h-44 w-full rounded-lg" />
  </div>
  <div
    v-else-if="completion.profile"
    class="bg-card border-primary/40 relative container mb-12 flex w-full flex-col items-center justify-between gap-6 overflow-hidden rounded-lg border-2 p-7 md:flex-row md:items-center">
    <TargetIcon
      class="text-primary pointer-events-none absolute top-2 right-2 size-28 opacity-10" />
    <div class="flex flex-col">
      <span class="text-xxs text-primary font-bold tracking-widest uppercase">Completion Goal</span>
      <p class="text-muted-foreground mt-2 text-sm font-bold tracking-tight uppercase">
        Remaining games to achieve {{ store.percent }}% completion
      </p>
      <div class="mt-1 flex items-baseline gap-3">
        <span class="text-foreground text-6xl leading-none font-black tracking-tighter">
          {{ goal }}
        </span>
        <span class="text-primary text-xl font-bold tracking-widest uppercase">games</span>
      </div>
      <p class="text-xxs text-muted-foreground mt-2 font-bold tracking-wide uppercase">
        Each game must have {{ store.counts.platinum }} Platinum, {{ store.counts.gold }} Gold,
        {{ store.counts.silver }} Silver, {{ store.counts.bronze }} Bronze trophies
      </p>
    </div>
    <CompletionGoalForm ref="form" />
  </div>
</template>

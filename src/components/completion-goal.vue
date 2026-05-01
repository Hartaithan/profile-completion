<script setup lang="ts">
import CompletionGoalModal from "@/components/completion-goal-modal.vue";
import { useCompletionStore } from "@/store/completion";
import { useGoalStore } from "@/store/goal";
import { Skeleton } from "@/ui/skeleton";
import { TooltipAdaptive, TooltipProvider } from "@/ui/tooltip";
import { getCompletionGoal } from "@/utils/progress";
import { CircleAlertIcon, CircleCheckIcon, TargetIcon } from "lucide-vue-next";
import { computed } from "vue";

const store = useGoalStore();
const completion = useCompletionStore();

const goal = computed(() =>
  getCompletionGoal({
    progress: completion.calculated.progress,
    counts: store.counts,
    target: store.percent,
  }),
);
</script>

<template>
  <div v-if="completion.loading" class="container mt-6">
    <Skeleton class="h-44 w-full rounded-lg" />
  </div>
  <div
    v-if="!completion.loading && completion.profile"
    class="bg-card border-primary/40 relative container mt-6 flex w-full flex-col items-center justify-between gap-6 overflow-hidden rounded-lg border-2 p-6 md:flex-row md:items-center">
    <TargetIcon
      class="text-primary pointer-events-none absolute top-2 right-2 size-28 opacity-10" />
    <div class="flex flex-col">
      <span class="text-xxs text-primary font-bold tracking-widest uppercase">Completion Goal</span>
      <p class="text-muted-foreground mt-2 text-sm font-bold tracking-tight uppercase">
        Remaining games to achieve {{ store.percent }}% completion
      </p>
      <div class="flex min-h-16 items-end gap-3">
        <TooltipProvider>
          <template v-if="typeof goal === 'number'">
            <span class="text-foreground text-6xl leading-none font-black tracking-tighter">
              {{ goal }}
            </span>
            <span class="text-primary text-xl font-bold tracking-widest uppercase">games</span>
          </template>
          <TooltipAdaptive
            v-else-if="goal === 'already-reached'"
            trigger-class="flex min-w-24 gap-2 items-end"
            content-class="max-w-48">
            <template #trigger>
              <CircleCheckIcon class="size-14" />
              <span class="text-primary text-2xl font-bold tracking-wide uppercase">
                already reached
              </span>
            </template>
            <template #content>
              <p class="text-center">
                You’ve already achieved this completion goal with your current number of trophies
              </p>
            </template>
          </TooltipAdaptive>
          <TooltipAdaptive
            v-else-if="goal === 'unreachable'"
            trigger-class="flex min-w-24 gap-2 items-end"
            content-class="max-w-48">
            <template #trigger>
              <CircleAlertIcon class="size-14" />
              <span class="text-primary text-2xl font-bold tracking-wide uppercase">
                unreachable
              </span>
            </template>
            <template #content>
              <p class="text-center">
                This completion goal isn't attainable with your current trophy count, you'll need to
                earn more trophies to move forward
              </p>
            </template>
          </TooltipAdaptive>
        </TooltipProvider>
      </div>
      <p class="text-xxs text-muted-foreground mt-2 font-bold tracking-wide uppercase">
        Each game must have {{ store.counts.platinum }} Platinum, {{ store.counts.gold }} Gold,
        {{ store.counts.silver }} Silver, {{ store.counts.bronze }} Bronze trophies
      </p>
    </div>
    <CompletionGoalModal />
  </div>
</template>

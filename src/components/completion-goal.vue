<script setup lang="ts">
import CompletionGoalModal from "@/components/completion-goal-modal.vue";
import { useCompletionStore } from "@/store/completion";
import { useGoalStore } from "@/store/goal";
import { Skeleton } from "@/ui/skeleton";
import { TooltipAdaptive, TooltipProvider } from "@/ui/tooltip";
import { getCompletionGoal } from "@/utils/completion";
import { CircleAlertIcon, CircleCheckIcon, TargetIcon } from "lucide-vue-next";
import { computed } from "vue";

const store = useGoalStore();
const completion = useCompletionStore();

const goal = computed(() =>
  getCompletionGoal({
    progress: completion.calculated,
    counts: store.counts,
    target: store.percent,
  }),
);
</script>

<template>
  <div v-if="completion.loading" class="container mt-4 sm:mt-6">
    <Skeleton class="h-56 w-full rounded-lg sm:h-44" />
  </div>
  <div
    v-if="!completion.loading && completion.profile"
    class="bg-card border-primary/40 relative container mt-4 flex w-full flex-col items-start justify-between gap-3 overflow-hidden rounded-lg border-2 p-4 sm:mt-6 sm:gap-6 sm:p-6 md:flex-row md:items-center">
    <TargetIcon
      class="text-primary pointer-events-none absolute top-2 right-2 size-20 opacity-10 sm:size-28" />
    <div class="flex w-full flex-col md:w-auto">
      <span class="text-xxs text-primary font-bold tracking-widest uppercase">Completion Goal</span>
      <p
        class="text-muted-foreground mt-1 text-xs font-bold tracking-tight uppercase sm:mt-2 sm:text-sm">
        Remaining games to achieve {{ store.percent }}% completion
      </p>
      <div class="flex min-h-11 items-end gap-2 sm:min-h-16 sm:gap-3">
        <TooltipProvider>
          <template v-if="typeof goal === 'number'">
            <span
              class="text-foreground text-4xl leading-none font-black tracking-tighter sm:text-6xl">
              {{ goal }}
            </span>
            <span class="text-primary text-base font-bold tracking-widest uppercase sm:text-xl">
              games
            </span>
          </template>
          <TooltipAdaptive
            v-else-if="goal === 'error'"
            trigger-class="flex min-w-20 gap-2 items-end sm:min-w-24"
            content-class="max-w-48">
            <template #trigger>
              <CircleAlertIcon class="size-10 sm:size-14" />
              <span class="text-primary text-lg font-bold tracking-wide uppercase sm:text-2xl">
                error
              </span>
            </template>
            <template #content>
              <p class="text-center">
                Something went wrong while calculating the completion goal. Please try retrieving
                your data again
              </p>
            </template>
          </TooltipAdaptive>
          <TooltipAdaptive
            v-else-if="goal === 'already-reached'"
            trigger-class="flex min-w-20 gap-2 items-end sm:min-w-24"
            content-class="max-w-48">
            <template #trigger>
              <CircleCheckIcon class="size-10 sm:size-14" />
              <span class="text-primary text-lg font-bold tracking-wide uppercase sm:text-2xl">
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
            trigger-class="flex min-w-20 gap-2 items-end sm:min-w-24"
            content-class="max-w-48">
            <template #trigger>
              <CircleAlertIcon class="size-10 sm:size-14" />
              <span class="text-primary text-lg font-bold tracking-wide uppercase sm:text-2xl">
                unreachable
              </span>
            </template>
            <template #content>
              <p class="text-center">
                This completion goal isn’t attainable with your current trophy count, you’ll need to
                earn more trophies to move forward
              </p>
            </template>
          </TooltipAdaptive>
        </TooltipProvider>
      </div>
      <p class="text-xxs text-muted-foreground mt-1 font-bold tracking-wide uppercase sm:mt-2">
        Each game must have {{ store.counts.platinum }} Platinum, {{ store.counts.gold }} Gold,
        {{ store.counts.silver }} Silver, {{ store.counts.bronze }} Bronze trophies
      </p>
    </div>
    <CompletionGoalModal />
  </div>
</template>

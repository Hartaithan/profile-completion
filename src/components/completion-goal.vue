<script setup lang="ts">
import { useCompletionStore } from "@/store/completion";
import { useGoalStore } from "@/store/goal";
import { Skeleton } from "@/ui/skeleton";
import { TooltipProvider } from "@/ui/tooltip";
import { TooltipAdaptive } from "@/ui/tooltip-adaptive";
import { getCompletionGoal } from "@/utils/progress";
import { CircleAlertIcon, CircleCheckIcon } from "lucide-vue-next";
import { computed, ref } from "vue";
import CompletionGoalForm from "./completion-goal-form.vue";
import TrophyCounts from "./trophy-counts.vue";

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
  <div v-if="completion.loading" class="container flex h-14 items-center justify-center gap-x-5">
    <div class="flex w-32 flex-col items-center gap-y-2">
      <Skeleton class="h-5 w-24" />
      <Skeleton class="h-5 w-26" />
    </div>
    <Skeleton class="h-12 w-24" />
    <div class="flex flex-col items-end gap-y-2">
      <Skeleton class="h-5 w-52" />
      <Skeleton class="h-5 w-56" />
    </div>
    <div class="flex flex-col items-start gap-y-2">
      <Skeleton class="h-5 w-32" />
      <Skeleton class="h-5 w-44" />
    </div>
  </div>
  <div
    v-else-if="completion.profile"
    class="relative container flex items-center justify-center gap-x-5 text-xl font-medium">
    <CompletionGoalForm ref="form" />
    <p class="w-32 text-center">You'll need<br />to complete</p>
    <TooltipProvider>
      <p v-if="typeof goal === 'number'" class="min-w-24 text-center text-5xl font-bold">
        {{ goal }}
      </p>
      <TooltipAdaptive
        v-else-if="goal === 'already-reached'"
        trigger-class="flex min-w-24 items-center justify-center"
        content-class="max-w-48">
        <template #trigger>
          <CircleCheckIcon class="size-12" />
        </template>
        <template #content>
          <p class="text-center">
            You've already reached this completion goal with your current trophy count
          </p>
        </template>
      </TooltipAdaptive>
      <TooltipAdaptive
        v-else-if="goal === 'unreachable'"
        trigger-class="flex min-w-24 items-center justify-center"
        content-class="max-w-48">
        <template #trigger>
          <CircleAlertIcon class="size-12" />
        </template>
        <template #content>
          <p class="text-center">
            This completion goal can't be reached with your current trophy count. You need to earn
            more trophies to progress further
          </p>
        </template>
      </TooltipAdaptive>
    </TooltipProvider>
    <p class="text-end">
      more games each with<br />
      <span class="mr-1 [&>span:not(:last-child)]:mr-2">
        <TrophyCounts :counts="store.counts" :earned="undefined" />
      </span>
      trophies
    </p>
    <p class="text-start">
      to reach
      <span class="font-bold">{{ store.percent }}%</span>
      <br />
      profile completion
    </p>
  </div>
</template>

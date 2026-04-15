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
      <span class="text-xxs text-primary font-bold tracking-widest uppercase">
        Completion Goal
      </span>
      <p class="text-muted-foreground mt-2 text-sm font-bold tracking-tight uppercase">
        Remaining games to achieve {{ store.percent }}% completion
      </p>
      <div class="mt-1 flex items-baseline gap-3">
        <span class="text-foreground text-6xl leading-none font-black tracking-tighter">{{
          goal
        }}</span>
        <span class="text-primary text-xl font-bold tracking-widest uppercase">games</span>
      </div>
      <p class="text-xxs text-muted-foreground mt-2 font-bold tracking-wide uppercase">
        Each game must have {{ store.counts.platinum }} Platinum, {{ store.counts.gold }} Gold,
        {{ store.counts.silver }} Silver, {{ store.counts.bronze }} Bronze trophies
      </p>
    </div>
    <CompletionGoalForm ref="form" />
  </div>
  <!-- <div
    v-else-if="completion.profile"
    class="relative container flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium sm:gap-y-0 sm:text-xl">
    <CompletionGoalForm ref="form" />
    <p class="w-24 text-center sm:w-32">You'll need<br />to complete</p>
    <TooltipProvider>
      <p
        v-if="typeof goal === 'number'"
        class="min-w-24 text-center text-4xl font-bold sm:text-5xl">
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
      <TooltipAdaptive trigger-class="sm:text-end" content-class="max-w-52">
        <template #trigger>
          more games each with<br />
          <span class="mr-1 [&>span:not(:last-child)]:mr-2">
            <TrophyCounts :counts="store.counts" :earned="undefined" />
          </span>
          trophies
        </template>
        <template #content>
          <p class="text-center">
            This means that you need to complete <b>{{ goal }}</b> completely new games - with the
            selected trophy count - that you don't currently have on your profile
          </p>
        </template>
      </TooltipAdaptive>
    </TooltipProvider>
    <p class="text-center sm:text-start">
      to reach
      <span class="font-bold">{{ store.percent }}%</span>
      <br />
      profile completion
    </p>
  </div> -->
</template>

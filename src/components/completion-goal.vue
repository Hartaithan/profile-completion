<script setup lang="ts">
import type { TrophyCounts as Counts } from "@/models/trophy";
import { useCompletionStore } from "@/store/completion";
import { Skeleton } from "@/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/ui/tooltip";
import { getCompletionGoal } from "@/utils/progress";
import { CircleAlertIcon } from "lucide-vue-next";
import { computed, ref } from "vue";
import TrophyCounts from "./trophy-counts.vue";

const store = useCompletionStore();

const percent = ref(80);
const counts = ref<Counts>({ platinum: 1, gold: 9, silver: 15, bronze: 25 });

const goal = computed(() =>
  getCompletionGoal({
    progress: store.calculated.progress,
    counts: counts.value,
    target: percent.value,
  }),
);
</script>

<template>
  <div v-if="store.loading" class="container flex h-14 items-center justify-center gap-x-5">
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
    v-else-if="store.profile"
    class="container flex items-center justify-center gap-x-5 text-xl font-medium">
    <p class="w-32 text-center">You'll need<br />to complete</p>
    <TooltipProvider>
      <p v-if="typeof goal === 'number'" class="min-w-24 text-center text-5xl font-bold">
        {{ goal }}
      </p>
      <Tooltip v-else-if="goal === 'already-reached'">
        <TooltipTrigger class="min-w-24 text-center text-5xl font-bold">0</TooltipTrigger>
        <TooltipContent class="max-w-48">
          <p class="text-center">
            You've already reached this completion goal with your current trophy count
          </p>
        </TooltipContent>
      </Tooltip>
      <Tooltip v-else-if="goal === 'unreachable'">
        <TooltipTrigger class="flex min-w-24 items-center justify-center">
          <CircleAlertIcon class="size-12" />
        </TooltipTrigger>
        <TooltipContent class="max-w-56">
          <p class="text-center">
            This completion goal can't be reached with your current trophy count. You need to earn
            more trophies to progress further
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <p class="text-end">
      more games each with<br />
      <span class="mr-1 [&>span:not(:last-child)]:mr-2">
        <TrophyCounts :counts="counts" :earned="undefined" />
      </span>
      trophies
    </p>
    <p class="text-start">
      to reach
      <span class="font-bold">{{ percent }}%</span>
      <br />
      profile completion
    </p>
  </div>
</template>

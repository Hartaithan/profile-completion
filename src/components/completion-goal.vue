<script setup lang="ts">
import type { TrophyCounts as Counts } from "@/models/trophy";
import { useCompletionStore } from "@/store/completion";
import { Skeleton } from "@/ui/skeleton";
import { getCompletionGoal } from "@/utils/progress";
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
    <p class="w-32 text-center">You’ll need<br />to complete</p>
    <p class="min-w-24 text-center text-5xl font-bold">{{ goal }}</p>
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

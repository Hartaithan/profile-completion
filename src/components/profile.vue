<script setup lang="ts">
import { useCompletionStore } from "@/store/completion";
import { Skeleton } from "@/ui/skeleton";

const store = useCompletionStore();
</script>

<template v-if="store.profile">
  <div v-if="store.loading" class="container mt-6 flex w-full items-center gap-4">
    <Skeleton class="size-12 rounded-full" />
    <div className="flex flex-col gap-y-2">
      <Skeleton class="h-4 w-32" />
      <Skeleton class="h-3 w-24" />
    </div>
    <Skeleton class="ml-auto h-6 w-80" />
  </div>
  <div v-else class="container mt-6 flex w-full items-center gap-4">
    <img
      class="size-12"
      :src="store.profile?.avatar_url"
      :alt="`${store.profile?.name}'s avatar`" />
    <div className="flex flex-col leading-[normal]">
      <h1 className="font-bold">{{ store.profile?.name ?? "Trophy Hunter" }}</h1>
      <p className="text-sm text-gray-300">Level: {{ store.profile?.level ?? "420" }}</p>
    </div>
    <div class="ml-auto flex gap-3 font-bold">
      <TrophyCounts :counts="store.profile?.counts" :earned="undefined" />
    </div>
  </div>
</template>

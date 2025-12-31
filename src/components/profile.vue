<script setup lang="ts">
import { useCompletionStore } from "@/store/completion";
import { Skeleton } from "@/ui/skeleton";
import TrophyCounts from "./trophy-counts.vue";

const store = useCompletionStore();
</script>

<template>
  <div
    v-if="store.loading"
    class="container mt-6 flex w-full flex-wrap items-center gap-4 md:flex-nowrap">
    <Skeleton class="aspect-square size-12 min-w-12 rounded-full" />
    <div className="flex flex-col gap-y-2">
      <Skeleton class="h-4 w-32" />
      <Skeleton class="h-3 w-24" />
    </div>
    <Skeleton class="mx-auto h-6 w-80 sm:mx-0 sm:ml-auto" />
  </div>
  <div
    v-if="!store.loading && store.profile"
    class="container mt-6 flex w-full flex-wrap items-center gap-4 md:flex-nowrap">
    <img
      class="aspect-square size-12 min-w-12"
      :src="store.profile?.avatar_url"
      :alt="`${store.profile?.name}'s avatar`" />
    <div className="flex flex-col leading-[normal]">
      <h1 className="font-bold">{{ store.profile?.name ?? "Trophy Hunter" }}</h1>
      <p className="text-sm text-gray-300">Level: {{ store.profile?.level ?? "420" }}</p>
    </div>
    <div
      class="mx-auto flex flex-wrap justify-center gap-3 font-bold sm:mx-0 sm:ml-auto sm:flex-nowrap sm:justify-start">
      <TrophyCounts :counts="store.profile?.counts" :earned="undefined" />
    </div>
  </div>
</template>

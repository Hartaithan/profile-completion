<script setup lang="ts">
import ProfileStatItem from "@/components/profile-stat-item.vue";
import { useCompletionStore } from "@/store/completion";
import { Skeleton } from "@/ui/skeleton";

const store = useCompletionStore();
</script>

<template>
  <div
    v-if="store.status === 'profile-loading'"
    class="container mt-6 flex w-full flex-wrap items-center gap-4 md:flex-nowrap">
    <Skeleton class="aspect-square size-20 min-w-20 rounded-lg sm:size-24 sm:min-w-24" />
    <div class="flex flex-col gap-y-2">
      <Skeleton class="h-6 w-64 sm:h-9" />
      <Skeleton class="h-6 w-32 sm:h-9" />
    </div>
  </div>
  <div
    v-if="store.status !== 'profile-loading' && store.profile"
    class="container mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
    <div
      class="bg-card border-border/50 size-20 shrink-0 overflow-hidden rounded-lg border p-1 sm:size-24">
      <img
        class="h-full w-full rounded-lg object-cover"
        :src="store.profile?.avatar_url"
        :alt="`${store.profile?.name}'s avatar`" />
    </div>
    <div class="flex w-full flex-col">
      <h1 class="text-foreground mb-2 text-2xl leading-none font-black uppercase sm:text-3xl">
        {{ store.profile?.name ?? "Trophy Hunter" }}
      </h1>
      <div class="flex flex-wrap gap-x-4 gap-y-1">
        <ProfileStatItem label="Level" :value="store.profile?.level" />
        <ProfileStatItem label="Tier" :value="store.profile?.tier" />
        <ProfileStatItem label="Games" :value="store.completion?.length" />
        <ProfileStatItem label="Earned" :value="store.calculated?.earned ?? 0" />
        <ProfileStatItem
          label="Unearned"
          :value="store.calculated ? store.calculated.total - store.calculated.earned : 0" />
        <ProfileStatItem label="Total Points" :value="store.calculated?.total ?? 0" />
      </div>
    </div>
  </div>
</template>

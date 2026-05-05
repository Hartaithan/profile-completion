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
    <Skeleton class="aspect-square size-24 min-w-24 rounded-lg" />
    <div class="flex flex-col gap-y-2">
      <Skeleton class="h-9 w-64" />
      <Skeleton class="h-9 w-32" />
    </div>
  </div>
  <div
    v-if="store.status !== 'profile-loading' && store.profile"
    class="container mt-6 flex items-center gap-6">
    <div class="bg-card border-border/50 h-24 w-24 overflow-hidden rounded-lg border p-1">
      <img
        class="h-full w-full rounded-lg object-cover"
        :src="store.profile?.avatar_url"
        :alt="`${store.profile?.name}'s avatar`" />
    </div>
    <div class="flex flex-col">
      <h1 class="text-foreground mb-2 text-3xl leading-none font-black uppercase">
        {{ store.profile?.name ?? "Trophy Hunter" }}
      </h1>
      <div class="flex gap-4">
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

<script setup lang="ts">
import { useCompletionStore } from "@/store/completion";
import { Skeleton } from "@/ui/skeleton";
import ProfileStatItem from "./profile-stat-item.vue";

const store = useCompletionStore();
</script>

<template>
  <div
    v-if="store.loading"
    class="container mt-6 flex w-full flex-wrap items-center gap-4 md:flex-nowrap">
    <Skeleton class="aspect-square size-24 min-w-24 rounded-lg" />
    <div className="flex flex-col gap-y-2">
      <Skeleton class="h-9 w-64" />
      <Skeleton class="h-9 w-32" />
    </div>
  </div>
  <div v-if="!store.loading && store.profile" className="container mt-6 flex items-center gap-6">
    <div className="w-24 h-24 rounded-lg bg-card border border-border/50 p-1 overflow-hidden">
      <img
        className="w-full h-full object-cover rounded-lg"
        :src="store.profile?.avatar_url"
        :alt="`${store.profile?.name}'s avatar`" />
    </div>
    <div className="flex flex-col">
      <h1 className="text-4xl font-black text-foreground uppercase leading-none mb-2">
        {{ store.profile?.name ?? "Trophy Hunter" }}
      </h1>
      <div className="flex gap-4">
        <ProfileStatItem label="Level" :value="store.profile?.level" />
        <ProfileStatItem label="Tier" :value="store.profile?.tier" />
        <div class="w-px self-stretch bg-white/50" />
        <ProfileStatItem
          label="Platinum"
          labelClass="text-trophy-platinum"
          :value="store.profile?.counts.platinum" />
        <ProfileStatItem
          label="Gold"
          labelClass="text-trophy-gold"
          :value="store.profile?.counts.gold" />
        <ProfileStatItem
          label="Silver"
          labelClass="text-trophy-silver"
          :value="store.profile?.counts.silver" />
        <ProfileStatItem
          label="Bronze"
          labelClass="text-trophy-bronze"
          :value="store.profile?.counts.bronze" />
        <ProfileStatItem
          v-if="store.profile?.counts?.total"
          label="Total"
          labelClass="text-trophy-total"
          :value="store.profile?.counts.total" />
      </div>
    </div>
  </div>
</template>

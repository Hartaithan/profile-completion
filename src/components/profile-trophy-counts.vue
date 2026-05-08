<script setup lang="ts">
import ProfileTrophyStatItem from "@/components/profile-trophy-stat-item.vue";
import { useCompletionStore } from "@/store/completion";
import { Skeleton } from "@/ui/skeleton";
import { AwardIcon, BarChart3Icon, TrophyIcon } from "lucide-vue-next";

const store = useCompletionStore();
</script>

<template>
  <div
    v-if="store.status === 'profile-loading'"
    class="container mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
    <Skeleton class="h-20" />
    <Skeleton class="h-20" />
    <Skeleton class="h-20" />
    <Skeleton class="h-20" />
    <Skeleton class="h-20" />
  </div>
  <div
    v-if="store.status !== 'profile-loading' && store.profile"
    class="container mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
    <ProfileTrophyStatItem
      label="Platinum"
      value-class="text-trophy-platinum"
      icon-class="text-trophy-platinum"
      :value="store.profile.counts.platinum"
      :icon="AwardIcon" />
    <ProfileTrophyStatItem
      label="Gold"
      value-class="text-trophy-gold"
      icon-class="text-trophy-gold"
      :value="store.profile.counts.gold"
      :icon="TrophyIcon" />
    <ProfileTrophyStatItem
      label="Silver"
      value-class="text-trophy-silver"
      icon-class="text-trophy-silver"
      :value="store.profile.counts.silver"
      :icon="TrophyIcon" />
    <ProfileTrophyStatItem
      label="Bronze"
      value-class="text-trophy-bronze"
      icon-class="text-trophy-bronze"
      :value="store.profile.counts.bronze"
      :icon="TrophyIcon" />
    <ProfileTrophyStatItem
      container-class="col-span-2 md:col-span-1"
      label="Total"
      :value="store.profile.counts.total"
      :icon="BarChart3Icon" />
  </div>
</template>

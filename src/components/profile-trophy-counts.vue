<script setup lang="ts">
import { useCompletionStore } from "@/store/completion";
import { Skeleton } from "@/ui/skeleton";
import { AwardIcon, BarChart3Icon, TrophyIcon } from "lucide-vue-next";
import ProfileTrophyStatItem from "./profile-trophy-stat-item.vue";

const store = useCompletionStore();
</script>

<template>
  <div v-if="store.status === 'profile-loading'" class="container mt-6 grid grid-cols-5 gap-2">
    <Skeleton class="h-24" />
    <Skeleton class="h-24" />
    <Skeleton class="h-24" />
    <Skeleton class="h-24" />
    <Skeleton class="h-24" />
  </div>
  <div
    v-if="store.status !== 'profile-loading' && store.profile"
    class="container mt-6 grid grid-cols-5 gap-2">
    <ProfileTrophyStatItem
      label="Platinum"
      valueClass="text-trophy-platinum"
      :value="store.profile.counts.platinum">
      <AwardIcon class="text-foreground/90 size-6" />
    </ProfileTrophyStatItem>
    <ProfileTrophyStatItem
      label="Gold"
      valueClass="text-trophy-gold"
      :value="store.profile.counts.gold">
      <TrophyIcon class="text-foreground/90 size-6" />
    </ProfileTrophyStatItem>
    <ProfileTrophyStatItem
      label="Silver"
      valueClass="text-trophy-silver"
      :value="store.profile.counts.silver">
      <TrophyIcon class="text-foreground/90 size-6" />
    </ProfileTrophyStatItem>
    <ProfileTrophyStatItem
      label="Bronze"
      valueClass="text-trophy-bronze"
      :value="store.profile.counts.bronze">
      <TrophyIcon class="text-foreground/90 size-6" />
    </ProfileTrophyStatItem>
    <ProfileTrophyStatItem label="Total" :value="store.profile.counts.total">
      <BarChart3Icon class="text-foreground/90 size-6" />
    </ProfileTrophyStatItem>
  </div>
</template>

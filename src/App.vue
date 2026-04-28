<script setup lang="ts">
import CompletionGoal from "@/components/completion-goal.vue";
import CompletionList from "@/components/completion-list.vue";
import DataControls from "@/components/data-controls.vue";
import FetchModal from "@/components/fetch-modal.vue";
import Header from "@/components/header.vue";
import ProfileTrophyCounts from "@/components/profile-trophy-counts.vue";
import Profile from "@/components/profile.vue";
import ScrollToTop from "@/components/scroll-to-top.vue";
import TotalProgress from "@/components/total-progress.vue";
</script>

<template>
  <Header />
  <Profile />
  <ProfileTrophyCounts />
  <TotalProgress />
  <CompletionGoal />
  <DataControls />
  <CompletionList />
  <FetchModal />
  <ScrollToTop />
</template>

<style scoped></style>

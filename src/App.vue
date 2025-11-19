<script setup lang="ts">
import CompletionGoal from "./components/completion-goal.vue";
import CompletionList from "./components/completion-list.vue";
import DataControls from "./components/data-controls.vue";
import Header from "./components/header.vue";
import Profile from "./components/profile.vue";
import TotalProgress from "./components/total-progress.vue";
</script>

<template>
  <Header />
  <Profile />
  <TotalProgress />
  <CompletionGoal />
  <DataControls />
  <CompletionList />
</template>

<style scoped></style>

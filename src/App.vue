<script setup lang="ts">
import CompletionGoal from "./components/completion-goal.vue";
import CompletionList from "./components/completion-list.vue";
import Header from "./components/header.vue";
import TotalProgress from "./components/total-progress.vue";
</script>

<template>
  <Header />
  <TotalProgress />
  <CompletionGoal />
  <CompletionList />
</template>

<style scoped></style>

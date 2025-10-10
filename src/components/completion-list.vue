<script setup lang="ts">
import { useCompletionStore } from "../store/completion";

const store = useCompletionStore();
</script>

<template>
  <div class="container mt-6 p-6">
    <div v-if="store.loading" class="text-center">...loading</div>
    <div
      v-else-if="store.completion.length > 0"
      class="flex flex-col items-center justify-center gap-2">
      <p v-for="item in store.completion" :key="item.title">
        {{ item.title }}
      </p>
    </div>
    <p v-else class="text-center">nothing found :(</p>
  </div>
</template>

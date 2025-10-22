<script setup lang="ts">
import { useCompletionStore } from "../store/completion";
import CompletionItem from "./completion-item.vue";

const store = useCompletionStore();
</script>

<template>
  <div class="container mt-6 w-full pt-0">
    <div v-if="store.loading" class="text-center">...loading</div>
    <div
      v-else-if="store.calculated.completion.length > 0"
      class="flex flex-col items-center justify-center gap-y-3">
      <CompletionItem
        v-for="(item, index) in store.calculated.completion"
        :key="`${item.title}-${index}`"
        :completion="item"
        :index="index" />
    </div>
    <p v-else class="text-center">nothing found :(</p>
  </div>
</template>

<script setup lang="ts">
import { useCompletionStore } from "../store/completion";
import CompletionItem from "./completion-item.vue";
import CompletionSkeleton from "./completion-skeleton.vue";

const store = useCompletionStore();
</script>

<template>
  <div class="container mt-6 w-full">
    <div v-if="store.loading" class="flex w-full flex-col gap-y-3">
      <CompletionSkeleton />
      <CompletionSkeleton />
      <CompletionSkeleton />
      <CompletionSkeleton />
      <CompletionSkeleton />
    </div>
    <div v-else-if="!store.profile" class="text-center">
      <p>Enter your PSN ID to start tracking your profile completion!</p>
      <p class="font-bold">
        Just make sure your PSN profile is set to public so your trophy data can be accessed!
      </p>
    </div>
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

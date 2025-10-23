<script setup lang="ts">
import type { Completion } from "@/models/completion";
import { useCompletionStore } from "@/store/completion";
import { Button } from "@/ui/button";
import { formatProgress } from "@/utils/progress";
import { CheckCheckIcon } from "lucide-vue-next";
import GameImage from "./game-image.vue";

interface Props {
  completion: Completion | null;
  index: number;
}

const _props = defineProps<Props>();
const store = useCompletionStore();
</script>

<template>
  <div class="flex w-full items-center">
    <GameImage :src="completion?.image_url" :alt="completion?.title" />
    <div class="ml-3 flex flex-col justify-center">
      <h1 class="font-bold">{{ completion?.title }}</h1>
      <p class="text-sm">
        Progress: <span class="font-semibold">{{ formatProgress(completion?.progress, "%") }}</span>
      </p>
    </div>
    <Button class="ml-auto" variant="outline" size="icon" @click="store.completeItem(index)">
      <CheckCheckIcon />
    </Button>
  </div>
</template>

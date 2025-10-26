<script setup lang="ts">
import type { Completion } from "@/models/completion";
import { useCompletionStore } from "@/store/completion";
import { Button } from "@/ui/button";
import { formatProgress } from "@/utils/progress";
import { getTrophiesProgress } from "@/utils/trophies";
import { CircleCheckIcon, CircleDashedIcon } from "lucide-vue-next";
import { computed } from "vue";
import GameImage from "./game-image.vue";

interface Props {
  completion: Completion | null;
  index: number;
}

const props = defineProps<Props>();
const store = useCompletionStore();

const trophies = computed(() =>
  getTrophiesProgress({
    counts: props.completion?.counts,
    earned: props.completion?.earned_counts,
  }),
);
</script>

<template>
  <div class="flex w-full items-center" :class="{ 'opacity-50 grayscale': trophies?.completed }">
    <GameImage :src="completion?.image_url" :alt="completion?.title" />
    <div class="ml-3 flex flex-col justify-center">
      <h1 class="font-bold">{{ completion?.title }}</h1>
      <div class="flex gap-x-2">
        <p class="text-sm">
          Progress:
          <span class="font-semibold">{{ formatProgress(completion?.progress, "%") }}</span>
        </p>
        <p class="text-sm">
          Trophies:
          <span class="font-semibold" v-if="trophies">
            {{ `${trophies.earned}/${trophies.total}` }}
          </span>
          <span class="font-semibold" v-else>Not Found</span>
        </p>
      </div>
    </div>
    <Button class="ml-auto" variant="outline" size="icon" @click="store.completeItem(index)">
      <CircleCheckIcon class="size-5" v-if="trophies?.completed" />
      <CircleDashedIcon class="size-5" v-else />
    </Button>
  </div>
</template>

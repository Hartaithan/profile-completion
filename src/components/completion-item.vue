<script setup lang="ts">
import type { Completion } from "@/models/completion";
import { useCompletionStore } from "@/store/completion";
import { Button } from "@/ui/button";
import { formatProgress } from "@/utils/progress";
import { getTrophiesProgress } from "@/utils/trophies";
import { CircleCheckIcon, CircleDashedIcon } from "lucide-vue-next";
import { computed } from "vue";
import GameImage from "./game-image.vue";
import TrophyCounts from "./trophy-counts.vue";

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
      <p class="text-base font-bold">
        {{ completion?.title }}
        <span class="ml-1 align-[0.0625rem] text-xs font-medium">
          {{ completion?.platforms.join(", ") }}
        </span>
      </p>
      <div class="mt-0.5 flex gap-x-3 text-sm font-semibold">
        <span>{{ formatProgress(completion?.progress, "%") }}</span>
        <span class="trophy-dot" data-type="total" v-if="trophies">
          {{ `${trophies.earned}/${trophies.total}` }}
        </span>
        <div class="flex gap-x-3">
          <TrophyCounts :counts="completion?.counts" :earned="completion?.earned_counts" />
        </div>
      </div>
    </div>
    <Button class="ml-auto" variant="outline" size="icon" @click="store.completeItem(index)">
      <CircleCheckIcon class="size-5" v-if="trophies?.completed" />
      <CircleDashedIcon class="size-5" v-else />
    </Button>
  </div>
</template>

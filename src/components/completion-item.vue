<script setup lang="ts">
import type { Completion } from "@/models/completion";
import { getImageURL } from "@/utils/image";
import { formatProgress } from "@/utils/progress";
import { getTrophiesProgress } from "@/utils/trophies";
import { computed } from "vue";
import CompletionMenu from "./completion-menu.vue";
import GameImage from "./game-image.vue";
import TrophyCounts from "./trophy-counts.vue";

interface Props {
  completion: Completion | null;
  index: number;
}

const props = defineProps<Props>();

const trophies = computed(() =>
  getTrophiesProgress({
    counts: props.completion?.counts,
    earned: props.completion?.earned_counts,
  }),
);
</script>

<template>
  <div
    class="absolute flex w-full items-center"
    :class="{ 'opacity-50 grayscale': trophies?.type === 'completed' }">
    <GameImage
      :src="getImageURL(completion?.image_url, { h: 56 })"
      :alt="completion?.title"
      :platforms="completion?.platforms" />
    <div class="ml-3 flex flex-col justify-center">
      <p class="text-base font-bold">
        {{ completion?.title }}
        <span class="ml-1 align-[0.0625rem] text-xs font-medium">
          {{ completion?.platforms.join(", ") }}
        </span>
      </p>
      <div class="mt-0.5 flex gap-x-3 text-sm font-semibold">
        <span>{{ formatProgress(completion?.progress, "%") }}</span>
        <div class="flex gap-x-3">
          <TrophyCounts :counts="completion?.counts" :earned="completion?.earned_counts" />
        </div>
      </div>
    </div>
    <CompletionMenu
      :index="index"
      :type="trophies?.type"
      :has-platinum="completion?.counts.platinum === 1"
      :has-d-l-c="completion?.counts.total !== completion?.base_counts?.total" />
  </div>
</template>

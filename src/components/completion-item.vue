<script setup lang="ts">
import type { Completion } from "@/models/completion";
import { getImageURL } from "@/utils/image";
import { formatProgress } from "@/utils/progress";
import { getTrophiesProgress } from "@/utils/trophies";
import { computed, ref, useAttrs } from "vue";
import CompletionMenu from "./completion-menu.vue";
import GameImage from "./game-image.vue";
import TrophyCounts from "./trophy-counts.vue";

interface Props {
  completion: Completion | null;
  index: number;
}

const props = defineProps<Props>();
const attrs = useAttrs();

const root = ref<HTMLDivElement>();

const trophies = computed(() =>
  getTrophiesProgress({
    counts: props.completion?.counts,
    earned: props.completion?.earned_counts,
  }),
);

defineExpose({ el: root });
</script>

<template>
  <div
    ref="root"
    class="flex w-full flex-wrap items-center"
    :class="{ 'opacity-50 grayscale': trophies?.type === 'completed' }"
    v-bind="attrs">
    <GameImage
      class="order-1"
      :src="getImageURL(completion?.image_url, { h: 56 })"
      :alt="completion?.title"
      :platforms="completion?.platforms" />
    <div
      class="order-3 mt-2 ml-0 flex w-full flex-col justify-center sm:order-2 sm:mt-0 sm:ml-3 sm:w-auto">
      <p class="text-sm font-bold sm:text-base">
        {{ completion?.title }}
        <span class="ml-1 align-[0.0625rem] text-xs font-medium">
          {{ completion?.platforms.join(", ") }}
        </span>
      </p>
      <div class="mt-0.5 flex flex-wrap gap-x-3 text-sm font-semibold">
        <span>{{ formatProgress(completion?.progress, "%") }}</span>
        <div class="flex flex-wrap gap-x-3">
          <TrophyCounts
            class="text-xs sm:text-sm"
            :counts="completion?.counts"
            :earned="completion?.earned_counts" />
        </div>
      </div>
    </div>
    <CompletionMenu
      :id="completion?.id"
      :index="index"
      :type="trophies?.type"
      :has-platinum="completion?.counts.platinum === 1"
      :has-d-l-c="completion?.counts.total !== completion?.base_counts?.total" />
  </div>
</template>

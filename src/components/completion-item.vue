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
  <div ref="root" class="absolute top-0 left-0 w-full" v-bind="attrs">
    <div
      class="bg-card border-border/50 group flex cursor-pointer items-center gap-4 rounded-lg border p-3 transition-all"
      :class="{ 'opacity-50 grayscale': trophies?.type === 'completed' }">
      <GameImage
        :src="getImageURL(completion?.image_url, { h: 56 })"
        :alt="completion?.title"
        :platforms="completion?.platforms" />
      <div class="min-w-0 grow">
        <div class="flex items-center gap-x-2">
          <h4 class="text-foreground truncate text-sm font-black tracking-tight uppercase">
            {{ completion?.title }}
          </h4>
          <span class="text-muted-foreground text-xxs font-bold">
            {{ completion?.platforms.join(", ") }}
          </span>
        </div>
        <div class="mt-1 flex flex-wrap gap-x-3">
          <TrophyCounts
            class="text-xs font-bold"
            :counts="completion?.counts"
            :earned="completion?.earned_counts" />
        </div>
      </div>
      <div class="flex items-center gap-x-3">
        <span class="text-primary font-mono text-base font-bold">
          {{ formatProgress(completion?.progress, "%") }}
        </span>
        <CompletionMenu
          :id="completion?.id"
          :index="index"
          :type="trophies?.type"
          :has-platinum="completion?.counts.platinum === 1"
          :has-d-l-c="completion?.counts.total !== completion?.base_counts?.total" />
      </div>
    </div>
  </div>
</template>

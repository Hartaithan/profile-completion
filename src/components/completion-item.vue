<script setup lang="ts">
import CompletionMenu from "@/components/completion-menu.vue";
import GameImage from "@/components/game-image.vue";
import TrophiesModal from "@/components/trophies-modal.vue";
import TrophyCounts from "@/components/trophy-counts.vue";
import { platformShortLabels } from "@/constants/platform";
import type { Completion } from "@/models/completion";
import { getCompletionStatus } from "@/utils/completion";
import { getImageURL } from "@/utils/image";
import { formatProgress } from "@/utils/progress";
import { computed, ref, useAttrs } from "vue";

interface Props {
  completion: Completion | null;
  index: number;
}

const props = defineProps<Props>();
const attrs = useAttrs();

const root = ref<HTMLDivElement>();

const status = computed(() =>
  getCompletionStatus({
    points: props.completion?.points,
    counts: props.completion?.counts,
    earned: props.completion?.earned_counts,
  }),
);

defineExpose({ el: root });
</script>

<template>
  <div ref="root" class="absolute top-0 left-0 w-full" v-bind="attrs">
    <div
      class="bg-card border-border/50 group flex cursor-pointer flex-col gap-3 rounded-lg border p-3 transition-all sm:flex-row sm:items-center sm:gap-4"
      :class="{ 'opacity-50 grayscale': status?.type === 'completed' }">
      <div class="flex shrink-0 items-start sm:items-center">
        <GameImage
          class="h-16 w-auto md:h-14"
          :src="getImageURL(completion?.image_url, { h: 56 })"
          :alt="completion?.title"
          :platforms="completion?.platforms" />
      </div>
      <div
        class="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-x-2">
            <h4 class="text-foreground truncate text-sm font-black tracking-tight uppercase">
              {{ completion?.title }}
            </h4>
            <span
              v-if="completion?.platforms?.length"
              class="text-muted-foreground text-xxs min-w-12 font-bold uppercase sm:text-xs">
              {{ completion.platforms.map((p) => platformShortLabels[p]).join(", ") }}
            </span>
          </div>
          <div class="mt-2 flex flex-wrap gap-x-3">
            <TrophyCounts
              class="text-xs font-bold"
              :counts="completion?.counts"
              :earned="completion?.earned_counts" />
          </div>
        </div>
        <div class="flex items-center justify-end gap-3 border-t pt-2 sm:border-t-0 sm:pt-0">
          <span
            class="text-primary mr-auto shrink-0 font-mono text-lg font-bold sm:mr-2 sm:text-base">
            {{ formatProgress(completion?.progress?.value, "%") }}
          </span>
          <CompletionMenu
            :id="completion?.id"
            :index="index"
            :type="status?.type"
            :has-platinum="status?.hasPlatinum"
            :has-d-l-c="status?.hasDLC" />
          <TrophiesModal
            :id="completion?.id"
            :title="completion?.title"
            :trophies="completion?.trophies" />
        </div>
      </div>
    </div>
  </div>
</template>

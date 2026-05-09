<script setup lang="ts">
import type { Trophy } from "@/models/trophy";
import { useCompletionStore } from "@/store/completion";
import { Checkbox } from "@/ui/checkbox";
import { Label } from "@/ui/label";
import { TrophyIcon } from "lucide-vue-next";

interface Props {
  item: string | undefined;
  trophy: Trophy | undefined;
}

const props = defineProps<Props>();
const store = useCompletionStore();

const handleClick = () => {
  store.completeTrophy(props.item, props.trophy?.id);
};
</script>

<template>
  <Label
    v-if="trophy"
    :for="`trophy-${trophy.id}`"
    class="flex cursor-pointer items-center gap-3 rounded-lg pt-4 has-aria-checked:opacity-50 sm:pt-3">
    <Checkbox
      :id="`trophy-${trophy.id}`"
      :model-value="trophy.earned"
      class="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground mt-1 shrink-0 sm:mt-0"
      @update:model-value="handleClick" />
    <div class="bg-card/50 flex size-12 shrink-0 items-center justify-center rounded-lg sm:size-16">
      <img
        v-if="trophy?.image_url"
        :src="trophy.image_url"
        :alt="trophy.title"
        class="h-full w-full rounded-lg object-cover" />
      <div
        v-else
        class="text-muted-foreground flex h-full w-full items-center justify-center text-xl font-bold sm:text-2xl"
        :class="`text-trophy-${trophy.type}`">
        {{ trophy?.type?.[0]?.toUpperCase() }}
      </div>
    </div>
    <div class="min-w-0 flex-1">
      <div class="flex items-start gap-2">
        <TrophyIcon class="mt-0.5 size-4 shrink-0" :class="`text-trophy-${trophy.type}`" />
        <h3
          class="text-foreground line-clamp-2 text-sm leading-tight font-semibold wrap-break-word"
          :class="{ 'text-muted-foreground': !trophy.earned }">
          {{ trophy.title || "Hidden Trophy" }}
        </h3>
      </div>
      <p
        v-if="trophy.description"
        class="text-muted-foreground mt-1 line-clamp-3 text-xs leading-relaxed wrap-break-word sm:line-clamp-2"
        :class="{ 'opacity-60': !trophy.earned }">
        {{ trophy.description }}
      </p>
      <div class="text-xxs mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 sm:mt-0.5">
        <span v-if="trophy.earned" class="text-muted-foreground">
          {{ new Date(trophy?.earned_at ?? "").toLocaleString() }}
        </span>
        <span v-else class="text-muted-foreground uppercase">Unearned</span>
        <div v-if="trophy.rarity_label" class="flex items-center gap-1.5">
          <span class="font-medium tracking-wide uppercase">
            {{ trophy.rarity_label }}
          </span>
          <span v-if="trophy.earned_rate !== undefined" class="text-muted-foreground">
            {{ trophy.earned_rate.toFixed(1) }}%
          </span>
        </div>
      </div>
    </div>
  </Label>
</template>

<script setup lang="ts">
import type { Trophy } from "@/models/trophy";
import { Checkbox } from "@/ui/checkbox";
import { Label } from "@/ui/label";
import { TrophyIcon } from "lucide-vue-next";

interface Props {
  trophy: Trophy | undefined;
}

defineProps<Props>();
</script>

<template>
  <Label
    v-if="trophy"
    :for="`trophy-${trophy.id}`"
    class="flex cursor-pointer items-center gap-3 rounded-lg pt-3 has-aria-checked:opacity-50">
    <Checkbox
      :id="`trophy-${trophy.id}`"
      class="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
    <div class="bg-card/50 flex h-16 w-16 shrink-0 items-center justify-center rounded-lg">
      <img
        v-if="trophy?.image_url"
        :src="trophy.image_url"
        :alt="trophy.title"
        class="h-full w-full rounded-lg object-cover" />
      <div
        v-else
        class="text-muted-foreground flex h-full w-full items-center justify-center text-2xl font-bold"
        :class="`text-trophy-${trophy.type}`">
        {{ trophy?.type?.[0]?.toUpperCase() }}
      </div>
    </div>
    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-2">
        <TrophyIcon class="size-4" :class="`text-trophy-${trophy.type}`" />
        <h3
          class="text-foreground line-clamp-2 text-sm leading-tight font-semibold"
          :class="{ 'text-muted-foreground': !trophy.earned }">
          {{ trophy.title || "Hidden Trophy" }}
        </h3>
      </div>
      <p
        v-if="trophy.description"
        class="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed"
        :class="{ 'opacity-60': !trophy.earned }">
        {{ trophy.description }}
      </p>
      <div class="mt-0.5 flex items-center gap-4">
        <div v-if="trophy.earned && trophy.earned_at" class="text-muted-foreground text-xxs">
          {{ new Date(trophy.earned_at).toLocaleString() }}
        </div>
        <div v-if="trophy.rarity_label" class="flex items-center gap-1.5">
          <span class="text-xxs font-medium tracking-wide uppercase">
            {{ trophy.rarity_label }}
          </span>
          <span v-if="trophy.earned_rate !== undefined" class="text-muted-foreground text-xxs">
            {{ trophy.earned_rate.toFixed(1) }}%
          </span>
        </div>
      </div>
    </div>
  </Label>
</template>

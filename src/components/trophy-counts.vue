<script setup lang="ts">
import type { TrophyCounts } from "@/models/trophy";

interface Props {
  counts: TrophyCounts | undefined;
  earned: TrophyCounts | undefined;
}

defineProps<Props>();
</script>

<template>
  <span v-if="counts?.platinum" class="trophy-dot" data-type="platinum">
    {{ `${earned?.platinum}/${counts?.platinum}` }}
  </span>
  <span v-if="counts?.gold" class="trophy-dot" data-type="gold">
    {{ `${earned?.gold}/${counts?.gold}` }}
  </span>
  <span v-if="counts?.silver" class="trophy-dot" data-type="silver">
    {{ `${earned?.silver}/${counts?.silver}` }}
  </span>
  <span v-if="counts?.bronze" class="trophy-dot" data-type="bronze">
    {{ `${earned?.bronze}/${counts?.bronze}` }}
  </span>
</template>

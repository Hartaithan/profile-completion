<script setup lang="ts">
import type { TrophyCounts } from "@/models/trophy";

interface Props {
  counts: TrophyCounts | undefined;
  earned: TrophyCounts | undefined;
}

defineProps<Props>();
</script>

<template>
  <span v-if="counts?.platinum" :class="['trophy-dot', 'trophy-platinum']" data-type="platinum">{{
    `${earned?.platinum}/${counts?.platinum}`
  }}</span>
  <span v-if="counts?.gold" :class="['trophy-dot', 'trophy-gold']" data-type="gold">{{
    `${earned?.gold}/${counts?.gold}`
  }}</span>
  <span v-if="counts?.silver" :class="['trophy-dot', 'trophy-silver']" data-type="silver">{{
    `${earned?.silver}/${counts?.silver}`
  }}</span>
  <span v-if="counts?.bronze" :class="['trophy-dot', 'trophy-bronze']" data-type="bronze">{{
    `${earned?.bronze}/${counts?.bronze}`
  }}</span>
</template>

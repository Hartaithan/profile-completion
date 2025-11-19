<script setup lang="ts">
import type { TrophyCounts } from "@/models/trophy";

interface Props {
  counts: TrophyCounts | undefined;
  earned: TrophyCounts | undefined;
  total?: boolean;
}

withDefaults(defineProps<Props>(), { total: true });
</script>

<template>
  <span v-if="counts?.platinum" class="trophy-dot" data-type="platinum">
    <template v-if="earned">{{ `${earned?.platinum}/${counts?.platinum}` }}</template>
    <template v-else>{{ counts?.platinum }}</template>
  </span>
  <span v-if="counts?.gold" class="trophy-dot" data-type="gold">
    <template v-if="earned">{{ `${earned?.gold}/${counts?.gold}` }}</template>
    <template v-else>{{ counts?.gold }}</template>
  </span>
  <span v-if="counts?.silver" class="trophy-dot" data-type="silver">
    <template v-if="earned">{{ `${earned?.silver}/${counts?.silver}` }}</template>
    <template v-else>{{ counts?.silver }}</template>
  </span>
  <span v-if="counts?.bronze" class="trophy-dot" data-type="bronze">
    <template v-if="earned">{{ `${earned?.bronze}/${counts?.bronze}` }}</template>
    <template v-else>{{ counts?.bronze }}</template>
  </span>
  <span v-if="total && counts?.total" class="trophy-dot" data-type="total">
    <template v-if="earned">{{ `${earned?.total}/${counts?.total}` }}</template>
    <template v-else>{{ counts?.total }}</template>
  </span>
</template>

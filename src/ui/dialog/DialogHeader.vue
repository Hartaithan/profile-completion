<script setup lang="ts">
import { cn } from "@/utils/styles";
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div data-slot="dialog-header" :class="cn('flex flex-col gap-1', props.class)">
    <slot />
  </div>
</template>

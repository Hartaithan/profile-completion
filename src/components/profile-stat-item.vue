<script setup lang="ts">
import { formatNumber } from "@/utils/number";
import { cn } from "@/utils/styles";

interface Props {
  label: string;
  value: string | number;
  labelClass?: string;
  valueClass?: string;
}

defineProps<Props>();
</script>

<template>
  <div class="flex flex-col">
    <span :class="cn('text-muted-foreground text-xxs font-bold uppercase', labelClass)">
      {{ label }}
    </span>
    <span v-if="typeof value === 'number'" :class="cn('text-sm font-semibold', valueClass)">
      {{ formatNumber(value) }}
    </span>
    <span v-else :class="cn('text-sm font-semibold', valueClass)">
      {{ value }}
    </span>
  </div>
</template>

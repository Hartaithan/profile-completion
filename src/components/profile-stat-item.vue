<script setup lang="ts">
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
    <span :class="cn('text-muted-foreground text-xs font-bold uppercase', labelClass)">
      {{ label }}
    </span>
    <span :class="cn('text-sm font-semibold', valueClass)">
      {{ value }}
    </span>
  </div>
</template>

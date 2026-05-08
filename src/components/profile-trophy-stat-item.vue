<script setup lang="ts">
import { formatNumber } from "@/utils/number";
import { cn } from "@/utils/styles";
import type { Component } from "vue";

interface Props {
  label: string;
  value: number | undefined;
  containerClass?: string;
  labelClass?: string;
  valueClass?: string;
  iconClass?: string;
  icon?: Component;
}

defineProps<Props>();
</script>

<template>
  <div
    :class="
      cn(
        'bg-card border-border/50 flex h-16 items-center justify-center rounded-lg border px-2 sm:h-20',
        containerClass,
      )
    ">
    <component
      :is="icon"
      v-if="icon"
      :class="cn('text-foreground/90 size-6 shrink-0 sm:size-8', iconClass)" />
    <div class="ml-2 flex flex-col sm:ml-3">
      <span
        :class="
          cn(
            'text-xl font-black sm:text-2xl',
            value && value > 999 && 'text-lg sm:text-xl',
            value && value > 99999 && 'text-sm sm:text-base',
            valueClass,
          )
        ">
        {{ value ? formatNumber(value) : "-" }}
      </span>
      <span
        :class="cn('text-muted-foreground text-xxs font-bold uppercase sm:text-xs', labelClass)">
        {{ label }}
      </span>
    </div>
  </div>
</template>

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
        'bg-card border-border/50 flex h-auto items-center justify-center rounded-lg border p-1 sm:h-18 lg:h-20',
        containerClass,
      )
    ">
    <component
      :is="icon"
      v-if="icon"
      :class="cn('text-foreground/90 size-5 shrink-0 sm:size-8', iconClass)" />
    <div class="ml-2 flex items-center gap-x-3 sm:ml-3 sm:flex-col sm:items-start">
      <span
        :class="
          cn(
            'text-lg font-black sm:text-2xl',
            value && value > 999 && 'text-base sm:text-xl',
            value && value > 99999 && 'text-xs sm:text-base',
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

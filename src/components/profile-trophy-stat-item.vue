<script setup lang="ts">
import { cn } from "@/utils/styles";
import type { Component } from "vue";

interface Props {
  label: string;
  value: number | undefined;
  labelClass?: string;
  valueClass?: string;
  iconClass?: string;
  icon?: Component;
}

defineProps<Props>();
</script>

<template>
  <div class="bg-card border-border/50 flex h-20 items-center justify-center rounded-lg border">
    <component :is="icon" v-if="icon" :class="cn('text-foreground/90 size-8', iconClass)" />
    <div class="ml-3 flex flex-col">
      <span
        :class="
          cn(
            'text-2xl font-black',
            value && value > 999 && 'text-xl',
            value && value > 99999 && 'text-base',
            valueClass,
          )
        ">
        {{ value ?? "-" }}
      </span>
      <span :class="cn('text-muted-foreground text-xs font-bold uppercase', labelClass)">
        {{ label }}
      </span>
    </div>
  </div>
</template>

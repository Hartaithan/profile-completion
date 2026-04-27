<script setup lang="ts">
import type { Component } from "vue";

interface Props {
  label: string;
  value: string | number | undefined;
  labelClass?: string;
  valueClass?: string;
  iconClass?: string;
  icon?: Component;
}

defineProps<Props>();
</script>

<template>
  <div class="bg-card border-border/50 flex h-20 items-center justify-center rounded-lg border">
    <component :is="icon" v-if="icon" :class="['text-foreground/90 size-8', iconClass]" />
    <div class="ml-3 flex flex-col">
      <span :class="['text-2xl font-black', valueClass]">
        {{ value ?? "-" }}
      </span>
      <span :class="['text-muted-foreground text-xs font-bold uppercase', labelClass]">
        {{ label }}
      </span>
    </div>
  </div>
</template>

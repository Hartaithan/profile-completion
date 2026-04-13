<script setup lang="ts">
interface Props {
  label: string;
  value: string | number | undefined;
  labelClass?: string;
  valueClass?: string;
}

defineProps<Props>();
</script>

<template>
  <div
    class="bg-card/50 border-border/50 flex h-24 flex-col items-center justify-center rounded-lg border p-2">
    <slot />
    <span :class="['mt-1 text-lg font-black', valueClass]">
      {{ value ?? "-" }}
    </span>
    <span :class="['text-muted-foreground text-xs font-bold uppercase', labelClass]">
      {{ label }}
    </span>
  </div>
</template>

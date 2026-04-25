<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
import { computed, type Component } from "vue";

const props = defineProps<{
  title: string;
  icon: Component;
  active: boolean;
  completed: boolean;
}>();

const step = computed(() => {
  if (props.completed) return "done";
  if (props.active) return "active";
  return "waiting";
});
</script>

<template>
  <div
    class="flex items-center gap-4 transition-opacity duration-500"
    :class="{ 'opacity-30 grayscale': step === 'waiting' }">
    <div
      class="flex size-8 shrink-0 items-center justify-center rounded border transition-all duration-300"
      :class="{
        'border-primary/50 bg-primary/10': step === 'done',
        'border-primary': step === 'active',
        'border-border': step === 'waiting',
      }">
      <Loader2 v-if="step === 'active'" class="text-primary animate-spin-slow size-4" />
      <component
        v-else
        :is="icon"
        class="size-4 transition-colors"
        :class="{ 'text-primary': step === 'done', 'text-muted-foreground': step === 'waiting' }" />
    </div>
    <div class="flex-1">
      <div
        class="flex items-center justify-between font-mono font-bold uppercase"
        :class="{ 'mb-1.5': !!$slots.default }">
        <span class="tracking-wide" :class="step === 'done' ? 'text-primary' : 'text-foreground'">
          {{ title }}
        </span>
        <span
          v-if="$slots.status"
          class="text-muted-foreground text-xxs leading-normal transition-colors duration-300">
          <slot name="status" />
        </span>
      </div>
      <slot />
    </div>
  </div>
</template>

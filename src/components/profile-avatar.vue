<script setup lang="ts">
import { User2 } from "lucide-vue-next";
import { ref, watch } from "vue";

interface Props {
  url: string | undefined;
  name: string | undefined;
}

const props = defineProps<Props>();
const hasError = ref(false);

const onError = () => {
  hasError.value = true;
};

watch(
  () => props.url,
  () => (hasError.value = false),
);
</script>

<template>
  <div
    class="bg-card border-border/50 size-20 shrink-0 overflow-hidden rounded-lg border p-1 sm:size-24">
    <template v-if="!url || hasError">
      <div
        class="bg-muted text-muted-foreground flex h-full w-full items-center justify-center rounded-lg">
        <User2 class="size-10" />
      </div>
    </template>
    <img
      v-else
      class="h-full w-full rounded-lg object-cover"
      :src="url"
      :alt="`${name ?? 'Not Found'}'s avatar`"
      @error="onError" />
  </div>
</template>

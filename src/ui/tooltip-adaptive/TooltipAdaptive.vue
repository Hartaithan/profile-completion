<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";
import { isTouchDevice } from "@/utils/device";
import type { TooltipContentProps, TooltipRootProps, TooltipTriggerProps } from "reka-ui";
import { computed, ref } from "vue";

interface Props extends TooltipRootProps {
  triggerClass?: string;
  triggerProps?: Omit<TooltipTriggerProps, "class">;
  contentClass?: string;
  contentProps?: Omit<TooltipContentProps, "class">;
}

const props = defineProps<Props>();
const open = ref<boolean | undefined>(props.defaultOpen || undefined);

const handleClick = () => {
  if (!isTouchDevice()) return;
  open.value = !open.value;
};

const handleOutside = () => {
  if (!isTouchDevice()) return;
  open.value = false;
};

const rootProps = computed(() => {
  const { triggerProps: _, contentProps: __, ...rest } = props;
  return rest;
});
</script>

<template>
  <Tooltip v-bind="rootProps" :open="open" :disable-closing-trigger="isTouchDevice()">
    <TooltipTrigger v-bind="triggerProps" :class="triggerClass" @click="handleClick">
      <slot name="trigger" />
    </TooltipTrigger>
    <TooltipContent v-bind="contentProps" :class="contentClass" @pointerDownOutside="handleOutside">
      <slot name="content" />
    </TooltipContent>
  </Tooltip>
</template>

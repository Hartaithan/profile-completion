<script setup lang="ts">
import { cn } from "@/utils/styles";
import { Check, ChevronDown, X } from "lucide-vue-next";
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
  TagsInputRoot,
  useFilter,
} from "reka-ui";
import { computed, ref } from "vue";

interface Option {
  label: string;
  value: string;
}

interface Props {
  modelValue?: string[];
  options: Option[];
  placeholder?: string;
  class?: string;
  anchorClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  placeholder: "Select...",
});

const emit = defineEmits<{
  "update:modelValue": [value: string[]];
}>();

const { contains } = useFilter({ sensitivity: "base" });

const open = ref(false);
const query = ref("");

const internalValue = computed(() =>
  props.options.filter((opt) => props.modelValue?.includes(opt.value)),
);

const filteredOptions = computed(() =>
  props.options.filter(
    (option) => contains(option.label, query.value) && !props.modelValue?.includes(option.value),
  ),
);

const handleUpdate = (value: unknown) => {
  emit(
    "update:modelValue",
    (value as Option[]).map((o) => o.value),
  );
  query.value = "";
};
</script>

<template>
  <ComboboxRoot
    :model-value="internalValue"
    :open="open"
    multiple
    ignore-filter
    :class="cn('relative', props.class)"
    @update:model-value="handleUpdate"
    @update:open="open = $event">
    <ComboboxAnchor
      :class="
        cn(
          'border-input bg-input/30 hover:bg-input/50 focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
          'flex min-h-9 w-full items-center justify-between gap-2 rounded-md border px-3 py-1.5 text-sm shadow-xs transition-[color,box-shadow] outline-none',
          anchorClass,
        )
      ">
      <TagsInputRoot
        :model-value="internalValue"
        delimiter=""
        class="flex flex-1 flex-wrap items-center gap-1.5"
        @update:model-value="handleUpdate">
        <TagsInputItem
          v-for="item in internalValue"
          :key="item.value"
          :value="item"
          class="bg-accent text-accent-foreground flex shrink-0 items-center gap-1 rounded-sm px-1.5 py-0.5 text-xs font-medium">
          <TagsInputItemText>{{ item.label }}</TagsInputItemText>
          <TagsInputItemDelete
            class="text-muted-foreground hover:text-foreground flex items-center transition-colors">
            <X class="size-3 text-black" />
          </TagsInputItemDelete>
        </TagsInputItem>
        <ComboboxInput v-model="query" as-child>
          <TagsInputInput
            :placeholder="internalValue.length === 0 ? placeholder : ''"
            class="placeholder:text-muted-foreground min-w-[80px] flex-1 bg-transparent! text-sm outline-none"
            @focus="open = true"
            @keydown.enter.prevent />
        </ComboboxInput>
      </TagsInputRoot>
      <ComboboxTrigger>
        <ChevronDown class="text-muted-foreground size-4 opacity-50" />
      </ComboboxTrigger>
    </ComboboxAnchor>
    <ComboboxContent
      :class="
        cn(
          'bg-popover text-popover-foreground',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
          'absolute top-full left-0 z-50 mt-1 w-full min-w-32 overflow-hidden rounded-md border shadow-md',
        )
      ">
      <ComboboxViewport class="p-1">
        <ComboboxItem
          v-for="option in filteredOptions"
          :key="option.value"
          :value="option"
          :class="
            cn(
              'focus:bg-accent focus:text-accent-foreground',
              'relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none',
              'data-disabled:pointer-events-none data-disabled:opacity-50',
            )
          ">
          <span class="absolute right-2 flex size-3.5 items-center justify-center">
            <ComboboxItemIndicator>
              <Check class="size-4" />
            </ComboboxItemIndicator>
          </span>
          <span>{{ option.label }}</span>
        </ComboboxItem>
        <p
          v-if="filteredOptions.length === 0"
          class="text-muted-foreground py-6 text-center text-sm">
          No options found.
        </p>
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>

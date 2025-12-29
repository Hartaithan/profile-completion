<script setup lang="ts">
import type { TrophyProgressType } from "@/models/trophy";
import { useCompletionStore } from "@/store/completion";
import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { CircleCheckIcon, CircleDashedIcon, TrophyIcon } from "lucide-vue-next";
import type { DropdownMenuContentProps } from "node_modules/reka-ui/dist/index.d.cts";
import { computed } from "vue";

interface Props {
  id: string | undefined;
  index: number;
  type: TrophyProgressType;
  hasPlatinum: boolean;
  hasDLC: boolean;
}

const props = defineProps<Props>();

const store = useCompletionStore();

const position = computed<DropdownMenuContentProps["side"]>(() => {
  const length = store.completion.length;
  if (length === props.index + 1) return "top";
  if (length === props.index + 2) return "top";
  return "bottom";
});
</script>

<template>
  <DropdownMenu v-if="id">
    <DropdownMenuTrigger as-child>
      <Button class="ml-auto" variant="outline" size="icon">
        <CircleCheckIcon class="size-5" v-if="type === 'completed'" />
        <TrophyIcon class="text-trophy-platinum size-5" v-else-if="type === 'platinum'" />
        <CircleDashedIcon class="size-5" v-else />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      class="content"
      align="end"
      prioritize-position
      :side="position"
      :side-offset="position === 'top' ? 12 : undefined">
      <DropdownMenuItem
        v-if="hasPlatinum"
        @click="store.completeItem(id, 'platinum')"
        :disabled="type === 'platinum'">
        Platinum
      </DropdownMenuItem>
      <DropdownMenuItem
        v-if="!hasPlatinum || hasDLC"
        @click="store.completeItem(id, 'complete')"
        :disabled="type === 'completed'">
        100% Completion
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

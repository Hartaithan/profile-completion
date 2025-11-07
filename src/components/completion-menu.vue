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

interface Props {
  index: number;
  type: TrophyProgressType;
}

defineProps<Props>();

const store = useCompletionStore();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button class="ml-auto" variant="outline" size="icon">
        <CircleCheckIcon class="size-5" v-if="type === 'completed'" />
        <TrophyIcon class="text-trophy-platinum size-5" v-else-if="type === 'platinum'" />
        <CircleDashedIcon class="size-5" v-else />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="content" align="end">
      <DropdownMenuItem
        @click="store.completeItem(index, 'platinum')"
        :disabled="type === 'platinum'">
        Platinum
      </DropdownMenuItem>
      <DropdownMenuItem
        @click="store.completeItem(index, 'complete')"
        :disabled="type === 'completed'">
        100% Completion
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

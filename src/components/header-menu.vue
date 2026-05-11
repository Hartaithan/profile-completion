<script setup lang="ts">
import { useCompletionStore } from "@/store/completion";
import { useGoalStore } from "@/store/goal";
import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { capture } from "@/utils/analytics";
import { MenuIcon } from "lucide-vue-next";

const store = useCompletionStore();
const goal = useGoalStore();

const restore = () => {
  store.restore();
  capture("completion-restore");
};

const reset = () => {
  store.reset();
  goal.reset();
  capture("completion-reset");
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button class="ml-auto size-9" variant="outline">
        <MenuIcon />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="content" align="end">
      <DropdownMenuItem @click="restore">Reset to default</DropdownMenuItem>
      <DropdownMenuItem @click="reset">Reset all data</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

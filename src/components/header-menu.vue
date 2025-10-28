<script setup lang="ts">
import { useCompletionStore } from "@/store/completion";
import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { MenuIcon } from "lucide-vue-next";

const store = useCompletionStore();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button class="ml-auto size-(--button-size)" variant="outline">
        <MenuIcon />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="content" align="end">
      <DropdownMenuItem @click="store.restore">Restore initial data</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style>
:root {
  --button-size: calc(var(--spacing) * 9);
  --content-y-offset: calc(var(--spacing) * 1);
}

.content {
  translate: calc(var(--button-size) / 2) var(--content-y-offset);
}
</style>

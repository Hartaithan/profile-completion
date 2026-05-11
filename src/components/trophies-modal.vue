<script setup lang="ts">
import TrophyList from "@/components/trophy-list.vue";
import type { TrophyItem } from "@/models/trophy";
import { useCompletionStore } from "@/store/completion";
import { Button } from "@/ui/button";
import { ButtonGroup } from "@/ui/button-group";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import DialogDescription from "@/ui/dialog/DialogDescription.vue";
import { CheckIcon, SquarePenIcon, XIcon } from "lucide-vue-next";

interface Props {
  id: string | undefined;
  title: string | undefined;
  trophies: TrophyItem[] | undefined;
}

defineProps<Props>();

const store = useCompletionStore();
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button
        class="bg-card/90 size-9 rounded"
        variant="outline"
        size="icon"
        :aria-label="`Open the ${title} trophies modal`">
        <SquarePenIcon class="size-5" />
      </Button>
    </DialogTrigger>
    <DialogContent class="rounded-lg sm:max-w-xl">
      <DialogHeader
        class="border-border/30 flex-row items-center justify-between space-y-0 border-b">
        <DialogTitle class="text-foreground pr-6 text-2xl font-black tracking-tighter uppercase">
          {{ title }} Trophies
        </DialogTitle>
        <DialogDescription class="sr-only">{{ title }} Trophies Modal</DialogDescription>
      </DialogHeader>
      <TrophyList :id="id" :trophies="trophies" />
      <DialogFooter>
        <ButtonGroup class="w-full">
          <Button
            class="flex-1"
            variant="outline"
            @click="store.completeAllTrophies(id)"
            aria-label="Mark all trophies as completed">
            <CheckIcon class="size-4" />
            Mark All
          </Button>
          <Button
            class="flex-1"
            variant="outline"
            @click="store.uncompleteAllTrophies(id)"
            aria-label="Unmark all trophies">
            <XIcon class="size-4" />
            Unmark All
          </Button>
        </ButtonGroup>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

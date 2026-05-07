<script setup lang="ts">
import TrophyList from "@/components/trophy-list.vue";
import type { TrophyItem } from "@/models/trophy";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/ui/dialog";
import DialogDescription from "@/ui/dialog/DialogDescription.vue";
import { SquarePenIcon } from "lucide-vue-next";

interface Props {
  id: string | undefined;
  title: string | undefined;
  trophies: TrophyItem[] | undefined;
}

defineProps<Props>();
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button class="bg-card/90 ml-2 size-9 rounded" variant="outline" size="icon">
        <SquarePenIcon class="size-5" />
      </Button>
    </DialogTrigger>
    <DialogContent class="rounded-lg sm:max-w-xl">
      <DialogHeader
        class="border-border/30 flex-row items-center justify-between space-y-0 border-b">
        <DialogTitle class="text-foreground text-2xl font-black tracking-tighter uppercase">
          {{ title }} Trophies
        </DialogTitle>
        <DialogDescription class="sr-only">{{ title }} Trophies Modal</DialogDescription>
      </DialogHeader>
      <TrophyList :id="id" :trophies="trophies" />
    </DialogContent>
  </Dialog>
</template>

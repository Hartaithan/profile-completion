<script setup lang="ts">
import { useGoalStore } from "@/store/goal";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/ui/dialog";
import DialogDescription from "@/ui/dialog/DialogDescription.vue";
import { Input } from "@/ui/input";
import { Slider } from "@/ui/slider";
import { TrophyIcon } from "lucide-vue-next";

const config = [
  { key: "platinum", color: "text-trophy-platinum" },
  { key: "gold", color: "text-trophy-gold" },
  { key: "silver", color: "text-trophy-silver" },
  { key: "bronze", color: "text-trophy-bronze" },
] as const;

const store = useGoalStore();

store.$subscribe(() => store.persist());
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button
        class="bg-primary text-primary-foreground hover:bg-foreground hover:text-background h-7 w-full rounded-lg px-6 py-2.5 text-xs font-black tracking-widest uppercase shadow-lg transition-all active:scale-95 sm:h-9 sm:px-8 sm:py-3 md:w-auto">
        Edit Target
      </Button>
    </DialogTrigger>
    <DialogContent class="rounded-lg sm:max-w-xl">
      <DialogHeader
        class="border-border/30 flex-row items-center justify-between space-y-0 border-b">
        <DialogTitle
          class="text-foreground text-xl font-black tracking-tighter uppercase sm:text-2xl">
          Completion Goal
        </DialogTitle>
        <DialogDescription class="sr-only">Completion Goal Modal</DialogDescription>
      </DialogHeader>
      <div class="space-y-4 sm:space-y-6">
        <div class="space-y-3 sm:space-y-4">
          <div
            class="flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-0">
            <label
              for="percent"
              class="text-muted-foreground text-xs font-bold tracking-widest uppercase sm:text-sm">
              Completion Target
            </label>
            <div
              class="text-primary flex items-baseline self-end text-3xl font-black tracking-tighter sm:self-auto sm:text-4xl">
              <Input
                id="percent"
                type="number"
                v-model.number="store.percent"
                @input="store.percent = Math.min(100, Math.max(0, store.percent))"
                class="text-primary h-auto w-16 appearance-none border-none bg-transparent p-0 text-right text-3xl font-black tracking-tighter outline-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:w-20 sm:text-4xl md:text-4xl [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
              <span class="text-muted-foreground ml-1 text-base sm:text-lg">%</span>
            </div>
          </div>
          <Slider
            class="w-full pt-1"
            :model-value="[store.percent]"
            @update:model-value="(val) => (store.percent = val?.[0] ?? 0)"
            :max="100"
            :step="1" />
          <div class="text-xxs text-muted-foreground/50 flex justify-between font-mono">
            <span>MIN_VAL: 0</span>
            <span>MAX_VAL: 100</span>
          </div>
        </div>
        <div class="space-y-3 sm:space-y-4">
          <span
            class="text-muted-foreground block text-xs font-bold tracking-widest uppercase sm:text-sm">
            Required Trophy Allocation
          </span>
          <div class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            <div
              v-for="trophy in config"
              :key="trophy.key"
              class="bg-background border-border/40 hover:border-primary rounded border-b-2 p-2.5 transition-colors sm:p-3">
              <div class="mb-2 flex items-center gap-1.5 sm:gap-2">
                <TrophyIcon :class="['size-3.5 min-w-3.5 sm:size-4 sm:min-w-4', trophy.color]" />
                <span :class="['text-xxs font-black tracking-widest uppercase', trophy.color]">
                  {{ trophy.key }}
                </span>
              </div>
              <Input
                type="number"
                v-model.number="store.counts[trophy.key]"
                class="text-foreground h-auto w-full border-none bg-transparent p-0 text-xl font-black focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-2xl" />
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

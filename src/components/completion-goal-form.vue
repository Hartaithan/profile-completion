<script setup lang="ts">
import { useGoalStore } from "@/store/goal";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { ref } from "vue";

const open = ref(false);
const store = useGoalStore();

const openForm = () => {
  open.value = true;
};

const closeForm = () => {
  open.value = false;
};

const toggleForm = () => {
  open.value = !open.value;
};

store.$subscribe(() => store.persist());

defineExpose({
  openForm,
  closeForm,
  toggleForm,
});
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        class="bg-primary text-primary-foreground hover:bg-foreground hover:text-background w-full rounded-lg px-8 py-3 text-xs font-black tracking-[0.2em] uppercase shadow-lg transition-all active:scale-95 md:w-auto">
        Edit Target
      </Button>
    </PopoverTrigger>
    <PopoverContent
      align="end"
      class="mt-3 grid w-full max-w-[90vw] grid-cols-2 gap-x-3 gap-y-4 sm:mt-6 sm:max-w-3xl sm:grid-cols-6">
      <div class="col-span-2 flex flex-col gap-y-3 sm:col-span-2">
        <Label for="goal">Completion goal (%)</Label>
        <Input
          id="goal"
          placeholder="Completion Goal (%)"
          v-model.number="store.percent"
          min="0"
          max="100"
          type="number" />
      </div>
      <div class="flex flex-col gap-y-3">
        <Label for="platinum" class="trophy-dot" data-type="platinum">Platinum</Label>
        <Input id="platinum" placeholder="Platinum" v-model="store.counts.platinum" type="number" />
      </div>
      <div class="flex flex-col gap-y-3">
        <Label for="gold" class="trophy-dot" data-type="gold">Gold</Label>
        <Input id="gold" placeholder="Gold" v-model="store.counts.gold" type="number" />
      </div>
      <div class="flex flex-col gap-y-3">
        <Label for="silver" class="trophy-dot" data-type="silver">Silver</Label>
        <Input id="silver" placeholder="Silver" v-model="store.counts.silver" type="number" />
      </div>
      <div class="flex flex-col gap-y-3">
        <Label for="bronze" class="trophy-dot" data-type="bronze">Bronze</Label>
        <Input id="bronze" placeholder="Bronze" v-model="store.counts.bronze" type="number" />
      </div>
    </PopoverContent>
  </Popover>
</template>

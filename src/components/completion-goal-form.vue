<script setup lang="ts">
import { useGoalStore } from "@/store/goal";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { PencilIcon } from "lucide-vue-next";
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
        class="absolute top-1/2 right-0 -translate-y-1/2 border-none p-0"
        variant="outline"
        size="icon">
        <PencilIcon />
      </Button>
    </PopoverTrigger>
    <PopoverContent align="end" class="container mt-6 flex w-full gap-x-3">
      <div class="grid flex-[3] items-center gap-y-3">
        <Label for="goal">Completion goal (%)</Label>
        <Input
          id="goal"
          placeholder="Completion Goal (%)"
          v-model.number="store.percent"
          min="0"
          max="100"
          type="number" />
      </div>
      <div class="flex flex-[7] items-center gap-x-3">
        <div class="grid items-center gap-y-3">
          <Label for="platinum" class="trophy-dot" data-type="platinum">Platinum</Label>
          <Input
            id="platinum"
            placeholder="Platinum"
            v-model="store.counts.platinum"
            type="number" />
        </div>
        <div class="grid items-center gap-y-3">
          <Label for="gold" class="trophy-dot" data-type="gold">Gold</Label>
          <Input id="gold" placeholder="Gold" v-model="store.counts.gold" type="number" />
        </div>
        <div class="grid items-center gap-y-3">
          <Label for="silver" class="trophy-dot" data-type="silver">Silver</Label>
          <Input id="silver" placeholder="Silver" v-model="store.counts.silver" type="number" />
        </div>
        <div class="grid items-center gap-y-3">
          <Label for="bronze" class="trophy-dot" data-type="bronze">Bronze</Label>
          <Input id="bronze" placeholder="Bronze" v-model="store.counts.bronze" type="number" />
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { useGoalStore } from "@/store/goal";
import { Button } from "@/ui/button";
import { Card, CardContent, CardFooter } from "@/ui/card";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
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
  <Transition>
    <Card v-if="open" class="absolute top-[120%] left-1/2 z-10 w-full -translate-x-1/2 gap-5 py-5">
      <CardContent class="flex gap-x-3 px-4">
        <div class="grid flex-[3] items-center gap-y-3">
          <Label for="goal">Completion goal</Label>
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
            <Label for="goal">Platinum</Label>
            <Input id="goal" placeholder="Platinum" v-model="store.counts.platinum" type="number" />
          </div>
          <div class="grid items-center gap-y-3">
            <Label for="goal">Gold</Label>
            <Input id="goal" placeholder="Gold" v-model="store.counts.gold" type="number" />
          </div>
          <div class="grid items-center gap-y-3">
            <Label for="goal">Silver</Label>
            <Input id="goal" placeholder="Silver" v-model="store.counts.silver" type="number" />
          </div>
          <div class="grid items-center gap-y-3">
            <Label for="goal">Bronze</Label>
            <Input id="goal" placeholder="Bronze" v-model="store.counts.bronze" type="number" />
          </div>
        </div>
      </CardContent>
      <CardFooter class="flex gap-x-3 px-4">
        <Button class="ml-auto px-5" size="sm">Save</Button>
      </CardFooter>
    </Card>
  </Transition>
</template>
